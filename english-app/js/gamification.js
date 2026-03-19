/**
 * Gamification module - adapted for modular system.
 * Streaks, XP, achievements, sound of the day, phrase roulette.
 */

// ===== XP System =====
const XP_PER_SESSION = 50;
const XP_PER_FLASHCARD = 5;
const XP_PER_LEVEL_UP = 200;
const XP_STREAK_BONUS = 20;

const LEVELS = [
  { name: 'Beginner',     minXP: 0 },
  { name: 'Listener',     minXP: 200 },
  { name: 'Explorer',     minXP: 500 },
  { name: 'Practitioner', minXP: 1000 },
  { name: 'Achiever',     minXP: 2000 },
  { name: 'Advanced',     minXP: 3500 },
  { name: 'Expert',       minXP: 5000 },
  { name: 'Master',       minXP: 7000 },
];

function getXP() {
  const sessions = getTotalSessions();
  const flashcards = loadState('flashcardCount', 0);
  const streak = getStreak();
  const streakBonus = streak > 3 ? (streak - 3) * XP_STREAK_BONUS : 0;

  // Count level-ups across all modules
  let levelUps = 0;
  for (const mod of MODULE_NAMES) {
    const lvlIdx = getLevelIndex(getModuleLevel(mod));
    const profile = getProfile();
    const initialLvlIdx = profile.levels[mod] ? 0 : 0; // All start at their test level
    levelUps += Math.max(0, lvlIdx);
  }

  return (sessions * XP_PER_SESSION) + (flashcards * XP_PER_FLASHCARD) + (levelUps * XP_PER_LEVEL_UP) + streakBonus;
}

function getLevel() {
  const xp = getXP();
  let level = LEVELS[0];
  for (const l of LEVELS) {
    if (xp >= l.minXP) level = l;
  }
  const idx = LEVELS.indexOf(level);
  const nextLevel = LEVELS[idx + 1] || null;
  const progress = nextLevel ? (xp - level.minXP) / (nextLevel.minXP - level.minXP) : 1;
  return { ...level, index: idx, xp, nextLevel, progress: Math.min(progress, 1) };
}

function trackFlashcard() {
  const count = loadState('flashcardCount', 0) + 1;
  saveState('flashcardCount', count);
}

// ===== Achievements =====

const ACHIEVEMENTS = [
  { id: 'first_session',    icon: '1',  name: 'Primer Paso',          desc: 'Completa tu primera sesion',          check: () => getTotalSessions() >= 1 },
  { id: 'week_complete',    icon: '3',  name: 'Semana Activa',        desc: 'Completa 3 sesiones en una semana',   check: () => getSessionsThisWeek() >= 3 },
  { id: 'sessions_10',      icon: '!',  name: '10 Sesiones',          desc: 'Completa 10 sesiones',                check: () => getTotalSessions() >= 10 },
  { id: 'sessions_25',      icon: '~',  name: '25 Sesiones',          desc: 'Completa 25 sesiones',                check: () => getTotalSessions() >= 25 },
  { id: 'sessions_50',      icon: 'H',  name: 'Mitad del Camino',     desc: 'Completa 50 sesiones',                check: () => getTotalSessions() >= 50 },
  { id: 'streak_3',         icon: '3',  name: 'Racha de 3',           desc: 'Consigue una racha de 3 dias',        check: () => getStreak() >= 3 || getBestStreak() >= 3 },
  { id: 'streak_7',         icon: '7',  name: 'Semana Perfecta',      desc: 'Racha de 7 dias seguidos',            check: () => getStreak() >= 7 || getBestStreak() >= 7 },
  { id: 'streak_14',        icon: '*',  name: 'Imparable',            desc: 'Racha de 14 dias seguidos',           check: () => getStreak() >= 14 || getBestStreak() >= 14 },
  { id: 'flash_50',         icon: 'F',  name: 'Coleccionista',        desc: 'Revisa 50 flashcards',                check: () => loadState('flashcardCount', 0) >= 50 },
  { id: 'flash_200',        icon: 'V',  name: 'Vocabulario Solido',   desc: 'Revisa 200 flashcards',               check: () => loadState('flashcardCount', 0) >= 200 },
  { id: 'listening_a2',     icon: 'A',  name: 'Listening A2',         desc: 'Alcanza nivel A2 en Listening',       check: () => getLevelIndex(getModuleLevel('listening')) >= 1 },
  { id: 'listening_b1',     icon: 'B',  name: 'Listening B1',         desc: 'Alcanza nivel B1 en Listening',       check: () => getLevelIndex(getModuleLevel('listening')) >= 2 },
  { id: 'listening_b2',     icon: 'C',  name: 'Listening B2',         desc: 'Alcanza nivel B2 en Listening',       check: () => getLevelIndex(getModuleLevel('listening')) >= 3 },
  { id: 'listening_c1',     icon: 'G',  name: 'Listening C1',         desc: 'Alcanza nivel C1 en Listening',       check: () => getLevelIndex(getModuleLevel('listening')) >= 4 },
  { id: 'all_b1',           icon: 'M',  name: 'B1 Global',            desc: 'Todos los modulos en B1+',            check: () => MODULE_NAMES.every(m => getLevelIndex(getModuleLevel(m)) >= 2) },
  { id: 'graduate',         icon: 'G',  name: 'Graduado C1',          desc: 'Todos los modulos en C1',             check: () => MODULE_NAMES.every(m => getLevelIndex(getModuleLevel(m)) >= 4) },
];

