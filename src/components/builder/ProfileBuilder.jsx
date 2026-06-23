import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createDefaultBlock, createDefaultProfile } from '../../builder/blockTypes';
import { exportReadme, downloadAll } from '../../builder/exportReadme';
import { fetchGitHubLiveMetrics, fetchLeetCodeProfile } from '../../services/liveData';
import {
  clearStoredSpotifyAuth,
  fetchSpotifyNowPlaying,
  getStoredSpotifyAuth,
  openSpotifyAuthPopup,
} from '../../services/spotifyAuth';
import BuilderCanvas from './BuilderCanvas';
import BuilderSidebar from './BuilderSidebar';
import BlockSettings from './BlockSettings';
import Step3Preview from '../Step3Preview';

export default function ProfileBuilder({ githubData, onBack, onReset }) {
  const [profile, setProfile] = useState(() => createDefaultProfile(githubData));
  const [selectedId, setSelectedId] = useState(null);
  const [showExport, setShowExport] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loadingAction, setLoadingAction] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [downloadingZip, setDownloadingZip] = useState(false);

  const selectedBlock = profile.blocks.find(b => b.id === selectedId) || null;

  const exportResult = useMemo(() => exportReadme(profile, githubData), [profile, githubData]);

  const handleAddBlock = useCallback((type, techIcon) => {
    const block = createDefaultBlock(type, githubData);

    if (type === 'tech-stack' && techIcon) {
      const existing = profile.blocks.find(b => b.type === 'tech-stack');
      if (existing) {
        const icons = existing.config.icons || [];
        if (!icons.find(i => i.id === techIcon.id)) {
          setProfile(p => ({
            ...p,
            blocks: p.blocks.map(b => b.id === existing.id
              ? { ...b, config: { ...b.config, icons: [...icons, techIcon] } }
              : b),
          }));
          setSelectedId(existing.id);
        }
        return;
      }
      block.config.icons = [techIcon];
    }

    setProfile(p => ({ ...p, blocks: [...p.blocks, block] }));
    setSelectedId(block.id);
  }, [githubData, profile.blocks]);

  const handleUpdateBlock = useCallback((updated) => {
    setProfile(p => ({
      ...p,
      blocks: p.blocks.map(b => b.id === updated.id ? updated : b),
    }));
  }, []);

  const handleRemove = useCallback((id) => {
    setProfile(p => ({ ...p, blocks: p.blocks.filter(b => b.id !== id) }));
    if (selectedId === id) setSelectedId(null);
  }, [selectedId]);

  const handleStyleChange = useCallback((style) => {
    setProfile(p => ({ ...p, style }));
  }, []);

  const patchBlocks = useCallback((updater) => {
    setProfile(prev => ({
      ...prev,
      blocks: prev.blocks.map(block => updater(block) || block),
    }));
  }, []);

  const handleFetchLeetCode = useCallback(async (block) => {
    setLoadingAction(`leetcode:${block.id}`);
    setStatusMessage('');
    try {
      const stats = await fetchLeetCodeProfile(block.config.username);
      handleUpdateBlock({ ...block, config: { ...block.config, ...stats } });
      setStatusMessage('LeetCode stats refreshed.');
    } catch (error) {
      setStatusMessage(error.message);
    } finally {
      setLoadingAction('');
    }
  }, [handleUpdateBlock]);

  const handleFetchGitHubMetrics = useCallback(async (block) => {
    setLoadingAction(`github:${block.id}`);
    setStatusMessage('');
    try {
      const metrics = await fetchGitHubLiveMetrics(githubData.username, block.config.githubToken);
      patchBlocks((candidate) => {
        if (candidate.type === 'github-stats') {
          return {
            ...candidate,
            config: {
              ...candidate.config,
              githubToken: block.config.githubToken,
              totalContributions: metrics.totalContributions,
            },
          };
        }
        if (candidate.type === 'activity-graph') {
          return {
            ...candidate,
            config: {
              ...candidate.config,
              githubToken: block.config.githubToken,
              contributionWeeks: metrics.contributionWeeks,
              totalContributions: metrics.totalContributions,
            },
          };
        }
        if (candidate.type === 'streak') {
          return {
            ...candidate,
            config: {
              ...candidate.config,
              githubToken: block.config.githubToken,
              current: metrics.streaks.current,
              longest: metrics.streaks.longest,
              total: metrics.totalContributions,
            },
          };
        }
        if (candidate.type === 'pr-stats') {
          return {
            ...candidate,
            config: {
              ...candidate.config,
              githubToken: block.config.githubToken,
              totalPRs: metrics.prs.total,
              merged: metrics.prs.merged,
              reviewed: metrics.prs.reviewed,
            },
          };
        }
        if (candidate.type === 'trophies') {
          return {
            ...candidate,
            config: {
              ...candidate.config,
              githubToken: block.config.githubToken,
              prCount: metrics.trophies.prCount,
              issueCount: metrics.trophies.issueCount,
            },
          };
        }
        return null;
      });
      setStatusMessage('GitHub live data refreshed.');
    } catch (error) {
      setStatusMessage(error.message);
    } finally {
      setLoadingAction('');
    }
  }, [githubData.username, patchBlocks]);

  const handleSpotifyConnect = useCallback(async (block) => {
    setLoadingAction(`spotify-connect:${block.id}`);
    setStatusMessage('');
    try {
      await openSpotifyAuthPopup(block.config.spotifyClientId);
      const auth = getStoredSpotifyAuth();
      const nowPlaying = await fetchSpotifyNowPlaying(auth);
      handleUpdateBlock({ ...block, config: { ...block.config, ...nowPlaying } });
      setStatusMessage('Spotify connected.');
    } catch (error) {
      setStatusMessage(error.message);
    } finally {
      setLoadingAction('');
    }
  }, [handleUpdateBlock]);

  const handleSpotifyRefresh = useCallback(async (block) => {
    setLoadingAction(`spotify-refresh:${block.id}`);
    setStatusMessage('');
    try {
      const auth = getStoredSpotifyAuth();
      const nowPlaying = await fetchSpotifyNowPlaying(auth);
      handleUpdateBlock({ ...block, config: { ...block.config, ...nowPlaying } });
      setStatusMessage('Spotify now playing refreshed.');
    } catch (error) {
      setStatusMessage(error.message);
    } finally {
      setLoadingAction('');
    }
  }, [handleUpdateBlock]);

  const handleSpotifyDisconnect = useCallback(() => {
    clearStoredSpotifyAuth();
    setStatusMessage('Spotify disconnected.');
  }, []);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(exportResult.markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Build a theme object for Step3Preview compatibility
  const previewTheme = useMemo(() => ({
    id: 'builder',
    name: 'Profile Builder',
    emoji: '✦',
    colors: [profile.style.accent, profile.style.muted, profile.style.text],
    generate: () => exportResult.markdown,
  }), [profile.style, exportResult.markdown]);

  if (showPreview) {
    return (
      <Step3Preview
        githubData={githubData}
        theme={previewTheme}
        onChangeTheme={() => setShowPreview(false)}
        onReset={onReset}
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100svh - 58px)' }}>
      {/* Toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px', height: 48,
        borderBottom: '1px solid var(--border)', background: 'var(--bg2)', flexShrink: 0,
      }}>
        <img src={githubData.avatar} alt="" style={{ width: 26, height: 26, borderRadius: '50%' }} />
        <div>
          <div style={{ fontFamily: 'var(--sans)', fontSize: 12.5, fontWeight: 600, color: 'var(--t1)' }}>
            Profile Builder
          </div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--t3)' }}>
            @{githubData.username} · {profile.blocks.length} blocks
          </div>
        </div>
        <div style={{ flex: 1 }} />
        <button onClick={onBack} className="btn btn-ghost" style={{ fontSize: 12 }}>← Themes</button>
        <button onClick={() => setShowPreview(true)} className="btn btn-ghost" style={{ fontSize: 12 }}>Preview</button>
        <button onClick={handleCopy} className="btn btn-ghost" style={{ fontSize: 12 }}>
          {copied ? '✓ Copied' : 'Copy MD'}
        </button>
        <button onClick={() => setShowExport(true)} className="btn btn-primary" style={{ fontSize: 12.5, padding: '7px 16px' }}>
          Generate README
        </button>
      </div>

      {statusMessage && (
        <div style={{
          padding: '8px 16px',
          background: 'var(--bg3)',
          borderBottom: '1px solid var(--border)',
          fontFamily: 'var(--sans)',
          fontSize: 12,
          color: 'var(--t2)',
        }}>
          {statusMessage}
        </div>
      )}

      {/* Main layout */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left: block settings */}
        <div style={{
          width: 260, flexShrink: 0, borderRight: '1px solid var(--border)',
          background: 'var(--bg)', display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}>
          <BlockSettings
            block={selectedBlock}
            onUpdate={handleUpdateBlock}
            githubData={githubData}
            onFetchLeetCode={handleFetchLeetCode}
            onFetchGitHubMetrics={handleFetchGitHubMetrics}
            onSpotifyConnect={handleSpotifyConnect}
            onSpotifyRefresh={handleSpotifyRefresh}
            onSpotifyDisconnect={handleSpotifyDisconnect}
            loadingAction={loadingAction}
          />
        </div>

        {/* Center: canvas */}
        <div style={{
          flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column',
          background: profile.style.bg,
        }}>
          <BuilderCanvas
            blocks={profile.blocks}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onReorder={blocks => setProfile(p => ({ ...p, blocks }))}
            onRemove={handleRemove}
            profile={profile}
            githubData={githubData}
          />
        </div>

        {/* Right: sidebar */}
        <BuilderSidebar
          onAddBlock={handleAddBlock}
          profile={profile}
          onStyleChange={handleStyleChange}
        />
      </div>

      {/* Footer */}
      <div style={{
        height: 36, flexShrink: 0, display: 'flex', alignItems: 'center',
        padding: '0 16px', gap: 12, borderTop: '1px solid var(--border)',
        background: 'var(--bg2)', fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--t3)',
      }}>
        <span>Profile Readme Generator</span>
        <span>·</span>
        <a href="https://github.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--t3)', textDecoration: 'none' }}>GitHub</a>
        <div style={{ flex: 1 }} />
        <span style={{ color: profile.style.accent }}>Self-hosted SVG widgets — no third-party stats APIs</span>
      </div>

      {/* Export modal */}
      <AnimatePresence>
        {showExport && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowExport(false)}
            style={{
              position: 'fixed', inset: 0, zIndex: 200,
              background: 'rgba(0,0,0,.65)', backdropFilter: 'blur(6px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
            }}>
            <motion.div
              initial={{ scale: .95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: .95, y: 10 }}
              onClick={e => e.stopPropagation()}
              style={{
                background: 'var(--bg2)', borderRadius: 16, padding: 28,
                maxWidth: 480, width: '100%', border: '1px solid var(--border)',
                boxShadow: '0 24px 64px rgba(0,0,0,.5)',
              }}>
              <h2 className="serif" style={{ fontSize: 24, color: 'var(--t1)', marginBottom: 8 }}>
                Your README is ready
              </h2>
              <p style={{ fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--t2)', lineHeight: 1.6, marginBottom: 20 }}>
                Downloads one ZIP with <code style={{ fontFamily: 'var(--mono)', fontSize: 11 }}>README.md</code> and{' '}
                {exportResult.assets.length} SVG asset{exportResult.assets.length !== 1 ? 's' : ''} inside{' '}
                <code style={{ fontFamily: 'var(--mono)', fontSize: 11 }}>assets/readme-vibe/</code>.
              </p>

              <div style={{
                background: 'var(--bg)', borderRadius: 10, padding: 12, marginBottom: 20,
                border: '1px solid var(--border)', maxHeight: 120, overflowY: 'auto',
              }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--t3)', marginBottom: 6 }}>ZIP CONTENTS</div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--t2)', padding: '2px 0' }}>📦 readme-vibe-export.zip</div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--t2)', padding: '2px 0 2px 14px' }}>📄 README.md</div>
                {exportResult.assets.map(a => (
                  <div key={a.filename} style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--t2)', padding: '2px 0 2px 14px' }}>
                    🖼 assets/readme-vibe/{a.filename}
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-primary" style={{ flex: 1 }}
                  disabled={downloadingZip}
                  onClick={async () => {
                    setDownloadingZip(true);
                    setStatusMessage('');
                    try {
                      await downloadAll(exportResult);
                      setStatusMessage('ZIP download started. Check your downloads folder.');
                      window.setTimeout(() => setShowExport(false), 600);
                    } catch (error) {
                      setStatusMessage(error?.message || 'ZIP download failed. Try again.');
                    } finally {
                      setDownloadingZip(false);
                    }
                  }}>
                  {downloadingZip ? 'Preparing ZIP…' : 'Download ZIP'}
                </button>
                <button className="btn btn-ghost" onClick={() => setShowPreview(true)}>
                  Full Preview
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
