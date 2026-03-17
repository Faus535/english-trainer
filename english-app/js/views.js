/**
 * View rendering - Dashboard and Day detail views.
 */

// O(1) day lookup map built once from PLAN data
const DAY_MAP = {};
(function buildDayMap() {
  for (const week of PLAN) {
    for (const day of week.days) {
      DAY_MAP[day.day] = { day, week };
    }
  }
})();

function render() {
  updateProgress();
  if (currentView === 'dashboard') {
    renderDashboard();
  } else {
    renderDayView(currentView);
  }
}

function updateProgress() {
  const done = Object.keys(completedDays).length;
  const pct = Math.round((done / TOTAL_DAYS) * 100);
  const bar = document.getElementById('progressBar');
  const text = document.getElementById('progressText');
  const container = document.getElementById('progressContainer');
  bar.style.width = pct + '%';
  text.textContent = `${done} / ${TOTAL_DAYS} dias (${pct}%)`;
  container.setAttribute('aria-valuenow', done);
}

// ===== Dashboard =====

function renderDashboard() {
  const main = document.getElementById('main');
  const nextDay = getNextDay();
  let h = '<div class="dashboard">';

  // Intro
  h += '<div class="dashboard-intro">';
  h += '<h2>De Leer al Oido en 12 Semanas</h2>';
  h += '<p>Entiendo 80-90% leyendo, pero me pierdo al escuchar.</p>';
  h += '</div>';

  // Golden rules
  h += '<div class="golden-rules"><h3>Reglas de Oro</h3><ol>';
  h += '<li><strong>Nunca subtitulos en espa\u00f1ol</strong> - Solo ingles o sin subtitulos</li>';
  h += '<li><strong>No traducir mentalmente</strong> - Escucha el significado</li>';
  h += '<li><strong>Repetir > avanzar</strong> - 1 frase 10 veces > 10 frases 1 vez</li>';
  h += '<li><strong>Consistencia</strong> - 20 min/dia > 2h el sabado</li>';
  h += '<li><strong>Nivel correcto</strong> - Entiende el 60-70% de lo que escuchas</li>';
  h += '</ol></div>';

  // Weeks
  PLAN.forEach(week => {
    const weekDone = week.days.filter(d => completedDays[d.day]).length;

    h += '<div class="week-card">';
    h += `<div class="week-header">`;
    h += `<h3>Semana ${week.number} - ${escapeHtml(week.title)}</h3>`;
    h += `<span class="week-progress">${weekDone}/${week.days.length}</span>`;
    h += '</div>';
    h += '<div class="week-body">';

    week.days.forEach(day => {
      const done = !!completedDays[day.day];
      const isNext = day.day === nextDay;
      let cls = 'day-tile';
      if (done) cls += ' completed';
      if (isNext && !done) cls += ' today';
      if (day.rest) cls += ' rest';

      h += `<div class="${cls}" data-action="openDay" data-day="${day.day}" role="button" tabindex="0" aria-label="Dia ${day.day}: ${escapeHtml(day.label)}${done ? ' (completado)' : ''}">`;
      h += `<div class="day-number">${day.day}</div>`;
      h += `<div class="day-label">${escapeHtml(day.label)}</div>`;
      h += `<div class="day-duration">${escapeHtml(day.duration)}</div>`;
      h += `<div class="day-check" aria-hidden="true">${done ? '&#10003;' : '&#9675;'}</div>`;
      h += '</div>';
    });

    h += '</div></div>';
  });

  // Milestones
  h += '<div class="milestones">';
  h += '<div class="milestones-header"><h3>Hitos de Progreso</h3></div>';
  h += '<div class="milestones-body">';
  MILESTONES.forEach((m, i) => {
    const checked = !!completedMilestones[i];
    h += `<div class="milestone-item ${checked ? 'checked' : ''}">`;
    h += `<input type="checkbox" class="milestone-check" ${checked ? 'checked' : ''} data-action="toggleMilestone" data-index="${i}" aria-label="${escapeHtml(m.text)}">`;
    h += `<div class="milestone-text">${escapeHtml(m.text)} <span class="milestone-week">Semana ${m.week}</span></div>`;
    h += '</div>';
  });
  h += '</div></div>';

  // Motivation
  h += '<div class="motivation-box">';
  h += '<p>En <strong>4 semanas</strong> notaras la diferencia. ';
  h += 'En <strong>8 semanas</strong> sera obvia. ';
  h += 'En <strong>12 semanas</strong> sera otra vida.</p>';
  h += '</div>';

  h += '</div>';
  main.innerHTML = h;
}

// ===== Day View =====

