import { useState } from 'react';
import { motion } from 'framer-motion';
import { BLOCK_CATALOG, STYLE_PRESETS } from '../../builder/blockTypes';
import { TECH_ICONS } from '../../data/techIcons';

export default function BuilderSidebar({ onAddBlock, profile, onStyleChange }) {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('blocks');

  const filteredBlocks = BLOCK_CATALOG.filter(b =>
    !search || b.label.toLowerCase().includes(search.toLowerCase()) || b.category.includes(search.toLowerCase())
  );

  const filteredTech = TECH_ICONS.filter(t =>
    !search || t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <aside style={{
      width: 280, flexShrink: 0, borderLeft: '1px solid var(--border)',
      background: 'var(--bg2)', display: 'flex', flexDirection: 'column',
      height: '100%', overflow: 'hidden',
    }}>
      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        {[
          { id: 'blocks', label: 'Add' },
          { id: 'style', label: 'Style' },
          { id: 'icons', label: 'Icons' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{
              flex: 1, padding: '10px 8px', border: 'none', cursor: 'pointer',
              background: tab === t.id ? 'var(--surf2)' : 'transparent',
              color: tab === t.id ? 'var(--t1)' : 'var(--t3)',
              fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 600,
              borderBottom: tab === t.id ? '2px solid var(--a2)' : '2px solid transparent',
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab !== 'style' && (
        <div style={{ padding: '12px 14px', flexShrink: 0 }}>
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search…" className="inp inp-sm"
            style={{ width: '100%' }}
          />
        </div>
      )}

      <div style={{ flex: 1, overflowY: 'auto', padding: tab === 'style' ? '14px' : '0 14px 14px' }}>

        {tab === 'blocks' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {filteredBlocks.map(block => (
              <motion.button
                key={block.type}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: .97 }}
                onClick={() => onAddBlock(block.type)}
                style={{
                  padding: '12px 8px', borderRadius: 10, cursor: 'pointer',
                  background: 'var(--surf)', border: '1px solid var(--border)',
                  textAlign: 'center', color: 'var(--t1)',
                }}>
                <div style={{ fontSize: 20, marginBottom: 4 }}>{block.icon}</div>
                <div style={{ fontFamily: 'var(--sans)', fontSize: 10.5, fontWeight: 500, lineHeight: 1.3 }}>
                  {block.label}
                </div>
              </motion.button>
            ))}
          </div>
        )}

        {tab === 'icons' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
            {filteredTech.map(tech => (
              <button key={tech.id}
                onClick={() => onAddBlock('tech-stack', tech)}
                title={`Add ${tech.name}`}
                style={{
                  padding: '10px 4px', borderRadius: 8, cursor: 'pointer',
                  background: 'var(--surf)', border: '1px solid var(--border)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                }}>
                <img src={`https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/${tech.slug}.svg`}
                  alt="" width={22} height={22}
                  style={{ filter: 'invert(1) brightness(1.8)' }} />
                <span style={{ fontSize: 8.5, color: 'var(--t3)', fontFamily: 'var(--sans)' }}>
                  {tech.name}
                </span>
              </button>
            ))}
          </div>
        )}

        {tab === 'style' && (
          <StylePanel profile={profile} onStyleChange={onStyleChange} />
        )}
      </div>
    </aside>
  );
}

function StylePanel({ profile, onStyleChange }) {
  const style = profile.style;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <p style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--t2)', lineHeight: 1.5 }}>
        Pick a color preset. All widgets update instantly.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {STYLE_PRESETS.map(preset => (
          <button key={preset.id}
            onClick={() => onStyleChange(preset)}
            style={{
              padding: 10, borderRadius: 10, cursor: 'pointer', textAlign: 'left',
              background: preset.bg, border: style.id === preset.id
                ? `2px solid ${preset.accent}` : '1px solid var(--border)',
              boxShadow: style.id === preset.id ? `0 0 12px ${preset.accent}40` : 'none',
            }}>
            <div style={{ fontFamily: 'var(--sans)', fontSize: 11, fontWeight: 600, color: preset.text }}>
              {preset.name}
            </div>
            <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
              {[preset.bg, preset.accent, preset.muted].map((c, i) => (
                <div key={i} style={{ width: 14, height: 14, borderRadius: 4, background: c }} />
              ))}
            </div>
          </button>
        ))}
      </div>

      <div>
        <label style={{ fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--t3)', display: 'block', marginBottom: 6 }}>
          Accent color
        </label>
        <div className="color-wrap" style={{ width: '100%' }}>
          <input type="color" value={style.accent}
            onChange={e => onStyleChange({ ...style, accent: e.target.value })} />
          <span>{style.accent}</span>
        </div>
      </div>
    </div>
  );
}
