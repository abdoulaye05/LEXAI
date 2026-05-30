import ToolWorkspace, { type ToolConfig } from "@/components/tool-workspace";

export const metadata = {
  title: "Analyse de risques — LexAI",
};

const config: ToolConfig = {
  id: "analyse",
  number: "03",
  subtitle: "Analyse et détection de risques",
  title: "Auditez un document",
  description:
    "Collez le contenu d'un contrat, d'une CGV ou d'un protocole — OU téléversez directement le PDF (scanné ou natif, OCR automatique). LexAI identifie les clauses à risque, les non-conformités au droit OHADA et propose des reformulations.",
  submitLabel: "Lancer l'analyse",
  outputFilename: "analyse",
  emptyTitle: "Une lecture juridique sans angle mort.",
  emptyDescription:
    "L'analyse apparaîtra ici : synthèse, clauses à risque, fondements juridiques, reformulations, conclusion.",
  fields: [
    {
      name: "nature",
      label: "Nature du document",
      type: "select",
      required: true,
      placeholder: "Choisir un type",
      options: [
        { value: "Contrat de prestation", label: "Contrat de prestation" },
        { value: "NDA", label: "Accord de confidentialité" },
        { value: "Contrat de travail", label: "Contrat de travail" },
        { value: "Bail commercial", label: "Bail commercial" },
        { value: "CGV / CGU", label: "CGV / CGU" },
        { value: "Protocole transactionnel", label: "Protocole transactionnel" },
        { value: "Statuts de société", label: "Statuts de société" },
        { value: "Autre", label: "Autre" },
      ],
    },
    {
      name: "contexte",
      label: "Contexte (optionnel)",
      type: "textarea",
      rows: 3,
      placeholder:
        "Ex. : mon client est le prestataire ; il souhaite signer ce contrat avec un grand groupe de la distribution.",
    },
    {
      name: "document",
      label: "Document à analyser",
      type: "document-input",
      required: true,
      rows: 16,
      placeholder:
        "Collez ici le texte intégral du document à analyser, ou basculez sur l'onglet 'Téléverser un PDF' au-dessus pour glisser le fichier directement.",
    },
  ],
};

export default function AnalysePage() {
  return <ToolWorkspace config={config} />;
}
