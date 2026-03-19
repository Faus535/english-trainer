/**
 * Level test - mandatory on first launch.
 * 3 mini-tests: vocabulary, grammar, listening.
 * Classifies user per-module into CEFR levels.
 */

// ===== Test Questions =====

const TEST_VOCABULARY = [
  // A1 (should get all right)
  { es: 'casa', answer: 'house', level: 'a1' },
  { es: 'comer', answer: 'eat', level: 'a1' },
  { es: 'agua', answer: 'water', level: 'a1' },
  { es: 'trabajar', answer: 'work', level: 'a1' },
  // A2
  { es: 'cita / reunion', answer: 'appointment', alts: ['meeting'], level: 'a2' },
  { es: 'comodo', answer: 'comfortable', level: 'a2' },
  { es: 'disponible', answer: 'available', level: 'a2' },
  { es: 'intentar', answer: 'try', alts: ['attempt'], level: 'a2' },
  // B1
  { es: 'lograr / conseguir', answer: 'achieve', alts: ['accomplish', 'reach'], level: 'b1' },
  { es: 'fiable / de confianza', answer: 'reliable', alts: ['trustworthy'], level: 'b1' },
  { es: 'mejorar', answer: 'improve', alts: ['enhance'], level: 'b1' },
  { es: 'consejo', answer: 'advice', alts: ['tip'], level: 'b1' },
  // B2
  { es: 'a fondo / completamente', answer: 'thoroughly', alts: ['completely'], level: 'b2' },
  { es: 'abrumador', answer: 'overwhelming', level: 'b2' },
  { es: 'despreciar / menospreciar', answer: 'despise', alts: ['scorn', 'disdain'], level: 'b2' },
  { es: 'resiliencia', answer: 'resilience', level: 'b2' },
  // C1
  { es: 'perspicaz / astuto', answer: 'shrewd', alts: ['insightful', 'perceptive'], level: 'c1' },
  { es: 'ambiguo', answer: 'ambiguous', level: 'c1' },
  { es: 'efimero / pasajero', answer: 'ephemeral', alts: ['fleeting', 'transient'], level: 'c1' },
  { es: 'menoscabar / socavar', answer: 'undermine', alts: ['undercut'], level: 'c1' },
];

const TEST_GRAMMAR = [
  // A1 - Present simple
  { sentence: 'She ___ to school every day.', options: ['go', 'goes', 'going', 'gone'], answer: 1, level: 'a1' },
  // A1 - Past simple
  { sentence: 'I ___ a movie yesterday.', options: ['watch', 'watching', 'watched', 'watches'], answer: 2, level: 'a1' },
  // A2 - Comparatives
  { sentence: 'London is ___ than Madrid.', options: ['big', 'bigger', 'biggest', 'more big'], answer: 1, level: 'a2' },
  // A2 - Present continuous
  { sentence: 'They ___ lunch right now.', options: ['have', 'has', 'are having', 'having'], answer: 2, level: 'a2' },
  // B1 - Present perfect
  { sentence: 'I ___ to London three times.', options: ['have been', 'was', 'have gone', 'went'], answer: 0, level: 'b1' },
  // B1 - Second conditional
  { sentence: 'If I ___ rich, I would travel the world.', options: ['am', 'was', 'were', 'be'], answer: 2, level: 'b1' },
  // B1 - Passive
  { sentence: 'The book ___ by millions of people.', options: ['has read', 'has been read', 'have read', 'is reading'], answer: 1, level: 'b1' },
  // B2 - Third conditional
  { sentence: 'If she ___ harder, she would have passed.', options: ['studied', 'had studied', 'has studied', 'studies'], answer: 1, level: 'b2' },
  // B2 - Reported speech
  { sentence: 'He said he ___ the answer.', options: ['knows', 'knew', 'has known', 'is knowing'], answer: 1, level: 'b2' },
  // C1 - Inversion
  { sentence: '___ had I arrived than the meeting started.', options: ['No sooner', 'Hardly', 'Barely', 'Scarcely'], answer: 0, level: 'c1' },
];

const TEST_LISTENING = [
  // A1 - Clear, slow
  { text: 'I would like a glass of water, please.', level: 'a1', speed: 0.8 },
  // A2 - Normal speed
  { text: 'What time does the train leave tomorrow morning?', level: 'a2', speed: 0.9 },
  // B1 - Reduced forms
  { text: "I'm gonna go to the store. Do you wanna come?", level: 'b1', speed: 1.0 },
  // B1 - Connected speech
  { text: "She should have told him about it earlier.", level: 'b1', speed: 1.0 },
  // B2 - Fast, natural
  { text: "I wouldn't have bothered if I'd known it was gonna be cancelled.", level: 'b2', speed: 1.1 },
];

