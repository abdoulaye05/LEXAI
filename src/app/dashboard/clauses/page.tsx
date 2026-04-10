import ToolWorkspace, { type ToolConfig } from "@/components/tool-workspace";

export const metadata = {
  title: "Clauses sur mesure — LexAI",
};

const config: ToolConfig = {
  id: "clause",
  number: "05",
  subtitle: "Clauses sur mesure",
  title: "Rédigez une clause calibrée",
  description:
    "Indiquez le type de clause et son contexte d'application. LexAI produit une rédaction conforme au droit français, avec justification juridique et points de vigilance.",
  submitLabel: "Rédiger la clause",
  outputFilename: "clause",
  emptyTitle: "Des clauses taillées pour votre dossier.",
  emptyDescription:
    "La clause apparaîtra ici avec sa justification juridique et ses conditions de validité.",
  fields: [
    {
      name: "clause",
      label: "Type de clause",
      type: "select",
      required: true,
      placeholder: "Choisir une clause",
      options: [
        { value: "Non-concurrence", label: "Non-concurrence" },
        { value: "Non-sollicitation", label: "Non-sollicitation" },
        { value: "Confidentialité", label: "Confidentialité" },
        { value: "Exclusivité", label: "Exclusivité" },
        { value: "Force majeure", label: "Force majeure" },
        { value: "Limitation de responsabilité", label: "Limitation de responsabilité" },
        { value: "Pénalité", label: "Clause pénale" },
        { value: "Résolution", label: "Résolution" },
        { value: "Propriété intellectuelle", label: "Propriété intellectuelle" },
        { value: "Réserve de propriété", label: "Réserve de propriété" },
        { value: "Hardship", label: "Imprévision / hardship" },
        { value: "Autre", label: "Autre (préciser)" },
      ],
    },
    {
      name: "contexte",
      label: "Contexte contractuel",
      type: "textarea",
      required: true,
      rows: 4,
      placeholder:
        "Ex. : contrat de prestation de services B2B entre une agence de marketing et un grand compte ; la clause protège l'agence contre le débauchage de ses salariés.",
    },
    {
      name: "contraintes",
      label: "Contraintes et exigences particulières",
      type: "textarea",
      rows: 4,
      placeholder:
        "Ex. : durée de 24 mois post-contractuels, périmètre : Île-de-France, contrepartie financière si applicable, sanctions en cas de violation…",
    },
  ],
};

export default function ClausesPage() {
  return <ToolWorkspace config={config} />;
}
