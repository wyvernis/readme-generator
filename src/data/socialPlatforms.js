export const SOCIAL_PLATFORMS = [
  { id: 'github', name: 'GitHub', slug: 'github', color: '#181717' },
  { id: 'linkedin', name: 'LinkedIn', slug: 'linkedin', color: '#0A66C2' },
  { id: 'twitter', name: 'X / Twitter', slug: 'x', color: '#000000' },
  { id: 'instagram', name: 'Instagram', slug: 'instagram', color: '#E4405F' },
  { id: 'youtube', name: 'YouTube', slug: 'youtube', color: '#FF0000' },
  { id: 'discord', name: 'Discord', slug: 'discord', color: '#5865F2' },
  { id: 'twitch', name: 'Twitch', slug: 'twitch', color: '#9146FF' },
  { id: 'reddit', name: 'Reddit', slug: 'reddit', color: '#FF4500' },
  { id: 'devto', name: 'Dev.to', slug: 'devdotto', color: '#0A0A0A' },
  { id: 'hashnode', name: 'Hashnode', slug: 'hashnode', color: '#2962FF' },
  { id: 'medium', name: 'Medium', slug: 'medium', color: '#000000' },
  { id: 'stackoverflow', name: 'Stack Overflow', slug: 'stackoverflow', color: '#F58025' },
  { id: 'leetcode', name: 'LeetCode', slug: 'leetcode', color: '#FFA116' },
  { id: 'codepen', name: 'CodePen', slug: 'codepen', color: '#000000' },
  { id: 'dribbble', name: 'Dribbble', slug: 'dribbble', color: '#EA4C89' },
  { id: 'behance', name: 'Behance', slug: 'behance', color: '#1769FF' },
  { id: 'portfolio', name: 'Portfolio', slug: 'googlechrome', color: '#4285F4' },
  { id: 'email', name: 'Email', slug: 'gmail', color: '#EA4335' },
];

export function socialIconUrl(slug) {
  return `https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/${slug}.svg`;
}
