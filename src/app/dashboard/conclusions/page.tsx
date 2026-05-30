import ToolWorkspace, { type ToolConfig } from "@/components/tool-workspace";

export const metadata = {
  title: "Conclusions — LexAI",
};

const config: ToolConfig = {
  id: "conclusions",
  number: "06",
  subtitle: "Conclusions d'avocat",
  title: "Rédigez vos conclusions écrites",
  description:
    "Indiquez la juridiction, votre position, les faits et les moyens. LexAI structure des conclusions déposables avec un dispositif (par ces motifs) cohérent.",
  submitLabel: "Générer les conclusions",
  outputFilename: "conclusions",
  emptyTitle: "Des conclusions prêtes à déposer.",
  emptyDescription:
    "Renseignez le brief à gauche. Les conclusions apparaîtront ici, structurées en faits — discussion — par ces motifs.",
  fields: [
    {
      name: "juridiction",
      label: "Juridiction saisie",
      type: "select",
      required: true,
      placeholder: "Choisir la juridiction",
      options: [
        { value: "Tribunal judiciaire", label: "Tribunal judiciaire" },
        { value: "Tribunal de commerce", label: "Tribunal de commerce" },
        {
          value: "Conseil de prud'hommes",
          label: "Conseil de prud'hommes",
        },
        { value: "Cour d'appel", label: "Cour d'appel" },
        { value: "Tribunal administratif", label: "Tribunal administratif" },
        { value: "Tribunal de police", label: "Tribunal de police" },
        {
          value: "Tribunal correctionnel",
          label: "Tribunal correctionnel",
        },
        { value: "Cour de cassation", label: "Cour de cassation" },
        { value: "Autre", label: "Autre (préciser dans la procédure)" },
      ],
    },
    {
      name: "position",
      label: "Qualité de votre client",
      type: "select",
      required: true,
      placeholder: "Choisir la qualité",
      options: [
        { value: "demandeur", label: "Demandeur" },
        { value: "défendeur", label: "Défendeur" },
        { value: "appelant", label: "Appelant" },
        { value: "intimé", label: "Intimé" },
        { value: "partie civile", label: "Partie civile" },
        { value: "intervenant volontaire", label: "Intervenant volontaire" },
      ],
    },
    {
      name: "client",
      label: "Identité du client (concluant)",
      type: "textarea",
      required: true,
      rows: 3,
      placeholder:
        "Ex. : SOTRAGUI SARL, capital 50 000 000 GNF, siège 12 boulevard du Commerce, Kaloum, Conakry, RCCM/GN-CKY/2024-B-001234, représentée par M. Diallo, gérant, demanderesse",
    },
    {
      name: "adverse",
      label: "Identité de la partie adverse",
      type: "textarea",
      required: true,
      rows: 3,
      placeholder:
        "Ex. : SOCIÉTÉ ACME-GN SA, capital 100 000 000 GNF, siège 12 boulevard de l'Indépendance, Matam, Conakry, RCCM/GN-CKY/2018-B-007890, représentée par Mme Barry, défenderesse",
    },
    {
      name: "procedure",
      label: "Référence dossier / état de la procédure",
      type: "text",
      placeholder:
        "Ex. : RG n° 24/01234, audience du 12 juin 2026, assignation du 10 mars 2026",
    },
    {
      name: "faits",
      label: "Rappel des faits",
      type: "textarea",
      required: true,
      rows: 6,
      placeholder:
        "Exposé chronologique des faits avec dates et pièces (Pièce n° 1 — contrat du …, Pièce n° 2 — facture du …)",
    },
    {
      name: "moyens",
      label: "Moyens juridiques à développer",
      type: "textarea",
      required: true,
      rows: 6,
      placeholder:
        "Ex. : 1) Inexécution contractuelle — articles 234 et suivants de l'Acte Uniforme relatif au Droit Commercial Général. 2) Demande de dommages-intérêts pour préjudice financier et commercial. 3) Subsidiairement, résolution aux torts exclusifs de la défenderesse. 4) Voies d'exécution AU Recouvrement.",
    },
    {
      name: "demandes",
      label: "Prétentions (Par ces motifs)",
      type: "textarea",
      required: true,
      rows: 5,
      placeholder:
        "Ex. : Condamnation au paiement de 28 000 000 GNF au titre du contrat impayé. Astreinte de 500 000 GNF/jour. Subsidiairement, résolution aux torts exclusifs. EN TOUT ÉTAT : frais et dépens, exécution provisoire nonobstant toute voie de recours.",
    },
  ],
};

export default function ConclusionsPage() {
  return <ToolWorkspace config={config} />;
}
