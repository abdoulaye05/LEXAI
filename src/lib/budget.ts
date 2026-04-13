// Helpers pour le suivi du budget mensuel Anthropic.
// Le budget est défini par l'env ANTHROPIC_MONTHLY_BUDGET_USD et doit
// matcher le "Monthly spend limit" configuré dans la console Anthropic,
// pour que notre alerte et leur alerte soient synchronisées.

const USD_TO_EUR = 0.92;

export function getMonthlyBudgetUsd(): number {
  const raw = process.env.ANTHROPIC_MONTHLY_BUDGET_USD;
  const parsed = raw ? parseFloat(raw) : NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 100;
}

export function getMonthlyBudgetEur(): number {
  return Number((getMonthlyBudgetUsd() * USD_TO_EUR).toFixed(2));
}

export type BudgetLevel = "ok" | "warning" | "critical" | "exceeded";

export function getBudgetLevel(
  spentEur: number,
  budgetEur: number
): BudgetLevel {
  if (budgetEur <= 0) return "ok";
  const pct = (spentEur / budgetEur) * 100;
  if (pct >= 100) return "exceeded";
  if (pct >= 80) return "critical";
  if (pct >= 50) return "warning";
  return "ok";
}
