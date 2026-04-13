// Bibliothèque de templates pré-remplis pour gagner du temps aux avocats.
// Chaque template est une configuration prête à l'emploi pour un cas d'usage
// fréquent (NDA salarié, CDI cadre, mise en demeure facture impayée, etc.).
// L'avocat clique sur un template → les champs du formulaire sont pré-remplis →
// il ajuste et génère. Feature self-service, zéro intervention.

import type { ToolId } from "./prompts";

export type FormTemplate = {
  id: string;
  toolId: ToolId;
  title: string;
  description: string;
  category: string;
  values: Record<string, string>;
};

export const FORM_TEMPLATES: FormTemplate[] = [
  // ═══════════════════════════ CONTRATS ═══════════════════════════
  {
    id: "contrat-prestation-b2b",
    toolId: "contrat",
    title: "Prestation de services B2B",
    description:
      "Contrat cadre entre une société et un prestataire indépendant pour une mission récurrente.",
    category: "Contrats commerciaux",
    values: {
      type: "Prestation de services",
      parties:
        "La société [RAISON SOCIALE], [forme juridique] au capital de [MONTANT] €, dont le siège social est situé [ADRESSE], immatriculée au RCS de [VILLE] sous le n° [SIREN], représentée par [NOM, QUALITÉ] — et [NOM DU PRESTATAIRE], [forme juridique / travailleur indépendant], SIRET [NUMÉRO], demeurant [ADRESSE].",
      objet:
        "Mission de [DESCRIPTION PRÉCISE DE LA PRESTATION] pour le compte du CLIENT, selon le cahier des charges annexé au présent contrat.",
      duree:
        "12 mois à compter de la signature, renouvelable par tacite reconduction sauf dénonciation 30 jours avant l'échéance.",
      montant:
        "Forfait mensuel de [MONTANT] € HT, facturé le 1er de chaque mois, payable à 30 jours date de facture.",
      particularites:
        "Clause de confidentialité renforcée. Non-sollicitation des clients et salariés pendant 24 mois post-contrat. Cession des droits de propriété intellectuelle sur les livrables.",
    },
  },
  {
    id: "contrat-nda-bilateral",
    toolId: "contrat",
    title: "NDA bilatéral",
    description:
      "Accord de confidentialité mutuel entre deux parties avant négociation commerciale.",
    category: "Confidentialité",
    values: {
      type: "Confidentialité (NDA)",
      parties:
        "[PARTIE 1 : raison sociale, SIREN, représentant] — et [PARTIE 2 : raison sociale, SIREN, représentant].",
      objet:
        "Encadrer les échanges d'informations confidentielles dans le cadre de la négociation d'un partenariat commercial portant sur [OBJET DE LA NÉGOCIATION].",
      duree:
        "3 ans à compter de la signature pour la durée de l'engagement, 5 ans pour la confidentialité des informations échangées.",
      montant: "",
      particularites:
        "Confidentialité bilatérale. Liste limitative des personnes autorisées à recevoir l'information. Restitution ou destruction des supports à la fin.",
    },
  },
  {
    id: "contrat-cdi-cadre",
    toolId: "contrat",
    title: "CDI cadre au forfait jours",
    description:
      "Contrat de travail à durée indéterminée pour un cadre autonome, forfait 218 jours.",
    category: "Droit du travail",
    values: {
      type: "CDI",
      parties:
        "La société [EMPLOYEUR : raison sociale, SIREN, adresse, représentant] — et [NOM DU SALARIÉ], demeurant [ADRESSE], né(e) le [DATE] à [LIEU], n° sécurité sociale [NUMÉRO].",
      objet:
        "Engagement en qualité de [FONCTION, NIVEAU, COEFFICIENT], statut cadre autonome au forfait annuel de 218 jours travaillés, rattachement hiérarchique à [SUPÉRIEUR].",
      duree:
        "Contrat à durée indéterminée à compter du [DATE D'EMBAUCHE], précédé d'une période d'essai de 4 mois renouvelable une fois.",
      montant:
        "Rémunération annuelle brute : [MONTANT] € versée sur 12 mois. Prime d'objectifs : jusqu'à [MONTANT] € selon atteinte des objectifs fixés annuellement.",
      particularites:
        "Forfait 218 jours. Clause de non-concurrence de 12 mois sur l'Île-de-France avec contrepartie de 30 % du salaire moyen. Clause de dédit-formation pour les formations > 5 000 €.",
    },
  },
  {
    id: "contrat-bail-commercial",
    toolId: "contrat",
    title: "Bail commercial 3-6-9",
    description:
      "Bail commercial classique d'une durée de 9 ans avec faculté de résiliation triennale.",
    category: "Immobilier",
    values: {
      type: "Bail commercial",
      parties:
        "Le BAILLEUR [nom, adresse, qualité : propriétaire] — et le PRENEUR [raison sociale, SIREN, adresse du siège, représentant].",
      objet:
        "Location d'un local commercial d'une surface de [XX] m² situé [ADRESSE COMPLÈTE], destiné exclusivement à l'activité de [ACTIVITÉ].",
      duree:
        "9 ans à compter du [DATE D'EFFET], avec faculté pour le preneur de résilier à l'expiration de chaque période triennale moyennant un préavis de 6 mois.",
      montant:
        "Loyer annuel : [MONTANT] € HT, payable trimestriellement d'avance, indexé selon l'ILC (Indice des Loyers Commerciaux). Dépôt de garantie : 3 mois de loyer.",
      particularites:
        "Répartition des charges conforme à l'article R. 145-35 du Code de commerce. Destination exclusive : [ACTIVITÉ]. Cession autorisée uniquement au successeur dans le fonds de commerce.",
    },
  },

  // ═══════════════════════════ MISES EN DEMEURE ═══════════════════════════
  {
    id: "med-facture-impayee",
    toolId: "mise-en-demeure",
    title: "Facture impayée B2B",
    description:
      "Mise en demeure classique pour défaut de paiement d'une facture entre professionnels, avec intérêts et forfait de recouvrement.",
    category: "Recouvrement",
    values: {
      expediteur:
        "[VOTRE SOCIÉTÉ : raison sociale, adresse, SIREN], représentée par [NOM, QUALITÉ].",
      destinataire:
        "[DÉBITEUR : raison sociale, adresse, SIREN], à l'attention de [NOM, QUALITÉ].",
      objet: "Défaut de paiement de la facture n° [NUMÉRO] du [DATE]",
      faits:
        "Une facture n° [NUMÉRO] d'un montant de [MONTANT] € TTC a été émise le [DATE] pour des prestations livrées et acceptées sans réserve le [DATE DE LIVRAISON]. Malgré deux relances amiables des [DATE] et [DATE], aucun paiement ni contestation motivée ne nous est parvenu.",
      demande:
        "Règlement intégral de la somme de [MONTANT] € TTC, majorée des intérêts au taux légal depuis le [DATE D'EXIGIBILITÉ] en application de l'article 1231-6 du Code civil, ainsi que de l'indemnité forfaitaire pour frais de recouvrement de 40 € prévue à l'article L. 441-10 du Code de commerce.",
      delai: "8 jours calendaires à compter de la réception de la présente",
    },
  },
  {
    id: "med-malfacons-travaux",
    toolId: "mise-en-demeure",
    title: "Malfaçons travaux",
    description:
      "Mise en demeure adressée à un entrepreneur pour réparation de malfaçons constatées à réception.",
    category: "Construction",
    values: {
      expediteur:
        "[CLIENT : nom, prénom, adresse], représenté par son conseil [NOM DU CABINET].",
      destinataire:
        "[ENTREPRENEUR : raison sociale, SIREN, adresse], représenté par [NOM].",
      objet:
        "Réparation des malfaçons constatées sur le chantier [ADRESSE DU CHANTIER]",
      faits:
        "Aux termes d'un devis accepté le [DATE], vous avez réalisé des travaux de [NATURE DES TRAVAUX] sur la propriété située [ADRESSE]. La réception des travaux a eu lieu le [DATE] avec réserves portant sur [DESCRIPTION PRÉCISE DES MALFAÇONS]. Ces désordres n'ont toujours pas été repris malgré deux relances.",
      demande:
        "Reprise à vos frais exclusifs des malfaçons énumérées, dans les règles de l'art et conformément aux DTU applicables. À défaut, nous nous réservons le droit de faire réaliser les travaux par un tiers à vos frais, et de saisir le tribunal compétent sur le fondement des articles 1792 et 1147 du Code civil.",
      delai:
        "30 jours calendaires à compter de la réception de la présente pour débuter les travaux de reprise",
    },
  },
  {
    id: "med-restitution-caution",
    toolId: "mise-en-demeure",
    title: "Restitution dépôt de garantie",
    description:
      "Mise en demeure adressée au bailleur pour restitution du dépôt de garantie après départ du locataire.",
    category: "Immobilier",
    values: {
      expediteur:
        "[LOCATAIRE : nom, prénom, adresse actuelle].",
      destinataire:
        "[BAILLEUR : nom, prénom ou raison sociale, adresse].",
      objet:
        "Restitution du dépôt de garantie — logement sis [ADRESSE DU LOGEMENT LIBÉRÉ]",
      faits:
        "Je suis locataire du logement situé [ADRESSE] depuis le [DATE D'ENTRÉE], en vertu d'un bail d'habitation du [DATE]. J'ai libéré ce logement le [DATE DE SORTIE] et l'état des lieux de sortie a été établi contradictoirement le même jour sans réserve majeure. Le dépôt de garantie de [MONTANT] € devait m'être restitué dans le délai de 2 mois prévu à l'article 22 de la loi du 6 juillet 1989, soit au plus tard le [DATE LIMITE]. À ce jour, aucune restitution ni aucune retenue motivée ne m'a été notifiée.",
      demande:
        "Restitution intégrale du dépôt de garantie de [MONTANT] €, majorée des intérêts de retard prévus à l'article 22 alinéa 7 de la loi du 6 juillet 1989, soit une majoration de 10 % du loyer mensuel hors charges par mois de retard entamé.",
      delai: "15 jours calendaires à compter de la réception de la présente",
    },
  },

  // ═══════════════════════════ CLAUSES ═══════════════════════════
  {
    id: "clause-non-concurrence-salarie",
    toolId: "clause",
    title: "Non-concurrence salariée",
    description:
      "Clause de non-concurrence pour un contrat de travail cadre, conforme aux critères Salembier.",
    category: "Droit du travail",
    values: {
      clause: "Non-concurrence",
      contexte:
        "Contrat de travail CDI d'un cadre commercial senior exerçant des fonctions de [DESCRIPTION DES FONCTIONS] dans le secteur du [SECTEUR D'ACTIVITÉ]. L'employeur souhaite protéger sa clientèle et son savoir-faire après la fin du contrat.",
      contraintes:
        "Durée souhaitée : 24 mois. Périmètre géographique : [PÉRIMÈTRE, ex. Île-de-France]. Contrepartie financière : 30 % de la moyenne mensuelle brute des salaires des 12 derniers mois. Faculté de renonciation par l'employeur dans les 15 jours suivant la rupture.",
    },
  },
  {
    id: "clause-confidentialite-prestation",
    toolId: "clause",
    title: "Confidentialité renforcée",
    description:
      "Clause de confidentialité étendue pour un contrat de prestation impliquant des informations commerciales sensibles.",
    category: "Confidentialité",
    values: {
      clause: "Confidentialité",
      contexte:
        "Contrat de prestation entre une startup et un consultant externe ayant accès à la roadmap produit, aux données clients et aux chiffres financiers non publiés.",
      contraintes:
        "Durée : 5 ans après la fin du contrat. Liste limitative des informations couvertes. Restitution ou destruction des supports. Sanctions en cas de violation.",
    },
  },
  {
    id: "clause-penale",
    toolId: "clause",
    title: "Clause pénale contractuelle",
    description:
      "Clause pénale forfaitaire en cas d'inexécution, plafonnée pour éviter la révision judiciaire.",
    category: "Contrats commerciaux",
    values: {
      clause: "Pénalité",
      contexte:
        "Contrat de fourniture de prestations dématérialisées avec engagement de délai strict, où tout retard cause un préjudice significatif pour le client.",
      contraintes:
        "Pénalité : 0,5 % du montant du contrat par jour ouvré de retard. Plafond cumulé : 10 % du montant total. Non-application en cas de force majeure.",
    },
  },
  {
    id: "clause-hardship",
    toolId: "clause",
    title: "Clause d'imprévision (hardship)",
    description:
      "Clause permettant la renégociation en cas de bouleversement imprévu des conditions économiques du contrat.",
    category: "Contrats commerciaux",
    values: {
      clause: "Hardship",
      contexte:
        "Contrat de long terme (5 ans) entre deux grandes entreprises portant sur la fourniture de matières premières dont les prix peuvent varier fortement.",
      contraintes:
        "Déclenchement si bouleversement d'au moins 20 % des coûts. Obligation de négocier de bonne foi pendant 3 mois. Faculté de résiliation sans indemnité si accord impossible. Exclusion des causes imputables à l'une des parties.",
    },
  },

  // ═══════════════════════════ ANALYSES ═══════════════════════════
  {
    id: "analyse-cgv",
    toolId: "analyse",
    title: "CGV / CGU B2C",
    description:
      "Analyse de Conditions Générales de Vente d'un site e-commerce grand public, axe droit de la consommation.",
    category: "Consommation",
    values: {
      nature: "CGV / CGU",
      contexte:
        "Mon client est un consommateur ayant acheté [PRODUIT/SERVICE] sur un site e-commerce. Il souhaite exercer son droit de rétractation mais le site refuse. Analysez si les CGV sont conformes au Code de la consommation et si le refus est fondé.",
      document: "[COLLEZ ICI LE TEXTE INTÉGRAL DES CGV DU SITE]",
    },
  },
  {
    id: "analyse-nda-employeur",
    toolId: "analyse",
    title: "NDA côté employeur",
    description:
      "Analyse d'un NDA que votre client employeur s'apprête à signer avec un prestataire externe.",
    category: "Confidentialité",
    values: {
      nature: "NDA",
      contexte:
        "Mon client est une société qui envisage de signer ce NDA avec un prestataire externe. Je souhaite identifier les points de déséquilibre qui protègent mal mon client, notamment sur la propriété intellectuelle et les recours en cas de violation.",
      document: "[COLLEZ ICI LE TEXTE INTÉGRAL DU NDA PROPOSÉ]",
    },
  },
  {
    id: "analyse-protocole-transactionnel",
    toolId: "analyse",
    title: "Protocole transactionnel",
    description:
      "Analyse d'un protocole transactionnel destiné à clore un litige, vérification de la validité et de la portée.",
    category: "Contentieux",
    values: {
      nature: "Protocole transactionnel",
      contexte:
        "Mon client a négocié un protocole transactionnel pour clore un litige [NATURE DU LITIGE]. Je veux vérifier les conditions de validité (consentement, objet, cause), la portée de la renonciation, les garanties de paiement, et les clauses susceptibles de créer un déséquilibre.",
      document: "[COLLEZ ICI LE TEXTE INTÉGRAL DU PROTOCOLE]",
    },
  },
];

export function getTemplatesForTool(toolId: ToolId): FormTemplate[] {
  return FORM_TEMPLATES.filter((t) => t.toolId === toolId);
}
