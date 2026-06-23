export const BLOCK_CATALOG = [
  { type: 'header', label: 'Header Banner', icon: '🎨', category: 'headers' },
  { type: 'typing', label: 'Typing Animation', icon: '⌨', category: 'headers' },
  { type: 'ascii', label: 'ASCII Art', icon: '📝', category: 'headers' },
  { type: 'pixel-avatar', label: 'Pixel Avatar', icon: '👾', category: 'headers' },
  { type: 'tech-stack', label: 'Tech Stack', icon: '🛠', category: 'stack' },
  { type: 'github-stats', label: 'GitHub Stats', icon: '📊', category: 'stats' },
  { type: 'lang-stats', label: 'Top Languages', icon: '📊', category: 'stats' },
  { type: 'leetcode-stats', label: 'LeetCode Stats', icon: '🧩', category: 'stats' },
  { type: 'streak', label: 'Streak Counter', icon: '🔥', category: 'stats' },
  { type: 'trophies', label: 'Trophy Case', icon: '🏆', category: 'stats' },
  { type: 'pr-stats', label: 'PR Stats', icon: '🔀', category: 'stats' },
  { type: 'activity-graph', label: 'Contribution Graph', icon: '📈', category: 'stats' },
  { type: 'social-links', label: 'Social Links', icon: '🔗', category: 'social' },
  { type: 'mood', label: 'Mood / Status', icon: '💭', category: 'widgets' },
  { type: 'spotify', label: 'Spotify Now Playing', icon: '🎵', category: 'widgets' },
  { type: 'focus', label: 'Current Focus', icon: '🎯', category: 'widgets' },
  { type: 'divider', label: 'Divider', icon: '—', category: 'layout' },
  { type: 'text', label: 'Text Block', icon: '¶', category: 'layout' },
];

export const STYLE_PRESETS = [
  { id: 'midnight', name: 'Midnight', bg: '#0d1117', card: '#161b22', accent: '#58a6ff', text: '#c9d1d9', muted: '#8b949e' },
  { id: 'radical', name: 'Radical', bg: '#141321', card: '#1c1b2e', accent: '#fe428e', text: '#e2e8f0', muted: '#a78bfa' },
  { id: 'matrix', name: 'Matrix', bg: '#0d0d0d', card: '#111811', accent: '#00ff41', text: '#00ff41', muted: '#00cc33' },
  { id: 'synthwave', name: 'Synthwave', bg: '#2b213a', card: '#34294a', accent: '#e2ad5f', text: '#e2e8f0', muted: '#ff71ce' },
  { id: 'dracula', name: 'Dracula', bg: '#282a36', card: '#313341', accent: '#bd93f9', text: '#f8f8f2', muted: '#6272a4' },
  { id: 'nord', name: 'Nord', bg: '#2e3440', card: '#3b4252', accent: '#88c0d0', text: '#eceff4', muted: '#81a1c1' },
  { id: 'rose', name: 'Rosé', bg: '#1a1020', card: '#241530', accent: '#f472b6', text: '#fce7f3', muted: '#e879a0' },
  { id: 'ocean', name: 'Ocean', bg: '#0a1628', card: '#0f1f38', accent: '#38bdf8', text: '#e0f2fe', muted: '#7dd3fc' },
];

export function createBlockId() {
  return `blk_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export function createDefaultBlock(type, githubData = {}) {
  const base = { id: createBlockId(), type };
  const name = githubData.name || 'Your Name';
  const username = githubData.username || 'username';

  switch (type) {
    case 'header':
      return { ...base, config: { style: 'wave', title: name, subtitle: githubData.bio || 'Developer', imageUrl: '', colors: ['#9d5cf5', '#e879a0'] } };
    case 'typing':
      return { ...base, config: { lines: [`Hi, I'm ${name}`, 'Building cool things', 'Open to collaborate'], color: '#58a6ff', font: 'Fira Code', speed: 80 } };
    case 'ascii':
      return { ...base, config: { preset: 'cat', custom: '' } };
    case 'pixel-avatar':
      return { ...base, config: { sourceUrl: githubData.avatar || '', pixelSize: 8, borderColor: '#58a6ff' } };
    case 'tech-stack':
      return { ...base, config: { icons: [], layout: 'row', size: 40 } };
    case 'github-stats':
      return { ...base, config: { showIcons: true, hideRank: false, customTitle: `${name}'s GitHub Stats`, githubToken: '', totalContributions: 0 } };
    case 'lang-stats':
      return { ...base, config: {} };
    case 'leetcode-stats':
      return { ...base, config: { username: username, ranking: 0, easy: 0, medium: 0, hard: 0, total: 0 } };
    case 'streak':
      return { ...base, config: { current: 12, longest: 45, total: 320, githubToken: '' } };
    case 'trophies':
      return { ...base, config: { showStars: true, showCommits: true, showPRs: true, showIssues: true, githubToken: '', prCount: 12, issueCount: 8 } };
    case 'pr-stats':
      return { ...base, config: { totalPRs: 24, merged: 18, reviewed: 42, githubToken: '' } };
    case 'activity-graph':
      return { ...base, config: { title: 'Contribution Activity', weeks: 52, githubToken: '', contributionWeeks: [], totalContributions: 0 } };
    case 'social-links':
      return { ...base, config: { links: [{ platform: 'github', url: `https://github.com/${username}` }] } };
    case 'mood':
      return { ...base, config: { emoji: '☕', text: 'Coding & vibing', color: '#a78bfa' } };
    case 'spotify':
      return { ...base, config: { track: 'Song Title', artist: 'Artist Name', albumArt: '', isPlaying: true, spotifyClientId: '' } };
    case 'focus':
      return { ...base, config: { building: 'an awesome side project', learning: 'Rust & systems design' } };
    case 'divider':
      return { ...base, config: { style: 'dots', color: '#58a6ff' } };
    case 'text':
      return { ...base, config: { content: '## About Me\n\nWrite something about yourself here.', align: 'center' } };
    default:
      return { ...base, config: {} };
  }
}

export function createDefaultProfile(githubData) {
  return {
    style: STYLE_PRESETS[0],
    blocks: [
      createDefaultBlock('header', githubData),
      createDefaultBlock('typing', githubData),
      createDefaultBlock('tech-stack', githubData),
      createDefaultBlock('social-links', githubData),
      createDefaultBlock('github-stats', githubData),
      createDefaultBlock('streak', githubData),
      createDefaultBlock('activity-graph', githubData),
      createDefaultBlock('focus', githubData),
    ],
  };
}
