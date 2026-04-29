import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Step1Username from './components/Step1Username';
import Step2Vibe from './components/Step2Vibe';
import Step3Preview from './components/Step3Preview';
import BgParticles from './components/BgParticles';

export default function App() {
  const [step, setStep] = useState(1);
  const [githubData, setGithubData] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [colorTheme, setColorTheme] = useState('dark');

  useEffect(() => {
    const saved = localStorage.getItem('rv-theme') || 'dark';
    setColorTheme(saved);
    document.documentElement.setAttribute('data-theme', saved);
  }, []);

  const toggleTheme = useCallback(() => {
    const next = colorTheme === 'dark' ? 'light' : 'dark';
    setColorTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('rv-theme', next);
  }, [colorTheme]);

  const handleDataFetched = useCallback((data) => { setGithubData(data); setStep(2); }, []);
  const handleThemeSelected = useCallback((t) => { setSelectedTheme(t); setStep(3); }, []);
  const handleReset = useCallback(() => { setStep(1); setGithubData(null); setSelectedTheme(null); }, []);
  const handleChangeTheme = useCallback(() => { setStep(2); setSelectedTheme(null); }, []);

  const STEPS = [
    { n: 1, label: 'Username' },
    { n: 2, label: 'Vibe' },
    { n: 3, label: 'Readme' },
  ];

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100svh' }}>
      <BgParticles colorTheme={colorTheme} />

      {/* ── Header ───────────────────────────────── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px', height: 58,
        background: colorTheme === 'dark'
          ? 'rgba(8,8,14,.88)'
          : 'rgba(247,247,252,.9)',
        backdropFilter: 'blur(14px)',
        borderBottom: '1px solid var(--border)',
        transition: 'background .25s',
      }}>

        {/* Logo */}
        <button onClick={handleReset}
          style={{
            display: 'flex', alignItems: 'center', gap: 9,
            background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: 'linear-gradient(135deg, var(--a1), var(--a2))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, color: '#fff', fontWeight: 700,
            boxShadow: '0 0 14px var(--glow)',
          }}>✦</div>
          <span style={{
            fontFamily: 'var(--serif)', fontSize: 16,
            color: 'var(--t1)', letterSpacing: '-.01em',
          }}>readme.vibe</span>
        </button>

        {/* Steps */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {STEPS.map(({ n, label }) => {
            const done   = step > n;
            const active = step === n;
            return (
              <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: active ? '4px 11px 4px 5px' : '4px 5px',
                  borderRadius: 99, transition: 'all .35s ease',
                  background: (done || active)
                    ? 'linear-gradient(135deg, var(--a1), var(--a2))'
                    : 'var(--surf)',
                  border: '1px solid',
                  borderColor: (done || active) ? 'transparent' : 'var(--border)',
                  boxShadow: active ? '0 0 14px var(--glow)' : 'none',
                }}>
                  <div style={{
                    width: 19, height: 19, borderRadius: '50%', flexShrink: 0,
                    background: (done || active) ? 'rgba(255,255,255,.22)' : 'var(--surf2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 9.5, fontFamily: 'var(--mono)', fontWeight: 700,
                    color: (done || active) ? '#fff' : 'var(--t3)',
                  }}>{done ? '✓' : n}</div>
                  {active && (
                    <span style={{
                      fontSize: 11.5, fontFamily: 'var(--sans)', fontWeight: 500,
                      color: '#fff', lineHeight: 1,
                    }}>{label}</span>
                  )}
                </div>
                {n < 3 && (
                  <div style={{
                    width: 16, height: 1, opacity: .5,
                    background: step > n ? 'var(--a2)' : 'var(--border2)',
                    transition: 'background .4s',
                  }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Theme toggle */}
        <button onClick={toggleTheme} className="btn btn-ghost"
          style={{ padding: '7px 8px', borderRadius: 9, minWidth: 34 }}
          aria-label="Toggle theme">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={colorTheme}
              initial={{ rotate: -60, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 60, opacity: 0 }} transition={{ duration: .2 }}
              style={{ display: 'flex', lineHeight: 1, fontSize: 15 }}>
              {colorTheme === 'dark' ? '☀' : '◐'}
            </motion.span>
          </AnimatePresence>
        </button>
      </header>

      {/* ── Main ─────────────────────────────────── */}
      <main style={{ position: 'relative', zIndex: 10 }}>
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="s1"
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }} transition={{ duration: .35, ease: [.22,1,.36,1] }}>
              <Step1Username onDataFetched={handleDataFetched} />
            </motion.div>
          )}
          {step === 2 && githubData && (
            <motion.div key="s2"
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }} transition={{ duration: .35, ease: [.22,1,.36,1] }}>
              <Step2Vibe githubData={githubData} onThemeSelected={handleThemeSelected} />
            </motion.div>
          )}
          {step === 3 && githubData && selectedTheme && (
            <motion.div key="s3"
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }} transition={{ duration: .35, ease: [.22,1,.36,1] }}>
              <Step3Preview
                githubData={githubData}
                theme={selectedTheme}
                onChangeTheme={handleChangeTheme}
                onReset={handleReset}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
