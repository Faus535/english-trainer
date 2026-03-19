/**
 * Session generator - builds daily sessions from modules.
 * Listening is ALWAYS present (40%). Secondary module rotates.
 * Structure: warm-up (3 min) + listening (8 min) + secondary (5 min) + practice (4 min)
 */

// Secondary module rotation order
const SECONDARY_ROTATION = ['vocabulary', 'grammar', 'phrases', 'pronunciation'];

// ===== Session Generation =====

function generateSession(mode) {
  // mode: 'full' (20 min), 'short' (13 min), 'extended' (30 min)
  mode = mode || 'full';

  const sessionNum = getTotalSessions() + 1;
  const weekSession = getSessionsThisWeek(); // 0-based

  // Listening: always present
  const listeningUnit = getNextUnit('listening');

  // Secondary: rotates based on session number
  const secondaryIdx = weekSession % SECONDARY_ROTATION.length;
  const secondaryModule = SECONDARY_ROTATION[secondaryIdx];
  const secondaryUnit = getNextUnit(secondaryModule);

  // Warm-up: recent items from last completed units
  const warmupItems = buildWarmup();

  const session = {
    id: `session-${Date.now()}`,
    number: sessionNum,
    mode: mode,
    listening: listeningUnit,
    secondary: secondaryUnit,
    secondaryModule: secondaryModule,
    warmup: warmupItems,
    duration: mode === 'short' ? 13 : mode === 'extended' ? 30 : 20,
    blocks: []
  };

  // Build blocks based on mode
  if (mode === 'short') {
    session.blocks = [
      { type: 'warmup', duration: 2, label: 'Repaso rapido' },
      { type: 'listening', duration: 8, label: 'Listening', unit: listeningUnit },
      { type: 'practice', duration: 3, label: 'Practica' },
    ];
  } else if (mode === 'extended') {
    session.blocks = [
      { type: 'warmup', duration: 3, label: 'Repaso' },
      { type: 'listening', duration: 10, label: 'Listening', unit: listeningUnit },
      { type: 'secondary', duration: 7, label: getModuleLabel(secondaryModule), unit: secondaryUnit },
      { type: 'practice', duration: 5, label: 'Practica activa' },
      { type: 'bonus', duration: 5, label: 'Bonus: contenido real' },
    ];
  } else {
    // Full session (default)
    session.blocks = [
      { type: 'warmup', duration: 3, label: 'Repaso' },
      { type: 'listening', duration: 8, label: 'Listening', unit: listeningUnit },
      { type: 'secondary', duration: 5, label: getModuleLabel(secondaryModule), unit: secondaryUnit },
      { type: 'practice', duration: 4, label: 'Practica activa' },
    ];
  }

  return session;
}

function buildWarmup() {
  const items = [];

  // Get recent vocabulary from completed units
  const vocabProgress = getModuleProgress('vocabulary');
  if (vocabProgress.completedUnits.length > 0) {
    items.push({ type: 'vocabulary', desc: 'Repaso de vocabulario reciente', count: 5 });
  }

  // Get recent listening review
  const listeningProgress = getModuleProgress('listening');
  if (listeningProgress.completedUnits.length > 0) {
    items.push({ type: 'listening', desc: 'Repaso de frases de listening', count: 3 });
  }

  // If no previous content, provide a quick start
  if (items.length === 0) {
    items.push({ type: 'intro', desc: 'Bienvenida y preparacion', count: 0 });
  }

  return items;
}

// ===== Current Session State =====

let currentSession = null;
let currentBlockIndex = 0;

function startSession(mode) {
  currentSession = generateSession(mode);
  currentBlockIndex = 0;
  saveState('currentSession', currentSession);
  renderSessionView();
}

function getCurrentSession() {
  if (!currentSession) {
    currentSession = loadState('currentSession', null);
  }
  return currentSession;
}

function advanceBlock() {
  if (!currentSession) return;
  currentBlockIndex++;
  if (currentBlockIndex >= currentSession.blocks.length) {
    completeSession();
    return;
  }
  renderSessionView();
}

