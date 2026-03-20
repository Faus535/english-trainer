/**
 * Speak Quiz - pronunciation practice tab.
 * Shows a phrase, user speaks it, validates pronunciation.
 * Similar to Flashcards but focused on speaking + recognition.
 */

// ===== Phrase Bank (organized by CEFR level) =====

const SPEAK_PHRASES = {
  a1: [
    { en: "Hello, my name is Ana.", es: "Hola, me llamo Ana." },
    { en: "How are you today?", es: "Como estas hoy?" },
    { en: "I would like a glass of water.", es: "Me gustaria un vaso de agua." },
    { en: "Where is the bathroom?", es: "Donde esta el bano?" },
    { en: "I live in a small house.", es: "Vivo en una casa pequena." },
    { en: "Can you help me, please?", es: "Puedes ayudarme, por favor?" },
    { en: "I have two brothers and one sister.", es: "Tengo dos hermanos y una hermana." },
    { en: "The weather is nice today.", es: "Hace buen tiempo hoy." },
    { en: "I like coffee with milk.", es: "Me gusta el cafe con leche." },
    { en: "What time is it?", es: "Que hora es?" },
    { en: "I go to work by bus.", es: "Voy al trabajo en autobus." },
    { en: "This is my friend Carlos.", es: "Este es mi amigo Carlos." },
    { en: "I don't understand.", es: "No entiendo." },
    { en: "Can you speak slowly, please?", es: "Puedes hablar despacio, por favor?" },
    { en: "I need to buy some food.", es: "Necesito comprar comida." },
  ],
  a2: [
    { en: "I've been waiting here for twenty minutes.", es: "Llevo esperando aqui veinte minutos." },
    { en: "Could you tell me how to get to the station?", es: "Podrias decirme como llegar a la estacion?" },
    { en: "I'm looking for a cheaper hotel.", es: "Estoy buscando un hotel mas barato." },
    { en: "What do you usually do on weekends?", es: "Que sueles hacer los fines de semana?" },
    { en: "I'm sorry, I didn't catch your name.", es: "Perdona, no pille tu nombre." },
    { en: "The restaurant is next to the bank.", es: "El restaurante esta al lado del banco." },
    { en: "I've just finished my homework.", es: "Acabo de terminar mis deberes." },
    { en: "She's been learning English for two years.", es: "Lleva dos anos aprendiendo ingles." },
    { en: "We should leave before it gets dark.", es: "Deberiamos irnos antes de que oscurezca." },
    { en: "I'd rather stay home than go out.", es: "Prefiero quedarme en casa que salir." },
    { en: "Do you mind if I open the window?", es: "Te importa si abro la ventana?" },
    { en: "I'm not sure what to do next.", es: "No estoy seguro de que hacer ahora." },
    { en: "The movie was better than I expected.", es: "La pelicula fue mejor de lo que esperaba." },
    { en: "Can I have the bill, please?", es: "Me traes la cuenta, por favor?" },
    { en: "I forgot to bring my umbrella.", es: "Olvide traer mi paraguas." },
  ],
  b1: [
    { en: "If I had more time, I would learn to play the guitar.", es: "Si tuviera mas tiempo, aprenderia a tocar la guitarra." },
    { en: "I've been thinking about changing my job recently.", es: "He estado pensando en cambiar de trabajo ultimamente." },
    { en: "The book was so interesting that I couldn't put it down.", es: "El libro era tan interesante que no podia dejarlo." },
    { en: "Do you happen to know where the nearest pharmacy is?", es: "Sabes donde esta la farmacia mas cercana?" },
    { en: "I wish I had studied harder when I was younger.", es: "Ojala hubiera estudiado mas cuando era joven." },
    { en: "She suggested that we should try the new Italian place.", es: "Ella sugirio que probaramos el nuevo sitio italiano." },
    { en: "It's been ages since we last saw each other.", es: "Hace siglos que no nos vemos." },
    { en: "I'm not used to getting up so early.", es: "No estoy acostumbrado a levantarme tan pronto." },
    { en: "The traffic was terrible, so I arrived late.", es: "El trafico era terrible, asi que llegue tarde." },
    { en: "Would you mind closing the door on your way out?", es: "Te importaria cerrar la puerta al salir?" },
    { en: "I'm supposed to meet them at the airport at six.", es: "Se supone que los recojo en el aeropuerto a las seis." },
    { en: "He must have forgotten about our meeting.", es: "Debe haberse olvidado de nuestra reunion." },
    { en: "The more I practice, the better I get.", es: "Cuanto mas practico, mejor me sale." },
    { en: "I haven't made up my mind yet.", es: "Aun no me he decidido." },
    { en: "It depends on what time we finish work.", es: "Depende de a que hora terminemos de trabajar." },
  ],
  b2: [
    { en: "Had I known about the delay, I would have taken a different route.", es: "Si hubiera sabido del retraso, habria tomado otra ruta." },
    { en: "She's the kind of person who always sees the bright side.", es: "Es el tipo de persona que siempre ve el lado bueno." },
    { en: "I wouldn't have bothered if I'd known it was going to be cancelled.", es: "No me habria molestado si hubiera sabido que iban a cancelarlo." },
    { en: "Not only did he arrive late, but he also forgot the documents.", es: "No solo llego tarde, sino que tambien olvido los documentos." },
    { en: "The thing is, we can't afford to make any more mistakes.", es: "El tema es que no podemos permitirnos mas errores." },
    { en: "It's about time the government took action on climate change.", es: "Ya es hora de que el gobierno actue contra el cambio climatico." },
    { en: "I'd rather you didn't mention this to anyone.", es: "Preferiria que no le mencionaras esto a nadie." },
    { en: "Despite having studied for weeks, I still failed the exam.", es: "A pesar de haber estudiado semanas, suspendi el examen." },
    { en: "There's no point in arguing about something we can't change.", es: "No tiene sentido discutir sobre algo que no podemos cambiar." },
    { en: "What struck me most was how calm she remained under pressure.", es: "Lo que mas me impresiono fue lo calmada que se mantuvo bajo presion." },
  ],
  c1: [
    { en: "Had it not been for her timely intervention, the project would have collapsed entirely.", es: "De no ser por su intervencion oportuna, el proyecto habria colapsado por completo." },
    { en: "She reckons they'll have sorted it out by the time we get there, but I wouldn't count on it.", es: "Ella cree que lo habran resuelto para cuando lleguemos, pero yo no contaria con ello." },
    { en: "Under no circumstances should confidential information be disclosed to third parties.", es: "Bajo ninguna circunstancia se debe revelar informacion confidencial a terceros." },
    { en: "The extent to which social media has reshaped public discourse cannot be overstated.", es: "No se puede exagerar hasta que punto las redes sociales han transformado el discurso publico." },
    { en: "It goes without saying that preparation is the cornerstone of any successful negotiation.", es: "No hace falta decir que la preparacion es la piedra angular de toda negociacion exitosa." },
    { en: "Notwithstanding the initial setbacks, the team managed to deliver the project on time.", es: "A pesar de los contratiempos iniciales, el equipo logro entregar el proyecto a tiempo." },
    { en: "The findings lend credence to the hypothesis that early intervention yields better outcomes.", es: "Los hallazgos dan credibilidad a la hipotesis de que la intervencion temprana da mejores resultados." },
    { en: "I can't help but wonder whether we've been approaching this problem from the wrong angle.", es: "No puedo evitar preguntarme si hemos estado abordando este problema desde el angulo equivocado." },
  ],
};