function renderDayView(dayNum) {
  const main = document.getElementById('main');
  const entry = DAY_MAP[dayNum];

  if (!entry) { showDashboard(); return; }

  const dayData = entry.day;
  const weekData = entry.week;
  const isDone = !!completedDays[dayNum];
  let h = '<div class="day-view active">';

  // Navigation
  h += '<div class="day-nav">';
  h += `<button ${dayNum <= 1 ? 'disabled' : ''} data-action="openDay" data-day="${dayNum - 1}" aria-label="Ir al dia ${dayNum - 1}">&#8592; Dia ${dayNum - 1}</button>`;
  h += '<div class="day-nav-title">';
  h += `<h2>Dia ${dayNum}</h2>`;
  h += `<div class="day-subtitle">Semana ${weekData.number} - ${escapeHtml(weekData.title)}</div>`;
  h += '</div>';
  h += `<button ${dayNum >= TOTAL_DAYS ? 'disabled' : ''} data-action="openDay" data-day="${dayNum + 1}" aria-label="Ir al dia ${dayNum + 1}">Dia ${dayNum + 1} &#8594;</button>`;
  h += '</div>';

  // Week description
  if (weekData.desc) {
    h += `<div class="info-box" style="margin-bottom:16px">`;
    h += `<p style="color:var(--accent);font-style:italic">${escapeHtml(weekData.desc)}</p>`;
    h += '</div>';
  }

  // Day content
  h += '<div class="day-content">';
  h += '<div class="day-content-header">';
  h += `<span style="color:var(--text);font-weight:600">${escapeHtml(dayData.label)}</span>`;
  h += `<span class="duration-badge">${escapeHtml(dayData.duration)}</span>`;
  h += '</div>';

  h += '<div class="activity-list">';
  dayData.activities.forEach((act, ai) => {
    h += renderActivity(act, dayNum, ai, dayData.rest);
  });
  h += '</div>';

  // Complete button
  h += '<div class="day-complete-section">';
  h += `<button class="btn-complete ${isDone ? 'completed' : ''}" data-action="toggleDay" data-day="${dayNum}">`;
  h += isDone ? '&#10003; Dia completado' : 'Marcar dia como completado';
  h += '</button></div>';
  h += '</div>';

  // Series recommendations (weeks 1-4)
  if (weekData.number <= 4) {
    h += '<div class="info-box"><h4>Series recomendadas</h4>';
    h += '<p><strong>Facil:</strong> Friends, The Office US, Brooklyn Nine-Nine</p>';
    h += '<p><strong>Medio:</strong> Stranger Things, The Good Place, Ted Lasso</p>';
    h += '<p><strong>Dificil:</strong> Breaking Bad, Peaky Blinders, Game of Thrones</p>';
    h += '<p style="margin-top:8px;color:var(--green)">Empieza por Friends o The Office.</p></div>';
  }

  // Motivation
  const motiv = MOTIVATIONS[dayNum % MOTIVATIONS.length];
  h += `<div class="motivation-box"><p>${escapeHtml(motiv)}</p></div>`;

  h += '</div>';
  main.innerHTML = h;
  window.scrollTo(0, 0);
}

function renderActivity(act, dayNum, actIndex, isRest) {
  const actId = `d${dayNum}-a${actIndex}`;
  const cls = isRest ? 'activity-item rest-activity' : 'activity-item';
  let h = `<div class="${cls}">`;

  h += `<span class="activity-time">${escapeHtml(act.time)}</span>`;
  h += `<div class="activity-desc">${escapeHtml(act.desc)}</div>`;

  // Dictation component
  if (act.dictation !== undefined) {
    h += renderDictation(act.dictation, dayNum, actIndex);
  }

  // Shadowing component
  if (act.shadowing !== undefined) {
    h += renderShadowing(act.shadowing, dayNum, actIndex);
  }

  // Clickable file button
  if (act.file) {
    const safeFile = escapeHtml(act.file);
    h += `<button class="activity-file-btn" id="fb-${actId}" data-file="${safeFile}" data-action="toggleFileViewer" data-act-id="${actId}">`;
    h += '<span class="file-icon" aria-hidden="true">&#9654;</span>';
    h += `<span>${safeFile}</span>`;
    h += '<span class="file-status">click para ver</span>';
    h += '</button>';
    h += `<div class="file-viewer" id="fv-${actId}"></div>`;
  }

  // Details
  if (act.details && act.details.length) {
    h += '<ul class="activity-details">';
    act.details.forEach(d => { h += `<li>${escapeHtml(d)}</li>`; });
    h += '</ul>';
  }

  // Tip
  if (act.tip) {
    h += `<div class="activity-tip">${escapeHtml(act.tip)}</div>`;
  }

  h += '</div>';
  return h;
}

// ===== File Viewer =====

