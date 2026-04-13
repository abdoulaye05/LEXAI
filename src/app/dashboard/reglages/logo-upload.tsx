"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const MAX_BYTES = 2 * 1024 * 1024; // 2 Mo
const ALLOWED_MIMES = ["image/png", "image/jpeg", "image/svg+xml"];

export default function LogoUpload({
  userId,
  currentLogoUrl,
}: {
  userId: string;
  currentLogoUrl: string | null;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentLogoUrl);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    if (!ALLOWED_MIMES.includes(file.type)) {
      setError("Format non supporté. Utilisez PNG, JPG ou SVG.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("Le fichier dépasse 2 Mo. Compressez-le avant l'upload.");
      return;
    }

    setUploading(true);
    const supabase = createClient();

    // Path déterministe par user avec timestamp pour éviter les soucis de cache
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "png";
    const path = `${userId}/logo-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("cabinet-logos")
      .upload(path, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      setError(`Upload échoué : ${uploadError.message}`);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("cabinet-logos")
      .getPublicUrl(path);

    const publicUrl = urlData.publicUrl;

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ cabinet_logo_url: publicUrl })
      .eq("user_id", userId);

    if (updateError) {
      setError(`Sauvegarde échouée : ${updateError.message}`);
      setUploading(false);
      return;
    }

    setPreviewUrl(publicUrl);
    setUploading(false);
    router.refresh();
  }

  async function handleRemove() {
    if (!previewUrl) return;
    setError(null);
    setUploading(true);

    const supabase = createClient();

    // Essaie de supprimer le fichier du storage (best effort)
    try {
      const url = new URL(previewUrl);
      const parts = url.pathname.split("/cabinet-logos/");
      if (parts[1]) {
        await supabase.storage.from("cabinet-logos").remove([parts[1]]);
      }
    } catch {
      // Ignore : on nettoie juste le profil même si storage échoue
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ cabinet_logo_url: null })
      .eq("user_id", userId);

    if (updateError) {
      setError(`Retrait échoué : ${updateError.message}`);
      setUploading(false);
      return;
    }

    setPreviewUrl(null);
    setUploading(false);
    router.refresh();
  }

  return (
    <div>
      <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
        {/* Preview */}
        <div className="flex h-32 w-48 items-center justify-center border border-ink bg-creme">
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt="Logo cabinet"
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <p className="label text-muted">Pas de logo</p>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <input
            ref={inputRef}
            type="file"
            accept={ALLOWED_MIMES.join(",")}
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="btn-primary w-full disabled:opacity-50 sm:w-auto"
          >
            {uploading
              ? "Envoi en cours…"
              : previewUrl
                ? "Remplacer le logo"
                : "Téléverser un logo"}
          </button>
          {previewUrl && !uploading && (
            <button
              type="button"
              onClick={handleRemove}
              className="block text-xs text-muted underline-offset-4 hover:text-accent hover:underline"
            >
              Retirer le logo actuel
            </button>
          )}
        </div>
      </div>

      {error && (
        <p className="mt-4 border border-accent bg-creme px-4 py-3 text-sm text-accent">
          {error}
        </p>
      )}
    </div>
  );
}
