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

  // Audio skills (always present in sessions)
  h += '<h3 class="section-title">Skills de audio (en cada sesion)</h3>';
  h += '<div class="modules-grid modules-audio">';
  h += renderModuleCard('listening');
  h += renderModuleCard('pronunciation');
  h += '</div>';

  // Secondary modules (rotate)
  h += '<h3 class="section-title">Modulos secundarios (rotan)</h3>';
  h += '<div class="modules-grid">';
  for (const modName of ['vocabulary', 'grammar', 'phrases']) {
    h += renderModuleCard(modName);
  }
  h += '</div>';

  // Mini-test prompt (if due)
  if (typeof shouldTriggerMiniTest === 'function' && shouldTriggerMiniTest()) {
    h += '<div class="mini-test-prompt">';
    h += '<h3>Mini-test disponible</h3>';
    h += '<p>Es hora de medir tu progreso. 15 preguntas, ~5 minutos.</p>';
    h += '<button class="btn-start-test" data-action="triggerMiniTest">Hacer mini-test</button>';
    h += '</div>';
  }

  // Test results summary
  h += renderTestResultsSummary();

  // Progress chart from mini-tests
  h += renderDashboardProgressChart();

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
    h += '<button class="btn-start-session" data-action="startSession" data-mode="full">Sesion completa <span class="btn-time">21 min</span></button>';
    h += '<button class="btn-session-alt" data-action="startSession" data-mode="short">Sesion corta <span class="btn-time">14 min</span></button>';
    h += '<button class="btn-session-alt" data-action="startSession" data-mode="extended">Sesion extendida <span class="btn-time">31 min</span></button>';
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

// ===== Test Results Summary =====

function renderTestResultsSummary() {
  const profile = getProfile();
  if (!profile.testCompleted || !profile.levels) return '';
  const levels = profile.levels;

  const adaptive = typeof getAdaptiveDifficulty === 'function' ? getAdaptiveDifficulty() : {};

  let h = '<div class="test-summary-card">';
  h += '<h3>Tu nivel actual</h3>';
  h += '<div class="test-summary-levels">';
  for (const mod of MODULE_NAMES) {
    const lvl = (levels[mod] || 'a1').toUpperCase();
    h += `<div class="test-summary-level"><span class="tsl-module">${getModuleLabel(mod)}</span><span class="tsl-value">${lvl}</span></div>`;
  }
  h += '</div>';

  if (adaptive.ttsSpeedAdjust) {
    const dir = adaptive.ttsSpeedAdjust > 0 ? '+' : '';
    h += `<div class="test-summary-adaptive">Ajuste de velocidad: ${dir}${adaptive.ttsSpeedAdjust.toFixed(1)}x</div>`;
  }

  h += '</div>';
  return h;
}

// ===== Dashboard Progress Chart =====

function renderDashboardProgressChart() {
  if (typeof getMiniTestHistory !== 'function') return '';
  const history = getMiniTestHistory();
  if (history.length === 0) return '';

  const skills = ['vocabulary', 'grammar', 'listening', 'pronunciation'];
  const colors = { vocabulary: 'var(--green)', grammar: 'var(--accent2)', listening: 'var(--accent)', pronunciation: 'var(--purple, var(--accent2))' };
  const labels = { vocabulary: 'Vocab', grammar: 'Gram', listening: 'List', pronunciation: 'Pron' };

  let h = '<div class="dashboard-chart">';
  h += '<h3>Progreso en mini-tests</h3>';

  // Legend
  h += '<div class="chart-legend">';
  for (const skill of skills) {
    h += `<span class="chart-legend-item"><span class="chart-legend-color" style="background:${colors[skill]}"></span>${labels[skill]}</span>`;
  }
  h += '</div>';

  // Chart
  const maxBars = 8;
  const recent = history.slice(-maxBars);
  h += '<div class="chart-bars">';
  recent.forEach((entry, idx) => {
    h += '<div class="chart-bar-group">';
    for (const skill of skills) {
      const pct = Math.round((entry.scores[skill] || 0) * 100);
      h += `<div class="chart-bar" style="height:${pct}%; background:${colors[skill]}" title="${labels[skill]}: ${pct}%"></div>`;
    }
    h += `<div class="chart-bar-label">#${idx + 1}</div>`;
    h += '</div>';
  });
  h += '</div>';

  // Trend
  if (recent.length >= 2) {
    const prev = recent[recent.length - 2].scores;
    const last = recent[recent.length - 1].scores;
    h += '<div class="chart-trends">';
    for (const skill of skills) {
      const diff = (last[skill] || 0) - (prev[skill] || 0);
      const arrow = diff > 0.05 ? '&#9650;' : diff < -0.05 ? '&#9660;' : '&#9644;';
      const cls = diff > 0.05 ? 'trend-up' : diff < -0.05 ? 'trend-down' : 'trend-stable';
      h += `<span class="chart-trend ${cls}">${labels[skill]} ${arrow}</span>`;
    }
    h += '</div>';
  }

  h += '</div>';
  return h;
}
