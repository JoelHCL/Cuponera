"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import type { MemberPublic } from "@/lib/types";

export function LoginForm({ spaceName, members }: { spaceName: string; members: MemberPublic[] }) {
  const router = useRouter();
  const [memberId, setMemberId] = useState(members[0]?.id ?? "");
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId, pin }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.detail ?? "No se pudo entrar");
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
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-rose-100 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-2xl font-semibold text-rose-600">{spaceName}</h1>
        <p className="mt-1 text-sm text-slate-500">¿Quién eres?</p>

        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {members.map((m) => (
              <button
                key={m.id}
                onClick={() => setMemberId(m.id)}
                className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                  memberId === m.id
                    ? "border-rose-500 bg-rose-50 text-rose-700 dark:bg-rose-500/10"
                    : "border-slate-200 dark:border-slate-700"
                }`}
              >
                {m.displayName}
              </button>
            ))}
          </div>

          <input
            className={input}
            type="password"
            placeholder="Tu PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            onClick={submit}
            disabled={loading || !memberId}
            className="w-full rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-700 disabled:opacity-50"
          >
            {loading ? "Entrando…" : "Entrar"}
          </button>
        </div>
      </div>
    </div>
  );
}
