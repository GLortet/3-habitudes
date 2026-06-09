import { defaultHabits } from "@/lib/defaultHabits/defaultHabits";
import type { AppState, AuditResult, CheckIn, Commitment, HabitAnswer, HabitScore } from "@/types";

const frequencyMap = { never: 0, rarely: 1, "1-2": 2.5, "3-4": 4, daily: 5 } as const;
const quantityMap = { low: 1, medium: 3, high: 5 } as const;
const easeMap = { hard: 1, medium: 3, easy: 5 } as const;
const levelMap = { low: 1, medium: 3, high: 5 } as const;
const adherenceScore = { yes: 1, partial: 0.5, no: 0 } as const;
const feelingScore = { very_bad: 1, medium: 2.5, good: 4, very_good: 5 } as const;

export function calculateHabitScore(answer: HabitAnswer): HabitScore {
  const habit = defaultHabits.find((item) => item.id === answer.habitId)!;
  const impactCalories = habit.defaultImpactCalories;
  const frequency = frequencyMap[answer.frequency];
  const quantity = quantityMap[answer.quantity];
  const faciliteChangement = easeMap[answer.ease];
  const motivationUtilisateur = levelMap[answer.perceivedImpact];
  const pertePlaisir = levelMap[answer.pleasure];
  const risqueCraquage = answer.ease === "hard" ? 5 : answer.ease === "medium" ? 3 : 1;
  const scoreCout = impactCalories * 0.4 + frequency * 0.3 + quantity * 0.3;
  const scoreRentabilite = scoreCout * 0.45 + faciliteChangement * 0.25 + motivationUtilisateur * 0.2 - pertePlaisir * 0.1 - risqueCraquage * 0.1;
  return { habitId: answer.habitId, label: habit.label, impactCalories, frequency, quantity, faciliteChangement, motivationUtilisateur, pertePlaisir, risqueCraquage, scoreCout: round(scoreCout), scoreRentabilite: round(scoreRentabilite) };
}

export function rankHabits(answers: Record<string, HabitAnswer>): HabitScore[] {
  return Object.values(answers).map(calculateHabitScore).sort((a, b) => b.scoreRentabilite - a.scoreRentabilite);
}

export function generateRecommendations(answers: Record<string, HabitAnswer>): AuditResult {
  const scores = rankHabits(answers);
  return { generatedAt: new Date().toISOString(), scores, topHabitIds: scores.slice(0, 5).map((score) => score.habitId) };
}

export function generateInsightText(score: HabitScore) {
  const habit = defaultHabits.find((item) => item.id === score.habitId)!;
  const alternative = habit.suggestedAlternatives[0] ?? "Créer une règle simple pendant 14 jours.";
  return {
    why: `${habit.label} ressort comme variable prioritaire car sa fréquence, sa quantité ou sa facilité d’ajustement rendent le levier rentable.`,
    cost: `Ce n’est pas un problème moral. C’est probablement une habitude coûteuse car elle ajoute de la densité, réduit le rassasiement ou se répète souvent.`,
    alternative,
    example: habit.examples[0] ? `Exemple concret : ${habit.examples[0]} → ${alternative}.` : `Exemple concret : une règle visible, simple et répétable pendant 14 jours.`,
    difficulty: score.pertePlaisir >= 4 ? "Difficulté probable : préserver le plaisir sans revenir au pilote automatique." : "Difficulté probable : penser à appliquer la règle dans le bon contexte.",
    encouragement: "Tu gardes le plaisir, tu réduis ce qui pèse trop.",
  };
}

export function calculateAdherenceRate(checkIns: CheckIn[], commitmentId?: string): number {
  const values: number[] = checkIns.flatMap((checkIn) => {
    if (commitmentId) return checkIn.adherence[commitmentId] ? [adherenceScore[checkIn.adherence[commitmentId]]] : [];
    return Object.values(checkIn.adherence).map((value) => adherenceScore[value]);
  });
  if (!values.length) return 0;
  const total = values.reduce<number>((sum, value) => sum + value, 0);
  return Math.round((total / values.length) * 100);
}

