/**
 * State management - localStorage persistence for progress tracking.
 */

const STORAGE_PREFIX = 'english_plan_';
const TOTAL_DAYS = 112;

let completedDays = loadState('completedDays', {});
let completedMilestones = loadState('completedMilestones', {});
let currentView = 'dashboard';

function loadState(key, fallback) {
  try {
    const val = localStorage.getItem(STORAGE_PREFIX + key);
    return val ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
}

function saveState(key, val) {
  localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(val));
}

function toggleDay(dayNum) {
  if (completedDays[dayNum]) {
    delete completedDays[dayNum];
  } else {
    completedDays[dayNum] = true;
    recordActivity();
    showXPFloat('+' + XP_PER_DAY + ' XP');
    const newAch = checkNewAchievements();
    newAch.forEach(a => showAchievementToast(a));
  }
  saveState('completedDays', completedDays);
  render();
}

function toggleMilestone(idx) {
  if (completedMilestones[idx]) {
    delete completedMilestones[idx];
  } else {
    completedMilestones[idx] = true;
    recordActivity();
    const newAch = checkNewAchievements();
    newAch.forEach(a => showAchievementToast(a));
  }
  saveState('completedMilestones', completedMilestones);
  render();
}

function resetProgress() {
  if (confirm('\u00bfReiniciar todo el progreso?')) {
    completedDays = {};
    completedMilestones = {};
    saveState('completedDays', completedDays);
    saveState('completedMilestones', completedMilestones);
    saveState('dictationNotes', {});
    showDashboard();
  }
}

function getNextDay() {
  for (let d = 1; d <= TOTAL_DAYS; d++) {
    if (!completedDays[d]) return d;
  }
  return TOTAL_DAYS;
}

// Dictation notes persistence
function saveDictationNote(dayNum, actIndex, text) {
  const notes = loadState('dictationNotes', {});
  const key = `${dayNum}-${actIndex}`;
  if (text.trim()) {
    notes[key] = text;
  } else {
    delete notes[key];
  }
  saveState('dictationNotes', notes);
}

function loadDictationNote(dayNum, actIndex) {
  const notes = loadState('dictationNotes', {});
  return notes[`${dayNum}-${actIndex}`] || '';
}

// Export/import progress
function exportProgress() {
  const data = {
    version: 1,
    exportedAt: new Date().toISOString(),
    completedDays: completedDays,
    completedMilestones: completedMilestones,
    dictationNotes: loadState('dictationNotes', {})
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `english-trainer-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
