import ToolWorkspace, { type ToolConfig } from "@/components/tool-workspace";

export const metadata = {
  title: "Mise en demeure — LexAI",
};

const config: ToolConfig = {
  id: "mise-en-demeure",
  number: "04",
  subtitle: "Rédaction de mise en demeure",
  title: "Envoyez une mise en demeure",
  description:
    "Indiquez les parties, les faits et la demande. LexAI rédige une lettre recommandée prête à être expédiée, avec fondements juridiques et formules impératives.",
  submitLabel: "Rédiger la mise en demeure",
  outputFilename: "mise-en-demeure",
  emptyTitle: "Une lettre ferme, cadrée, imparable.",
  emptyDescription:
    "La mise en demeure apparaîtra ici — en-tête, rappel des faits, fondement juridique, demande, conséquences, signature.",
  fields: [
    {
      name: "expediteur",
      label: "Expéditeur",
      type: "textarea",
      required: true,
      rows: 3,
      placeholder:
        "Ex. : CABINET DURAND CONSEIL SARL, Immeuble Le Patio, Boulevard du Commerce, Kaloum, Conakry, RCCM/GN-CKY/2020-B-002345, représenté par Me Paul Durand, avocat au Barreau de Guinée",
    },
    {
      name: "destinataire",
      label: "Destinataire",
      type: "textarea",
      required: true,
      rows: 3,
      placeholder:
        "Ex. : SOCIÉTÉ ACME-GN SA, 12 boulevard de l'Indépendance, Matam, Conakry, RCCM/GN-CKY/2018-B-007890, à l'attention de Mme la Présidente du Conseil d'Administration",
    },
    {
      name: "objet",
      label: "Objet du litige",
      type: "text",
      required: true,
      placeholder: "Ex. : défaut de paiement de la facture n° F-2025-0042",
    },
    {
      name: "faits",
      label: "Rappel des faits",
      type: "textarea",
      required: true,
      rows: 6,
      placeholder:
        "Ex. : le 15 février 2026, une facture de 17 700 000 GNF TTC a été émise pour des prestations livrées et acceptées sans réserve. À ce jour, aucun paiement n'a été reçu malgré deux relances datées du 1er et du 15 mars…",
    },
    {
      name: "demande",
      label: "Demande précise",
      type: "textarea",
      required: true,
      rows: 4,
      placeholder:
        "Ex. : règlement intégral de 17 700 000 GNF TTC, majorée des intérêts au taux BCRG + 2 points depuis le 1er mai 2026. À défaut, requête en injonction de payer devant le Tribunal de Commerce de Conakry (AU Recouvrement, articles 1 et suivants).",
    },
    {
      name: "delai",
      label: "Délai accordé",
      type: "text",
      required: true,
      placeholder: "Ex. : 8 jours à compter de la réception de la présente",
    },
  ],
};

export default function MiseEnDemeurePage() {
  return <ToolWorkspace config={config} />;
}
