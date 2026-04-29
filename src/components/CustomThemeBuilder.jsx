import { useState } from 'react';
import { motion } from 'framer-motion';

// Google Fonts list (curated for README aesthetics)
const FONT_OPTIONS = [
  { value: 'Inter', label: 'Inter', category: 'sans-serif' },
  { value: 'Syne', label: 'Syne', category: 'sans-serif' },
  { value: 'Space+Grotesk', label: 'Space Grotesk', category: 'sans-serif' },
  { value: 'Outfit', label: 'Outfit', category: 'sans-serif' },
  { value: 'Plus+Jakarta+Sans', label: 'Plus Jakarta Sans', category: 'sans-serif' },
  { value: 'DM+Sans', label: 'DM Sans', category: 'sans-serif' },
  { value: 'Nunito', label: 'Nunito', category: 'sans-serif' },
  { value: 'Playfair+Display', label: 'Playfair Display', category: 'serif' },
  { value: 'Cormorant+Garamond', label: 'Cormorant Garamond', category: 'serif' },
  { value: 'Lora', label: 'Lora', category: 'serif' },
  { value: 'Merriweather', label: 'Merriweather', category: 'serif' },
  { value: 'Space+Mono', label: 'Space Mono', category: 'mono' },
  { value: 'JetBrains+Mono', label: 'JetBrains Mono', category: 'mono' },
  { value: 'Fira+Code', label: 'Fira Code', category: 'mono' },
  { value: 'Source+Code+Pro', label: 'Source Code Pro', category: 'mono' },
  { value: 'Press+Start+2P', label: 'Press Start 2P', category: 'display' },
  { value: 'Pacifico', label: 'Pacifico', category: 'display' },
  { value: 'Righteous', label: 'Righteous', category: 'display' },
  { value: 'Caveat', label: 'Caveat', category: 'handwriting' },
  { value: 'Dancing+Script', label: 'Dancing Script', category: 'handwriting' },
];

const BADGE_STYLES = [
  { value: 'flat', label: 'Flat' },
  { value: 'flat-square', label: 'Flat Square' },
  { value: 'for-the-badge', label: 'Big Badge' },
  { value: 'plastic', label: 'Plastic' },
  { value: 'social', label: 'Social' },
];

const HEADER_STYLES = [
  { value: 'wave', label: 'Wave' },
  { value: 'rect', label: 'Banner' },
  { value: 'soft', label: 'Soft' },
  { value: 'cylinder', label: 'Cylinder' },
  { value: 'venom', label: 'Venom' },
  { value: 'none', label: 'No header' },
];

const STAT_THEMES = [
  { value: 'dark', label: 'Dark' },
  { value: 'radical', label: 'Radical' },
  { value: 'tokyonight', label: 'Tokyo Night' },
  { value: 'synthwave', label: 'Synthwave' },
  { value: 'rose_pine', label: 'Rosé Pine' },
  { value: 'dracula', label: 'Dracula' },
  { value: 'nord', label: 'Nord' },
  { value: 'catppuccin_mocha', label: 'Catppuccin' },
  { value: 'default', label: 'Light' },
  { value: 'buefy', label: 'Buefy' },
];

const LAYOUT_OPTIONS = [
  { value: 'centered', label: 'Centered' },
  { value: 'left', label: 'Left-aligned' },
];

const SECTION_OPTIONS = [
  { key: 'header', label: 'Header banner' },
  { key: 'bio', label: 'About / Bio' },
  { key: 'stats', label: 'GitHub stats' },
  { key: 'langs', label: 'Top languages' },
  { key: 'streak', label: 'Streak counter' },
  { key: 'repos', label: 'Pinned repos' },
  { key: 'activity', label: 'Activity graph' },
  { key: 'badges', label: 'Tech badges' },
];

