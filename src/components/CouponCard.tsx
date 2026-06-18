"use client";

import { useState } from "react";

import { STATUS_LABEL, type CouponDTO } from "@/lib/types";

const statusStyles: Record<string, string> = {
  disponible: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  solicitado: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  cobrado: "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
};

function fmt(date: string | null) {
  if (!date) return null;
  return new Date(date).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" });
}

export function CouponCard({
  coupon,
  myId,
  onAction,
}: {
  coupon: CouponDTO;
  myId: string;
  onAction: (path: string, method?: string, body?: unknown) => Promise<void>;
}) {
  const [noteOpen, setNoteOpen] = useState(false);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  const isCreator = coupon.creatorId === myId;
  const isRecipient = coupon.recipientId === myId;
  const cobrado = coupon.status === "cobrado";

  const run = async (path: string, method = "POST", body?: unknown) => {
    setBusy(true);
    try {
      await onAction(path, method, body);
    } finally {
      setBusy(false);
      setNoteOpen(false);
      setNote("");
    }
  };

  return (
    <article className={`rounded-2xl border bg-white p-5 shadow-sm dark:bg-slate-900 ${cobrado ? "border-slate-200 opacity-70 dark:border-slate-800" : "border-rose-100 dark:border-slate-800"}`}>
      <div className="flex items-start justify-between gap-3">
        <h3 className={`font-semibold ${cobrado ? "line-through" : ""}`}>{coupon.title}</h3>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[coupon.status]}`}>
          {STATUS_LABEL[coupon.status]}
        </span>
      </div>

      {coupon.description && <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{coupon.description}</p>}

      <p className="mt-3 text-xs text-slate-400">
        De <strong>{coupon.creatorName}</strong> para <strong>{coupon.recipientName}</strong>
        {coupon.expiresAt && ` · vence ${fmt(coupon.expiresAt)}`}
      </p>

      {coupon.status === "solicitado" && coupon.requestNote && (
        <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
          📝 {coupon.requestNote}
        </p>
      )}
      {cobrado && coupon.redeemedAt && (
        <p className="mt-2 text-xs text-slate-400">Cobrado el {fmt(coupon.redeemedAt)}</p>
      )}

      {/* Acciones según rol + estado */}
      <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
        {coupon.status === "disponible" && isRecipient && !noteOpen && (
          <button onClick={() => setNoteOpen(true)} disabled={busy} className="rounded-lg bg-rose-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-50">
            Solicitar usar
          </button>
        )}
        {coupon.status === "disponible" && isCreator && (
          <span className="text-xs text-slate-400">Esperando que {coupon.recipientName} lo use</span>
        )}
        {coupon.status === "solicitado" && isCreator && (
          <button onClick={() => run(`/api/coupons/${coupon.id}/redeem`)} disabled={busy} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50">
            Marcar como cobrado
          </button>
        )}
        {coupon.status === "solicitado" && isRecipient && (
          <button onClick={() => run(`/api/coupons/${coupon.id}/cancel`)} disabled={busy} className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm dark:border-slate-600">
            Cancelar solicitud
          </button>
        )}
        {isCreator && !cobrado && (
          <button
            onClick={() => confirm("¿Borrar este cupón?") && run(`/api/coupons/${coupon.id}`, "DELETE")}
            disabled={busy}
            className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-900/20"
          >
            Borrar
          </button>
        )}
      </div>

      {noteOpen && (
        <div className="mt-3 space-y-2">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="¿Algún mensaje al solicitarlo? (opcional)"
            rows={2}
            className="w-full rounded-lg border border-rose-200 bg-white px-3 py-2 text-sm outline-none focus:border-rose-500 dark:border-slate-700 dark:bg-slate-800"
          />
          <div className="flex justify-end gap-2">
            <button onClick={() => setNoteOpen(false)} className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm dark:border-slate-600">
              Cancelar
            </button>
            <button onClick={() => run(`/api/coupons/${coupon.id}/request`, "POST", { note })} disabled={busy} className="rounded-lg bg-rose-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-50">
              Enviar solicitud
            </button>
          </div>
        </div>
      )}
    </article>
  );
}
