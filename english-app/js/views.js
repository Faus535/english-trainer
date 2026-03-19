/**
 * View rendering - Modular dashboard and session views.
 * Replaces the old week/day linear system.
 */

let currentView = 'dashboard';

function render() {
  if (!isTestCompleted()) {
    testState.phase = 'intro';
    renderTest();
    return;
  }
  if (currentView === 'dashboard') {
    renderDashboard();
  }
  // Session view is handled by session.js
}

// ===== Dashboard =====

function renderDashboard() {
  const main = document.getElementById('main');
  currentView = 'dashboard';

  const profile = getProfile();
  const sessionsWeek = getSessionsThisWeek();
  const totalSessions = getTotalSessions();
  const streak = getStreak();

  let h = '<div class="dashboard">';

  // Gamification header
  h += renderGamificationHeader();

  // Quick start card
  h += renderQuickStart(sessionsWeek);

  // Module progress cards
  h += '<h3 class="section-title">Tus modulos</h3>';
  h += '<div class="modules-grid">';
  for (const modName of MODULE_NAMES) {
    h += renderModuleCard(modName);
  }
  h += '</div>';

  // Widgets
  h += '<div class="dashboard-widgets">';
  h += renderSoundOfTheDay();
  h += renderPhraseRoulette();
  h += '</div>';

  // Stats
  h += '<div class="stats-summary">';
  h += `<div class="stat-item"><span class="stat-value">${totalSessions}</span><span class="stat-label">Sesiones</span></div>`;
  h += `<div class="stat-item"><span class="stat-value">${sessionsWeek}/4</span><span class="stat-label">Esta semana</span></div>`;
  h += `<div class="stat-item"><span class="stat-value">${streak}</span><span class="stat-label">Racha</span></div>`;
  h += `<div class="stat-item"><span class="stat-value">${getOverallLevel().toUpperCase()}</span><span class="stat-label">Nivel</span></div>`;
  h += '</div>';

  // Weekly target
  if (sessionsWeek >= 3) {
    h += '<div class="weekly-target done">';
    h += `<p>&#10003; Objetivo semanal cumplido (${sessionsWeek}/3-4 sesiones)</p>`;
    h += '</div>';
  } else {
    const remaining = 3 - sessionsWeek;
    h += '<div class="weekly-target">';
    h += `<p>Te faltan <strong>${remaining}</strong> sesion${remaining > 1 ? 'es' : ''} esta semana para cumplir tu objetivo.</p>`;
    h += '</div>';
  }

  // Motivation
  const motiv = MOTIVATIONS[new Date().getDate() % MOTIVATIONS.length];
  h += `<div class="motivation-box"><p>${escapeHtml(motiv)}</p></div>`;

  h += '</div>';
  main.innerHTML = h;

  // Update progress bar
  updateProgressBar();
}

function renderQuickStart(sessionsWeek) {
  const pendingSession = getCurrentSession();

  let h = '<div class="quick-start">';

  if (pendingSession) {
    h += '<h2>Tienes una sesion en curso</h2>';
    h += '<p>Retoma donde lo dejaste.</p>';
    h += '<div class="quick-start-buttons">';
    h += '<button class="btn-start-session" data-action="resumeSession">Continuar sesion</button>';
    h += '<button class="btn-session-alt" data-action="abandonSession">Empezar de nuevo</button>';
    h += '</div>';
  } else {
    const nextListening = getNextUnit('listening');
    const nextLabel = nextListening
      ? `Siguiente: ${nextListening.unit.title}`
      : 'Has completado todo el contenido';

    h += '<h2>Tu sesion de hoy</h2>';
    h += `<p class="quick-start-next">${escapeHtml(nextLabel)}</p>`;
    h += '<div class="quick-start-buttons">';
    h += '<button class="btn-start-session" data-action="startSession" data-mode="full">Sesion completa <span class="btn-time">20 min</span></button>';
    h += '<button class="btn-session-alt" data-action="startSession" data-mode="short">Sesion corta <span class="btn-time">13 min</span></button>';
    h += '<button class="btn-session-alt" data-action="startSession" data-mode="extended">Sesion extendida <span class="btn-time">30 min</span></button>';
    h += '</div>';
  }

  h += '</div>';
  return h;
}

function renderModuleCard(moduleName) {
  const mod = MODULES[moduleName];
  const level = getModuleLevel(moduleName);
  const pct = getModuleCompletionPercent(moduleName);
  const nextUnit = getNextUnit(moduleName);
  const progress = getModuleProgress(moduleName);

  let h = `<div class="module-card">`;
  h += `<div class="module-card-header">`;
  h += `<span class="module-icon" aria-hidden="true">${mod.icon}</span>`;
  h += `<div class="module-info">`;
  h += `<span class="module-name">${escapeHtml(mod.name)}</span>`;
  h += `<span class="module-level" style="color:${mod.color}">${level.toUpperCase()}</span>`;
  h += `</div>`;
  h += `</div>`;

  // Progress bar
  h += '<div class="module-progress-bar">';
  h += `<div class="module-progress-fill" style="width:${pct}%; background:${mod.color}"></div>`;
  h += '</div>';

  // Next unit
  if (nextUnit) {
    h += `<div class="module-next">${escapeHtml(nextUnit.unit.title)}</div>`;
  } else {
    h += `<div class="module-next module-complete">&#10003; Modulo completado</div>`;
  }

  // Units completed at current level
  const config = getModuleConfig(moduleName, level);
  if (config) {
    h += `<div class="module-units">${progress.completedUnits.length}/${config.totalUnits} unidades ${level.toUpperCase()}</div>`;
  }

  h += '</div>';
  return h;
}

function updateProgressBar() {
  const bar = document.getElementById('progressBar');
  const text = document.getElementById('progressText');
  const container = document.getElementById('progressContainer');
  if (!bar || !text) return;

  // Calculate overall progress based on module completion
  let totalPct = 0;
  for (const mod of MODULE_NAMES) {
    totalPct += getModuleCompletionPercent(mod);
  }
  const avgPct = Math.round(totalPct / MODULE_NAMES.length);

  bar.style.width = avgPct + '%';
  text.textContent = `Nivel: ${getOverallLevel().toUpperCase()} — ${avgPct}% completado`;
  if (container) container.setAttribute('aria-valuenow', avgPct);
}

// ===== Navigation =====

function showDashboard() {
  currentView = 'dashboard';
  currentSession = null;
  render();
}

function resumeSession() {
  const session = getCurrentSession();
  if (session) {
    currentSession = session;
    renderSessionView();
  }
}
