import { SOCIAL_PLATFORMS } from '../data/socialPlatforms';

// Self-owned SVG generators — no third-party readme services

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function theme(style) {
  return style || {
    bg: '#0d1117', card: '#161b22', accent: '#58a6ff', text: '#c9d1d9', muted: '#8b949e',
  };
}

// ─── Header banners ─────────────────────────────────────────────────────────

export function generateHeaderSvg(cfg, style) {
  const t = theme(style);
  const { title = 'Hello', subtitle = '', style: headerStyle = 'wave', imageUrl, colors = [t.accent, t.muted] } = cfg;
  const w = 800, h = 200;

  if (imageUrl) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs><clipPath id="hdr"><rect width="${w}" height="${h}" rx="12"/></clipPath></defs>
  <image href="${esc(imageUrl)}" width="${w}" height="${h}" clip-path="url(#hdr)" preserveAspectRatio="xMidYMid slice"/>
  <rect width="${w}" height="${h}" fill="rgba(0,0,0,.45)" rx="12"/>
  <text x="${w/2}" y="${h/2 - 8}" text-anchor="middle" fill="#fff" font-family="system-ui,sans-serif" font-size="36" font-weight="700">${esc(title)}</text>
  ${subtitle ? `<text x="${w/2}" y="${h/2 + 28}" text-anchor="middle" fill="rgba(255,255,255,.8)" font-family="system-ui,sans-serif" font-size="16">${esc(subtitle)}</text>` : ''}
</svg>`;
  }

  if (headerStyle === 'pixel') {
  const px = 10;
  let rects = '';
  for (let x = 0; x < w; x += px) {
    for (let y = 0; y < h; y += px) {
      const noise = (Math.sin(x * .08 + y * .06) + 1) / 2;
      const c = noise > .6 ? colors[0] : noise > .3 ? colors[1] : t.bg;
      rects += `<rect x="${x}" y="${y}" width="${px}" height="${px}" fill="${c}" opacity=".85"/>`;
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" fill="${t.bg}" rx="8"/>
  ${rects}
  <text x="${w/2}" y="${h/2 + 6}" text-anchor="middle" fill="#fff" font-family="monospace" font-size="28" font-weight="700">${esc(title)}</text>
</svg>`;
  }

  const gradId = 'hg';
  const wavePath = headerStyle === 'wave'
    ? `M0,${h} C${w*.25},${h*.55} ${w*.75},${h*.85} ${w},${h*.6} L${w},${h} Z`
    : `M0,${h*.7} L${w},${h*.5} L${w},${h} Z`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="${gradId}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${colors[0]}"/>
      <stop offset="100%" stop-color="${colors[1] || colors[0]}"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="${t.bg}" rx="12"/>
  <rect width="${w}" height="${h}" fill="url(#${gradId})" opacity=".35" rx="12"/>
  <path d="${wavePath}" fill="url(#${gradId})" opacity=".9"/>
  <text x="${w/2}" y="${h/2 - 6}" text-anchor="middle" fill="#fff" font-family="system-ui,sans-serif" font-size="34" font-weight="700">${esc(title)}</text>
  ${subtitle ? `<text x="${w/2}" y="${h/2 + 26}" text-anchor="middle" fill="rgba(255,255,255,.85)" font-family="system-ui,sans-serif" font-size="15">${esc(subtitle)}</text>` : ''}
