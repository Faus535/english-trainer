/**
 * App initialization, event delegation, and keyboard navigation.
 */

let currentPage = 'plan'; // 'plan' or 'flashcards'

function initApp() {
  try {
    // Validate critical data structures
    if (!Array.isArray(PLAN) || !PLAN.length) {
      throw new Error('Plan data is missing or empty');
    }
    if (!Array.isArray(VOCAB_DATA) || !VOCAB_DATA.length) {
      throw new Error('Vocabulary data is missing or empty');
    }
    if (typeof FILES_DATA !== 'object') {
      throw new Error('Files data is missing');
    }

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

  // Update tab styles
  document.querySelectorAll('.bottom-tab').forEach(t => t.classList.remove('active'));
  const tab = document.getElementById('tab-' + page);
  if (tab) tab.classList.add('active');

  // Show/hide progress bar (only on plan page)
  const progressEl = document.getElementById('progressContainer');
  if (progressEl) progressEl.style.display = page === 'plan' ? '' : 'none';

  if (page === 'plan') {
    render();
  } else if (page === 'flashcards') {
    renderFlashcardsView();
  } else if (page === 'translator') {
    renderTranslatorView();
  } else if (page === 'achievements') {
    renderAchievementsView();
  }
}

// ===== Event Delegation =====

function setupEventDelegation() {
  // Click delegation on entire document
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

      // Dashboard actions
      case 'toggleWeek':
        toggleWeek(parseInt(target.dataset.week));
        break;
      case 'openDay':
        openDay(parseInt(target.dataset.day));
        break;
      case 'toggleDay':
        toggleDay(parseInt(target.dataset.day));
        break;
      case 'toggleFileViewer':
        toggleFileViewer(target.dataset.actId);
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
    }
  });

  // Change delegation for checkboxes
  document.addEventListener('change', (e) => {
    const target = e.target.closest('[data-action]');
    if (!target) return;

    if (target.dataset.action === 'toggleMilestone') {
      toggleMilestone(parseInt(target.dataset.index));
    }
  });

  // Input delegation for textareas (debounced)
  const debouncedSaveNote = debounce((dayNum, actIndex, value) => {
    saveDictationNote(dayNum, actIndex, value);
  }, 300);

  document.addEventListener('input', (e) => {
    const target = e.target.closest('[data-action="saveDictationNote"]');
    if (!target) return;

    debouncedSaveNote(
      parseInt(target.dataset.day),
      parseInt(target.dataset.actIndex),
      target.value
    );
  });

  // Keyboard activation for elements with role="button"
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const target = e.target.closest('[role="button"][data-action]');
      if (target) {
        e.preventDefault();
        target.click();
      }
    }
  });
}

// Keyboard shortcuts (debounced to prevent rapid-fire)
const handleKeyNav = debounce((key) => {
  if (currentPage === 'flashcards') {
    if (key === 'ArrowRight' || key === ' ') nextFlashcard();
    if (key === 'ArrowLeft') prevFlashcard();
    if (key === 'ArrowDown' || key === 'Enter') showTranslation();
    if (key === 'p' || key === 'P') speakFlashcard();
    if (key === 'Escape') navigateTo('plan');
    return;
  }

  if (typeof currentView === 'number') {
    if (key === 'ArrowLeft' && currentView > 1) openDay(currentView - 1);
    if (key === 'ArrowRight' && currentView < TOTAL_DAYS) openDay(currentView + 1);
    if (key === 'Escape') showDashboard();
  }
}, 100);

document.addEventListener('keydown', (e) => {
  // Ctrl+Enter in translator textarea triggers translation
  if (e.target.id === 'translatorInput' && e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    doTranslate();
    return;
  }

  // Don't handle shortcuts when typing in inputs
  if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') {
    return;
  }

  // Prevent default for navigation keys
  if (['ArrowLeft', 'ArrowRight', 'ArrowDown', ' '].includes(e.key)) {
    // Only prevent if not on a focusable element
    if (!e.target.closest('button, a, [tabindex]') || e.target.closest('#main')) {
      e.preventDefault();
    }
  }

  handleKeyNav(e.key);
});

// Start
initApp();
