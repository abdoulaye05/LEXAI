"use client";

import { useRef, useState } from "react";

export type Field = {
  name: string;
  label: string;
  type: "text" | "textarea" | "select";
  placeholder?: string;
  required?: boolean;
  rows?: number;
  options?: { value: string; label: string }[];
};

export type ToolConfig = {
  id: "contrat" | "analyse" | "mise-en-demeure" | "clause";
  number: string;
  title: string;
  subtitle: string;
  description: string;
  submitLabel: string;
  emptyTitle: string;
  emptyDescription: string;
  outputFilename: string;
  fields: Field[];
};

export default function ToolWorkspace({ config }: { config: ToolConfig }) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(config.fields.map((f) => [f.name, ""]))
  );
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState<"idle" | "streaming" | "done" | "error">(
    "idle"
  );
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  function updateField(name: string, value: string) {
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setOutput("");
    setStatus("streaming");

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool: config.id, fields: values }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error ?? `HTTP ${res.status}`);
      }
      if (!res.body) throw new Error("no_body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setOutput(acc);
      }
      setStatus("done");
    } catch (err) {
      if ((err as Error).name === "AbortError") {
        setStatus("idle");
        return;
      }
      setError((err as Error).message);
      setStatus("error");
    } finally {
      abortRef.current = null;
    }
  }

  function handleStop() {
    abortRef.current?.abort();
  }

  function handleCopy() {
    if (!output) return;
    navigator.clipboard.writeText(output);
  }

  function handleDownload() {
    if (!output) return;
    const blob = new Blob([output], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${config.outputFilename}-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const streaming = status === "streaming";

  return (
    <div className="flex min-h-screen flex-col">
      <header className="hairline-b px-10 py-10">
        <p className="label">
          {config.number} — {config.subtitle}
        </p>
        <h1 className="mt-3 font-serif text-5xl leading-[0.95] tracking-tightest">
          {config.title}
          <span className="text-accent">.</span>
        </h1>
        <p className="mt-4 max-w-2xl text-muted">{config.description}</p>
      </header>

      <div className="grid flex-1 grid-cols-1 lg:grid-cols-[minmax(0,460px)_1fr]">
        {/* Form column */}
        <form
          onSubmit={handleSubmit}
          className="border-ink px-10 py-10 lg:border-r"
        >
          <p className="label mb-8">Brief</p>
          <div className="space-y-10">
            {config.fields.map((field) => (
              <FieldRenderer
                key={field.name}
                field={field}
                value={values[field.name] ?? ""}
                onChange={(v) => updateField(field.name, v)}
                disabled={streaming}
              />
            ))}
          </div>

          <div className="mt-12 flex items-center gap-6">
            <button
              type="submit"
              disabled={streaming}
              className="btn-primary flex-1"
            >
              {streaming ? "Génération en cours…" : config.submitLabel}
            </button>
            {streaming && (
              <button
                type="button"
                onClick={handleStop}
                className="btn-ghost"
              >
                Interrompre
              </button>
            )}
          </div>

          {error && (
            <p className="mt-8 border border-accent bg-creme px-4 py-3 text-sm text-accent">
              Erreur : {error}
            </p>
          )}
        </form>

        {/* Output column */}
        <section className="bg-creme px-10 py-10">
          <div className="mb-8 flex items-center justify-between">
            <p className="label">Document généré</p>
            {status === "done" && output && (
              <div className="flex items-center gap-6">
                <button onClick={handleCopy} className="btn-ghost">
                  Copier
                </button>
                <button onClick={handleDownload} className="btn-ghost">
                  Télécharger
                </button>
              </div>
            )}
          </div>

          {status === "idle" && !output && (
            <EmptyState
              title={config.emptyTitle}
              description={config.emptyDescription}
            />
          )}

          {(streaming || output) && (
            <article className="max-w-3xl whitespace-pre-wrap font-serif text-[17px] leading-[1.7] text-ink">
              {output}
              {streaming && (
                <span className="ml-1 inline-block h-5 w-[2px] animate-pulse bg-accent align-middle" />
              )}
            </article>
          )}
        </section>
      </div>
    </div>
  );
}

function FieldRenderer({
  field,
  value,
  onChange,
  disabled,
}: {
  field: Field;
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
}) {
  return (
    <div>
      <label htmlFor={field.name} className="label">
        {field.label}
      </label>

      {field.type === "text" && (
        <input
          id={field.name}
          type="text"
          required={field.required}
          placeholder={field.placeholder}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className="field mt-2"
        />
      )}

      {field.type === "textarea" && (
        <textarea
          id={field.name}
          required={field.required}
          placeholder={field.placeholder}
          value={value}
          disabled={disabled}
          rows={field.rows ?? 5}
          onChange={(e) => onChange(e.target.value)}
          className="field mt-2 resize-none py-3 text-[17px] leading-[1.6]"
        />
      )}

      {field.type === "select" && field.options && (
        <select
          id={field.name}
          required={field.required}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className="field mt-2 cursor-pointer"
        >
          <option value="" disabled>
            {field.placeholder ?? "Sélectionner…"}
          </option>
          {field.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mt-10 max-w-md border-l-2 border-ink pl-6">
      <p className="font-serif text-3xl leading-tight tracking-tightest">
        {title}
      </p>
      <p className="mt-4 text-muted">{description}</p>
    </div>
  );
}
