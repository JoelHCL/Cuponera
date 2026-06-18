"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { setupSchema } from "@/lib/validation";

export function SetupForm() {
  const router = useRouter();
  const [spaceName, setSpaceName] = useState("");
  const [a, setA] = useState({ displayName: "", pin: "" });
  const [b, setB] = useState({ displayName: "", pin: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError(null);
    const payload = { spaceName, memberA: a, memberB: b };
    const parsed = setupSchema.safeParse(payload);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Revisa los datos");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.detail ?? "No se pudo crear el espacio");
        return;
      }
      router.push("/");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  const input =
    "w-full rounded-lg border border-rose-200 bg-white px-3 py-2 text-sm outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/30 dark:border-slate-700 dark:bg-slate-800";

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-rose-100 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-2xl font-semibold text-rose-600">Crear su espacio 💌</h1>
        <p className="mt-1 text-sm text-slate-500">
          Configúralo una sola vez. Luego comparte la app y el PIN con tu pareja.
        </p>

        <div className="mt-6 space-y-5">
          <label className="block space-y-1">
            <span className="text-sm font-medium">Nombre del espacio</span>
            <input className={input} value={spaceName} placeholder="p. ej. Ana y Beto" onChange={(e) => setSpaceName(e.target.value)} />
          </label>

          <fieldset className="space-y-2 rounded-xl border border-slate-200 p-3 dark:border-slate-700">
            <legend className="px-1 text-xs font-semibold text-slate-500">Persona 1 (tú)</legend>
            <input className={input} placeholder="Tu nombre" value={a.displayName} onChange={(e) => setA({ ...a, displayName: e.target.value })} />
            <input className={input} type="password" placeholder="Tu PIN (mín. 4)" value={a.pin} onChange={(e) => setA({ ...a, pin: e.target.value })} />
          </fieldset>

          <fieldset className="space-y-2 rounded-xl border border-slate-200 p-3 dark:border-slate-700">
            <legend className="px-1 text-xs font-semibold text-slate-500">Persona 2 (tu pareja)</legend>
            <input className={input} placeholder="Su nombre" value={b.displayName} onChange={(e) => setB({ ...b, displayName: e.target.value })} />
            <input className={input} type="password" placeholder="Su PIN (mín. 4)" value={b.pin} onChange={(e) => setB({ ...b, pin: e.target.value })} />
          </fieldset>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            onClick={submit}
            disabled={loading}
            className="w-full rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-700 disabled:opacity-50"
          >
            {loading ? "Creando…" : "Crear espacio"}
          </button>
        </div>
      </div>
    </div>
  );
}
