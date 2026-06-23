import { motion, Reorder } from 'framer-motion';
import BlockPreview from './BlockPreview';

export default function BuilderCanvas({
  blocks, selectedId, onSelect, onReorder, onRemove, profile, githubData,
}) {
  if (!blocks.length) {
    return (
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: 12, color: 'var(--t3)', padding: 40,
      }}>
        <div style={{ fontSize: 48, opacity: .4 }}>✦</div>
        <p style={{ fontFamily: 'var(--sans)', fontSize: 14, textAlign: 'center', maxWidth: 280, lineHeight: 1.6 }}>
          Your canvas is empty. Pick blocks from the sidebar to start building your profile README.
        </p>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '24px 20px 80px' }}>
      <Reorder.Group axis="y" values={blocks} onReorder={onReorder}
        style={{ display: 'flex', flexDirection: 'column', gap: 12, listStyle: 'none', margin: 0, padding: 0 }}>
        {blocks.map(block => (
          <Reorder.Item key={block.id} value={block}
            style={{ listStyle: 'none' }}
            whileDrag={{ scale: 1.02, boxShadow: '0 8px 32px rgba(0,0,0,.4)' }}>
            <motion.div
              onClick={() => onSelect(block.id)}
              style={{
                position: 'relative', borderRadius: 12, cursor: 'grab',
                border: selectedId === block.id
                  ? `2px solid ${profile.style.accent}`
                  : '2px solid transparent',
                outline: selectedId === block.id ? `1px solid ${profile.style.accent}40` : 'none',
                background: profile.style.card,
                boxShadow: selectedId === block.id
                  ? `0 0 20px ${profile.style.accent}25`
                  : '0 2px 8px rgba(0,0,0,.2)',
                transition: 'border-color .15s, box-shadow .15s',
                overflow: 'hidden',
              }}>
              {/* Drag handle + actions */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '6px 10px', background: 'rgba(0,0,0,.25)',
                borderBottom: `1px solid ${profile.style.accent}15`,
              }}>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: profile.style.muted, letterSpacing: '.05em' }}>
                  ⋮⋮ {block.type.replace(/-/g, ' ').toUpperCase()}
                </span>
                <button
                  onClick={e => { e.stopPropagation(); onRemove(block.id); }}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--t3)', fontSize: 14, padding: '2px 6px', borderRadius: 4,
                  }}
                  title="Remove block"
                >✕</button>
              </div>

              <div style={{ padding: '12px 16px' }}>
                <BlockPreview block={block} profile={profile} githubData={githubData} />
              </div>
            </motion.div>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
}
