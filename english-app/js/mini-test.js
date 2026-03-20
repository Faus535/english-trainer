/**
 * Mini-test system — triggered every 8 completed listening units (~2 weeks).
 * 15 questions: 5 vocab + 5 grammar + 3 listening + 2 pronunciation.
 * Results adjust adaptive difficulty (TTS speed, content level).
 * Progress tracked for skill evolution chart.
 */

// ===== Question Pools per Level =====

const MINI_TEST_POOLS = {
  a1: {
    vocabulary: [
      { es: 'gato', answer: 'cat', alts: [] },
      { es: 'perro', answer: 'dog', alts: [] },
      { es: 'libro', answer: 'book', alts: [] },
      { es: 'mesa', answer: 'table', alts: [] },
      { es: 'silla', answer: 'chair', alts: [] },
      { es: 'amigo', answer: 'friend', alts: [] },
      { es: 'escuela', answer: 'school', alts: [] },
      { es: 'familia', answer: 'family', alts: [] },
      { es: 'dinero', answer: 'money', alts: [] },
      { es: 'tiempo', answer: 'time', alts: ['weather'] },
      { es: 'grande', answer: 'big', alts: ['large'] },
      { es: 'pequeño', answer: 'small', alts: ['little'] },
    ],
    grammar: [
      { sentence: 'He ___ a teacher.', options: ['is', 'are', 'am', 'be'], answer: 0 },
      { sentence: 'They ___ to the park yesterday.', options: ['go', 'goes', 'went', 'going'], answer: 2 },
      { sentence: 'She ___ lunch every day at noon.', options: ['have', 'has', 'having', 'had'], answer: 1 },
      { sentence: 'We ___ watching a movie right now.', options: ['is', 'are', 'was', 'am'], answer: 1 },
      { sentence: 'I ___ like coffee.', options: ["don't", "doesn't", "isn't", "aren't"], answer: 0 },
      { sentence: 'There ___ two cats in the garden.', options: ['is', 'are', 'was', 'has'], answer: 1 },
      { sentence: '___ you speak English?', options: ['Do', 'Does', 'Are', 'Is'], answer: 0 },
      { sentence: 'The children ___ in the park now.', options: ['play', 'plays', 'are playing', 'played'], answer: 2 },
    ],
    listening: [
      { text: 'My name is John and I live in London.', speed: 0.8 },
      { text: 'Can I have a cup of coffee, please?', speed: 0.8 },
      { text: 'The weather is nice today.', speed: 0.8 },
      { text: 'I like reading books in the evening.', speed: 0.8 },
      { text: 'She goes to work by bus every morning.', speed: 0.8 },
      { text: 'We had a great time at the party.', speed: 0.85 },
    ],
    pronunciation: [
      { word: 'bath', options: ['bath', 'bat', 'bass'], answer: 0 },
      { word: 'very', options: ['very', 'berry', 'vary'], answer: 0 },
      { word: 'ship', options: ['ship', 'sheep', 'chip'], answer: 0 },
      { word: 'hat', options: ['hat', 'hot', 'hut'], answer: 0 },
    ],
  },
  a2: {
    vocabulary: [
      { es: 'ambiente', answer: 'environment', alts: [] },
      { es: 'desarrollar', answer: 'develop', alts: [] },
      { es: 'experiencia', answer: 'experience', alts: [] },
      { es: 'diferente', answer: 'different', alts: [] },
      { es: 'importante', answer: 'important', alts: [] },
      { es: 'problema', answer: 'problem', alts: ['issue'] },
      { es: 'decidir', answer: 'decide', alts: [] },
      { es: 'necesitar', answer: 'need', alts: ['require'] },
      { es: 'explicar', answer: 'explain', alts: [] },
      { es: 'recordar', answer: 'remember', alts: ['recall'] },
      { es: 'aprender', answer: 'learn', alts: [] },
      { es: 'entender', answer: 'understand', alts: [] },
    ],
    grammar: [
      { sentence: 'I have ___ been to Paris.', options: ['ever', 'never', 'yet', 'already'], answer: 1 },
      { sentence: 'She ___ studying when I arrived.', options: ['is', 'was', 'were', 'has'], answer: 1 },
      { sentence: 'If it rains, I ___ stay home.', options: ['will', 'would', 'could', 'should'], answer: 0 },
      { sentence: "We've lived here ___ 2015.", options: ['for', 'since', 'during', 'from'], answer: 1 },
      { sentence: 'This is ___ interesting than I expected.', options: ['much', 'more', 'most', 'very'], answer: 1 },
      { sentence: 'I ___ to the gym three times this week.', options: ['go', 'went', 'have been', 'am going'], answer: 2 },
      { sentence: 'You ___ see a doctor about that.', options: ['should', 'must', 'can', 'will'], answer: 0 },
      { sentence: 'She asked me ___ I wanted coffee.', options: ['that', 'if', 'do', 'what'], answer: 1 },
    ],
    listening: [
      { text: "I've been waiting for you for about twenty minutes.", speed: 0.9 },
      { text: "Could you tell me where the nearest station is?", speed: 0.9 },
      { text: "She said she would call me back later.", speed: 0.9 },
      { text: "We should have left earlier to avoid the traffic.", speed: 0.95 },
      { text: "I'm going to visit my parents next weekend.", speed: 0.9 },
      { text: "Have you ever been to a country where they don't speak English?", speed: 0.95 },
    ],
    pronunciation: [
      { word: 'comfortable', options: ['3 silabas', '4 silabas', '5 silabas'], answer: 0, special: 'syllables' },
      { word: 'thought', options: ['thought', 'taught', 'tought'], answer: 0 },
      { word: 'world', options: ['world', 'word', 'would'], answer: 0 },
      { word: 'vegetable', options: ['3 silabas', '4 silabas', '5 silabas'], answer: 0, special: 'syllables' },
    ],
  },
  b1: {
    vocabulary: [
      { es: 'lograr', answer: 'achieve', alts: ['accomplish'] },
      { es: 'responsable', answer: 'responsible', alts: [] },
      { es: 'oportunidad', answer: 'opportunity', alts: ['chance'] },
      { es: 'investigacion', answer: 'research', alts: ['investigation'] },
      { es: 'competencia', answer: 'competition', alts: ['competence'] },
      { es: 'mejorar', answer: 'improve', alts: ['enhance'] },
      { es: 'ventaja', answer: 'advantage', alts: ['benefit'] },
      { es: 'influencia', answer: 'influence', alts: [] },
      { es: 'disminuir', answer: 'decrease', alts: ['reduce', 'diminish'] },
      { es: 'considerar', answer: 'consider', alts: [] },
      { es: 'sugerir', answer: 'suggest', alts: ['recommend'] },
      { es: 'establecer', answer: 'establish', alts: ['set up'] },
    ],
    grammar: [
      { sentence: 'If I ___ you, I would accept the offer.', options: ['am', 'was', 'were', 'be'], answer: 2 },
      { sentence: 'The report ___ by the team last week.', options: ['wrote', 'was written', 'has written', 'is writing'], answer: 1 },
      { sentence: 'She told me she ___ tired.', options: ['is', 'was', 'has been', 'be'], answer: 1 },
      { sentence: 'The man ___ car was stolen called the police.', options: ['who', 'which', 'whose', 'whom'], answer: 2 },
      { sentence: 'I wish I ___ more time to study.', options: ['have', 'had', 'has', 'having'], answer: 1 },
      { sentence: 'If I had known, I ___ have come earlier.', options: ['will', 'would', 'could', 'should'], answer: 1 },
      { sentence: 'She ___ to live in Spain before moving to England.', options: ['use', 'used', 'was used', 'is used'], answer: 1 },
      { sentence: 'Could you tell me where the station ___?', options: ['is', 'was', 'be', 'does'], answer: 0 },
    ],
    listening: [
      { text: "I'm gonna grab a coffee. Do you wanna come with me?", speed: 1.0 },
      { text: "She should have told him about it before the meeting.", speed: 1.0 },
      { text: "The thing is, we can't afford to make any more mistakes.", speed: 1.0 },
      { text: "I wouldn't have done it if I had known the consequences.", speed: 1.05 },
      { text: "He's been working there for years but he still hasn't got a promotion.", speed: 1.0 },
      { text: "If you ask me, I think they should've planned it better.", speed: 1.05 },
    ],
    pronunciation: [
      { word: 'I said TUESDAY not Thursday', options: ['I', 'TUESDAY', 'Thursday'], answer: 1, special: 'stress' },
      { word: "turn it off", options: ['3 palabras', '2 palabras', '1 palabra'], answer: 0, special: 'words' },
      { word: 'February', options: ['2 silabas', '3 silabas', '4 silabas'], answer: 1, special: 'syllables' },
      { word: 'literally', options: ['3 silabas', '4 silabas', '5 silabas'], answer: 0, special: 'syllables' },
    ],
  },
  b2: {
    vocabulary: [
      { es: 'a fondo', answer: 'thoroughly', alts: ['in depth'] },
      { es: 'abrumador', answer: 'overwhelming', alts: [] },
      { es: 'perspicaz', answer: 'insightful', alts: ['perceptive', 'shrewd'] },
      { es: 'socavar', answer: 'undermine', alts: ['undercut'] },
      { es: 'resiliencia', answer: 'resilience', alts: [] },
      { es: 'matiz', answer: 'nuance', alts: ['subtlety'] },
      { es: 'efimero', answer: 'ephemeral', alts: ['fleeting', 'transient'] },
      { es: 'ambiguo', answer: 'ambiguous', alts: [] },
      { es: 'obstaculizar', answer: 'hinder', alts: ['hamper', 'impede'] },
      { es: 'inminente', answer: 'imminent', alts: ['impending'] },
      { es: 'paradoja', answer: 'paradox', alts: [] },
      { es: 'prevalecer', answer: 'prevail', alts: ['predominate'] },
    ],
    grammar: [
      { sentence: 'No sooner ___ I arrived than it started raining.', options: ['had', 'have', 'did', 'was'], answer: 0 },
      { sentence: 'What I really ___ is a good night\'s sleep.', options: ['want', 'need', 'needed', 'wanting'], answer: 1 },
      { sentence: '___ finished the report, she went home.', options: ['Having', 'Had', 'Being', 'To have'], answer: 0 },
      { sentence: 'If I had studied harder, I ___ a better job now.', options: ['would have', 'would had', 'would have had', 'would'], answer: 0 },
      { sentence: 'I suggest that he ___ the proposal immediately.', options: ['reviews', 'review', 'reviewed', 'reviewing'], answer: 1 },
      { sentence: 'Not only ___ he late, but he also forgot the documents.', options: ['was', 'is', 'did', 'has'], answer: 0 },
      { sentence: '___ the circumstances, I think we did well.', options: ['Given', 'Giving', 'Gave', 'To give'], answer: 0 },
      { sentence: 'By this time next year, I ___ graduated.', options: ['will', 'will have', 'am going to', 'would have'], answer: 1 },
    ],
    listening: [
      { text: "I wouldn't have bothered if I'd known it was gonna be cancelled.", speed: 1.1 },
      { text: "The thing is, he's not exactly what you'd call reliable, is he?", speed: 1.1 },
      { text: "Had I known about the redundancies, I wouldn't have taken the position.", speed: 1.15 },
      { text: "She reckons they'll have sorted it out by the time we get there.", speed: 1.15 },
      { text: "I mean, it's not as if they didn't have enough time to prepare, right?", speed: 1.1 },
      { text: "Apparently, he's been going on about it for weeks but nobody's taken any notice.", speed: 1.15 },
    ],
    pronunciation: [
      { word: 'hierarchy', options: ['3 silabas', '4 silabas', '5 silabas'], answer: 1, special: 'syllables' },
      { word: 'She DIDN\'T say that', options: ['She', "DIDN'T", 'that'], answer: 1, special: 'stress' },
      { word: 'entrepreneur', options: ['3 silabas', '4 silabas', '5 silabas'], answer: 1, special: 'syllables' },
      { word: 'mischievous', options: ['3 silabas', '4 silabas', '2 silabas'], answer: 0, special: 'syllables' },
    ],
  },
  c1: {
    vocabulary: [
      { es: 'corroborar', answer: 'corroborate', alts: ['substantiate', 'confirm'] },
      { es: 'escrupuloso', answer: 'scrupulous', alts: ['meticulous'] },
      { es: 'elucidar', answer: 'elucidate', alts: ['clarify', 'illuminate'] },
      { es: 'prescindir', answer: 'dispense', alts: ['forgo'] },
      { es: 'exacerbar', answer: 'exacerbate', alts: ['aggravate'] },
      { es: 'pragmatico', answer: 'pragmatic', alts: ['practical'] },
      { es: 'reticente', answer: 'reluctant', alts: ['reticent', 'hesitant'] },
      { es: 'discrepancia', answer: 'discrepancy', alts: ['disparity'] },
      { es: 'ubicuo', answer: 'ubiquitous', alts: ['omnipresent'] },
      { es: 'atenuar', answer: 'mitigate', alts: ['alleviate', 'attenuate'] },
      { es: 'proliferar', answer: 'proliferate', alts: ['multiply'] },
      { es: 'amalgamar', answer: 'amalgamate', alts: ['merge', 'combine'] },
    ],
    grammar: [
      { sentence: 'Rarely ___ such incompetence in my career.', options: ['I have seen', 'have I seen', 'I saw', 'did I see'], answer: 1 },
      { sentence: 'It was the manager ___ approved the budget.', options: ['who', 'whom', 'which', 'whose'], answer: 0 },
      { sentence: '___ it not been for your help, we would have failed.', options: ['Had', 'Has', 'Have', 'If'], answer: 0 },
      { sentence: 'The data ___ to suggest a strong correlation.', options: ['seem', 'seems', 'is seeming', 'has seemed'], answer: 1 },
      { sentence: 'She demanded that the report ___ rewritten.', options: ['is', 'was', 'be', 'being'], answer: 2 },
      { sentence: '___ the evidence, the conclusion is unavoidable.', options: ['In light of', 'Despite of', 'According of', 'In spite'], answer: 0 },
      { sentence: 'Little ___ he know what was about to happen.', options: ['did', 'does', 'had', 'was'], answer: 0 },
      { sentence: 'The more you practice, the ___ you become.', options: ['good', 'better', 'best', 'well'], answer: 1 },
    ],
    listening: [
      { text: "If you ask me, the whole thing's been blown completely out of proportion, don't you think?", speed: 1.2 },
      { text: "Notwithstanding the challenges, the team managed to deliver on time and under budget.", speed: 1.2 },
      { text: "I can't for the life of me figure out why they'd go ahead with something so obviously flawed.", speed: 1.2 },
      { text: "Bear in mind that the figures haven't been audited yet, so take them with a pinch of salt.", speed: 1.2 },
      { text: "She's always been something of a perfectionist, which, while admirable, can be rather counterproductive.", speed: 1.25 },
      { text: "It goes without saying that this sort of oversight simply cannot be allowed to happen again.", speed: 1.2 },
    ],
    pronunciation: [
      { word: 'albeit', options: ['2 silabas', '3 silabas', '4 silabas'], answer: 1, special: 'syllables' },
      { word: 'We need to RECONSIDER the proposal', options: ['We', 'RECONSIDER', 'proposal'], answer: 1, special: 'stress' },
      { word: 'hyperbole', options: ['3 silabas', '4 silabas', '5 silabas'], answer: 1, special: 'syllables' },
      { word: 'unequivocally', options: ['5 silabas', '6 silabas', '4 silabas'], answer: 1, special: 'syllables' },
    ],
  }
};

