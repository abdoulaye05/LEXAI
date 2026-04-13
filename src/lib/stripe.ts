import Stripe from "stripe";
import type { Plan } from "@/types/database";

if (!process.env.STRIPE_SECRET_KEY) {
  // On loggue un warning au boot mais on n'explose pas — utile en dev
  // tant que l'utilisateur n'a pas encore créé son compte Stripe.
  console.warn(
    "[stripe] STRIPE_SECRET_KEY n'est pas défini — les routes /api/stripe/* échoueront tant que la clé n'est pas configurée."
  );
}

export const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY ?? "sk_test_placeholder",
  {
    typescript: true,
    appInfo: {
      name: "LexAI",
      version: "0.1.0",
    },
  }
);

// Mapping plan LexAI → Stripe price ID
// Les Price IDs viennent de l'env (pour pouvoir basculer test ↔ live sans toucher au code)
export const PLAN_PRICE_IDS: Record<Plan, string> = {
  solo: process.env.STRIPE_PRICE_ID_SOLO ?? "",
  cabinet: process.env.STRIPE_PRICE_ID_CABINET ?? "",
  enterprise: process.env.STRIPE_PRICE_ID_ENTERPRISE ?? "",
};

// Mapping inverse Stripe price ID → plan LexAI (utilisé par le webhook)
export function planFromPriceId(priceId: string | null | undefined): Plan | null {
  if (!priceId) return null;
  if (priceId === PLAN_PRICE_IDS.solo) return "solo";
  if (priceId === PLAN_PRICE_IDS.cabinet) return "cabinet";
  if (priceId === PLAN_PRICE_IDS.enterprise) return "enterprise";
  return null;
}

// Quotas mensuels par plan (à appliquer sur usage_credits.count_limit quand un user souscrit)
export const PLAN_QUOTAS: Record<Plan, number> = {
  solo: 50,
  cabinet: 99999, // illimité de fait
  enterprise: 99999,
};

export function isStripeConfigured(): boolean {
  return Boolean(
    process.env.STRIPE_SECRET_KEY &&
      process.env.STRIPE_SECRET_KEY.startsWith("sk_") &&
      PLAN_PRICE_IDS.solo &&
      PLAN_PRICE_IDS.cabinet &&
      PLAN_PRICE_IDS.enterprise
  );
}
