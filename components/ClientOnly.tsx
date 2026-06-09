"use client";
import { useEffect, useState } from "react";
export function ClientOnly({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready) return <div className="rounded-3xl bg-white p-6 text-slateblue">Chargement de tes données locales…</div>;
  return <>{children}</>;
}
