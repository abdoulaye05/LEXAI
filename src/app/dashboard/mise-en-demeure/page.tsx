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
        "Ex. : SARL DURAND CONSEIL, 5 avenue de l'Opéra 75001 Paris, représentée par M. Paul Durand",
    },
    {
      name: "destinataire",
      label: "Destinataire",
      type: "textarea",
      required: true,
      rows: 3,
      placeholder:
        "Ex. : SAS ACME, 12 rue de Rivoli 75001 Paris, à l'attention de Mme la Présidente",
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
        "Ex. : le 15 février 2026, une facture de 12 400 € HT a été émise pour des prestations livrées et acceptées sans réserve. À ce jour, aucun paiement n'a été reçu malgré deux relances datées du 1er et du 15 mars…",
    },
    {
      name: "demande",
      label: "Demande précise",
      type: "textarea",
      required: true,
      rows: 4,
      placeholder:
        "Ex. : règlement intégral de la somme de 12 400 € HT, majorée des intérêts au taux légal depuis le 15 mars 2026, ainsi que l'indemnité forfaitaire de 40 € pour frais de recouvrement",
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
