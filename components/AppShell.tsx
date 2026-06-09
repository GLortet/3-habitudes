"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  ["Accueil", "/"], ["Audit", "/audit"], ["Résultats", "/resultats"], ["Engagement", "/engagement"], ["Dashboard", "/tableau-de-bord"], ["Check-in", "/check-in"], ["Historique", "/historique"], ["Paramètres", "/parametres"],
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return <>
    <header className="sticky top-0 z-20 border-b border-sage-100 bg-white/85 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center gap-3 overflow-x-auto px-4 py-3">
        <Link href="/" className="mr-2 shrink-0 rounded-full bg-ink px-4 py-2 text-sm font-bold text-white">3 Habitudes</Link>
        {nav.slice(1).map(([label, href]) => <Link key={href} href={href} className={`shrink-0 rounded-full px-3 py-2 text-sm font-medium ${pathname === href ? "bg-sage-500 text-white" : "text-slateblue hover:bg-sage-50"}`}>{label}</Link>)}
      </nav>
    </header>
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-6 sm:py-10">{children}</main>
  </>;
}
