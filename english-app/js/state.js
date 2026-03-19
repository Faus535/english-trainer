/**
 * State management - modular system with per-module level tracking.
 * Replaces the old linear day-based system.
 */

const STORAGE_PREFIX = 'english_modular_';
const CEFR_LEVELS = ['a1', 'a2', 'b1', 'b2', 'c1'];
const MODULE_NAMES = ['listening', 'vocabulary', 'grammar', 'phrases', 'pronunciation'];

// ===== Core state loading/saving =====

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

// ===== Profile =====

function getProfile() {
  return loadState('profile', {
    testCompleted: false,
    levels: {},
    moduleProgress: {},
    sessionCount: 0,
    sessionsThisWeek: 0,
    weekStart: null
  });
}

function saveProfile(profile) {
  saveState('profile', profile);
}

function isTestCompleted() {
  return getProfile().testCompleted;
}

function getModuleLevel(moduleName) {
  const profile = getProfile();
  return profile.levels[moduleName] || 'a1';
}

function setModuleLevel(moduleName, level) {
  const profile = getProfile();
  profile.levels[moduleName] = level;
  saveProfile(profile);
}

function getLevelIndex(level) {
  return CEFR_LEVELS.indexOf(level);
}

function getNextLevel(level) {
  const idx = getLevelIndex(level);
  return idx < CEFR_LEVELS.length - 1 ? CEFR_LEVELS[idx + 1] : null;
}

// ===== Module Progress =====

function getModuleProgress(moduleName) {
  const profile = getProfile();
  const level = getModuleLevel(moduleName);
  const key = `${moduleName}-${level}`;
  return profile.moduleProgress[key] || {
    currentUnit: 0,
    completedUnits: [],
    scores: {}
  };
}

function saveModuleProgress(moduleName, progress) {
  const profile = getProfile();
  const level = getModuleLevel(moduleName);
  const key = `${moduleName}-${level}`;
  profile.moduleProgress[key] = progress;
  saveProfile(profile);
}

function completeUnit(moduleName, unitIndex, score) {
  const progress = getModuleProgress(moduleName);

  if (!progress.completedUnits.includes(unitIndex)) {
    progress.completedUnits.push(unitIndex);
  }
  progress.scores[unitIndex] = score;

  // Advance to next unit
  const nextUnit = unitIndex + 1;
  if (nextUnit > progress.currentUnit) {
    progress.currentUnit = nextUnit;
  }

  saveModuleProgress(moduleName, progress);

  // Check level-up
  checkLevelUp(moduleName);
  return progress;
}

function checkLevelUp(moduleName) {
  const level = getModuleLevel(moduleName);
  const progress = getModuleProgress(moduleName);
  const moduleConfig = getModuleConfig(moduleName, level);
  if (!moduleConfig) return false;

  const totalUnits = moduleConfig.totalUnits;
  const completed = progress.completedUnits.length;

  // Level up if completed all units at this level
  if (completed >= totalUnits) {
    const next = getNextLevel(level);
    if (next) {
      setModuleLevel(moduleName, next);
      return true;
    }
  }
  return false;
}

// ===== Session Tracking =====

function getSessionHistory() {
  return loadState('sessionHistory', []);
}

function recordSession(session) {
  const history = getSessionHistory();
  history.push({
    date: new Date().toISOString(),
    listening: session.listening,
    secondary: session.secondary,
    duration: session.duration || 20
  });
  saveState('sessionHistory', history);

  // Update profile counts
  const profile = getProfile();
  profile.sessionCount = (profile.sessionCount || 0) + 1;
  updateWeeklyCount(profile);
  saveProfile(profile);

  // Record activity for streaks
  recordActivity();
}

function updateWeeklyCount(profile) {
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  monday.setHours(0, 0, 0, 0);
  const weekStart = monday.toISOString().slice(0, 10);

  if (profile.weekStart !== weekStart) {
    profile.weekStart = weekStart;
    profile.sessionsThisWeek = 1;
  } else {
    profile.sessionsThisWeek = (profile.sessionsThisWeek || 0) + 1;
  }
}

function getSessionsThisWeek() {
  const profile = getProfile();
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  monday.setHours(0, 0, 0, 0);
  const weekStart = monday.toISOString().slice(0, 10);

  if (profile.weekStart !== weekStart) return 0;
  return profile.sessionsThisWeek || 0;
}

function getTotalSessions() {
  return getProfile().sessionCount || 0;
}

// ===== Warm-up Data =====

function getRecentCompletedItems(moduleName, count) {
  const progress = getModuleProgress(moduleName);
  const recent = progress.completedUnits.slice(-count);
  return recent;
}

// ===== Streaks (reused from old system) =====

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

function recordActivity() {
  const history = loadState('activityDates', {});
  history[getToday()] = true;
  saveState('activityDates', history);
}

function getStreak() {
  const history = loadState('activityDates', {});
  let streak = 0;
  const d = new Date();
  if (history[d.toISOString().slice(0, 10)]) {
    streak = 1;
    d.setDate(d.getDate() - 1);
  }
  while (history[d.toISOString().slice(0, 10)]) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

function getBestStreak() {
  const history = loadState('activityDates', {});
  const dates = Object.keys(history).sort();
  if (!dates.length) return 0;
  let best = 1, current = 1;
  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1]);
    const curr = new Date(dates[i]);
    const diff = (curr - prev) / 86400000;
    if (diff === 1) {
      current++;
      if (current > best) best = current;
    } else if (diff > 1) {
      current = 1;
    }
  }
  return best;
}

// ===== Dictation notes (kept from old system) =====

function saveDictationNote(sessionId, text) {
  const notes = loadState('dictationNotes', {});
  if (text.trim()) {
    notes[sessionId] = text;
  } else {
    delete notes[sessionId];
  }
  saveState('dictationNotes', notes);
}

function loadDictationNote(sessionId) {
  const notes = loadState('dictationNotes', {});
  return notes[sessionId] || '';
}

// ===== Reset =====

function resetProgress() {
  if (confirm('¿Reiniciar todo el progreso? Esto borrara tu test de nivel y progreso en todos los modulos.')) {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_PREFIX)) {
        keys.push(key);
      }
    }
    keys.forEach(k => localStorage.removeItem(k));
    location.reload();
  }
}

// ===== Export =====

function exportProgress() {
  const data = {
    version: 2,
    system: 'modular',
    exportedAt: new Date().toISOString(),
    profile: getProfile(),
    sessionHistory: getSessionHistory(),
    activityDates: loadState('activityDates', {}),
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