function completeSession() {
  if (!currentSession) return;

  // Record completion
  recordSession(currentSession);

  // Mark units as completed
  if (currentSession.listening) {
    completeUnit(currentSession.listening.module, currentSession.listening.unitIndex, 100);
  }
  if (currentSession.secondary) {
    completeUnit(currentSession.secondary.module, currentSession.secondary.unitIndex, 100);
  }

  // Check achievements
  const newAch = checkNewAchievements();
  newAch.forEach(a => showAchievementToast(a));

  // Show completion
  showXPFloat('+50 XP');

  // Clear current session
  currentSession = null;
  currentBlockIndex = 0;
  saveState('currentSession', null);

  // Return to dashboard
  showDashboard();
}

function abandonSession() {
  currentSession = null;
  currentBlockIndex = 0;
  saveState('currentSession', null);
  showDashboard();
}

// ===== Session View Rendering =====

function renderSessionView() {
  const main = document.getElementById('main');
  const session = currentSession;
  if (!session) { showDashboard(); return; }

  const block = session.blocks[currentBlockIndex];
  const progress = ((currentBlockIndex + 1) / session.blocks.length) * 100;

  let h = '<div class="session-view">';

  // Session header
  h += '<div class="session-header">';
  h += `<button class="session-back" data-action="abandonSession" aria-label="Volver al dashboard">&larr;</button>`;
  h += '<div class="session-header-info">';
  h += `<span class="session-title">Sesion ${session.number}</span>`;
  h += `<span class="session-duration">${session.duration} min</span>`;
  h += '</div>';
  h += `<span class="session-block-counter">${currentBlockIndex + 1}/${session.blocks.length}</span>`;
  h += '</div>';

  // Progress bar
  h += '<div class="session-progress">';
  h += `<div class="session-progress-fill" style="width:${progress}%"></div>`;
  h += '</div>';

  // Block indicator pills
  h += '<div class="session-pills">';
  session.blocks.forEach((b, i) => {
    let cls = 'session-pill';
    if (i < currentBlockIndex) cls += ' done';
    if (i === currentBlockIndex) cls += ' active';
    h += `<div class="${cls}">`;
    h += `<span class="pill-label">${escapeHtml(b.label)}</span>`;
    h += `<span class="pill-time">${b.duration} min</span>`;
    h += '</div>';
  });
  h += '</div>';

  // Current block content
  h += '<div class="session-block-content">';
  h += renderSessionBlock(block, session);
  h += '</div>';

  // Navigation
  h += '<div class="session-nav">';
  if (currentBlockIndex < session.blocks.length - 1) {
    h += `<button class="btn-session-next" data-action="advanceBlock">Siguiente bloque &rarr;</button>`;
  } else {
    h += `<button class="btn-session-complete" data-action="completeSession">Completar sesion &#10003;</button>`;
  }
  h += '</div>';

  h += '</div>';
  main.innerHTML = h;
  window.scrollTo(0, 0);
}

function renderSessionBlock(block, session) {
  switch (block.type) {
    case 'warmup': return renderWarmupBlock(session.warmup);
    case 'listening': return renderListeningBlock(block);
    case 'secondary': return renderSecondaryBlock(block);
    case 'practice': return renderPracticeBlock(session);
    case 'bonus': return renderBonusBlock();
    default: return '<p>Bloque no reconocido</p>';
  }
}

function renderWarmupBlock(warmup) {
  let h = '<div class="block-card warmup-block">';
  h += '<h3>Warm-up</h3>';
  h += '<p class="block-desc">Conecta con lo que ya sabes. Empieza sintiendote bien.</p>';

  if (warmup[0] && warmup[0].type === 'intro') {
    h += '<div class="warmup-welcome">';
    h += '<p>Esta es tu primera sesion. Vamos a empezar con lo basico del listening.</p>';
    h += '<p>Recuerda: 15-20 minutos, 3-4 veces por semana. Eso es todo lo que necesitas.</p>';
    h += '</div>';
  } else {
    h += '<div class="warmup-items">';
    for (const item of warmup) {
      h += `<div class="warmup-item">`;
      h += `<span class="warmup-icon">${item.type === 'vocabulary' ? '&#128218;' : '&#127911;'}</span>`;
      h += `<span>${escapeHtml(item.desc)}</span>`;
      h += '</div>';
    }
    h += '</div>';
  }

  h += '</div>';
  return h;
}

