/**
 * Plan data - 16-week structured learning plan.
 * 4 blocks: Foundations → Problem Sounds → Flow & Grammar → Immersion
 * Each day has a self-contained trainer file with all content inline.
 */

const DICTATION_VIDEOS = [
  { id: 'oTPZWpQ9pbA', title: 'Cultural Differences',         channel: 'BBC 6 Minute English' },
  { id: 'Tcf1dbiWKsk', title: 'How Resilient Are You?',       channel: 'BBC 6 Minute English' },
  { id: '75lUXk5UuJA', title: 'You Think You\'re Invisible?', channel: 'BBC 6 Minute English' },
  { id: 'A5SOsMJ9Hc8', title: 'Business English',             channel: 'English with Lucy' },
  { id: 'aWvQZGIw6lA', title: 'Life Without Music',           channel: 'BBC 6 Minute English' },
  { id: 'j-KArxYo3DQ', title: 'The Impact of Plastic',        channel: 'BBC 6 Minute English' },
  { id: 'EWPWV7qvwyE', title: 'Lucy Visits Madrid',           channel: 'English with Lucy' },
  { id: 'HqsmVXlbVOI', title: '10 Must-Know Words',           channel: "Rachel's English" },
  { id: 'jm0q7O8-Ruo', title: 'Think in English',             channel: "Rachel's English" },
  { id: 'JnfBXjWm7hc', title: 'Try Something New for 30 Days', channel: 'TED Talk' },
  { id: 'tLb3z7JziEM', title: 'Cloud Idioms',                 channel: 'English with Lucy' },
  { id: 'jjzvxQBZlW4', title: 'How to Speak English Well',    channel: "Rachel's English" },
  { id: 'Y6bbMQXQ180', title: '8 Secrets of Success',         channel: 'TED Talk' },
  { id: 'VqjxoslhIR0', title: 'Snow Sports Conversation',     channel: 'All Ears English' },
  { id: 'vJlu2jDYiCo', title: 'Is It a Good Question?',       channel: 'All Ears English' },
];

const SHADOWING_VIDEOS = [
  { id: 'spQYjkZub3U', title: 'How to Pronounce JEWELLERY',           channel: 'English with Lucy' },
  { id: 'q7SAt9h4sd0', title: 'What Makes American English Sound American', channel: "Rachel's English" },
  { id: '3RuSkaQxuLg', title: 'How Do You Pronounce OFTEN?',          channel: 'English with Lucy' },
  { id: 'hCF2_0G337Y', title: 'Learn English with Modern Family',     channel: "Rachel's English" },
  { id: 'R1vskiVDwl4', title: '10 Ways to Have a Better Conversation', channel: 'TED Talk' },
  { id: 'fdRmGvmeY1U', title: 'Improve Your Pronunciation',          channel: 'BBC Learning English' },
  { id: 'vMvkY1iGcl8', title: 'Fruit & Vegetables Pronunciation',    channel: 'English with Lucy' },
  { id: 'u1eNhV7tEG4', title: 'How to Pronounce Tech Brands',        channel: "Rachel's English" },
  { id: 'eIho2S0ZahI', title: 'How to Speak So People Want to Listen', channel: 'TED Talk' },
  { id: 'dX60zUj_jt8', title: 'Pronunciation Tips: L Sound',         channel: 'BBC Learning English' },
];

const MILESTONES = [
  { text: 'Detecto la schwa en palabras cotidianas', week: '1' },
  { text: 'Distingo vocales cortas de largas (ship vs sheep)', week: '1-2' },
  { text: 'Puedo conjugar en Past Simple (regular e irregular)', week: '2-3' },
  { text: 'Distingo /b/ de /v/ y /θ/ de /t/ al oido', week: '5-6' },
  { text: 'Uso Present Perfect en contexto', week: '5' },
  { text: 'Entiendo por que "gonna/wanna" son fonetica, no slang', week: '7' },
  { text: 'Puedo formar oraciones en pasiva', week: '9' },
  { text: 'Entiendo Reported Speech en conversaciones', week: '10' },
  { text: 'Veo 5 min de serie sin subtitulos y sigo la trama', week: '8' },
  { text: 'Uso Relative Clauses al hablar', week: '11' },
  { text: 'Entiendo podcasts a velocidad normal', week: '12' },
  { text: 'Primera conversacion real en ingles', week: '13' },
  { text: 'Distingo acentos americano vs britanico', week: '14' },
  { text: 'Peliculas sin subtitulos con 80%+ comprension', week: '15-16' },
];