</svg>`;
}

// ─── Typing animation SVG ───────────────────────────────────────────────────

export function generateTypingSvg(cfg, style) {
  const t = theme(style);
  const { lines = ['Hello World'], color = t.accent, font = 'Fira Code', speed = 80 } = cfg;
  const fullText = lines.join(' | ');
  const charCount = fullText.length;
  const duration = Math.max(3, charCount * (speed / 100));
  const w = 700, h = 50;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <style>
    @keyframes type { from { width: 0 } to { width: 100% } }
    @keyframes blink { 50% { opacity: 0 } }
    .typed { font: 600 18px "${esc(font)}", monospace; fill: ${color}; }
    .cursor { fill: ${color}; animation: blink 1s step-end infinite; }
    .clip { overflow: hidden; white-space: nowrap; animation: type ${duration}s steps(${charCount}, end) infinite alternate; }
  </style>
  <rect width="${w}" height="${h}" fill="transparent"/>
  <foreignObject x="10" y="12" width="${w - 20}" height="30">
    <div xmlns="http://www.w3.org/1999/xhtml" class="clip" style="font:600 18px ${esc(font)},monospace;color:${color}">
      ${esc(fullText)}<span class="cursor">|</span>
    </div>
  </foreignObject>
</svg>`;
}

// ─── GitHub stats card ──────────────────────────────────────────────────────

export function generateGitHubStatsSvg(data, cfg, style) {
  const t = theme(style);
  const { username, totalStars, publicRepos, followers, topLangs = [] } = data;
  const title = cfg.customTitle || `${username}'s GitHub Stats`;
  const w = 420, h = 200;
  const langs = topLangs.slice(0, 3).join(' · ') || '—';
  const totalContributions = cfg.totalContributions || 0;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" rx="10" fill="${t.card}" stroke="${t.accent}40" stroke-width="1"/>
  <text x="20" y="32" fill="${t.accent}" font-family="system-ui,sans-serif" font-size="14" font-weight="700">${esc(title)}</text>
  <text x="20" y="70" fill="${t.text}" font-family="system-ui,sans-serif" font-size="13">⭐ Total Stars</text>
  <text x="200" y="70" fill="${t.text}" font-family="system-ui,sans-serif" font-size="20" font-weight="700">${totalStars ?? 0}</text>
  <text x="20" y="100" fill="${t.text}" font-family="system-ui,sans-serif" font-size="13">📦 Repositories</text>
  <text x="200" y="100" fill="${t.text}" font-family="system-ui,sans-serif" font-size="20" font-weight="700">${publicRepos ?? 0}</text>
  <text x="20" y="130" fill="${t.text}" font-family="system-ui,sans-serif" font-size="13">👥 Followers</text>
  <text x="200" y="130" fill="${t.text}" font-family="system-ui,sans-serif" font-size="20" font-weight="700">${followers ?? 0}</text>
  <text x="20" y="160" fill="${t.text}" font-family="system-ui,sans-serif" font-size="13">📈 Contributions</text>
  <text x="200" y="160" fill="${t.text}" font-family="system-ui,sans-serif" font-size="20" font-weight="700">${totalContributions}</text>
  <text x="20" y="185" fill="${t.muted}" font-family="system-ui,sans-serif" font-size="11">Top: ${esc(langs)}</text>
  <circle cx="${w - 55}" cy="100" r="42" fill="none" stroke="${t.accent}" stroke-width="3" opacity=".3"/>
  <text x="${w - 55}" y="96" text-anchor="middle" fill="${t.accent}" font-family="system-ui,sans-serif" font-size="22" font-weight="800">A+</text>
  <text x="${w - 55}" y="114" text-anchor="middle" fill="${t.muted}" font-family="system-ui,sans-serif" font-size="9">GRADE</text>
</svg>`;
}

// ─── Language bar card ────────────────────────────────────────────────────────

export function generateLangStatsSvg(data, style) {
  const t = theme(style);
  const langs = data.topLangs || [];
  const w = 420, h = 180;
  const colors = ['#58a6ff', '#f78166', '#3fb950', '#d2a8ff', '#ffa657'];
  const total = langs.length || 1;

  let bars = '';
  let y = 55;
  langs.slice(0, 5).forEach((lang, i) => {
    const pct = Math.round(100 / total - i * 3);
    const bw = Math.max(20, (pct / 100) * 280);
    bars += `
  <text x="20" y="${y}" fill="${t.text}" font-family="monospace" font-size="11">${esc(lang)}</text>
  <rect x="120" y="${y - 10}" width="${bw}" height="12" rx="3" fill="${colors[i % colors.length]}"/>
  <text x="${120 + bw + 8}" y="${y}" fill="${t.muted}" font-family="monospace" font-size="10">${pct}%</text>`;
    y += 26;
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" rx="10" fill="${t.card}" stroke="${t.accent}40" stroke-width="1"/>
  <text x="20" y="32" fill="${t.accent}" font-family="system-ui,sans-serif" font-size="14" font-weight="700">Most Used Languages</text>
  ${bars || `<text x="20" y="80" fill="${t.muted}" font-size="12">No language data</text>`}
</svg>`;
}

