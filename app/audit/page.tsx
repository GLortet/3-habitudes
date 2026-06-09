"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { defaultHabits } from "@/lib/defaultHabits/defaultHabits";
import { emptyState, loadState, saveState } from "@/lib/storage";
import { generateRecommendations } from "@/lib/scoring";
import type { AppState, Context, Ease, Frequency, HabitAnswer, Level, Quantity, UserProfile } from "@/types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field, Input, Select } from "@/components/ui/Field";
import { PageHeader } from "@/components/PageHeader";
import { exampleState } from "@/data/exampleState";

const frequencies: [Frequency, string][] = [["never", "jamais"], ["rarely", "rarement"], ["1-2", "1 à 2 fois/semaine"], ["3-4", "3 à 4 fois/semaine"], ["daily", "presque tous les jours"]];
const quantities: [Quantity, string][] = [["low", "faible"], ["medium", "moyenne"], ["high", "élevée"]];
const levels: [Level, string][] = [["low", "faible"], ["medium", "moyen"], ["high", "fort"]];
const eases: [Ease, string][] = [["hard", "difficile"], ["medium", "moyen"], ["easy", "facile"]];
const contexts: [Context, string][] = [["seul", "seul"], ["travail", "travail"], ["famille", "famille"], ["soiree", "soirée"], ["stress", "stress"], ["fatigue", "fatigue"], ["weekend", "week-end"], ["sport", "sport"], ["autre", "autre"]];
const motivations = ["perdre du poids", "retrouver du souffle", "se sentir mieux dans son corps", "mieux dormir", "être plus performant au sport", "réduire l’alcool ou les excès", "autre"];
const defaultAnswer = (habitId: string): HabitAnswer => ({ habitId, frequency: "rarely", quantity: "medium", pleasure: "medium", ease: "medium", perceivedImpact: "medium", context: "autre" });

