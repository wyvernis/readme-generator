import { useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

export default function Step3Preview({ githubData, theme, onChangeTheme, onReset }) {
  const [copied, setCopied] = useState(false);
  const [mobileTab, setMobileTab] = useState('preview');

  const readmeCode = useMemo(() => theme.generate(githubData), [theme, githubData]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(readmeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  const handleDownload = () => {
    const blob = new Blob([readmeCode], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'README.md'; a.click();
    URL.revokeObjectURL(url);
  };

  const lines = readmeCode.split('\n').length;
  const kb = (readmeCode.length / 1024).toFixed(1);

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: 'calc(100svh - 58px)',
    }}>
      {/* ── Toolbar ──────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '0 16px', height: 48, flexShrink: 0,
        background: 'var(--bg2)', borderBottom: '1px solid var(--border)',
        overflow: 'hidden',
      }}>
        {/* Theme badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8, flexShrink: 0,
            background: `linear-gradient(135deg, ${theme.colors[0]}, ${theme.colors[1]})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
          }}>{theme.emoji}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <span style={{ fontFamily: 'var(--sans)', fontWeight: 600, fontSize: 12.5, color: 'var(--t1)', lineHeight: 1.2 }}>
              {theme.name}
            </span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 10.5, color: 'var(--t3)', lineHeight: 1 }}>
              {lines} lines · {kb} kb
            </span>
          </div>
        </div>

        {/* Separator */}
        <div style={{ flex: 1 }} />

        {/* Mobile tab toggle */}
        <div className="mobile-tabs" style={{
          display: 'none', borderRadius: 8, overflow: 'hidden',
          border: '1px solid var(--border)', background: 'var(--surf)',
        }}>
          {['preview','code'].map(t => (
            <button key={t} onClick={() => setMobileTab(t)}
              style={{
                padding: '4px 12px', fontSize: 11.5, fontFamily: 'var(--sans)', fontWeight: 500,
                cursor: 'pointer', border: 'none',
                background: mobileTab === t
                  ? `linear-gradient(135deg, ${theme.colors[0]}, ${theme.colors[1]})`
                  : 'transparent',
                color: mobileTab === t ? '#fff' : 'var(--t2)',
                transition: 'all .15s',
              }}>
              {t === 'preview' ? '👁' : '⌨'} {t}
            </button>
          ))}
        </div>

        {/* Actions */}
        <button onClick={handleCopy} className="btn"
          style={{
            fontSize: 12, padding: '5px 12px',
            background: copied ? 'rgba(34,197,94,.1)' : `${theme.colors[0]}18`,
            border: `1px solid ${copied ? 'rgba(34,197,94,.4)' : theme.colors[0] + '35'}`,
            color: copied ? '#22c55e' : theme.colors[0],
          }}>
          {copied ? '✓ Copied' : '⎘ Copy'}
        </button>

        <button onClick={handleDownload} className="btn btn-ghost" style={{ fontSize: 12, padding: '5px 10px' }}>
          ↓ .md
        </button>

        <div style={{ width: 1, height: 18, background: 'var(--border2)', flexShrink: 0 }} />

        <button onClick={onChangeTheme} className="btn btn-ghost" style={{ fontSize: 12, padding: '5px 10px' }}>
          ← Vibe
        </button>
        <button onClick={onReset} className="btn btn-ghost"
          style={{ fontSize: 12, padding: '5px 10px', opacity: .55 }}>
          Reset
        </button>
      </div>

      {/* ── Split panels ─────────────────────────── */}
      <div style={{
        flex: 1, overflow: 'hidden',
        display: 'grid', gridTemplateColumns: '44% 56%',
      }} className="split-grid">

        {/* Code */}
        <div style={{
          display: 'flex', flexDirection: 'column',
          borderRight: '1px solid var(--border)',
          overflow: 'hidden', background: 'var(--bg)',
        }} className={`split-panel code-panel ${mobileTab === 'code' ? 'tab-active' : ''}`}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '7px 14px', background: 'var(--bg3)',
            borderBottom: '1px solid var(--border)', flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <TLights />
              <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--t3)', marginLeft: 4 }}>README.md</span>
            </div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px' }}>
            <pre style={{
              fontFamily: 'var(--mono)', fontSize: 12, lineHeight: 1.75,
              color: 'var(--t2)', whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0,
            }}>
              <ColoredCode lines={readmeCode.split('\n')} colors={theme.colors} />
            </pre>
          </div>
        </div>

        {/* Preview */}
        <div style={{
          display: 'flex', flexDirection: 'column',
          background: '#fff', overflow: 'hidden',
        }} className={`split-panel preview-panel ${mobileTab === 'preview' ? 'tab-active' : ''}`}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '7px 14px',
            background: '#f6f8fa', borderBottom: '1px solid #e0e3e7', flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <TLights light />
              <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: '#888', marginLeft: 4 }}>
                github.com/{githubData.username}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
              <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: '#bbb' }}>live</span>
            </div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <div style={{
              maxWidth: 760, margin: '0 auto',
              padding: '20px 28px 48px',
            }}>
              <GHMarkdown content={readmeCode} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer steps ─────────────────────────── */}
      <div style={{
        flexShrink: 0, height: 40,
        display: 'flex', alignItems: 'center', gap: 6, padding: '0 16px',
        background: 'var(--bg2)', borderTop: '1px solid var(--border)',
        overflowX: 'auto',
      }}>
        <span style={{ fontFamily: 'var(--sans)', fontSize: 11.5, fontWeight: 600, color: 'var(--t1)', flexShrink: 0, marginRight: 6 }}>
          🚀 Deploy
        </span>
        {[
          `Create repo named "${githubData.username}"`,
          'Add README.md with the code above',
          'Commit & push → profile updates instantly',
        ].map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <div style={{
              width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
              background: `linear-gradient(135deg, ${theme.colors[0]}, ${theme.colors[1]})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 8.5, color: '#fff', fontWeight: 700,
            }}>{i + 1}</div>
            <span style={{ fontFamily: 'var(--sans)', fontSize: 11.5, color: 'var(--t2)' }}>{s}</span>
            {i < 2 && <span style={{ color: 'var(--t3)', fontSize: 11 }}>·</span>}
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .split-grid { grid-template-columns: 1fr !important; }
          .split-panel { display: none !important; }
          .split-panel.tab-active { display: flex !important; }
          .mobile-tabs { display: flex !important; }
        }
      `}</style>
    </div>
  );
}