function getUnlockedAchievements() {
  return ACHIEVEMENTS.filter(a => a.check());
}

function checkNewAchievements() {
  const prev = loadState('unlockedAchievements', []);
  const current = getUnlockedAchievements().map(a => a.id);
  const newOnes = current.filter(id => !prev.includes(id));
  if (newOnes.length) {
    saveState('unlockedAchievements', current);
    return newOnes.map(id => ACHIEVEMENTS.find(a => a.id === id));
  }
  return [];
}

// ===== Sound of the Day =====

const SOUNDS_OF_THE_DAY = [
  { sound: '/ə/', name: 'Schwa', words: ['about', 'banana', 'camera'], tip: 'El sonido mas comun — aparece en CADA frase' },
  { sound: '/ɪ/', name: 'Short I', words: ['ship', 'bit', 'fish'], tip: 'No es la "i" española — es mas relajada' },
  { sound: '/iː/', name: 'Long I', words: ['sheep', 'beat', 'see'], tip: 'Alarga el sonido el doble que en español' },
  { sound: '/æ/', name: 'Cat vowel', words: ['cat', 'hat', 'bad'], tip: 'Sonrisa estirada, entre "a" y "e"' },
  { sound: '/ʌ/', name: 'Cup vowel', words: ['cup', 'but', 'love'], tip: 'Como un gruñido breve — "ah" rapido' },
  { sound: '/ɒ/', name: 'Hot vowel', words: ['hot', 'dog', 'stop'], tip: 'Boca redonda y abierta' },
  { sound: '/ʊ/', name: 'Short U', words: ['put', 'book', 'good'], tip: '"U" relajada, sin redondear mucho' },
  { sound: '/uː/', name: 'Long U', words: ['food', 'blue', 'moon'], tip: 'Labios muy redondeados y alargados' },
  { sound: '/v/', name: 'V sound', words: ['very', 'love', 'give'], tip: 'Dientes superiores en labio inferior — NO es /b/' },
  { sound: '/θ/', name: 'TH sorda', words: ['think', 'three', 'bath'], tip: 'Lengua entre los dientes + aire' },
  { sound: '/ð/', name: 'TH sonora', words: ['this', 'the', 'mother'], tip: 'Igual que /θ/ pero vibra' },
  { sound: '/ʃ/', name: 'SH sound', words: ['she', 'fish', 'nation'], tip: 'Shhh — pide silencio' },
  { sound: '/ʒ/', name: 'Vision sound', words: ['vision', 'measure', 'pleasure'], tip: 'Como /ʃ/ pero con vibracion' },
  { sound: '/r/', name: 'English R', words: ['red', 'car', 'world'], tip: 'NO toques el paladar — curva la lengua' },
  { sound: '/w/', name: 'W sound', words: ['water', 'with', 'want'], tip: 'Labios de beso, luego abre — NO es "gu"' },
  { sound: '/h/', name: 'H sound', words: ['have', 'hello', 'behind'], tip: 'Solo un suspiro — NO es la "j" española' },
  { sound: '/eɪ/', name: 'Day diphthong', words: ['day', 'make', 'play'], tip: 'Empieza en "e", desliza a "i"' },
  { sound: '/aɪ/', name: 'My diphthong', words: ['my', 'time', 'fly'], tip: 'Igual que "ai" en "aire"' },
  { sound: '/ɔɪ/', name: 'Boy diphthong', words: ['boy', 'toy', 'enjoy'], tip: 'Igual que "oi" en "hoy"' },
  { sound: '/aʊ/', name: 'How diphthong', words: ['how', 'now', 'about'], tip: 'Igual que "au" en "causa"' },
];

