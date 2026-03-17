/**
 * Plan data - 12-week structured learning plan.
 */

/**
 * Dictation videos - one per dictation day, embedded directly.
 * Each entry: { id: YouTube video ID, title: description, channel: source }
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

/**
 * Shadowing videos - one per shadowing day.
 * Each entry: { id: YouTube video ID, title: description, channel: source }
 */
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
  { text: 'Se que son las reduced forms y weak forms', week: '1' },
  { text: 'Puedo decodificar frases en IPA', week: '1-2' },
  { text: 'Primera sesion de dictation completada', week: '2' },
  { text: 'Entiendo por que "gonna/wanna" no son slang sino fonetica', week: '2' },
  { text: 'Primera sesion de shadowing completada', week: '3' },
  { text: 'Puedo ver 5 min de serie sin subtitulos sin perderme', week: '3-4' },
  { text: 'Distingo thirteen de thirty al oido', week: '3-4' },
  { text: 'Reconozco fillers y no me confunden', week: '4' },
  { text: 'Puedo hacer shadowing de un TED Talk', week: '4-5' },
  { text: 'Veo episodios con sub ingles y entiendo 80%+', week: '5-6' },
  { text: 'Veo episodios sin subtitulos y sigo la trama', week: '7-8' },
  { text: 'Entiendo podcasts a velocidad normal', week: '8-9' },
  { text: 'Primera conversacion real en ingles', week: '9' },
  { text: 'Peliculas sin subtitulos con 80%+ comprension', week: '11-12' },
];

const MOTIVATIONS = [
  'Un bebe escucha 2 años antes de hablar. Tu ya llevas ventaja.',
  'No compares tu listening con tu reading. Son habilidades diferentes.',
  'Si un dia no entiendes nada, baja un nivel. No es retroceso.',
  'Los dias que menos ganas tienes son los mas importantes. 5 min cuenta.',
  'Cada frase que repites crea una conexion neuronal nueva.',
  'Consistencia > intensidad. 20 min diarios > 2h el sabado.',
  'Ya sabes ingles. Solo tienes que enseñarle a tu oido lo que tus ojos ya saben.',
];

