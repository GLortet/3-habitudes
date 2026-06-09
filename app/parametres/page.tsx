"use client";
import type { ChangeEvent } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { clearState, emptyState, exportState, importState, loadState, saveState } from "@/lib/storage";
import type { AppState } from "@/types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field, Input } from "@/components/ui/Field";
import { PageHeader } from "@/components/PageHeader";

export default function SettingsPage() {
  const router = useRouter();
  const [state, setState] = useState<AppState>(emptyState);
  const [message, setMessage] = useState("");
  useEffect(() => setState(loadState()), []);
  const persist = (next: AppState) => { setState(next); saveState(next); };
  const download = () => { const blob = new Blob([exportState(state)], { type: "application/json" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `audit-habitudes-${new Date().toISOString().slice(0, 10)}.json`; a.click(); URL.revokeObjectURL(url); };
  const upload = async (event: ChangeEvent<HTMLInputElement>) => { const file = event.target.files?.[0]; if (!file) return; const next = importState(await file.text()); persist(next); setMessage("Sauvegarde importée. Tu peux reprendre ton test."); };
  const resetTest = () => persist({ ...state, plan: undefined, checkIns: [] });
  const deleteAll = () => { clearState(); setState(emptyState); setMessage("Données locales supprimées."); };
  return <div><PageHeader eyebrow="Paramètres" title="Sauvegarde, import et données locales" subtitle="Tes données restent dans le navigateur en V1. Exporte un JSON si tu veux une sauvegarde locale." />
    {message && <p className="mb-4 rounded-2xl bg-sage-50 p-4 font-semibold text-slateblue">{message}</p>}
    <div className="grid gap-4 lg:grid-cols-2"><Card><h2 className="text-xl font-black">Export / Import</h2><div className="mt-4 flex flex-col gap-3"><Button onClick={download}>Exporter mes données en JSON</Button><label className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-bold text-ink ring-1 ring-sage-100"><input className="hidden" type="file" accept="application/json" onChange={upload} />Importer mes données JSON</label></div></Card>
      <Card><h2 className="text-xl font-black">Modifier mes informations de base</h2><div className="mt-4 grid gap-3 sm:grid-cols-2"><Field label="Pseudo"><Input value={state.profile?.name ?? ""} onChange={(e) => persist({ ...state, profile: { name: e.target.value, activityLevel: state.profile?.activityLevel ?? "", mainMotivation: state.profile?.mainMotivation ?? "perdre du poids", age: state.profile?.age, heightCm: state.profile?.heightCm, currentWeightKg: state.profile?.currentWeightKg, targetWeightKg: state.profile?.targetWeightKg, sportSessionsPerWeek: state.profile?.sportSessionsPerWeek, averageSteps: state.profile?.averageSteps } })} /></Field><Field label="Poids actuel"><Input type="number" value={state.profile?.currentWeightKg ?? ""} onChange={(e) => persist({ ...state, profile: { name: state.profile?.name ?? "", activityLevel: state.profile?.activityLevel ?? "", mainMotivation: state.profile?.mainMotivation ?? "perdre du poids", currentWeightKg: Number(e.target.value) || undefined } })} /></Field></div></Card>
      <Card><h2 className="text-xl font-black">Réinitialiser le test</h2><p className="mt-2 text-slateblue">Conserve l’audit, mais supprime les engagements et check-ins pour recommencer un cycle.</p><Button className="mt-4" variant="secondary" onClick={resetTest}>Réinitialiser le test</Button></Card>
      <Card><h2 className="text-xl font-black">Avertissement santé</h2><p className="mt-2 text-slateblue">Cet outil n’est pas un dispositif médical. En cas de pathologie, trouble alimentaire, grossesse, traitement médical ou doute important, demandez l’avis d’un professionnel de santé.</p><Button className="mt-4" variant="ghost" onClick={() => router.push("/")}>Relire l’accueil</Button></Card>
      <Card className="lg:col-span-2"><h2 className="text-xl font-black">Supprimer toutes les données locales</h2><p className="mt-2 text-slateblue">Action locale dans ce navigateur. Pense à exporter avant si tu veux garder une sauvegarde.</p><Button className="mt-4 bg-red-700 hover:bg-red-600" onClick={deleteAll}>Supprimer toutes les données locales</Button></Card></div>
  </div>;
}
