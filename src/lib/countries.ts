// Pays OHADA supportés par LexAI à ce stade — 14 États sur les 17.
// Comores (KM), Guinée-Bissau (GW) et Guinée équatoriale (GQ) ajoutables
// quand un cabinet de ces pays sera prêt à beta-tester. La contrainte SQL
// `profiles_country_check` devra être élargie en parallèle.
//
// Garde cette liste alignée avec :
//   - supabase/migrations/20260530150000_profile_country.sql (CHECK constraint)
//   - src/types/database.ts (CountryCode type)

export type CountryCode =
  | "GN"
  | "CI"
  | "SN"
  | "CM"
  | "ML"
  | "BF"
  | "BJ"
  | "TG"
  | "NE"
  | "CD"
  | "GA"
  | "CG"
  | "TD"
  | "CF";

export type CountryOption = {
  code: CountryCode;
  /** Nom du pays affiché dans l'UI et injecté dans le system prompt. */
  name: string;
  /** Sigle monétaire local (FCFA UEMOA, FCFA CEMAC, GNF, CDF). */
  currency: string;
  /** Juridiction commerciale principale citée par défaut dans les actes. */
  mainCourt: string;
  /** Ville capitale ou commerciale principale (pour les exemples). */
  capital: string;
};

export const COUNTRY_OPTIONS: readonly CountryOption[] = [
  {
    code: "BJ",
    name: "Bénin",
    currency: "FCFA UEMOA",
    mainCourt: "Tribunal de Commerce de Cotonou",
    capital: "Cotonou",
  },
  {
    code: "BF",
    name: "Burkina Faso",
    currency: "FCFA UEMOA",
    mainCourt: "Tribunal de Commerce de Ouagadougou",
    capital: "Ouagadougou",
  },
  {
    code: "CM",
    name: "Cameroun",
    currency: "FCFA CEMAC",
    mainCourt: "Tribunal de Commerce de Douala",
    capital: "Yaoundé",
  },
  {
    code: "CF",
    name: "Centrafrique",
    currency: "FCFA CEMAC",
    mainCourt: "Tribunal de Commerce de Bangui",
    capital: "Bangui",
  },
  {
    code: "CI",
    name: "Côte d'Ivoire",
    currency: "FCFA UEMOA",
    mainCourt: "Tribunal de Commerce d'Abidjan-Plateau",
    capital: "Abidjan",
  },
  {
    code: "GA",
    name: "Gabon",
    currency: "FCFA CEMAC",
    mainCourt: "Tribunal de Commerce de Libreville",
    capital: "Libreville",
  },
  {
    code: "GN",
    name: "Guinée",
    currency: "GNF",
    mainCourt: "Tribunal de Commerce de Conakry",
    capital: "Conakry",
  },
  {
    code: "ML",
    name: "Mali",
    currency: "FCFA UEMOA",
    mainCourt: "Tribunal de Commerce de Bamako",
    capital: "Bamako",
  },
  {
    code: "NE",
    name: "Niger",
    currency: "FCFA UEMOA",
    mainCourt: "Tribunal de Commerce de Niamey",
    capital: "Niamey",
  },
  {
    code: "CD",
    name: "République Démocratique du Congo",
    currency: "CDF",
    mainCourt: "Tribunal de Commerce de Kinshasa-Gombe",
    capital: "Kinshasa",
  },
  {
    code: "CG",
    name: "République du Congo",
    currency: "FCFA CEMAC",
    mainCourt: "Tribunal de Commerce de Brazzaville",
    capital: "Brazzaville",
  },
  {
    code: "SN",
    name: "Sénégal",
    currency: "FCFA UEMOA",
    mainCourt: "Tribunal de Commerce de Dakar",
    capital: "Dakar",
  },
  {
    code: "TD",
    name: "Tchad",
    currency: "FCFA CEMAC",
    mainCourt: "Tribunal de Commerce de N'Djaména",
    capital: "N'Djaména",
  },
  {
    code: "TG",
    name: "Togo",
    currency: "FCFA UEMOA",
    mainCourt: "Tribunal de Commerce de Lomé",
    capital: "Lomé",
  },
];

const COUNTRY_INDEX = new Map<CountryCode, CountryOption>(
  COUNTRY_OPTIONS.map((c) => [c.code, c])
);

export function getCountryByCode(code: CountryCode | string): CountryOption {
  return COUNTRY_INDEX.get(code as CountryCode) ?? COUNTRY_INDEX.get("GN")!;
}

/**
 * Construit la phrase de contexte cabinet injectée en tête du system prompt
 * envoyé à Claude. Le préfixe contextuel guide le modèle pour adapter la
 * monnaie, le droit national applicable et les juridictions par défaut.
 */
export function buildCountryContext(code: CountryCode | string): string {
  const c = getCountryByCode(code);
  return `CONTEXTE CABINET : ce cabinet est principalement basé en ${c.name}. Sauf indication contraire dans le brief de l'avocat, adapte le droit national applicable au droit ${c.name.startsWith("République") ? "de la " : "du "}${c.name}, la monnaie locale (${c.currency}), et les juridictions compétentes (${c.mainCourt} pour les litiges commerciaux, juridictions de droit commun pour le reste). Reste sous l'empire des Actes Uniformes OHADA pour le droit des affaires harmonisé.`;
}
