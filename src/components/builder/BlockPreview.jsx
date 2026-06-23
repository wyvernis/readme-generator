import {
  renderBlockSvg, svgToDataUrl, ASCII_PRESETS,
} from '../../builder/svgGenerators';
import { techIconUrl } from '../../data/techIcons';
import { socialIconUrl, SOCIAL_PLATFORMS } from '../../data/socialPlatforms';

export default function BlockPreview({ block, profile, githubData }) {
  const { type, config } = block;
  const style = profile.style;

  switch (type) {
    case 'header':
    case 'typing':
    case 'github-stats':
    case 'lang-stats':
    case 'streak':
    case 'trophies':
    case 'pr-stats':
    case 'leetcode-stats':
    case 'activity-graph':
    case 'mood':
    case 'spotify':
    case 'focus': {
      const svg = renderBlockSvg(block, githubData, style);
      return svg ? (
        <img src={svgToDataUrl(svg)} alt={type} style={{ width: '100%', borderRadius: 8, display: 'block' }} />
      ) : null;
    }

    case 'ascii':
      return (
        <pre style={{
          fontFamily: 'var(--mono)', fontSize: 12, color: style.text,
          textAlign: 'center', margin: 0, lineHeight: 1.4, whiteSpace: 'pre',
        }}>
          {config.custom?.trim() || ASCII_PRESETS[config.preset] || ASCII_PRESETS.cat}
        </pre>
      );

    case 'tech-stack':
      return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', padding: '8px 0' }}>
          {config.icons?.length ? config.icons.map(ic => (
            <div key={ic.id} title={ic.name} style={{
              width: config.size || 40, height: config.size || 40,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: `${style.accent}15`, borderRadius: 8,
              border: `1px solid ${style.accent}30`,
            }}>
              <img src={techIconUrl(ic.slug)} alt={ic.name}
                style={{ width: '60%', height: '60%', filter: 'invert(1) brightness(1.6)' }} />
            </div>
          )) : (
            <span style={{ fontFamily: 'var(--sans)', fontSize: 12, color: style.muted }}>
              Click tech icons in sidebar → Icons tab
            </span>
          )}
        </div>
      );

    case 'social-links':
      return (
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', padding: '8px 0' }}>
          {config.links?.filter(l => l.url).map((link, i) => {
            const plat = SOCIAL_PLATFORMS.find(p => p.id === link.platform) || { slug: link.platform };
            return (
              <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                onClick={e => e.preventDefault()}
                style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: `${style.accent}18`, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  border: `1px solid ${style.accent}30`,
                }}>
                <img src={socialIconUrl(plat.slug)} alt={link.platform}
                  style={{ width: 20, height: 20, filter: 'invert(1) brightness(1.6)' }} />
              </a>
            );
          })}
        </div>
      );

    case 'pixel-avatar':
      return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {config.sourceUrl ? (
            <img src={config.sourceUrl} alt="avatar"
              style={{
                width: 96, height: 96, imageRendering: 'pixelated',
                border: `3px solid ${config.borderColor || style.accent}`,
                borderRadius: 8,
              }} />
          ) : (
            <div style={{
              width: 96, height: 96, borderRadius: 8,
              background: style.bg, border: `2px dashed ${style.muted}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--sans)', fontSize: 11, color: style.muted,
            }}>Upload avatar</div>
          )}
        </div>
      );

    case 'divider':
      return (
        <div style={{ textAlign: 'center', color: style.accent, opacity: .6, padding: '4px 0', letterSpacing: 4 }}>
          {config.style === 'line' ? <hr style={{ border: 'none', borderTop: `1px solid ${style.accent}40` }} /> :
            config.style === 'stars' ? '✦ ✦ ✦' : '· · · · ·'}
        </div>
      );

    case 'text':
      return (
        <div style={{
          fontFamily: 'var(--sans)', fontSize: 13, color: style.text,
          textAlign: config.align || 'center', lineHeight: 1.6, whiteSpace: 'pre-wrap',
        }}>
          {config.content}
        </div>
      );

    default:
      return null;
  }
}
