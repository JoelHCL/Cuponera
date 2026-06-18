"use client";

import { useState } from "react";

import { couponCreateSchema } from "@/lib/validation";

export function NewCouponModal({
  open,
  partnerName,
  onClose,
  onCreate,
}: {
  open: boolean;
  partnerName: string;
  onClose: () => void;
  onCreate: (body: { title: string; description: string; expiresAt: string }) => Promise<void>;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!open) return null;

  const submit = async () => {
    setError(null);
    const parsed = couponCreateSchema.safeParse({ title, description, expiresAt });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Revisa los datos");
      return;
    }
    setBusy(true);
    try {
      await onCreate({ title, description, expiresAt });
      setTitle("");
      setDescription("");
      setExpiresAt("");
      onClose();
    } catch {
      setError("No se pudo crear el cupón");
    } finally {
      setBusy(false);
    }
  };

  const input =
    "w-full rounded-lg border border-rose-200 bg-white px-3 py-2 text-sm outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/30 dark:border-slate-700 dark:bg-slate-800";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-semibold">Regalar un cupón a {partnerName}</h2>
        <div className="mt-4 space-y-3">
          <input className={input} placeholder="Título (p. ej. Una cena sorpresa 🍝)" value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
          <textarea className={input} rows={3} placeholder="Detalles (opcional)" value={description} onChange={(e) => setDescription(e.target.value)} />
          <label className="block space-y-1">
            <span className="text-xs text-slate-500">Vence (opcional)</span>
            <input className={input} type="date" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} />
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg border border-slate-300 px-4 py-2 text-sm dark:border-slate-600">
            Cancelar
          </button>
          <button onClick={submit} disabled={busy} className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-50">
            {busy ? "Creando…" : "Crear cupón"}
          </button>
        </div>
      </div>
    </div>
  );
}
