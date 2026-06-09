"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { defaultHabits } from "@/lib/defaultHabits/defaultHabits";
import { emptyState, loadState, saveState } from "@/lib/storage";
import type { AppState, Commitment } from "@/types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { PageHeader } from "@/components/PageHeader";

const createCommitment = (habitId: string): Commitment => {
  const habit = defaultHabits.find((item) => item.id === habitId)!;
  return { id: `${habitId}-${Date.now()}`, habitId, currentHabit: `Je veux ajuster : ${habit.label}.`, newRule: habit.suggestedAlternatives[0] ?? "Pendant 14 jours, je teste une règle simple.", difficulty: "moyen", riskContext: "Le moment où je passe en pilote automatique.", replacementSolution: habit.suggestedAlternatives.join(", "), personalCommitment: "Je ne supprime pas le plaisir. Je réduis juste la variable qui pèse le plus." };
};
export default function CommitmentPage() {
  const router = useRouter();
  const [state, setState] = useState<AppState>(emptyState);
  const [selected, setSelected] = useState<string[]>([]);
  const [commitments, setCommitments] = useState<Commitment[]>([]);
  const [started, setStarted] = useState(false);
  useEffect(() => { const loaded = loadState(); setState(loaded); setCommitments(loaded.plan?.commitments ?? []); setSelected(loaded.plan?.commitments.map((c) => c.habitId) ?? []); setStarted(Boolean(loaded.plan)); }, []);
  const recommended = useMemo(() => state.auditResult?.topHabitIds ?? [], [state]);
  const toggle = (habitId: string) => { setSelected((prev) => { const next = prev.includes(habitId) ? prev.filter((id) => id !== habitId) : [...prev, habitId].slice(0, 3); setCommitments(next.map((id) => commitments.find((c) => c.habitId === id) ?? createCommitment(id))); return next; }); };
  const update = (index: number, patch: Partial<Commitment>) => setCommitments((prev) => prev.map((item, i) => i === index ? { ...item, ...patch } : item));
  const submit = () => { if (commitments.length !== 3) return; const next = { ...state, plan: { startDate: new Date().toISOString(), commitments } }; saveState(next); setState(next); setStarted(true); };
  if (started && state.plan) return <div><PageHeader eyebrow="Test 14 jours" title="Ton test 14 jours commence." subtitle="Tes 3 engagements sont prêts. Teste, mesure, ajuste seulement si une règle est irréaliste." /><div className="grid gap-4 md:grid-cols-3">{state.plan.commitments.map((c) => <Card key={c.id}><h2 className="text-xl font-black">{defaultHabits.find((h) => h.id === c.habitId)?.label}</h2><p className="mt-3 text-sm text-slateblue">{c.newRule}</p><p className="mt-3 font-semibold text-sage-700">{c.personalCommitment}</p></Card>)}</div><Button className="mt-6" onClick={() => router.push("/tableau-de-bord")}>Accéder à mon tableau de bord</Button></div>;
  return <div><PageHeader eyebrow="Étape 3" title="Choisis exactement 3 changements" subtitle="Tu peux choisir parmi les recommandations ou dans la liste complète. Le MVP bloque la validation si tu n’as pas exactement 3 variables." />
    <Card className="mb-6"><p className="font-bold">Sélection : {selected.length}/3</p><div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{defaultHabits.map((habit) => <button key={habit.id} onClick={() => toggle(habit.id)} className={`rounded-2xl border p-3 text-left font-semibold ${selected.includes(habit.id) ? "border-sage-700 bg-sage-50" : "border-sage-100 bg-white"}`}><span>{habit.label}</span>{recommended.includes(habit.id) && <span className="ml-2 rounded-full bg-sage-700 px-2 py-1 text-xs text-white">recommandé</span>}</button>)}</div></Card>
    <div className="grid gap-4">{commitments.map((commitment, index) => <Card key={commitment.habitId}><h2 className="text-xl font-black">Engagement {index + 1} — {defaultHabits.find((h) => h.id === commitment.habitId)?.label}</h2><div className="mt-4 grid gap-4 md:grid-cols-2"><Field label="Habitude actuelle"><Textarea value={commitment.currentHabit} onChange={(e) => update(index, { currentHabit: e.target.value })} /></Field><Field label="Nouvelle règle"><Textarea value={commitment.newRule} onChange={(e) => update(index, { newRule: e.target.value })} /></Field><Field label="Niveau de difficulté"><Select value={commitment.difficulty} onChange={(e) => update(index, { difficulty: e.target.value as Commitment["difficulty"] })}><option>facile</option><option>moyen</option><option>difficile</option></Select></Field><Field label="Contexte à risque"><Input value={commitment.riskContext} onChange={(e) => update(index, { riskContext: e.target.value })} /></Field><Field label="Solution de remplacement"><Textarea value={commitment.replacementSolution} onChange={(e) => update(index, { replacementSolution: e.target.value })} /></Field><Field label="Phrase d’engagement"><Textarea value={commitment.personalCommitment} onChange={(e) => update(index, { personalCommitment: e.target.value })} /></Field></div></Card>)}</div>
    <Button className={`mt-6 ${commitments.length !== 3 ? "opacity-50" : ""}`} disabled={commitments.length !== 3} onClick={submit}>Valider mes 3 engagements</Button>
  </div>;
}