function getSoundOfTheDay() {
  const today = getToday();
  const seed = today.split('-').join('');
  const idx = parseInt(seed, 10) % SOUNDS_OF_THE_DAY.length;
  return SOUNDS_OF_THE_DAY[idx];
}

// ===== Phrase Roulette =====

const PHRASE_ROULETTE = [
  { en: "It's raining cats and dogs", es: "Llueve a cantaros", hint: "Expresion para lluvia intensa" },
  { en: "Break a leg!", es: "Buena suerte!", hint: "Se dice antes de una actuacion" },
  { en: "Piece of cake", es: "Pan comido", hint: "Algo muy facil" },
  { en: "Hit the nail on the head", es: "Dar en el clavo", hint: "Acertar exactamente" },
  { en: "Once in a blue moon", es: "De higos a brevas", hint: "Algo que pasa muy raramente" },
  { en: "The ball is in your court", es: "La pelota esta en tu tejado", hint: "Es tu turno de decidir" },
  { en: "Speak of the devil", es: "Hablando del rey de Roma", hint: "Cuando aparece alguien de quien hablabas" },
  { en: "Better late than never", es: "Mas vale tarde que nunca", hint: "Llegar tarde es mejor que no llegar" },
  { en: "Bite the bullet", es: "Apretar los dientes / Tragar el sapo", hint: "Hacer algo dificil con valentia" },
  { en: "Let the cat out of the bag", es: "Descubrir el pastel", hint: "Revelar un secreto sin querer" },
  { en: "Cost an arm and a leg", es: "Costar un ojo de la cara", hint: "Algo muy caro" },
  { en: "Kill two birds with one stone", es: "Matar dos pajaros de un tiro", hint: "Lograr dos cosas a la vez" },
  { en: "Under the weather", es: "Estar pachucho", hint: "Sentirse enfermo" },
  { en: "Actions speak louder than words", es: "Los hechos hablan mas que las palabras", hint: "Lo que haces importa mas que lo que dices" },
  { en: "Every cloud has a silver lining", es: "No hay mal que por bien no venga", hint: "Algo positivo en toda situacion mala" },
  { en: "When pigs fly", es: "Cuando las ranas crien pelo", hint: "Algo que nunca va a pasar" },
  { en: "The early bird catches the worm", es: "A quien madruga Dios le ayuda", hint: "Levantarse temprano tiene ventajas" },
  { en: "Don't count your chickens before they hatch", es: "No vendas la piel del oso antes de cazarlo", hint: "No celebres antes de tiempo" },
];

let rouletteRevealed = false;
let rouletteIndex = -1;

function getRandomPhrase() {
  rouletteIndex = Math.floor(Math.random() * PHRASE_ROULETTE.length);
  rouletteRevealed = false;
  return PHRASE_ROULETTE[rouletteIndex];
}

function revealPhrase() {
  rouletteRevealed = true;
}

// ===== Toast & Float Animations =====

function showAchievementToast(achievement) {
  const toast = document.createElement('div');
  toast.className = 'achievement-toast';
  toast.innerHTML = `
    <div class="achievement-toast-icon">${escapeHtml(achievement.icon)}</div>
    <div class="achievement-toast-text">
      <strong>${escapeHtml(achievement.name)}</strong>
      <span>${escapeHtml(achievement.desc)}</span>
    </div>`;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

function showXPFloat(text) {
  const el = document.createElement('div');
  el.className = 'xp-float';
  el.textContent = text;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1100);
}

// ===== Render Widgets =====

function renderGamificationHeader() {
  const streak = getStreak();
  const level = getLevel();
  const pctStr = Math.round(level.progress * 100);

  let h = '<div class="gamification-bar">';
  h += '<div class="gam-streak">';
  h += `<span class="gam-streak-fire">${streak > 0 ? '&#128293;' : '&#9898;'}</span>`;
  h += `<span class="gam-streak-num">${streak}</span>`;
  h += '<span class="gam-streak-label">racha</span>';
  h += '</div>';

  h += '<div class="gam-level">';
  h += `<span class="gam-level-name">${escapeHtml(level.name)}</span>`;
  h += `<span class="gam-xp">${level.xp} XP</span>`;
  h += '<div class="gam-level-bar">';
  h += `<div class="gam-level-fill" style="width:${pctStr}%"></div>`;
  h += '</div>';
  if (level.nextLevel) {
    h += `<span class="gam-next-level">${level.nextLevel.minXP - level.xp} XP para ${escapeHtml(level.nextLevel.name)}</span>`;
  }
  h += '</div>';

  const unlocked = getUnlockedAchievements().length;
  h += '<div class="gam-achievements-count">';
  h += `<span class="gam-badge-icon">&#9733;</span>`;
  h += `<span>${unlocked}/${ACHIEVEMENTS.length}</span>`;
  h += '</div>';

  h += '</div>';
  return h;
}

