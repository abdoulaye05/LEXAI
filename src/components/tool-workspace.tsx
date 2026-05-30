"use client";

import { useEffect, useRef, useState } from "react";
import { getTemplatesForTool } from "@/lib/form-templates";
import type { ToolId } from "@/lib/prompts";
import { createClient } from "@/lib/supabase/client";

export type Field = {
  name: string;
  label: string;
  type: "text" | "textarea" | "select" | "document-input";
  placeholder?: string;
  required?: boolean;
  rows?: number;
  options?: { value: string; label: string }[];
};

export type ToolConfig = {
  id: ToolId;
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
  const templates = getTemplatesForTool(config.id);
  const [templatePickerOpen, setTemplatePickerOpen] = useState(false);
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(config.fields.map((f) => [f.name, ""]))
  );
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState<"idle" | "streaming" | "done" | "error">(
    "idle"
  );
  const [error, setError] = useState<string | null>(null);
  const [generationId, setGenerationId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  function updateField(name: string, value: string) {
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setOutput("");
    setGenerationId(null);
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

      const headerGenId = res.headers.get("X-LexAI-Generation-Id");
      if (headerGenId) setGenerationId(headerGenId);

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
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownloadPdf(background: "creme" | "white" = "creme") {
    if (!generationId) return;
    window.location.href = `/api/export/pdf?id=${encodeURIComponent(generationId)}&background=${background}`;
  }

  function handleDownloadMarkdown() {
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
          <div className="mb-8 flex items-baseline justify-between">
            <p className="label">Brief</p>
            {templates.length > 0 && (
              <button
                type="button"
                onClick={() => setTemplatePickerOpen((v) => !v)}
                disabled={streaming}
                className="font-sans text-[11px] font-bold uppercase tracking-[0.12em] text-ink underline-offset-4 hover:text-accent hover:underline disabled:opacity-50"
              >
                {templatePickerOpen ? "Fermer" : "Templates →"}
              </button>
            )}
          </div>

          {templatePickerOpen && (
            <div className="mb-10 border border-ink bg-creme">
              <div className="hairline-b px-6 py-4">
                <p className="label">
                  {templates.length} templates prêts à l&apos;emploi
                </p>
                <p className="mt-2 text-xs text-muted">
                  Cliquez sur un template pour pré-remplir le formulaire. Vous
                  pourrez ensuite ajuster avant de générer.
                </p>
              </div>
              <ul className="divide-y divide-ink/15">
                {templates.map((tpl) => (
                  <li key={tpl.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setValues((prev) => ({ ...prev, ...tpl.values }));
                        setTemplatePickerOpen(false);
                      }}
                      className="group flex w-full items-start justify-between gap-4 px-6 py-4 text-left transition-colors hover:bg-ink/5"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-accent">
                          {tpl.category}
                        </p>
                        <p className="mt-1 font-serif text-lg leading-tight tracking-tightest">
                          {tpl.title}
                        </p>
                        <p className="mt-1 text-xs text-muted">
                          {tpl.description}
                        </p>
                      </div>
                      <span className="shrink-0 self-center font-sans text-[11px] font-bold uppercase tracking-[0.12em] text-ink transition-transform group-hover:translate-x-1 group-hover:text-accent">
                        Utiliser →
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

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
                  {copied ? "✓ Copié" : "Copier"}
                </button>
                <button
                  onClick={handleDownloadMarkdown}
                  className="btn-ghost"
                >
                  .md
                </button>
                {generationId && (
                  <>
                    <button
                      onClick={() => handleDownloadPdf("creme")}
                      className="btn-ghost"
                      title="Fond crème — esthétique éditoriale LexAI"
                    >
                      PDF crème
                    </button>
                    <button
                      onClick={() => handleDownloadPdf("white")}
                      className="btn-primary px-6 py-3 text-[11px]"
                      title="Fond blanc standard — pour dépôt en juridiction ou impression bureautique"
                    >
                      PDF blanc
                    </button>
                  </>
                )}
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

      {field.type === "document-input" && (
        <DocumentInput
          field={field}
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DocumentInput — champ spécial pour l'outil "Analyse de risques" qui permet
// soit de coller du texte, soit de téléverser un PDF (Claude Sonnet 4.5 lit
// les PDF nativement en mode multimodal, OCR inclus pour les scans).
//
// Convention de stockage dans values[field.name] :
//   - chaîne classique = texte collé
//   - "STORAGE_PATH::<path>" = PDF uploadé sur Supabase Storage
// L'API /api/generate détecte le préfixe et bascule en mode multimodal.
// ─────────────────────────────────────────────────────────────────────────────

const STORAGE_PREFIX = "STORAGE_PATH::";

function DocumentInput({
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
  const isPdfMode = value.startsWith(STORAGE_PREFIX);
  const [mode, setMode] = useState<"text" | "pdf">(isPdfMode ? "pdf" : "text");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [pdfFileName, setPdfFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Si la value contient déjà un PDF (ex. au reload), récupère le nom de fichier
  useEffect(() => {
    if (isPdfMode && !pdfFileName) {
      const path = value.slice(STORAGE_PREFIX.length);
      setPdfFileName(path.split("/").pop() ?? "document.pdf");
    }
  }, [isPdfMode, value, pdfFileName]);

  async function handlePdfUpload(file: File) {
    setUploadError(null);

    if (file.type !== "application/pdf") {
      setUploadError("Seuls les fichiers PDF sont acceptés.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("Fichier trop volumineux (maximum 10 Mo).");
      return;
    }

    setUploading(true);

    try {
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        setUploadError("Session expirée. Reconnectez-vous.");
        return;
      }

      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 60);
      const path = `${userData.user.id}/${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}-${safeName}`;

      const { error } = await supabase.storage
        .from("analyse-documents")
        .upload(path, file, {
          contentType: "application/pdf",
          upsert: false,
        });

      if (error) {
        setUploadError(`Erreur d'upload : ${error.message}`);
        return;
      }

      setPdfFileName(file.name);
      onChange(`${STORAGE_PREFIX}${path}`);
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : "Erreur inconnue à l'upload."
      );
    } finally {
      setUploading(false);
    }
  }

  function handleModeSwitch(newMode: "text" | "pdf") {
    setMode(newMode);
    onChange("");
    setPdfFileName(null);
    setUploadError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleRemovePdf() {
    setPdfFileName(null);
    onChange("");
    setUploadError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const textValue = isPdfMode ? "" : value;

  return (
    <div className="mt-2">
      {/* Tabs Coller texte / Téléverser PDF */}
      <div className="flex border border-ink">
        <button
          type="button"
          onClick={() => handleModeSwitch("text")}
          disabled={disabled}
          className={`flex-1 py-3 font-sans text-[11px] font-bold uppercase tracking-[0.12em] transition-colors ${
            mode === "text"
              ? "bg-ink text-creme"
              : "bg-creme text-ink hover:bg-ink/5"
          } disabled:opacity-50`}
        >
          Coller le texte
        </button>
        <button
          type="button"
          onClick={() => handleModeSwitch("pdf")}
          disabled={disabled}
          className={`flex-1 border-l border-ink py-3 font-sans text-[11px] font-bold uppercase tracking-[0.12em] transition-colors ${
            mode === "pdf"
              ? "bg-ink text-creme"
              : "bg-creme text-ink hover:bg-ink/5"
          } disabled:opacity-50`}
        >
          Téléverser un PDF
        </button>
      </div>

      {/* Mode texte : textarea classique */}
      {mode === "text" && (
        <textarea
          id={field.name}
          required={field.required}
          placeholder={field.placeholder}
          value={textValue}
          disabled={disabled}
          rows={field.rows ?? 16}
          onChange={(e) => onChange(e.target.value)}
          className="field mt-3 resize-none py-3 text-[17px] leading-[1.6]"
        />
      )}

      {/* Mode PDF : zone d'upload */}
      {mode === "pdf" && (
        <div className="mt-3 border border-ink p-6">
          {!pdfFileName && (
            <>
              <p className="font-serif text-lg leading-tight">
                Glissez votre PDF ici, ou
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled || uploading}
                className="mt-3 font-sans text-[11px] font-bold uppercase tracking-[0.12em] text-ink underline-offset-4 hover:text-accent hover:underline disabled:opacity-50"
              >
                {uploading ? "Téléversement en cours…" : "Parcourir →"}
              </button>
              <p className="mt-4 text-xs text-muted">
                Format accepté : PDF natif ou scanné (OCR automatique par
                Claude). Maximum 10 Mo.
              </p>
            </>
          )}

          {pdfFileName && (
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="label">PDF prêt à analyser</p>
                <p className="mt-2 truncate font-serif text-lg leading-tight">
                  {pdfFileName}
                </p>
              </div>
              <button
                type="button"
                onClick={handleRemovePdf}
                disabled={disabled}
                className="shrink-0 font-sans text-[11px] font-bold uppercase tracking-[0.12em] text-accent underline-offset-4 hover:underline disabled:opacity-50"
              >
                Retirer
              </button>
            </div>
          )}

          {uploadError && (
            <p className="mt-4 border-l-2 border-accent pl-3 text-sm text-accent">
              {uploadError}
            </p>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            disabled={disabled || uploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handlePdfUpload(file);
            }}
            className="hidden"
          />
        </div>
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