function toggleFileViewer(actId) {
  const viewer = document.getElementById('fv-' + actId);
  const btn = document.getElementById('fb-' + actId);
  if (!viewer || !btn) return;

  if (viewer.classList.contains('open')) {
    viewer.classList.remove('open');
    btn.classList.remove('open');
    return;
  }

  const filePath = btn.dataset.file;
  const content = findFile(filePath);

  if (!content) {
    viewer.innerHTML = `<div style="padding:12px;color:var(--yellow)">No se encontro: ${escapeHtml(filePath)}</div>`;
    viewer.classList.add('open');
    return;
  }

  const safeFilePath = escapeHtml(filePath);
  viewer.innerHTML = `
    <div class="file-viewer-header">
      <span>${safeFilePath}</span>
      <button class="file-viewer-close" data-action="toggleFileViewer" data-act-id="${actId}" aria-label="Cerrar visor de archivo">&times;</button>
    </div>
    <div class="file-viewer-content">
      <div class="md-content">${renderMd(content)}</div>
    </div>`;

  viewer.classList.add('open');
  btn.classList.add('open');
}

// ===== Dictation Component =====

function renderDictation(videoIndex, dayNum, actIndex) {
  const video = DICTATION_VIDEOS[videoIndex % DICTATION_VIDEOS.length];
  if (!video) return '';

  // Validate YouTube video ID (alphanumeric, hyphens, underscores, 11 chars)
  const safeVideoId = /^[\w-]{11}$/.test(video.id) ? video.id : '';
  if (!safeVideoId) return '';

  const noteId = `dict-note-${dayNum}-${actIndex}`;
  const savedNote = escapeHtml(loadDictationNote(dayNum, actIndex));

  let h = '<div class="dictation-box">';

  // Steps
  h += '<div class="dictation-steps">';
  h += '<div class="dictation-step"><span class="step-num">1</span> Dale al play y escucha 30 seg <strong>sin subtitulos</strong></div>';
  h += '<div class="dictation-step"><span class="step-num">2</span> Pausa y escribe abajo lo que oiste</div>';
  h += '<div class="dictation-step"><span class="step-num">3</span> Activa subtitulos en el video y compara</div>';
  h += '<div class="dictation-step"><span class="step-num">4</span> Repite el fragmento 3 veces mas</div>';
  h += '</div>';

  // Video info
  h += '<div class="dictation-video-info">';
  h += `<span class="dictation-channel">${escapeHtml(video.channel)}</span>`;
  h += `<span class="dictation-title">${escapeHtml(video.title)}</span>`;
  h += '</div>';

  // Embedded video
  h += '<div class="dictation-video-container">';
  h += `<iframe src="https://www.youtube.com/embed/${safeVideoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy" title="${escapeHtml(video.title)}"></iframe>`;
  h += '</div>';

  // Textarea
  h += '<div class="dictation-write">';
  h += `<label class="dictation-label" for="${noteId}">Escribe lo que oyes:</label>`;
  h += `<textarea class="dictation-textarea" id="${noteId}" data-action="saveDictationNote" data-day="${dayNum}" data-act-index="${actIndex}" placeholder="Escucha el video, pausa, y escribe aqui lo que entiendes...">${savedNote}</textarea>`;
  h += '</div>';

  h += '</div>';
  return h;
}

// ===== Shadowing Component =====

function renderShadowing(videoIndex, dayNum, actIndex) {
  const video = SHADOWING_VIDEOS[videoIndex % SHADOWING_VIDEOS.length];
  if (!video) return '';

  // Validate YouTube video ID
  const safeVideoId = /^[\w-]{11}$/.test(video.id) ? video.id : '';
  if (!safeVideoId) return '';

  let h = '<div class="shadowing-box">';

  // Steps
  h += '<div class="dictation-steps">';
  h += '<div class="dictation-step"><span class="step-num step-shadow">1</span> Escucha una frase del video</div>';
  h += '<div class="dictation-step"><span class="step-num step-shadow">2</span> Pausa y <strong>repitela</strong> imitando todo</div>';
  h += '<div class="dictation-step"><span class="step-num step-shadow">3</span> Rebobina y repite <strong>al mismo tiempo</strong></div>';
  h += '<div class="dictation-step"><span class="step-num step-shadow">4</span> Repite 5 veces hasta que suene igual</div>';
  h += '</div>';

  // Video info
  h += '<div class="dictation-video-info">';
  h += `<span class="shadowing-channel">${escapeHtml(video.channel)}</span>`;
  h += `<span class="dictation-title">${escapeHtml(video.title)}</span>`;
  h += '</div>';

  // Embedded video
  h += '<div class="dictation-video-container">';
  h += `<iframe src="https://www.youtube.com/embed/${safeVideoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy" title="${escapeHtml(video.title)}"></iframe>`;
  h += '</div>';

  h += '</div>';
  return h;
}

// ===== Navigation =====

function openDay(n) {
  if (n < 1 || n > TOTAL_DAYS) return;
  currentView = n;
  render();
}

function showDashboard() {
  currentView = 'dashboard';
  render();
}
