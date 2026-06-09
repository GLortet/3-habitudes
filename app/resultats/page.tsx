"use client";
import { useEffect, useState } from "react";
import { defaultHabits } from "@/lib/defaultHabits/defaultHabits";
import { generateInsightText, generateRecommendations } from "@/lib/scoring";
import { loadState, saveState, emptyState } from "@/lib/storage";
import type { AppState } from "@/types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Stat } from "@/components/ui/Stat";
import { PageHeader } from "@/components/PageHeader";

export default function ResultsPage() {
  const [state, setState] = useState<AppState>(emptyState);
  useEffect(() => { const loaded = loadState(); const auditResult = loaded.auditResult ?? generateRecommendations(loaded.answers); const next = { ...loaded, auditResult }; setState(next); saveState(next); }, []);
  const scores = state.auditResult?.scores.slice(0, 5) ?? [];
  return <div><PageHeader eyebrow="Étape 2" title="Tes 5 leviers les plus rentables" subtitle="Le score ne cherche pas les “pires” habitudes. Il croise coût probable, fréquence, quantité, facilité et perte de plaisir pour trouver une variable prioritaire réaliste." />
    <Card className="mb-6"><h2 className="font-black">Calcul transparent</h2><p className="mt-2 text-sm leading-6 text-slateblue">scoreCout = impactCalories × 0,4 + fréquence × 0,3 + quantité × 0,3. scoreRentabilite = scoreCout × 0,45 + facilité × 0,25 + motivation × 0,20 - pertePlaisir × 0,10 - risqueCraquage × 0,10.</p></Card>
    <div className="grid gap-4">{scores.map((score, index) => { const habit = defaultHabits.find((h) => h.id === score.habitId)!; const insight = generateInsightText(score); return <Card key={score.habitId}><div className="flex flex-col gap-4 lg:flex-row lg:justify-between"><div><p className="text-sm font-bold text-sage-700">#{index + 1} variable prioritaire</p><h2 className="text-2xl font-black">{habit.label}</h2><p className="mt-2 text-slateblue">{habit.description}</p></div><div className="grid min-w-64 grid-cols-2 gap-3"><Stat label="Coût" value={score.scoreCout} /><Stat label="Rentabilité" value={score.scoreRentabilite} /></div></div><div className="mt-4 grid gap-3 md:grid-cols-2"><p><b>Pourquoi elle ressort :</b> {insight.why}</p><p><b>Ce qu’elle coûte probablement :</b> {insight.cost}</p><p><b>Alternative réaliste :</b> {insight.alternative}</p><p><b>Exemple :</b> {insight.example}</p><p><b>Difficulté probable :</b> {insight.difficulty}</p><p className="font-bold text-sage-700">{insight.encouragement}</p></div></Card>; })}</div>
    <div className="mt-6 flex flex-col gap-3 sm:flex-row"><Button href="/engagement">Choisir mes 3 engagements</Button><Button href="/audit" variant="secondary">Ajuster l’audit</Button></div>
  </div>;
}
