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
    "Indiquez le type de clause et son contexte d'application. LexAI produit une rédaction conforme au droit OHADA (Actes Uniformes) et au droit national applicable, avec justification juridique et points de vigilance.",
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
        { value: "Arbitrage CCJA", label: "Arbitrage CCJA" },
        { value: "Sûreté (cautionnement / gage / nantissement / hypothèque)", label: "Sûreté OHADA" },
        { value: "Non-concurrence", label: "Non-concurrence" },
        { value: "Non-sollicitation", label: "Non-sollicitation" },
        { value: "Confidentialité", label: "Confidentialité" },
        { value: "Exclusivité", label: "Exclusivité" },
        { value: "Force majeure", label: "Force majeure" },
        { value: "Limitation de responsabilité", label: "Limitation de responsabilité" },
        { value: "Pénalité", label: "Clause pénale" },
        { value: "Résolution", label: "Résolution" },
        { value: "Propriété intellectuelle", label: "Propriété intellectuelle" },
        { value: "Réserve de propriété", label: "Réserve de propriété (AU Sûretés)" },
        { value: "Hardship", label: "Imprévision / hardship" },
        { value: "Cession de parts sociales (AUSCGIE)", label: "Cession de parts OHADA" },
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
        "Ex. : contrat de fourniture entre une SARL guinéenne et un fournisseur ivoirien ; clause destinée à régir le règlement des litiges nés du contrat dans l'espace OHADA.",
    },
    {
      name: "contraintes",
      label: "Contraintes et exigences particulières",
      type: "textarea",
      rows: 4,
      placeholder:
        "Ex. : arbitrage CCJA, siège Abidjan, droit OHADA + droit guinéen subsidiaire, langue française — OU sûreté (cautionnement / gage / nantissement) conforme AU Sûretés — OU clause de non-concurrence, périmètre et contrepartie selon Code du travail national applicable.",
    },
  ],
};

export default function ClausesPage() {
  return <ToolWorkspace config={config} />;
}