// ===== Test State =====

let testState = {
  phase: 'intro', // 'intro', 'vocabulary', 'grammar', 'listening', 'results'
  currentQuestion: 0,
  vocabAnswers: [],
  grammarAnswers: [],
  listeningAnswers: [],
  vocabInput: ''
};

// ===== Test Logic =====

function startTest() {
  testState = {
    phase: 'vocabulary',
    currentQuestion: 0,
    vocabAnswers: [],
    grammarAnswers: [],
    listeningAnswers: [],
    vocabInput: ''
  };
  renderTest();
}

function submitVocabAnswer(input) {
  const q = TEST_VOCABULARY[testState.currentQuestion];
  const answer = input.trim().toLowerCase();
  const correct = answer === q.answer.toLowerCase() ||
    (q.alts && q.alts.some(a => answer === a.toLowerCase()));

  testState.vocabAnswers.push({ level: q.level, correct });
  testState.currentQuestion++;
  testState.vocabInput = '';

  if (testState.currentQuestion >= TEST_VOCABULARY.length) {
    testState.phase = 'grammar';
    testState.currentQuestion = 0;
  }
  renderTest();
}

function submitGrammarAnswer(optionIndex) {
  const q = TEST_GRAMMAR[testState.currentQuestion];
  const correct = optionIndex === q.answer;

  testState.grammarAnswers.push({ level: q.level, correct });
  testState.currentQuestion++;

  if (testState.currentQuestion >= TEST_GRAMMAR.length) {
    testState.phase = 'listening';
    testState.currentQuestion = 0;
  }
  renderTest();
}

function submitListeningAnswer(input) {
  const q = TEST_LISTENING[testState.currentQuestion];
  const answer = input.trim().toLowerCase();
  const expected = q.text.toLowerCase().replace(/[^a-z\s]/g, '');
  const words = expected.split(/\s+/);
  const answerWords = answer.replace(/[^a-z\s]/g, '').split(/\s+/);

  // Score based on word matching
  let matched = 0;
  for (const w of words) {
    if (answerWords.includes(w)) matched++;
  }
  const score = words.length > 0 ? matched / words.length : 0;
  const correct = score >= 0.6; // 60% of words correct

  testState.listeningAnswers.push({ level: q.level, correct, score });
  testState.currentQuestion++;

  if (testState.currentQuestion >= TEST_LISTENING.length) {
    testState.phase = 'results';
    calculateResults();
  }
  renderTest();
}

function calculateResults() {
  const profile = getProfile();

  // Vocabulary level: highest level where 50%+ correct
  profile.levels.vocabulary = calculateLevel(testState.vocabAnswers);

  // Grammar level
  profile.levels.grammar = calculateLevel(testState.grammarAnswers);

  // Listening level
  profile.levels.listening = calculateLevel(testState.listeningAnswers);

  // Phrases: average of vocabulary and grammar (can't test directly)
  const vocIdx = getLevelIndex(profile.levels.vocabulary);
  const gramIdx = getLevelIndex(profile.levels.grammar);
  const phraseIdx = Math.min(vocIdx, gramIdx);
  profile.levels.phrases = CEFR_LEVELS[phraseIdx];

  // Pronunciation: same as listening (both are audio skills)
  const lisIdx = getLevelIndex(profile.levels.listening);
  profile.levels.pronunciation = CEFR_LEVELS[Math.max(0, lisIdx)];

  profile.testCompleted = true;
  saveProfile(profile);
}

function calculateLevel(answers) {
  // Group by level, find highest where >=50% correct
  const byLevel = {};
  for (const a of answers) {
    if (!byLevel[a.level]) byLevel[a.level] = { correct: 0, total: 0 };
    byLevel[a.level].total++;
    if (a.correct) byLevel[a.level].correct++;
  }

  let bestLevel = 'a1';
  for (const level of CEFR_LEVELS) {
    const stats = byLevel[level];
    if (stats && stats.total > 0 && (stats.correct / stats.total) >= 0.5) {
      bestLevel = level;
    } else if (stats && stats.total > 0 && (stats.correct / stats.total) < 0.5) {
      break; // Stop at first level where they fail
    }
  }
  return bestLevel;
}

