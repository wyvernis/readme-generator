import { useState } from 'react';
import { motion } from 'framer-motion';
import { fetchGitHubData } from '../github';

const EXAMPLES = ['torvalds', 'sindresorhus', 'gaearon', 'yyx990803'];

const up = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: .45, ease: [.22, 1, .36, 1], delay },
});

export default function Step1Username({ onDataFetched }) {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const filled = username.trim().length > 0;

  const handleSubmit = async (e) => {
    e?.preventDefault();
    const u = username.trim();
    if (!u) return;
    setLoading(true); setError('');
    try {
      const data = await fetchGitHubData(u);
      onDataFetched(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100svh - 58px)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '48px 20px',
    }}>
      {/* Ambient blob */}
      <div style={{
        position: 'fixed', top: '25%', left: '50%', transform: 'translateX(-50%)',
        width: 480, height: 280, borderRadius: '50%',
        background: 'radial-gradient(ellipse, var(--glow) 0%, transparent 68%)',
        pointerEvents: 'none', zIndex: 0,
      }} className="anim-glow" />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 440, textAlign: 'center' }}>

        {/* Icon */}
        <motion.div {...up(0)} style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14, flexShrink: 0,
            background: 'linear-gradient(135deg, var(--a1), var(--a2))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, color: '#fff',
            boxShadow: '0 0 32px var(--glow), 0 4px 16px rgba(0,0,0,.2)',
          }}>✦</div>
        </motion.div>

        {/* Headline */}
        <motion.h1 {...up(.04)} className="serif" style={{
          fontSize: 'clamp(38px, 6.5vw, 58px)',
          fontWeight: 400, lineHeight: 1.06, letterSpacing: '-.03em',
          color: 'var(--t1)', marginBottom: 14,
        }}>
          Your GitHub,<br />
          <em className="grad">your vibe.</em>
        </motion.h1>

        <motion.p {...up(.09)} style={{
          fontFamily: 'var(--sans)', fontWeight: 300, fontSize: 15, lineHeight: 1.6,
          color: 'var(--t2)', marginBottom: 36, maxWidth: 340, margin: '0 auto 36px',
        }}>
          Generate a beautiful, aesthetic GitHub profile README that actually matches your personality.
        </motion.p>

        {/* Form */}
        <motion.form {...up(.13)} onSubmit={handleSubmit}>
          <div style={{ position: 'relative', marginBottom: 10 }}>
            {/* GitHub icon */}
            <div style={{
              position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
              color: 'var(--t3)', display: 'flex', pointerEvents: 'none',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
              </svg>
            </div>
            <input
              type="text" value={username}
              onChange={e => { setUsername(e.target.value); setError(''); }}
              placeholder="github username"
              autoFocus autoComplete="off" spellCheck={false} disabled={loading}
              className="inp"
              style={{
                paddingLeft: 42, paddingRight: username ? 38 : 14,
                fontFamily: 'var(--mono)', fontSize: 14,
                borderColor: error ? 'var(--a1)' : filled ? 'var(--a2)' : 'var(--border)',
                boxShadow: error ? '0 0 0 3px rgba(232,121,160,.12)' : filled ? '0 0 0 3px var(--glow)' : 'none',
              }}
            />
            {username && (
              <button type="button" onClick={() => { setUsername(''); setError(''); }}
                style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--t3)', fontSize: 13, padding: 4, lineHeight: 1,
                }}>✕</button>
            )}
          </div>

          {error && (
            <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
              style={{ fontFamily: 'var(--sans)', fontSize: 12.5, color: 'var(--a1)', textAlign: 'left', marginBottom: 10, paddingLeft: 2 }}>
              ⚠ {error}
            </motion.p>
          )}

          <button type="submit" disabled={!filled || loading} className="btn btn-primary"
            style={{ width: '100%', padding: '12px 20px', fontSize: 14, borderRadius: 11, marginTop: 4 }}>
            {loading ? (
              <>
                <style>{`@keyframes _spin{to{transform:rotate(360deg)}}`}</style>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                  style={{ animation: '_spin .7s linear infinite', flexShrink: 0 }}>
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                </svg>
                fetching…
              </>
            ) : (
              <>
                Continue
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </>
            )}
          </button>
        </motion.form>

        {/* Examples */}
        <motion.div {...up(.2)} style={{ marginTop: 28 }}>
          <p style={{ fontFamily: 'var(--sans)', fontSize: 11.5, color: 'var(--t3)', marginBottom: 10, letterSpacing: '.03em', textTransform: 'uppercase' }}>
            or try an example
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, justifyContent: 'center' }}>
            {EXAMPLES.map(u => (
              <button key={u} onClick={() => { setUsername(u); setError(''); }}
                className="btn btn-ghost"
                style={{ fontSize: 12, padding: '5px 11px', fontFamily: 'var(--mono)' }}>
                @{u}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Feature chips */}
        <motion.div {...up(.27)} style={{
          display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 40,
        }}>
          {['8 aesthetics', 'custom builder', 'live preview', 'free forever'].map(f => (
            <div key={f} style={{
              fontSize: 11.5, fontFamily: 'var(--sans)', color: 'var(--t3)',
              padding: '4px 10px', borderRadius: 99,
              background: 'var(--surf)', border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', gap: 5,
            }}>
              <span style={{ color: 'var(--a2)', fontSize: 9 }}>◆</span> {f}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
