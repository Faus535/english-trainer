/**
 * Integrator sessions - cross-module themed sessions.
 * Every 5th session assembles listening + pronunciation + secondary around a common theme.
 * Content references .md files in english/modules/integrator/ directory.
 */

const INTEGRATOR_SESSIONS = {
  a1: [
    { id: 'int-a1-01', title: 'Presentarte y entender presentaciones', file: 'session-01-introductions.md', modules: ['listening', 'pronunciation', 'phrases'] },
    { id: 'int-a1-02', title: 'En el restaurante', file: 'session-02-restaurant.md', modules: ['listening', 'pronunciation', 'vocabulary'] },
    { id: 'int-a1-03', title: 'De compras', file: 'session-03-shopping.md', modules: ['listening', 'pronunciation', 'phrases'] },
    { id: 'int-a1-04', title: 'Preguntar direcciones', file: 'session-04-directions.md', modules: ['listening', 'pronunciation', 'vocabulary'] },
  ],
  a2: [
    { id: 'int-a2-01', title: 'En el aeropuerto', file: 'session-01-airport.md', modules: ['listening', 'pronunciation', 'phrases'] },
    { id: 'int-a2-02', title: 'Llamada telefonica', file: 'session-02-phone-call.md', modules: ['listening', 'pronunciation', 'grammar'] },
    { id: 'int-a2-03', title: 'Entrevista de trabajo basica', file: 'session-03-job-interview.md', modules: ['listening', 'pronunciation', 'phrases'] },
    { id: 'int-a2-04', title: 'En el medico', file: 'session-04-doctor.md', modules: ['listening', 'pronunciation', 'vocabulary'] },
    { id: 'int-a2-05', title: 'Quedar con amigos', file: 'session-05-meeting-friends.md', modules: ['listening', 'pronunciation', 'phrases'] },
  ],
  b1: [
    { id: 'int-b1-01', title: 'Reunion de trabajo', file: 'session-01-work-meeting.md', modules: ['listening', 'pronunciation', 'grammar'] },
    { id: 'int-b1-02', title: 'Ver una serie juntos', file: 'session-02-tv-series.md', modules: ['listening', 'pronunciation', 'vocabulary'] },
    { id: 'int-b1-03', title: 'Debate: opiniones y rebatir', file: 'session-03-debate.md', modules: ['listening', 'pronunciation', 'phrases'] },
    { id: 'int-b1-04', title: 'Contar una historia', file: 'session-04-storytelling.md', modules: ['listening', 'pronunciation', 'grammar'] },
    { id: 'int-b1-05', title: 'Podcast real: escuchar + resumir', file: 'session-05-podcast.md', modules: ['listening', 'pronunciation', 'vocabulary'] },
  ],
  b2: [
    { id: 'int-b2-01', title: 'Presentacion profesional', file: 'session-01-presentation.md', modules: ['listening', 'pronunciation', 'phrases'] },
    { id: 'int-b2-02', title: 'Negociar un acuerdo', file: 'session-02-negotiation.md', modules: ['listening', 'pronunciation', 'grammar'] },
    { id: 'int-b2-03', title: 'Stand-up comedy', file: 'session-03-comedy.md', modules: ['listening', 'pronunciation', 'vocabulary'] },
    { id: 'int-b2-04', title: 'Noticias en directo', file: 'session-04-live-news.md', modules: ['listening', 'pronunciation', 'vocabulary'] },
  ],
  c1: [
    { id: 'int-c1-01', title: 'Conferencia tecnica', file: 'session-01-tech-conference.md', modules: ['listening', 'pronunciation', 'vocabulary'] },
    { id: 'int-c1-02', title: 'Debate formal con matices', file: 'session-02-formal-debate.md', modules: ['listening', 'pronunciation', 'grammar'] },
    { id: 'int-c1-03', title: 'Entrevista nativa real', file: 'session-03-native-interview.md', modules: ['listening', 'pronunciation', 'phrases'] },
  ]
};

/**
 * Get the next integrator session for the user's current level.
 * Returns null if all integrators at current level are completed.
 */
function getNextIntegratorSession() {
  const level = getOverallLevel();
  const sessions = INTEGRATOR_SESSIONS[level];
  if (!sessions || sessions.length === 0) return null;

  const completedIntegrators = loadState('completedIntegrators', []);
  for (const session of sessions) {
    if (!completedIntegrators.includes(session.id)) {
      return { ...session, level };
    }
  }

  // All at this level completed, try next level
  const nextLevel = getNextLevel(level);
  if (nextLevel && INTEGRATOR_SESSIONS[nextLevel]) {
    for (const session of INTEGRATOR_SESSIONS[nextLevel]) {
      if (!completedIntegrators.includes(session.id)) {
        return { ...session, level: nextLevel };
      }
    }
  }

  return null;
}

function completeIntegratorSession(sessionId) {
  const completed = loadState('completedIntegrators', []);
  if (!completed.includes(sessionId)) {
    completed.push(sessionId);
    saveState('completedIntegrators', completed);
  }
}
