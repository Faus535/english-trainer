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
  const unit = unitRef.unit;
  let h = '<div class="unit-content">';

  switch (unit.type) {
    // Listening-focused interactive exercises
    case 'reduced-forms':
    case 'connected-speech':
    case 'fillers':
      h += renderMicroDictation(unit);
      break;

    case 'rhythm':
    case 'intonation':
      h += renderSpeedDrill(unit);
      break;

    case 'numbers':
      h += renderMicroDictation(unit);
      break;

    case 'minimal-pairs':
      h += renderMinimalPairDrill(unit);
      break;

    case 'accents':
      h += renderAccentExercise(unit);
      break;

    case 'slang':
    case 'idioms':
      h += renderContextListening(unit);
      break;

    // Pronunciation exercises (integrated with listening - Phase 3.4)
    case 'pronunciation':
      h += renderIntegratedPronunciation(unit);
      break;

    // Grammar/vocab activation
    case 'activation':
    case 'production':
    case 'contrast':
      h += renderActivationExercise(unit);
      break;

    case 'vocabulary':
      h += renderVocabExercise(unit);
      break;

    case 'phrases':
    case 'conversation':
      h += renderPhraseExercise(unit);
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

// ===== Interactive Listening Exercises (Phase 3.1) =====

function renderMicroDictation(unit) {
  const sentences = getMicroDictationSentences(unit);
  let h = '<div class="exercise-card micro-dictation">';
  h += '<div class="exercise-instructions">';
  h += '<div class="exercise-step"><span class="step-num">1</span> Escucha la frase (pulsa play)</div>';
  h += '<div class="exercise-step"><span class="step-num">2</span> Escribe lo que oyes</div>';
  h += '<div class="exercise-step"><span class="step-num">3</span> Compara con la respuesta</div>';
  h += '</div>';

  sentences.forEach((s, i) => {
    const sentenceId = `micro-dict-${i}`;
    h += `<div class="micro-dict-item" id="mdi-${i}">`;
    h += `<div class="micro-dict-row">`;
    h += `<button class="btn-exercise-play" data-action="speakWord" data-word="${escapeHtml(s.text)}">&#9654;</button>`;
    h += `<input type="text" class="micro-dict-input" id="${sentenceId}" placeholder="Escribe lo que oyes..." autocomplete="off" spellcheck="false">`;
    h += `</div>`;
    h += `<div class="micro-dict-answer" id="answer-${i}" style="display:none">`;
    h += `<p class="answer-text">${escapeHtml(s.text)}</p>`;
    if (s.note) h += `<p class="answer-note">${escapeHtml(s.note)}</p>`;
    h += `</div>`;
    h += `<button class="btn-show-answer" onclick="document.getElementById('answer-${i}').style.display='block';this.style.display='none'">Ver respuesta</button>`;
    h += `</div>`;
  });

  h += '</div>';
  return h;
}

function getMicroDictationSentences(unit) {
  // Generate contextual sentences based on unit topic
  const sentences = {
    'reduced-forms': [
      { text: "I'm gonna go to the store.", note: "gonna = going to" },
      { text: "Do you wanna come with us?", note: "wanna = want to" },
      { text: "I gotta leave now.", note: "gotta = got to / have to" },
      { text: "She shoulda called earlier.", note: "shoulda = should have" },
      { text: "We coulda done it better.", note: "coulda = could have" },
    ],
    'connected-speech': [
      { text: "Turn it off, please.", note: "turn_it_off: las palabras se enlazan" },
      { text: "What are you looking at?", note: "whatcha: connected speech natural" },
      { text: "I picked it up at the store.", note: "picked_it_up: linking /t/" },
      { text: "She's been waiting for an hour.", note: "for_an: linking /r/" },
      { text: "Let me help you with that.", note: "lemme: let me reducido" },
    ],
    'fillers': [
      { text: "Well, you know, it's kind of complicated.", note: "well, you know, kind of = fillers comunes" },
      { text: "I mean, it's not that hard, like, basically.", note: "I mean, like, basically = muletillas" },
      { text: "So, um, what I was saying is, right, we need more time.", note: "so, um, right = fillers" },
    ],
    'numbers': [
      { text: "The meeting is at thirteen thirty.", note: "thirteen (13) vs thirty (30)" },
      { text: "I need forty-five minutes.", note: "forty-five = 45" },
      { text: "There are fifteen people in the room.", note: "fifteen (15) vs fifty (50)" },
    ],
  };
  return sentences[unit.type] || sentences['connected-speech'];
}

function renderSpeedDrill(unit) {
  const sentence = getSpeedDrillSentence(unit);
  let h = '<div class="exercise-card speed-drill">';
  h += '<div class="exercise-instructions">';
  h += '<div class="exercise-step"><span class="step-num">1</span> Escucha la frase a velocidad lenta</div>';
  h += '<div class="exercise-step"><span class="step-num">2</span> Escuchala mas rapido cada vez</div>';
  h += '<div class="exercise-step"><span class="step-num">3</span> Intenta repetirla a velocidad normal</div>';
  h += '</div>';

  h += `<p class="speed-drill-sentence">"${escapeHtml(sentence)}"</p>`;
  h += '<div class="speed-drill-buttons">';
  const speeds = [0.7, 0.85, 1.0, 1.15];
  const labels = ['Lenta', 'Media', 'Normal', 'Rapida'];
  speeds.forEach((spd, i) => {
    h += `<button class="btn-speed-drill" onclick="(function(){var r=speechRate;speechRate=${spd};speak('${escapeHtml(sentence).replace(/'/g, "\\'")}',function(){speechRate=r;});})()">`;
    h += `${labels[i]} (${spd}x)`;
    h += '</button>';
  });
  h += '</div>';
  h += '</div>';
  return h;
}

function getSpeedDrillSentence(unit) {
  const sentences = {
    'rhythm': "The DOGS are CHAS-ing the CATS a-ROUND the GAR-den.",
    'intonation': "You're coming to the party tonight, aren't you?",
  };
  return sentences[unit.type] || "She said she was going to call me back later.";
}

function renderMinimalPairDrill(unit) {
  const pairs = [
    { a: 'ship', b: 'sheep', sound: '/ɪ/ vs /iː/' },
    { a: 'cat', b: 'cut', sound: '/æ/ vs /ʌ/' },
    { a: 'bat', b: 'bet', sound: '/æ/ vs /e/' },
    { a: 'pull', b: 'pool', sound: '/ʊ/ vs /uː/' },
    { a: 'bit', b: 'beat', sound: '/ɪ/ vs /iː/' },
  ];

  let h = '<div class="exercise-card minimal-pairs">';
  h += '<div class="exercise-instructions">';
  h += '<div class="exercise-step"><span class="step-num">1</span> Escucha las dos palabras</div>';
  h += '<div class="exercise-step"><span class="step-num">2</span> Identifica la diferencia de sonido</div>';
  h += '</div>';

  pairs.forEach((p, i) => {
    h += '<div class="minimal-pair-row">';
    h += `<button class="btn-exercise-play" data-action="speakWord" data-word="${p.a}">&#9654; ${escapeHtml(p.a)}</button>`;
    h += `<span class="mp-vs">vs</span>`;
    h += `<button class="btn-exercise-play" data-action="speakWord" data-word="${p.b}">&#9654; ${escapeHtml(p.b)}</button>`;
    h += `<span class="mp-sound">${escapeHtml(p.sound)}</span>`;
    h += '</div>';
  });

  h += '</div>';
  return h;
}

function renderAccentExercise(unit) {
  let h = '<div class="exercise-card accent-exercise">';
  h += `<h4>${escapeHtml(unit.title)}</h4>`;
  h += `<p class="block-desc">${escapeHtml(unit.desc)}</p>`;
  h += '<div class="exercise-instructions">';
  h += '<div class="exercise-step"><span class="step-num">1</span> Escucha las diferencias entre acentos</div>';
  h += '<div class="exercise-step"><span class="step-num">2</span> Intenta identificar: ¿americano o britanico?</div>';
  h += '</div>';
  h += '<div class="accent-words">';
  const words = ['water', 'tomato', 'schedule', 'better', 'can\'t', 'dance'];
  words.forEach(w => {
    h += `<button class="btn-exercise-play accent-word" data-action="speakWord" data-word="${escapeHtml(w)}">&#9654; ${escapeHtml(w)}</button>`;
  });
  h += '</div>';
  h += '<p class="unit-tip">Escucha como cambia el sonido de la "r", la "t" entre vocales, y las vocales /æ/ vs /ɑː/.</p>';
  h += '</div>';
  return h;
}

function renderContextListening(unit) {
  let h = '<div class="exercise-card context-listening">';
  h += `<h4>${escapeHtml(unit.title)}</h4>`;
  h += `<p class="block-desc">${escapeHtml(unit.desc)}</p>`;
  h += renderMicroDictation(unit);
  h += '</div>';
  return h;
}

// ===== Integrated Phonetics-Listening Exercises (Phase 3.4) =====

function renderIntegratedPronunciation(unit) {
  let h = '<div class="exercise-card integrated-pronunciation">';
  h += `<h4>${escapeHtml(unit.title)}</h4>`;
  h += `<p class="block-desc">${escapeHtml(unit.desc)}</p>`;

  // Step 1: Listen and identify
  h += '<div class="exercise-instructions">';
  h += '<div class="exercise-step"><span class="step-num">1</span> Escucha las palabras de ejemplo</div>';
  h += '<div class="exercise-step"><span class="step-num">2</span> Identifica el sonido objetivo en cada frase</div>';
  h += '<div class="exercise-step"><span class="step-num">3</span> Repite imitando la pronunciacion</div>';
  h += '</div>';

  // Example words with play buttons
  const wordSets = getPronunciationWords(unit.title);
  h += '<div class="pron-words">';
  wordSets.forEach(w => {
    h += `<button class="btn-exercise-play pron-word" data-action="speakWord" data-word="${escapeHtml(w)}">&#9654; ${escapeHtml(w)}</button>`;
  });
  h += '</div>';

  // Listening integration: hear the sound in context
  h += '<div class="pron-context">';
  h += '<h5>Escucha en contexto:</h5>';
  const contextSentences = getPronContextSentences(unit.title);
  contextSentences.forEach(s => {
    h += `<div class="pron-context-item">`;
    h += `<button class="btn-exercise-play" data-action="speakWord" data-word="${escapeHtml(s)}">&#9654;</button>`;
    h += `<span>${escapeHtml(s)}</span>`;
    h += `</div>`;
  });
  h += '</div>';

  h += '</div>';
  return h;
}

function getPronunciationWords(title) {
  const lower = title.toLowerCase();
  if (lower.includes('/θ/') || lower.includes('th')) return ['think', 'three', 'bath', 'this', 'the', 'mother'];
  if (lower.includes('/v/') || lower.includes('/b/')) return ['very', 'berry', 'vine', 'wine', 'vest', 'best'];
  if (lower.includes('vocal')) return ['ship', 'sheep', 'cat', 'cut', 'pull', 'pool'];
  if (lower.includes('/ɪ/') || lower.includes('ship')) return ['ship', 'sheep', 'bit', 'beat', 'sit', 'seat'];
  if (lower.includes('/h/')) return ['have', 'hello', 'behind', 'who', 'how', 'hear'];
  if (lower.includes('-ed')) return ['worked', 'played', 'wanted', 'kissed', 'loved', 'needed'];
  if (lower.includes('stress')) return ['record', 'present', 'object', 'contract', 'permit', 'rebel'];
  if (lower.includes('linking')) return ['turn it off', 'pick it up', 'far away', 'go on'];
  if (lower.includes('/ʃ/') || lower.includes('/tʃ/')) return ['she', 'cheese', 'ship', 'chip', 'share', 'chair'];
  if (lower.includes('/r/')) return ['red', 'wrong', 'world', 'right', 'around', 'car'];
  return ['about', 'banana', 'camera', 'better', 'letter', 'water'];
}

function getPronContextSentences(title) {
  const lower = title.toLowerCase();
  if (lower.includes('/θ/') || lower.includes('th')) return ['I think three thousand is too much.', 'Thank you for everything.', 'This is the best thing.'];
  if (lower.includes('/v/') || lower.includes('/b/')) return ['I have a very big bag.', 'They gave us a brave victory.', 'The van blocked the view.'];
  if (lower.includes('vocal')) return ['The ship sailed past the sheep.', 'She cut the cat\'s food.'];
  if (lower.includes('stress')) return ['Can you RECORD the record?', 'I PRESENT you this present.'];
  if (lower.includes('linking')) return ['Turn it off right now.', 'Pick it up from the floor.', 'She went out and about.'];
  return ['I\'m about to leave.', 'Can you pass me the water?', 'The weather is better today.'];
}

// ===== Activation & Vocab Exercises =====

function renderActivationExercise(unit) {
  let h = '<div class="exercise-card activation-exercise">';
  h += `<h4>${escapeHtml(unit.title)}</h4>`;
  h += `<p class="block-desc">${escapeHtml(unit.desc)}</p>`;
  h += '<div class="exercise-instructions">';
  h += '<div class="exercise-step"><span class="step-num">1</span> Lee la regla o estructura</div>';
  h += '<div class="exercise-step"><span class="step-num">2</span> Escribe 3 frases propias usando la estructura</div>';
  h += '<div class="exercise-step"><span class="step-num">3</span> Leelas en voz alta</div>';
  h += '</div>';
  h += '<textarea class="activation-textarea" placeholder="Escribe tus frases aqui..." rows="4"></textarea>';
  h += '</div>';
  return h;
}

function renderVocabExercise(unit) {
  let h = '<div class="exercise-card vocab-exercise">';
  h += `<h4>${escapeHtml(unit.title)}</h4>`;
  h += `<p class="block-desc">${escapeHtml(unit.desc)}</p>`;

  // Show random vocab words from VOCAB_DATA with TTS
  if (typeof VOCAB_DATA !== 'undefined' && VOCAB_DATA.length > 0) {
    const words = [];
    const used = new Set();
    while (words.length < 8 && words.length < VOCAB_DATA.length) {
      const idx = Math.floor(Math.random() * VOCAB_DATA.length);
      if (!used.has(idx)) {
        used.add(idx);
        words.push(VOCAB_DATA[idx]);
      }
    }

    h += '<div class="vocab-cards">';
    words.forEach(w => {
      h += '<div class="vocab-mini-card">';
      h += `<button class="btn-exercise-play" data-action="speakWord" data-word="${escapeHtml(w.en)}">&#9654;</button>`;
      h += `<div class="vocab-mini-word">${escapeHtml(w.en)}</div>`;
      if (w.ipa) h += `<div class="vocab-mini-ipa">${escapeHtml(w.ipa)}</div>`;
      h += `<div class="vocab-mini-es" style="display:none">${escapeHtml(w.es)}</div>`;
      h += `<button class="btn-show-answer" onclick="this.previousElementSibling.style.display='block';this.style.display='none'">Ver</button>`;
      h += '</div>';
    });
    h += '</div>';
  }

  h += '</div>';
  return h;
}

function renderPhraseExercise(unit) {
  let h = '<div class="exercise-card phrase-exercise">';
  h += `<h4>${escapeHtml(unit.title)}</h4>`;
  h += `<p class="block-desc">${escapeHtml(unit.desc)}</p>`;
  h += '<div class="exercise-instructions">';
  h += '<div class="exercise-step"><span class="step-num">1</span> Lee las frases y escucha la pronunciacion</div>';
  h += '<div class="exercise-step"><span class="step-num">2</span> Practica diciendo cada frase en voz alta</div>';
  h += '<div class="exercise-step"><span class="step-num">3</span> Intenta usar una frase en una conversacion imaginaria</div>';
  h += '</div>';
  h += '<textarea class="activation-textarea" placeholder="Practica aqui: escribe un dialogo usando las frases..." rows="4"></textarea>';
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
