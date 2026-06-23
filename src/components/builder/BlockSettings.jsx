import { ASCII_PRESETS } from '../../builder/svgGenerators';
import { SOCIAL_PLATFORMS } from '../../data/socialPlatforms';
import { TECH_ICONS } from '../../data/techIcons';

export default function BlockSettings({
  block,
  onUpdate,
  githubData,
  onFetchLeetCode,
  onFetchGitHubMetrics,
  onSpotifyConnect,
  onSpotifyRefresh,
  onSpotifyDisconnect,
  loadingAction,
}) {
  if (!block) {
    return (
      <div style={{ padding: 20, color: 'var(--t3)', fontFamily: 'var(--sans)', fontSize: 12, textAlign: 'center' }}>
        Select a block to edit its settings
      </div>
    );
  }

  const set = (key, val) => onUpdate({ ...block, config: { ...block.config, [key]: val } });

  const field = (label, children) => (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--t3)', marginBottom: 5, fontWeight: 500 }}>
        {label}
      </label>
      {children}
    </div>
  );

  const inp = (key, placeholder = '') => (
    <input className="inp inp-sm" value={block.config[key] ?? ''}
      placeholder={placeholder}
      onChange={e => set(key, e.target.value)} style={{ width: '100%' }} />
  );

  const num = (key) => (
    <input type="number" className="inp inp-sm" value={block.config[key] ?? 0}
      onChange={e => set(key, Number(e.target.value))} style={{ width: '100%' }} />
  );

  const { type, config } = block;
  const githubBusy = loadingAction === `github:${block.id}`;
  const leetcodeBusy = loadingAction === `leetcode:${block.id}`;
  const spotifyConnectBusy = loadingAction === `spotify-connect:${block.id}`;
  const spotifyRefreshBusy = loadingAction === `spotify-refresh:${block.id}`;

  return (
    <div style={{ padding: '14px 16px', overflowY: 'auto', flex: 1 }}>
      <h3 style={{ fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 600, color: 'var(--t1)', marginBottom: 14, textTransform: 'capitalize' }}>
        {type.replace(/-/g, ' ')} Settings
      </h3>

      {type === 'header' && (
        <>
          {field('Title', inp('title'))}
          {field('Subtitle', inp('subtitle'))}
          {field('Style', (
            <select className="sel" value={config.style} onChange={e => set('style', e.target.value)} style={{ width: '100%' }}>
              {['wave', 'gradient', 'pixel', 'minimal'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          ))}
          {field('Custom image URL (optional)', inp('imageUrl', 'https://...'))}
          {field('Gradient colors', (
            <div style={{ display: 'flex', gap: 8 }}>
              <input type="color" value={config.colors?.[0] || '#9d5cf5'}
                onChange={e => set('colors', [e.target.value, config.colors?.[1] || '#e879a0'])} />
              <input type="color" value={config.colors?.[1] || '#e879a0'}
                onChange={e => set('colors', [config.colors?.[0] || '#9d5cf5', e.target.value])} />
            </div>
          ))}
        </>
      )}

      {type === 'typing' && (
        <>
          {field('Lines (one per line)', (
            <textarea className="inp" rows={4} style={{ width: '100%', fontFamily: 'var(--sans)', fontSize: 12, resize: 'vertical' }}
              value={(config.lines || []).join('\n')}
              onChange={e => set('lines', e.target.value.split('\n').filter(Boolean))} />
          ))}
          {field('Color', <input type="color" value={config.color} onChange={e => set('color', e.target.value)} />)}
          {field('Speed (ms/char)', num('speed'))}
        </>
      )}

      {type === 'ascii' && (
        <>
          {field('Preset', (
            <select className="sel" value={config.preset} onChange={e => set('preset', e.target.value)} style={{ width: '100%' }}>
              {Object.keys(ASCII_PRESETS).map(k => <option key={k} value={k}>{k}</option>)}
            </select>
          ))}
          {field('Custom ASCII', (
            <textarea className="inp" rows={5} style={{ width: '100%', fontFamily: 'var(--mono)', fontSize: 11 }}
              value={config.custom || ''} onChange={e => set('custom', e.target.value)}
              placeholder="Paste your own ASCII art…" />
          ))}
        </>
      )}

      {type === 'pixel-avatar' && (
        <>
          {field('Image URL', inp('sourceUrl', githubData?.avatar || 'https://...'))}
          {field('Upload image', (
            <input type="file" accept="image/*" onChange={e => {
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () => set('sourceUrl', reader.result);
              reader.readAsDataURL(file);
            }} style={{ fontSize: 11, color: 'var(--t2)' }} />
          ))}
          {field('Border color', <input type="color" value={config.borderColor} onChange={e => set('borderColor', e.target.value)} />)}
          {field('Pixel size', num('pixelSize'))}
        </>
      )}

      {type === 'tech-stack' && (
        <>
          {field('Icon size', num('size'))}
          {field('Layout', (
            <select className="sel" value={config.layout} onChange={e => set('layout', e.target.value)} style={{ width: '100%' }}>
              <option value="row">Row</option>
              <option value="grid">Grid</option>
            </select>
          ))}
          {field(`Selected (${config.icons?.length || 0})`, (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {(config.icons || []).map(ic => (
                <button key={ic.id} onClick={() => set('icons', config.icons.filter(i => i.id !== ic.id))}
                  style={{ padding: '4px 8px', borderRadius: 6, fontSize: 10, cursor: 'pointer',
                    background: 'var(--surf)', border: '1px solid var(--border)', color: 'var(--t2)' }}>
                  {ic.name} ✕
                </button>
              ))}
            </div>
          ))}
          {field('Add icon', (
            <select className="sel" defaultValue="" onChange={e => {
              const tech = TECH_ICONS.find(t => t.id === e.target.value);
              if (tech && !config.icons?.find(i => i.id === tech.id)) {
                set('icons', [...(config.icons || []), tech]);
              }
              e.target.value = '';
            }} style={{ width: '100%' }}>
              <option value="">Choose technology…</option>
              {TECH_ICONS.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          ))}
        </>
      )}

      {type === 'social-links' && (
        <>
          {(config.links || []).map((link, i) => (
            <div key={i} style={{ marginBottom: 12, padding: 10, background: 'var(--surf)', borderRadius: 8, border: '1px solid var(--border)' }}>
              <select className="sel" value={link.platform}
                onChange={e => {
                  const links = [...config.links];
                  links[i] = { ...links[i], platform: e.target.value };
                  set('links', links);
                }} style={{ width: '100%', marginBottom: 6 }}>
                {SOCIAL_PLATFORMS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <input className="inp inp-sm" value={link.url || ''} placeholder="https://..."
                onChange={e => {
                  const links = [...config.links];
                  links[i] = { ...links[i], url: e.target.value };
                  set('links', links);
                }} style={{ width: '100%' }} />
              <button onClick={() => set('links', config.links.filter((_, j) => j !== i))}
                style={{ marginTop: 6, fontSize: 10, color: 'var(--a1)', background: 'none', border: 'none', cursor: 'pointer' }}>
                Remove
              </button>
            </div>
          ))}
          <button className="btn btn-ghost" style={{ width: '100%', fontSize: 12 }}
            onClick={() => set('links', [...(config.links || []), { platform: 'linkedin', url: '' }])}>
            + Add social link
          </button>
        </>
      )}

      {type === 'github-stats' && (
        <>
          {field('Card title', inp('customTitle'))}
          {field('GitHub token', inp('githubToken', 'ghp_...'))}
          <button className="btn btn-ghost" style={{ width: '100%', fontSize: 12 }}
            onClick={() => onFetchGitHubMetrics(block)} disabled={githubBusy}>
            {githubBusy ? 'Fetching GitHub…' : 'Fetch live GitHub data'}
          </button>
        </>
      )}

      {type === 'leetcode-stats' && (
        <>
          {field('LeetCode username', inp('username'))}
          {field('Ranking', num('ranking'))}
          {field('Easy solved', num('easy'))}
          {field('Medium solved', num('medium'))}
          {field('Hard solved', num('hard'))}
          <button className="btn btn-ghost" style={{ width: '100%', fontSize: 12 }}
            onClick={() => onFetchLeetCode(block)} disabled={leetcodeBusy}>
            {leetcodeBusy ? 'Fetching LeetCode…' : 'Fetch from LeetCode'}
          </button>
        </>
      )}

      {type === 'streak' && (
        <>
          {field('GitHub token', inp('githubToken', 'ghp_...'))}
          {field('Current streak', num('current'))}
          {field('Longest streak', num('longest'))}
          {field('Total contributions', num('total'))}
          <button className="btn btn-ghost" style={{ width: '100%', fontSize: 12 }}
            onClick={() => onFetchGitHubMetrics(block)} disabled={githubBusy}>
            {githubBusy ? 'Fetching GitHub…' : 'Fetch live GitHub data'}
          </button>
        </>
      )}

      {type === 'pr-stats' && (
        <>
          {field('GitHub token', inp('githubToken', 'ghp_...'))}
          {field('Total PRs', num('totalPRs'))}
          {field('Merged', num('merged'))}
          {field('Reviewed', num('reviewed'))}
          <button className="btn btn-ghost" style={{ width: '100%', fontSize: 12 }}
            onClick={() => onFetchGitHubMetrics(block)} disabled={githubBusy}>
            {githubBusy ? 'Fetching GitHub…' : 'Fetch live GitHub data'}
          </button>
        </>
      )}

      {type === 'activity-graph' && (
        <>
          {field('Title', inp('title'))}
          {field('GitHub token', inp('githubToken', 'ghp_...'))}
          <button className="btn btn-ghost" style={{ width: '100%', fontSize: 12 }}
            onClick={() => onFetchGitHubMetrics(block)} disabled={githubBusy}>
            {githubBusy ? 'Fetching GitHub…' : 'Fetch live contributions'}
          </button>
        </>
      )}

      {type === 'trophies' && (
        <>
          {field('GitHub token', inp('githubToken', 'ghp_...'))}
          {field('PR count', num('prCount'))}
          {field('Issue count', num('issueCount'))}
          <button className="btn btn-ghost" style={{ width: '100%', fontSize: 12 }}
            onClick={() => onFetchGitHubMetrics(block)} disabled={githubBusy}>
            {githubBusy ? 'Fetching GitHub…' : 'Fetch live GitHub data'}
          </button>
        </>
      )}

      {type === 'mood' && (
        <>
          {field('Emoji', inp('emoji'))}
          {field('Status text', inp('text'))}
          {field('Color', <input type="color" value={config.color} onChange={e => set('color', e.target.value)} />)}
        </>
      )}

      {type === 'spotify' && (
        <>
          {field('Spotify client ID', inp('spotifyClientId', 'Spotify app client id'))}
          {field('Track name', inp('track'))}
          {field('Artist', inp('artist'))}
          {field('Album art URL', inp('albumArt', 'https://...'))}
          {field('Now playing', (
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--t2)' }}>
              <input type="checkbox" checked={config.isPlaying}
                onChange={e => set('isPlaying', e.target.checked)} />
              Show as currently playing
            </label>
          ))}
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-ghost" style={{ flex: 1, fontSize: 12 }}
              onClick={() => onSpotifyConnect(block)} disabled={spotifyConnectBusy}>
              {spotifyConnectBusy ? 'Connecting…' : 'Connect Spotify'}
            </button>
            <button className="btn btn-ghost" style={{ flex: 1, fontSize: 12 }}
              onClick={() => onSpotifyRefresh(block)} disabled={spotifyRefreshBusy}>
              {spotifyRefreshBusy ? 'Refreshing…' : 'Refresh'}
            </button>
          </div>
          <button className="btn btn-ghost" style={{ width: '100%', fontSize: 12, marginTop: 8 }}
            onClick={onSpotifyDisconnect}>
            Disconnect Spotify
          </button>
        </>
      )}

      {type === 'focus' && (
        <>
          {field('Building', inp('building', 'an awesome project'))}
          {field('Learning', inp('learning', 'something new'))}
        </>
      )}

      {type === 'divider' && (
        field('Style', (
          <select className="sel" value={config.style} onChange={e => set('style', e.target.value)} style={{ width: '100%' }}>
            <option value="dots">Dots</option>
            <option value="stars">Stars</option>
            <option value="line">Line</option>
          </select>
        ))
      )}

      {type === 'text' && (
        <>
          {field('Content (markdown)', (
            <textarea className="inp" rows={6} style={{ width: '100%', fontFamily: 'var(--mono)', fontSize: 11, resize: 'vertical' }}
              value={config.content || ''} onChange={e => set('content', e.target.value)} />
          ))}
          {field('Alignment', (
            <select className="sel" value={config.align} onChange={e => set('align', e.target.value)} style={{ width: '100%' }}>
              <option value="center">Center</option>
              <option value="left">Left</option>
            </select>
          ))}
        </>
      )}
    </div>
  );
}