const MOTIVATIONS = [
  'Un bebe escucha 2 años antes de hablar. Tu ya llevas ventaja.',
  'No compares tu listening con tu reading. Son habilidades diferentes.',
  'Si un dia no entiendes nada, baja un nivel. No es retroceso.',
  'Los dias que menos ganas tienes son los mas importantes. 5 min cuenta.',
  'Cada frase que repites crea una conexion neuronal nueva.',
  'Consistencia > intensidad. 20 min diarios > 2h el sabado.',
  'Ya sabes ingles. Solo tienes que enseñarle a tu oido lo que tus ojos ya saben.',
  'Los errores son tus mejores maestros. Cada error corregido es un avance.',
  'No necesitas un acento perfecto. Necesitas que te entiendan.',
  'La gramatica no es aburrida si la usas para decir cosas que te importan.',
];

// Helper: pad day number to 3 digits
function dayFile(n) { return 'trainer/day-' + String(n).padStart(3, '0') + '.md'; }

function buildPlan() {
  const weeks = [];

  // =========================================================================
  // BLOCK A — FOUNDATIONS (Weeks 1-4)
  // =========================================================================

  weeks.push({
    number: 1,
    title: 'La Schwa y los sonidos invisibles',
    desc: 'El sonido mas comun del ingles no tiene letra propia. Aprende a detectarlo y tu comprension mejorara de golpe.',
    days: [
      { day: 1, label: 'Dia 1', duration: '25 min', activities: [
        { time: '25 min', desc: 'La Schwa /ə/ + Top 20 palabras + Caza la Schwa', file: dayFile(1) },
      ]},
      { day: 2, label: 'Dia 2', duration: '25 min', activities: [
        { time: '25 min', desc: 'Schwa en funcionales + Present Simple + Serie', file: dayFile(2) },
      ]},
      { day: 3, label: 'Dia 3', duration: '25 min', activities: [
        { time: '25 min', desc: 'Drills de Schwa + Negativa/Preguntas + Vocabulario', file: dayFile(3) },
      ]},
      { day: 4, label: 'Dia 4', duration: '25 min', activities: [
        { time: '25 min', desc: 'Vocales cortas + Pronunciacion de -s', file: dayFile(4) },
      ]},
      { day: 5, label: 'Dia 5', duration: '25 min', activities: [
        { time: '25 min', desc: 'Pares minimos /ɪ/ vs /iː/ + Frases esenciales', file: dayFile(5) },
      ]},
      { day: 6, label: 'Dia 6', duration: '30 min', activities: [
        { time: '20 min', desc: 'Repaso semanal + Serie', file: dayFile(6) },
        { time: '10 min', desc: 'Dictation: Cultural Differences', dictation: 0 },
      ]},
      { day: 7, label: 'Dia 7', duration: '10 min', rest: true, activities: [
        { time: '10 min', desc: 'Descanso activo — Musica en ingles', file: dayFile(7) },
      ]},
    ],
  });

  weeks.push({
    number: 2,
    title: 'Vocales cortas + Pasado regular',
    desc: 'Las vocales que no existen en español son tu mayor enemigo. Y el pasado regular tiene un truco: la -ed tiene 3 sonidos.',
    days: [
      { day: 8, label: 'Dia 8', duration: '25 min', activities: [
        { time: '25 min', desc: 'Pares /æ/ vs /ʌ/ + Past Simple regular', file: dayFile(8) },
      ]},
      { day: 9, label: 'Dia 9', duration: '25 min', activities: [
        { time: '25 min', desc: 'Pronunciacion de -ed + Pares /æ/ vs /e/', file: dayFile(9) },
      ]},
      { day: 10, label: 'Dia 10', duration: '25 min', activities: [
        { time: '25 min', desc: 'Pares /ɒ/ vs /ʌ/ + Verbos regulares + Viaje', file: dayFile(10) },
      ]},
      { day: 11, label: 'Dia 11', duration: '25 min', activities: [
        { time: '15 min', desc: 'Pares minimos en frases + Serie', file: dayFile(11) },
        { time: '10 min', desc: 'Dictation: How Resilient Are You?', dictation: 1 },
      ]},
      { day: 12, label: 'Dia 12', duration: '25 min', activities: [
        { time: '25 min', desc: 'Frases -ed en contexto + Preposiciones de tiempo', file: dayFile(12) },
      ]},
      { day: 13, label: 'Dia 13', duration: '30 min', activities: [
        { time: '30 min', desc: 'Repaso: Vocales cortas + Past Simple + Serie', file: dayFile(13) },
      ]},
      { day: 14, label: 'Dia 14', duration: '10 min', rest: true, activities: [
        { time: '10 min', desc: 'Descanso activo — Podcast de fondo', file: dayFile(14) },
      ]},
    ],
  });

  weeks.push({
    number: 3,
    title: 'Vocales largas + Irregulares',
    desc: 'Las vocales largas cambian significados (ship/sheep). Y los verbos irregulares... hay que memorizarlos, pero con truco.',
    days: [
      { day: 15, label: 'Dia 15', duration: '25 min', activities: [
        { time: '25 min', desc: 'Vocales largas + Top 20 irregulares + Viaje', file: dayFile(15) },
      ]},
      { day: 16, label: 'Dia 16', duration: '25 min', activities: [
        { time: '20 min', desc: 'Pares /ɪ/ vs /iː/ avanzado + Irregulares 20-40', file: dayFile(16) },
        { time: '5 min', desc: 'Dictation: You Think You\'re Invisible?', dictation: 2 },
      ]},
      { day: 17, label: 'Dia 17', duration: '25 min', activities: [
        { time: '25 min', desc: 'Pares /ʊ/ vs /uː/ + Irregulares 40-60 + Serie', file: dayFile(17) },
      ]},
      { day: 18, label: 'Dia 18', duration: '25 min', activities: [
        { time: '25 min', desc: 'Diptongos + Irregulares 60-80 + Viaje', file: dayFile(18) },
      ]},
      { day: 19, label: 'Dia 19', duration: '25 min', activities: [
        { time: '20 min', desc: 'Diptongos debiles + Irregulares 80-100', file: dayFile(19) },
        { time: '5 min', desc: 'Shadowing: How to Pronounce JEWELLERY', shadowing: 0 },
      ]},
      { day: 20, label: 'Dia 20', duration: '30 min', activities: [
        { time: '20 min', desc: 'Repaso: Vocales + Irregulares + Serie sin sub', file: dayFile(20) },
        { time: '10 min', desc: 'Dictation: Business English', dictation: 3 },
      ]},
      { day: 21, label: 'Dia 21', duration: '15 min', rest: true, activities: [
        { time: '15 min', desc: 'Descanso activo — YouTube que te interese', file: dayFile(21) },
      ]},
    ],
  });

  weeks.push({
    number: 4,
    title: 'Semana de repaso y celebracion',
    desc: 'Consolida todo lo aprendido. Dictation, quiz de vocabulario, reto con cancion. ¡Ya llevas 1 mes!',
    days: [
      { day: 22, label: 'Dia 22', duration: '25 min', activities: [
        { time: '25 min', desc: 'Gran repaso de vocales + Past vs Present', file: dayFile(22) },
      ]},
      { day: 23, label: 'Dia 23', duration: '25 min', activities: [
        { time: '15 min', desc: 'Connected speech nivel 1', file: dayFile(23) },
        { time: '10 min', desc: 'Dictation intensivo: Life Without Music', dictation: 4 },
      ]},
      { day: 24, label: 'Dia 24', duration: '25 min', activities: [
        { time: '25 min', desc: 'Reto: Cancion + Irregulares dificiles + Serie', file: dayFile(24) },
      ]},
      { day: 25, label: 'Dia 25', duration: '25 min', activities: [
        { time: '15 min', desc: 'Reduced forms + Frases del dia a dia', file: dayFile(25) },
        { time: '10 min', desc: 'Shadowing: American English Sound', shadowing: 1 },
      ]},
      { day: 26, label: 'Dia 26', duration: '25 min', activities: [
        { time: '15 min', desc: 'Estructura SVO + Flashcards', file: dayFile(26) },
        { time: '10 min', desc: 'Dictation: The Impact of Plastic', dictation: 5 },
      ]},
      { day: 27, label: 'Dia 27', duration: '30 min', activities: [
        { time: '30 min', desc: 'TEST de medio camino + Celebracion', file: dayFile(27) },
      ]},
      { day: 28, label: 'Dia 28', duration: '10 min', rest: true, activities: [
        { time: '10 min', desc: 'Descanso total — Musica de fondo', file: dayFile(28) },
      ]},
    ],
  });

  // =========================================================================
  // BLOCK B — PROBLEM SOUNDS (Weeks 5-8)
  // =========================================================================

  weeks.push({
    number: 5,
    title: '/v/ vs /b/ + Present Perfect',
    desc: 'El error #1 del hispanohablante: "berry" y "very" NO suenan igual. Y el Present Perfect es tu nueva herramienta temporal.',
    days: [
      { day: 29, label: 'Dia 29', duration: '25 min', activities: [
        { time: '25 min', desc: 'Consonantes /v/ y /b/ + Present Perfect', file: dayFile(29) },
      ]},
      { day: 30, label: 'Dia 30', duration: '25 min', activities: [
        { time: '25 min', desc: '/b/ vs /v/ completo + Present Perfect practica', file: dayFile(30) },
      ]},
      { day: 31, label: 'Dia 31', duration: '25 min', activities: [
        { time: '20 min', desc: '/w/ vs /v/ + Present Perfect vs Past Simple', file: dayFile(31) },
        { time: '5 min', desc: 'Dictation: Lucy Visits Madrid', dictation: 6 },
      ]},
      { day: 32, label: 'Dia 32', duration: '25 min', activities: [
        { time: '15 min', desc: 'Phrasal verbs de trabajo + Serie', file: dayFile(32) },
        { time: '10 min', desc: 'Shadowing: How Do You Pronounce OFTEN?', shadowing: 2 },
      ]},
      { day: 33, label: 'Dia 33', duration: '25 min', activities: [
        { time: '25 min', desc: 'Repaso /v/ /b/ /w/ + Vocabulario 200-500', file: dayFile(33) },
      ]},
      { day: 34, label: 'Dia 34', duration: '30 min', activities: [
        { time: '20 min', desc: 'Present Perfect errores + Serie sin sub', file: dayFile(34) },
        { time: '10 min', desc: 'Dictation: 10 Must-Know Words', dictation: 7 },
      ]},
      { day: 35, label: 'Dia 35', duration: '10 min', rest: true, activities: [
        { time: '10 min', desc: 'Descanso — Cancion con foco en /v/', file: dayFile(35) },
      ]},
    ],
  });

  weeks.push({
    number: 6,
    title: 'El sonido "th" + el Futuro',
    desc: '"Thank you" no es "tank you". Y para hablar del futuro tienes 3 opciones: will, going to, y present continuous.',
    days: [
      { day: 36, label: 'Dia 36', duration: '25 min', activities: [
        { time: '25 min', desc: '/θ/ sorda + Futuro con will + Pares /θ/ vs /t/', file: dayFile(36) },
      ]},
      { day: 37, label: 'Dia 37', duration: '25 min', activities: [
        { time: '25 min', desc: '/θ/ vs /t/ completo + Going to + Idioms', file: dayFile(37) },
      ]},
      { day: 38, label: 'Dia 38', duration: '25 min', activities: [
        { time: '20 min', desc: '/ð/ sonora + /ð/ vs /d/', file: dayFile(38) },
        { time: '5 min', desc: 'Dictation: Think in English', dictation: 8 },
      ]},
      { day: 39, label: 'Dia 39', duration: '25 min', activities: [
        { time: '15 min', desc: 'will vs going to practica + Vocabulario', file: dayFile(39) },
        { time: '10 min', desc: 'Shadowing: Modern Family', shadowing: 3 },
      ]},
      { day: 40, label: 'Dia 40', duration: '25 min', activities: [
        { time: '25 min', desc: 'Connected speech + Modales basicos', file: dayFile(40) },
      ]},
      { day: 41, label: 'Dia 41', duration: '30 min', activities: [
        { time: '20 min', desc: 'Repaso th + futuro + Serie sin sub', file: dayFile(41) },
        { time: '10 min', desc: 'Dictation: How to Speak English Well', dictation: 9 },
      ]},
      { day: 42, label: 'Dia 42', duration: '10 min', rest: true, activities: [
        { time: '10 min', desc: 'Descanso — Podcast "6 Minute English"', file: dayFile(42) },
      ]},
    ],
  });

  weeks.push({
    number: 7,
    title: 'sh/ch/vision + Condicionales',
    desc: 'share ≠ chair, y "vision" tiene un sonido que ni existe en español. Ademas: if + present = will (First Conditional).',
    days: [
      { day: 43, label: 'Dia 43', duration: '25 min', activities: [
        { time: '25 min', desc: '/ʃ/ vs /tʃ/ + Condicionales + Reduced forms', file: dayFile(43) },
      ]},
      { day: 44, label: 'Dia 44', duration: '25 min', activities: [
        { time: '20 min', desc: '/ʒ/ + Second Conditional', file: dayFile(44) },
        { time: '5 min', desc: 'Shadowing: 10 Ways to Have a Better Conversation', shadowing: 4 },
      ]},
      { day: 45, label: 'Dia 45', duration: '25 min', activities: [
        { time: '20 min', desc: 'Connected speech nivel 2 + Phrasal verbs', file: dayFile(45) },
        { time: '5 min', desc: 'Dictation: Cloud Idioms', dictation: 10 },
      ]},
      { day: 46, label: 'Dia 46', duration: '25 min', activities: [
        { time: '25 min', desc: '/s/ vs /z/ + Condicionales practica + Vocab', file: dayFile(46) },
      ]},
      { day: 47, label: 'Dia 47', duration: '25 min', activities: [
        { time: '25 min', desc: '/r/ vs /l/ + Conectores basicos + Serie', file: dayFile(47) },
      ]},
      { day: 48, label: 'Dia 48', duration: '30 min', activities: [
        { time: '20 min', desc: 'Repaso consonantes + Serie sin sub', file: dayFile(48) },
        { time: '10 min', desc: 'Shadowing: Improve Your Pronunciation', shadowing: 5 },
      ]},
      { day: 49, label: 'Dia 49', duration: '15 min', rest: true, activities: [
        { time: '15 min', desc: 'Descanso — Pelicula con sub ingles', file: dayFile(49) },
      ]},
    ],
  });

  weeks.push({
    number: 8,
    title: 'Repaso Block B + Reto',
    desc: 'Mitad del camino. Dictation con pelicula real, repaso de phrasal verbs, y carrera de pares minimos.',
    days: [
      { day: 50, label: 'Dia 50', duration: '25 min', activities: [
        { time: '15 min', desc: 'Repaso pares minimos', file: dayFile(50) },
        { time: '10 min', desc: 'Dictation: 8 Secrets of Success', dictation: 11 },
      ]},
      { day: 51, label: 'Dia 51', duration: '25 min', activities: [
        { time: '20 min', desc: 'Phrasal verbs reto + Irregulares 101-125', file: dayFile(51) },
        { time: '5 min', desc: 'Shadowing: Fruit & Vegetables', shadowing: 6 },
      ]},
      { day: 52, label: 'Dia 52', duration: '25 min', activities: [
        { time: '25 min', desc: 'Entonacion + Numeros hablados + Serie', file: dayFile(52) },
      ]},
      { day: 53, label: 'Dia 53', duration: '25 min', activities: [
        { time: '15 min', desc: 'Past Continuous + Idioms', file: dayFile(53) },
        { time: '10 min', desc: 'Dictation: Snow Sports Conversation', dictation: 12 },
      ]},
      { day: 54, label: 'Dia 54', duration: '25 min', activities: [
        { time: '15 min', desc: 'Connected speech avanzado + Flashcards', file: dayFile(54) },
        { time: '10 min', desc: 'Shadowing: Tech Brands', shadowing: 7 },
      ]},
      { day: 55, label: 'Dia 55', duration: '30 min', activities: [
        { time: '30 min', desc: 'TEST mitad de camino + Celebracion', file: dayFile(55) },
      ]},
      { day: 56, label: 'Dia 56', duration: '10 min', rest: true, activities: [
        { time: '10 min', desc: 'Descanso — YouTube sobre tu hobby', file: dayFile(56) },
      ]},
    ],
  });

  // =========================================================================
  // BLOCK C — FLOW & GRAMMAR (Weeks 9-12)
  // =========================================================================

  weeks.push({
    number: 9,
    title: 'Reduced forms + Voz Pasiva',
    desc: 'Los nativos no dicen "I am going to" — dicen "I\'m gonna". Y la voz pasiva aparece en CADA noticia.',
    days: [
      { day: 57, label: 'Lunes', duration: '25 min', activities: [
        { time: '25 min', desc: 'Reduced forms + Passive Voice', file: dayFile(57) },
      ]},
      { day: 58, label: 'Martes', duration: '25 min', activities: [
        { time: '15 min', desc: 'Passive Voice practica', file: dayFile(58) },
        { time: '10 min', desc: 'Dictation', dictation: 10 },
      ]},
      { day: 59, label: 'Miercoles', duration: '25 min', activities: [
        { time: '15 min', desc: 'Passive Voice errores', file: dayFile(59) },
        { time: '10 min', desc: 'Shadowing: How to Speak So People Want to Listen', shadowing: 8 },
      ]},
      { day: 60, label: 'Jueves', duration: '25 min', activities: [
        { time: '25 min', desc: 'Pronunciacion avanzada + Phrasal verbs', file: dayFile(60) },
      ]},
      { day: 61, label: 'Viernes', duration: '30 min', activities: [
        { time: '20 min', desc: 'Hardest phrases', file: dayFile(61) },
        { time: '10 min', desc: 'Dictation', dictation: 11 },
      ]},
      { day: 62, label: 'Sabado', duration: '30 min', activities: [
        { time: '30 min', desc: 'Repaso semanal', file: dayFile(62) },
      ]},
      { day: 63, label: 'Domingo', duration: '10 min', rest: true, activities: [
        { time: '10 min', desc: 'Descanso — Musica o podcast', file: dayFile(63) },
      ]},
    ],
  });

  weeks.push({
    number: 10,
    title: 'Linking y Elision + Reported Speech',
    desc: 'Las palabras se "pegan" entre si y algunas consonantes desaparecen. Y "She said she was tired" es Reported Speech.',
    days: [
      { day: 64, label: 'Lunes', duration: '25 min', activities: [
        { time: '25 min', desc: 'Linking, Elision + Reported Speech', file: dayFile(64) },
      ]},
      { day: 65, label: 'Martes', duration: '25 min', activities: [
        { time: '15 min', desc: 'Reported Speech practica', file: dayFile(65) },
        { time: '10 min', desc: 'Dictation', dictation: 11 },
      ]},
      { day: 66, label: 'Miercoles', duration: '25 min', activities: [
        { time: '15 min', desc: 'Reported Speech errores', file: dayFile(66) },
        { time: '10 min', desc: 'Shadowing: Pronunciation Tips L Sound', shadowing: 9 },
      ]},
      { day: 67, label: 'Jueves', duration: '25 min', activities: [
        { time: '25 min', desc: 'Asimilacion + Phrasal verbs viajes', file: dayFile(67) },
      ]},
      { day: 68, label: 'Viernes', duration: '30 min', activities: [
        { time: '20 min', desc: 'Hardest phrases: modal + have', file: dayFile(68) },
        { time: '10 min', desc: 'Dictation', dictation: 12 },
      ]},
      { day: 69, label: 'Sabado', duration: '30 min', activities: [
        { time: '30 min', desc: 'Repaso semanal', file: dayFile(69) },
      ]},
      { day: 70, label: 'Domingo', duration: '10 min', rest: true, activities: [
        { time: '10 min', desc: 'Descanso — Musica o podcast', file: dayFile(70) },
      ]},
    ],
  });

  weeks.push({
    number: 11,
    title: 'Stress y Ritmo + Relative Clauses',
    desc: 'El ingles es stress-timed: las silabas acentuadas van a ritmo fijo. Y "the man who called" usa Relative Clauses.',
    days: [
      { day: 71, label: 'Lunes', duration: '25 min', activities: [
        { time: '25 min', desc: 'Stress-timing + Relative Clauses', file: dayFile(71) },
      ]},
      { day: 72, label: 'Martes', duration: '25 min', activities: [
        { time: '15 min', desc: 'Relative Clauses practica', file: dayFile(72) },
        { time: '10 min', desc: 'Dictation', dictation: 12 },
      ]},
      { day: 73, label: 'Miercoles', duration: '25 min', activities: [
        { time: '15 min', desc: 'Relative Clauses errores + Vocab', file: dayFile(73) },
        { time: '10 min', desc: 'Shadowing', shadowing: 2 },
      ]},
      { day: 74, label: 'Jueves', duration: '25 min', activities: [
        { time: '25 min', desc: 'Sentence stress + Irregulares repaso', file: dayFile(74) },
      ]},
      { day: 75, label: 'Viernes', duration: '30 min', activities: [
        { time: '20 min', desc: 'Hardest phrases + Serie', file: dayFile(75) },
        { time: '10 min', desc: 'Dictation', dictation: 13 },
      ]},
      { day: 76, label: 'Sabado', duration: '30 min', activities: [
        { time: '30 min', desc: 'Repaso semanal', file: dayFile(76) },
      ]},
      { day: 77, label: 'Domingo', duration: '10 min', rest: true, activities: [
        { time: '10 min', desc: 'Descanso — Musica o podcast', file: dayFile(77) },
      ]},
    ],
  });

  weeks.push({
    number: 12,
    title: 'Repaso Block C + Test',
    desc: 'Full test de comprension, gramatica y pronunciacion. Revisa los acentos americano vs britanico.',
    days: [
      { day: 78, label: 'Lunes', duration: '25 min', activities: [
        { time: '15 min', desc: 'Acentos: American vs British', file: dayFile(78) },
        { time: '10 min', desc: 'Shadowing avanzado', shadowing: 8 },
      ]},
      { day: 79, label: 'Martes', duration: '25 min', activities: [
        { time: '10 min', desc: 'Repaso gramatica Block C', file: dayFile(79) },
        { time: '15 min', desc: 'Dictation avanzado', dictation: 13 },
      ]},
      { day: 80, label: 'Miercoles', duration: '25 min', activities: [
        { time: '25 min', desc: 'Indirect Questions + Hardest phrases', file: dayFile(80) },
      ]},
      { day: 81, label: 'Jueves', duration: '25 min', activities: [
        { time: '15 min', desc: 'Used to / Would + Vocabulario', file: dayFile(81) },
        { time: '10 min', desc: 'Shadowing', shadowing: 9 },
      ]},
      { day: 82, label: 'Viernes', duration: '30 min', activities: [
        { time: '30 min', desc: 'FULL TEST Block C', file: dayFile(82) },
      ]},
      { day: 83, label: 'Sabado', duration: '30 min', activities: [
        { time: '30 min', desc: 'Episodio completo sin subtitulos', file: dayFile(83) },
      ]},
      { day: 84, label: 'Domingo', duration: '10 min', rest: true, activities: [
        { time: '10 min', desc: 'Descanso — Podcast favorito', file: dayFile(84) },
      ]},
    ],
  });

  // =========================================================================
  // BLOCK D — IMMERSION (Weeks 13-16)
  // =========================================================================

  weeks.push({
    number: 13,
    title: 'Present Perfect Continuous + Conversacion',
    desc: 'I have been working all day. Tu primer objetivo: hablar con alguien en ingles esta semana.',
    days: [
      { day: 85, label: 'Lunes', duration: '30 min', activities: [
        { time: '30 min', desc: 'Fillers + Present Perfect Continuous + Serie', file: dayFile(85) },
      ]},
      { day: 86, label: 'Martes', duration: '30 min', activities: [
        { time: '15 min', desc: 'PPC practica', file: dayFile(86) },
        { time: '15 min', desc: 'Shadowing avanzado', shadowing: 4 },
      ]},
      { day: 87, label: 'Miercoles', duration: '30 min', activities: [
        { time: '30 min', desc: 'Primera conversacion real + Serie', file: dayFile(87) },
      ]},
      { day: 88, label: 'Jueves', duration: '30 min', activities: [
        { time: '15 min', desc: 'Vocabulario 500-1000', file: dayFile(88) },
        { time: '15 min', desc: 'Dictation', dictation: 0 },
      ]},
      { day: 89, label: 'Viernes', duration: '30 min', activities: [
        { time: '15 min', desc: 'Serie sin subtitulos', file: dayFile(89) },
        { time: '15 min', desc: 'Shadowing', shadowing: 5 },
      ]},
      { day: 90, label: 'Sabado', duration: '90 min', activities: [
        { time: '90 min', desc: 'Pelicula sin subtitulos', file: dayFile(90) },
      ]},
      { day: 91, label: 'Domingo', duration: '10 min', rest: true, activities: [
        { time: '10 min', desc: 'Descanso — Musica o podcast', file: dayFile(91) },
      ]},
    ],
  });

  weeks.push({
    number: 14,
    title: 'Intonation + Indirect Questions',
    desc: 'La entonacion cambia significados: "Really?" (sorpresa) vs "Really." (aburrimiento).',
    days: [
      { day: 92, label: 'Lunes', duration: '30 min', activities: [
        { time: '30 min', desc: 'Patrones de entonacion + Indirect Questions', file: dayFile(92) },
      ]},
      { day: 93, label: 'Martes', duration: '30 min', activities: [
        { time: '15 min', desc: 'Indirect Questions practica', file: dayFile(93) },
        { time: '15 min', desc: 'Shadowing', shadowing: 5 },
      ]},
      { day: 94, label: 'Miercoles', duration: '30 min', activities: [
        { time: '30 min', desc: 'Conversacion + Serie sin sub', file: dayFile(94) },
      ]},
      { day: 95, label: 'Jueves', duration: '30 min', activities: [
        { time: '15 min', desc: 'Vocabulario 500-1000', file: dayFile(95) },
        { time: '15 min', desc: 'Dictation', dictation: 1 },
      ]},
      { day: 96, label: 'Viernes', duration: '30 min', activities: [
        { time: '15 min', desc: 'Serie sin subtitulos', file: dayFile(96) },
        { time: '15 min', desc: 'Shadowing', shadowing: 6 },
      ]},
      { day: 97, label: 'Sabado', duration: '90 min', activities: [
        { time: '90 min', desc: 'Pelicula sin subtitulos', file: dayFile(97) },
      ]},
      { day: 98, label: 'Domingo', duration: '10 min', rest: true, activities: [
        { time: '10 min', desc: 'Descanso — Podcast en ingles', file: dayFile(98) },
      ]},
    ],
  });

  weeks.push({
    number: 15,
    title: 'Slang moderno + Used to/Would',
    desc: 'ghost, flex, vibe, lowkey — el ingles real de 2024-2026. Y "I used to live in Madrid" para hablar del pasado.',
    days: [
      { day: 99, label: 'Lunes', duration: '30 min', activities: [
        { time: '30 min', desc: 'Slang moderno + Used to / Would', file: dayFile(99) },
      ]},
      { day: 100, label: 'Martes', duration: '30 min', activities: [
        { time: '15 min', desc: 'Used to / Would practica', file: dayFile(100) },
        { time: '15 min', desc: 'Shadowing', shadowing: 6 },
      ]},
      { day: 101, label: 'Miercoles', duration: '30 min', activities: [
        { time: '30 min', desc: 'Conversacion + Serie sin sub', file: dayFile(101) },
      ]},
      { day: 102, label: 'Jueves', duration: '30 min', activities: [
        { time: '15 min', desc: 'Vocabulario 500-1000', file: dayFile(102) },
        { time: '15 min', desc: 'Dictation', dictation: 2 },
      ]},
      { day: 103, label: 'Viernes', duration: '30 min', activities: [
        { time: '15 min', desc: 'Serie sin subtitulos', file: dayFile(103) },
        { time: '15 min', desc: 'Shadowing', shadowing: 7 },
      ]},
      { day: 104, label: 'Sabado', duration: '90 min', activities: [
        { time: '90 min', desc: 'Pelicula sin subtitulos', file: dayFile(104) },
      ]},
      { day: 105, label: 'Domingo', duration: '10 min', rest: true, activities: [
        { time: '10 min', desc: 'Descanso — Musica o podcast', file: dayFile(105) },
      ]},
    ],
  });

  weeks.push({
    number: 16,
    title: 'Test Final + Celebracion',
    desc: '16 semanas. Pelicula completa sin subtitulos. ¿Cuanto entiendes? ¡Celebra tu progreso!',
    days: [
      { day: 106, label: 'Lunes', duration: '30 min', activities: [
        { time: '15 min', desc: 'Estrategias de listening', file: dayFile(106) },
        { time: '15 min', desc: 'Shadowing avanzado — TED Talk', shadowing: 8 },
      ]},
      { day: 107, label: 'Martes', duration: '30 min', activities: [
        { time: '30 min', desc: 'Podcast completo sin pausas', file: dayFile(107) },
      ]},
      { day: 108, label: 'Miercoles', duration: '30 min', activities: [
        { time: '30 min', desc: 'Conversacion real + Gramatica debil', file: dayFile(108) },
      ]},
      { day: 109, label: 'Jueves', duration: '30 min', activities: [
        { time: '30 min', desc: 'FULL TEST FINAL', file: dayFile(109) },
      ]},
      { day: 110, label: 'Viernes', duration: '30 min', activities: [
        { time: '30 min', desc: 'Recursos para seguir aprendiendo', file: dayFile(110) },
      ]},
      { day: 111, label: 'Sabado', duration: '120 min', activities: [
        { time: '120 min', desc: 'PELICULA COMPLETA SIN SUBTITULOS', file: dayFile(111) },
      ]},
      { day: 112, label: 'Domingo', duration: '10 min', rest: true, activities: [
        { time: '10 min', desc: 'CELEBRACION — 112 dias, lo conseguiste', file: dayFile(112) },
      ]},
    ],
  });

  return weeks;
}

const PLAN = buildPlan();
