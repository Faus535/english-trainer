/**
 * App initialization, event delegation, and keyboard navigation.
 * Modular system - test → dashboard → session flow.
 */

let currentPage = 'plan';

// ===== Theme Management =====

function initTheme() {
  const saved = localStorage.getItem('english_plan_theme');
  if (saved === 'light') {
    document.documentElement.classList.add('light-theme');
    document.documentElement.classList.remove('dark-theme');
    updateThemeMeta();
  } else if (saved === 'dark') {
    document.documentElement.classList.add('dark-theme');
    document.documentElement.classList.remove('light-theme');
    updateThemeMeta();
  }
  updateThemeIcon();
}

function toggleTheme() {
  const isCurrentlyLight = document.documentElement.classList.contains('light-theme') ||
    (!document.documentElement.classList.contains('dark-theme') &&
     window.matchMedia('(prefers-color-scheme: light)').matches);

  if (isCurrentlyLight) {
    document.documentElement.classList.remove('light-theme');
    document.documentElement.classList.add('dark-theme');
    localStorage.setItem('english_plan_theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark-theme');
    document.documentElement.classList.add('light-theme');
    localStorage.setItem('english_plan_theme', 'light');
  }
  updateThemeMeta();
  updateThemeIcon();
}

function updateThemeMeta() {
  const meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) return;
  const bg = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim();
  meta.setAttribute('content', bg);
}

function updateThemeIcon() {
  const btn = document.getElementById('btnTheme');
  if (!btn) return;
  const isLight = document.documentElement.classList.contains('light-theme') ||
    (!document.documentElement.classList.contains('dark-theme') &&
     window.matchMedia('(prefers-color-scheme: light)').matches);
  btn.innerHTML = isLight ? '&#9728;' : '&#9790;';
}

// ===== Settings Panel =====

function toggleSettings() {
  const panel = document.getElementById('settingsPanel');
  const btn = document.getElementById('btnSettings');
  if (!panel) return;
  panel.classList.toggle('open');
  if (btn) btn.classList.toggle('active');
}

// ===== Init =====

function initApp() {
  try {
    initTheme();
    initTTS();
    setupEventDelegation();
    registerServiceWorker();
    render();
  } catch (e) {
    document.getElementById('main').innerHTML =
      `<div style="padding:40px;text-align:center;color:#e94560">` +
      `<h2>Error al iniciar</h2><p>${escapeHtml(e.message)}</p>` +
      `<p style="color:#aab;margin-top:12px">Recarga la pagina o contacta soporte.</p></div>`;
    console.error('App init error:', e);
  }
}

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch((err) => {
      console.warn('Service worker registration failed:', err);
    });
  }
}

function navigateTo(page) {
  currentPage = page;

  document.querySelectorAll('.bottom-tab').forEach(t => t.classList.remove('active'));
  const tab = document.getElementById('tab-' + page);
  if (tab) tab.classList.add('active');

  const progressEl = document.getElementById('progressContainer');
  if (progressEl) progressEl.style.display = page === 'plan' ? '' : 'none';

  if (page === 'plan') {
    render();
  } else if (page === 'flashcards') {
    renderFlashcardsView();
  } else if (page === 'speak') {
    renderSpeakQuizView();
  } else if (page === 'translator') {
    renderTranslatorView();
  } else if (page === 'achievements') {
    renderAchievementsView();
  }
}

// ===== Event Delegation =====