function TLights({ light }) {
  const op = light ? .85 : .5;
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {['#ef4444','#eab308','#22c55e'].map(c => (
        <div key={c} style={{ width: 9, height: 9, borderRadius: '50%', background: c, opacity: op }} />
      ))}
    </div>
  );
}

function ColoredCode({ lines, colors }) {
  return lines.map((line, i) => {
    let c = 'var(--t2)';
    if (/^#{1,3} /.test(line)) c = colors[0] || 'var(--a1)';
    else if (/^<!--/.test(line) || /^>/.test(line)) c = 'var(--t3)';
    else if (/^!\[/.test(line) || /^<img/.test(line)) c = colors[2] || 'var(--a3)';
    else if (/^\[!\[/.test(line) || /^\[/.test(line)) c = 'var(--a3)';
    else if (/^```/.test(line)) c = 'var(--t3)';
    return (
      <span key={i} style={{ display: 'block', color: c, fontStyle: /^>/.test(line) ? 'italic' : 'normal' }}>
        {line}{'\n'}
      </span>
    );
  });
}

function GHMarkdown({ content }) {
  const cleaned = content.replace(/<!--[\s\S]*?-->/g, '').trim();
  return (
    <div className="ghmd">
      <style>{`
        .ghmd{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif;font-size:14px;line-height:1.6;color:#1f2328}
        .ghmd h1{font-size:1.7em;font-weight:600;margin:0 0 14px;padding-bottom:8px;border-bottom:1px solid #d0d7de;line-height:1.25}
        .ghmd h2{font-size:1.35em;font-weight:600;margin:22px 0 10px;padding-bottom:6px;border-bottom:1px solid #d0d7de;line-height:1.25}
        .ghmd h3{font-size:1.1em;font-weight:600;margin:18px 0 7px;line-height:1.3}
        .ghmd p{margin:0 0 10px}
        .ghmd code{background:rgba(175,184,193,.2);border-radius:6px;padding:2px 5px;font-size:85%;color:#1f2328;font-family:ui-monospace,SFMono-Regular,monospace}
        .ghmd pre{background:#f6f8fa;border:1px solid #d0d7de;border-radius:6px;padding:14px;overflow-x:auto;margin:10px 0}
        .ghmd pre code{background:none;padding:0;font-size:85%;color:#24292f}
        .ghmd blockquote{border-left:4px solid #d0d7de;margin:0 0 10px;padding:0 16px;color:#656d76}
        .ghmd table{border-collapse:collapse;width:100%;margin:10px 0;display:block;overflow-x:auto}
        .ghmd th,.ghmd td{border:1px solid #d0d7de;padding:6px 12px;font-size:13px}
        .ghmd th{background:#f6f8fa;font-weight:600}
        .ghmd tr:nth-child(even) td{background:#f6f8fa}
        .ghmd a{color:#0969da;text-decoration:none}
        .ghmd a:hover{text-decoration:underline}
        .ghmd img{max-width:100%;height:auto;border-radius:4px;display:inline-block}
        .ghmd ul,.ghmd ol{padding-left:1.8em;margin:6px 0}
        .ghmd li{margin:2px 0}
        .ghmd hr{height:3px;padding:0;margin:22px 0;background:#d0d7de;border:0;border-radius:2px}
        .ghmd strong{font-weight:600}
        .ghmd em{font-style:italic}
        .ghmd>*:first-child{margin-top:0!important}
      `}</style>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          img: ({ src, alt }) => (
            <img src={src} alt={alt || ''} style={{ maxWidth: '100%' }}
              onError={e => { e.target.style.opacity = '.2'; }} />
          ),
        }}
      >{cleaned}</ReactMarkdown>
    </div>
  );
}