export default function AuditPage() {
  const router = useRouter();
  const [state, setState] = useState<AppState>(emptyState);
  const [profile, setProfile] = useState<UserProfile>({ name: "", activityLevel: "", mainMotivation: motivations[0] });
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { const loaded = loadState(); setState(loaded); setProfile(loaded.profile ?? { name: "", activityLevel: "", mainMotivation: motivations[0] }); setHydrated(true); }, []);
  useEffect(() => { if (hydrated) saveState({ ...state, profile }); }, [state, profile, hydrated]);
  const answeredCount = Object.keys(state.answers).length;
  const progress = Math.round((answeredCount / defaultHabits.length) * 100);
  const updateAnswer = (habitId: string, patch: Partial<HabitAnswer>) => setState((prev) => ({ ...prev, answers: { ...prev.answers, [habitId]: { ...(prev.answers[habitId] ?? defaultAnswer(habitId)), ...patch } } }));
  const fillExample = () => { setState(exampleState); setProfile(exampleState.profile!); };
  const canSubmit = useMemo(() => profile.name && profile.currentWeightKg && answeredCount >= 5, [profile, answeredCount]);
  const submit = () => { const next = { ...state, profile, auditResult: generateRecommendations(state.answers) }; saveState(next); router.push("/resultats"); };
  return <div>
    <PageHeader eyebrow="Étape 1" title="Audit comportemental" subtitle="Réponds vite. Une estimation honnête suffit : une donnée n’est pas un jugement." />
    <div className="sticky top-16 z-10 mb-5 rounded-3xl bg-white p-3 shadow-soft"><div className="h-3 overflow-hidden rounded-full bg-mist"><div className="h-full bg-sage-500" style={{ width: `${progress}%` }} /></div><p className="mt-2 text-sm font-semibold text-slateblue">Avancement : {answeredCount}/{defaultHabits.length} habitudes auditées. Tu peux reprendre plus tard : tout est sauvegardé automatiquement.</p></div>
    <Card className="mb-6 grid gap-4"><div className="flex items-center justify-between gap-3"><h2 className="text-xl font-black">Données de base</h2><Button variant="secondary" onClick={fillExample}>Charger l’exemple</Button></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Field label="Prénom ou pseudo"><Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} /></Field>
      <Field label="Âge"><Input type="number" value={profile.age ?? ""} onChange={(e) => setProfile({ ...profile, age: Number(e.target.value) || undefined })} /></Field>
      <Field label="Taille (cm)"><Input type="number" value={profile.heightCm ?? ""} onChange={(e) => setProfile({ ...profile, heightCm: Number(e.target.value) || undefined })} /></Field>
      <Field label="Poids actuel (kg)"><Input type="number" value={profile.currentWeightKg ?? ""} onChange={(e) => setProfile({ ...profile, currentWeightKg: Number(e.target.value) || undefined })} /></Field>
      <Field label="Objectif de poids (optionnel)"><Input type="number" value={profile.targetWeightKg ?? ""} onChange={(e) => setProfile({ ...profile, targetWeightKg: Number(e.target.value) || undefined })} /></Field>
      <Field label="Niveau d’activité"><Input value={profile.activityLevel} onChange={(e) => setProfile({ ...profile, activityLevel: e.target.value })} placeholder="ex : bureau + foot" /></Field>
      <Field label="Séances sport/semaine"><Input type="number" value={profile.sportSessionsPerWeek ?? ""} onChange={(e) => setProfile({ ...profile, sportSessionsPerWeek: Number(e.target.value) || undefined })} /></Field>
      <Field label="Pas moyens si connus"><Input type="number" value={profile.averageSteps ?? ""} onChange={(e) => setProfile({ ...profile, averageSteps: Number(e.target.value) || undefined })} /></Field>
      <Field label="Motivation principale"><Select value={profile.mainMotivation} onChange={(e) => setProfile({ ...profile, mainMotivation: e.target.value })}>{motivations.map((m) => <option key={m}>{m}</option>)}</Select></Field>
    </div></Card>
    <div className="grid gap-4">{defaultHabits.map((habit, index) => { const answer = state.answers[habit.id] ?? defaultAnswer(habit.id); return <Card key={habit.id}><div className="mb-4 flex items-start justify-between gap-3"><div><p className="text-sm font-bold text-sage-700">{index + 1}. {habit.category}</p><h3 className="text-xl font-black">{habit.label}</h3><p className="text-sm text-slateblue">{habit.description}</p></div></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <Field label="Fréquence"><Select value={answer.frequency} onChange={(e) => updateAnswer(habit.id, { frequency: e.target.value as Frequency })}>{frequencies.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</Select></Field>
      <Field label="Quantité"><Select value={answer.quantity} onChange={(e) => updateAnswer(habit.id, { quantity: e.target.value as Quantity })}>{quantities.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</Select></Field>
      <Field label="Plaisir associé"><Select value={answer.pleasure} onChange={(e) => updateAnswer(habit.id, { pleasure: e.target.value as Level })}>{levels.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</Select></Field>
      <Field label="Facilité à réduire"><Select value={answer.ease} onChange={(e) => updateAnswer(habit.id, { ease: e.target.value as Ease })}>{eases.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</Select></Field>
      <Field label="Impact ressenti"><Select value={answer.perceivedImpact} onChange={(e) => updateAnswer(habit.id, { perceivedImpact: e.target.value as Level })}>{levels.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</Select></Field>
      <Field label="Contexte principal"><Select value={answer.context} onChange={(e) => updateAnswer(habit.id, { context: e.target.value as Context })}>{contexts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</Select></Field>
    </div></Card>; })}</div>
    <div className="mt-6 flex flex-col gap-3 sm:flex-row"><Button disabled={!canSubmit} onClick={submit} className={!canSubmit ? "opacity-50" : ""}>Voir mes leviers rentables</Button><Button href="/" variant="ghost">Retour</Button></div>
  </div>;
}
