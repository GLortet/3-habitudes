export type Frequency = "never" | "rarely" | "1-2" | "3-4" | "daily";
export type Quantity = "low" | "medium" | "high";
export type Level = "low" | "medium" | "high";
export type Ease = "hard" | "medium" | "easy";
export type Context = "seul" | "travail" | "famille" | "soiree" | "stress" | "fatigue" | "weekend" | "sport" | "autre";
export type Adherence = "yes" | "partial" | "no";
export type Feeling = "very_bad" | "medium" | "good" | "very_good";
export type ActivityType = "none" | "walk" | "run" | "team_sport" | "strength" | "mobility" | "other";

export interface UserProfile {
  name: string;
  age?: number;
  heightCm?: number;
  currentWeightKg?: number;
  targetWeightKg?: number;
  activityLevel: string;
  sportSessionsPerWeek?: number;
  averageSteps?: number;
  mainMotivation: string;
}

export interface HabitCategory {
  id: string;
  label: string;
  description: string;
  category: string;
  defaultImpactCalories: number;
  examples: string[];
  suggestedAlternatives: string[];
  warningText?: string;
}

export interface HabitQuestion {
  id: string;
  label: string;
  type: "choice" | "number" | "text";
  options?: string[];
}

export interface HabitAnswer {
  habitId: string;
  frequency: Frequency;
  quantity: Quantity;
  pleasure: Level;
  ease: Ease;
  perceivedImpact: Level;
  context: Context;
}

export interface HabitScore {
  habitId: string;
  label: string;
  impactCalories: number;
  frequency: number;
  quantity: number;
  faciliteChangement: number;
  motivationUtilisateur: number;
  pertePlaisir: number;
  risqueCraquage: number;
  scoreCout: number;
  scoreRentabilite: number;
}

export interface AuditResult {
  generatedAt: string;
  scores: HabitScore[];
  topHabitIds: string[];
}

export interface Commitment {
  id: string;
  habitId: string;
  currentHabit: string;
  newRule: string;
  difficulty: "facile" | "moyen" | "difficile";
  riskContext: string;
  replacementSolution: string;
  personalCommitment: string;
}

export interface WeightEntry { date: string; weightKg: number; }
export interface FeelingEntry { date: string; feeling: Feeling; energy: number; hunger: number; frustration: number; motivation: number; }
export interface ActivityEntry { type: ActivityType; durationMinutes?: number; }

export interface CheckIn {
  id: string;
  date: string;
  weightKg?: number;
  adherence: Record<string, Adherence>;
  feeling: Feeling;
  energy: number;
  hunger: number;
  frustration: number;
  motivation: number;
  activity: ActivityEntry;
  note?: string;
}

export interface FourteenDayPlan {
  startDate: string;
  commitments: Commitment[];
}

export interface AppState {
  profile?: UserProfile;
  answers: Record<string, HabitAnswer>;
  auditResult?: AuditResult;
  plan?: FourteenDayPlan;
  checkIns: CheckIn[];
}
