const GITHUB_GRAPHQL_URL = 'https://api.github.com/graphql';
const LEETCODE_GRAPHQL_URL = 'https://leetcode.com/graphql';

function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function dayKey(date) {
  return date.toISOString().slice(0, 10);
}

function computeStreaks(days) {
  const activeDays = days
    .filter(day => day.count > 0)
    .map(day => day.date)
    .sort();

  if (!activeDays.length) {
    return { current: 0, longest: 0, total: 0 };
  }

  let longest = 1;
  let running = 1;

  for (let i = 1; i < activeDays.length; i += 1) {
    const prev = new Date(activeDays[i - 1]);
    const curr = new Date(activeDays[i]);
    const diff = Math.round((curr - prev) / 86400000);
    if (diff === 1) {
      running += 1;
      longest = Math.max(longest, running);
    } else {
      running = 1;
    }
  }

  const activeSet = new Set(activeDays);
  let current = 0;
  const cursor = new Date();
  while (activeSet.has(dayKey(cursor))) {
    current += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  if (current === 0) {
    cursor.setDate(cursor.getDate() - 1);
    while (activeSet.has(dayKey(cursor))) {
      current += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
  }

  const total = days.reduce((sum, day) => sum + day.count, 0);
  return { current, longest, total };
}

function flattenContributionDays(weeks = []) {
  return weeks.flatMap(week =>
    (week.contributionDays || []).map(day => ({
      date: day.date,
      count: day.contributionCount,
      level: day.contributionLevel,
      weekday: new Date(day.date).getDay(),
    }))
  );
}

export async function fetchGitHubLiveMetrics(username, token) {
  if (!token?.trim()) {
    throw new Error('A GitHub personal access token is required for contribution data.');
  }

  const graphqlQuery = {
    query: `
      query ProfileData($login: String!) {
        user(login: $login) {
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                  contributionLevel
                  date
                }
              }
            }
          }
        }
      }
    `,
    variables: { login: username },
  };

  const [graphqlRes, prsRes, mergedRes, issuesRes, reviewedRes] = await Promise.all([
    fetch(GITHUB_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(token),
      },
      body: JSON.stringify(graphqlQuery),
    }),
    fetch(`https://api.github.com/search/issues?q=type:pr+author:${encodeURIComponent(username)}`, {
      headers: { Accept: 'application/vnd.github+json', ...authHeaders(token) },
    }),
    fetch(`https://api.github.com/search/issues?q=type:pr+author:${encodeURIComponent(username)}+is:merged`, {
      headers: { Accept: 'application/vnd.github+json', ...authHeaders(token) },
    }),
    fetch(`https://api.github.com/search/issues?q=type:issue+author:${encodeURIComponent(username)}`, {
      headers: { Accept: 'application/vnd.github+json', ...authHeaders(token) },
    }),
    fetch(`https://api.github.com/search/issues?q=type:pr+reviewed-by:${encodeURIComponent(username)}`, {
      headers: { Accept: 'application/vnd.github+json', ...authHeaders(token) },
    }),
  ]);

  if (!graphqlRes.ok) {
    throw new Error('Failed to fetch GitHub contribution data. Check the token scopes.');
  }

  const graphqlJson = await graphqlRes.json();
  if (graphqlJson.errors?.length) {
    throw new Error(graphqlJson.errors[0].message || 'GitHub GraphQL request failed.');
  }

  const weeks =
    graphqlJson.data?.user?.contributionsCollection?.contributionCalendar?.weeks || [];
  const totalContributions =
    graphqlJson.data?.user?.contributionsCollection?.contributionCalendar?.totalContributions || 0;
  const days = flattenContributionDays(weeks);
  const streaks = computeStreaks(days);

  const parseCount = async (res) => {
    if (!res.ok) return 0;
    const json = await res.json();
    return json.total_count || 0;
  };

  const [totalPRs, mergedPRs, totalIssues, reviewedPRs] = await Promise.all([
    parseCount(prsRes),
    parseCount(mergedRes),
    parseCount(issuesRes),
    parseCount(reviewedRes),
  ]);

  return {
    totalContributions,
    contributionWeeks: weeks,
    contributionDays: days,
    streaks,
    prs: {
      total: totalPRs,
      merged: mergedPRs,
      reviewed: reviewedPRs,
    },
    trophies: {
      prCount: totalPRs,
      issueCount: totalIssues,
    },
  };
}

export async function fetchLeetCodeProfile(username) {
  if (!username?.trim()) {
    throw new Error('Enter a LeetCode username first.');
  }

  const query = {
    query: `
      query userPublicProfile($username: String!) {
        matchedUser(username: $username) {
          profile {
            ranking
          }
          submitStatsGlobal {
            acSubmissionNum {
              difficulty
              count
            }
          }
        }
      }
    `,
    variables: { username },
  };

  const res = await fetch(LEETCODE_GRAPHQL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(query),
  });

  if (!res.ok) {
    throw new Error('Failed to reach the LeetCode API.');
  }

  const json = await res.json();
  const matchedUser = json.data?.matchedUser;
  if (!matchedUser) {
    throw new Error('LeetCode user not found.');
  }

  const totals = matchedUser.submitStatsGlobal?.acSubmissionNum || [];
  const byDifficulty = Object.fromEntries(
    totals.map(item => [item.difficulty, item.count])
  );

  return {
    username,
    ranking: matchedUser.profile?.ranking || 0,
    easy: byDifficulty.Easy || 0,
    medium: byDifficulty.Medium || 0,
    hard: byDifficulty.Hard || 0,
    total: byDifficulty.All || 0,
  };
}
