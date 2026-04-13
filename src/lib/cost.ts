// Helper de calcul du coût Anthropic en euros.
// Tarifs Claude Sonnet 4.5 publiés début 2026 (à ré-ajuster si tarification évolue) :
//   input  : $3.00 par million de tokens
//   output : $15.00 par million de tokens
//
// Conversion USD → EUR : on retient un taux conservateur de 0.92 EUR / USD.

const PRICE_INPUT_USD_PER_MTOK = 3;
const PRICE_OUTPUT_USD_PER_MTOK = 15;
const USD_TO_EUR = 0.92;

export function computeCostEur(tokensIn: number, tokensOut: number): number {
  const inputUsd = (tokensIn / 1_000_000) * PRICE_INPUT_USD_PER_MTOK;
  const outputUsd = (tokensOut / 1_000_000) * PRICE_OUTPUT_USD_PER_MTOK;
  const totalUsd = inputUsd + outputUsd;
  return Number((totalUsd * USD_TO_EUR).toFixed(6));
}
