/**
 * Text-to-Speech using Web Speech API.
 */

let speechRate = 0.8;
let selectedVoice = null;
let englishVoices = [];
let speaking = false;
let playQueue = [];
let playQueueIndex = 0;
let iosResumeIntervals = [];

function initTTS() {
  speechSynthesis.onvoiceschanged = loadVoices;
  loadVoices();

  // iOS Safari fallback: voices may not load until first interaction
  document.addEventListener('touchstart', function iosVoiceFix() {
    loadVoices();
    document.removeEventListener('touchstart', iosVoiceFix);
  }, { once: true });

  document.getElementById('speed').addEventListener('input', (e) => {
    speechRate = parseFloat(e.target.value);
    document.getElementById('speedVal').textContent = speechRate.toFixed(1) + 'x';
  });
}

function loadVoices() {
  const voices = speechSynthesis.getVoices();
  englishVoices = voices.filter(v => v.lang.startsWith('en'));

  const select = document.getElementById('voiceSelect');
  if (!englishVoices.length) {
    select.innerHTML = '<option>Sin voces EN</option>';
    return;
  }

  // Prefer natural/premium voices
  const sorted = [...englishVoices].sort((a, b) => {
    const score = (name) =>
      name.toLowerCase().includes('natural') || name.toLowerCase().includes('premium') ? 0 : 1;
    return score(a.name) - score(b.name);
  });

  select.innerHTML = '';
  sorted.forEach((v, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = `${v.name} (${v.lang})`;
    select.appendChild(opt);
  });

  selectedVoice = sorted[0];
  select.onchange = () => {
    selectedVoice = sorted[parseInt(select.value)];
  };
}

function speak(text, onEnd) {
  // Use shared cleanForSpeech from utils.js
  const clean = cleanForSpeech(text);

  if (!clean) {
    if (onEnd) onEnd();
    return;
  }

  speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(clean);
  utterance.rate = speechRate;
  utterance.pitch = 1;
  utterance.lang = 'en-US';
  if (selectedVoice) utterance.voice = selectedVoice;

  speaking = true;
  document.getElementById('btnStop').classList.add('visible');

  utterance.onend = () => {
    speaking = false;
    if (!playQueue.length) {
      document.getElementById('btnStop').classList.remove('visible');
    }
    if (onEnd) onEnd();
  };

  utterance.onerror = () => {
    speaking = false;
    if (onEnd) onEnd();
  };

  // iOS Safari bug: speech pauses after ~15s. Resume periodically.
  // Store interval reference so we can clear it on stopSpeech()
  const intervalId = setInterval(() => {
    if (!speechSynthesis.speaking) {
      clearInterval(intervalId);
      iosResumeIntervals = iosResumeIntervals.filter(id => id !== intervalId);
    } else {
      speechSynthesis.resume();
    }
  }, 10000);
  iosResumeIntervals.push(intervalId);

  speechSynthesis.speak(utterance);
}

function stopSpeech() {
  speechSynthesis.cancel();
  speaking = false;
  playQueue = [];
  playQueueIndex = 0;

  // Clear all iOS resume intervals to prevent memory leaks
  iosResumeIntervals.forEach(id => clearInterval(id));
  iosResumeIntervals = [];

  document.getElementById('btnStop').classList.remove('visible');
  document.querySelectorAll('.play-btn.playing').forEach(b => b.classList.remove('playing'));
}

function playCell(btn, text) {
  stopSpeech();
  btn.classList.add('playing');
  speak(text, () => btn.classList.remove('playing'));
}

function playAllTable(tableEl) {
  stopSpeech();
  playQueue = [];

  tableEl.querySelectorAll('tbody tr').forEach(row => {
    row.querySelectorAll('td').forEach(cell => {
      const btn = cell.querySelector('.play-btn');
      if (btn) {
        playQueue.push({ text: btn.dataset.text, btn });
      }
    });
  });

  if (!playQueue.length) return;
  playQueueIndex = 0;
  playNext();
}

function playNext() {
  if (playQueueIndex >= playQueue.length) {
    playQueue = [];
    playQueueIndex = 0;
    document.getElementById('btnStop').classList.remove('visible');
    // Clear any active md-highlight
    document.querySelectorAll('.md-playing').forEach(el => el.classList.remove('md-playing'));
    return;
  }

  const item = playQueue[playQueueIndex];
  if (item.btn) item.btn.classList.add('playing');
  if (item.el) {
    // Highlight current element and scroll into view
    document.querySelectorAll('.md-playing').forEach(el => el.classList.remove('md-playing'));
    item.el.classList.add('md-playing');
    item.el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  speak(item.text, () => {
    if (item.btn) item.btn.classList.remove('playing');
    if (item.el) item.el.classList.remove('md-playing');
    playQueueIndex++;
    if (playQueueIndex < playQueue.length) {
      setTimeout(playNext, 300);
    }
  });
}

/**
 * Extracts readable text chunks from a rendered .md-content container
 * and queues them for sequential TTS playback.
 */
function playAllMd(viewerEl) {
  stopSpeech();
  playQueue = [];

  const content = viewerEl.querySelector('.md-content');
  if (!content) return;

  // Walk through top-level elements and extract speakable text
  content.querySelectorAll('h1, h2, h3, h4, p, blockquote, li, td').forEach(el => {
    // For table cells, only read those with a play button (English columns)
    if (el.tagName === 'TD') {
      const btn = el.querySelector('.play-btn');
      if (btn) {
        playQueue.push({ text: btn.dataset.text, el, btn });
      }
      return;
    }

    const text = cleanForSpeech(el.textContent);
    if (text && text.length > 1) {
      // Split long text into chunks (~200 chars at sentence boundaries)
      const chunks = splitIntoChunks(text, 200);
      chunks.forEach(chunk => {
        playQueue.push({ text: chunk, el });
      });
    }
  });

  if (!playQueue.length) return;
  playQueueIndex = 0;
  playNext();
}

/**
 * Splits text into chunks at sentence boundaries, respecting maxLen.
 */
function splitIntoChunks(text, maxLen) {
  if (text.length <= maxLen) return [text];

  const chunks = [];
  let remaining = text;

  while (remaining.length > 0) {
    if (remaining.length <= maxLen) {
      chunks.push(remaining);
      break;
    }

    // Find last sentence boundary within maxLen
    let cut = -1;
    const boundaries = ['. ', '! ', '? ', '; ', ', '];
    for (const sep of boundaries) {
      const idx = remaining.lastIndexOf(sep, maxLen);
      if (idx > cut) cut = idx + sep.length;
    }

    // Fallback: split at last space
    if (cut <= 0) {
      cut = remaining.lastIndexOf(' ', maxLen);
      if (cut <= 0) cut = maxLen;
    }

    chunks.push(remaining.slice(0, cut).trim());
    remaining = remaining.slice(cut).trim();
  }

  return chunks;
}
