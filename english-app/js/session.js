/**
 * Session generator - builds daily sessions from modules.
 * Listening (35%) and Pronunciation (20%) are ALWAYS present.
 * Secondary module rotates: vocabulary, grammar, phrases.
 * Every 5th session is an integrator (cross-module themed session).
 * Structure: warm-up (3 min) + listening (7 min) + pronunciation (4 min) + secondary (4 min) + practice (3 min)
 */

// Secondary module rotation order (pronunciation removed — now fixed)
const SECONDARY_ROTATION = ['vocabulary', 'grammar', 'phrases'];

// ===== Session Generation =====

function generateSession(mode) {
  // mode: 'full' (21 min), 'short' (14 min), 'extended' (31 min)
  mode = mode || 'full';

  const sessionNum = getTotalSessions() + 1;
  const weekSession = getSessionsThisWeek(); // 0-based

  // Check for integrator session (every 5th session, after the first)
  const isIntegrator = sessionNum > 1 && sessionNum % 5 === 0 && typeof INTEGRATOR_SESSIONS !== 'undefined';

  // Listening: always present
  const listeningUnit = getNextUnit('listening');

  // Pronunciation: always present (new!)
  const pronunciationUnit = getNextUnit('pronunciation');

  // Secondary: rotates based on session number (vocab → grammar → phrases)
  const secondaryIdx = weekSession % SECONDARY_ROTATION.length;
  const secondaryModule = SECONDARY_ROTATION[secondaryIdx];
  const secondaryUnit = getNextUnit(secondaryModule);

  // Warm-up: spaced repetition review or intro
  const warmupItems = buildWarmup();

  const session = {
    id: `session-${Date.now()}`,
    number: sessionNum,
    mode: mode,
    isIntegrator: isIntegrator,
    listening: listeningUnit,
    pronunciation: pronunciationUnit,
    secondary: secondaryUnit,
    secondaryModule: secondaryModule,
    warmup: warmupItems,
    duration: mode === 'short' ? 14 : mode === 'extended' ? 31 : 21,
    blocks: []
  };

  // Build blocks based on mode
  if (mode === 'short') {
    session.blocks = [
      { type: 'warmup', duration: 2, label: 'Repaso rapido' },
      { type: 'listening', duration: 7, label: 'Listening', unit: listeningUnit },
      { type: 'pronunciation', duration: 3, label: 'Pronunciacion', unit: pronunciationUnit },
      { type: 'practice', duration: 2, label: 'Practica' },
    ];
  } else if (mode === 'extended') {
    session.blocks = [
      { type: 'warmup', duration: 3, label: 'Repaso espaciado' },
      { type: 'listening', duration: 9, label: 'Listening', unit: listeningUnit },
      { type: 'pronunciation', duration: 5, label: 'Pronunciacion', unit: pronunciationUnit },
      { type: 'secondary', duration: 5, label: getModuleLabel(secondaryModule), unit: secondaryUnit },
      { type: 'practice', duration: 4, label: 'Practica activa' },
      { type: 'bonus', duration: 5, label: 'Bonus: contenido real' },
    ];
  } else {
    // Full session (default)
    session.blocks = [
      { type: 'warmup', duration: 3, label: 'Repaso espaciado' },
      { type: 'listening', duration: 7, label: 'Listening', unit: listeningUnit },
      { type: 'pronunciation', duration: 4, label: 'Pronunciacion', unit: pronunciationUnit },
      { type: 'secondary', duration: 4, label: getModuleLabel(secondaryModule), unit: secondaryUnit },
      { type: 'practice', duration: 3, label: 'Practica activa' },
    ];
  }

  return session;
}

