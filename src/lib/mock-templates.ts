// Templates juridiques mock pour le développement sans clé Anthropic.
// Ces 4 documents sont volontairement sérieux et stylistiquement proches
// de ce que produirait Claude Sonnet 4.5 avec nos system prompts.
// Ils servent uniquement à valider le flow de bout en bout en local.

import type { ToolId } from "./prompts";

export const MOCK_TEMPLATES: Record<ToolId, string> = {
  contrat: `CONTRAT DE PRESTATION DE SERVICES

ENTRE LES SOUSSIGNÉS :

LA SOCIÉTÉ ACME, société par actions simplifiée au capital de 10 000 euros, dont le siège social est situé 12 rue de Rivoli, 75001 Paris, immatriculée au Registre du Commerce et des Sociétés de Paris sous le numéro 853 111 222, représentée par Monsieur Jean Dupont, en sa qualité de Président, dûment habilité aux fins des présentes,

Ci-après dénommée « LE CLIENT »,

D'UNE PART,

ET :

Monsieur Pierre Martin, consultant indépendant, exerçant sous le numéro de SIRET 845 222 333 00012, demeurant 5 avenue de l'Opéra, 75002 Paris,

Ci-après dénommé « LE PRESTATAIRE »,

D'AUTRE PART,

Ci-après dénommés ensemble « les Parties » et individuellement « la Partie ».

IL A ÉTÉ PRÉALABLEMENT EXPOSÉ CE QUI SUIT :

LE CLIENT exerce une activité dans le secteur du commerce électronique et souhaite confier au PRESTATAIRE, qui dispose des compétences techniques requises, une mission de développement informatique pour la refonte de son site marchand.

LE PRESTATAIRE déclare disposer de l'expérience, des qualifications et des moyens nécessaires à l'exécution de la prestation objet des présentes.

C'est dans ces conditions que les Parties se sont rapprochées et ont convenu ce qui suit.

EN CONSÉQUENCE, IL A ÉTÉ CONVENU CE QUI SUIT :

ARTICLE 1 — OBJET

Le présent contrat (ci-après le « Contrat ») a pour objet de définir les conditions dans lesquelles LE PRESTATAIRE s'engage à réaliser, au profit du CLIENT, la refonte complète du site internet e-commerce de ce dernier, telle que décrite en Annexe 1 du Contrat.

ARTICLE 2 — DURÉE ET DATE D'EFFET

Le Contrat prend effet à compter du 1er mai 2026 pour une durée de douze (12) mois calendaires. À l'issue de cette période, il pourra être renouvelé d'un commun accord entre les Parties par avenant écrit.

ARTICLE 3 — OBLIGATIONS DES PARTIES

3.1 — Obligations du PRESTATAIRE

Conformément à l'article 1103 du Code civil, le Contrat tient lieu de loi entre les Parties. LE PRESTATAIRE s'engage à exécuter sa mission selon les règles de l'art, dans le respect des délais convenus et avec le degré de diligence que l'on est en droit d'attendre d'un professionnel de son domaine.

3.2 — Obligations du CLIENT

LE CLIENT s'engage à fournir au PRESTATAIRE l'ensemble des éléments, accès et informations nécessaires à la bonne exécution de la mission, dans des délais raisonnables.

ARTICLE 4 — CONDITIONS FINANCIÈRES

En contrepartie de la prestation objet du Contrat, LE CLIENT versera au PRESTATAIRE un forfait global et forfaitaire de vingt-quatre mille euros hors taxes (24 000 € HT), payable selon l'échéancier suivant :

— Quatre mille euros HT (4 000 € HT) à la signature du Contrat ;
— Quatre mille euros HT (4 000 € HT) le 5 de chaque mois, pendant cinq (5) mois consécutifs, à compter du mois suivant la signature.

Tout retard de paiement entraînera, de plein droit et sans mise en demeure préalable, l'application d'intérêts de retard au taux légal, conformément à l'article 1231-6 du Code civil, ainsi que l'indemnité forfaitaire pour frais de recouvrement de quarante euros (40 €) prévue à l'article L. 441-10 du Code de commerce.

ARTICLE 5 — RESPONSABILITÉ

LE PRESTATAIRE est tenu d'une obligation de moyens dans l'exécution de sa mission. Sa responsabilité ne pourra être engagée qu'en cas de faute prouvée et sera, en tout état de cause, limitée au montant total des sommes effectivement perçues au titre du Contrat.

ARTICLE 6 — CONFIDENTIALITÉ

Chacune des Parties s'engage à conserver strictement confidentielles toutes les informations, données ou documents auxquels elle aura accès dans le cadre du Contrat, et à n'en faire usage que pour les besoins de l'exécution du Contrat. Cette obligation de confidentialité demeurera en vigueur pendant toute la durée du Contrat et pendant cinq (5) années suivant son expiration, pour quelque cause que ce soit.

ARTICLE 7 — FORCE MAJEURE

Aucune des Parties ne pourra être tenue pour responsable de l'inexécution ou du retard dans l'exécution de l'une de ses obligations, si une telle inexécution ou un tel retard est causé par un événement de force majeure, au sens de l'article 1218 du Code civil.

ARTICLE 8 — RÉSILIATION

En cas de manquement grave de l'une des Parties à ses obligations contractuelles, l'autre Partie pourra, après mise en demeure restée sans effet pendant un délai de quinze (15) jours calendaires, résilier le Contrat de plein droit, sans préjudice de tous dommages-intérêts auxquels elle pourrait prétendre.

ARTICLE 9 — DROIT APPLICABLE ET JURIDICTION COMPÉTENTE

Le Contrat est régi par le droit français. Tout litige relatif à sa formation, son interprétation, son exécution ou sa résiliation sera soumis à la compétence exclusive du Tribunal de commerce de Paris, nonobstant pluralité de défendeurs ou appel en garantie.

Fait à Paris, le ____________ 2026, en deux exemplaires originaux, dont un remis à chacune des Parties.

LE CLIENT                                                LE PRESTATAIRE
SAS ACME                                                 Pierre Martin
Représentée par Jean Dupont
`,

  analyse: `# Analyse juridique — Contrat de prestation de services

## Synthèse

Le document soumis est un contrat de prestation de services conclu entre une SAS (cliente) et un consultant indépendant. La structure générale est conforme aux usages mais le texte présente un déséquilibre significatif au détriment du prestataire, ainsi que plusieurs imprécisions susceptibles d'entraîner des contestations ultérieures. Niveau de risque global : **modéré à élevé**.

## Clauses à risque

### 1 — Clause limitative de responsabilité disproportionnée
**Clause concernée :** Article 5, alinéa 2 : « la responsabilité du prestataire est limitée à 10 % du montant du contrat ».
**Risque :** Cette clause est susceptible d'être réputée non écrite sur le fondement de l'article 1170 du Code civil, qui sanctionne les clauses qui privent de leur substance l'obligation essentielle du débiteur. La jurisprudence Chronopost (Com., 22 octobre 1996) est constante en la matière.
**Fondement :** Article 1170 du Code civil ; jurisprudence Chronopost.
**Reformulation proposée :** « La responsabilité du PRESTATAIRE ne pourra être engagée qu'en cas de faute prouvée. Elle sera limitée au montant total des sommes effectivement perçues au titre du présent Contrat, sauf en cas de faute lourde ou dolosive du PRESTATAIRE, auxquels cas aucune limitation ne sera applicable. »

### 2 — Clause de propriété intellectuelle imprécise
**Clause concernée :** Article 7 : « tous les livrables sont la propriété du client ».
**Risque :** Cette formulation, en l'absence de mention expresse des droits cédés, est inopposable au regard de l'article L. 131-3 du Code de la propriété intellectuelle, qui exige que la cession des droits d'auteur fasse l'objet d'une mention distincte dans l'acte, avec délimitation précise du domaine d'exploitation.
**Fondement :** Articles L. 131-2 et L. 131-3 du Code de la propriété intellectuelle.
**Reformulation proposée :** « LE PRESTATAIRE cède au CLIENT, à titre exclusif et pour la durée légale de protection des droits d'auteur, les droits patrimoniaux sur les livrables visés à l'Article 1, à savoir : le droit de reproduction, le droit de représentation, le droit d'adaptation, le droit de traduction et le droit de commercialisation, pour le monde entier et pour tous supports connus ou inconnus à ce jour. Cette cession est consentie en contrepartie du prix forfaitaire prévu à l'Article 4. »

### 3 — Clause de pénalité de retard sans plafond
**Clause concernée :** Article 4, alinéa 3 : « 1 % du montant total par jour de retard ».
**Risque :** En l'absence de plafond, cette clause pénale est susceptible d'être manifestement excessive au sens de l'article 1231-5 du Code civil et le juge dispose d'un pouvoir de modération d'office.
**Fondement :** Article 1231-5 du Code civil.
**Reformulation proposée :** « Tout retard de livraison imputable au PRESTATAIRE entraînera l'application d'une pénalité de 0,5 % du montant total du Contrat par jour ouvré de retard, dans la limite cumulée de 5 % du montant total du Contrat. »

## Points de vigilance complémentaires

— Vérifier que l'objet du contrat est suffisamment précis pour éviter toute contestation ultérieure (Article 1163 du Code civil).
— S'assurer que les mentions obligatoires relatives à la sous-traitance figurent au contrat si le prestataire envisage de recourir à un tiers (loi du 31 décembre 1975).
— Faire signer en parallèle un accord de confidentialité distinct pour les éléments commerciaux sensibles.
— Demander au prestataire la preuve de son assurance responsabilité civile professionnelle.

## Conclusion

**Recommandation : signer après modifications.** Les trois clauses identifiées doivent impérativement être renégociées avant signature pour rétablir un équilibre acceptable et éviter des contestations futures. Une fois ces ajustements effectués, le contrat pourra être signé en l'état.
`,

  "mise-en-demeure": `SARL DURAND CONSEIL
5 avenue de l'Opéra
75001 Paris

                                                            Lettre recommandée avec accusé de réception

                                                            SAS ACME
                                                            12 rue de Rivoli
                                                            75001 Paris
                                                            À l'attention de Madame la Présidente

Paris, le 10 avril 2026

**Objet : MISE EN DEMEURE — Défaut de paiement de la facture n° F-2026-0042**

Madame, Monsieur,

Aux termes d'un contrat de prestation de services en date du 15 janvier 2026, notre société, SARL DURAND CONSEIL, s'est engagée à réaliser pour le compte de votre société une mission de conseil stratégique, laquelle a été intégralement exécutée et livrée le 28 février 2026.

À la suite de cette livraison, notre société vous a adressé, le 1er mars 2026, la facture n° F-2026-0042 d'un montant total de douze mille quatre cents euros hors taxes (12 400 € HT), soit quatorze mille huit cent quatre-vingts euros toutes taxes comprises (14 880 € TTC), payable à trente (30) jours, conformément aux conditions générales de vente acceptées par votre société lors de la conclusion du contrat.

Cette facture est demeurée impayée à son échéance, soit le 31 mars 2026.

Malgré nos relances amiables des 5 et 15 mars 2026, dont copies sont jointes à la présente, aucun paiement ni aucune contestation motivée ne nous est parvenu à ce jour.

Nous vous rappelons qu'en application de l'article 1103 du Code civil, les conventions légalement formées tiennent lieu de loi à ceux qui les ont faites. Le défaut de paiement constitue un manquement caractérisé à vos obligations contractuelles, lequel justifie la mise en œuvre des dispositions des articles 1217 et suivants du Code civil.

**Par la présente, nous vous mettons en demeure, conformément à l'article 1344 du Code civil, de procéder, dans un délai impératif de huit (8) jours calendaires à compter de la réception des présentes, au règlement intégral de la somme suivante :**

— Principal dû : ........................................... 14 880,00 € TTC
— Intérêts au taux légal depuis le 31 mars 2026 (art. 1231-6 du Code civil)
— Indemnité forfaitaire pour frais de recouvrement (art. L. 441-10 du Code de commerce) : ........................ 40,00 €

À défaut de règlement intégral dans le délai imparti, nous serons contraints, à notre plus grand regret, de saisir sans nouvel avis le Tribunal de commerce de Paris compétent, aux fins de voir prononcer votre condamnation au paiement de l'intégralité des sommes dues, augmentées des intérêts moratoires, des frais de recouvrement, ainsi que des dommages et intérêts qui pourraient être justifiés par le préjudice subi du fait de votre retard, sans préjudice de toutes mesures conservatoires qui pourraient s'avérer nécessaires.

Nous vous précisons que la présente lettre vaut mise en demeure au sens de l'article 1344 du Code civil et fait courir, à compter de sa réception, l'ensemble des intérêts et indemnités susvisés.

Espérant néanmoins que vous voudrez bien donner suite à la présente sans qu'il soit besoin d'en arriver à de telles extrémités, nous vous prions d'agréer, Madame, Monsieur, l'expression de nos salutations distinguées.

                                                            Pour la SARL DURAND CONSEIL
                                                            Paul DURAND
                                                            Gérant

Pièces jointes :
— Copie de la facture n° F-2026-0042
— Copie des relances des 5 et 15 mars 2026
— Copie du contrat du 15 janvier 2026
`,

  clause: `# CLAUSE DE NON-CONCURRENCE

## Clause rédigée

**Article — Non-concurrence**

1. À compter de la cessation du présent contrat, quelle qu'en soit la cause, LE SALARIÉ s'interdit, pour une durée de vingt-quatre (24) mois calendaires consécutifs, d'exercer, directement ou indirectement, à titre personnel ou pour le compte d'un tiers, toute activité concurrente de celle exercée par L'EMPLOYEUR.

2. Cette interdiction est limitée géographiquement au territoire de la région Île-de-France, étant précisé que ce périmètre correspond à la zone effective d'activité commerciale de L'EMPLOYEUR à la date de cessation du contrat.

3. L'activité concurrente s'entend de toute activité ayant le même objet ou un objet similaire à celui de L'EMPLOYEUR, à savoir : le conseil en stratégie marketing digital auprès d'une clientèle de PME et d'ETI françaises.

4. En contrepartie de l'engagement de non-concurrence souscrit aux alinéas précédents, L'EMPLOYEUR versera au SALARIÉ, pendant toute la durée d'application de la présente clause, une indemnité mensuelle équivalente à trente pour cent (30 %) de la moyenne mensuelle brute des salaires perçus par LE SALARIÉ au cours des douze (12) derniers mois ayant précédé la cessation du contrat.

5. L'EMPLOYEUR se réserve la faculté de libérer LE SALARIÉ de son engagement de non-concurrence, en tout ou partie, par notification écrite adressée par lettre recommandée avec accusé de réception dans un délai de quinze (15) jours calendaires à compter de la notification de la rupture du contrat. Dans ce cas, l'indemnité prévue à l'alinéa 4 ne sera pas due, ou ne sera due qu'au prorata de la période effective d'application.

6. En cas de violation de la présente clause par LE SALARIÉ, ce dernier sera redevable, à l'égard de L'EMPLOYEUR, du remboursement intégral des sommes perçues au titre de l'indemnité de non-concurrence, sans préjudice de l'action en dommages-intérêts qui pourrait être engagée par L'EMPLOYEUR pour réparation du préjudice subi.

## Justification juridique

La clause de non-concurrence rédigée ci-dessus répond aux conditions cumulatives de validité dégagées par la jurisprudence constante de la Chambre sociale de la Cour de cassation, et notamment par les arrêts dits « Salembier » du 10 juillet 2002 (Cass. soc., n° 99-43.336, 00-45.135 et 00-45.387). Ces conditions sont au nombre de quatre :

1. **Indispensable à la protection des intérêts légitimes de l'employeur** — la clause vise spécifiquement à protéger le savoir-faire et la clientèle développés par L'EMPLOYEUR.
2. **Limitée dans le temps** — la durée de 24 mois est conforme à la jurisprudence pour des fonctions à forte valeur ajoutée.
3. **Limitée dans l'espace** — la limitation à la région Île-de-France correspond au périmètre réel d'activité.
4. **Assortie d'une contrepartie financière** — l'indemnité de 30 % du salaire mensuel brut moyen est conforme aux pratiques jurisprudentielles, qui exigent une contrepartie « non dérisoire ».

La clause respecte également le principe de proportionnalité issu de l'article L. 1121-1 du Code du travail, selon lequel les restrictions apportées aux libertés individuelles du salarié doivent être justifiées par la nature de la tâche à accomplir et proportionnées au but recherché.

## Points d'attention

— **Validité** : la clause doit être expressément acceptée par LE SALARIÉ, par signature ou paraphe spécifique. Une simple mention dans le contrat de travail ne suffit pas si elle n'est pas mise en évidence.

— **Limites** : le montant de l'indemnité (30 %) est un seuil bas. Pour des fonctions de cadre dirigeant ou commerciales, la jurisprudence retient régulièrement des taux compris entre 33 % et 50 %. À ajuster selon le profil du SALARIÉ.

— **Variante recommandée si international** : si LE SALARIÉ exerce des fonctions à dimension internationale, il conviendra d'élargir le périmètre géographique en l'adaptant à l'activité réelle, sous peine de voir la clause requalifiée comme insuffisamment limitée.

— **Variante recommandée pour les VRP** : pour les voyageurs, représentants ou placiers (VRP), des règles spécifiques s'appliquent (articles L. 7311-1 et suivants du Code du travail). La clause devra être adaptée en conséquence.

— **Renonciation** : la faculté de renonciation prévue à l'alinéa 5 doit impérativement être exercée dans un délai bref. À défaut, l'employeur sera tenu au paiement de l'indemnité, même s'il n'a pas l'intention de faire respecter la clause (Cass. soc., 13 juillet 2010, n° 09-41.626).
`,
};

// Estimation grossière des tokens à partir du texte (1 token ≈ 4 caractères en français)
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}
