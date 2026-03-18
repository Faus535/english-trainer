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

// Determine which week contains the next uncompleted day
function getCurrentWeekNumber() {
  const nextDay = getNextDay();
  const entry = DAY_MAP[nextDay];
  return entry ? entry.week.number : 1;
}

// Expand/collapse state
let expandedWeeks = loadState('expandedWeeks', {});

function toggleWeek(weekNum) {
  if (expandedWeeks[weekNum]) {
    delete expandedWeeks[weekNum];
  } else {
    expandedWeeks[weekNum] = true;
  }
  saveState('expandedWeeks', expandedWeeks);
  render();
}

function renderDashboard() {
  const main = document.getElementById('main');
  const nextDay = getNextDay();
  const currentWeek = getCurrentWeekNumber();

  // Auto-expand current week if nothing is explicitly expanded
  const hasExplicit = Object.keys(expandedWeeks).length > 0;
  if (!hasExplicit) {
    expandedWeeks[currentWeek] = true;
  }

  let h = '<div class="dashboard">';

  // Gamification bar
  h += renderGamificationHeader();

  // Widgets: Sound of the Day + Phrase Roulette
  h += '<div class="dashboard-widgets">';
  h += renderSoundOfTheDay();
  h += renderPhraseRoulette();
  h += '</div>';

  // Block labels
  const BLOCKS = {
    1: { name: 'A', label: 'Foundations', range: '1-4' },
    5: { name: 'B', label: 'Problem Sounds', range: '5-8' },
    9: { name: 'C', label: 'Flow & Grammar', range: '9-12' },
    13: { name: 'D', label: 'Immersion', range: '13-16' },
  };

  // Weeks as accordion
  PLAN.forEach(week => {
    const weekDone = week.days.filter(d => completedDays[d.day]).length;
    const weekTotal = week.days.length;
    const weekPct = Math.round((weekDone / weekTotal) * 100);
    const isExpanded = !!expandedWeeks[week.number];
    const isCurrent = week.number === currentWeek;
    const isComplete = weekDone === weekTotal;

    // Block separator
    const block = BLOCKS[week.number];
    if (block) {
      h += `<div class="block-separator">`;
      h += `<span class="block-badge">Block ${block.name}</span>`;
      h += `<span class="block-label">${escapeHtml(block.label)}</span>`;
      h += `<span class="block-range">Weeks ${block.range}</span>`;
      h += `</div>`;
    }

    // Week card
    let weekCls = 'week-card accordion';
    if (isExpanded) weekCls += ' expanded';
    if (isCurrent) weekCls += ' current-week';
    if (isComplete) weekCls += ' complete-week';

    h += `<div class="${weekCls}">`;

    // Week header (clickable)
    h += `<div class="week-header" data-action="toggleWeek" data-week="${week.number}" role="button" tabindex="0" aria-expanded="${isExpanded}" aria-label="Semana ${week.number}: ${escapeHtml(week.title)}">`;
    h += `<div class="week-header-left">`;
    h += `<span class="week-chevron" aria-hidden="true">${isExpanded ? '&#9660;' : '&#9654;'}</span>`;
    h += `<div class="week-header-info">`;
    h += `<h3>Semana ${week.number}</h3>`;
    h += `<span class="week-title">${escapeHtml(week.title)}</span>`;
    h += `</div>`;
    h += `</div>`;
    h += `<div class="week-header-right">`;
    h += `<span class="week-progress-text">${weekDone}/${weekTotal}</span>`;
    h += `<div class="week-progress-bar"><div class="week-progress-fill" style="width:${weekPct}%"></div></div>`;
    h += `</div>`;
    h += `</div>`;

    // Week body (collapsible)
    h += `<div class="week-body accordion-body" ${isExpanded ? '' : 'style="display:none"'}>`;

    // Week description
    if (week.desc) {
      h += `<div class="week-desc">${escapeHtml(week.desc)}</div>`;
    }

    // Day tiles grid
    h += '<div class="days-grid">';
    week.days.forEach(day => {
      const done = !!completedDays[day.day];
      const isNext = day.day === nextDay;
      let cls = 'day-tile';
      if (done) cls += ' completed';
      if (isNext && !done) cls += ' today';
      if (day.rest) cls += ' rest';

      h += `<div class="${cls}" data-action="openDay" data-day="${day.day}" role="button" tabindex="0" aria-label="Dia ${day.day}: ${escapeHtml(day.label)}${done ? ' (completado)' : ''}">`;
      h += `<div class="day-tile-top">`;
      h += `<span class="day-number">#${day.day}</span>`;
      h += `<span class="day-check" aria-hidden="true">${done ? '&#10003;' : day.rest ? '&#9740;' : '&#9675;'}</span>`;
      h += `</div>`;
      h += `<div class="day-label">${escapeHtml(day.label)}</div>`;
      h += `<div class="day-duration">${escapeHtml(day.duration)}</div>`;
      // Show first activity as preview
      if (day.activities && day.activities[0]) {
        const preview = day.activities[0].desc;
        h += `<div class="day-preview">${escapeHtml(preview.length > 40 ? preview.slice(0, 37) + '...' : preview)}</div>`;
      }
      h += '</div>';
    });
    h += '</div>'; // days-grid

    h += '</div>'; // week-body
    h += '</div>'; // week-card
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
  const motiv = MOTIVATIONS[new Date().getDate() % MOTIVATIONS.length];
  h += `<div class="motivation-box"><p>${escapeHtml(motiv)}</p></div>`;

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
  h += `<button ${dayNum <= 1 ? 'disabled' : ''} data-action="openDay" data-day="${dayNum - 1}" aria-label="Ir al dia ${dayNum - 1}">&#8592;</button>`;
  h += '<div class="day-nav-title">';
  h += `<h2>Dia ${dayNum}</h2>`;
  h += `<div class="day-subtitle">Semana ${weekData.number} &middot; ${escapeHtml(weekData.title)}</div>`;
  h += '</div>';
  h += `<button ${dayNum >= TOTAL_DAYS ? 'disabled' : ''} data-action="openDay" data-day="${dayNum + 1}" aria-label="Ir al dia ${dayNum + 1}">&#8594;</button>`;
  h += '</div>';

  // Day header card
  h += '<div class="day-header-card">';
  h += '<div class="day-header-top">';
  h += `<span class="day-header-label">${escapeHtml(dayData.label)}</span>`;
  h += `<span class="duration-badge">${escapeHtml(dayData.duration)}</span>`;
  h += '</div>';
  if (weekData.desc) {
    h += `<p class="day-header-desc">${escapeHtml(weekData.desc)}</p>`;
  }
  // Activity count
  const actCount = dayData.activities.length;
  h += `<div class="day-header-meta">${actCount} ${actCount === 1 ? 'actividad' : 'actividades'}</div>`;
  h += '</div>';

  // Activity cards
  h += '<div class="activity-cards">';
  dayData.activities.forEach((act, ai) => {
    h += renderActivity(act, dayNum, ai, dayData.rest);
  });
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

  // Sticky complete button
  h += '<div class="day-complete-sticky">';
  h += `<button class="btn-complete ${isDone ? 'completed' : ''}" data-action="toggleDay" data-day="${dayNum}">`;
  h += isDone ? '&#10003; Dia completado' : 'Marcar dia como completado';
  h += '</button></div>';

  h += '</div>';
  main.innerHTML = h;
  window.scrollTo(0, 0);
}

// Activity type icons
function getActivityIcon(act) {
  if (act.dictation !== undefined) return '&#127911;'; // headphones
  if (act.shadowing !== undefined) return '&#127908;'; // microphone
  if (act.file) return '&#128214;'; // open book
  if (act.rest) return '&#9749;'; // coffee
  return '&#9654;'; // play
}

function renderActivity(act, dayNum, actIndex, isRest) {
  const actId = `d${dayNum}-a${actIndex}`;
  let cls = 'activity-card';
  if (isRest) cls += ' rest-activity';
  if (act.dictation !== undefined) cls += ' type-dictation';
  if (act.shadowing !== undefined) cls += ' type-shadowing';
  if (act.file) cls += ' type-reading';

  let h = `<div class="${cls}">`;

  // Card header
  h += '<div class="act-card-header">';
  h += `<span class="act-icon" aria-hidden="true">${getActivityIcon(act)}</span>`;
  h += `<div class="act-card-info">`;
  h += `<div class="act-card-desc">${escapeHtml(act.desc)}</div>`;
  h += `<span class="act-card-time">${escapeHtml(act.time)}</span>`;
  h += `</div>`;
  h += '</div>';

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
    const fileLabel = escapeHtml(act.desc || act.file);
    h += `<button class="activity-file-btn" id="fb-${actId}" data-file="${safeFile}" data-action="toggleFileViewer" data-act-id="${actId}">`;
    h += '<span class="file-icon" aria-hidden="true">&#128196;</span>';
    h += `<span>${fileLabel}</span>`;
    h += '<span class="file-status">ver contenido</span>';
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
      <div class="file-viewer-actions">
        <button class="file-viewer-play" data-action="playAllMd" data-viewer-id="fv-${actId}" aria-label="Reproducir todo el contenido">&#9654; Leer todo</button>
        <button class="file-viewer-close" data-action="toggleFileViewer" data-act-id="${actId}" aria-label="Cerrar visor de archivo">&times;</button>
      </div>
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
