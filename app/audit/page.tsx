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
const expressHabitIds = ["alcool", "boissons-sucrees", "grignotage-sucre", "grignotage-sale", "fromage", "pain-viennoiseries", "repas-soir", "weekend-social", "sedentarite", "stress-emotion"];
const encouragements = [
  "Déjà 5 habitudes auditées. Tu commences à voir ton système.",
  "Tu avances bien. L’objectif n’est pas d’être parfait, juste honnête.",
  "Encore quelques réponses et tu pourras choisir tes 3 leviers.",
  "Très bien. On va bientôt transformer l’audit en plan d’action.",
];
const defaultAnswer = (habitId: string): HabitAnswer => ({ habitId, frequency: "rarely", quantity: "medium", pleasure: "medium", ease: "medium", perceivedImpact: "medium", context: "autre" });

type AuditMode = "express" | "complet";

type QuestionCopy = {
  frequency: string;
  quantity: string;
  pleasure: string;
  ease: string;
  perceivedImpact: string;
  context: string;
  quantityOptions?: [Quantity, string][];
  pleasureOptions?: [Level, string][];
  perceivedImpactOptions?: [Level, string][];
  contextOptions?: [Context, string][];
};

const questionCopy = (habitId: string): QuestionCopy => {
  if (habitId === "alcool") return { frequency: "Fréquence", quantity: "Nombre de verres approximatif", pleasure: "Plaisir associé", ease: "Facilité à réduire", perceivedImpact: "Effet sur le grignotage", context: "Contexte principal", quantityOptions: [["low", "1 à 2 verres"], ["medium", "3 à 4 verres"], ["high", "5 verres ou plus"]], perceivedImpactOptions: [["low", "peu d’effet"], ["medium", "effet moyen"], ["high", "effet fort"]] };
  if (habitId === "activite-physique") return { frequency: "Fréquence actuelle", quantity: "Durée moyenne", pleasure: "Plaisir à bouger", ease: "Facilité à augmenter", perceivedImpact: "Impact ressenti", context: "Frein principal", quantityOptions: [["low", "moins de 20 min"], ["medium", "20 à 45 min"], ["high", "45 min ou plus"]], contextOptions: [["fatigue", "fatigue"], ["travail", "temps / travail"], ["famille", "organisation famille"], ["stress", "charge mentale"], ["sport", "douleur / niveau"], ["autre", "autre"]] };
  if (habitId === "sommeil") return { frequency: "Régularité", quantity: "Durée moyenne", pleasure: "Qualité ressentie", ease: "Facilité à améliorer", perceivedImpact: "Impact sur faim / énergie", context: "Contexte principal", quantityOptions: [["low", "moins de 6 h"], ["medium", "6 à 7 h"], ["high", "7 h ou plus"]], pleasureOptions: [["low", "faible"], ["medium", "correcte"], ["high", "bonne"]] };
  if (habitId === "stress-emotion") return { frequency: "Fréquence", quantity: "Intensité", pleasure: "Stratégie actuelle aide ?", ease: "Facilité à remplacer", perceivedImpact: "Impact ressenti", context: "Déclencheur principal", contextOptions: [["stress", "stress"], ["fatigue", "fatigue"], ["travail", "travail"], ["seul", "solitude"], ["famille", "tension famille"], ["autre", "autre"]] };
  const isFood = !["sedentarite"].includes(habitId);
  if (isFood) return { frequency: "Fréquence", quantity: "Quantité", pleasure: "Plaisir associé", ease: "Facilité à réduire", perceivedImpact: "Impact ressenti", context: "Contexte principal" };
  return { frequency: "Fréquence actuelle", quantity: "Volume de temps assis", pleasure: "Confort associé", ease: "Facilité à bouger plus", perceivedImpact: "Impact ressenti", context: "Frein principal" };
};

