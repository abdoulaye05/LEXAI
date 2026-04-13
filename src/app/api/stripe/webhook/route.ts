import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";
import { stripe, planFromPriceId, PLAN_QUOTAS } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Plan, SubscriptionStatus } from "@/types/database";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Utilise le body brut pour la vérification de signature Stripe
async function readRawBody(request: NextRequest): Promise<string> {
  const buf = await request.arrayBuffer();
  return new TextDecoder().decode(buf);
}

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret || webhookSecret.includes("placeholder")) {
    return NextResponse.json(
      { error: "webhook_not_configured" },
      { status: 503 }
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "missing_signature" }, { status: 400 });
  }

  const body = await readRawBody(request);

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "invalid_signature";
    console.error("[stripe webhook] signature verification failed:", message);
    return NextResponse.json(
      { error: "signature_verification_failed", message },
      { status: 400 }
    );
  }

  const admin = createAdminClient();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        // Ne rien faire — customer.subscription.created/updated gère toute la sync,
        // avec le bon status depuis Stripe. Hardcoder status ici créait une race
        // condition qui écrasait la vraie valeur "active" par un faux "trialing".
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.supabase_user_id;
        if (!userId) {
          console.error(
            "[stripe webhook] subscription event missing supabase_user_id"
          );
          break;
        }

        const priceId = subscription.items.data[0]?.price?.id;
        const plan = planFromPriceId(priceId);
        const customerId =
          typeof subscription.customer === "string"
            ? subscription.customer
            : subscription.customer.id;

        await admin.from("subscriptions").upsert(
          {
            user_id: userId,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscription.id,
            plan,
            status: subscription.status as SubscriptionStatus,
            current_period_start: subscription.items.data[0]?.current_period_start
              ? new Date(
                  subscription.items.data[0].current_period_start * 1000
                ).toISOString()
              : null,
            current_period_end: subscription.items.data[0]?.current_period_end
              ? new Date(
                  subscription.items.data[0].current_period_end * 1000
                ).toISOString()
              : null,
            cancel_at_period_end: subscription.cancel_at_period_end ?? false,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" }
        );

        // Mise à jour du quota du mois en cours selon le plan
        if (plan && subscription.status === "active") {
          const newLimit = PLAN_QUOTAS[plan];
          const today = new Date();
          const periodStart = new Date(
            today.getFullYear(),
            today.getMonth(),
            1
          )
            .toISOString()
            .slice(0, 10);
          const periodEnd = new Date(
            today.getFullYear(),
            today.getMonth() + 1,
            0
          )
            .toISOString()
            .slice(0, 10);

          await admin.from("usage_credits").upsert(
            {
              user_id: userId,
              period_start: periodStart,
              period_end: periodEnd,
              count_limit: newLimit,
            },
            { onConflict: "user_id,period_start" }
          );
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.supabase_user_id;
        if (!userId) break;

        await admin
          .from("subscriptions")
          .update({
            status: "canceled",
            cancel_at_period_end: false,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", userId);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId =
          typeof invoice.customer === "string"
            ? invoice.customer
            : invoice.customer?.id;
        if (!customerId) break;

        await admin
          .from("subscriptions")
          .update({
            status: "past_due",
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_customer_id", customerId);
        break;
      }

      default:
        // Événement non géré — on ne fait rien et on renvoie 200 (Stripe arrête de retry)
        break;
    }
  } catch (err) {
    console.error("[stripe webhook] handler error:", err);
    return NextResponse.json(
      { error: "handler_error", detail: String(err) },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