// ===== State =====

let speakQuizHistory = [];
let speakQuizIndex = -1;
let speakQuizRevealed = false;
let speakQuizLevel = null; // null = use profile level

function getSpeakQuizLevel() {
  if (speakQuizLevel) return speakQuizLevel;
  const profile = getProfile();
  return profile.levels.listening || profile.levels.pronunciation || 'a1';
}

function getSpeakQuizPhrases() {
  const level = getSpeakQuizLevel();
  return SPEAK_PHRASES[level] || SPEAK_PHRASES['a1'];
}

function nextSpeakPhrase() {
  if (speakQuizIndex < speakQuizHistory.length - 1) {
    speakQuizHistory = speakQuizHistory.slice(0, speakQuizIndex + 1);
  }
  const phrases = getSpeakQuizPhrases();
  const phrase = phrases[Math.floor(Math.random() * phrases.length)];
  speakQuizHistory.push(phrase);
  speakQuizIndex = speakQuizHistory.length - 1;
  speakQuizRevealed = false;
  recordActivity();
  renderSpeakQuiz(phrase);
}

function prevSpeakPhrase() {
  if (speakQuizIndex > 0) {
    speakQuizIndex--;
    speakQuizRevealed = false;
    renderSpeakQuiz(speakQuizHistory[speakQuizIndex]);
  }
}