const DEFAULT_CONFIG = {
  primaryColor:   '#e879a0',
  secondaryColor: '#9d5cf5',
  accentColor:    '#36b9f5',
  bgColor:        '#0d0d1a',
  textColor:      '#ffffff',
  font:           'Syne',
  badgeStyle:     'flat-square',
  headerStyle:    'wave',
  statTheme:      'radical',
  layout:         'centered',
  tagline:        '',
  sections: {
    header: true, bio: true, stats: true, langs: true,
    streak: true, repos: true, activity: false, badges: true,
  },
};

export default function CustomThemeBuilder({ githubData, onClose, onApply }) {
  const [cfg, setCfg] = useState(DEFAULT_CONFIG);
  const [activeSection, setActiveSection] = useState('colors');
  const [previewMode, setPreviewMode] = useState(false);

  const update = (key, val) => setCfg(prev => ({ ...prev, [key]: val }));
  const updateSection = (key, val) =>
    setCfg(prev => ({ ...prev, sections: { ...prev.sections, [key]: val } }));

  const buildTheme = () => ({
    id: 'custom',
    name: 'Custom',
    emoji: '✦',
    desc: 'Your custom design',
    colors: [cfg.primaryColor, cfg.secondaryColor, cfg.accentColor],
    tags: ['custom'],
    generate: (data) => generateCustomReadme(data, cfg),
  });

  const handleApply = () => onApply(buildTheme());

  const TABS = [
    { id: 'colors',     label: 'Colors',     icon: '🎨' },
    { id: 'typography', label: 'Typography',  icon: '✍' },
    { id: 'layout',     label: 'Layout',      icon: '⊞' },
    { id: 'components', label: 'Components',  icon: '⚙' },
    { id: 'sections',   label: 'Sections',    icon: '☰' },
  ];

  // Live mini preview badge
  const previewBadge = `![badge](https://img.shields.io/badge/hello-world-${cfg.primaryColor.replace('#','')}.svg?style=${cfg.badgeStyle})`;

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,.65)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, scale: .96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: .96, y: 20 }}
        transition={{ duration: .3, ease: [.22, 1, .36, 1] }}
        style={{
          width: '100%', maxWidth: 740,
          maxHeight: '90svh',
          background: 'var(--bg2)', border: '1px solid var(--border2)',
          borderRadius: 20, overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
          boxShadow: '0 32px 80px rgba(0,0,0,.5)',
        }}
      >
        {/* Modal header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 20px', borderBottom: '1px solid var(--border)',
          background: 'var(--bg3)', flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: `linear-gradient(135deg, ${cfg.primaryColor}, ${cfg.secondaryColor})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
              transition: 'background .3s',
            }}>✦</div>
            <div>
              <div style={{ fontFamily: 'var(--sans)', fontWeight: 600, fontSize: 14, color: 'var(--t1)' }}>
                Custom Theme Builder
              </div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 10.5, color: 'var(--t3)' }}>
                for @{githubData.username}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={onClose} className="btn btn-ghost" style={{ fontSize: 12, padding: '5px 10px' }}>
              Cancel
            </button>
            <button onClick={handleApply} className="btn btn-primary" style={{ fontSize: 12.5, padding: '6px 16px' }}>
              Generate README →
            </button>
          </div>
        </div>

        {/* Tab bar */}
        <div style={{
          display: 'flex', gap: 2, padding: '10px 16px 0',
          borderBottom: '1px solid var(--border)', flexShrink: 0,
          background: 'var(--bg2)', overflowX: 'auto',
        }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setActiveSection(t.id)}
              style={{
                padding: '7px 13px 9px', borderRadius: '8px 8px 0 0',
                fontFamily: 'var(--sans)', fontSize: 12.5, fontWeight: 500,
                cursor: 'pointer', border: 'none', gap: 5,
                display: 'flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap',
                background: activeSection === t.id ? 'var(--bg)' : 'transparent',
                color: activeSection === t.id ? 'var(--t1)' : 'var(--t3)',
                borderBottom: activeSection === t.id
                  ? '2px solid var(--a2)'
                  : '2px solid transparent',
                transition: 'all .15s',
                marginBottom: -1,
              }}>
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', gap: 20 }}>

          {/* Left: form */}
          <div style={{ flex: 1, minWidth: 0 }}>

            {/* COLORS */}
            {activeSection === 'colors' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <SectionTitle>Color Palette</SectionTitle>
                <p style={{ fontFamily: 'var(--sans)', fontSize: 12.5, color: 'var(--t3)', marginTop: -10, lineHeight: 1.5 }}>
                  These colors drive your badge backgrounds, header gradients, and stat card themes.
                </p>

                {[
                  { key: 'primaryColor',   label: 'Primary',   hint: 'Main accent — badges, headings' },
                  { key: 'secondaryColor', label: 'Secondary', hint: 'Gradient partner & highlights' },
                  { key: 'accentColor',    label: 'Accent',    hint: 'Tertiary pops of color' },
                  { key: 'bgColor',        label: 'Card BG',   hint: 'Stat card background' },
                  { key: 'textColor',      label: 'Card Text', hint: 'Stat card text color' },
                ].map(({ key, label, hint }) => (
                  <div key={key}>
                    <Label>{label}</Label>
                    <p style={{ fontFamily: 'var(--sans)', fontSize: 11.5, color: 'var(--t3)', marginBottom: 7 }}>{hint}</p>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <div className="color-wrap">
                        <input type="color" value={cfg[key]}
                          onChange={e => update(key, e.target.value)} />
                        <span>{cfg[key].toUpperCase()}</span>
                      </div>
                      {/* Preset chips */}
                      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                        {['#e879a0','#9d5cf5','#36b9f5','#f59e0b','#10b981','#ef4444','#ffffff','#0d0d1a'].map(c => (
                          <button key={c} onClick={() => update(key, c)}
                            style={{
                              width: 20, height: 20, borderRadius: '50%',
                              background: c, border: `2px solid ${cfg[key] === c ? 'var(--a2)' : 'transparent'}`,
                              cursor: 'pointer', padding: 0, flexShrink: 0,
                              outline: 'none', transition: 'border-color .15s',
                            }} />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Live gradient preview */}
                <div>
                  <Label>Gradient preview</Label>
                  <div style={{
                    height: 36, borderRadius: 10, marginTop: 6,
                    background: `linear-gradient(135deg, ${cfg.primaryColor}, ${cfg.secondaryColor}, ${cfg.accentColor})`,
                    border: '1px solid var(--border)',
                    transition: 'background .3s',
                  }} />
                </div>
              </div>
            )}

            {/* TYPOGRAPHY */}
            {activeSection === 'typography' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <SectionTitle>Typography</SectionTitle>

                <div>
                  <Label>Typing animation font</Label>
                  <p style={{ fontFamily: 'var(--sans)', fontSize: 11.5, color: 'var(--t3)', marginBottom: 8 }}>
                    Used in the animated typing header on your README
                  </p>
                  <select className="sel" value={cfg.font} onChange={e => update('font', e.target.value)}
                    style={{ width: '100%' }}>
                    {['sans-serif', 'serif', 'mono', 'display', 'handwriting'].map(cat => (
                      <optgroup key={cat} label={cat.charAt(0).toUpperCase() + cat.slice(1)}>
                        {FONT_OPTIONS.filter(f => f.category === cat).map(f => (
                          <option key={f.value} value={f.value}>{f.label}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  {/* Font preview */}
                  <div style={{
                    marginTop: 10, padding: '12px 14px', borderRadius: 10,
                    background: 'var(--bg3)', border: '1px solid var(--border)',
                  }}>
                    <p style={{ fontSize: 13, color: 'var(--t3)', fontFamily: 'var(--mono)', marginBottom: 6 }}>
                      README typing preview:
                    </p>
                    <img
                      src={`https://readme-typing-svg.demolab.com?font=${cfg.font}&size=18&pause=1000&color=${cfg.primaryColor.replace('#','')}&center=false&width=380&lines=Hello!+I'm+${encodeURIComponent(githubData.name)};Welcome+to+my+profile!`}
                      alt="font preview"
                      style={{ maxWidth: '100%', borderRadius: 4, display: 'block' }}
                      onError={e => { e.target.style.display = 'none'; }}
                    />
                  </div>
                </div>

                <div>
                  <Label>Custom tagline / subtitle</Label>
                  <p style={{ fontFamily: 'var(--sans)', fontSize: 11.5, color: 'var(--t3)', marginBottom: 8 }}>
                    Shown under your name in the typing animation
                  </p>
                  <input type="text" className="inp inp-sm"
                    placeholder={`e.g. "building things with code ✨"`}
                    value={cfg.tagline}
                    onChange={e => update('tagline', e.target.value)}
                    style={{ fontFamily: 'var(--sans)', fontSize: 13 }}
                  />
                </div>
              </div>
            )}

            {/* LAYOUT */}
            {activeSection === 'layout' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <SectionTitle>Layout</SectionTitle>

                <div>
                  <Label>Content alignment</Label>
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    {LAYOUT_OPTIONS.map(o => (
                      <button key={o.value} onClick={() => update('layout', o.value)}
                        style={{
                          flex: 1, padding: '10px 14px', borderRadius: 10, cursor: 'pointer',
                          fontFamily: 'var(--sans)', fontSize: 12.5, fontWeight: 500,
                          border: '1.5px solid',
                          borderColor: cfg.layout === o.value ? cfg.primaryColor : 'var(--border)',
                          background: cfg.layout === o.value ? `${cfg.primaryColor}15` : 'var(--surf)',
                          color: cfg.layout === o.value ? cfg.primaryColor : 'var(--t2)',
                          transition: 'all .15s',
                        }}>
                        {o.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Header banner style</Label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 8 }}>
                    {HEADER_STYLES.map(h => (
                      <button key={h.value} onClick={() => update('headerStyle', h.value)}
                        style={{
                          padding: '9px 12px', borderRadius: 10, cursor: 'pointer',
                          fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 500,
                          border: '1.5px solid',
                          borderColor: cfg.headerStyle === h.value ? cfg.primaryColor : 'var(--border)',
                          background: cfg.headerStyle === h.value ? `${cfg.primaryColor}15` : 'var(--surf)',
                          color: cfg.headerStyle === h.value ? cfg.primaryColor : 'var(--t2)',
                          transition: 'all .15s',
                        }}>
                        {h.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* COMPONENTS */}
            {activeSection === 'components' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <SectionTitle>Components</SectionTitle>

                <div>
                  <Label>Badge style</Label>
                  <p style={{ fontFamily: 'var(--sans)', fontSize: 11.5, color: 'var(--t3)', marginBottom: 8 }}>
                    How your language and tech badges look
                  </p>
                  <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
                    {BADGE_STYLES.map(b => (
                      <button key={b.value} onClick={() => update('badgeStyle', b.value)}
                        style={{
                          padding: '6px 11px', borderRadius: 8, cursor: 'pointer',
                          fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 500,
                          border: '1px solid',
                          borderColor: cfg.badgeStyle === b.value ? cfg.primaryColor : 'var(--border)',
                          background: cfg.badgeStyle === b.value ? `${cfg.primaryColor}18` : 'var(--surf)',
                          color: cfg.badgeStyle === b.value ? cfg.primaryColor : 'var(--t2)',
                          transition: 'all .15s',
                        }}>
                        {b.label}
                      </button>
                    ))}
                  </div>
                  {/* Live badge preview */}
                  <div style={{
                    marginTop: 12, padding: '10px 14px', borderRadius: 10,
                    background: 'var(--bg3)', border: '1px solid var(--border)',
                    display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center',
                  }}>
                    {githubData.topLangs.slice(0,4).map(l => (
                      <img key={l} alt={l}
                        src={`https://img.shields.io/badge/-${encodeURIComponent(l)}-${cfg.primaryColor.replace('#','')}.svg?style=${cfg.badgeStyle}&logoColor=white`}
                        style={{ height: 24 }}
                        onError={e => { e.target.style.display = 'none'; }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <Label>GitHub stats card theme</Label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 7, marginTop: 8 }}>
                    {STAT_THEMES.map(s => (
                      <button key={s.value} onClick={() => update('statTheme', s.value)}
                        style={{
                          padding: '8px 12px', borderRadius: 9, cursor: 'pointer', textAlign: 'left',
                          fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 500,
                          border: '1px solid',
                          borderColor: cfg.statTheme === s.value ? cfg.primaryColor : 'var(--border)',
                          background: cfg.statTheme === s.value ? `${cfg.primaryColor}15` : 'var(--surf)',
                          color: cfg.statTheme === s.value ? cfg.primaryColor : 'var(--t2)',
                          transition: 'all .15s', display: 'flex', alignItems: 'center', gap: 6,
                        }}>
                        {cfg.statTheme === s.value && <span style={{ fontSize: 10 }}>✓</span>}
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SECTIONS */}
            {activeSection === 'sections' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <SectionTitle>Visible Sections</SectionTitle>
                <p style={{ fontFamily: 'var(--sans)', fontSize: 12.5, color: 'var(--t3)', lineHeight: 1.5, marginTop: -6 }}>
                  Toggle which sections appear in your README
                </p>
                {SECTION_OPTIONS.map(s => (
                  <label key={s.key}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '10px 14px', borderRadius: 11, cursor: 'pointer',
                      background: cfg.sections[s.key] ? `${cfg.primaryColor}0e` : 'var(--surf)',
                      border: '1px solid',
                      borderColor: cfg.sections[s.key] ? `${cfg.primaryColor}30` : 'var(--border)',
                      transition: 'all .15s',
                    }}>
                    <span style={{ fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 500, color: 'var(--t1)' }}>
                      {s.label}
                    </span>
                    <Toggle checked={cfg.sections[s.key]}
                      color={cfg.primaryColor}
                      onChange={v => updateSection(s.key, v)} />
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Right: mini preview */}
          <div style={{
            width: 220, flexShrink: 0,
            display: 'flex', flexDirection: 'column', gap: 10,
          }} className="custom-preview-panel">
            <div style={{ fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 600, color: 'var(--t2)' }}>
              Live Preview
            </div>

            {/* Color dots */}
            <div style={{
              padding: 14, borderRadius: 12, background: 'var(--bg3)', border: '1px solid var(--border)',
              display: 'flex', flexDirection: 'column', gap: 10,
            }}>
              <div style={{ display: 'flex', gap: 7 }}>
                {[cfg.primaryColor, cfg.secondaryColor, cfg.accentColor].map(c => (
                  <div key={c} style={{
                    width: 28, height: 28, borderRadius: '50%', background: c,
                    border: '2px solid rgba(255,255,255,.1)',
                    boxShadow: `0 0 10px ${c}60`,
                    transition: 'all .3s',
                  }} />
                ))}
              </div>

              {/* Gradient bar */}
              <div style={{
                height: 6, borderRadius: 99,
                background: `linear-gradient(90deg, ${cfg.primaryColor}, ${cfg.secondaryColor}, ${cfg.accentColor})`,
                transition: 'background .3s',
              }} />

              {/* Fake stat card */}
              <div style={{
                borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border)',
                background: cfg.bgColor,
                padding: '10px 12px',
                transition: 'background .3s',
              }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: cfg.textColor, opacity: .8, marginBottom: 6 }}>
                  github stats
                </div>
                {[['Total Stars', '24'], ['Commits', '128'], ['PRs', '12']].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: cfg.textColor, opacity: .5 }}>{k}</span>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: cfg.primaryColor, fontWeight: 700 }}>{v}</span>
                  </div>
                ))}
              </div>

              {/* Fake badge */}
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {githubData.topLangs.slice(0,3).map(l => (
                  <div key={l} style={{
                    padding: '3px 7px', borderRadius: 4, fontSize: 9,
                    fontFamily: 'var(--mono)', fontWeight: 600,
                    background: cfg.primaryColor, color: '#fff',
                    transition: 'background .3s',
                  }}>{l}</div>
                ))}
              </div>

              {/* Selected font */}
              <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--t3)' }}>
                Font: {FONT_OPTIONS.find(f => f.value === cfg.font)?.label || cfg.font}
              </div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--t3)' }}>
                Header: {cfg.headerStyle} · {cfg.layout}
              </div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--t3)' }}>
                {Object.values(cfg.sections).filter(Boolean).length}/{SECTION_OPTIONS.length} sections
              </div>
            </div>

            {/* Apply button (repeated for convenience) */}
            <button onClick={handleApply} className="btn btn-primary"
              style={{ width: '100%', fontSize: 12.5, padding: '9px 12px' }}>
              Generate →
            </button>
          </div>
        </div>
      </motion.div>

      <style>{`
        @media (max-width: 600px) {
          .custom-preview-panel { display: none !important; }
        }
      `}</style>
    </motion.div>
  );
}

// ── sub-components ─────────────────────────────────────────

function SectionTitle({ children }) {
  return (
    <div style={{
      fontFamily: 'var(--sans)', fontWeight: 600, fontSize: 14.5,
      color: 'var(--t1)', paddingBottom: 10,
      borderBottom: '1px solid var(--border)', marginBottom: 4,
    }}>{children}</div>
  );
}

function Label({ children }) {
  return (
    <div style={{
      fontFamily: 'var(--sans)', fontWeight: 600, fontSize: 12.5,
      color: 'var(--t1)', marginBottom: 6,
    }}>{children}</div>
  );
}

function Toggle({ checked, onChange, color }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      style={{
        width: 40, height: 22, borderRadius: 99, border: 'none', cursor: 'pointer', padding: 2,
        background: checked ? color : 'var(--border2)',
        transition: 'background .2s', position: 'relative', flexShrink: 0,
      }}>
      <div style={{
        width: 18, height: 18, borderRadius: '50%', background: '#fff',
        position: 'absolute', top: 2,
        left: checked ? 20 : 2,
        transition: 'left .2s',
        boxShadow: '0 1px 3px rgba(0,0,0,.2)',
      }} />
    </button>
  );
}

// ── Custom README generator ────────────────────────────────

function generateCustomReadme(data, cfg) {
  const { username, name, bio, topLangs, topRepos, totalStars, followers, publicRepos, location, twitter } = data;
  const pc = cfg.primaryColor.replace('#', '');
  const sc = cfg.secondaryColor.replace('#', '');
  const ac = cfg.accentColor.replace('#', '');
  const bg = cfg.bgColor.replace('#', '');
  const tc = cfg.textColor.replace('#', '');
  const align = cfg.layout === 'centered' ? 'center' : 'left';

  const taglineLines = [
    `Hello! I'm ${name} 👋`,
    topLangs[0] ? `${topLangs[0]} developer` : 'software developer',
    cfg.tagline || (bio ? bio.slice(0, 40) : 'building cool things'),
    `${publicRepos} repos · ${totalStars} ⭐`,
  ];
  const typingUrl = `https://readme-typing-svg.demolab.com?font=${cfg.font}&size=18&pause=1000&color=${pc}&${align === 'center' ? 'center=true&' : ''}width=500&lines=${taglineLines.map(l => encodeURIComponent(l)).join(';')}`;

  const langBadges = topLangs.map(l =>
    `![${l}](https://img.shields.io/badge/-${encodeURIComponent(l)}-${pc}.svg?style=${cfg.badgeStyle}&logo=${l.toLowerCase().replace(/ /g, '+')}&logoColor=white)`
  ).join(' ');

  const repoCards = topRepos.slice(0, 4).map(r =>
    `[![${r.name}](https://github-readme-stats.vercel.app/api/pin/?username=${username}&repo=${r.name}&theme=${cfg.statTheme}&bg_color=${bg}&title_color=${pc}&icon_color=${ac}&border_color=${pc}40&text_color=${tc})](https://github.com/${username}/${r.name})`
  ).join('\n');

  const headerHtml = cfg.headerStyle !== 'none'
    ? `<img src="https://capsule-render.vercel.app/api?type=${cfg.headerStyle}&color=gradient&customColorList=0&height=200&section=header&text=${encodeURIComponent(name)}&fontColor=${tc}&fontSize=48&fontAlign=50&fontAlignY=55&desc=${encodeURIComponent(bio || 'developer · creator · builder')}&descAlign=50&descAlignY=75&descSize=14&descFontColor=${tc}aa" width="100%"/>`
    : '';

  const footerHtml = cfg.headerStyle !== 'none'
    ? `<img src="https://capsule-render.vercel.app/api?type=${cfg.headerStyle}&color=gradient&customColorList=0&height=80&section=footer&reversal=true" width="100%"/>`
    : '';

  let out = `<!-- ✦ CUSTOM README — generated by readme.vibe -->\n`;
  if (align === 'center') out += `<div align="center">\n\n`;

  if (cfg.sections.header && headerHtml) out += `${headerHtml}\n\n`;

  if (cfg.sections.bio) {
    out += `![Typing SVG](${typingUrl})\n\n`;
    if (bio) out += `> *${bio}*\n\n`;
    out += `---\n\n`;
    out += `### 👤 About Me\n\n`;
    out += `\`\`\`\n`;
    if (name)     out += `  Name      : ${name}\n`;
    if (location) out += `  Location  : ${location}\n`;
    out += `  Repos     : ${publicRepos}  ·  Stars  : ${totalStars}  ·  Followers : ${followers}\n`;
    out += `  Languages : ${topLangs.slice(0, 5).join(' · ')}\n`;
    if (twitter)  out += `  Twitter   : @${twitter}\n`;
    out += `\`\`\`\n\n---\n\n`;
  }

  if (cfg.sections.badges && topLangs.length > 0) {
    out += `### 🛠 Tech Stack\n\n${langBadges}\n\n---\n\n`;
  }

  if (cfg.sections.stats) {
    out += `### 📊 GitHub Stats\n\n`;
    out += `<table><tr><td>\n\n`;
    out += `![Stats](https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&theme=${cfg.statTheme}&bg_color=${bg}&title_color=${pc}&icon_color=${ac}&border_color=${pc}40&text_color=${tc}&include_all_commits=true&count_private=true)\n\n`;
    out += `</td>`;
    if (cfg.sections.langs) {
      out += `<td>\n\n![Langs](https://github-readme-stats.vercel.app/api/top-langs/?username=${username}&layout=compact&theme=${cfg.statTheme}&bg_color=${bg}&title_color=${pc}&border_color=${pc}40&text_color=${tc})\n\n</td>`;
    }
    out += `</tr></table>\n\n---\n\n`;
  }

  if (cfg.sections.streak) {
    out += `### 🔥 Streak\n\n`;
    out += `![Streak](https://github-readme-streak-stats.herokuapp.com/?user=${username}&theme=${cfg.statTheme}&background=${bg}&ring=${pc}&fire=${ac}&currStreakLabel=${pc}&border=${pc}40)\n\n---\n\n`;
  }

  if (cfg.sections.repos && topRepos.length > 0) {
    out += `### 📌 Top Projects\n\n${repoCards}\n\n---\n\n`;
  }

  if (cfg.sections.activity) {
    out += `### 📈 Activity\n\n`;
    out += `![Activity](https://github-readme-activity-graph.vercel.app/graph?username=${username}&bg_color=${bg}&color=${pc}&line=${sc}&point=${ac}&area=true&hide_border=false)\n\n---\n\n`;
  }

  out += `<sub>made with ✦ [readme.vibe](https://github.com/${username})</sub>\n`;
  if (align === 'center') out += `\n</div>`;

  if (cfg.sections.header && footerHtml) out += `\n\n${footerHtml}`;

  return out;
}