// ─── Streak card ──────────────────────────────────────────────────────────────

export function generateStreakSvg(cfg, style) {
  const t = theme(style);
  const { current = 0, longest = 0, total = 0 } = cfg;
  const w = 420, h = 160;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" rx="10" fill="${t.card}" stroke="${t.accent}40" stroke-width="1"/>
  <text x="20" y="30" fill="${t.accent}" font-family="system-ui,sans-serif" font-size="14" font-weight="700">🔥 GitHub Streak</text>
  <text x="70" y="95" text-anchor="middle" fill="${t.text}" font-family="system-ui,sans-serif" font-size="28" font-weight="800">${current}</text>
  <text x="70" y="115" text-anchor="middle" fill="${t.muted}" font-family="system-ui,sans-serif" font-size="10">CURRENT</text>
  <text x="210" y="95" text-anchor="middle" fill="${t.text}" font-family="system-ui,sans-serif" font-size="28" font-weight="800">${longest}</text>
  <text x="210" y="115" text-anchor="middle" fill="${t.muted}" font-family="system-ui,sans-serif" font-size="10">LONGEST</text>
  <text x="350" y="95" text-anchor="middle" fill="${t.text}" font-family="system-ui,sans-serif" font-size="28" font-weight="800">${total}</text>
  <text x="350" y="115" text-anchor="middle" fill="${t.muted}" font-family="system-ui,sans-serif" font-size="10">TOTAL</text>
  <circle cx="70" cy="80" r="38" fill="none" stroke="${t.accent}" stroke-width="2" opacity=".4"/>
  <circle cx="210" cy="80" r="38" fill="none" stroke="#f78166" stroke-width="2" opacity=".4"/>
  <circle cx="350" cy="80" r="38" fill="none" stroke="#3fb950" stroke-width="2" opacity=".4"/>
</svg>`;
}

// ─── Trophy case ──────────────────────────────────────────────────────────────

export function generateTrophySvg(data, cfg, style) {
  const t = theme(style);
  const { totalStars = 0, publicRepos = 0 } = data;
  const trophies = [
    { icon: '⭐', label: 'Stars', value: totalStars, threshold: [1, 10, 50, 100] },
    { icon: '📦', label: 'Repos', value: publicRepos, threshold: [5, 10, 25, 50] },
    { icon: '🔀', label: 'PRs', value: cfg.prCount ?? 12, threshold: [5, 20, 50, 100] },
    { icon: '🐛', label: 'Issues', value: cfg.issueCount ?? 8, threshold: [5, 15, 30, 60] },
  ];

  const w = 520, h = 120;
  let cells = trophies.map((tr, i) => {
    const tier = tr.threshold.filter(th => tr.value >= th).length;
    const x = 20 + i * 125;
    const colors = ['#484f58', '#3fb950', '#58a6ff', '#d2a8ff', '#ffa657'];
    return `
  <rect x="${x}" y="40" width="110" height="65" rx="8" fill="${colors[tier]}" opacity="${tier ? .25 : .1}" stroke="${colors[tier]}" stroke-width="1"/>
  <text x="${x + 55}" y="68" text-anchor="middle" font-size="22">${tr.icon}</text>
  <text x="${x + 55}" y="88" text-anchor="middle" fill="${t.text}" font-family="system-ui,sans-serif" font-size="11" font-weight="600">${tr.value} ${tr.label}</text>
  <text x="${x + 55}" y="100" text-anchor="middle" fill="${t.muted}" font-family="system-ui,sans-serif" font-size="9">Tier ${tier || '—'}</text>`;
  }).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" rx="10" fill="${t.card}" stroke="${t.accent}40" stroke-width="1"/>
  <text x="20" y="28" fill="${t.accent}" font-family="system-ui,sans-serif" font-size="14" font-weight="700">🏆 Trophy Case</text>
  ${cells}
</svg>`;
}

