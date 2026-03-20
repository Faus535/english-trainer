/**
 * Speech Recognition module - validates user pronunciation.
 * Uses Web Speech Recognition API (SpeechRecognition / webkitSpeechRecognition).
 * Compares spoken text vs expected text word-by-word.
 */

// ===== Browser Support =====

const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
const speechRecSupported = !!SpeechRecognitionAPI;

// ===== Recognition State =====

let recognitionInstance = null;
let recognitionState = 'idle'; // 'idle' | 'recording' | 'processing' | 'result'
let recognitionResult = null;
let recognitionExpected = '';
let recognitionCallback = null;
let recognitionTimeout = null;

// ===== Core Functions =====

function startPronunciationCheck(expectedText, callback) {
  if (!speechRecSupported) return;
  if (recognitionState === 'recording') {
    stopPronunciationCheck();
    return;
  }

  recognitionExpected = expectedText;
  recognitionCallback = callback;
  recognitionResult = null;
  recognitionState = 'recording';

  recognitionInstance = new SpeechRecognitionAPI();
  recognitionInstance.lang = 'en-US';
  recognitionInstance.interimResults = false;
  recognitionInstance.maxAlternatives = 1;
  recognitionInstance.continuous = false;

  recognitionInstance.onresult = function(event) {
    clearTimeout(recognitionTimeout);
    const transcript = event.results[0][0].transcript;
    const confidence = event.results[0][0].confidence;
    recognitionState = 'processing';

    // Compare with expected
    const comparison = compareTexts(recognitionExpected, transcript);
    recognitionResult = {
      transcript: transcript,
      confidence: confidence,
      expected: recognitionExpected,
      score: comparison.score,
      words: comparison.words
    };
    recognitionState = 'result';

    if (recognitionCallback) recognitionCallback(recognitionResult);
  };

  recognitionInstance.onerror = function(event) {
    clearTimeout(recognitionTimeout);
    recognitionState = 'idle';
    recognitionResult = { error: event.error };
    if (recognitionCallback) recognitionCallback(recognitionResult);
  };

  recognitionInstance.onend = function() {
    clearTimeout(recognitionTimeout);
    if (recognitionState === 'recording') {
      // Ended without result
      recognitionState = 'idle';
      recognitionResult = { error: 'no-speech' };
      if (recognitionCallback) recognitionCallback(recognitionResult);
    }
  };

  recognitionInstance.start();

  // Auto-stop after 10 seconds
  recognitionTimeout = setTimeout(() => {
    stopPronunciationCheck();
  }, 10000);
}

function stopPronunciationCheck() {
  clearTimeout(recognitionTimeout);
  if (recognitionInstance) {
    try { recognitionInstance.stop(); } catch (e) { /* ignore */ }
    recognitionInstance = null;
  }
  if (recognitionState === 'recording') {
    recognitionState = 'idle';
  }
}

// ===== Text Comparison =====

