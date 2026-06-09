import type { AppState } from "@/types";

export const STORAGE_KEY = "audit-habitudes-minceur:v1";
export const emptyState: AppState = { answers: {}, checkIns: [] };

export function saveState(state: AppState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function loadState(): AppState {
  if (typeof window === "undefined") return emptyState;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return emptyState;
  const parsed = JSON.parse(raw) as AppState;
  return { ...emptyState, ...parsed, answers: parsed.answers ?? {}, checkIns: parsed.checkIns ?? [] };
}

export function clearState() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export function exportState(state: AppState) {
  return JSON.stringify({ exportedAt: new Date().toISOString(), app: "Audit Habitudes Minceur", version: 1, state }, null, 2);
}

export function importState(json: string): AppState {
  const parsed = JSON.parse(json) as { state?: AppState } | AppState;
  const state: AppState = "state" in parsed && parsed.state ? parsed.state : (parsed as AppState);
  return { ...emptyState, ...state, answers: state.answers ?? {}, checkIns: state.checkIns ?? [] };
}
