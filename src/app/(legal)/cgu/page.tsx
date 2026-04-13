export const metadata = {
  title: "Conditions générales d'utilisation — LexAI",
  description:
    "Conditions générales d'utilisation et d'abonnement au service LexAI.",
};

const LAST_UPDATED = "13 avril 2026";

export default function CguPage() {
  return (
    <article className="prose-lexai">
      <p className="label">Conditions générales</p>
      <h1 className="mt-4 font-serif text-5xl leading-[1.05] tracking-tightest md:text-6xl">
        Conditions générales d&apos;utilisation
        <span className="text-accent">.</span>
      </h1>
      <p className="mt-6 text-sm text-muted">
        Dernière mise à jour : {LAST_UPDATED}
      </p>

      {/* Avertissement fort en tête */}
      <div className="mt-10 border-l-2 border-accent bg-creme p-6">
        <p className="label text-accent">À lire impérativement</p>
        <p className="mt-3 font-serif text-xl leading-snug">
          LexAI est un outil d&apos;aide à la rédaction juridique qui utilise
          de l&apos;intelligence artificielle. Il ne constitue en aucun cas une
          consultation juridique et ne remplace pas l&apos;avis d&apos;un
          avocat qualifié. L&apos;Utilisateur demeure seul responsable de la
          vérification, de la validation et de l&apos;utilisation des
          documents générés.
        </p>
      </div>

      <h2 className="mt-16 font-serif text-3xl leading-tight tracking-tightest">
        Article 1 — Objet
      </h2>
      <p className="mt-4">
        Les présentes conditions générales d&apos;utilisation (&laquo; CGU
        &raquo;) ont pour objet de définir les conditions dans lesquelles
        <strong> LexAI</strong> (&laquo; le Service &raquo; ou &laquo; nous
        &raquo;) fournit à toute personne physique ou morale (&laquo;
        l&apos;Utilisateur &raquo; ou &laquo; vous &raquo;) un accès à la
        plateforme accessible à l&apos;adresse{" "}
        <em>https://lexai.app</em> et aux services qui y sont proposés.
      </p>
      <p className="mt-4">
        Toute utilisation du Service implique l&apos;acceptation pleine et
        entière des présentes CGU. L&apos;Utilisateur reconnaît les avoir lues
        et comprises avant toute utilisation.
      </p>

      <h2 className="mt-16 font-serif text-3xl leading-tight tracking-tightest">
        Article 2 — Description du Service
      </h2>
      <p className="mt-4">
        LexAI est une plateforme en ligne de type &laquo; Software as a Service
        &raquo; (SaaS) proposant quatre outils d&apos;aide à la rédaction
        juridique fondés sur l&apos;intelligence artificielle :
      </p>
      <ul className="mt-4 space-y-2 pl-6">
        <li>— Génération de contrats structurés en articles numérotés ;</li>
        <li>— Analyse de documents juridiques et identification des clauses à risque ;</li>
        <li>— Rédaction de mises en demeure ;</li>
        <li>— Rédaction de clauses contractuelles sur mesure.</li>
      </ul>
      <p className="mt-4">
        Le Service est fourni &laquo; en l&apos;état &raquo;. Les documents
        produits sont générés de manière automatisée à partir d&apos;un modèle
        d&apos;intelligence artificielle entraîné sur des corpus généraux ; ils
        peuvent comporter des erreurs, des approximations, ou ne pas tenir
        compte des spécificités du cas de l&apos;Utilisateur.
      </p>

      <h2 className="mt-16 font-serif text-3xl leading-tight tracking-tightest">
        Article 3 — Accès au Service
      </h2>
      <h3 className="mt-6 font-serif text-xl">3.1. Création de compte</h3>
      <p className="mt-3">
        L&apos;accès au Service nécessite la création d&apos;un compte via une
        adresse email valide. L&apos;Utilisateur s&apos;engage à fournir des
        informations exactes et à mettre à jour son profil en cas de
        modification.
      </p>
      <h3 className="mt-6 font-serif text-xl">3.2. Confidentialité des identifiants</h3>
      <p className="mt-3">
        L&apos;Utilisateur est seul responsable de la confidentialité de son
        mot de passe. Toute connexion effectuée avec ses identifiants est
        réputée émaner de lui. Il s&apos;engage à nous informer sans délai de
        toute utilisation non autorisée de son compte.
      </p>
      <h3 className="mt-6 font-serif text-xl">3.3. Usage professionnel</h3>
      <p className="mt-3">
        Le Service est conçu pour un usage professionnel par des avocats,
        juristes, cabinets et directions juridiques. L&apos;Utilisateur déclare
        disposer de la capacité juridique pour contracter et, le cas échéant,
        agir au nom de la personne morale qu&apos;il représente.
      </p>

      <h2 className="mt-16 font-serif text-3xl leading-tight tracking-tightest">
        Article 4 — Abonnements et paiement
      </h2>
      <h3 className="mt-6 font-serif text-xl">4.1. Offres</h3>
      <p className="mt-3">
        Le Service est proposé en plusieurs formules d&apos;abonnement
        (&laquo; Essai &raquo;, &laquo; Solo &raquo;, &laquo; Cabinet &raquo;,
        &laquo; Enterprise &raquo;) dont les caractéristiques et les prix sont
        publiés sur la page d&apos;abonnement au moment de la souscription.
      </p>
      <h3 className="mt-6 font-serif text-xl">4.2. Paiement</h3>
      <p className="mt-3">
        Le paiement est effectué en ligne par carte bancaire via notre
        prestataire de paiement Stripe, conforme aux standards PCI-DSS.
        L&apos;abonnement est reconduit automatiquement à chaque échéance
        (mensuelle sauf mention contraire).
      </p>
      <h3 className="mt-6 font-serif text-xl">4.3. Résiliation</h3>
      <p className="mt-3">
        L&apos;Utilisateur peut résilier son abonnement à tout moment depuis
        son espace personnel. La résiliation prend effet à la fin de la
        période de facturation en cours. Aucun remboursement au prorata
        n&apos;est accordé pour la période entamée, sauf cas expressément
        prévus par la loi (droit de rétractation pour les consommateurs au
        sens du Code de la consommation lorsqu&apos;il est applicable).
      </p>
      <h3 className="mt-6 font-serif text-xl">4.4. Révision des tarifs</h3>
      <p className="mt-3">
        LexAI peut modifier les tarifs de ses offres. Toute modification est
        notifiée à l&apos;Utilisateur par email au moins trente (30) jours
        avant son entrée en vigueur. L&apos;Utilisateur peut résilier son
        abonnement avant la prise d&apos;effet de la modification.
      </p>

      <h2 className="mt-16 font-serif text-3xl leading-tight tracking-tightest">
        Article 5 — Quotas d&apos;utilisation
      </h2>
      <p className="mt-4">
        Chaque formule d&apos;abonnement comporte un quota mensuel de
        générations. Une fois le quota atteint, les générations
        supplémentaires sont bloquées jusqu&apos;à la réinitialisation
        automatique en début de mois suivant, ou jusqu&apos;à la souscription
        d&apos;un plan supérieur.
      </p>
      <p className="mt-4">
        Pour les offres annoncées comme &laquo; illimitées &raquo;, une
        clause de <em>fair use</em> s&apos;applique : en cas d&apos;usage
        manifestement déraisonnable (utilisation automatisée à des fins autres
        que la pratique juridique, revente, scripts), LexAI se réserve le
        droit de limiter temporairement ou de suspendre le compte.
      </p>

      <h2 className="mt-16 font-serif text-3xl leading-tight tracking-tightest">
        Article 6 — Limites de responsabilité
      </h2>
      <h3 className="mt-6 font-serif text-xl">
        6.1. Nature du Service
      </h3>
      <p className="mt-3">
        LexAI est un <strong>outil d&apos;aide à la rédaction</strong>. Il ne
        constitue ni une consultation juridique, ni un conseil juridique, ni
        une prestation d&apos;avocat au sens de la loi n° 71-1130 du 31
        décembre 1971. L&apos;Utilisateur demeure seul responsable de la
        vérification, de l&apos;adaptation et de l&apos;utilisation des
        documents générés.
      </p>
      <h3 className="mt-6 font-serif text-xl">
        6.2. Absence de garantie d&apos;exactitude
      </h3>
      <p className="mt-3">
        LexAI ne garantit pas l&apos;exactitude juridique, l&apos;exhaustivité
        ni l&apos;adaptation au cas particulier des documents générés. Les
        contenus produits peuvent comporter des erreurs, des références
        obsolètes ou des imprécisions. Toute utilisation à des fins
        professionnelles nécessite <strong>une relecture critique et une
        validation</strong> par un professionnel qualifié (avocat, juriste
        d&apos;entreprise, notaire).
      </p>
      <h3 className="mt-6 font-serif text-xl">6.3. Plafond de responsabilité</h3>
      <p className="mt-3">
        Sous réserve des dispositions légales impératives, la responsabilité
        totale de LexAI au titre des présentes, toutes causes confondues, est
        limitée au montant des sommes effectivement réglées par
        l&apos;Utilisateur au titre des douze (12) mois précédant le fait
        générateur de responsabilité.
      </p>
      <h3 className="mt-6 font-serif text-xl">
        6.4. Force majeure
      </h3>
      <p className="mt-3">
        La responsabilité de LexAI ne saurait être engagée en cas de force
        majeure au sens de l&apos;article 1218 du Code civil, ni pour les
        dommages résultant de l&apos;indisponibilité des services fournis par
        nos sous-traitants techniques (Vercel, Supabase, Anthropic, Stripe).
      </p>

      <h2 className="mt-16 font-serif text-3xl leading-tight tracking-tightest">
        Article 7 — Propriété intellectuelle
      </h2>
      <h3 className="mt-6 font-serif text-xl">7.1. La plateforme</h3>
      <p className="mt-3">
        Tous les éléments composant la plateforme LexAI (interface, charte
        graphique, typographies, code, logo, marque) sont la propriété
        exclusive de l&apos;éditeur. Toute reproduction est interdite sans
        autorisation écrite préalable.
      </p>
      <h3 className="mt-6 font-serif text-xl">7.2. Les documents générés</h3>
      <p className="mt-3">
        Les documents générés par l&apos;Utilisateur au moyen du Service sont
        sa <strong>propriété pleine et entière</strong>. LexAI ne revendique
        aucun droit sur ces contenus et ne les exploite pas à des fins
        commerciales.
      </p>
      <h3 className="mt-6 font-serif text-xl">7.3. Utilisation des données</h3>
      <p className="mt-3">
        Les instructions saisies et les documents générés sont stockés pour
        permettre à l&apos;Utilisateur de les consulter dans son espace
        personnel. Ils ne sont pas utilisés pour entraîner les modèles
        d&apos;intelligence artificielle de nos sous-traitants (notamment
        Anthropic), conformément aux conditions commerciales de leurs APIs.
      </p>

      <h2 className="mt-16 font-serif text-3xl leading-tight tracking-tightest">
        Article 8 — Obligations de l&apos;Utilisateur
      </h2>
      <p className="mt-4">L&apos;Utilisateur s&apos;interdit notamment :</p>
      <ul className="mt-4 space-y-2 pl-6">
        <li>
          — de saisir des contenus illicites, diffamatoires, contrefaisants ou
          contraires à l&apos;ordre public ;
        </li>
        <li>
          — d&apos;utiliser le Service pour rédiger ou diffuser des documents
          dans un but de fraude, tromperie, blanchiment ou de toute autre
          activité illégale ;
        </li>
        <li>
          — de tenter d&apos;accéder aux systèmes techniques, bases de données
          ou données d&apos;autres utilisateurs ;
        </li>
        <li>
          — de revendre, louer ou partager les accès en dehors des conditions
          prévues par le plan souscrit ;
        </li>
        <li>
          — d&apos;automatiser massivement l&apos;utilisation du Service par
          scripts ou bots sans autorisation écrite préalable.
        </li>
      </ul>
      <p className="mt-4">
        Tout manquement peut entraîner la suspension ou la résiliation
        immédiate du compte sans remboursement.
      </p>

      <h2 className="mt-16 font-serif text-3xl leading-tight tracking-tightest">
        Article 9 — Confidentialité et données personnelles
      </h2>
      <p className="mt-4">
        Le traitement des données personnelles est régi par notre{" "}
        <a
          href="/confidentialite"
          className="text-ink underline underline-offset-4 hover:text-accent"
        >
          Politique de confidentialité
        </a>
        , qui fait partie intégrante des présentes CGU.
      </p>

      <h2 className="mt-16 font-serif text-3xl leading-tight tracking-tightest">
        Article 10 — Suspension et résiliation
      </h2>
      <p className="mt-4">
        LexAI se réserve le droit de suspendre ou de résilier le compte de
        l&apos;Utilisateur, sans préavis et sans remboursement, en cas de
        manquement grave aux présentes CGU, d&apos;utilisation frauduleuse,
        ou à la demande d&apos;une autorité compétente.
      </p>
      <p className="mt-4">
        En cas de résiliation, l&apos;Utilisateur dispose d&apos;un délai de
        30 jours pour exporter ses données depuis son espace personnel. Au-delà,
        les données peuvent être supprimées sans préavis.
      </p>

      <h2 className="mt-16 font-serif text-3xl leading-tight tracking-tightest">
        Article 11 — Modification des CGU
      </h2>
      <p className="mt-4">
        LexAI se réserve le droit de modifier les présentes CGU. Toute
        modification substantielle est notifiée à l&apos;Utilisateur par email
        au moins quinze (15) jours avant son entrée en vigueur. La poursuite
        de l&apos;utilisation du Service après cette date vaut acceptation des
        CGU modifiées.
      </p>

      <h2 className="mt-16 font-serif text-3xl leading-tight tracking-tightest">
        Article 12 — Droit applicable et juridiction
      </h2>
      <p className="mt-4">
        Les présentes CGU sont régies par le droit français. En cas de litige
        et à défaut de résolution amiable, les tribunaux français compétents
        seront seuls compétents, nonobstant pluralité de défendeurs ou appel
        en garantie. Pour les consommateurs au sens du Code de la
        consommation, les dispositions protectrices applicables prévalent sur
        les présentes stipulations.
      </p>

      <h2 className="mt-16 font-serif text-3xl leading-tight tracking-tightest">
        Article 13 — Médiation de la consommation
      </h2>
      <p className="mt-4">
        Conformément aux articles L. 611-1 et suivants du Code de la
        consommation, l&apos;Utilisateur consommateur a la possibilité, en
        cas de litige, de recourir gratuitement à un médiateur de la
        consommation. Les coordonnées du médiateur compétent sont
        disponibles sur demande à <em>contact@lexai.app</em>.
      </p>
    </article>
  );
}