// ===== Mini-Test State =====

let miniTestState = null;

function getMiniTestInterval() {
  return 8; // Every 8 completed listening units
}

function shouldTriggerMiniTest() {
  const profile = getProfile();
  const lisProgress = getModuleProgress('listening');
  const completed = lisProgress.completedUnits.length;
  const lastMiniTest = loadState('lastMiniTestAt', 0);
  const interval = getMiniTestInterval();

  return completed > 0 && completed >= lastMiniTest + interval;
}

function getMiniTestLevel() {
  // Use listening level since it drives progression
  return getModuleLevel('listening');
}

// ===== Mini-Test Logic =====

function startMiniTest() {
  const level = getMiniTestLevel();
  const pool = MINI_TEST_POOLS[level] || MINI_TEST_POOLS.a1;

  // Pick random questions from pool
  const vocabQs = shuffleArray([...pool.vocabulary]).slice(0, 5);
  const grammarQs = shuffleArray([...pool.grammar]).slice(0, 5);
  const listeningQs = shuffleArray([...pool.listening]).slice(0, 3);
  const pronQs = shuffleArray([...pool.pronunciation]).slice(0, 2);

  miniTestState = {
    level: level,
    phase: 'intro', // intro, vocabulary, grammar, listening, pronunciation, results
    currentQuestion: 0,
    vocabQuestions: vocabQs,
    grammarQuestions: grammarQs,
    listeningQuestions: listeningQs,
    pronunciationQuestions: pronQs,
    vocabAnswers: [],
    grammarAnswers: [],
    listeningAnswers: [],
    pronunciationAnswers: [],
    startTime: Date.now()
  };

  renderMiniTest();
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function submitMiniVocab(input) {
  const q = miniTestState.vocabQuestions[miniTestState.currentQuestion];
  const answer = input.trim().toLowerCase();
  const correct = answer === q.answer.toLowerCase() ||
    (q.alts && q.alts.some(a => answer === a.toLowerCase()));

  miniTestState.vocabAnswers.push({ correct });
  miniTestState.currentQuestion++;

  if (miniTestState.currentQuestion >= miniTestState.vocabQuestions.length) {
    miniTestState.phase = 'grammar';
    miniTestState.currentQuestion = 0;
  }
  renderMiniTest();
}

function submitMiniGrammar(optionIndex) {
  const q = miniTestState.grammarQuestions[miniTestState.currentQuestion];
  miniTestState.grammarAnswers.push({ correct: optionIndex === q.answer });
  miniTestState.currentQuestion++;

  if (miniTestState.currentQuestion >= miniTestState.grammarQuestions.length) {
    miniTestState.phase = 'listening';
    miniTestState.currentQuestion = 0;
  }
  renderMiniTest();
}

function submitMiniListening(input) {
  const q = miniTestState.listeningQuestions[miniTestState.currentQuestion];
  const answer = input.trim().toLowerCase();
  const expected = q.text.toLowerCase().replace(/[^a-z\s]/g, '');
  const words = expected.split(/\s+/);
  const answerWords = answer.replace(/[^a-z\s]/g, '').split(/\s+/);

  let matched = 0;
  for (const w of words) {
    if (answerWords.includes(w)) matched++;
  }
  const score = words.length > 0 ? matched / words.length : 0;

  miniTestState.listeningAnswers.push({ correct: score >= 0.6, score });
  miniTestState.currentQuestion++;

  if (miniTestState.currentQuestion >= miniTestState.listeningQuestions.length) {
    miniTestState.phase = 'pronunciation';
    miniTestState.currentQuestion = 0;
  }
  renderMiniTest();
}

function submitMiniPronunciation(optionIndex) {
  const q = miniTestState.pronunciationQuestions[miniTestState.currentQuestion];
  miniTestState.pronunciationAnswers.push({ correct: optionIndex === q.answer });
  miniTestState.currentQuestion++;

  if (miniTestState.currentQuestion >= miniTestState.pronunciationQuestions.length) {
    miniTestState.phase = 'results';
    saveMiniTestResults();
  }
  renderMiniTest();
}

function saveMiniTestResults() {
  const scores = {
    vocabulary: miniTestState.vocabAnswers.filter(a => a.correct).length / miniTestState.vocabAnswers.length,
    grammar: miniTestState.grammarAnswers.filter(a => a.correct).length / miniTestState.grammarAnswers.length,
    listening: miniTestState.listeningAnswers.filter(a => a.correct).length / miniTestState.listeningAnswers.length,
    pronunciation: miniTestState.pronunciationAnswers.filter(a => a.correct).length / miniTestState.pronunciationAnswers.length,
  };
  scores.overall = (scores.vocabulary + scores.grammar + scores.listening + scores.pronunciation) / 4;

  // Save to history
  const history = loadState('miniTestHistory', []);
  history.push({
    date: new Date().toISOString(),
    level: miniTestState.level,
    scores: scores,
    duration: Math.round((Date.now() - miniTestState.startTime) / 1000)
  });
  saveState('miniTestHistory', history);

  // Mark mini-test as done at current progress
  const lisProgress = getModuleProgress('listening');
  saveState('lastMiniTestAt', lisProgress.completedUnits.length);

  // Apply adaptive difficulty
  applyAdaptiveDifficulty(scores);
}

function applyAdaptiveDifficulty(scores) {
  const adaptive = loadState('adaptiveDifficulty', { ttsSpeedAdjust: 0, vocabBoost: false });

  if (scores.overall >= 0.8) {
    // Doing well — increase challenge
    adaptive.ttsSpeedAdjust = Math.min(adaptive.ttsSpeedAdjust + 0.1, 0.3);
    adaptive.vocabBoost = true;
    adaptive.recommendation = 'excellent';
  } else if (scores.overall >= 0.5) {
    // On track — maintain
    adaptive.recommendation = 'good';
  } else {
    // Struggling — decrease challenge
    adaptive.ttsSpeedAdjust = Math.max(adaptive.ttsSpeedAdjust - 0.1, -0.2);
    adaptive.vocabBoost = false;
    adaptive.recommendation = 'review';
  }

  // Per-skill adjustments
  if (scores.listening < 0.4) {
    adaptive.listeningSlowdown = true;
  } else {
    adaptive.listeningSlowdown = false;
  }

  saveState('adaptiveDifficulty', adaptive);
}

function getAdaptiveDifficulty() {
  return loadState('adaptiveDifficulty', { ttsSpeedAdjust: 0, vocabBoost: false, recommendation: 'good', listeningSlowdown: false });
}

function getMiniTestHistory() {
  return loadState('miniTestHistory', []);
}

function finishMiniTest() {
  miniTestState = null;
  showDashboard();
}

function playMiniTestAudio(questionIndex) {
  if (!miniTestState) return;
  const q = miniTestState.listeningQuestions[questionIndex];
  if (q && typeof speak === 'function') {
    const originalRate = speechRate;
    const adaptive = getAdaptiveDifficulty();
    speechRate = (q.speed || 1.0) + (adaptive.ttsSpeedAdjust || 0);
    if (adaptive.listeningSlowdown) speechRate = Math.max(speechRate - 0.1, 0.6);
    speak(q.text, () => { speechRate = originalRate; });
  }
}

function playMiniPronunciationAudio(questionIndex) {
  if (!miniTestState) return;
  const q = miniTestState.pronunciationQuestions[questionIndex];
  if (q && typeof speak === 'function') {
    const originalRate = speechRate;
    speechRate = 0.9;
    speak(q.word, () => { speechRate = originalRate; });
  }
}

// ===== Mini-Test Rendering =====

function renderMiniTest() {
  const main = document.getElementById('main');

  switch (miniTestState.phase) {
    case 'intro': main.innerHTML = renderMiniTestIntro(); break;
    case 'vocabulary': main.innerHTML = renderMiniTestVocab(); break;
    case 'grammar': main.innerHTML = renderMiniTestGrammar(); break;
    case 'listening': main.innerHTML = renderMiniTestListening(); break;
    case 'pronunciation': main.innerHTML = renderMiniTestPronunciation(); break;
    case 'results': main.innerHTML = renderMiniTestResults(); break;
  }
}

function renderMiniTestIntro() {
  const testNum = getMiniTestHistory().length + 1;
  return `
    <div class="test-page">
      <div class="test-welcome">
        <h2>Mini-test #${testNum}</h2>
        <p>Es hora de medir tu progreso. Son 15 preguntas rapidas (~5 minutos).</p>
        <div class="test-steps-preview">
          <div class="test-step-item"><span class="test-step-num">1</span><div><strong>5 Vocabulario</strong></div></div>
          <div class="test-step-item"><span class="test-step-num">2</span><div><strong>5 Gramatica</strong></div></div>
          <div class="test-step-item"><span class="test-step-num">3</span><div><strong>3 Listening</strong></div></div>
          <div class="test-step-item"><span class="test-step-num">4</span><div><strong>2 Pronunciacion</strong></div></div>
        </div>
        <p class="test-note">Nivel: ${miniTestState.level.toUpperCase()} — Los resultados ajustaran la dificultad automaticamente.</p>
        <button class="btn-start-test" data-action="startMiniTestQuestions">Empezar</button>
      </div>
    </div>`;
}

function renderMiniTestVocab() {
  const q = miniTestState.vocabQuestions[miniTestState.currentQuestion];
  const progress = miniTestState.currentQuestion + 1;
  const total = miniTestState.vocabQuestions.length;

  return `
    <div class="test-page">
      <div class="test-header">
        <span class="test-phase-badge">Mini-test: Vocabulario</span>
        <span class="test-progress">${progress} / ${total}</span>
      </div>
      <div class="test-progress-bar">
        <div class="test-progress-fill" style="width:${(progress / total) * 100}%"></div>
      </div>
      <div class="test-question-card">
        <p class="test-instruction">Traduce al ingles:</p>
        <p class="test-word">${escapeHtml(q.es)}</p>
        <input type="text" class="test-input" id="miniVocabInput"
          placeholder="Escribe en ingles..."
          autocomplete="off" autocapitalize="off" spellcheck="false">
        <button class="btn-test-next" data-action="submitMiniVocab">Siguiente</button>
        <button class="btn-test-skip" data-action="skipMiniVocab">No lo se</button>
      </div>
    </div>`;
}

function renderMiniTestGrammar() {
  const q = miniTestState.grammarQuestions[miniTestState.currentQuestion];
  const progress = miniTestState.currentQuestion + 1;
  const total = miniTestState.grammarQuestions.length;

  let optionsHtml = '';
  q.options.forEach((opt, i) => {
    optionsHtml += `<button class="test-option" data-action="submitMiniGrammar" data-option="${i}">${escapeHtml(opt)}</button>`;
  });

  return `
    <div class="test-page">
      <div class="test-header">
        <span class="test-phase-badge test-phase-grammar">Mini-test: Gramatica</span>
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

function renderMiniTestListening() {
  const progress = miniTestState.currentQuestion + 1;
  const total = miniTestState.listeningQuestions.length;

  return `
    <div class="test-page">
      <div class="test-header">
        <span class="test-phase-badge test-phase-listening">Mini-test: Listening</span>
        <span class="test-progress">${progress} / ${total}</span>
      </div>
      <div class="test-progress-bar">
        <div class="test-progress-fill" style="width:${(progress / total) * 100}%"></div>
      </div>
      <div class="test-question-card">
        <p class="test-instruction">Escucha y escribe lo que oyes:</p>
        <button class="btn-test-play" data-action="playMiniTestAudio" data-q="${miniTestState.currentQuestion}">
          &#9654; Reproducir
        </button>
        <button class="btn-test-play btn-test-replay" data-action="playMiniTestAudio" data-q="${miniTestState.currentQuestion}">
          &#128260; Repetir
        </button>
        <input type="text" class="test-input" id="miniListenInput"
          placeholder="Escribe lo que has oido..."
          autocomplete="off" autocapitalize="off" spellcheck="false">
        <button class="btn-test-next" data-action="submitMiniListening">Siguiente</button>
        <button class="btn-test-skip" data-action="skipMiniListening">No lo entiendo</button>
      </div>
    </div>`;
}

function renderMiniTestPronunciation() {
  const q = miniTestState.pronunciationQuestions[miniTestState.currentQuestion];
  const progress = miniTestState.currentQuestion + 1;
  const total = miniTestState.pronunciationQuestions.length;

  let optionsHtml = '';
  q.options.forEach((opt, i) => {
    optionsHtml += `<button class="test-option test-option-pron" data-action="submitMiniPronunciation" data-option="${i}">${escapeHtml(opt)}</button>`;
  });

  let instruction = 'Escucha y elige la correcta:';
  if (q.special === 'syllables') instruction = '¿Cuantas silabas tiene esta palabra?';
  if (q.special === 'words') instruction = '¿Cuantas palabras hay en esta frase?';
  if (q.special === 'stress') instruction = '¿Que palabra esta enfatizada?';

  return `
    <div class="test-page">
      <div class="test-header">
        <span class="test-phase-badge test-phase-pronunciation">Mini-test: Pronunciacion</span>
        <span class="test-progress">${progress} / ${total}</span>
      </div>
      <div class="test-progress-bar">
        <div class="test-progress-fill" style="width:${(progress / total) * 100}%"></div>
      </div>
      <div class="test-question-card">
        <p class="test-instruction">${instruction}</p>
        <button class="btn-test-play" data-action="playMiniPronunciationAudio" data-q="${miniTestState.currentQuestion}">
          &#9654; Reproducir
        </button>
        <div class="test-options">${optionsHtml}</div>
      </div>
    </div>`;
}

function renderMiniTestResults() {
  const history = getMiniTestHistory();
  const latest = history[history.length - 1];
  if (!latest) return '<p>Error: sin resultados</p>';

  const scores = latest.scores;
  const pct = (v) => Math.round(v * 100);
  const adaptive = getAdaptiveDifficulty();

  const recommendations = {
    excellent: 'Excelente progreso. Se ha aumentado ligeramente la dificultad de listening.',
    good: 'Buen progreso. Sigue asi, vas por buen camino.',
    review: 'Necesitas repasar. Se ha reducido la velocidad de listening para ayudarte.'
  };

  // Build progress chart from history
  let chartHtml = '';
  if (history.length > 1) {
    chartHtml = renderProgressChart(history);
  }

  return `
    <div class="test-page">
      <div class="test-results">
        <h2>Resultados del Mini-test</h2>

        <div class="mini-test-overall">
          <div class="mini-test-score-big">${pct(scores.overall)}%</div>
          <div class="mini-test-recommendation">${recommendations[adaptive.recommendation] || recommendations.good}</div>
        </div>

        <div class="test-levels-grid">
          <div class="test-level-card">
            <span class="test-level-module">Vocabulario</span>
            <span class="test-level-value">${pct(scores.vocabulary)}%</span>
            <div class="mini-score-bar"><div class="mini-score-fill" style="width:${pct(scores.vocabulary)}%; background:var(--green)"></div></div>
          </div>
          <div class="test-level-card">
            <span class="test-level-module">Gramatica</span>
            <span class="test-level-value">${pct(scores.grammar)}%</span>
            <div class="mini-score-bar"><div class="mini-score-fill" style="width:${pct(scores.grammar)}%; background:var(--accent2)"></div></div>
          </div>
          <div class="test-level-card">
            <span class="test-level-module">Listening</span>
            <span class="test-level-value">${pct(scores.listening)}%</span>
            <div class="mini-score-bar"><div class="mini-score-fill" style="width:${pct(scores.listening)}%; background:var(--accent)"></div></div>
          </div>
          <div class="test-level-card">
            <span class="test-level-module">Pronunciacion</span>
            <span class="test-level-value">${pct(scores.pronunciation)}%</span>
            <div class="mini-score-bar"><div class="mini-score-fill" style="width:${pct(scores.pronunciation)}%; background:var(--purple, var(--accent2))"></div></div>
          </div>
        </div>

        ${chartHtml}

        <div class="mini-test-adaptive">
          <h3>Ajustes aplicados</h3>
          <ul>
            ${adaptive.ttsSpeedAdjust > 0 ? '<li>Velocidad de listening aumentada (+' + adaptive.ttsSpeedAdjust.toFixed(1) + 'x)</li>' : ''}
            ${adaptive.ttsSpeedAdjust < 0 ? '<li>Velocidad de listening reducida (' + adaptive.ttsSpeedAdjust.toFixed(1) + 'x)</li>' : ''}
            ${adaptive.ttsSpeedAdjust === 0 ? '<li>Velocidad de listening: sin cambios</li>' : ''}
            ${adaptive.vocabBoost ? '<li>Vocabulario avanzado activado</li>' : ''}
            ${adaptive.listeningSlowdown ? '<li>Modo escucha lenta activado</li>' : ''}
          </ul>
        </div>

        <button class="btn-start-learning" data-action="finishMiniTest">Volver al dashboard</button>
      </div>
    </div>`;
}

function renderProgressChart(history) {
  if (history.length < 2) return '';

  const maxBars = 8;
  const recent = history.slice(-maxBars);
  const skills = ['vocabulary', 'grammar', 'listening', 'pronunciation'];
  const colors = { vocabulary: 'var(--green)', grammar: 'var(--accent2)', listening: 'var(--accent)', pronunciation: 'var(--purple, var(--accent2))' };
  const labels = { vocabulary: 'Vocab', grammar: 'Gram', listening: 'List', pronunciation: 'Pron' };

  let h = '<div class="progress-chart">';
  h += '<h3>Evolucion</h3>';

  // Chart legend
  h += '<div class="chart-legend">';
  for (const skill of skills) {
    h += `<span class="chart-legend-item"><span class="chart-legend-color" style="background:${colors[skill]}"></span>${labels[skill]}</span>`;
  }
  h += '</div>';

  // Chart bars
  h += '<div class="chart-bars">';
  recent.forEach((entry, idx) => {
    const date = new Date(entry.date).toLocaleDateString('es', { day: 'numeric', month: 'short' });
    h += '<div class="chart-bar-group">';
    for (const skill of skills) {
      const pct = Math.round((entry.scores[skill] || 0) * 100);
      h += `<div class="chart-bar" style="height:${pct}%; background:${colors[skill]}" title="${labels[skill]}: ${pct}%"></div>`;
    }
    h += `<div class="chart-bar-label">#${idx + 1}</div>`;
    h += '</div>';
  });
  h += '</div>';
  h += '</div>';
  return h;
}
