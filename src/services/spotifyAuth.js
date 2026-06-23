const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize';
const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';
const SPOTIFY_SCOPE = 'user-read-currently-playing user-read-playback-state';
const STORAGE_KEY = 'rv-spotify-auth';

function randomString(length = 64) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from(crypto.getRandomValues(new Uint8Array(length)))
    .map(v => chars[v % chars.length])
    .join('');
}

async function sha256(input) {
  const data = new TextEncoder().encode(input);
  return crypto.subtle.digest('SHA-256', data);
}

function base64Url(buffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function callbackUrl() {
  return `${window.location.origin}/spotify-callback.html`;
}

function popupFeatures() {
  return 'popup=yes,width=560,height=760,menubar=no,toolbar=no,status=no';
}

export async function openSpotifyAuthPopup(clientId) {
  if (!clientId?.trim()) {
    throw new Error('Spotify client ID is required.');
  }

  const verifier = randomString(64);
  const challenge = base64Url(await sha256(verifier));
  const state = randomString(32);

  sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
    clientId,
    verifier,
    state,
    redirectUri: callbackUrl(),
  }));

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: callbackUrl(),
    code_challenge_method: 'S256',
    code_challenge: challenge,
    scope: SPOTIFY_SCOPE,
    state,
  });

  const popup = window.open(`${SPOTIFY_AUTH_URL}?${params.toString()}`, 'rv-spotify-auth', popupFeatures());
  if (!popup) {
    throw new Error('Popup blocked. Allow popups for this site and try again.');
  }

  return new Promise((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      cleanup();
      reject(new Error('Spotify login timed out.'));
    }, 120000);

    function cleanup() {
      window.clearTimeout(timeout);
      window.removeEventListener('message', onMessage);
    }

    async function onMessage(event) {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type !== 'rv-spotify-auth-code') return;

      cleanup();

      if (event.data.error) {
        reject(new Error(event.data.error));
        return;
      }

      try {
        const tokens = await exchangeCodeForToken(event.data.code);
        resolve(tokens);
      } catch (error) {
        reject(error);
      }
    }

    window.addEventListener('message', onMessage);
  });
}

export async function exchangeCodeForToken(code) {
  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (!stored) {
    throw new Error('Missing Spotify auth session.');
  }

  const { clientId, verifier, redirectUri } = JSON.parse(stored);
  const body = new URLSearchParams({
    client_id: clientId,
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
    code_verifier: verifier,
  });

  const res = await fetch(SPOTIFY_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  if (!res.ok) {
    throw new Error('Failed to exchange Spotify authorization code.');
  }

  const json = await res.json();
  const tokenState = {
    clientId,
    accessToken: json.access_token,
    refreshToken: json.refresh_token,
    expiresAt: Date.now() + ((json.expires_in || 3600) * 1000),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(tokenState));
  sessionStorage.removeItem(STORAGE_KEY);
  return tokenState;
}

export function getStoredSpotifyAuth() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function clearStoredSpotifyAuth() {
  localStorage.removeItem(STORAGE_KEY);
  sessionStorage.removeItem(STORAGE_KEY);
}

export async function refreshSpotifyTokenIfNeeded(auth) {
  if (!auth?.refreshToken) {
    throw new Error('Spotify account is not connected.');
  }

  if (auth.expiresAt && auth.expiresAt > Date.now() + 60000) {
    return auth;
  }

  const body = new URLSearchParams({
    client_id: auth.clientId,
    grant_type: 'refresh_token',
    refresh_token: auth.refreshToken,
  });

  const res = await fetch(SPOTIFY_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  if (!res.ok) {
    throw new Error('Failed to refresh Spotify access token.');
  }

  const json = await res.json();
  const next = {
    ...auth,
    accessToken: json.access_token,
    refreshToken: json.refresh_token || auth.refreshToken,
    expiresAt: Date.now() + ((json.expires_in || 3600) * 1000),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export async function fetchSpotifyNowPlaying(auth) {
  const readyAuth = await refreshSpotifyTokenIfNeeded(auth);
  const res = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
    headers: {
      Authorization: `Bearer ${readyAuth.accessToken}`,
    },
  });

  if (res.status === 204) {
    return { track: 'Nothing playing right now', artist: 'Spotify', albumArt: '', isPlaying: false };
  }

  if (!res.ok) {
    throw new Error('Failed to fetch Spotify playback state.');
  }

  const json = await res.json();
  return {
    track: json.item?.name || 'Unknown track',
    artist: (json.item?.artists || []).map(artist => artist.name).join(', ') || 'Unknown artist',
    albumArt: json.item?.album?.images?.[0]?.url || '',
    isPlaying: Boolean(json.is_playing),
  };
}
