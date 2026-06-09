"use client";
import { useEffect, useState } from "react";
import { defaultHabits } from "@/lib/defaultHabits/defaultHabits";
import { calculateAdherenceRate, calculateWeightTrend, getAverages } from "@/lib/scoring";
import { emptyState, loadState } from "@/lib/storage";
import type { AppState } from "@/types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Stat } from "@/components/ui/Stat";
import { PageHeader } from "@/components/PageHeader";

const dayOfPlan = (start?: string) => start ? Math.min(14, Math.max(1, Math.floor((Date.now() - new Date(start).getTime()) / 86400000) + 1)) : 1;
export default function DashboardPage() {
  const [state, setState] = useState<AppState>(emptyState);
  const [showAdjust, setShowAdjust] = useState(false);
  useEffect(() => setState(loadState()), []);
  const trend = calculateWeightTrend(state.checkIns, state.profile?.currentWeightKg);
  const averages = getAverages(state.checkIns);
  return <div><PageHeader eyebrow="Pilotage" title={`Tableau de bord — Jour ${dayOfPlan(state.plan?.startDate)} à Jour 14`} subtitle="Le poids varie. La tendance décide. Ton rôle : tester 14 jours avec assez de données pour ajuster intelligemment." />
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5"><Stat label="Poids départ" value={trend.first ? `${trend.first} kg` : "—"} /><Stat label="Dernier poids" value={trend.last ? `${trend.last} kg` : "—"} /><Stat label="Évolution" value={`${trend.variation} kg`} /><Stat label="Moyenne mobile" value={trend.movingAverage ? `${trend.movingAverage} kg` : "—"} /><Stat label="Check-ins" value={state.checkIns.length} /></div>
    <div className="mt-6 grid gap-4 lg:grid-cols-3">{state.plan?.commitments.map((c) => <Card key={c.id}><h2 className="text-xl font-black">{defaultHabits.find((h) => h.id === c.habitId)?.label}</h2><p className="mt-2 text-sm text-slateblue">{c.newRule}</p><Stat label="Respect" value={`${calculateAdherenceRate(state.checkIns, c.id)}%`} /></Card>) ?? <Card><p>Aucun engagement actif. Choisis tes 3 variables.</p><Button href="/engagement" className="mt-4">Créer mes engagements</Button></Card>}</div>
    <Card className="mt-6"><h2 className="text-xl font-black">Ressenti moyen</h2><div className="mt-4 grid gap-3 sm:grid-cols-5"><Stat label="Ressenti" value={averages.feeling} /><Stat label="Énergie" value={averages.energy} /><Stat label="Faim" value={averages.hunger} /><Stat label="Frustration" value={averages.frustration} /><Stat label="Motivation" value={averages.motivation} /></div></Card>
    <div className="mt-6 flex flex-col gap-3 sm:flex-row"><Button href="/check-in">Faire mon check-in</Button><Button href="/historique" variant="secondary">Voir mon historique</Button><Button variant="ghost" onClick={() => setShowAdjust(!showAdjust)}>Ajuster mes engagements</Button></div>{showAdjust && <p className="mt-3 rounded-2xl bg-sage-50 p-4 text-sm font-semibold text-slateblue">Évite de changer trop vite. L’idéal est de tester 14 jours, sauf si une règle est irréaliste ou te met en difficulté.</p>}
  </div>;
}