function setupEventDelegation() {
  document.addEventListener('click', (e) => {
    const target = e.target.closest('[data-action]');
    if (!target) return;

    const action = target.dataset.action;

    switch (action) {
      // Header actions
      case 'showDashboard':
        navigateTo('plan');
        showDashboard();
        break;
      case 'navigateTo':
        navigateTo(target.dataset.page);
        break;
      case 'stopSpeech':
        stopSpeech();
        break;
      case 'resetProgress':
        resetProgress();
        break;
      case 'exportProgress':
        exportProgress();
        break;
      case 'toggleTheme':
        toggleTheme();
        break;
      case 'toggleSettings':
        toggleSettings();
        break;

      // Test actions
      case 'startTest':
        startTest();
        break;
      case 'submitVocab': {
        const input = document.getElementById('testVocabInput');
        if (input) submitVocabAnswer(input.value);
        break;
      }
      case 'skipVocab':
        submitVocabAnswer('');
        break;
      case 'submitGrammar':
        submitGrammarAnswer(parseInt(target.dataset.option));
        break;
      case 'submitListening': {
        const input = document.getElementById('testListenInput');
        if (input) submitListeningAnswer(input.value);
        break;
      }
      case 'skipListening':
        submitListeningAnswer('');
        break;
      case 'playTestAudio':
        playTestAudio(parseInt(target.dataset.q));
        break;
      case 'submitPronunciation':
        submitPronunciationAnswer(parseInt(target.dataset.option));
        break;
      case 'playPronunciationAudio':
        playPronunciationAudio(parseInt(target.dataset.q));
        break;
      case 'finishTest':
        showDashboard();
        break;
      case 'selectLevel':
        skipTestWithLevel(target.dataset.level);
        break;

      // Session actions
      case 'startSession':
        startSession(target.dataset.mode || 'full');
        break;
      case 'resumeSession':
        resumeSession();
        break;
      case 'advanceBlock':
        advanceBlock();
        break;
      case 'goBackBlock':
        goBackBlock();
        break;
      case 'goToBlock':
        goToBlock(parseInt(target.dataset.block));
        break;
      case 'completeSession':
        completeSession();
        break;
      case 'abandonSession':
        abandonSession();
        break;

      // Exercise item-by-item actions
      case 'showExerciseAnswer':
        showExerciseAnswer(parseInt(target.dataset.idx));
        break;
      case 'nextExerciseItem':
        nextExerciseItem();
        break;
      case 'prevExerciseItem':
        prevExerciseItem();
        break;
      case 'revealVocabWord':
        revealVocabWord(parseInt(target.dataset.idx));
        break;
      case 'nextVocabWord':
        nextVocabWord();
        break;
      case 'prevVocabWord':
        prevVocabWord();
        break;

      // Speech recognition actions
      case 'toggleRecording':
        handleToggleRecording(target.dataset.expected, target.dataset.item);
        break;

      // Speak quiz actions
      case 'nextSpeakPhrase':
        nextSpeakPhrase();
        break;
      case 'prevSpeakPhrase':
        prevSpeakPhrase();
        break;
      case 'revealSpeakPhrase':
        revealSpeakPhrase();
        break;
      case 'setSpeakLevel':
        setSpeakQuizLevel(target.dataset.level);
        break;

      // Gamification actions
      case 'revealPhrase':
        revealPhrase();
        render();
        break;
      case 'newPhrase':
        getRandomPhrase();
        render();
        break;

      // Flashcard actions
      case 'speakWord':
        if (target.dataset.word) {
          speak(target.dataset.word);
        } else {
          speakWord();
        }
        break;
      case 'speakExample':
        speakExample();
        break;
      case 'speakFlashcard':
        speakFlashcard();
        break;
      case 'showTranslation':
        showTranslation();
        break;
      case 'prevFlashcard':
        prevFlashcard();
        break;
      case 'nextFlashcard':
        nextFlashcard();
        break;

      // Translator actions
      case 'setTranslatorDir':
        setTranslatorDirection(target.dataset.dir);
        break;
      case 'doTranslate':
        doTranslate();
        break;
      case 'clearTranslator':
        clearTranslator();
        break;
      case 'speakTranslatorOriginal':
        speakTranslatorOriginal();
        break;
      case 'speakTranslatorResult':
        speakTranslatorResult();
        break;

      // Markdown table actions
      case 'playCell':
        playCell(target, target.dataset.text);
        break;
      case 'playAllTable':
        playAllTable(document.getElementById(target.dataset.tableId));
        break;
      case 'playAllMd':
        playAllMd(document.getElementById(target.dataset.viewerId));
        break;

      // Mini-test actions
      case 'triggerMiniTest':
        startMiniTest();
        break;
      case 'startMiniTestQuestions':
        if (miniTestState) { miniTestState.phase = 'vocabulary'; miniTestState.currentQuestion = 0; renderMiniTest(); }
        break;
      case 'submitMiniVocab': {
        const inp = document.getElementById('miniVocabInput');
        if (inp) submitMiniVocab(inp.value);
        break;
      }
      case 'skipMiniVocab':
        submitMiniVocab('');
        break;
      case 'submitMiniGrammar':
        submitMiniGrammar(parseInt(target.dataset.option));
        break;
      case 'submitMiniListening': {
        const inp2 = document.getElementById('miniListenInput');
        if (inp2) submitMiniListening(inp2.value);
        break;
      }
      case 'skipMiniListening':
        submitMiniListening('');
        break;
      case 'submitMiniPronunciation':
        submitMiniPronunciation(parseInt(target.dataset.option));
        break;
      case 'playMiniTestAudio':
        playMiniTestAudio(parseInt(target.dataset.q));
        break;
      case 'playMiniPronunciationAudio':
        playMiniPronunciationAudio(parseInt(target.dataset.q));
        break;
      case 'finishMiniTest':
        finishMiniTest();
        break;

      // Retake test
      case 'retakeTest':
        retakeTest();
        break;

      // Dictation note saving
      case 'saveDictNote': {
        const noteId = target.dataset.noteId;
        if (noteId) saveDictationNote(noteId, target.value);
        break;
      }
    }
  });

  // Input delegation for textareas
  const debouncedSaveNote = debounce((noteId, value) => {
    saveDictationNote(noteId, value);
  }, 300);

  document.addEventListener('input', (e) => {
    const target = e.target.closest('[data-action="saveDictNote"]');
    if (target && target.dataset.noteId) {
      debouncedSaveNote(target.dataset.noteId, target.value);
    }
  });

  // Enter key in test inputs
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      if (e.target.id === 'testVocabInput') {
        e.preventDefault();
        submitVocabAnswer(e.target.value);
        return;
      }
      if (e.target.id === 'testListenInput') {
        e.preventDefault();
        submitListeningAnswer(e.target.value);
        return;
      }
      if (e.target.id === 'miniVocabInput') {
        e.preventDefault();
        submitMiniVocab(e.target.value);
        return;
      }
      if (e.target.id === 'miniListenInput') {
        e.preventDefault();
        submitMiniListening(e.target.value);
        return;
      }
    }

    // Ctrl+Enter in translator
    if (e.target.id === 'translatorInput' && e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      doTranslate();
      return;
    }

    // Keyboard activation for role="button"
    if ((e.key === 'Enter' || e.key === ' ') && e.target.closest('[role="button"][data-action]')) {
      e.preventDefault();
      e.target.click();
      return;
    }
  });

  // Keyboard shortcuts for flashcards
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') {
      return;
    }
    if (currentPage === 'flashcards') {
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); nextFlashcard(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); prevFlashcard(); }
      if (e.key === 'ArrowDown' || e.key === 'Enter') { e.preventDefault(); showTranslation(); }
      if (e.key === 'p' || e.key === 'P') speakFlashcard();
      if (e.key === 'Escape') navigateTo('plan');
    }
  });
}

// Start
initApp();
