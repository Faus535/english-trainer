/**
 * Flashcards view - random vocabulary cards with TTS pronunciation.
 */

let flashcardHistory = [];
let flashcardIndex = -1;
let translationVisible = false;

function getRandomWord() {
  const idx = Math.floor(Math.random() * VOCAB_DATA.length);
  return VOCAB_DATA[idx];
}

function nextFlashcard() {
  // If we went back in history, trim forward history
  if (flashcardIndex < flashcardHistory.length - 1) {
    flashcardHistory = flashcardHistory.slice(0, flashcardIndex + 1);
  }
  const word = getRandomWord();
  flashcardHistory.push(word);
  flashcardIndex = flashcardHistory.length - 1;
  translationVisible = false;
  trackFlashcard();
  recordActivity();
  renderFlashcard(word);
}

function prevFlashcard() {
  if (flashcardIndex > 0) {
    flashcardIndex--;
    translationVisible = false;
    renderFlashcard(flashcardHistory[flashcardIndex]);
  }
}

function showTranslation() {
  translationVisible = true;
  const el = document.getElementById('fc-translation');
  if (el) {
    el.classList.add('visible');
  }
}

function speakFlashcard() {
  const word = flashcardHistory[flashcardIndex];
  if (!word) return;

  // Speak the word, then the example
  const text = word.ex ? `${word.en}. ${word.ex}` : word.en;
  speak(text);
}

function speakWord() {
  const word = flashcardHistory[flashcardIndex];
  if (!word) return;
  speak(word.en);
}

function speakExample() {
  const word = flashcardHistory[flashcardIndex];
  if (!word || !word.ex) return;
  speak(word.ex);
}

function renderFlashcardsView() {
  const main = document.getElementById('main');

  // Hide progress bar
  document.getElementById('progressContainer').style.display = 'none';

  // If no card yet, pick one
  if (flashcardHistory.length === 0) {
    nextFlashcard();
    return;
  }

  renderFlashcard(flashcardHistory[flashcardIndex]);
}

function renderFlashcard(word) {
  const main = document.getElementById('main');
  const cardNum = flashcardIndex + 1;
  const total = VOCAB_DATA.length;

  let h = '<div class="flashcards-page">';

  // Stats bar
  h += '<div class="fc-stats">';
  h += `<span>${total} palabras disponibles</span>`;
  h += `<span>Tarjeta #${cardNum}</span>`;
  h += '</div>';

  // Card
  h += '<div class="fc-card" role="region" aria-label="Tarjeta de vocabulario">';

  // English word (big)
  h += '<div class="fc-word-section">';
  h += `<div class="fc-english">${escapeHtml(word.en)}</div>`;
  if (word.ipa) {
    h += `<div class="fc-ipa">${escapeHtml(word.ipa)}</div>`;
  }
  if (word.type) {
    h += `<div class="fc-type">${escapeHtml(word.type)}</div>`;
  }
  h += '</div>';

  // Play buttons
  h += '<div class="fc-play-row">';
  h += `<button class="fc-play-btn" data-action="speakWord" aria-label="Escuchar palabra: ${escapeHtml(word.en)}">`;
  h += '<span class="fc-play-icon" aria-hidden="true">&#9654;</span> Palabra</button>';
  if (word.ex) {
    h += `<button class="fc-play-btn fc-play-example" data-action="speakExample" aria-label="Escuchar ejemplo">`;
    h += '<span class="fc-play-icon" aria-hidden="true">&#9654;</span> Ejemplo</button>';
  }
  h += `<button class="fc-play-btn fc-play-all" data-action="speakFlashcard" aria-label="Escuchar todo">`;
  h += '<span class="fc-play-icon" aria-hidden="true">&#9654;</span> Todo</button>';
  h += '</div>';

  // Example sentence
  if (word.ex) {
    h += `<div class="fc-example">"${escapeHtml(word.ex)}"</div>`;
  }

  // Translation (hidden until click)
  h += `<div class="fc-translation ${translationVisible ? 'visible' : ''}" id="fc-translation" data-action="showTranslation" role="button" tabindex="0" aria-label="${translationVisible ? 'Traduccion: ' + escapeHtml(word.es) : 'Toca para ver la traduccion'}">`;
  if (translationVisible) {
    h += `<div class="fc-spanish">${escapeHtml(word.es)}</div>`;
  } else {
    h += '<div class="fc-reveal">Toca para ver la traduccion</div>';
  }
  h += '</div>';

  h += '</div>'; // fc-card

  // Navigation buttons
  h += '<div class="fc-nav">';
  h += `<button class="fc-nav-btn" data-action="prevFlashcard" ${flashcardIndex <= 0 ? 'disabled' : ''} aria-label="Tarjeta anterior">&#8592; Anterior</button>`;
  h += `<button class="fc-nav-btn fc-nav-next" data-action="nextFlashcard" aria-label="Siguiente tarjeta">Siguiente &#8594;</button>`;
  h += '</div>';

  h += '</div>'; // flashcards-page
  main.innerHTML = h;
}