function renderListeningBlock(block) {
  const unit = block.unit;
  let h = '<div class="block-card listening-block">';

  if (!unit) {
    h += '<h3>Listening completado</h3>';
    h += '<p>Has completado todos los niveles de listening. &#127881;</p>';
    h += '</div>';
    return h;
  }

  h += `<div class="block-module-badge" style="background:var(--accent)">Listening ${unit.level.toUpperCase()}</div>`;
  h += `<h3>${escapeHtml(unit.unit.title)}</h3>`;
  h += `<p class="block-desc">${escapeHtml(unit.unit.desc)}</p>`;

  // Render content based on unit type
  h += renderUnitContent(unit);

  h += '</div>';
  return h;
}

function renderSecondaryBlock(block) {
  const unit = block.unit;
  let h = '<div class="block-card secondary-block">';

  if (!unit) {
    h += `<h3>${escapeHtml(block.label)} completado</h3>`;
    h += '<p>Has completado este modulo. &#127881;</p>';
    h += '</div>';
    return h;
  }

  const mod = MODULES[unit.module];
  h += `<div class="block-module-badge" style="background:${mod.color}">${escapeHtml(mod.name)} ${unit.level.toUpperCase()}</div>`;
  h += `<h3>${escapeHtml(unit.unit.title)}</h3>`;
  h += `<p class="block-desc">${escapeHtml(unit.unit.desc)}</p>`;

  h += renderUnitContent(unit);

  h += '</div>';
  return h;
}

function renderUnitContent(unitRef) {
  // For now, render a placeholder with the unit info.
  // This will be replaced with actual .md content once the content files are created.
  const unit = unitRef.unit;
  let h = '<div class="unit-content">';

  switch (unit.type) {
    case 'reduced-forms':
    case 'connected-speech':
    case 'rhythm':
    case 'intonation':
    case 'numbers':
    case 'fillers':
    case 'minimal-pairs':
    case 'accents':
    case 'slang':
    case 'idioms':
      h += `<div class="unit-placeholder">`;
      h += `<p>Contenido de: <strong>${escapeHtml(unit.title)}</strong></p>`;
      h += `<p class="unit-placeholder-note">El contenido detallado se cargara desde los ficheros .md del modulo.</p>`;
      h += `</div>`;
      break;

    case 'dictation':
      h += renderDictationExercise(unitRef);
      break;

    case 'shadowing':
      h += renderShadowingExercise(unitRef);
      break;

    case 'immersion':
      h += '<div class="unit-immersion">';
      h += `<p>${escapeHtml(unit.desc)}</p>`;
      h += '<p class="unit-tip">Pon contenido real en ingles. Sin subtitulos en español. Si necesitas, subtitulos en ingles.</p>';
      h += '</div>';
      break;

    case 'review':
      h += '<div class="unit-review">';
      h += `<p>Sesion de repaso y evaluacion.</p>`;
      h += '<p>Revisa los conceptos del nivel actual y prepara el salto al siguiente.</p>';
      h += '</div>';
      break;

    default:
      h += `<div class="unit-placeholder">`;
      h += `<p>${escapeHtml(unit.desc)}</p>`;
      h += `</div>`;
  }

  h += '</div>';
  return h;
}

function renderDictationExercise(unitRef) {
  const videos = DICTATION_VIDEOS || [];
  const video = videos[unitRef.unitIndex % videos.length];
  if (!video) return '<p>Video de dictation no disponible</p>';

  const safeVideoId = /^[\w-]{11}$/.test(video.id) ? video.id : '';
  if (!safeVideoId) return '';

  let h = '<div class="dictation-box">';
  h += '<div class="dictation-steps">';
  h += '<div class="dictation-step"><span class="step-num">1</span> Escucha 30 seg <strong>sin subtitulos</strong></div>';
  h += '<div class="dictation-step"><span class="step-num">2</span> Pausa y escribe lo que oiste</div>';
  h += '<div class="dictation-step"><span class="step-num">3</span> Activa subtitulos y compara</div>';
  h += '<div class="dictation-step"><span class="step-num">4</span> Repite el fragmento 3 veces mas</div>';
  h += '</div>';

  h += '<div class="dictation-video-info">';
  h += `<span class="dictation-channel">${escapeHtml(video.channel)}</span>`;
  h += `<span class="dictation-title">${escapeHtml(video.title)}</span>`;
  h += '</div>';

  h += '<div class="dictation-video-container">';
  h += `<iframe src="https://www.youtube.com/embed/${safeVideoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy" title="${escapeHtml(video.title)}"></iframe>`;
  h += '</div>';

  const noteId = `dict-${unitRef.unit.id}`;
  const savedNote = escapeHtml(loadDictationNote(noteId));
  h += '<div class="dictation-write">';
  h += `<label class="dictation-label" for="${noteId}">Escribe lo que oyes:</label>`;
  h += `<textarea class="dictation-textarea" id="${noteId}" data-action="saveDictNote" data-note-id="${noteId}" placeholder="Escucha, pausa, escribe...">${savedNote}</textarea>`;
  h += '</div>';
  h += '</div>';
  return h;
}

