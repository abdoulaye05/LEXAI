export const metadata = {
  title: "Politique de confidentialité — LexAI",
  description:
    "Politique de protection des données personnelles du service LexAI, conforme au RGPD.",
};

const LAST_UPDATED = "13 avril 2026";

export default function ConfidentialitePage() {
  return (
    <article className="prose-lexai">
      <p className="label">Protection des données</p>
      <h1 className="mt-4 font-serif text-5xl leading-[1.05] tracking-tightest md:text-6xl">
        Politique de confidentialité
        <span className="text-accent">.</span>
      </h1>
      <p className="mt-6 text-sm text-muted">
        Dernière mise à jour : {LAST_UPDATED}
      </p>
      <p className="mt-10 text-lg leading-relaxed">
        La présente politique décrit la façon dont LexAI collecte, utilise et
        protège les données à caractère personnel des Utilisateurs,
        conformément au Règlement (UE) 2016/679 du 27 avril 2016 (&laquo;
        RGPD &raquo;) et à la loi n° 78-17 du 6 janvier 1978 modifiée.
      </p>

      <h2 className="mt-16 font-serif text-3xl leading-tight tracking-tightest">
        1 — Responsable de traitement
      </h2>
      <p className="mt-4">
        Le responsable du traitement des données personnelles collectées sur
        le Service est <strong>LexAI</strong>, éditeur identifié dans les{" "}
        <a
          href="/mentions-legales"
          className="text-ink underline underline-offset-4 hover:text-accent"
        >
          Mentions légales
        </a>
        .
      </p>
      <p className="mt-4">
        Pour toute question relative à vos données personnelles, vous pouvez
        nous contacter à l&apos;adresse{" "}
        <a
          href="mailto:privacy@lexai.app"
          className="text-ink underline underline-offset-4 hover:text-accent"
        >
          privacy@lexai.app
        </a>
        .
      </p>

      <h2 className="mt-16 font-serif text-3xl leading-tight tracking-tightest">
        2 — Données collectées
      </h2>
      <p className="mt-4">Nous collectons les catégories de données suivantes :</p>
      <div className="mt-6 space-y-6 border-l-2 border-ink pl-6">
        <div>
          <p className="label">Données d&apos;identification</p>
          <p className="mt-1">
            Nom complet, email professionnel, mot de passe (stocké sous forme
            haschée), numéro au Barreau (optionnel).
          </p>
        </div>
        <div>
          <p className="label">Données du cabinet</p>
          <p className="mt-1">
            Nom du cabinet, adresse, téléphone, email professionnel, SIRET,
            site web, logo — renseignées volontairement par l&apos;Utilisateur
            pour personnaliser les documents générés.
          </p>
        </div>
        <div>
          <p className="label">Données de facturation</p>
          <p className="mt-1">
            Adresse de facturation, nom du titulaire de la carte, identifiant
            client Stripe. Les numéros de carte bancaire ne sont JAMAIS
            stockés par LexAI ; ils sont traités exclusivement par Stripe, qui
            est certifié PCI-DSS.
          </p>
        </div>
        <div>
          <p className="label">Données d&apos;usage</p>
          <p className="mt-1">
            Contenu des instructions saisies dans les formulaires, documents
            générés, historique des générations, compteurs d&apos;usage
            mensuel, tokens consommés, coût des appels API.
          </p>
        </div>
        <div>
          <p className="label">Données techniques</p>
          <p className="mt-1">
            Adresse IP, type de navigateur, système d&apos;exploitation, dates
            et heures de connexion, identifiants de session.
          </p>
        </div>
      </div>

      <h2 className="mt-16 font-serif text-3xl leading-tight tracking-tightest">
        3 — Finalités et bases légales
      </h2>
      <table className="mt-6 w-full text-sm">
        <thead>
          <tr className="border-y border-ink text-left text-[10px] uppercase tracking-[0.14em] text-muted">
            <th className="py-3 pr-4 font-bold">Finalité</th>
            <th className="py-3 pr-4 font-bold">Base légale</th>
            <th className="py-3 font-bold">Durée</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-ink/15">
            <td className="py-4 pr-4">Création et gestion du compte</td>
            <td className="py-4 pr-4 text-muted">Exécution du contrat</td>
            <td className="py-4 text-muted">Durée du contrat</td>
          </tr>
          <tr className="border-b border-ink/15">
            <td className="py-4 pr-4">Fourniture du Service</td>
            <td className="py-4 pr-4 text-muted">Exécution du contrat</td>
            <td className="py-4 text-muted">Durée du contrat</td>
          </tr>
          <tr className="border-b border-ink/15">
            <td className="py-4 pr-4">Facturation et comptabilité</td>
            <td className="py-4 pr-4 text-muted">Obligation légale</td>
            <td className="py-4 text-muted">10 ans</td>
          </tr>
          <tr className="border-b border-ink/15">
            <td className="py-4 pr-4">Lutte contre la fraude</td>
            <td className="py-4 pr-4 text-muted">Intérêt légitime</td>
            <td className="py-4 text-muted">3 ans</td>
          </tr>
          <tr className="border-b border-ink/15">
            <td className="py-4 pr-4">
              Communications commerciales (newsletter)
            </td>
            <td className="py-4 pr-4 text-muted">Consentement</td>
            <td className="py-4 text-muted">
              Jusqu&apos;au retrait
            </td>
          </tr>
          <tr className="border-b border-ink/15">
            <td className="py-4 pr-4">Amélioration du Service</td>
            <td className="py-4 pr-4 text-muted">Intérêt légitime</td>
            <td className="py-4 text-muted">3 ans après dernière activité</td>
          </tr>
        </tbody>
      </table>

      <h2 className="mt-16 font-serif text-3xl leading-tight tracking-tightest">
        4 — Destinataires et sous-traitants
      </h2>
      <p className="mt-4">
        Vos données sont accessibles uniquement au personnel habilité de
        LexAI et aux sous-traitants techniques suivants :
      </p>
      <div className="mt-6 space-y-5 border-l-2 border-ink pl-6">
        <div>
          <p className="label">Supabase Inc.</p>
          <p className="mt-1 text-sm">
            Hébergement de la base de données, service d&apos;authentification
            et stockage de fichiers. Localisation : Ireland (eu-west-1). Lien
            vers leur politique :{" "}
            <a
              href="https://supabase.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink underline underline-offset-4 hover:text-accent"
            >
              supabase.com/privacy
            </a>
            .
          </p>
        </div>
        <div>
          <p className="label">Vercel Inc.</p>
          <p className="mt-1 text-sm">
            Hébergement de l&apos;application web. Localisation : infrastructure
            mondiale avec préférence pour les régions européennes. Lien :{" "}
            <a
              href="https://vercel.com/legal/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink underline underline-offset-4 hover:text-accent"
            >
              vercel.com/legal/privacy-policy
            </a>
            .
          </p>
        </div>
        <div>
          <p className="label">Stripe Payments Europe, Ltd.</p>
          <p className="mt-1 text-sm">
            Traitement des paiements par carte bancaire, gestion des
            abonnements. Localisation : Ireland. Certifié PCI-DSS Level 1.
            Lien :{" "}
            <a
              href="https://stripe.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink underline underline-offset-4 hover:text-accent"
            >
              stripe.com/privacy
            </a>
            .
          </p>
        </div>
        <div>
          <p className="label">Anthropic PBC.</p>
          <p className="mt-1 text-sm">
            Fourniture du modèle d&apos;intelligence artificielle (Claude) qui
            génère les documents. <strong>Localisation : États-Unis</strong>.
            Transfert encadré par des Clauses Contractuelles Types (CCT) de la
            Commission européenne. Anthropic ne conserve pas les prompts et
            ne les utilise pas pour entraîner ses modèles (conditions
            commerciales API). Lien :{" "}
            <a
              href="https://www.anthropic.com/legal/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink underline underline-offset-4 hover:text-accent"
            >
              anthropic.com/legal/privacy
            </a>
            .
          </p>
        </div>
      </div>
      <p className="mt-6 text-sm text-muted">
        Un accord de traitement des données (DPA) conforme à
        l&apos;article 28 du RGPD est disponible sur simple demande à{" "}
        <em>privacy@lexai.app</em> pour les cabinets qui en auraient besoin
        dans le cadre de leurs propres obligations vis-à-vis de leurs clients.
      </p>

      <h2 className="mt-16 font-serif text-3xl leading-tight tracking-tightest">
        5 — Transferts hors Union européenne
      </h2>
      <p className="mt-4">
        Comme indiqué ci-dessus, certaines données peuvent être traitées aux
        États-Unis par Anthropic (et, dans une moindre mesure, par certains
        services Vercel). Ces transferts sont encadrés par les{" "}
        <strong>Clauses Contractuelles Types</strong> adoptées par la
        Commission européenne le 4 juin 2021, conformément à l&apos;article
        46 du RGPD, qui garantissent un niveau de protection adéquat des
        données.
      </p>

      <h2 className="mt-16 font-serif text-3xl leading-tight tracking-tightest">
        6 — Vos droits
      </h2>
      <p className="mt-4">
        Conformément aux articles 15 à 22 du RGPD, vous disposez des droits
        suivants :
      </p>
      <ul className="mt-4 space-y-2 pl-6">
        <li>
          — <strong>Droit d&apos;accès</strong> : obtenir confirmation du
          traitement, copie des données et informations sur leur usage.
        </li>
        <li>
          — <strong>Droit de rectification</strong> : faire corriger des
          données inexactes ou incomplètes.
        </li>
        <li>
          — <strong>Droit à l&apos;effacement</strong> : demander la
          suppression de vos données dans les cas prévus par la loi.
        </li>
        <li>
          — <strong>Droit à la limitation</strong> du traitement.
        </li>
        <li>
          — <strong>Droit à la portabilité</strong> : recevoir vos données
          dans un format structuré et lisible par machine.
        </li>
        <li>
          — <strong>Droit d&apos;opposition</strong> au traitement fondé sur
          l&apos;intérêt légitime ou à des fins de prospection.
        </li>
        <li>
          — <strong>Droit de retirer votre consentement</strong> à tout
          moment, sans que cela n&apos;affecte la licéité du traitement
          antérieur.
        </li>
        <li>
          — <strong>
            Droit de définir des directives relatives au sort de vos données
            post-mortem
          </strong>{" "}
          (articles 84 et 85 de la loi Informatique et Libertés).
        </li>
      </ul>
      <p className="mt-6">
        Pour exercer ces droits, contactez-nous à{" "}
        <a
          href="mailto:privacy@lexai.app"
          className="text-ink underline underline-offset-4 hover:text-accent"
        >
          privacy@lexai.app
        </a>
        . Une réponse vous sera apportée sous un mois, délai pouvant être
        prolongé de deux mois en cas de demandes complexes.
      </p>
      <p className="mt-4">
        Si vous estimez que vos droits ne sont pas respectés, vous pouvez
        introduire une réclamation auprès de la Commission Nationale de
        l&apos;Informatique et des Libertés (CNIL) :{" "}
        <a
          href="https://www.cnil.fr"
          target="_blank"
          rel="noopener noreferrer"
          className="text-ink underline underline-offset-4 hover:text-accent"
        >
          www.cnil.fr
        </a>
        .
      </p>

      <h2 className="mt-16 font-serif text-3xl leading-tight tracking-tightest">
        7 — Sécurité
      </h2>
      <p className="mt-4">
        LexAI met en œuvre des mesures techniques et organisationnelles
        adaptées pour protéger vos données :
      </p>
      <ul className="mt-4 space-y-2 pl-6">
        <li>— Chiffrement TLS sur toutes les communications ;</li>
        <li>
          — Chiffrement des données au repos dans la base (Supabase) ;
        </li>
        <li>— Mots de passe stockés hachés (algorithme bcrypt) ;</li>
        <li>
          — Row-Level Security PostgreSQL garantissant qu&apos;un Utilisateur
          ne peut accéder qu&apos;à ses propres données ;
        </li>
        <li>— Politiques d&apos;accès restreintes pour le personnel ;</li>
        <li>— Journaux d&apos;accès conservés pour audit.</li>
      </ul>

      <h2 className="mt-16 font-serif text-3xl leading-tight tracking-tightest">
        8 — Cookies
      </h2>
      <p className="mt-4">
        LexAI utilise uniquement des cookies strictement nécessaires au
        fonctionnement du Service (cookies d&apos;authentification Supabase,
        session Stripe Checkout). Ces cookies ne nécessitent pas de
        consentement préalable conformément à l&apos;article 82 de la loi
        Informatique et Libertés.
      </p>
      <p className="mt-4">
        Aucun cookie de mesure d&apos;audience, de publicité ou de profilage
        n&apos;est déposé à ce jour. Toute évolution sera notifiée via une
        bannière de consentement.
      </p>

      <h2 className="mt-16 font-serif text-3xl leading-tight tracking-tightest">
        9 — Conservation des données
      </h2>
      <p className="mt-4">
        Les durées de conservation sont précisées dans le tableau à
        l&apos;article 3. À l&apos;expiration de ces durées, les données sont
        soit supprimées, soit anonymisées à des fins statistiques. Les
        Utilisateurs peuvent supprimer leur compte à tout moment depuis leur
        espace personnel ; la suppression est effective dans les 30 jours,
        sous réserve des obligations légales de conservation
        (comptabilité notamment).
      </p>

      <h2 className="mt-16 font-serif text-3xl leading-tight tracking-tightest">
        10 — Modification de la présente politique
      </h2>
      <p className="mt-4">
        La présente politique peut être modifiée pour refléter des évolutions
        du Service ou de la réglementation. Toute modification substantielle
        sera portée à la connaissance des Utilisateurs par email et sera
        mentionnée par la mise à jour de la date en tête de page.
      </p>
    </article>
  );
}