// ─── PR stats ─────────────────────────────────────────────────────────────────

export function generatePRStatsSvg(cfg, style) {
  const t = theme(style);
  const { totalPRs = 0, merged = 0, reviewed = 0 } = cfg;
  const w = 420, h = 130;
  const mergeRate = totalPRs ? Math.round((merged / totalPRs) * 100) : 0;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" rx="10" fill="${t.card}" stroke="${t.accent}40" stroke-width="1"/>
  <text x="20" y="28" fill="${t.accent}" font-family="system-ui,sans-serif" font-size="14" font-weight="700">🔀 Pull Request Stats</text>
  <text x="20" y="65" fill="${t.text}" font-size="13">Opened: <tspan font-weight="700">${totalPRs}</tspan></text>
  <text x="20" y="88" fill="${t.text}" font-size="13">Merged: <tspan font-weight="700" fill="#3fb950">${merged}</tspan> (${mergeRate}%)</text>
  <text x="20" y="111" fill="${t.text}" font-size="13">Reviewed: <tspan font-weight="700">${reviewed}</tspan></text>
  <rect x="260" y="50" width="140" height="12" rx="6" fill="${t.bg}"/>
  <rect x="260" y="50" width="${mergeRate * 1.4}" height="12" rx="6" fill="#3fb950"/>
</svg>`;
}

// ─── LeetCode stats ───────────────────────────────────────────────────────────

export function generateLeetCodeSvg(cfg, style) {
  const t = theme(style);
  const { username = '', ranking = 0, easy = 0, medium = 0, hard = 0, total = 0 } = cfg;
  const w = 420, h = 160;
  const solved = total || easy + medium + hard;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" rx="10" fill="${t.card}" stroke="#FFA11640" stroke-width="1"/>
  <text x="20" y="28" fill="#FFA116" font-family="system-ui,sans-serif" font-size="14" font-weight="700">🧩 LeetCode${username ? ` — @${esc(username)}` : ''}</text>
  <text x="20" y="60" fill="${t.text}" font-size="13">Solved: <tspan font-weight="700" font-size="20">${solved}</tspan></text>
  <text x="20" y="90" fill="#00b8a3" font-size="12">Easy ${easy}</text>
  <text x="120" y="90" fill="#ffc01e" font-size="12">Medium ${medium}</text>
  <text x="240" y="90" fill="#ff375f" font-size="12">Hard ${hard}</text>
  ${ranking ? `<text x="20" y="120" fill="${t.muted}" font-size="11">Global Rank: #${ranking.toLocaleString()}</text>` : ''}
  <rect x="20" y="130" width="${Math.min(380, solved * 3)}" height="8" rx="4" fill="#FFA116" opacity=".7"/>
</svg>`;
}

// ─── Activity / contribution graph ────────────────────────────────────────────

function contributionFill(level, accent) {
  if (level === 0 || level === 'NONE') return '#161b22';
  if (level === 1 || level === 'FIRST_QUARTILE') return `${accent}30`;
  if (level === 2 || level === 'SECOND_QUARTILE') return `${accent}55`;
  if (level === 3 || level === 'THIRD_QUARTILE') return `${accent}88`;
  return accent;
}

export function generateActivityGraphSvg(cfg, style, seed = 42) {
  const t = theme(style);
  const { title = 'Contribution Activity', weeks = 52, contributionWeeks = [] } = cfg;
  const cell = 11, gap = 3;
  const cols = Math.min(weeks, 52);
  const rows = 7;
  const w = cols * (cell + gap) + 30;
  const h = rows * (cell + gap) + 50;

  let cells = '';
  let s = seed;
  const rand = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };

  if (contributionWeeks.length) {
    contributionWeeks.slice(-cols).forEach((week, col) => {
      (week.contributionDays || []).forEach((day, row) => {
        const x = 20 + col * (cell + gap);
        const y = 35 + row * (cell + gap);
        cells += `<rect x="${x}" y="${y}" width="${cell}" height="${cell}" rx="2" fill="${contributionFill(day.contributionLevel, t.accent)}"/>`;
      });
    });
  } else {
    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows; row++) {
        const level = Math.floor(rand() * 5);
        const x = 20 + col * (cell + gap);
        const y = 35 + row * (cell + gap);
        cells += `<rect x="${x}" y="${y}" width="${cell}" height="${cell}" rx="2" fill="${contributionFill(level, t.accent)}"/>`;
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" rx="10" fill="${t.card}" stroke="${t.accent}30" stroke-width="1"/>
  <text x="20" y="22" fill="${t.accent}" font-family="system-ui,sans-serif" font-size="13" font-weight="700">${esc(title)}</text>
  ${cells}
</svg>`;
}

