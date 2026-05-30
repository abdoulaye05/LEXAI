// Templates juridiques mock pour le développement sans clé Anthropic.
// Ces 5 documents sont volontairement sérieux et stylistiquement proches
// de ce que produirait Claude Sonnet 4.5 avec nos system prompts OHADA.
// Ils servent uniquement à valider le flow de bout en bout en local.
// Pays par défaut : République de Guinée. Espace OHADA.

import type { ToolId } from "./prompts";

export const MOCK_TEMPLATES: Record<ToolId, string> = {
  contrat: `CONTRAT DE PRESTATION DE SERVICES

ENTRE LES SOUSSIGNÉS :

LA SOCIÉTÉ SOTRAGUI SARL, société à responsabilité limitée au capital social de cinquante millions de francs guinéens (50 000 000 GNF), dont le siège social est situé au 12 boulevard du Commerce, Quartier Almamya, Commune de Kaloum, Conakry, République de Guinée, immatriculée au Registre du Commerce et du Crédit Mobilier de Conakry sous le n° RCCM/GN-CKY/2024-B-001234, représentée par Monsieur Mamadou DIALLO, en sa qualité de Gérant, dûment habilité aux fins des présentes,

Ci-après dénommée « LE CLIENT »,

D'UNE PART,

ET :

LA SOCIÉTÉ ABIDJAN TECH SARL, société à responsabilité limitée de droit ivoirien au capital social de cinq millions de francs CFA (5 000 000 FCFA), dont le siège social est situé au 25 boulevard Lagunaire, Plateau, 01 BP 1234 Abidjan 01, République de Côte d'Ivoire, immatriculée au Registre du Commerce et du Crédit Mobilier d'Abidjan sous le n° RCCM/CI-ABJ/2023-B-005678, représentée par Madame Aïcha KONÉ, en sa qualité de Gérante,

Ci-après dénommée « LE PRESTATAIRE »,

D'AUTRE PART,

Ci-après dénommés ensemble « les Parties » et individuellement « la Partie ».

IL A ÉTÉ PRÉALABLEMENT EXPOSÉ CE QUI SUIT :

LE CLIENT exerce une activité dans le secteur de la distribution alimentaire en République de Guinée et souhaite confier au PRESTATAIRE, qui dispose des compétences techniques requises, une mission de mise en place d'un système intégré de gestion de stock.

LE PRESTATAIRE déclare disposer de l'expérience, des qualifications et des moyens humains et matériels nécessaires à l'exécution de la prestation objet des présentes.

C'est dans ces conditions que les Parties se sont rapprochées et ont convenu ce qui suit.

EN CONSÉQUENCE, IL A ÉTÉ CONVENU CE QUI SUIT :

ARTICLE 1 — OBJET

Le présent contrat (ci-après le « Contrat ») a pour objet de définir les conditions dans lesquelles LE PRESTATAIRE s'engage à concevoir, déployer et maintenir, au profit du CLIENT, un système intégré de gestion de stock multi-entrepôts, tel que décrit en Annexe 1 du Contrat (cahier des charges fonctionnel).

ARTICLE 2 — DURÉE ET DATE D'EFFET

Le Contrat prend effet à compter du 1er juin 2026 pour une durée de douze (12) mois calendaires. À l'issue de cette période, il pourra être renouvelé d'un commun accord entre les Parties par avenant écrit.

ARTICLE 3 — OBLIGATIONS DES PARTIES

3.1 — Obligations du PRESTATAIRE

LE PRESTATAIRE s'engage à exécuter sa mission selon les règles de l'art, dans le respect des délais convenus et avec le degré de diligence que l'on est en droit d'attendre d'un professionnel de son domaine. Il est tenu d'une obligation de moyens renforcée s'agissant de la conception et d'une obligation de résultat s'agissant du déploiement.

3.2 — Obligations du CLIENT

LE CLIENT s'engage à fournir au PRESTATAIRE l'ensemble des éléments, accès et informations nécessaires à la bonne exécution de la mission, dans des délais raisonnables.

ARTICLE 4 — CONDITIONS FINANCIÈRES

En contrepartie de la prestation objet du Contrat, LE CLIENT versera au PRESTATAIRE un forfait global et forfaitaire de trente millions de francs CFA (30 000 000 FCFA), payable selon l'échéancier suivant :

— Six millions de francs CFA (6 000 000 FCFA) à la signature du Contrat ;
— Six millions de francs CFA (6 000 000 FCFA) le 5 de chaque mois, pendant quatre (4) mois consécutifs, à compter du mois suivant la signature.

Tout retard de paiement entraînera, de plein droit et après mise en demeure restée infructueuse pendant huit (8) jours calendaires, l'application d'intérêts de retard au taux de la BCEAO majoré de deux (2) points. À défaut de règlement intégral à l'expiration du délai imparti, LE PRESTATAIRE pourra engager la procédure d'injonction de payer prévue aux articles 1 et suivants de l'Acte Uniforme portant Procédures Simplifiées de Recouvrement et Voies d'Exécution.

ARTICLE 5 — RESPONSABILITÉ

LE PRESTATAIRE est tenu d'une obligation de moyens dans la phase de conception. Sa responsabilité civile contractuelle ne pourra être engagée qu'en cas de faute prouvée et sera, en tout état de cause, limitée au montant total des sommes effectivement perçues au titre du Contrat, sauf en cas de faute lourde ou dolosive.

ARTICLE 6 — CONFIDENTIALITÉ

Chacune des Parties s'engage à conserver strictement confidentielles toutes les informations, données ou documents auxquels elle aura accès dans le cadre du Contrat, et à n'en faire usage que pour les besoins de l'exécution du Contrat. Cette obligation de confidentialité demeurera en vigueur pendant toute la durée du Contrat et pendant cinq (5) années suivant son expiration, pour quelque cause que ce soit.

ARTICLE 7 — FORCE MAJEURE

Aucune des Parties ne pourra être tenue pour responsable de l'inexécution ou du retard dans l'exécution de l'une de ses obligations, si une telle inexécution ou un tel retard est causé par un événement de force majeure tel que défini par le Code des obligations civiles et commerciales applicable.

ARTICLE 8 — RÉSILIATION

En cas de manquement grave de l'une des Parties à ses obligations contractuelles, l'autre Partie pourra, après mise en demeure restée sans effet pendant un délai de quinze (15) jours calendaires, résilier le Contrat de plein droit, sans préjudice de tous dommages-intérêts auxquels elle pourrait prétendre.

ARTICLE 9 — DROIT APPLICABLE ET RÈGLEMENT DES LITIGES

Le Contrat est régi par les Actes Uniformes OHADA, en particulier l'Acte Uniforme relatif au Droit Commercial Général, et, à titre subsidiaire, par le droit guinéen pour les questions non régies par les Actes Uniformes.

Tout litige relatif à la formation, l'interprétation, l'exécution ou la résiliation du présent Contrat sera tranché définitivement suivant le Règlement d'arbitrage de la Cour Commune de Justice et d'Arbitrage (CCJA) de l'OHADA, par un arbitre unique nommé conformément audit Règlement. Le siège de l'arbitrage est Abidjan, République de Côte d'Ivoire. La langue de l'arbitrage est le français.

Fait à Conakry, le ____________ 2026, en deux exemplaires originaux, dont un remis à chacune des Parties.

LE CLIENT                                                LE PRESTATAIRE
SOTRAGUI SARL                                            ABIDJAN TECH SARL
Représentée par M. Mamadou DIALLO                        Représentée par Mme Aïcha KONÉ
`,

  analyse: `# Analyse juridique — Statuts de Société à Responsabilité Limitée (SARL OHADA)

## Synthèse

Le document soumis est un projet de statuts d'une SARL constituée en République de Guinée, à régir par l'Acte Uniforme relatif au Droit des Sociétés Commerciales et du GIE (AUSCGIE). La structure générale est globalement conforme à l'AUSCGIE révisé, mais le projet présente plusieurs non-conformités susceptibles d'entraîner un refus d'inscription au Registre du Commerce et du Crédit Mobilier de Conakry, ainsi qu'un déséquilibre entre associés défavorable au minoritaire. Niveau de risque global : **modéré à élevé**.

## Clauses à risque

### 1 — Capital social insuffisant et libération non conforme

**Clause concernée :** Article 6 des statuts : « Le capital social est fixé à un million de francs guinéens (1 000 000 GNF), entièrement libéré à la constitution ».

**Risque :** Le capital minimum requis par l'AUSCGIE pour une SARL est de un million de francs CFA (1 000 000 FCFA), équivalent en monnaie nationale, sauf disposition nationale plus favorable. Le seuil légal guinéen pour les SARL est désormais aligné sur le minimum OHADA. Vérifier la conversion exacte au taux de change applicable à la date de constitution.

**Fondement :** Article 311 de l'AUSCGIE et article 312 sur les modalités de libération.

**Reformulation proposée :** « Le capital social est fixé à dix millions de francs guinéens (10 000 000 GNF), divisé en cent (100) parts sociales d'une valeur nominale de cent mille francs guinéens (100 000 GNF) chacune, intégralement souscrites et libérées de moitié au moment de la constitution, le solde devant être libéré dans un délai de deux ans à compter de l'immatriculation au RCCM. »

### 2 — Clause de gérance contraire à l'ordre public OHADA

**Clause concernée :** Article 14 : « Le gérant est nommé pour une durée indéterminée et ne peut être révoqué qu'à l'unanimité des associés ».

**Risque :** Cette clause est contraire à l'article 326 de l'AUSCGIE qui prévoit que le gérant statutaire peut être révoqué pour justes motifs par décision des associés représentant la majorité du capital social. Une clause exigeant l'unanimité prive les associés de leur droit fondamental de révocation et est susceptible d'être réputée non écrite.

**Fondement :** Articles 325 et 326 de l'AUSCGIE.

**Reformulation proposée :** « Le gérant est nommé par décision des associés représentant la majorité du capital social, pour une durée de quatre (4) années renouvelables. Il peut être révoqué dans les mêmes conditions, à tout moment, pour justes motifs. Toute révocation prononcée sans juste motif peut donner lieu à dommages-intérêts. »

### 3 — Clause d'agrément en cas de cession de parts mal calibrée

**Clause concernée :** Article 18 : « Toute cession de parts sociales à un tiers est subordonnée à l'agrément du gérant ».

**Risque :** L'article 319 de l'AUSCGIE soumet la cession à un tiers à l'agrément des associés représentant au moins les trois quarts du capital social, non au seul gérant. Cette clause est contraire à l'AU et privera la procédure d'agrément de son efficacité.

**Fondement :** Article 319 de l'AUSCGIE.

**Reformulation proposée :** « Toute cession de parts sociales à un tiers étranger à la société est soumise à l'agrément préalable des associés représentant les trois quarts (3/4) au moins du capital social, statuant en Assemblée Générale Extraordinaire. À défaut d'agrément dans un délai de trois (3) mois à compter de la notification du projet de cession, l'agrément est réputé acquis. »

## Points de vigilance complémentaires

— Vérifier que l'extrait RCCM des associés personnes morales est joint au dossier de constitution.
— S'assurer que la déclaration de souscription et de versement est régulièrement établie devant notaire.
— Faire vérifier le bail commercial du siège social (conformité AU DCG Livre VI).
— Demander la déclaration fiscale d'existence auprès des services fiscaux guinéens dans les délais légaux.
— Anticiper l'ouverture du compte bancaire avant immatriculation pour le dépôt des apports en numéraire.

## Conclusion

**Recommandation : signer après modifications.** Les trois clauses identifiées doivent impérativement être renégociées avant signature pour assurer la conformité du projet à l'AUSCGIE et éviter un refus d'inscription au RCCM. Une fois ces ajustements effectués, les statuts pourront être déposés.
`,

  "mise-en-demeure": `CABINET DURAND CONSEIL SARL
Immeuble Le Patio, 4ème étage
Boulevard du Commerce, Quartier Almamya
Commune de Kaloum
Conakry, République de Guinée
RCCM/GN-CKY/2020-B-002345

                                                            Lettre recommandée avec accusé de réception

                                                            SOCIÉTÉ ACME-GN SA
                                                            12 boulevard de l'Indépendance
                                                            Commune de Matam, Conakry
                                                            République de Guinée
                                                            À l'attention de Madame la Présidente du Conseil d'Administration

Conakry, le 18 mai 2026

**Objet : MISE EN DEMEURE — Défaut de paiement de la facture n° F-2026-0042 du 1er mars 2026**

Madame, Monsieur,

Aux termes d'un contrat de prestation de services en date du 15 janvier 2026 (pièce n° 1), notre société, le CABINET DURAND CONSEIL SARL, s'est engagée à réaliser pour le compte de votre société une mission de conseil stratégique en matière de structuration de filiales OHADA, laquelle a été intégralement exécutée et livrée le 28 février 2026.

À la suite de cette livraison, notre société vous a adressé, le 1er mars 2026, la facture n° F-2026-0042 d'un montant total de quinze millions de francs guinéens (15 000 000 GNF) hors taxes, soit dix-sept millions sept cent mille francs guinéens (17 700 000 GNF) toutes taxes comprises, payable à trente (30) jours fin de mois, conformément aux conditions générales de vente acceptées par votre société lors de la conclusion du contrat (pièce n° 2).

Cette facture est demeurée impayée à son échéance, soit le 30 avril 2026.

Malgré nos relances amiables des 5 et 15 mai 2026, dont copies sont jointes à la présente (pièces n° 3 et 4), aucun paiement ni aucune contestation motivée ne nous est parvenu à ce jour.

Nous vous rappelons que la créance objet de la présente est certaine, liquide et exigible au sens des articles 1 et 2 de l'Acte Uniforme portant Procédures Simplifiées de Recouvrement et Voies d'Exécution. Le défaut de paiement constitue un manquement caractérisé à vos obligations contractuelles.

**Par la présente, nous vous mettons en demeure, à titre conservatoire, de procéder, dans un délai impératif de huit (8) jours calendaires à compter de la réception des présentes, au règlement intégral de la somme suivante :**

— Principal dû : ........................................... 17 700 000 GNF TTC
— Intérêts de retard au taux BCRG + 2 points à compter du 1er mai 2026
— Frais de relance amiable : ........................ 250 000 GNF

À défaut de règlement intégral dans le délai imparti, nous serons contraints, sans nouvel avis, de saisir le Président du Tribunal de Commerce de Conakry d'une **requête en injonction de payer** sur le fondement des articles 1 et suivants de l'Acte Uniforme portant Procédures Simplifiées de Recouvrement et Voies d'Exécution.

À l'expiration du délai d'opposition de quinze (15) jours prévu à l'article 10 du même Acte Uniforme, l'ordonnance d'injonction de payer deviendra exécutoire et pourra fonder :

— Une **saisie-attribution** sur l'ensemble de vos comptes bancaires ouverts auprès des établissements financiers de la place, conformément aux articles 153 et suivants de l'Acte Uniforme portant Procédures Simplifiées de Recouvrement et Voies d'Exécution ;
— Une **saisie-vente** sur vos biens meubles corporels, conformément aux articles 91 et suivants du même Acte Uniforme ;
— Une **saisie immobilière** sur vos immeubles le cas échéant.

Vous serez en outre condamnée au paiement des intérêts moratoires, des frais d'huissier, des frais de procédure et des honoraires d'avocat sur le fondement de l'article applicable du Code de procédure civile guinéen.

Nous vous précisons que la présente lettre vaut mise en demeure régulière au sens du droit OHADA et fait courir, à compter de sa réception, l'ensemble des intérêts et indemnités susvisés.

Espérant néanmoins que vous voudrez bien donner suite à la présente sans qu'il soit besoin d'en arriver à de telles extrémités, nous vous prions d'agréer, Madame, Monsieur, l'expression de nos salutations distinguées.

                                                            Pour le CABINET DURAND CONSEIL SARL
                                                            Maître Paul DURAND
                                                            Avocat à la Cour, Barreau de Guinée

Pièces jointes :
— Pièce n° 1 : Copie du contrat de prestation du 15 janvier 2026
— Pièce n° 2 : Copie de la facture n° F-2026-0042 et de ses CGV
— Pièce n° 3 : Lettre de relance amiable du 5 mai 2026
— Pièce n° 4 : Lettre de relance amiable du 15 mai 2026
`,

  clause: `# CLAUSE COMPROMISSOIRE — ARBITRAGE CCJA

## Clause rédigée

**Article — Règlement des litiges**

1. Tout différend, controverse ou réclamation né du présent contrat ou s'y rapportant, et notamment relatif à sa validité, à son interprétation, à son exécution ou à sa résiliation, sera tranché définitivement suivant le Règlement d'arbitrage de la Cour Commune de Justice et d'Arbitrage (CCJA) de l'OHADA, par un (1) arbitre unique nommé conformément audit Règlement.

2. Le siège de l'arbitrage est fixé à Abidjan, République de Côte d'Ivoire. Les audiences pourront se tenir dans tout autre lieu déterminé d'un commun accord entre les parties ou désigné par l'arbitre.

3. La langue de l'arbitrage est le français. L'ensemble des écritures, pièces et débats sera tenu en langue française.

4. L'arbitre statuera en droit, en application de l'Acte Uniforme relatif au Droit de l'Arbitrage et, au fond, des Actes Uniformes OHADA applicables au contrat, complétés à titre subsidiaire par le droit guinéen pour les questions non régies par les Actes Uniformes.

5. Les parties s'engagent expressément à exécuter la sentence arbitrale qui sera rendue dans le respect du principe de la bonne foi. La sentence arbitrale a, dès qu'elle est rendue, l'autorité de la chose jugée relativement à la contestation qu'elle tranche.

6. Les frais d'arbitrage, incluant les honoraires de l'arbitre, les frais administratifs CCJA et les frais d'expertise éventuels, seront supportés à parts égales par les parties pendant l'instance et finalement mis à la charge de la partie succombante selon les termes de la sentence.

## Justification juridique

La clause compromissoire ci-dessus est conforme aux dispositions de l'Acte Uniforme relatif au Droit de l'Arbitrage (AU Arbitrage) et au Règlement d'arbitrage de la Cour Commune de Justice et d'Arbitrage (CCJA). Elle remplit les conditions de validité posées :

1. **Capacité des parties à compromettre** — l'arbitrage est ouvert à toutes les personnes capables de disposer de leurs droits (article 2 de l'AU Arbitrage) ;
2. **Différends arbitrables** — les différends d'ordre patrimonial relatifs au présent contrat commercial entrent dans le champ de l'arbitrabilité OHADA ;
3. **Formalisme** — la clause est rédigée par écrit, ce qui satisfait à l'exigence de l'article 3-1 du Règlement CCJA ;
4. **Siège, langue, droit applicable** — explicitement convenus entre les parties.

L'arbitrage CCJA est particulièrement recommandé pour les contrats commerciaux transnationaux dans l'espace OHADA, en raison :
— De la spécialisation des arbitres CCJA en matière de droit OHADA ;
— De l'exécution facilitée des sentences dans l'ensemble des États membres ;
— Du contrôle de régularité opéré par la CCJA elle-même.

## Points d'attention

— **Validité** : la clause doit figurer expressément dans le contrat, par écrit, et être acceptée par les parties (signature ou paraphe spécifique recommandé). À défaut, elle pourrait être contestée pour vice du consentement.

— **Articulation avec les juridictions étatiques** : la juridiction étatique saisie d'un litige couvert par une clause compromissoire CCJA doit, sur exception soulevée par une partie, se déclarer incompétente et renvoyer les parties à l'arbitrage (article 13 de l'AU Arbitrage). En revanche, les mesures provisoires et conservatoires demeurent de la compétence des juridictions étatiques.

— **Recours** : la sentence arbitrale CCJA n'est pas susceptible d'appel. Seul un recours en contestation de validité peut être introduit devant la CCJA elle-même, sur les motifs limitativement énumérés à l'article 30 du Règlement CCJA (incompétence, irrégularité de la composition, violation des termes du compromis, etc.).

— **Variante recommandée pour les litiges de moindre valeur** : pour les contrats de faible valeur, envisager une clause attributive de juridiction au profit du Tribunal de Commerce de Conakry, l'arbitrage CCJA pouvant s'avérer coûteux pour des montants modestes.

— **Variante recommandée pour les contrats internationaux hors OHADA** : si l'une des parties est domiciliée hors espace OHADA, considérer une clause d'arbitrage CCI (Paris) ou LCIA (Londres), avec droit applicable OHADA + droit national subsidiaire.
`,

  conclusions: `# CONCLUSIONS RÉCAPITULATIVES

**POUR :** La SOTRAGUI SARL, société à responsabilité limitée de droit guinéen au capital social de cinquante millions de francs guinéens (50 000 000 GNF), dont le siège social est situé au 12 boulevard du Commerce, Quartier Almamya, Commune de Kaloum, Conakry, immatriculée au Registre du Commerce et du Crédit Mobilier de Conakry sous le n° RCCM/GN-CKY/2024-B-001234, représentée par Monsieur Mamadou DIALLO, en sa qualité de Gérant — DEMANDERESSE
Ayant pour avocat : Maître Paul DURAND, Avocat à la Cour, Barreau de Guinée, Cabinet sis Immeuble Le Patio, 4ème étage, Boulevard du Commerce, Conakry

**CONTRE :** La SOCIÉTÉ ACME-GN SA, société anonyme de droit guinéen au capital social de cent millions de francs guinéens (100 000 000 GNF), dont le siège social est situé au 12 boulevard de l'Indépendance, Commune de Matam, Conakry, immatriculée au Registre du Commerce et du Crédit Mobilier de Conakry sous le n° RCCM/GN-CKY/2018-B-007890, représentée par Madame Aminata BARRY, en sa qualité de Présidente du Conseil d'Administration — DÉFENDERESSE
Ayant pour avocat : [À PRÉCISER si connu]

**DEVANT :** le Tribunal de Commerce de Conakry, chambre commerciale

**N° du rôle :** TC/CKY/2026/00345
**Audience :** 24 juin 2026

---

## I — RAPPEL DES FAITS ET DE LA PROCÉDURE

1. Aux termes d'un contrat de fourniture en date du 15 janvier 2026 (**Pièce n° 1**), la SOTRAGUI SARL a confié à la SOCIÉTÉ ACME-GN SA la fourniture de marchandises d'une valeur totale de cent millions de francs guinéens (100 000 000 GNF) hors taxes, livrables en cinq (5) tranches mensuelles à compter du 1er février 2026.

2. La concluante a ponctuellement réglé les deux premières tranches de fourniture pour un montant total de quarante millions de francs guinéens (40 000 000 GNF) (**Pièce n° 2** — relevé bancaire BICIGUI).

3. À compter du mois de mars 2026, la SOCIÉTÉ ACME-GN SA a unilatéralement interrompu les livraisons, sans motivation tirée des stipulations contractuelles ni invocation d'un cas de force majeure (**Pièce n° 3** — courrier d'interruption du 5 mars 2026).

4. La concluante a adressé à la SOCIÉTÉ ACME-GN SA, par exploit d'huissier en date du 20 mars 2026 (**Pièce n° 4**), une mise en demeure d'avoir à reprendre l'exécution du contrat dans un délai de quinze (15) jours, demeurée sans effet.

5. Aux termes d'une assignation délivrée le 5 avril 2026 (**Pièce n° 5**), la SOTRAGUI SARL a saisi le Tribunal de Commerce de Conakry aux fins de voir la SOCIÉTÉ ACME-GN SA condamnée à reprendre l'exécution du contrat ou, subsidiairement, à indemniser la concluante du préjudice subi du fait de l'inexécution.

## II — DISCUSSION

### A — Sur l'inexécution caractérisée du contrat par la SOCIÉTÉ ACME-GN SA

Aux termes des articles 234 et suivants de l'Acte Uniforme relatif au Droit Commercial Général, le vendeur dans une vente commerciale est tenu d'une obligation de livraison conforme aux stipulations contractuelles. Le défaut de livraison constitue un manquement caractérisé sanctionné par les articles 281 à 283 du même Acte Uniforme.

En l'espèce, il s'évince des pièces versées au débat (**Pièces n° 1 et 3**) que la SOCIÉTÉ ACME-GN SA s'était engagée à livrer cinq (5) tranches successives de marchandises et qu'elle a unilatéralement interrompu ces livraisons après la deuxième tranche, sans qu'aucun cas de force majeure ne soit invoqué, ni qu'aucun manquement de la concluante ne soit allégué.

L'inexécution est donc caractérisée et imputable à la SOCIÉTÉ ACME-GN SA.

### B — Sur le préjudice subi par la SOTRAGUI SARL

La SOTRAGUI SARL a subi un triple préjudice du fait de cette inexécution :

— **Préjudice financier direct** : la concluante a dû souscrire en urgence un contrat de substitution auprès d'un fournisseur tiers à un prix supérieur, pour un surcoût total de quinze millions de francs guinéens (15 000 000 GNF) (**Pièce n° 6** — contrat de substitution et factures).

— **Préjudice commercial** : l'interruption des livraisons a contraint la concluante à reporter ses propres engagements commerciaux envers ses clients, occasionnant une perte de chiffre d'affaires estimée à huit millions de francs guinéens (8 000 000 GNF) (**Pièce n° 7** — attestation du commissaire aux comptes).

— **Préjudice moral d'image** : la défaillance dans les livraisons aux clients de la concluante a porté atteinte à sa réputation commerciale, justifiant une indemnisation forfaitaire de cinq millions de francs guinéens (5 000 000 GNF).

### C — À titre subsidiaire, sur la résolution du contrat aux torts exclusifs de la défenderesse

À supposer que le Tribunal ne ferait pas droit à la demande principale d'exécution forcée, la concluante sollicite, à titre subsidiaire, la résolution du contrat de fourniture aux torts exclusifs de la SOCIÉTÉ ACME-GN SA, avec restitution des sommes versées pour les tranches non livrées correspondant à un montant de vingt millions de francs guinéens (20 000 000 GNF).

## III — PAR CES MOTIFS

Vu les articles 234 et suivants, 281 à 283 de l'Acte Uniforme relatif au Droit Commercial Général,
Vu les articles 1 et suivants de l'Acte Uniforme portant Procédures Simplifiées de Recouvrement et Voies d'Exécution,
Vu les pièces communiquées,

Il est demandé au Tribunal de Commerce de Conakry de :

**À titre principal,**

— **DIRE ET JUGER que** la SOCIÉTÉ ACME-GN SA a manqué à ses obligations contractuelles au titre du contrat de fourniture du 15 janvier 2026 ;

— **CONDAMNER** la SOCIÉTÉ ACME-GN SA à reprendre l'exécution intégrale du contrat de fourniture du 15 janvier 2026 dans un délai de quinze (15) jours à compter de la signification du jugement à intervenir, sous astreinte de cinq cent mille francs guinéens (500 000 GNF) par jour de retard ;

— **CONDAMNER** la SOCIÉTÉ ACME-GN SA à payer à la SOTRAGUI SARL la somme de vingt-huit millions de francs guinéens (28 000 000 GNF) à titre de dommages et intérêts, ventilée comme suit :
  — 15 000 000 GNF au titre du surcoût du contrat de substitution,
  — 8 000 000 GNF au titre de la perte de chiffre d'affaires,
  — 5 000 000 GNF au titre du préjudice moral et d'image ;

**À titre subsidiaire,**

— **PRONONCER** la résolution du contrat de fourniture du 15 janvier 2026 aux torts exclusifs de la SOCIÉTÉ ACME-GN SA ;
— **ORDONNER** la restitution par la SOCIÉTÉ ACME-GN SA à la SOTRAGUI SARL de la somme de vingt millions de francs guinéens (20 000 000 GNF) correspondant aux tranches non livrées ;

**En tout état de cause,**

— **CONDAMNER** la SOCIÉTÉ ACME-GN SA au paiement des frais et dépens de l'instance, en ce compris les frais d'exploit d'huissier ;
— **ORDONNER l'exécution provisoire** de la décision à intervenir nonobstant toute voie de recours.

**SOUS TOUTES RÉSERVES**

Liste des pièces communiquées :
1. Contrat de fourniture du 15 janvier 2026
2. Relevé bancaire BICIGUI attestant les versements des 2 premières tranches
3. Courrier d'interruption unilatérale de la défenderesse du 5 mars 2026
4. Exploit d'huissier portant mise en demeure du 20 mars 2026
5. Assignation devant le Tribunal de Commerce de Conakry du 5 avril 2026
6. Contrat de substitution et factures du fournisseur de remplacement
7. Attestation du commissaire aux comptes de la SOTRAGUI SARL
`,
};

// Estimation grossière des tokens à partir du texte (1 token ≈ 4 caractères en français)
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}
