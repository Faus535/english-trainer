/**
 * Translator view - translate words/phrases between Spanish and English with TTS.
 */

let translatorDirection = 'es-en'; // 'es-en' or 'en-es'
let translatorResult = null;
let translatorLoading = false;
let translatorError = '';

function renderTranslatorView() {
  const main = document.getElementById('main');
  document.getElementById('progressContainer').style.display = 'none';

  let h = '<div class="translator-page">';

  // Title
  h += '<div class="translator-header">';
  h += '<h2>Traductor</h2>';
  h += '<p>Escribe una palabra o frase y escucha como suena</p>';
  h += '</div>';

  // Direction toggle
  h += '<div class="translator-direction">';
  h += `<button class="translator-dir-btn ${translatorDirection === 'es-en' ? 'active' : ''}" data-action="setTranslatorDir" data-dir="es-en">`;
  h += 'Espanol → Ingles</button>';
  h += `<button class="translator-dir-btn ${translatorDirection === 'en-es' ? 'active' : ''}" data-action="setTranslatorDir" data-dir="en-es">`;
  h += 'Ingles → Espanol</button>';
  h += '</div>';

  // Input area
  const placeholderText = translatorDirection === 'es-en'
    ? 'Escribe en espanol...'
    : 'Type in English...';

  h += '<div class="translator-input-area">';
  h += `<textarea class="translator-input" id="translatorInput" placeholder="${placeholderText}" aria-label="Texto para traducir"></textarea>`;
  h += '<div class="translator-actions">';
  h += '<button class="translator-btn translator-btn-translate" data-action="doTranslate" aria-label="Traducir">Traducir</button>';
  h += '<button class="translator-btn translator-btn-clear" data-action="clearTranslator" aria-label="Limpiar">Limpiar</button>';
  h += '</div>';
  h += '</div>';

  // Loading
  if (translatorLoading) {
    h += '<div class="translator-loading">Traduciendo...</div>';
  }

  // Error
  if (translatorError) {
    h += `<div class="translator-error">${escapeHtml(translatorError)}</div>`;
  }

  // Result
  if (translatorResult && !translatorLoading) {
    h += '<div class="translator-result">';

    // Original text
    h += '<div class="translator-result-section">';
    h += `<div class="translator-result-label">${translatorDirection === 'es-en' ? 'Espanol' : 'English'}</div>`;
    h += `<div class="translator-result-text">${escapeHtml(translatorResult.original)}</div>`;
    if (translatorDirection === 'en-es') {
      h += `<button class="translator-play-btn" data-action="speakTranslatorOriginal" aria-label="Escuchar texto original">`;
      h += '<span class="fc-play-icon" aria-hidden="true">&#9654;</span> Escuchar</button>';
    }
    h += '</div>';

    // Translated text
    h += '<div class="translator-result-section translator-result-translated">';
    h += `<div class="translator-result-label">${translatorDirection === 'es-en' ? 'English' : 'Espanol'}</div>`;
    h += `<div class="translator-result-text translated">${escapeHtml(translatorResult.translated)}</div>`;
    if (translatorDirection === 'es-en') {
      h += `<button class="translator-play-btn" data-action="speakTranslatorResult" aria-label="Escuchar traduccion">`;
      h += '<span class="fc-play-icon" aria-hidden="true">&#9654;</span> Escuchar</button>';
    }
    h += '</div>';

    h += '</div>';
  }

  h += '</div>';
  main.innerHTML = h;

  // Restore input text if we have a result
  if (translatorResult) {
    const input = document.getElementById('translatorInput');
    if (input) input.value = translatorResult.original;
  }
}

function setTranslatorDirection(dir) {
  translatorDirection = dir;
  translatorResult = null;
  translatorError = '';
  renderTranslatorView();
}

async function doTranslate() {
  const input = document.getElementById('translatorInput');
  if (!input) return;

  const text = input.value.trim();
  if (!text) {
    translatorError = 'Escribe algo para traducir';
    renderTranslatorView();
    return;
  }

  translatorLoading = true;
  translatorError = '';
  translatorResult = null;
  renderTranslatorView();

  // Restore input value after re-render
  const inputAfter = document.getElementById('translatorInput');
  if (inputAfter) inputAfter.value = text;

  try {
    const langPair = translatorDirection === 'es-en' ? 'es|en' : 'en|es';
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langPair}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error('Error en la conexion');

    const data = await response.json();

    if (data.responseStatus === 200 && data.responseData) {
      translatorResult = {
        original: text,
        translated: data.responseData.translatedText
      };
    } else {
      translatorError = 'No se pudo traducir. Intenta con otro texto.';
    }
  } catch (e) {
    translatorError = 'Error de conexion. Verifica tu internet e intenta de nuevo.';
    console.error('Translation error:', e);
  }

  translatorLoading = false;
  renderTranslatorView();

  // Restore input value after final re-render
  const inputFinal = document.getElementById('translatorInput');
  if (inputFinal) inputFinal.value = translatorResult ? translatorResult.original : text;
}

function clearTranslator() {
  translatorResult = null;
  translatorError = '';
  renderTranslatorView();
}

function speakTranslatorOriginal() {
  if (!translatorResult) return;
  speak(translatorResult.original);
}

function speakTranslatorResult() {
  if (!translatorResult) return;
  speak(translatorResult.translated);
}