// ─── Mood widget ──────────────────────────────────────────────────────────────

export function generateMoodSvg(cfg, style) {
  const t = theme(style);
  const { emoji = '💭', text = 'Vibing', color = t.accent } = cfg;
  const w = 360, h = 70;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" rx="12" fill="${t.card}" stroke="${color}50" stroke-width="1"/>
  <text x="24" y="44" font-size="28">${emoji}</text>
  <text x="68" y="30" fill="${t.muted}" font-family="system-ui,sans-serif" font-size="10">CURRENT MOOD</text>
  <text x="68" y="50" fill="${color}" font-family="system-ui,sans-serif" font-size="15" font-weight="600">${esc(text)}</text>
</svg>`;
}

// ─── Spotify widget ───────────────────────────────────────────────────────────

export function generateSpotifySvg(cfg, style) {
  const t = theme(style);
  const { track = 'Track', artist = 'Artist', albumArt, isPlaying = true } = cfg;
  const w = 400, h = 90;

  const art = albumArt
    ? `<image href="${esc(albumArt)}" x="16" y="16" width="58" height="58" rx="6"/>`
    : `<rect x="16" y="16" width="58" height="58" rx="6" fill="#1DB954"/><text x="45" y="52" text-anchor="middle" fill="#fff" font-size="24">♫</text>`;

  const bars = isPlaying
    ? [14, 22, 18, 26, 16].map((bh, i) =>
      `<rect x="${330 + i * 8}" y="${45 - bh/2}" width="4" height="${bh}" rx="2" fill="#1DB954"><animate attributeName="height" values="${bh};${bh + 8};${bh}" dur="${.4 + i * .1}s" repeatCount="indefinite"/><animate attributeName="y" values="${45 - bh/2};${45 - (bh+8)/2};${45 - bh/2}" dur="${.4 + i * .1}s" repeatCount="indefinite"/></rect>`
    ).join('')
    : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" rx="12" fill="${t.card}" stroke="#1DB95440" stroke-width="1"/>
  ${art}
  <text x="88" y="38" fill="#1DB954" font-family="system-ui,sans-serif" font-size="10" font-weight="600">${isPlaying ? 'NOW PLAYING' : 'LAST PLAYED'}</text>
  <text x="88" y="56" fill="${t.text}" font-family="system-ui,sans-serif" font-size="14" font-weight="600">${esc(track)}</text>
  <text x="88" y="72" fill="${t.muted}" font-family="system-ui,sans-serif" font-size="11">${esc(artist)}</text>
  ${bars}
</svg>`;
}

// ─── Focus widget ─────────────────────────────────────────────────────────────

