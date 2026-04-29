import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { THEMES } from '../generators';
import CustomThemeBuilder from './CustomThemeBuilder';

export default function Step2Vibe({ githubData, onThemeSelected }) {
  const [search, setSearch] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  const filtered = THEMES.filter(t =>
    !search ||
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.tags.some(g => g.includes(search.toLowerCase())) ||
    t.desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ maxWidth: 1080, margin: '0 auto', padding: '36px 24px 80px' }}>

      {/* Profile pill */}
      <motion.div
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: .35, ease: [.22,1,.36,1] }}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          padding: '7px 14px 7px 7px', borderRadius: 99,
          background: 'var(--surf)', border: '1px solid var(--border)',
          marginBottom: 36,
        }}
      >
        <img src={githubData.avatar} alt=""
          style={{ width: 26, height: 26, borderRadius: '50%',
            boxShadow: '0 0 0 2px var(--a2), 0 0 10px var(--glow)' }} />
        <span style={{ fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 500, color: 'var(--t1)' }}>
          {githubData.name}
        </span>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--t3)' }}>
          @{githubData.username}
        </span>
        <div style={{ width: 1, height: 12, background: 'var(--border2)' }} />
        {githubData.topLangs.slice(0, 3).map(l => (
          <span key={l} style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--t2)' }}>{l}</span>
        ))}
      </motion.div>

      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 32 }}>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .06 }}>
          <h2 className="serif" style={{
            fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 400,
            color: 'var(--t1)', letterSpacing: '-.025em', lineHeight: 1.1, marginBottom: 6,
          }}>
            Pick a <em className="grad">vibe</em>
          </h2>
          <p style={{ fontFamily: 'var(--sans)', fontSize: 13.5, color: 'var(--t3)', lineHeight: 1.5 }}>
            {filtered.length} themes — each one a completely different aesthetic
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .1 }}
          style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <span style={{
              position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
              color: 'var(--t3)', fontSize: 13, pointerEvents: 'none',
            }}>⌕</span>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="search…" className="inp inp-sm"
              style={{ paddingLeft: 28, width: 150 }} />
          </div>
          <button className="btn btn-ghost" onClick={() => setShowCustom(true)}
            style={{ fontSize: 12.5 }}>
            <span>✦</span> Custom theme
          </button>
        </motion.div>
      </div>

      {/* Theme grid — variable row heights for visual interest */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: 14,
      }}>
        {filtered.map((theme, i) => (
          <ThemeCard key={theme.id} theme={theme} index={i} onClick={() => onThemeSelected(theme)} />
        ))}

        {/* Custom card */}
        <BuildYourOwnCard index={filtered.length} onClick={() => setShowCustom(true)} />
      </div>

      {filtered.length === 0 && (
        <p style={{ textAlign: 'center', padding: '52px 0', fontFamily: 'var(--sans)', fontSize: 13.5, color: 'var(--t3)' }}>
          No themes match "{search}"
        </p>
      )}

      <AnimatePresence>
        {showCustom && (
          <CustomThemeBuilder
            githubData={githubData}
            onClose={() => setShowCustom(false)}
            onApply={theme => { setShowCustom(false); onThemeSelected(theme); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Individual theme card ─────────────────────────────── */
function ThemeCard({ theme, index, onClick }) {
  const [hov, setHov] = useState(false);
  const { card } = theme;

  const isLight = card.dark;
  const fontFamilies = {
    mono:    '"JetBrains Mono", monospace',
    serif:   '"Instrument Serif", Georgia, serif',
    sans:    '"Inter", system-ui, sans-serif',
    display: '"Syne", "Inter", sans-serif',
    heavy:   '"Inter", system-ui, sans-serif',
  };
  const ff = fontFamilies[card.fontStyle] || fontFamilies.sans;

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * .045 + .1, duration: .4, ease: [.22,1,.36,1] }}
      whileHover={{ y: -6, transition: { duration: .2, ease: [.22,1,.36,1] } }}
      whileTap={{ scale: .97 }}
      style={{
        position: 'relative',
        background: card.bg,
        border: hov ? `1px solid ${card.accent}50` : card.borderStyle,
        borderRadius: 16,
        padding: 0,
        cursor: 'pointer',
        overflow: 'hidden',
        textAlign: 'left',
        boxShadow: hov
          ? `0 12px 40px rgba(0,0,0,.35), 0 0 0 1px ${card.accent}30, inset 0 1px 0 ${card.accent}15`
          : `0 2px 8px rgba(0,0,0,.2), inset 0 1px 0 rgba(255,255,255,.04)`,
        transition: 'border-color .2s, box-shadow .25s',
        minHeight: 200,
      }}
    >
      {/* Glow blob */}
      <div style={{
        position: 'absolute', top: -30, right: -30,
        width: 100, height: 100, borderRadius: '50%',
        background: `radial-gradient(circle, ${card.accent}35, transparent 68%)`,
        opacity: hov ? 1 : 0.4,
        transition: 'opacity .3s',
        pointerEvents: 'none',
        filter: 'blur(2px)',
      }} />

      {/* Second glow — bottom left */}
      <div style={{
        position: 'absolute', bottom: -20, left: -20,
        width: 80, height: 80, borderRadius: '50%',
        background: `radial-gradient(circle, ${theme.colors[2] || theme.colors[1]}22, transparent 68%)`,
        opacity: hov ? 0.7 : 0,
        transition: 'opacity .35s',
        pointerEvents: 'none',
      }} />

      {/* Mini code preview area */}
      <div style={{
        padding: '16px 16px 12px',
        borderBottom: `1px solid ${card.accent}15`,
        minHeight: 90,
        position: 'relative',
      }}>
        {/* Scanline overlay for terminal themes */}
        {(card.fontStyle === 'mono' || card.fontStyle === 'display') && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,.04) 2px, rgba(0,0,0,.04) 4px)',
            pointerEvents: 'none', borderRadius: '16px 16px 0 0',
          }} />
        )}

        {card.previewLines.map((line, i) => (
          <div key={i} style={{
            fontFamily: ff,
            fontSize: card.fontStyle === 'heavy' ? (i === 0 ? 17 : 11) : (card.fontStyle === 'display' ? 12.5 : 11.5),
            fontWeight: card.fontStyle === 'heavy' ? (i === 0 ? 800 : 400) : (card.fontStyle === 'serif' ? 400 : 500),
            color: i === 0 ? card.accent : card.textColor,
            opacity: i === 0 ? 1 : (i === 1 ? 0.65 : 0.4),
            lineHeight: 1.55,
            letterSpacing: card.fontStyle === 'heavy' && i === 0 ? '-.01em' : '0',
            fontStyle: card.fontStyle === 'serif' && i === 0 ? 'italic' : 'normal',
            marginBottom: i < card.previewLines.length - 1 ? 2 : 0,
            position: 'relative', zIndex: 1,
          }}>{line}</div>
        ))}
      </div>

      {/* Card info */}
      <div style={{ padding: '12px 16px 14px' }}>
        {/* Color palette row */}
        <div style={{ display: 'flex', gap: 5, marginBottom: 10 }}>
          {theme.colors.map((c, ci) => (
            <div key={ci} style={{
              width: 10, height: 10, borderRadius: '50%', background: c,
              border: isLight ? '1px solid rgba(0,0,0,.15)' : '1px solid rgba(255,255,255,.1)',
              boxShadow: hov ? `0 0 6px ${c}80` : 'none',
              transition: 'box-shadow .2s',
            }} />
          ))}
          {/* Gradient swatch */}
          <div style={{
            width: 24, height: 10, borderRadius: 5, marginLeft: 2,
            background: `linear-gradient(90deg, ${theme.colors[0]}, ${theme.colors[1]})`,
            border: isLight ? '1px solid rgba(0,0,0,.1)' : '1px solid rgba(255,255,255,.08)',
          }} />
        </div>

        <div style={{
          fontFamily: 'var(--sans)', fontWeight: 600, fontSize: 13.5,
          color: isLight ? '#111' : '#fff',
          marginBottom: 4, lineHeight: 1.25,
        }}>
          {theme.emoji} {theme.name}
        </div>

        <div style={{
          fontFamily: 'var(--sans)', fontSize: 11.5, lineHeight: 1.55,
          color: isLight ? 'rgba(0,0,0,.45)' : 'rgba(255,255,255,.38)',
          marginBottom: 10,
        }}>
          {theme.desc}
        </div>

        {/* Tags + arrow */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {theme.tags.map(t => (
              <span key={t} style={{
                padding: '2px 7px', borderRadius: 99, fontSize: 10,
                fontFamily: 'var(--sans)', fontWeight: 500,
                background: `${card.accent}18`,
                color: card.accent,
                border: `1px solid ${card.accent}28`,
              }}>{t}</span>
            ))}
          </div>
          <div style={{
            width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: hov ? card.accent : `${card.accent}20`,
            color: hov ? (isLight ? '#fff' : '#000') : card.accent,
            fontSize: 10, fontWeight: 700,
            transition: 'all .2s',
          }}>→</div>
        </div>
      </div>
    </motion.button>
  );
}

