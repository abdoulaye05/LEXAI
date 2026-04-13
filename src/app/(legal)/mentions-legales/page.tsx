export const metadata = {
  title: "Mentions légales — LexAI",
  description:
    "Mentions légales du service LexAI conformément à l'article 6 de la LCEN.",
};

const LAST_UPDATED = "13 avril 2026";

export default function MentionsLegalesPage() {
  return (
    <article className="prose-lexai">
      <p className="label">Informations obligatoires</p>
      <h1 className="mt-4 font-serif text-5xl leading-[1.05] tracking-tightest md:text-6xl">
        Mentions légales
        <span className="text-accent">.</span>
      </h1>
      <p className="mt-6 text-sm text-muted">
        Dernière mise à jour : {LAST_UPDATED}
      </p>
      <p className="mt-10 text-lg leading-relaxed">
        Conformément aux dispositions de l&apos;article 6 de la loi n° 2004-575
        du 21 juin 2004 pour la Confiance dans l&apos;Économie Numérique
        (&laquo; LCEN &raquo;), il est précisé aux utilisateurs du service
        LexAI l&apos;identité des différents intervenants dans le cadre de sa
        réalisation et de son suivi.
      </p>

      <h2 className="mt-16 font-serif text-3xl leading-tight tracking-tightest">
        1 — Éditeur du site
      </h2>
      <p className="mt-4">
        Le site <strong>LexAI</strong> est édité par :
      </p>
      <dl className="mt-6 space-y-3 border-l-2 border-ink pl-6">
        <div>
          <dt className="label">Raison sociale / Nom</dt>
          <dd className="mt-1 font-serif text-xl">
            [À COMPLÉTER — ex. Abdoulaye Diallo, entrepreneur individuel]
          </dd>
        </div>
        <div>
          <dt className="label">Forme juridique</dt>
          <dd className="mt-1 font-serif text-xl">
            [À COMPLÉTER — ex. Micro-entreprise, SASU, EURL]
          </dd>
        </div>
        <div>
          <dt className="label">Siège social</dt>
          <dd className="mt-1 font-serif text-xl">
            [ADRESSE COMPLÈTE — rue, code postal, ville, pays]
          </dd>
        </div>
        <div>
          <dt className="label">Numéro SIRET</dt>
          <dd className="mt-1 font-serif text-xl">
            [À COMPLÉTER dès immatriculation]
          </dd>
        </div>
        <div>
          <dt className="label">Capital social</dt>
          <dd className="mt-1 font-serif text-xl">
            [Le cas échéant, ex. 1 000 €]
          </dd>
        </div>
        <div>
          <dt className="label">Numéro de TVA intracommunautaire</dt>
          <dd className="mt-1 font-serif text-xl">
            [À COMPLÉTER si applicable]
          </dd>
        </div>
        <div>
          <dt className="label">Adresse email de contact</dt>
          <dd className="mt-1 font-serif text-xl">
            contact@lexai.app
          </dd>
        </div>
      </dl>

      <h2 className="mt-16 font-serif text-3xl leading-tight tracking-tightest">
        2 — Directeur de la publication
      </h2>
      <p className="mt-4">
        Le directeur de la publication du site LexAI est{" "}
        <strong>[NOM ET PRÉNOM DU DIRECTEUR DE PUBLICATION]</strong>,
        joignable à l&apos;adresse <em>contact@lexai.app</em>.
      </p>

      <h2 className="mt-16 font-serif text-3xl leading-tight tracking-tightest">
        3 — Hébergement
      </h2>
      <p className="mt-4">
        Le site est hébergé sur l&apos;infrastructure suivante :
      </p>
      <dl className="mt-6 space-y-6 border-l-2 border-ink pl-6">
        <div>
          <dt className="label">Hébergement applicatif</dt>
          <dd className="mt-1 font-serif text-xl">
            Vercel Inc.
          </dd>
          <dd className="text-sm text-muted">
            440 N Barranca Ave #4133, Covina, CA 91723, États-Unis. Données
            traitées sur l&apos;infrastructure Vercel région Europe (fra1 —
            Francfort) dans la mesure du possible.{" "}
            <a
              href="https://vercel.com/legal/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink underline underline-offset-4 hover:text-accent"
            >
              Politique de confidentialité Vercel
            </a>
            .
          </dd>
        </div>
        <div>
          <dt className="label">Base de données, authentification et stockage</dt>
          <dd className="mt-1 font-serif text-xl">
            Supabase Inc.
          </dd>
          <dd className="text-sm text-muted">
            970 Toa Payoh North #07-04, Singapour 318992. Infrastructure
            européenne utilisée (région Ireland, eu-west-1) pour héberger les
            données de LexAI.{" "}
            <a
              href="https://supabase.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink underline underline-offset-4 hover:text-accent"
            >
              Politique de confidentialité Supabase
            </a>
            .
          </dd>
        </div>
      </dl>

      <h2 className="mt-16 font-serif text-3xl leading-tight tracking-tightest">
        4 — Propriété intellectuelle
      </h2>
      <p className="mt-4">
        La structure générale du site LexAI, ainsi que les textes, graphismes,
        images, logos, marques et tout autre élément composant le site, sont
        la propriété exclusive de l&apos;éditeur ou de ses concédants. Toute
        représentation, reproduction ou exploitation, intégrale ou partielle,
        par quelque procédé que ce soit, sans l&apos;autorisation expresse de
        l&apos;éditeur, est interdite et constitue une contrefaçon sanctionnée
        par les articles L. 335-2 et suivants du Code de la propriété
        intellectuelle.
      </p>
      <p className="mt-4">
        Les documents générés par l&apos;outil LexAI à partir des instructions
        saisies par l&apos;Utilisateur demeurent la{" "}
        <strong>propriété pleine et entière de l&apos;Utilisateur</strong>.
        LexAI ne revendique aucun droit sur ces contenus.
      </p>

      <h2 className="mt-16 font-serif text-3xl leading-tight tracking-tightest">
        5 — Contact
      </h2>
      <p className="mt-4">
        Pour toute question relative au site ou à ses contenus, vous pouvez
        nous contacter à l&apos;adresse{" "}
        <a
          href="mailto:contact@lexai.app"
          className="text-ink underline underline-offset-4 hover:text-accent"
        >
          contact@lexai.app
        </a>
        .
      </p>

      <h2 className="mt-16 font-serif text-3xl leading-tight tracking-tightest">
        6 — Signalement de contenu illicite
      </h2>
      <p className="mt-4">
        Conformément à la LCEN, tout contenu manifestement illicite peut être
        signalé par courrier électronique à l&apos;adresse{" "}
        <em>contact@lexai.app</em>. Le signalement devra comporter la date de
        notification, l&apos;identité du notifiant, les éléments permettant
        d&apos;identifier le contenu litigieux, les motifs pour lesquels le
        contenu doit être retiré et copie de la correspondance adressée à
        l&apos;auteur du contenu en cause.
      </p>
    </article>
  );
}
