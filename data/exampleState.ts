import type { AppState } from "@/types";

export const exampleState: AppState = {
  profile: { name: "Alex", age: 38, heightCm: 180, currentWeightKg: 105, targetWeightKg: 96, activityLevel: "Modéré mais irrégulier", sportSessionsPerWeek: 1, averageSteps: 6500, mainMotivation: "perdre du poids sans régime extrême" },
  answers: {
    alcool: { habitId: "alcool", frequency: "3-4", quantity: "high", pleasure: "high", ease: "medium", perceivedImpact: "high", context: "soiree" },
    fromage: { habitId: "fromage", frequency: "daily", quantity: "medium", pleasure: "high", ease: "easy", perceivedImpact: "high", context: "fatigue" },
    "pain-viennoiseries": { habitId: "pain-viennoiseries", frequency: "3-4", quantity: "medium", pleasure: "medium", ease: "medium", perceivedImpact: "high", context: "travail" },
    "repas-soir": { habitId: "repas-soir", frequency: "3-4", quantity: "high", pleasure: "high", ease: "medium", perceivedImpact: "high", context: "fatigue" },
    "activite-physique": { habitId: "activite-physique", frequency: "daily", quantity: "medium", pleasure: "low", ease: "easy", perceivedImpact: "high", context: "sport" },
  },
  checkIns: [],
};
