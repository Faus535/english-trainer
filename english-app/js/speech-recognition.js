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
  recognitionInstance.interimResults = true;
  recognitionInstance.maxAlternatives = 1;
  recognitionInstance.continuous = true;

  // Accumulate all results (interim + final)
  let lastTranscript = '';
  let lastConfidence = 0;

  recognitionInstance.onresult = function(event) {
    // Collect the latest transcript from all results
    let transcript = '';
    let confidence = 0;
    for (let i = 0; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        confidence = Math.max(confidence, event.results[i][0].confidence);
      }
    }
    lastTranscript = transcript;
    lastConfidence = confidence || event.results[0][0].confidence;
  };

  recognitionInstance.onerror = function(event) {
    clearTimeout(recognitionTimeout);
    recognitionState = 'idle';
    recognitionResult = { error: event.error };
    if (recognitionCallback) recognitionCallback(recognitionResult);
  };

  recognitionInstance.onend = function() {
    clearTimeout(recognitionTimeout);
    if (recognitionState === 'recording' || recognitionState === 'stopping') {
      if (lastTranscript) {
        // Process whatever was captured
        const comparison = compareTexts(recognitionExpected, lastTranscript);
        recognitionResult = {
          transcript: lastTranscript,
          confidence: lastConfidence,
          expected: recognitionExpected,
          score: comparison.score,
          words: comparison.words
        };
        recognitionState = 'result';
        if (recognitionCallback) recognitionCallback(recognitionResult);
      } else {
        recognitionState = 'idle';
        recognitionResult = { error: 'no-speech' };
        if (recognitionCallback) recognitionCallback(recognitionResult);
      }
    }
  };

  recognitionInstance.start();

  // Auto-stop after 15 seconds
  recognitionTimeout = setTimeout(() => {
    stopPronunciationCheck();
  }, 15000);
}

function stopPronunciationCheck() {
  clearTimeout(recognitionTimeout);
  if (recognitionInstance) {
    recognitionState = 'stopping';
    try { recognitionInstance.stop(); } catch (e) { /* ignore */ }
    recognitionInstance = null;
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
  h += `<span class="record-icon">&#127908;</span> Grabar`;
  h += `</button>`;
  h += `<button class="btn-check-pron" data-action="checkRecording" data-item="${itemId}" style="display:none">`;
  h += `&#9989; Comprobar`;
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
  function getCheckBtn() {
    const container = document.getElementById('pron-check-' + itemId);
    return container ? container.querySelector('.btn-check-pron') : null;
  }
  function getResultDiv() {
    return document.getElementById('pron-result-' + itemId);
  }

  if (recognitionState === 'recording') {
    // If user clicks record again while recording, also stop
    stopPronunciationCheck();
    return;
  }

  // Start recording
  const btn = getBtn();
  const checkBtn = getCheckBtn();
  const resultDiv = getResultDiv();
  if (btn) {
    btn.classList.add('recording');
    btn.innerHTML = '<span class="record-pulse"></span> Grabando...';
  }
  if (checkBtn) checkBtn.style.display = '';
  if (resultDiv) resultDiv.innerHTML = '';

  startPronunciationCheck(expected, function(result) {
    const cbBtn = getBtn();
    const cbCheckBtn = getCheckBtn();
    const cbResultDiv = getResultDiv();

    if (cbBtn) {
      cbBtn.classList.remove('recording');
      cbBtn.innerHTML = '<span class="record-icon">&#127908;</span> Grabar de nuevo';
    }
    if (cbCheckBtn) cbCheckBtn.style.display = 'none';

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

    html += '<div class="pron-words">';
    result.words.forEach(w => {
      if (w.correct) {
        html += `<span class="pron-word-ok">${escapeHtml(w.word)}</span> `;
      } else {
        html += `<span class="pron-word-fail" data-action="speakWord" data-word="${escapeHtml(w.word)}" role="button" tabindex="0">${escapeHtml(w.word)} &#128264;</span> `;
      }
    });
    html += '</div>';

    html += `<div class="pron-heard">Oido: "${escapeHtml(result.transcript)}"</div>`;

    // Practice failed words individually
    const failedWords = result.words.filter(w => !w.correct);
    if (failedWords.length > 0) {
      html += '<div class="pron-practice">';
      html += '<div class="pron-practice-title">Practica estas palabras:</div>';
      failedWords.forEach((w, i) => {
        const wordId = itemId + '-fix-' + i;
        html += '<div class="pron-practice-word">';
        html += `<button class="pron-practice-listen" data-action="speakWord" data-word="${escapeHtml(w.word)}">&#128264; ${escapeHtml(w.word)}</button>`;
        html += renderPronunciationButtonWord(w.word, wordId);
        html += '</div>';
      });
      html += '</div>';
    }

    if (result.score < 100 && result.score >= 50 && result.score < 90) {
      html += '<div class="pron-tips">';
      html += '<p>Casi perfecto! Intenta hablar mas despacio y vocalizar cada palabra.</p>';
      html += '</div>';
    }
    if (result.score < 50) {
      html += '<div class="pron-tips">';
      html += '<p>Escucha la frase primero y repite despues, imitando el ritmo y la entonacion.</p>';
      html += '</div>';
    }

    cbResultDiv.innerHTML = html;
  });
}

function handleCheckRecording() {
  if (recognitionState === 'recording') {
    stopPronunciationCheck();
  }
}