function buildPlan() {
  const weeks = [];

  // ===== WEEK 1 =====
  weeks.push({
    number: 1,
    title: 'Descubrir por que no entiendes',
    desc: 'El objetivo esta semana NO es entender todo. Es descubrir que sonidos te estan engañando.',
    days: [
      { day: 1, label: 'Dia 1', duration: '25 min', activities: [
        { time: '10 min', desc: 'Seccion "El problema fundamental"', file: 'listening/rhythm-and-stress.md', details: ['Comprende la diferencia syllable-timed (español) vs stress-timed (ingles)', 'Aprende que son content words vs function words'] },
        { time: '10 min', desc: 'Seccion "Contracciones avanzadas"', file: 'listening/reduced-forms.md', details: ['gonna, wanna, gotta, hafta, shoulda, coulda, woulda', 'Pronuncia cada una en voz alta 3 veces'] },
        { time: '5 min', desc: 'Serie/pelicula en ingles CON subtitulos en ingles', details: ['No intentes entender todo', 'Solo observa cuantas palabras "desaparecen" al hablar vs lo que lees en subtitulos'], tip: 'Empieza con Friends o The Office - son el gimnasio de listening perfecto' },
      ]},
      { day: 2, label: 'Dia 2', duration: '25 min', activities: [
        { time: '10 min', desc: 'Seccion "Weak Forms" (la clave oculta)', file: 'listening/reduced-forms.md', details: ['Esto es lo MAS importante: "to" suena /tə/, "the" suena /ðə/, "and" suena /ən/', 'Practica las 10 primeras frases de ejemplo en voz alta'] },
        { time: '10 min', desc: 'Seccion "Stress de oracion"', file: 'listening/rhythm-and-stress.md', details: ['Entiende que "DOGS CHASE CATS" y "The DOGS should have been CHASING all the CATS" duran lo MISMO'] },
        { time: '5 min', desc: 'Misma serie de ayer', details: ['Ahora fijate en las function words: ¿las oyes o desaparecen?'] },
      ]},
      { day: 3, label: 'Dia 3', duration: '25 min', activities: [
        { time: '15 min', desc: 'Nivel 1 - frases de 2-4 palabras', file: 'listening/connected-speech-drills.md', details: ['Haz las primeras 20 frases: lee la forma escrita, luego la pronunciacion IPA, di la frase como la diria un nativo'] },
        { time: '5 min', desc: 'Repasa las weak forms de ayer', details: ['Tapa la columna de pronunciacion e intenta recordarla'] },
        { time: '5 min', desc: 'Serie - tecnica de pausa', details: ['Pausa en una frase que no entiendas. Rebobina. Escuchala 5 veces. Lee el subtitulo. Escuchala 5 veces mas'] },
      ]},
      { day: 4, label: 'Dia 4', duration: '25 min', activities: [
        { time: '10 min', desc: 'Nivel 1, frases 21-53', file: 'listening/connected-speech-drills.md', details: ['Misma tecnica: leer → pronunciar → repetir'] },
        { time: '10 min', desc: 'Seccion "Consonantes dificiles para hispanohablantes"', file: 'pronunciation/ipa-guide.md', details: ['Enfocate en /θ/ vs /ð/ (th), /v/ vs /b/, /ʃ/ vs /tʃ/', 'Practica los pares minimos en voz alta'] },
        { time: '5 min', desc: 'Serie - escena de 1 minuto', details: ['Escuchala 3 veces sin subtitulos. Luego con subtitulos. ¿Que palabras te faltaban?'] },
      ]},
      { day: 5, label: 'Dia 5', duration: '25 min', activities: [
        { time: '10 min', desc: 'Pares /b/ vs /v/ y /ɪ/ vs /iː/', file: 'listening/minimal-pairs-drills.md', details: ['Lee cada par en voz alta exagerando la diferencia'] },
        { time: '10 min', desc: 'Seccion "Fusiones"', file: 'listening/reduced-forms.md', details: ['gimme, lemme, didja, whatcha, whaddya', 'Pronuncia cada una. Usa la frase de ejemplo'] },
        { time: '5 min', desc: 'YouTube: "English listening test B1"', details: ['Haz uno para medir tu nivel real de escucha'] },
      ]},
      { day: 6, label: 'Dia 6', duration: '30 min', activities: [
        { time: '10 min', desc: 'Repaso de la semana', details: ['Relee tus apuntes de reduced forms y weak forms'] },
        { time: '10 min', desc: 'Seccion "Decodificacion"', file: 'listening/connected-speech-drills.md', details: ['Intenta descifrar 10 transcripciones IPA sin mirar la respuesta'] },
        { time: '10 min', desc: 'Serie con sub ingles (10 minutos)', details: ['Anota 5 frases que no entendieras al oido'] },
      ]},
      { day: 7, label: 'Dia 7', duration: '10 min', rest: true, activities: [
        { time: '10 min', desc: 'Descanso activo - Musica en ingles', file: 'listening/songs.md', details: ['Elige una cancion', 'Intenta seguir la letra sin leerla. Luego leela'] },
      ]},
    ],
  });

  // ===== WEEK 2 =====
  weeks.push({
    number: 2,
    title: 'Entrenar el oido con dictation',
    desc: 'Ahora ya sabes POR QUE no entiendes. Esta semana empiezas a ENTRENAR el oido.',
    days: [
      { day: 8, label: 'Dia 8', duration: '25 min', activities: [
        { time: '15 min', desc: 'Primera sesion de dictation', dictation: 0 },
        { time: '5 min', desc: 'Repaso reduced forms semana 1', details: ['Tapar pronunciacion, intentar recordar'] },
        { time: '5 min', desc: 'Serie - escena de 1 min', details: ['3 veces sin sub, luego con sub'] },
      ]},
      { day: 9, label: 'Dia 9', duration: '25 min', activities: [
        { time: '10 min', desc: 'Dictation', dictation: 3 },
        { time: '10 min', desc: 'Secciones "Falling" y "Rising"', file: 'listening/intonation.md', details: ['La entonacion cambia el significado', 'Practica: di "Really" con entonacion de pregunta, sorpresa e incredulidad'] },
        { time: '5 min', desc: 'Serie' },
      ]},
      { day: 10, label: 'Dia 10', duration: '25 min', activities: [
        { time: '15 min', desc: 'Dictation (2 fragmentos de 30 seg)', dictation: 1 },
        { time: '5 min', desc: 'Grupo 1, primeras 15 frases', file: 'listening/hardest-phrases.md', details: ['Lee la version escrita → lee como suena → repite en voz alta'] },
        { time: '5 min', desc: 'Serie' },
      ]},
      { day: 11, label: 'Dia 11', duration: '25 min', activities: [
        { time: '15 min', desc: 'Dictation', dictation: 7 },
        { time: '5 min', desc: 'Seccion "Fillers"', file: 'listening/fillers-and-markers.md', details: ['Aprende a ignorar: uh, um, like, you know, I mean, basically'] },
        { time: '5 min', desc: 'Serie' },
      ]},
      { day: 12, label: 'Dia 12', duration: '25 min', activities: [
        { time: '10 min', desc: 'Dictation', dictation: 6 },
        { time: '10 min', desc: 'Nivel 2 - frases de 5-8 palabras', file: 'listening/connected-speech-drills.md', details: ['Primeras 15 frases'] },
        { time: '5 min', desc: 'Serie' },
      ]},
      { day: 13, label: 'Dia 13', duration: '30 min', activities: [
        { time: '10 min', desc: 'Dictation (sube la dificultad)', dictation: 9 },
        { time: '10 min', desc: 'Grupo 2 (linking masivo)', file: 'listening/hardest-phrases.md', details: ['Primeras 15 frases'] },
        { time: '10 min', desc: 'Serie: 5 min SIN sub + 5 min con sub' },
      ]},
      { day: 14, label: 'Dia 14', duration: '15 min', rest: true, activities: [
        { time: '15 min', desc: 'Descanso activo - Podcast de fondo', details: ['Pon un podcast mientras haces otra cosa', 'No te esfuerces en entender todo'], tip: '"All Ears English" o "6 Minute English" de BBC' },
      ]},
    ],
  });

  // ===== WEEK 3 =====
  weeks.push({
    number: 3,
    title: 'Introducir shadowing',
    desc: 'Shadowing = repetir lo que oyes EN TIEMPO REAL. El ejercicio mas potente para listening.',
    days: [
      { day: 15, label: 'Dia 15', duration: '25 min', activities: [
        { time: '15 min', desc: 'Primera sesion de shadowing', shadowing: 0 },
        { time: '5 min', desc: 'Seccion "Fall-Rise"', file: 'listening/intonation.md', details: ['Duda, reserva, "pero" no dicho'] },
        { time: '5 min', desc: 'Serie' },
      ]},
      { day: 16, label: 'Dia 16', duration: '25 min', activities: [
        { time: '10 min', desc: 'Shadowing', shadowing: 1 },
        { time: '10 min', desc: 'Dictation (nuevo material)', dictation: 8 },
        { time: '5 min', desc: 'Serie' },
      ]},
      { day: 17, label: 'Dia 17', duration: '25 min', activities: [
        { time: '10 min', desc: 'Shadowing', shadowing: 2 },
        { time: '10 min', desc: 'Grupo 3 (sonidos que no existen en español)', file: 'listening/hardest-phrases.md', details: ['Enfocate en frases con /θ/, /ð/, /v/'] },
        { time: '5 min', desc: 'Serie - intenta 5 min sin subtitulos' },
      ]},
      { day: 18, label: 'Dia 18', duration: '25 min', activities: [
        { time: '10 min', desc: 'Shadowing (sube la dificultad)', shadowing: 4 },
        { time: '10 min', desc: 'Nivel 2, frases 16-30', file: 'listening/connected-speech-drills.md' },
        { time: '5 min', desc: 'Serie' },
      ]},
      { day: 19, label: 'Dia 19', duration: '25 min', activities: [
        { time: '10 min', desc: 'Shadowing', shadowing: 3 },
        { time: '10 min', desc: 'Secciones "Teen vs Ten" y "Numeros grandes"', file: 'listening/numbers-spoken.md', details: ['Practica: thirteen vs thirty, fourteen vs forty'] },
        { time: '5 min', desc: 'Serie' },
      ]},
      { day: 20, label: 'Dia 20', duration: '30 min', activities: [
        { time: '10 min', desc: 'Shadowing (serie real)', shadowing: 5 },
        { time: '10 min', desc: 'Grupo 4 (homofonos)', file: 'listening/hardest-phrases.md' },
        { time: '10 min', desc: 'Serie: 5 sin sub + 5 con sub' },
      ]},
      { day: 21, label: 'Dia 21', duration: '20 min', rest: true, activities: [
        { time: '20 min', desc: 'Descanso activo - YouTube que te interese', details: ['Algo que te guste DE VERDAD (tech, gaming, cocina) en ingles', 'No estudies. Solo disfruta. Si entiendes el 50%, vas bien'] },
      ]},
    ],
  });

  // ===== WEEK 4 =====
  weeks.push({
    number: 4,
    title: 'Subir intensidad',
    desc: 'Ya tienes las herramientas. Sube el ritmo y empieza a quitar subtitulos.',
    days: [
      { day: 22, label: 'Lunes', duration: '25 min', activities: [
        { time: '10 min', desc: 'Shadowing', shadowing: 8 },
        { time: '10 min', desc: 'Nivel 3 - dialogos reales', file: 'listening/connected-speech-drills.md', details: ['Primeras 10 situaciones'] },
        { time: '5 min', desc: 'Serie sin subtitulos' },
      ]},
      { day: 23, label: 'Martes', duration: '25 min', activities: [
        { time: '10 min', desc: 'Dictation', dictation: 13 },
        { time: '10 min', desc: 'Grupo 5 (expresiones idiomaticas)', file: 'listening/hardest-phrases.md' },
        { time: '5 min', desc: 'Serie sin subtitulos' },
      ]},
      { day: 24, label: 'Miercoles', duration: '25 min', activities: [
        { time: '10 min', desc: 'Shadowing', shadowing: 6 },
        { time: '10 min', desc: 'Seccion "American English"', file: 'listening/accents.md', details: ['Flapping (better = /beɾər/) y R rhotico'] },
        { time: '5 min', desc: 'Serie' },
      ]},
      { day: 25, label: 'Jueves', duration: '25 min', activities: [
        { time: '10 min', desc: 'Dictation', dictation: 4 },
        { time: '10 min', desc: 'Primeras 3 secciones', file: 'listening/slang-modern.md', details: ['ghost, flex, vibe, lowkey, bet, cap - las oiras en series'] },
        { time: '5 min', desc: 'Serie' },
      ]},
      { day: 26, label: 'Viernes', duration: '25 min', activities: [
        { time: '10 min', desc: 'Shadowing', shadowing: 7 },
        { time: '10 min', desc: 'Repaso: las 20 reduced forms que peor recuerdes' },
        { time: '5 min', desc: 'Serie' },
      ]},
      { day: 27, label: 'Sabado', duration: '30 min', activities: [
        { time: '15 min', desc: 'Episodio ya visto en español, ahora en ingles sin sub' },
        { time: '15 min', desc: 'Anota 10 frases que no entendieras', details: ['Analiza POR QUE: ¿reduced form? ¿linking? ¿acento?'] },
      ]},
      { day: 28, label: 'Domingo', duration: '10 min', rest: true, activities: [
        { time: '10 min', desc: 'Descanso activo - Musica o podcast de fondo' },
      ]},
    ],
  });

  // ===== WEEKS 5-8: Pattern =====
  const week5to8Template = [
    { label: 'Lunes', duration: '25 min', activities: [
      { time: '10 min', desc: 'Shadowing', shadowing: 9 },
      { time: '10 min', desc: 'Reduced forms nuevas o repaso' },
      { time: '5 min', desc: 'Serie sin subtitulos' },
    ]},
    { label: 'Martes', duration: '25 min', activities: [
      { time: '10 min', desc: 'Dictation', dictation: 14 },
      { time: '10 min', desc: '10 frases nuevas', file: 'listening/hardest-phrases.md' },
      { time: '5 min', desc: 'Serie sin subtitulos' },
    ]},
    { label: 'Miercoles', duration: '25 min', activities: [
      { time: '10 min', desc: 'Shadowing', shadowing: 5 },
      { time: '10 min', desc: 'Repaso', file: 'listening/connected-speech-drills.md' },
      { time: '5 min', desc: 'YouTube en ingles' },
    ]},
    { label: 'Jueves', duration: '25 min', activities: [
      { time: '10 min', desc: 'Dictation', dictation: 12 },
      { time: '10 min', desc: 'Entonacion o acentos', file: 'listening/intonation.md' },
      { time: '5 min', desc: 'Serie sin subtitulos' },
    ]},
    { label: 'Viernes', duration: '30 min', activities: [
      { time: '10 min', desc: 'Shadowing', shadowing: 4 },
      { time: '10 min', desc: 'Par nuevo', file: 'listening/minimal-pairs-drills.md' },
      { time: '10 min', desc: 'Serie sin subtitulos' },
    ]},
    { label: 'Sabado', duration: '25 min', activities: [
      { time: '20 min', desc: 'Episodio completo sin subtitulos' },
      { time: '5 min', desc: 'Analizar 10 frases no entendidas' },
    ]},
    { label: 'Domingo', duration: '10 min', rest: true, activities: [
      { time: '10 min', desc: 'Descanso: podcast/musica de fondo' },
    ]},
  ];

  const weekProgression = [
    'Series con sub ingles (pausar cuando no entiendas)',
    'Series sin sub (solo si te pierdes)',
    'Podcasts a velocidad normal',
    'Noticias en directo (CNN, BBC) - lo mas dificil',
  ];

  for (let w = 5; w <= 8; w++) {
    const days = [];
    const baseDay = 28 + (w - 5) * 7;
    week5to8Template.forEach((template, i) => {
      days.push({
        ...template,
        day: baseDay + i + 1,
        activities: template.activities.map(a => ({ ...a })),
      });
    });
    weeks.push({
      number: w,
      title: 'Repeticion + exposicion real',
      desc: weekProgression[w - 5],
      days,
    });
  }

  // ===== WEEKS 9-12: Immersion =====
  const week9to12Template = [
    { label: 'Lunes', duration: '30 min', activities: [
      { time: '15 min', desc: 'Shadowing avanzado', shadowing: 8 },
      { time: '15 min', desc: 'Serie sin subtitulos' },
    ]},
    { label: 'Martes', duration: '30 min', activities: [
      { time: '30 min', desc: 'Podcast sin pausas (comprension continua)' },
    ]},
    { label: 'Miercoles', duration: '30 min', activities: [
      { time: '15 min', desc: 'Conversacion real (Tandem, HelloTalk, Discord)' },
      { time: '15 min', desc: 'Serie sin subtitulos' },
    ]},
    { label: 'Jueves', duration: '30 min', activities: [
      { time: '30 min', desc: 'Pelicula/documental sin subtitulos' },
    ]},
    { label: 'Viernes', duration: '30 min', activities: [
      { time: '15 min', desc: 'Shadowing avanzado', shadowing: 7 },
      { time: '15 min', desc: 'Serie sin subtitulos' },
    ]},
    { label: 'Sabado', duration: '90+ min', activities: [
      { time: '90 min', desc: 'Pelicula completa sin subtitulos' },
    ]},
    { label: 'Domingo', duration: '10 min', rest: true, activities: [
      { time: '10 min', desc: 'Descanso: musica, podcast de fondo' },
    ]},
  ];

  const weekMilestones = [
    'Entiendes 70-80% sin subtitulos',
    'Conversacion casual sin perderte',
    'Comprension fluida',
    'Entiendes 85%+ a velocidad normal',
  ];

  for (let w = 9; w <= 12; w++) {
    const days = [];
    const baseDay = 56 + (w - 9) * 7;
    week9to12Template.forEach((template, i) => {
      days.push({
        ...template,
        day: baseDay + i + 1,
        activities: template.activities.map(a => ({ ...a })),
      });
    });
    weeks.push({
      number: w,
      title: 'Inmersion + Conversacion',
      desc: weekMilestones[w - 9],
      days,
    });
  }

  return weeks;
}

const PLAN = buildPlan();