// ===== Render Test =====

function renderTest() {
  const main = document.getElementById('main');

  switch (testState.phase) {
    case 'intro':
      main.innerHTML = renderTestIntro();
      break;
    case 'vocabulary':
      main.innerHTML = renderTestVocab();
      break;
    case 'grammar':
      main.innerHTML = renderTestGrammar();
      break;
    case 'listening':
      main.innerHTML = renderTestListening();
      break;
    case 'results':
      main.innerHTML = renderTestResults();
      break;
  }
}

function renderTestIntro() {
  return `
    <div class="test-page">
      <div class="test-welcome">
        <h2>Bienvenido a English Trainer</h2>
        <p>Antes de empezar, necesitamos saber tu nivel para crear un plan personalizado.</p>
        <p>Son 3 mini-tests rapidos (5 minutos en total):</p>
        <div class="test-steps-preview">
          <div class="test-step-item">
            <span class="test-step-num">1</span>
            <div>
              <strong>Vocabulario</strong>
              <span>Traduce 20 palabras al ingles</span>
            </div>
          </div>
          <div class="test-step-item">
            <span class="test-step-num">2</span>
            <div>
              <strong>Gramatica</strong>
              <span>Elige la opcion correcta en 10 frases</span>
            </div>
          </div>
          <div class="test-step-item">
            <span class="test-step-num">3</span>
            <div>
              <strong>Listening</strong>
              <span>Escucha y escribe lo que oyes</span>
            </div>
          </div>
        </div>
        <p class="test-note">No te preocupes si no sabes algo — el test sirve para NO hacerte repetir lo que ya sabes.</p>
        <button class="btn-start-test" data-action="startTest">Empezar Test</button>
      </div>
    </div>`;
}

function renderTestVocab() {
  const q = TEST_VOCABULARY[testState.currentQuestion];
  const progress = testState.currentQuestion + 1;
  const total = TEST_VOCABULARY.length;

  return `
    <div class="test-page">
      <div class="test-header">
        <span class="test-phase-badge">Vocabulario</span>
        <span class="test-progress">${progress} / ${total}</span>
      </div>
      <div class="test-progress-bar">
        <div class="test-progress-fill" style="width:${(progress / total) * 100}%"></div>
      </div>
      <div class="test-question-card">
        <p class="test-instruction">Traduce al ingles:</p>
        <p class="test-word">${escapeHtml(q.es)}</p>
        <input type="text" class="test-input" id="testVocabInput"
          placeholder="Escribe en ingles..."
          data-action="testVocabInput"
          autocomplete="off" autocapitalize="off" spellcheck="false">
        <button class="btn-test-next" data-action="submitVocab">Siguiente</button>
        <button class="btn-test-skip" data-action="skipVocab">No lo se</button>
      </div>
    </div>`;
}

function renderTestGrammar() {
  const q = TEST_GRAMMAR[testState.currentQuestion];
  const progress = testState.currentQuestion + 1;
  const total = TEST_GRAMMAR.length;

  let optionsHtml = '';
  q.options.forEach((opt, i) => {
    optionsHtml += `<button class="test-option" data-action="submitGrammar" data-option="${i}">${escapeHtml(opt)}</button>`;
  });

  return `
    <div class="test-page">
      <div class="test-header">
        <span class="test-phase-badge test-phase-grammar">Gramatica</span>
        <span class="test-progress">${progress} / ${total}</span>
      </div>
      <div class="test-progress-bar">
        <div class="test-progress-fill" style="width:${(progress / total) * 100}%"></div>
      </div>
      <div class="test-question-card">
        <p class="test-instruction">Elige la opcion correcta:</p>
        <p class="test-sentence">${escapeHtml(q.sentence)}</p>
        <div class="test-options">${optionsHtml}</div>
      </div>
    </div>`;
}

