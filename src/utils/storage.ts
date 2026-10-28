import { StudentSubmission, KKM_SCORE } from '../types';
import { INITIAL_MOCK_SUBMISSIONS } from '../data/mockSubmissions';

const STORAGE_KEY_SUBMISSIONS = 'ar_rohmah_asesmen_submissions_v1';

export function getSubmissions(): StudentSubmission[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SUBMISSIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_SUBMISSIONS, JSON.stringify(INITIAL_MOCK_SUBMISSIONS));
      return INITIAL_MOCK_SUBMISSIONS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading submissions from localStorage', err);
    return INITIAL_MOCK_SUBMISSIONS;
  }
}

export function saveSubmission(submission: StudentSubmission): void {
  try {
    const current = getSubmissions();
    const updated = [submission, ...current.filter((s) => s.id !== submission.id)];
    localStorage.setItem(STORAGE_KEY_SUBMISSIONS, JSON.stringify(updated));
  } catch (err) {
    console.error('Error saving submission to localStorage', err);
  }
}

export function updateSubmissionScore(
  id: string,
  updatedFields: Partial<StudentSubmission>
): StudentSubmission[] {
  try {
    const current = getSubmissions();
    const updated = current.map((sub) => {
      if (sub.id === id) {
        const merged = { ...sub, ...updatedFields };
        merged.totalScore = merged.scorePG + merged.scoreEssay;
        merged.isPassed = merged.totalScore >= KKM_SCORE && !merged.isDisqualified;
        return merged;
      }
      return sub;
    });
    localStorage.setItem(STORAGE_KEY_SUBMISSIONS, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Error updating submission score', err);
    return getSubmissions();
  }
}

export function resetSubmissionsToDefault(): StudentSubmission[] {
  try {
    localStorage.setItem(STORAGE_KEY_SUBMISSIONS, JSON.stringify(INITIAL_MOCK_SUBMISSIONS));
    return INITIAL_MOCK_SUBMISSIONS;
  } catch {
    return INITIAL_MOCK_SUBMISSIONS;
  }
}

// Web Audio API beep alert for anti-cheating warning
export function playAlertSound(type: 'warning' | 'penalty' | 'success' = 'warning') {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'warning') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.5);
    } else if (type === 'penalty') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.setValueAtTime(140, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.8);
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.4);
    }
  } catch (err) {
    console.warn('Audio feedback error', err);
  }
}
