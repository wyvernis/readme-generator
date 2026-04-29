export async function fetchGitHubData(username) {
  const headers = { 'Accept': 'application/vnd.github.v3+json' };

  const [userRes, reposRes] = await Promise.all([
    fetch(`https://api.github.com/users/${username}`, { headers }),
    fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=stargazers`, { headers }),
  ]);

  if (!userRes.ok) {
    if (userRes.status === 404) throw new Error('User not found. Check the username and try again.');
    if (userRes.status === 403) throw new Error('GitHub API rate limit hit. Try again in a minute.');
    throw new Error('Failed to fetch GitHub data.');
  }

  const user = await userRes.json();
  const repos = reposRes.ok ? await reposRes.json() : [];

  // Top languages
  const langCount = {};
  repos.forEach(r => {
    if (r.language) langCount[r.language] = (langCount[r.language] || 0) + 1;
  });
  const topLangs = Object.entries(langCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([lang]) => lang);

  // Top repos by stars
  const topRepos = [...repos]
    .filter(r => !r.fork)
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 6);

  const totalStars = repos.reduce((s, r) => s + r.stargazers_count, 0);

  return {
    username: user.login,
    name: user.name || user.login,
    bio: user.bio || '',
    avatar: user.avatar_url,
    location: user.location || '',
    blog: user.blog || '',
    company: user.company || '',
    twitter: user.twitter_username || '',
    followers: user.followers,
    following: user.following,
    publicRepos: user.public_repos,
    topLangs,
    topRepos,
    totalStars,
    createdAt: user.created_at,
  };
}