export default function AuditPage() {
  const router = useRouter();
  const [state, setState] = useState<AppState>(emptyState);
  const [profile, setProfile] = useState<UserProfile>({ name: "", activityLevel: "", mainMotivation: motivations[0] });
  const [hydrated, setHydrated] = useState(false);
  const [mode, setMode] = useState<AuditMode>("express");
  useEffect(() => { const loaded = loadState(); const requestedMode = new URLSearchParams(window.location.search).get("mode"); setMode(requestedMode === "complet" ? "complet" : "express"); setState(loaded); setProfile(loaded.profile ?? { name: "", activityLevel: "", mainMotivation: motivations[0] }); setHydrated(true); }, []);
  useEffect(() => { if (hydrated) saveState({ ...state, profile }); }, [state, profile, hydrated]);
  const activeHabits = useMemo(() => mode === "express" ? defaultHabits.filter((habit) => expressHabitIds.includes(habit.id)) : defaultHabits, [mode]);
  const activeAnsweredCount = activeHabits.filter((habit) => state.answers[habit.id]).length;
  const progress = Math.round((activeAnsweredCount / activeHabits.length) * 100);
  const updateAnswer = (habitId: string, patch: Partial<HabitAnswer>) => setState((prev) => ({ ...prev, answers: { ...prev.answers, [habitId]: { ...(prev.answers[habitId] ?? defaultAnswer(habitId)), ...patch } } }));
  const fillExample = () => { setState(exampleState); setProfile(exampleState.profile!); };
  const canSubmit = useMemo(() => profile.name && profile.currentWeightKg && activeAnsweredCount >= Math.min(5, activeHabits.length), [profile, activeAnsweredCount, activeHabits.length]);
  const submit = () => { const selectedAnswers = Object.fromEntries(activeHabits.filter((habit) => state.answers[habit.id]).map((habit) => [habit.id, state.answers[habit.id]])); const next = { ...state, profile, auditResult: generateRecommendations(selectedAnswers) }; saveState(next); router.push("/resultats"); };
  return <div>
    <PageHeader eyebrow={mode === "express" ? "Audit Express" : "Audit Complet"} title="Audit comportemental" subtitle={mode === "express" ? "Parcours rapide : 8 à 10 habitudes prioritaires, environ 3 à 5 minutes." : "Analyse plus fine : 20 habitudes, environ 10 à 15 minutes."} />
    <Card className="mb-5"><p className="font-bold text-ink">Choisis ton niveau de détail</p><div className="mt-3 grid gap-3 sm:grid-cols-2"><Button variant={mode === "express" ? "primary" : "secondary"} onClick={() => setMode("express")}>Je veux aller vite</Button><Button variant={mode === "complet" ? "primary" : "secondary"} onClick={() => setMode("complet")}>Je veux faire le tour complet</Button></div></Card>
    <div className="sticky top-16 z-10 mb-5 rounded-3xl bg-white p-3 shadow-soft"><div className="h-3 overflow-hidden rounded-full bg-mist"><div className="h-full bg-sage-500" style={{ width: `${progress}%` }} /></div><p className="mt-2 text-sm font-semibold text-slateblue">Avancement : {activeAnsweredCount}/{activeHabits.length} habitudes auditées. Tu peux reprendre plus tard : tout est sauvegardé automatiquement.</p></div>
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
    <div className="grid gap-4">{activeHabits.map((habit, index) => { const answer = state.answers[habit.id] ?? defaultAnswer(habit.id); const copy = questionCopy(habit.id); const encouragement = (index + 1) % 5 === 0 ? encouragements[Math.min(Math.floor(index / 5), encouragements.length - 1)] : undefined; return <div key={habit.id} className="grid gap-4"><Card><div className="mb-4 flex items-start justify-between gap-3"><div><p className="text-sm font-bold text-sage-700">{index + 1}. {habit.category}</p><h3 className="text-xl font-black">{habit.label}</h3><p className="text-sm text-slateblue">{habit.description}</p></div></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <Field label={copy.frequency}><Select value={answer.frequency} onChange={(e) => updateAnswer(habit.id, { frequency: e.target.value as Frequency })}>{frequencies.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</Select></Field>
      <Field label={copy.quantity}><Select value={answer.quantity} onChange={(e) => updateAnswer(habit.id, { quantity: e.target.value as Quantity })}>{(copy.quantityOptions ?? quantities).map(([v, l]) => <option key={v} value={v}>{l}</option>)}</Select></Field>
      <Field label={copy.pleasure}><Select value={answer.pleasure} onChange={(e) => updateAnswer(habit.id, { pleasure: e.target.value as Level })}>{(copy.pleasureOptions ?? levels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}</Select></Field>
      <Field label={copy.ease}><Select value={answer.ease} onChange={(e) => updateAnswer(habit.id, { ease: e.target.value as Ease })}>{eases.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</Select></Field>
      <Field label={copy.perceivedImpact}><Select value={answer.perceivedImpact} onChange={(e) => updateAnswer(habit.id, { perceivedImpact: e.target.value as Level })}>{(copy.perceivedImpactOptions ?? levels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}</Select></Field>
      <Field label={copy.context}><Select value={answer.context} onChange={(e) => updateAnswer(habit.id, { context: e.target.value as Context })}>{(copy.contextOptions ?? contexts).map(([v, l]) => <option key={v} value={v}>{l}</option>)}</Select></Field>
    </div></Card>{encouragement && <p className="rounded-3xl bg-sage-50 p-4 text-sm font-bold text-sage-700">{encouragement}</p>}</div>; })}</div>
    <div className="mt-6 flex flex-col gap-3 sm:flex-row"><Button disabled={!canSubmit} onClick={submit} className={!canSubmit ? "opacity-50" : ""}>Voir mes leviers rentables</Button><Button href="/" variant="ghost">Retour</Button></div>
  </div>;
}
