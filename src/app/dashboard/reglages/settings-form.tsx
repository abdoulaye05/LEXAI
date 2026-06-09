"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { COUNTRY_OPTIONS, getCountryByCode } from "@/lib/countries";

type Fields = {
  country: string;
  full_name: string;
  cabinet_name: string;
  cabinet_address: string;
  cabinet_phone: string;
  cabinet_email: string;
  cabinet_siret: string;
  cabinet_website: string;
  bar_id: string;
};

const FIELD_CONFIG: {
  name: keyof Fields;
  label: string;
  type: "text" | "textarea" | "email" | "url" | "select";
  placeholder?: string;
  hint?: string;
  options?: { value: string; label: string }[];
}[] = [
  {
    name: "country",
    label: "Pays d'exercice",
    type: "select",
    options: COUNTRY_OPTIONS.map((c) => ({
      value: c.code,
      label: c.name,
    })),
    hint: "Détermine le droit national, la monnaie et les juridictions par défaut dans tous vos documents générés. Modifiable à tout moment.",
  },
  {
    name: "full_name",
    label: "Nom complet (avocat)",
    type: "text",
    placeholder: "Maître Mamadou Diallo",
  },
  {
    name: "bar_id",
    label: "Numéro au Barreau",
    type: "text",
    placeholder: "ex. Barreau de Guinée n° 1234",
    hint: "Visible sur les PDF, rassure le client sur votre qualification.",
  },
  {
    name: "cabinet_name",
    label: "Nom du cabinet",
    type: "text",
    placeholder: "Cabinet Diallo & Associés",
    hint: "Apparaît en tête de vos PDF à la place de LexAI.",
  },
  {
    name: "cabinet_address",
    label: "Adresse complète",
    type: "textarea",
    placeholder: "12 boulevard du Commerce\nKaloum, Conakry",
  },
  {
    name: "cabinet_phone",
    label: "Téléphone",
    type: "text",
    placeholder: "+224 622 00 00 00",
  },
  {
    name: "cabinet_email",
    label: "Email professionnel",
    type: "email",
    placeholder: "contact@cabinet-diallo.gn",
  },
  {
    name: "cabinet_siret",
    label: "Numéro RCCM",
    type: "text",
    placeholder: "ex. RCCM/GN-CKY/2020-B-002345",
    hint: "Registre du Commerce et du Crédit Mobilier — équivalent OHADA du SIRET français.",
  },
  {
    name: "cabinet_website",
    label: "Site web (optionnel)",
    type: "url",
    placeholder: "https://cabinet-diallo.gn",
  },
];

export default function SettingsForm({
  userId,
  initial,
}: {
  userId: string;
  initial: Fields;
}) {
  const router = useRouter();
  const [values, setValues] = useState<Fields>(initial);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle"
  );
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof Fields>(key: K, value: Fields[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setStatus("idle");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setStatus("saving");

    const supabase = createClient();

    // On ne sauvegarde que les champs renseignés (vides → null, pour la clarté DB)
    const payload: Record<string, string | null> = {};
    for (const key of Object.keys(values) as (keyof Fields)[]) {
      const trimmed = values[key].trim();
      payload[key] = trimmed.length === 0 ? null : trimmed;
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update(payload)
      .eq("user_id", userId);

    if (updateError) {
      setError(updateError.message);
      setStatus("error");
      return;
    }

    setStatus("saved");
    // Rafraîchit le layout serveur pour que les nouvelles valeurs remontent partout
    router.refresh();
    setTimeout(() => setStatus("idle"), 2500);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {FIELD_CONFIG.map((f) => (
        <div key={f.name}>
          <label htmlFor={f.name} className="label">
            {f.label}
          </label>
          {f.type === "textarea" ? (
            <textarea
              id={f.name}
              rows={3}
              placeholder={f.placeholder}
              value={values[f.name]}
              onChange={(e) => update(f.name, e.target.value)}
              className="field mt-2 resize-none py-3 text-[17px] leading-[1.5]"
            />
          ) : f.type === "select" && f.options ? (
            <>
              <select
                id={f.name}
                value={values[f.name]}
                onChange={(e) => update(f.name, e.target.value)}
                className="field mt-2 cursor-pointer"
              >
                {f.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {f.name === "country" && (
                <CountryDetails code={values.country} />
              )}
            </>
          ) : (
            <input
              id={f.name}
              type={f.type}
              placeholder={f.placeholder}
              value={values[f.name]}
              onChange={(e) => update(f.name, e.target.value)}
              className="field mt-2"
            />
          )}
          {f.hint && (
            <p className="mt-2 text-xs text-muted">{f.hint}</p>
          )}
        </div>
      ))}

      {error && (
        <p className="border border-accent bg-creme px-4 py-3 text-sm text-accent">
          Erreur : {error}
        </p>
      )}

      <div className="flex items-center gap-6 pt-4 hairline-t">
        <button
          type="submit"
          disabled={status === "saving"}
          className="btn-primary"
        >
          {status === "saving"
            ? "Enregistrement…"
            : status === "saved"
              ? "✓ Enregistré"
              : "Enregistrer"}
        </button>
        {status === "saved" && (
          <span className="label text-accent">
            Mis à jour — vos prochains PDF utiliseront ces informations.
          </span>
        )}
      </div>
    </form>
  );
}

// Bloc d'information éditorial qui affiche les conséquences du pays choisi
// (monnaie, juridiction commerciale par défaut, capitale). Mis à jour
// dynamiquement quand l'avocat change la sélection.
function CountryDetails({ code }: { code: string }) {
  const country = getCountryByCode(code);
  return (
    <div className="mt-4 grid grid-cols-1 gap-x-8 gap-y-3 border-l-2 border-ink pl-5 sm:grid-cols-3">
      <div>
        <p className="font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
          Monnaie locale
        </p>
        <p className="mt-1 font-serif text-base">{country.currency}</p>
      </div>
      <div>
        <p className="font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
          Juridiction commerciale
        </p>
        <p className="mt-1 font-serif text-base">{country.mainCourt}</p>
      </div>
      <div>
        <p className="font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
          Capitale
        </p>
        <p className="mt-1 font-serif text-base">{country.capital}</p>
      </div>
    </div>
  );
}