function renderSoundOfTheDay() {
  const sound = getSoundOfTheDay();
  let h = '<div class="sound-of-day">';
  h += '<h4>Sonido del Dia</h4>';
  h += `<div class="sod-sound">${escapeHtml(sound.sound)}</div>`;
  h += `<div class="sod-name">${escapeHtml(sound.name)}</div>`;
  h += '<div class="sod-words">';
  sound.words.forEach(w => {
    h += `<button class="sod-word" data-action="speakWord" data-word="${escapeHtml(w)}">${escapeHtml(w)}</button>`;
  });
  h += '</div>';
  h += `<div class="sod-tip">${escapeHtml(sound.tip)}</div>`;
  h += '</div>';
  return h;
}

function renderPhraseRoulette() {
  if (rouletteIndex < 0) getRandomPhrase();
  const phrase = PHRASE_ROULETTE[rouletteIndex];

  let h = '<div class="phrase-roulette">';
  h += '<h4>Frase Roulette</h4>';
  h += `<div class="pr-english">${escapeHtml(phrase.en)}</div>`;

  if (rouletteRevealed) {
    h += `<div class="pr-spanish">${escapeHtml(phrase.es)}</div>`;
    h += `<div class="pr-hint">${escapeHtml(phrase.hint)}</div>`;
    h += '<button class="pr-btn" data-action="newPhrase">Otra frase</button>';
  } else {
    h += '<button class="pr-btn" data-action="revealPhrase">Ver significado</button>';
  }

  h += '</div>';
  return h;
}

function renderAchievementsView() {
  const main = document.getElementById('main');
  const level = getLevel();
  const streak = getStreak();
  const bestStreak = getBestStreak();
  const unlocked = getUnlockedAchievements();
  const flashcards = loadState('flashcardCount', 0);
  const sessions = getTotalSessions();

  let h = '<div class="achievements-page">';

  h += '<div class="ach-stats">';
  h += `<div class="ach-stat-card"><div class="ach-stat-value">${level.xp}</div><div class="ach-stat-label">XP Total</div></div>`;
  h += `<div class="ach-stat-card"><div class="ach-stat-value">${escapeHtml(level.name)}</div><div class="ach-stat-label">Level</div></div>`;
  h += `<div class="ach-stat-card"><div class="ach-stat-value">${streak}</div><div class="ach-stat-label">Racha</div></div>`;
  h += `<div class="ach-stat-card"><div class="ach-stat-value">${bestStreak}</div><div class="ach-stat-label">Mejor racha</div></div>`;
  h += `<div class="ach-stat-card"><div class="ach-stat-value">${sessions}</div><div class="ach-stat-label">Sesiones</div></div>`;
  h += `<div class="ach-stat-card"><div class="ach-stat-value">${flashcards}</div><div class="ach-stat-label">Flashcards</div></div>`;
  h += '</div>';

  const pctStr = Math.round(level.progress * 100);
  h += '<div class="ach-level-section">';
  h += `<div class="ach-level-title">${escapeHtml(level.name)}</div>`;
  h += `<div class="ach-level-bar-big"><div class="ach-level-fill-big" style="width:${pctStr}%"></div></div>`;
  if (level.nextLevel) {
    h += `<div class="ach-level-next">${level.xp} / ${level.nextLevel.minXP} XP — ${level.nextLevel.minXP - level.xp} XP to ${escapeHtml(level.nextLevel.name)}</div>`;
  } else {
    h += '<div class="ach-level-next">MAX LEVEL</div>';
  }
  h += '</div>';

  h += `<h3 class="ach-page-title">${unlocked.length} / ${ACHIEVEMENTS.length} Achievements</h3>`;
  h += '<div class="achievements-grid">';
  ACHIEVEMENTS.forEach(a => {
    const isUnlocked = a.check();
    h += `<div class="achievement-card ${isUnlocked ? 'unlocked' : 'locked'}">`;
    h += `<div class="ach-icon">${escapeHtml(a.icon)}</div>`;
    h += `<div class="ach-name">${escapeHtml(a.name)}</div>`;
    h += `<div class="ach-desc">${escapeHtml(a.desc)}</div>`;
    h += '</div>';
  });
  h += '</div>';

  h += '</div>';
  main.innerHTML = h;
}