function buildWarmup() {
  const items = [];

  // Check spaced repetition queue first
  const reviewUnits = getUnitsForReview(3);
  if (reviewUnits.length > 0) {
    for (const review of reviewUnits) {
      const mod = MODULES[review.module];
      const icon = mod ? mod.icon : '&#128218;';
      items.push({
        type: 'review',
        module: review.module,
        unitId: review.unitId,
        desc: `Repaso: ${review.module} (intervalo ${review.interval}d)`,
        icon: icon,
        count: 1
      });
    }
  } else {
    // Fallback: get recent vocabulary from completed units
    const vocabProgress = getModuleProgress('vocabulary');
    if (vocabProgress.completedUnits.length > 0) {
      items.push({ type: 'vocabulary', desc: 'Repaso de vocabulario reciente', icon: '&#128218;', count: 5 });
    }

    // Get recent listening review
    const listeningProgress = getModuleProgress('listening');
    if (listeningProgress.completedUnits.length > 0) {
      items.push({ type: 'listening', desc: 'Repaso de frases de listening', icon: '&#127911;', count: 3 });
    }

    // Pronunciation review
    const pronProgress = getModuleProgress('pronunciation');
    if (pronProgress.completedUnits.length > 0) {
      items.push({ type: 'pronunciation', desc: 'Repaso de pronunciacion', icon: '&#127908;', count: 2 });
    }
  }

  // If no previous content, provide a quick start
  if (items.length === 0) {
    items.push({ type: 'intro', desc: 'Bienvenida y preparacion', icon: '&#128075;', count: 0 });
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
  if (currentSession.pronunciation) {
    completeUnit(currentSession.pronunciation.module, currentSession.pronunciation.unitIndex, 100);
  }
  if (currentSession.secondary) {
    completeUnit(currentSession.secondary.module, currentSession.secondary.unitIndex, 100);
  }

  // Complete any spaced repetition reviews done in warmup
  if (currentSession.warmup) {
    for (const item of currentSession.warmup) {
      if (item.type === 'review' && item.module && item.unitId) {
        completeReview(item.module, item.unitId);
      }
    }
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
  if (currentBlockIndex > 0) {
    h += `<button class="btn-session-abandon" data-action="abandonSession">Salir</button>`;
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
    case 'pronunciation': return renderPronunciationBlock(block);
    case 'secondary': return renderSecondaryBlock(block);
    case 'practice': return renderPracticeBlock(session);
    case 'bonus': return renderBonusBlock();
    default: return '<p>Bloque no reconocido</p>';
  }
}

function renderWarmupBlock(warmup) {
  let h = '<div class="block-card warmup-block">';
  h += '<h3>Warm-up</h3>';

  if (warmup[0] && warmup[0].type === 'intro') {
    h += '<p class="block-desc">Tu primera sesion. Vamos a empezar.</p>';
    h += '<div class="warmup-welcome">';
    h += '<p>Bienvenido. Cada sesion incluye listening + pronunciacion + un modulo extra.</p>';
    h += '<p>15-20 minutos, 3-4 veces por semana. Eso es todo lo que necesitas.</p>';
    h += '</div>';
  } else {
    const hasReview = warmup.some(i => i.type === 'review');
    h += `<p class="block-desc">${hasReview ? 'Repaso espaciado: refuerza lo que aprendiste antes.' : 'Conecta con lo que ya sabes.'}</p>`;
    h += '<div class="warmup-items">';
    for (const item of warmup) {
      h += `<div class="warmup-item">`;
      h += `<span class="warmup-icon">${item.icon || '&#128218;'}</span>`;
      h += `<span>${escapeHtml(item.desc)}</span>`;
      h += '</div>';
    }
    h += '</div>';
  }

  h += '</div>';
  return h;
}

function renderPronunciationBlock(block) {
  const unit = block.unit;
  let h = '<div class="block-card pronunciation-block">';

  if (!unit) {
    h += '<h3>Pronunciacion completada</h3>';
    h += '<p>Has completado todos los niveles de pronunciacion. &#127881;</p>';
    h += '</div>';
    return h;
  }

  h += `<div class="block-module-badge" style="background:var(--purple)">Pronunciacion ${unit.level.toUpperCase()}</div>`;
  h += `<h3>${escapeHtml(unit.unit.title)}</h3>`;
  h += `<p class="block-desc">${escapeHtml(unit.unit.desc)}</p>`;

  h += renderUnitContent(unit);

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
    case 'pronunciation':
    case 'activation':
    case 'production':
    case 'contrast':
    case 'vocabulary':
    case 'phrases':
    case 'conversation':
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
  h += '<p class="block-desc">Integra lo que has aprendido en esta sesion.</p>';

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

  // Pronunciation practice
  if (session.pronunciation && session.pronunciation.unit) {
    h += '<div class="practice-item">';
    h += `<span class="practice-icon">&#127908;</span>`;
    h += `<div>`;
    h += `<strong>Pronunciacion</strong>: Graba tu voz diciendo 3 palabras del ejercicio anterior y comparala con el modelo.`;
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