/* ─── "Build your own" card ─────────────────────────────── */
function BuildYourOwnCard({ index, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * .045 + .1, duration: .4, ease: [.22,1,.36,1] }}
      whileHover={{ y: -6, transition: { duration: .2 } }}
      whileTap={{ scale: .97 }}
      style={{
        position: 'relative',
        background: hov
          ? 'linear-gradient(145deg, rgba(157,92,245,.08), rgba(232,121,160,.06))'
          : 'transparent',
        border: hov ? '1.5px solid rgba(157,92,245,.45)' : '1.5px dashed var(--border2)',
        borderRadius: 16, padding: '28px 20px',
        cursor: 'pointer', overflow: 'hidden',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 10, textAlign: 'center', minHeight: 200,
        transition: 'all .2s',
        boxShadow: hov ? '0 8px 32px rgba(157,92,245,.1)' : 'none',
      }}
    >
      {/* Animated gradient ring */}
      <div style={{
        width: 44, height: 44, borderRadius: '50%',
        background: hov
          ? 'linear-gradient(135deg, var(--a1), var(--a2))'
          : 'var(--surf)',
        border: '1px solid var(--border2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 18, transition: 'all .25s',
        boxShadow: hov ? '0 0 20px var(--glow)' : 'none',
      }}>✦</div>

      <div>
        <div style={{ fontFamily: 'var(--sans)', fontWeight: 600, fontSize: 13.5, color: 'var(--t1)', marginBottom: 5 }}>
          Build your own
        </div>
        <div style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--t3)', lineHeight: 1.55 }}>
          Custom colors, fonts,<br />layout & components
        </div>
      </div>

      <div style={{ display: 'flex', gap: 5, marginTop: 4 }}>
        {['colors', 'fonts', 'layout'].map(t => (
          <span key={t} style={{
            padding: '2px 7px', borderRadius: 99, fontSize: 10,
            fontFamily: 'var(--sans)', fontWeight: 500,
            background: 'var(--surf2)', color: 'var(--t3)',
            border: '1px solid var(--border)',
          }}>{t}</span>
        ))}
      </div>
    </motion.button>
  );
}