function compareTexts(expected, spoken) {
  const normalize = (t) => t.toLowerCase().replace(/[^a-z0-9\s']/g, '').trim().split(/\s+/);
  const expectedWords = normalize(expected);
  const spokenWords = normalize(spoken);

  const words = [];
  let matched = 0;

  for (let i = 0; i < expectedWords.length; i++) {
    const ew = expectedWords[i];
    // Check if this word appears in spoken words (fuzzy position)
    const found = spokenWords.some(sw => wordsMatch(ew, sw));
    words.push({ word: ew, correct: found });
    if (found) matched++;
  }

  const score = expectedWords.length > 0 ? Math.round((matched / expectedWords.length) * 100) : 0;
  return { score, words };
}

function wordsMatch(expected, spoken) {
  if (expected === spoken) return true;
  // Allow minor differences (1 char for words > 3 chars)
  if (expected.length > 3 && spoken.length > 3) {
    let diff = 0;
    const maxLen = Math.max(expected.length, spoken.length);
    const minLen = Math.min(expected.length, spoken.length);
    if (maxLen - minLen > 1) return false;
    for (let i = 0; i < minLen; i++) {
      if (expected[i] !== spoken[i]) diff++;
    }
    diff += maxLen - minLen;
    return diff <= 1;
  }
  return false;
}

// ===== Feedback Messages =====

function getPronunciationFeedback(score) {
  if (score >= 90) return { level: 'excellent', msg: 'Excelente! Pronunciacion casi perfecta.', cls: 'feedback-excellent' };
  if (score >= 70) return { level: 'good', msg: 'Muy bien! Unas pocas palabras para mejorar.', cls: 'feedback-good' };
  if (score >= 50) return { level: 'ok', msg: 'Casi! Revisa las palabras en rojo.', cls: 'feedback-ok' };
  return { level: 'retry', msg: 'Intentalo de nuevo. Escucha primero y repite.', cls: 'feedback-retry' };
}

// ===== UI Rendering =====

function renderPronunciationButton(expectedText, itemId) {
  if (!speechRecSupported) return '';

  let h = `<div class="pronunciation-check" id="pron-check-${itemId}">`;
  h += `<button class="btn-record" data-action="toggleRecording" data-expected="${escapeHtml(expectedText)}" data-item="${itemId}">`;
  h += `<span class="record-icon">&#127908;</span> Repite la frase`;
  h += `</button>`;
  h += `<div class="pron-result" id="pron-result-${itemId}"></div>`;
  h += `</div>`;
  return h;
}

function renderPronunciationButtonWord(expectedWord, itemId) {
  if (!speechRecSupported) return '';

  let h = `<div class="pronunciation-check pronunciation-check-inline" id="pron-check-${itemId}">`;
  h += `<button class="btn-record btn-record-small" data-action="toggleRecording" data-expected="${escapeHtml(expectedWord)}" data-item="${itemId}">`;
  h += `<span class="record-icon">&#127908;</span>`;
  h += `</button>`;
  h += `<div class="pron-result" id="pron-result-${itemId}"></div>`;
  h += `</div>`;
  return h;
}

function handleToggleRecording(expected, itemId) {
  function getBtn() {
    const container = document.getElementById('pron-check-' + itemId);
    return container ? container.querySelector('.btn-record') : null;
  }
  function getResultDiv() {
    return document.getElementById('pron-result-' + itemId);
  }

  if (recognitionState === 'recording') {
    stopPronunciationCheck();
    const btn = getBtn();
    if (btn) {
      btn.classList.remove('recording');
      btn.innerHTML = '<span class="record-icon">&#127908;</span> Repite la frase';
    }
    return;
  }

  // Start recording
  const btn = getBtn();
  const resultDiv = getResultDiv();
  if (btn) {
    btn.classList.add('recording');
    btn.innerHTML = '<span class="record-pulse"></span> Escuchando...';
  }
  if (resultDiv) resultDiv.innerHTML = '';

  startPronunciationCheck(expected, function(result) {
    // Re-query DOM elements — the original references may be stale (especially on iOS)
    const cbBtn = getBtn();
    const cbResultDiv = getResultDiv();

    if (cbBtn) {
      cbBtn.classList.remove('recording');
      cbBtn.innerHTML = '<span class="record-icon">&#127908;</span> Intentar de nuevo';
    }

    if (!cbResultDiv) return;

    if (result.error) {
      const errorMsg = result.error === 'no-speech'
        ? 'No se detecto voz. Intentalo de nuevo.'
        : result.error === 'not-allowed'
          ? 'Permiso de microfono denegado. Activalo en ajustes del navegador.'
          : 'Error: ' + result.error;
      cbResultDiv.innerHTML = `<div class="pron-feedback feedback-retry">${escapeHtml(errorMsg)}</div>`;
      return;
    }

    const feedback = getPronunciationFeedback(result.score);

    let html = `<div class="pron-feedback ${feedback.cls}">`;
    html += `<div class="pron-score">${result.score}%</div>`;
    html += `<div class="pron-msg">${escapeHtml(feedback.msg)}</div>`;
    html += `</div>`;

    // Word-by-word comparison
    html += '<div class="pron-words">';
    result.words.forEach(w => {
      const cls = w.correct ? 'pron-word-ok' : 'pron-word-fail';
      html += `<span class="${cls}">${escapeHtml(w.word)}</span> `;
    });
    html += '</div>';

    // Show what was heard
    html += `<div class="pron-heard">Oido: "${escapeHtml(result.transcript)}"</div>`;

    // Tips for improvement
    if (result.score < 100) {
      const failedWords = result.words.filter(w => !w.correct).map(w => w.word);
      html += '<div class="pron-tips">';
      html += '<div class="pron-tips-title">Consejos:</div>';
      if (result.score < 50) {
        html += '<p>Escucha la frase primero y repite despues, imitando el ritmo y la entonacion.</p>';
      }
      if (failedWords.length > 0) {
        html += `<p>Practica estas palabras: <strong>${failedWords.join(', ')}</strong></p>`;
      }
      if (result.score >= 50 && result.score < 90) {
        html += '<p>Casi perfecto! Intenta hablar mas despacio y vocalizar cada palabra.</p>';
      }
      html += '</div>';
    }

    cbResultDiv.innerHTML = html;
  });
}
