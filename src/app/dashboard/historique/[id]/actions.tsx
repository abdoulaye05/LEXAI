"use client";

import { useState } from "react";

export default function HistoriqueDetailActions({
  generationId,
  outputMd,
  status,
}: {
  generationId: string;
  outputMd: string | null;
  status: string;
}) {
  const [copied, setCopied] = useState(false);
  const disabled = status === "error" || !outputMd;

  function handleCopy() {
    if (!outputMd) return;
    navigator.clipboard.writeText(outputMd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownloadPdf() {
    if (disabled) return;
    window.location.href = `/api/export/pdf?id=${encodeURIComponent(generationId)}`;
  }

  function handleDownloadMarkdown() {
    if (!outputMd) return;
    const blob = new Blob([outputMd], {
      type: "text/markdown;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lexai-${generationId.slice(0, 8)}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <p className="label mb-6">Actions</p>

      <div className="space-y-3">
        <button
          type="button"
          onClick={handleDownloadPdf}
          disabled={disabled}
          className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-40"
        >
          Télécharger en PDF
        </button>

        <button
          type="button"
          onClick={handleCopy}
          disabled={disabled}
          className="btn-ghost w-full py-3 text-center disabled:cursor-not-allowed disabled:opacity-40"
        >
          {copied ? "✓ Copié" : "Copier le texte"}
        </button>

        <button
          type="button"
          onClick={handleDownloadMarkdown}
          disabled={disabled}
          className="btn-ghost w-full py-3 text-center disabled:cursor-not-allowed disabled:opacity-40"
        >
          Exporter en Markdown
        </button>
      </div>

      <div className="mt-10 border-t border-ink pt-6">
        <p className="label mb-3">Formats disponibles</p>
        <p className="text-xs text-muted">
          Le PDF inclut l&apos;en-tête LexAI, la typographie légale (Times New
          Roman), la pagination et le bas de page professionnel. C&apos;est le
          format à privilégier pour un envoi au client.
        </p>
      </div>
    </div>
  );
}
