import { PersonalRecord, DailyStepRecord, WorkoutSession } from '../types/fitness';

const API_BASE = '/api';

export const apiSync = {
  // Check backend health
  async checkHealth(): Promise<{ databaseConnected: boolean }> {
    try {
      const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(2000) });
      if (!res.ok) return { databaseConnected: false };
      return await res.json();
    } catch {
      return { databaseConnected: false };
    }
  },

  // Steps
  async getSteps(): Promise<DailyStepRecord[] | null> {
    try {
      const res = await fetch(`${API_BASE}/steps`, { signal: AbortSignal.timeout(3000) });
      if (!res.ok) return null;
      const data = await res.json();
      return data.success ? data.data : null;
    } catch {
      return null;
    }
  },

  async saveSteps(date: string, steps: number): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/steps`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, steps }),
        signal: AbortSignal.timeout(3000)
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  // PRs
  async getPrs(): Promise<PersonalRecord[] | null> {
    try {
      const res = await fetch(`${API_BASE}/prs`, { signal: AbortSignal.timeout(3000) });
      if (!res.ok) return null;
      const data = await res.json();
      return data.success ? data.data : null;
    } catch {
      return null;
    }
  },

  async savePr(pr: PersonalRecord): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/prs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pr),
        signal: AbortSignal.timeout(3000)
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async deletePr(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/prs/${id}`, {
        method: 'DELETE',
        signal: AbortSignal.timeout(3000)
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  // Workouts
  async getWorkout(date: string): Promise<WorkoutSession | null> {
    try {
      const res = await fetch(`${API_BASE}/workouts/${date}`, { signal: AbortSignal.timeout(3000) });
      if (!res.ok) return null;
      const data = await res.json();
      return data.success ? data.data : null;
    } catch {
      return null;
    }
  },

  async saveWorkout(workout: WorkoutSession): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/workouts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workout),
        signal: AbortSignal.timeout(3000)
      });
      return res.ok;
    } catch {
      return false;
    }
  }
};