function renderShadowingExercise(unitRef) {
  const videos = SHADOWING_VIDEOS || [];
  const video = videos[unitRef.unitIndex % videos.length];
  if (!video) return '<p>Video de shadowing no disponible</p>';

  const safeVideoId = /^[\w-]{11}$/.test(video.id) ? video.id : '';
  if (!safeVideoId) return '';

  let h = '<div class="shadowing-box">';
  h += '<div class="dictation-steps">';
  h += '<div class="dictation-step"><span class="step-num step-shadow">1</span> Escucha una frase</div>';
  h += '<div class="dictation-step"><span class="step-num step-shadow">2</span> Pausa y <strong>repitela</strong></div>';
  h += '<div class="dictation-step"><span class="step-num step-shadow">3</span> Rebobina y repite <strong>al mismo tiempo</strong></div>';
  h += '<div class="dictation-step"><span class="step-num step-shadow">4</span> Repite 5 veces hasta que suene igual</div>';
  h += '</div>';

  h += '<div class="dictation-video-info">';
  h += `<span class="shadowing-channel">${escapeHtml(video.channel)}</span>`;
  h += `<span class="dictation-title">${escapeHtml(video.title)}</span>`;
  h += '</div>';

  h += '<div class="dictation-video-container">';
  h += `<iframe src="https://www.youtube.com/embed/${safeVideoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy" title="${escapeHtml(video.title)}"></iframe>`;
  h += '</div>';
  h += '</div>';
  return h;
}

function renderPracticeBlock(session) {
  let h = '<div class="block-card practice-block">';
  h += '<h3>Practica activa</h3>';
  h += '<p class="block-desc">Usa lo que has aprendido en este bloque.</p>';

  h += '<div class="practice-exercises">';

  // Listening practice
  if (session.listening && session.listening.unit) {
    h += '<div class="practice-item">';
    h += `<span class="practice-icon">&#127911;</span>`;
    h += `<div>`;
    h += `<strong>Listening</strong>: Repite en voz alta la ultima frase que hayas escuchado, imitando la pronunciacion.`;
    h += `</div>`;
    h += '</div>';
  }

  // Secondary practice
  if (session.secondary && session.secondary.unit) {
    const mod = MODULES[session.secondary.module];
    h += '<div class="practice-item">';
    h += `<span class="practice-icon">${mod.icon}</span>`;
    h += `<div>`;
    h += `<strong>${escapeHtml(mod.name)}</strong>: Escribe 3 frases usando lo que acabas de aprender.`;
    h += `</div>`;
    h += '</div>';
  }

  h += '</div>';
  h += '</div>';
  return h;
}

function renderBonusBlock() {
  let h = '<div class="block-card bonus-block">';
  h += '<h3>Bonus: Contenido real</h3>';
  h += '<p class="block-desc">5 minutos extra con contenido que te guste.</p>';
  h += '<div class="bonus-suggestions">';
  h += '<p>&#127909; Ve 5 min de una serie en ingles sin subtitulos en español</p>';
  h += '<p>&#127911; Pon un podcast en ingles (6 Minute English, All Ears English)</p>';
  h += '<p>&#127925; Escucha una cancion en ingles e intenta seguir la letra</p>';
  h += '</div>';
  h += '</div>';
  return h;
}
