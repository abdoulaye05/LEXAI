import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  stripe,
  PLAN_PRICE_IDS,
  isStripeConfigured,
} from "@/lib/stripe";
import type { Plan } from "@/types/database";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VALID_PLANS: Plan[] = ["solo", "cabinet", "enterprise"];

export async function POST(request: NextRequest) {
  // 1. Stripe configuré ?
  if (!isStripeConfigured()) {
    return NextResponse.json(
      {
        error: "stripe_not_configured",
        message:
          "Stripe n'est pas configuré. Renseignez STRIPE_SECRET_KEY et les Price IDs dans .env.local.",
      },
      { status: 503 }
    );
  }

  // 2. Auth check
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // 3. Body validation
  let body: { plan?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const plan = body.plan as Plan | undefined;
  if (!plan || !VALID_PLANS.includes(plan)) {
    return NextResponse.json({ error: "invalid_plan" }, { status: 400 });
  }

  const priceId = PLAN_PRICE_IDS[plan];
  if (!priceId) {
    return NextResponse.json(
      { error: "missing_price_id", plan },
      { status: 500 }
    );
  }

  // 4. Récupère ou crée le customer Stripe
  const { data: existingSub } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .maybeSingle();

  let customerId = existingSub?.stripe_customer_id ?? null;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: {
        supabase_user_id: user.id,
      },
    });
    customerId = customer.id;
  }

  // 5. Crée la session de checkout
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${siteUrl}/dashboard/abonnement?status=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/dashboard/abonnement?status=canceled`,
    allow_promotion_codes: true,
    billing_address_collection: "required",
    locale: "fr",
    subscription_data: {
      metadata: {
        supabase_user_id: user.id,
        plan,
      },
    },
    metadata: {
      supabase_user_id: user.id,
      plan,
    },
  });

  if (!session.url) {
    return NextResponse.json(
      { error: "session_creation_failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ url: session.url });
}
