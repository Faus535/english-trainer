/**
 * Markdown renderer - parses .md content and renders HTML with play buttons.
 */

const SKIP_COLS = [
  /^#$/i, /^spanish$/i, /^traducci/i, /^contexto$/i,
  /^type$/i, /^tipo$/i, /^ipa$/i, /^como\s*suena$/i,
  /^truco/i, /^categor/i, /^nivel/i, /^significado/i,
  /^uso$/i, /^regla/i, /^descripci/i,
];

function shouldPlayColumn(header) {
  return !SKIP_COLS.some(p => p.test(header.trim()));
}

function formatInline(text) {
  return text
    .replace(/(\/[^/<>]+\/)/g, '<span class="ipa">$1</span>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a class="md-link" href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<span class="md-link">$1</span>');
}

function renderMd(md) {
  const lines = md.split('\n');
  let html = '';
  let i = 0;
  let tableId = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Table
    if (line.includes('|') && i + 1 < lines.length && /^\|[\s-:|]+\|/.test(lines[i + 1])) {
      const result = renderTable(lines, i, tableId++);
      html += result.html;
      i = result.endIndex;
      continue;
    }

    // Headers
    const headerMatch = line.match(/^(#{1,4})\s+(.+)/);
    if (headerMatch) {
      const level = headerMatch[1].length;
      html += `<h${level}>${formatInline(headerMatch[2])}</h${level}>`;
      i++;
      continue;
    }

    // Blockquote
    if (line.startsWith('>')) {
      let quote = '';
      while (i < lines.length && lines[i].startsWith('>')) {
        quote += lines[i].replace(/^>\s*/, '') + ' ';
        i++;
      }
      html += `<blockquote>${formatInline(quote.trim())}</blockquote>`;
      continue;
    }

    // Horizontal rule
    if (/^---+$/.test(line.trim())) {
      html += '<hr>';
      i++;
      continue;
    }

    // Lists
    if (/^\s*[-*]\s/.test(line) || /^\s*\d+\.\s/.test(line)) {
      const ordered = /^\s*\d+\./.test(line);
      let list = ordered ? '<ol>' : '<ul>';
      while (i < lines.length && (/^\s*[-*]\s/.test(lines[i]) || /^\s*\d+\.\s/.test(lines[i]))) {
        const content = lines[i].trim().replace(/^[-*]\s+/, '').replace(/^\d+\.\s+/, '');
        list += `<li>${formatInline(content)}</li>`;
        i++;
      }
      list += ordered ? '</ol>' : '</ul>';
      html += list;
      continue;
    }

    // Empty line
    if (!line.trim()) {
      i++;
      continue;
    }

    // Paragraph
    let para = '';
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].startsWith('#') &&
      !lines[i].startsWith('>') &&
      !/^\s*[-*]\s/.test(lines[i]) &&
      !/^\s*\d+\.\s/.test(lines[i]) &&
      !lines[i].includes('|') &&
      !/^---/.test(lines[i])
    ) {
      para += lines[i] + ' ';
      i++;
    }
    if (para.trim()) {
      html += `<p>${formatInline(para.trim())}</p>`;
    }
  }

  return html;
}

function renderTable(lines, startIndex, id) {
  let i = startIndex;

  // Parse header
  const headers = lines[i].split('|').slice(1, -1).map(c => c.trim());
  const playable = headers.map(h => shouldPlayColumn(h));
  i += 2; // Skip header + separator

  // Parse rows
  const rows = [];
  while (i < lines.length && lines[i].includes('|') && lines[i].trim().startsWith('|')) {
    rows.push(lines[i].split('|').slice(1, -1).map(c => c.trim()));
    i++;
  }

  // Build HTML
  const tid = 'tbl-' + id;
  let html = `<button class="play-all-btn" data-action="playAllTable" data-table-id="${tid}" aria-label="Reproducir toda la tabla">&#9654; Reproducir tabla</button>`;
  html += `<div class="table-wrapper"><table id="${tid}"><thead><tr>`;

  headers.forEach(h => {
    html += `<th>${formatInline(h)}</th>`;
  });
  html += '</tr></thead><tbody>';

  rows.forEach(row => {
    html += '<tr>';
    row.forEach((cell, colIdx) => {
      const canPlay = colIdx < playable.length && playable[colIdx];
      const clean = cleanForSpeech(cell);

      if (canPlay && clean && !/^\d+$/.test(clean)) {
        const escaped = escapeHtml(clean);
        html += `<td><button class="play-btn" data-action="playCell" data-text="${escaped}" aria-label="Reproducir: ${escaped}">&#9654;</button>${formatInline(cell)}</td>`;
      } else {
        html += `<td>${formatInline(cell)}</td>`;
      }
    });
    html += '</tr>';
  });

  html += '</tbody></table></div>';
  return { html, endIndex: i };
}

/**
 * Finds a file in FILES_DATA by path (exact or partial match).
 */
function findFile(filePath) {
  if (FILES_DATA[filePath]) return FILES_DATA[filePath];

  for (const key of Object.keys(FILES_DATA)) {
    if (key.endsWith(filePath) || key.endsWith('/' + filePath)) return FILES_DATA[key];
  }

  const name = filePath.split('/').pop();
  for (const key of Object.keys(FILES_DATA)) {
    if (key.endsWith(name)) return FILES_DATA[key];
  }

  return null;
}
