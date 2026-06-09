"use client";
import { useEffect, useState } from "react";
import { defaultHabits } from "@/lib/defaultHabits/defaultHabits";
import { calculateAdherenceRate, generateFourteenDaySummary } from "@/lib/scoring";
import { emptyState, loadState } from "@/lib/storage";
import type { AppState } from "@/types";
import { Card } from "@/components/ui/Card";
import { Stat } from "@/components/ui/Stat";
import { PageHeader } from "@/components/PageHeader";

export default function HistoryPage() {
  const [state, setState] = useState<AppState>(emptyState);
  useEffect(() => setState(loadState()), []);
  const summary = generateFourteenDaySummary(state);
  const maxWeight = Math.max(...summary.trend.weights.map((w) => w.weightKg), 1);
  return <div><PageHeader eyebrow="Historique" title="Tes données de test" subtitle="Le but n’est pas de juger une journée. Le but est de repérer la tendance et les contextes qui pèsent vraiment." />
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5"><Stat label="Jours renseignés" value={summary.daysLogged} /><Stat label="Variation poids" value={`${summary.trend.variation} kg`} /><Stat label="Respect moyen" value={`${summary.adherence}%`} /><Stat label="Ressenti moyen" value={summary.averages.feeling} /><Stat label="Frustration" value={summary.averages.frustration} /></div>
    <Card className="mt-6"><h2 className="text-xl font-black">Courbe simple du poids</h2><div className="mt-4 flex h-40 items-end gap-2 rounded-2xl bg-mist p-3">{summary.trend.weights.length ? summary.trend.weights.map((w) => <div key={w.date} className="flex flex-1 flex-col items-center gap-2"><div className="w-full rounded-t-xl bg-sage-500" style={{ height: `${Math.max(10, (w.weightKg / maxWeight) * 120)}px` }} /><span className="text-xs font-bold">{w.weightKg}</span></div>) : <p className="text-slateblue">Ajoute des pesées optionnelles dans tes check-ins pour afficher la courbe.</p>}</div></Card>
    <Card className="mt-6"><h2 className="text-xl font-black">Taux de respect des 3 engagements</h2><div className="mt-4 grid gap-3 md:grid-cols-3">{state.plan?.commitments.map((c) => <Stat key={c.id} label={defaultHabits.find((h) => h.id === c.habitId)?.label ?? "Engagement"} value={`${calculateAdherenceRate(state.checkIns, c.id)}%`} />)}</div></Card>
    <Card className="mt-6"><h2 className="text-xl font-black">Résumé automatique</h2><ul className="mt-3 grid gap-2 text-slateblue"><li>Meilleure habitude tenue : <b>{summary.best ? defaultHabits.find((h) => h.id === summary.best.commitment.habitId)?.label : "—"}</b></li><li>Habitude la plus difficile : <b>{summary.hardest ? defaultHabits.find((h) => h.id === summary.hardest.commitment.habitId)?.label : "—"}</b></li><li>Évolution du ressenti : <b>{summary.averages.feeling}/5</b></li><li>Nombre de jours renseignés : <b>{summary.daysLogged}</b></li></ul></Card>
    <Card className="mt-6 bg-sage-50"><h2 className="text-xl font-black">Bilan 14 jours</h2><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><Stat label="Poids départ" value={summary.trend.first ? `${summary.trend.first} kg` : "—"} /><Stat label="Poids final" value={summary.trend.last ? `${summary.trend.last} kg` : "—"} /><Stat label="Respect" value={`${summary.adherence}%`} /><Stat label="Énergie" value={summary.averages.energy} /></div><p className="mt-4 text-lg font-bold text-ink">{summary.conclusion}</p><p className="mt-2 text-sm text-slateblue">Options : Continuer, ajuster une variable, changer une habitude, alléger une règle trop dure, ou ajouter une nouvelle variable uniquement si les 3 premières sont stables.</p></Card>
    <div className="mt-6 grid gap-3">{state.checkIns.slice().reverse().map((c) => <Card key={c.id}><div className="flex flex-wrap items-center justify-between gap-3"><h3 className="font-black">{new Date(c.date).toLocaleDateString("fr-FR")}</h3><p className="font-semibold text-sage-700">Poids : {c.weightKg ? `${c.weightKg} kg` : "non renseigné"}</p></div><p className="mt-2 text-sm text-slateblue">Énergie {c.energy}/5 · Faim {c.hunger}/5 · Frustration {c.frustration}/5 · Motivation {c.motivation}/5</p>{c.note && <p className="mt-2">{c.note}</p>}</Card>)}</div>
  </div>;
}
