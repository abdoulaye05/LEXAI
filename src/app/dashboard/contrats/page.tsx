import ToolWorkspace, { type ToolConfig } from "@/components/tool-workspace";

export const metadata = {
  title: "Contrats — LexAI",
};

const config: ToolConfig = {
  id: "contrat",
  number: "02",
  subtitle: "Génération de contrats",
  title: "Rédigez un contrat complet",
  description:
    "Décrivez les parties, l'objet et le contexte. LexAI rédige un contrat structuré en articles numérotés, conforme aux Actes Uniformes OHADA (AU DCG, AUSCGIE, AU Sûretés).",
  submitLabel: "Générer le contrat",
  outputFilename: "contrat",
  emptyTitle: "Un contrat prêt à être signé.",
  emptyDescription:
    "Renseignez le brief à gauche. Le contrat apparaîtra ici article par article, en temps réel.",
  fields: [
    {
      name: "type",
      label: "Type de contrat",
      type: "select",
      required: true,
      placeholder: "Choisir un type",
      options: [
        { value: "Prestation de services", label: "Prestation de services" },
        { value: "Confidentialité (NDA)", label: "Confidentialité (NDA)" },
        { value: "CDI", label: "Contrat de travail CDI" },
        { value: "CDD", label: "Contrat de travail CDD" },
        { value: "Bail commercial", label: "Bail commercial" },
        { value: "Bail d'habitation", label: "Bail d'habitation" },
        { value: "Cession de parts sociales", label: "Cession de parts sociales" },
        { value: "Partenariat commercial", label: "Partenariat commercial" },
        { value: "Licence de propriété intellectuelle", label: "Licence PI" },
        { value: "Autre", label: "Autre (préciser dans le contexte)" },
      ],
    },
    {
      name: "parties",
      label: "Parties au contrat",
      type: "textarea",
      required: true,
      rows: 4,
      placeholder:
        "Ex. : SOTRAGUI SARL, capital 50 000 000 GNF, siège 12 boulevard du Commerce, Kaloum, Conakry, RCCM/GN-CKY/2024-B-001234, représentée par M. Diallo, gérant — et ABIDJAN TECH SARL, capital 5 000 000 FCFA, siège Plateau Abidjan, RCCM/CI-ABJ/2023-B-005678…",
    },
    {
      name: "objet",
      label: "Objet du contrat",
      type: "textarea",
      required: true,
      rows: 3,
      placeholder:
        "Ex. : prestation de développement web pour la refonte du site e-commerce du client.",
    },
    {
      name: "duree",
      label: "Durée et date d'effet",
      type: "text",
      placeholder: "Ex. : 12 mois à compter du 1er janvier 2026, tacitement reconductible",
    },
    {
      name: "montant",
      label: "Conditions financières",
      type: "textarea",
      rows: 3,
      placeholder:
        "Ex. : forfait global de 24 000 € HT, payable en 4 mensualités de 6 000 € HT, chaque 5 du mois",
    },
    {
      name: "particularites",
      label: "Conditions particulières",
      type: "textarea",
      rows: 4,
      placeholder:
        "Clauses spécifiques à intégrer : confidentialité, non-sollicitation, propriété intellectuelle, pénalités de retard…",
    },
  ],
};

export default function ContratsPage() {
  return <ToolWorkspace config={config} />;
}
