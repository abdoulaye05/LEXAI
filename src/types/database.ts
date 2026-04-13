// Types Database écrits à la main pour LexAI.
// À remplacer plus tard par : pnpm dlx supabase gen types typescript --linked > src/types/database.ts

export type ToolId = "contrat" | "analyse" | "mise-en-demeure" | "clause";
export type GenerationStatus = "streaming" | "done" | "error";
export type UserRole = "solo" | "cabinet_admin" | "cabinet_member";
export type Plan = "solo" | "cabinet" | "enterprise";
export type SubscriptionStatus =
  | "active"
  | "past_due"
  | "canceled"
  | "trialing"
  | "incomplete"
  | "incomplete_expired"
  | "unpaid";

export type Profile = {
  user_id: string;
  full_name: string | null;
  cabinet_name: string | null;
  cabinet_address: string | null;
  cabinet_phone: string | null;
  cabinet_email: string | null;
  cabinet_siret: string | null;
  cabinet_website: string | null;
  cabinet_logo_url: string | null;
  bar_id: string | null;
  role: UserRole;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
};

export type Generation = {
  id: string;
  user_id: string;
  tool: ToolId;
  input_fields: Record<string, unknown>;
  output_md: string | null;
  tokens_in: number;
  tokens_out: number;
  cost_eur: number;
  status: GenerationStatus;
  error_message: string | null;
  created_at: string;
  completed_at: string | null;
};

export type Subscription = {
  user_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  plan: Plan | null;
  status: SubscriptionStatus | null;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
};

export type UsageCredit = {
  user_id: string;
  period_start: string;
  period_end: string;
  count_used: number;
  count_limit: number;
};

// Tarifs mensuels HT en euros — utilisés pour calculer le MRR
export const PLAN_PRICES_EUR: Record<Plan, number> = {
  solo: 199,
  cabinet: 599,
  enterprise: 1500,
};