export function generateFocusSvg(cfg, style) {
  const t = theme(style);
  const { building = '', learning = '' } = cfg;
  const w = 420, h = 100;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" rx="12" fill="${t.card}" stroke="${t.accent}40" stroke-width="1"/>
  <text x="20" y="28" fill="${t.accent}" font-family="system-ui,sans-serif" font-size="13" font-weight="700">🎯 Current Focus</text>
  <text x="20" y="55" fill="${t.text}" font-family="system-ui,sans-serif" font-size="12">🔨 Building: <tspan font-weight="600">${esc(building)}</tspan></text>
  <text x="20" y="78" fill="${t.text}" font-family="system-ui,sans-serif" font-size="12">📚 Learning: <tspan font-weight="600">${esc(learning)}</tspan></text>
</svg>`;
}

// ─── ASCII presets ────────────────────────────────────────────────────────────

export const ASCII_PRESETS = {
  cat: ` /\\_/\\ \n( o.o )\n > ^ <`,
  heart: `  ♥♥♥   ♥♥♥\n ♥♥♥♥♥ ♥♥♥♥♥\n  ♥♥♥♥♥♥♥\n   ♥♥♥♥♥\n    ♥♥♥\n     ♥`,
  code: `  { }</>\n  /code\\`,
  rocket: `    /\\\n   /  \\\n  |    |\n  | 🚀 |\n /|    |\\\n/ |    | \\`,
  coffee: `  ( (\n   ) )\n ........\n |      |]\n \\      /\n  ------`,
};

export function generateAsciiBlock(cfg) {
  const text = cfg.custom?.trim() || ASCII_PRESETS[cfg.preset] || ASCII_PRESETS.cat;
  return '```\n' + text + '\n```';
}

// ─── Tech stack markdown ──────────────────────────────────────────────────────

export function generateTechStackMarkdown(cfg) {
  const { icons = [], layout = 'row' } = cfg;
  if (!icons.length) return '<!-- Add tech stack icons -->';
  const items = icons.map(ic =>
    `<img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/${ic.slug}.svg" height="40" alt="${ic.name}" title="${ic.name}"/>`
  );
  if (layout === 'grid') {
    return `<p align="center">\n${items.join(' ')}\n</p>`;
  }
  return `<p align="center">\n${items.join('\n')}\n</p>`;
}

// ─── Social links markdown ────────────────────────────────────────────────────

export function generateSocialMarkdown(cfg) {
  const { links = [] } = cfg;
  if (!links.length) return '';
  const items = links.filter(l => l.url).map(l => {
    const plat = SOCIAL_PLATFORMS.find(p => p.id === l.platform);
    const slug = plat?.slug || l.platform;
    return `<a href="${esc(l.url)}"><img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/${slug}.svg" height="32" alt="${esc(l.platform)}"/></a>`;
  });
  return `<p align="center">\n${items.join('&nbsp;&nbsp;')}\n</p>`;
}

// ─── Block → SVG dispatcher ───────────────────────────────────────────────────

export function renderBlockSvg(block, githubData, style) {
  const { type, config } = block;
  switch (type) {
    case 'header': return generateHeaderSvg(config, style);
    case 'typing': return generateTypingSvg(config, style);
    case 'github-stats': return generateGitHubStatsSvg(githubData, config, style);
    case 'lang-stats': return generateLangStatsSvg(githubData, style);
    case 'streak': return generateStreakSvg(config, style);
    case 'trophies': return generateTrophySvg(githubData, config, style);
    case 'pr-stats': return generatePRStatsSvg(config, style);
    case 'leetcode-stats': return generateLeetCodeSvg(config, style);
    case 'activity-graph': return generateActivityGraphSvg(config, style, githubData.username?.length || 42);
    case 'mood': return generateMoodSvg(config, style);
    case 'spotify': return generateSpotifySvg(config, style);
    case 'focus': return generateFocusSvg(config, style);
    default: return null;
  }
}

export function svgToDataUrl(svg) {
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
}