export function calculateWeightTrend(checkIns: CheckIn[], startWeight?: number) {
  const weights = checkIns.filter((item) => item.weightKg).map((item) => ({ date: item.date, weightKg: item.weightKg! }));
  const first = startWeight ?? weights[0]?.weightKg;
  const last = weights[weights.length - 1]?.weightKg ?? first;
  const variation = first && last ? round(last - first) : 0;
  const movingAverage = weights.length ? round(weights.slice(-3).reduce((sum, item) => sum + item.weightKg, 0) / Math.min(3, weights.length)) : undefined;
  return { weights, first, last, variation, movingAverage };
}

export function generateFourteenDaySummary(state: AppState) {
  const checkIns = state.checkIns;
  const trend = calculateWeightTrend(checkIns, state.profile?.currentWeightKg);
  const adherence = calculateAdherenceRate(checkIns);
  const averages = getAverages(checkIns);
  const commitments = state.plan?.commitments ?? [];
  const rates = commitments.map((commitment) => ({ commitment, rate: calculateAdherenceRate(checkIns, commitment.id) }));
  const best = [...rates].sort((a, b) => b.rate - a.rate)[0];
  const hardest = [...rates].sort((a, b) => a.rate - b.rate)[0];
  let conclusion = "Continue à mesurer : une donnée n’est pas un jugement.";
  if (trend.variation < 0 && averages.frustration < 3) conclusion = "Le système fonctionne. Continue encore 14 jours avec les mêmes règles.";
  if (trend.variation < 0 && averages.frustration >= 3) conclusion = "Le système marche mais coûte trop cher mentalement. Garde le levier principal et assouplis une règle.";
  if (trend.variation >= 0 && adherence < 70) conclusion = "Le problème n’est pas la méthode, c’est l’adhérence. Choisis des règles plus faciles.";
  if (trend.variation >= 0 && adherence >= 70) conclusion = "Il faut ajuster une variable plus impactante : alcool, grignotage, portions du soir, fromage dense, ou ajouter une activité simple.";
  return { daysLogged: checkIns.length, trend, adherence, averages, best, hardest, conclusion };
}

export function getAverages(checkIns: CheckIn[]) {
  if (!checkIns.length) return { feeling: 0, energy: 0, hunger: 0, frustration: 0, motivation: 0 };
  const total = checkIns.reduce((acc, item) => ({
    feeling: acc.feeling + feelingScore[item.feeling], energy: acc.energy + item.energy, hunger: acc.hunger + item.hunger, frustration: acc.frustration + item.frustration, motivation: acc.motivation + item.motivation,
  }), { feeling: 0, energy: 0, hunger: 0, frustration: 0, motivation: 0 });
  return { feeling: round(total.feeling / checkIns.length), energy: round(total.energy / checkIns.length), hunger: round(total.hunger / checkIns.length), frustration: round(total.frustration / checkIns.length), motivation: round(total.motivation / checkIns.length) };
}

export function getSmartFeedback(checkIn: CheckIn, previous: CheckIn[], startWeight?: number) {
  const respected = Object.values(checkIn.adherence).filter((value) => value === "yes").length;
  const messages = [respected === 3 ? "Très propre. Tu n’as pas besoin d’être parfait, mais aujourd’hui tu as piloté ton système." : respected > 0 ? "Bonne journée de test. L’objectif n’est pas la perfection, c’est de comprendre ce qui marche." : "Ce n’est pas un échec. C’est une donnée. Regarde le contexte, pas seulement le résultat."];
  if (checkIn.frustration >= 4) messages.push("Ta règle est peut-être trop dure. Si la frustration reste élevée 3 jours de suite, il faudra ajuster.");
  if (checkIn.hunger >= 4) messages.push("Vérifie si tu as assez de protéines, de légumes, d’eau et de volume alimentaire.");
  const trend = calculateWeightTrend([...previous, checkIn], startWeight);
  if (trend.variation > 0 && respected === 3) messages.push("Une variation ponctuelle est normale. Eau, sel, digestion et glycogène peuvent masquer la tendance.");
  return messages;
}

function round(value: number) { return Math.round(value * 10) / 10; }