function revealSpeakPhrase() {
  speakQuizRevealed = true;
  renderSpeakQuiz(speakQuizHistory[speakQuizIndex]);
}

function setSpeakQuizLevel(level) {
  speakQuizLevel = level;
  speakQuizHistory = [];
  speakQuizIndex = -1;
  nextSpeakPhrase();
}

// ===== Rendering =====

function renderSpeakQuizView() {
  const main = document.getElementById('main');
  document.getElementById('progressContainer').style.display = 'none';

  // Check browser support
  if (!speechRecSupported) {
    main.innerHTML = `
      <div class="speak-quiz-page" style="text-align:center;padding-top:40px">
        <h3>Navegador no soportado</h3>
        <p style="color:var(--text2)">Tu navegador no soporta reconocimiento de voz.<br>Usa Chrome, Edge o Safari para esta funcion.</p>
      </div>`;
    return;
  }

  if (speakQuizHistory.length === 0) {
    nextSpeakPhrase();
    return;
  }
  renderSpeakQuiz(speakQuizHistory[speakQuizIndex]);
}

function renderSpeakQuiz(phrase) {
  const main = document.getElementById('main');
  const currentLevel = getSpeakQuizLevel().toUpperCase();
  const cardNum = speakQuizIndex + 1;

  let h = '<div class="speak-quiz-page">';

  // Level selector
  h += '<div class="sq-level-selector">';
  const levels = ['a1', 'a2', 'b1', 'b2', 'c1'];
  levels.forEach(l => {
    const active = l === getSpeakQuizLevel() ? ' sq-level-active' : '';
    h += `<button class="sq-level-btn${active}" data-action="setSpeakLevel" data-level="${l}">${l.toUpperCase()}</button>`;
  });
  h += '</div>';

  // Stats
  h += '<div class="sq-stats">';
  h += `<span>Nivel ${currentLevel}</span>`;
  h += `<span>Frase #${cardNum}</span>`;
  h += '</div>';

  // Card
  h += '<div class="sq-card">';

  // Step 1: Listen
  h += '<div class="sq-section">';
  h += '<div class="sq-step-label">1. Escucha</div>';
  h += `<button class="sq-play-btn" data-action="speakWord" data-word="${escapeHtml(phrase.en)}">`;
  h += '&#9654; Escuchar frase';
  h += '</button>';
  h += '</div>';

  // Step 2: Speak
  h += '<div class="sq-section">';
  h += '<div class="sq-step-label">2. Repite la frase</div>';
  h += renderPronunciationButton(phrase.en, 'sq-phrase');
  h += '</div>';

  // Step 3: See the text — each word is tappable to hear it
  h += '<div class="sq-section">';
  h += '<div class="sq-step-label">3. Comprueba</div>';
  h += '<div class="sq-phrase-text">';
  phrase.en.split(/\s+/).forEach(word => {
    h += `<span class="sq-word" data-action="speakWord" data-word="${escapeHtml(word)}" role="button" tabindex="0">${escapeHtml(word)}</span> `;
  });
  h += '</div>';
  h += '<div class="sq-phrase-hint">Pulsa una palabra para escucharla</div>';
  h += '</div>';

  // Translation
  h += `<div class="sq-translation ${speakQuizRevealed ? 'visible' : ''}" id="sq-translation">`;
  if (speakQuizRevealed) {
    h += `<div class="sq-spanish">${escapeHtml(phrase.es)}</div>`;
  } else {
    h += '<button class="sq-reveal-btn" data-action="revealSpeakPhrase">Ver traduccion</button>';
  }
  h += '</div>';

  h += '</div>'; // sq-card

  // Navigation
  h += '<div class="sq-nav">';
  h += `<button class="sq-nav-btn" data-action="prevSpeakPhrase" ${speakQuizIndex <= 0 ? 'disabled' : ''}>&larr; Anterior</button>`;
  h += `<button class="sq-nav-btn sq-nav-next" data-action="nextSpeakPhrase">Siguiente &rarr;</button>`;
  h += '</div>';

  h += '</div>'; // speak-quiz-page
  main.innerHTML = h;
}
