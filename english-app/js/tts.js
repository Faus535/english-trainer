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
    return;
  }

  const item = playQueue[playQueueIndex];
  item.btn.classList.add('playing');

  speak(item.text, () => {
    item.btn.classList.remove('playing');
    playQueueIndex++;
    if (playQueueIndex < playQueue.length) {
      setTimeout(playNext, 300);
    }
  });
}