function renderTestListening() {
  const q = TEST_LISTENING[testState.currentQuestion];
  const progress = testState.currentQuestion + 1;
  const total = TEST_LISTENING.length;

  return `
    <div class="test-page">
      <div class="test-header">
        <span class="test-phase-badge test-phase-listening">Listening</span>
        <span class="test-progress">${progress} / ${total}</span>
      </div>
      <div class="test-progress-bar">
        <div class="test-progress-fill" style="width:${(progress / total) * 100}%"></div>
      </div>
      <div class="test-question-card">
        <p class="test-instruction">Escucha y escribe lo que oyes:</p>
        <button class="btn-test-play" data-action="playTestAudio" data-q="${testState.currentQuestion}">
          &#9654; Reproducir audio
        </button>
        <button class="btn-test-play btn-test-replay" data-action="playTestAudio" data-q="${testState.currentQuestion}">
          &#128260; Repetir
        </button>
        <input type="text" class="test-input" id="testListenInput"
          placeholder="Escribe lo que has oido..."
          data-action="testListenInput"
          autocomplete="off" autocapitalize="off" spellcheck="false">
        <button class="btn-test-next" data-action="submitListening">Siguiente</button>
        <button class="btn-test-skip" data-action="skipListening">No lo entiendo</button>
      </div>
    </div>`;
}

function renderTestResults() {
  const profile = getProfile();
  const levels = profile.levels;

  // Determine user profile type
  const profileType = getProfileType(levels);

  const messages = {
    reactivador: 'Tu ingles escrito es A2-B1. Tienes mucho ingles dormido — no necesitas aprenderlo de nuevo, necesitas <strong>activarlo</strong>. En 2 semanas notaras la diferencia.',
    basico: 'Tienes bases de ingles. Vamos a construir sobre ellas, no desde cero. Empezamos por lo mas util para el dia a dia.',
    intermedio: 'Tu nivel es mejor de lo que crees. Lo que te falta es practica activa. Vamos a pasar del "lo entiendo leyendo" al "lo puedo usar".',
    avanzado_pasivo: 'Lees ingles casi como un nativo pero tu oido no esta entrenado. Es un problema muy comun y tiene solucion rapida. En 4 semanas vas a notar un salto brutal.'
  };

  return `
    <div class="test-page">
      <div class="test-results">
        <h2>Tu perfil</h2>
        <div class="test-profile-type">${escapeHtml(profileType.label)}</div>
        <p class="test-profile-msg">${messages[profileType.id]}</p>

        <div class="test-levels-grid">
          ${MODULE_NAMES.map(m => `
            <div class="test-level-card">
              <span class="test-level-module">${getModuleLabel(m)}</span>
              <span class="test-level-value">${levels[m].toUpperCase()}</span>
            </div>
          `).join('')}
        </div>

        <div class="test-plan-preview">
          <h3>Tu plan personalizado</h3>
          <p>Listening sera el <strong>40%</strong> de cada sesion (tu mayor area de mejora).</p>
          <p><strong>${estimateSessions(levels)}</strong> sesiones estimadas hasta C1.</p>
          <p>3-4 sesiones por semana, 15-20 minutos cada una.</p>
        </div>

        <button class="btn-start-learning" data-action="finishTest">Empezar a aprender</button>
      </div>
    </div>`;
}

function getProfileType(levels) {
  const lisIdx = getLevelIndex(levels.listening);
  const vocIdx = getLevelIndex(levels.vocabulary);
  const gramIdx = getLevelIndex(levels.grammar);
  const readAvg = (vocIdx + gramIdx) / 2;

  if (readAvg >= 2 && lisIdx <= 1) {
    return { id: 'avanzado_pasivo', label: 'Avanzado Pasivo' };
  }
  if (readAvg >= 1 && lisIdx <= 1) {
    return { id: 'reactivador', label: 'Reactivador' };
  }
  if (readAvg >= 1.5) {
    return { id: 'intermedio', label: 'Intermedio' };
  }
  return { id: 'basico', label: 'Basico+' };
}

function getModuleLabel(moduleName) {
  const labels = {
    listening: 'Listening',
    vocabulary: 'Vocabulario',
    grammar: 'Gramatica',
    phrases: 'Frases',
    pronunciation: 'Pronunciacion'
  };
  return labels[moduleName] || moduleName;
}

function estimateSessions(levels) {
  // Estimate based on listening level (the bottleneck)
  const lisIdx = getLevelIndex(levels.listening);
  const remaining = CEFR_LEVELS.length - 1 - lisIdx; // levels to C1
  // ~12-15 sessions per level for listening
  const estimate = remaining * 13;
  return `${estimate - 5}–${estimate + 5}`;
}

function playTestAudio(questionIndex) {
  const q = TEST_LISTENING[questionIndex];
  if (q && typeof speak === 'function') {
    // Temporarily adjust speech rate for the test
    const originalRate = speechRate;
    speechRate = q.speed || 1.0;
    speak(q.text, () => {
      speechRate = originalRate;
    });
  }
}
