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
    "Décrivez les parties, l'objet et le contexte. LexAI rédige un contrat structuré en articles numérotés, référencé au Code civil.",
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
        "Ex. : SAS ACME, capital 10 000 €, siège 12 rue de Rivoli 75001 Paris, RCS Paris 853 111 222, représentée par M. Dupont, président — et M. Martin, consultant indépendant, n° SIRET…",
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
