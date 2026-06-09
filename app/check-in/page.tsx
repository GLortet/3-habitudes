"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { defaultHabits } from "@/lib/defaultHabits/defaultHabits";
import { getSmartFeedback } from "@/lib/scoring";
import { emptyState, loadState, saveState } from "@/lib/storage";
import type { ActivityType, Adherence, AppState, CheckIn, Feeling } from "@/types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { PageHeader } from "@/components/PageHeader";

export default function CheckInPage() {
  const router = useRouter();
  const [state, setState] = useState<AppState>(emptyState);
  const [feedback, setFeedback] = useState<string[]>([]);
  const [form, setForm] = useState({ weightKg: "", feeling: "good" as Feeling, energy: 3, hunger: 3, frustration: 2, motivation: 4, activityType: "none" as ActivityType, duration: "", note: "" });
  const [adherence, setAdherence] = useState<Record<string, Adherence>>({});
  useEffect(() => { const loaded = loadState(); setState(loaded); setAdherence(Object.fromEntries((loaded.plan?.commitments ?? []).map((c) => [c.id, "yes"])) as Record<string, Adherence>); }, []);
  const submit = () => { const checkIn: CheckIn = { id: crypto.randomUUID(), date: new Date().toISOString(), weightKg: Number(form.weightKg) || undefined, adherence, feeling: form.feeling, energy: form.energy, hunger: form.hunger, frustration: form.frustration, motivation: form.motivation, activity: { type: form.activityType, durationMinutes: Number(form.duration) || undefined }, note: form.note }; const messages = getSmartFeedback(checkIn, state.checkIns, state.profile?.currentWeightKg); const next = { ...state, checkIns: [...state.checkIns, checkIn] }; saveState(next); setState(next); setFeedback(messages); };
  if (!state.plan) return <Card><p>Crée d’abord tes 3 engagements pour faire un check-in utile.</p><Button href="/engagement" className="mt-4">Choisir mes engagements</Button></Card>;
  return <div><PageHeader eyebrow="Moins de 2 minutes" title="Check-in du jour" subtitle="Une donnée n’est pas un jugement. Note ce qui s’est passé, puis reprends le pilotage demain." />
    {feedback.length > 0 && <Card className="mb-6 bg-sage-50"><h2 className="text-xl font-black">Retour du jour</h2>{feedback.map((m) => <p key={m} className="mt-2 font-semibold text-slateblue">{m}</p>)}<Button className="mt-4" onClick={() => router.push("/tableau-de-bord")}>Retour au tableau de bord</Button></Card>}
    <Card className="grid gap-4"><Field label="Poids du jour (optionnel)"><Input type="number" step="0.1" value={form.weightKg} onChange={(e) => setForm({ ...form, weightKg: e.target.value })} /></Field>{state.plan.commitments.map((c, index) => <Field key={c.id} label={`Ai-je respecté l’engagement ${index + 1} — ${defaultHabits.find((h) => h.id === c.habitId)?.label} ?`}><Select value={adherence[c.id] ?? "yes"} onChange={(e) => setAdherence({ ...adherence, [c.id]: e.target.value as Adherence })}><option value="yes">oui</option><option value="partial">partiellement</option><option value="no">non</option></Select></Field>)}<div className="grid gap-4 sm:grid-cols-2"><Field label="Comment je me sens aujourd’hui ?"><Select value={form.feeling} onChange={(e) => setForm({ ...form, feeling: e.target.value as Feeling })}><option value="very_bad">très mal</option><option value="medium">moyen</option><option value="good">bien</option><option value="very_good">très bien</option></Select></Field>{(["energy", "hunger", "frustration", "motivation"] as const).map((key) => <Field key={key} label={`${key === "energy" ? "Énergie" : key === "hunger" ? "Faim" : key === "frustration" ? "Frustration" : "Motivation"} : ${form[key]}/5`}><Input type="range" min="1" max="5" value={form[key]} onChange={(e) => setForm({ ...form, [key]: Number(e.target.value) })} /></Field>)}<Field label="Activité physique"><Select value={form.activityType} onChange={(e) => setForm({ ...form, activityType: e.target.value as ActivityType })}><option value="none">non</option><option value="walk">marche</option><option value="run">course</option><option value="team_sport">sport collectif</option><option value="strength">musculation</option><option value="mobility">mobilité / Circuit Vital</option><option value="other">autre</option></Select></Field><Field label="Durée activité (minutes, optionnel)"><Input type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} /></Field></div><Field label="Qu’est-ce qui a aidé ou bloqué aujourd’hui ?"><Textarea value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} /></Field><Button onClick={submit}>Valider mon check-in</Button></Card>
  </div>;
}
