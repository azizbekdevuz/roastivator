'use client';

import { useMemo } from 'react';
import { GitHubData, RoastResult, RoastCategory } from '../types/github';
import { ROAST_CONFIG, ROAST_PATTERNS, EASTER_EGGS } from '../constants';

interface UseRoastingReturn {
  generateRoast: (data: GitHubData) => RoastResult;
  getRoastSeverity: (score: number) => 'mild' | 'medium' | 'spicy' | 'nuclear';
  getCategoryInsights: (data: GitHubData) => Record<RoastCategory, number>;
}

export const useRoasting = (): UseRoastingReturn => {
  const generateRoast = useMemo(() => (data: GitHubData): RoastResult => {
    const { user, repos, commits } = data;
    
    const roasts: RoastResult = {
      overallRoast: '',
      commitMessageRoasts: [],
      contributionRoasts: [],
      emojiRoasts: [],
      repositoryRoasts: [],
      score: 0,
      metrics: {
        totalRepos: repos.length,
        totalCommits: commits.length,
        accountAgeYears: Math.floor((Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24 * 365)),
        followerRatio: user.followers / Math.max(user.following, 1),
        emojiUsagePercentage: 0,
        averageCommitMessageLength: 0,
        forkPercentage: (repos.filter(r => r.fork).length / Math.max(repos.length, 1)) * 100,
        starsReceived: repos.reduce((sum, repo) => sum + repo.stargazers_count, 0),
      },
    };

    // Check for easter eggs first
    if (ROAST_CONFIG.enableEasterEggs && EASTER_EGGS[user.login.toLowerCase() as keyof typeof EASTER_EGGS]) {
      const easterEgg = EASTER_EGGS[user.login.toLowerCase() as keyof typeof EASTER_EGGS];
      roasts.overallRoast = easterEgg.roast;
      roasts.score = easterEgg.score;
      return roasts;
    }

    // Analyze commit messages
    const commitMessages = commits.map(c => c.commit.message);
    roasts.metrics.averageCommitMessageLength = commitMessages.length > 0 
      ? Math.round(commitMessages.reduce((sum, msg) => sum + msg.length, 0) / commitMessages.length)
      : 0;

    // Analyze lazy commit patterns
    ROAST_PATTERNS.commitMessages.lazy.forEach(({ pattern, severity }) => {
      const matches = commitMessages.filter(msg => pattern.test(msg.split('\n')[0]));
      if (matches.length > 0) {
        const percentage = Math.round((matches.length / commitMessages.length) * 100);
        roasts.commitMessageRoasts.push(
          generateCommitRoast(pattern.source, matches.length, percentage)
        );
        roasts.score += severity;
      }
    });

    // Analyze professional commit patterns (reduce score)
    ROAST_PATTERNS.commitMessages.professional.forEach(({ pattern, severity }) => {
      const matches = commitMessages.filter(msg => pattern.test(msg.split('\n')[0]));
      if (matches.length > commitMessages.length * 0.3) {
        roasts.score += severity; // Negative severity reduces score
      }
    });

    // Analyze emoji usage
    const emojiPattern = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
    const emojiCommits = commitMessages.filter(msg => emojiPattern.test(msg));
    roasts.metrics.emojiUsagePercentage = commitMessages.length > 0 
      ? Math.round((emojiCommits.length / commitMessages.length) * 100)
      : 0;

    if (roasts.metrics.emojiUsagePercentage > 30) {
      roasts.emojiRoasts.push(
        `${roasts.metrics.emojiUsagePercentage}% of your commits contain emojis. This isn't Instagram, it's a professional development platform. Save the 🔥💯✨ for your personal blog.`
      );
      roasts.score += 2;
    }

    const overlyEnthusiasticMatches = commitMessages.join(' ').match(ROAST_PATTERNS.emojis.overused);
    if (overlyEnthusiasticMatches && overlyEnthusiasticMatches.length > 10) {
      roasts.emojiRoasts.push(
        `${overlyEnthusiasticMatches.length} rocket ships and fire emojis? Your commit history reads like a motivational poster made by someone having a breakdown.`
      );
      roasts.score += 1;
    }

    // Analyze repository patterns
    const suspiciousRepos = repos.filter(repo => 
      ROAST_PATTERNS.repositories.suspicious.test(repo.name)
    );
    
    if (suspiciousRepos.length > repos.length * 0.4) {
      roasts.repositoryRoasts.push(
        `${suspiciousRepos.length} repos with names like "test", "demo", or "practice"? Your GitHub looks like a computer science homework folder that never graduated.`
      );
      roasts.score += 2;
    }

    // Analyze contribution patterns
    const recentCommits = commits.filter(c => {
      const commitDate = new Date(c.commit.author.date);
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      return commitDate > threeMonthsAgo;
    });

    if (recentCommits.length === 0 && roasts.metrics.accountAgeYears > 0.5) {
      roasts.contributionRoasts.push(
        "No commits in the last 3 months? Your GitHub graph looks like a flatline monitor. Are you sure you're still breathing?"
      );
      roasts.score += 3;
    } else if (recentCommits.length < 10 && roasts.metrics.accountAgeYears > 1) {
      roasts.contributionRoasts.push(
        `Only ${recentCommits.length} commits in 3 months? That's fewer commits than days in a week. Maybe try coding more than just when Mercury is in retrograde?`
      );
      roasts.score += 1;
    }

    // Repository quality analysis
    if (roasts.metrics.starsReceived === 0 && repos.length > 5) {
      roasts.contributionRoasts.push(
        "Zero stars across all your repositories. Even your mom hasn't starred your repos. That's not indie, that's just digital abandonment."
      );
      roasts.score += 2;
    }

    if (roasts.metrics.forkPercentage > 70) {
      roasts.contributionRoasts.push(
        `${Math.round(roasts.metrics.forkPercentage)}% of your repos are forks. That's not contributing to open source, that's just digital hoarding with extra steps.`
      );
      roasts.score += 1;
    }

    // Generate overall roast
    roasts.overallRoast = generateOverallRoast(user, roasts.metrics);

    // Ensure reasonable score bounds
    roasts.score = Math.max(1, Math.min(roasts.score, 10));

    return roasts;
  }, []);

  const getRoastSeverity = useMemo(() => (score: number): 'mild' | 'medium' | 'spicy' | 'nuclear' => {
    if (score <= 3) return 'mild';
    if (score <= 5) return 'medium';
    if (score <= 7) return 'spicy';
    return 'nuclear';
  }, []);

  const getCategoryInsights = useMemo(() => (data: GitHubData): Record<RoastCategory, number> => {
    const { user, repos, commits } = data;
    
    return {
      profile: calculateProfileScore(user),
      commits: calculateCommitScore(commits),
      contributions: calculateContributionScore(repos, commits),
      emojis: calculateEmojiScore(commits),
      repositories: calculateRepositoryScore(repos),
    };
  }, []);

  return {
    generateRoast,
    getRoastSeverity,
    getCategoryInsights,
  };
};

// Helper functions
function generateCommitRoast(pattern: string, count: number, percentage: number): string {
  const roastMap: Record<string, string> = {
    '^fix$|^fixed$|^fixes$': `${count} commits with just "fix" - The most intellectually bankrupt commit message in existence. What did you fix? Your breakfast? Your relationship with your parents?`,
    '^update$|^updated$': `${count} "update" commits - Ah yes, very descriptive. You updated something. Somewhere. Maybe. This is why documentation exists, genius.`,
    '^wip$|^work in progress$': `${count} "WIP" commits - Still committing work-in-progress? That's not version control, that's just broadcasting your inability to finish anything.`,
    '^oops$|^whoops$': `${count} "oops" commits - These suggest you treat Git like your personal diary of mistakes. Professional tip: test before you commit.`,
  };

  return roastMap[pattern] || `${count} lazy commit messages (${percentage}% of your commits) - Your future self is crying.`;
}

function generateOverallRoast(user: { name: string | null; login: string; following: number; followers: number }, metrics: { accountAgeYears: number; totalRepos: number; starsReceived: number }): string {
  const templates = [
    `${user.name || user.login} has been on GitHub for ${metrics.accountAgeYears} years with ${metrics.totalRepos} repositories. That's roughly ${(metrics.totalRepos / Math.max(metrics.accountAgeYears, 0.1)).toFixed(1)} repos per year. I've seen glaciers move faster.`,
    `${user.name || user.login} follows ${user.following} people but only has ${user.followers} followers. That follow-to-follower ratio is worse than a spam bot. Maybe try writing code that people actually want to see?`,
    `${user.name || user.login} has ${metrics.starsReceived} total stars across ${metrics.totalRepos} repositories. That's an average of ${(metrics.starsReceived / Math.max(metrics.totalRepos, 1)).toFixed(1)} stars per repo. Even tutorial repositories get more love.`,
  ];

  if (metrics.totalRepos === 0) {
    return `${user.name || user.login} has ${metrics.accountAgeYears} year${metrics.accountAgeYears > 1 ? 's' : ''} on GitHub and ZERO public repos. That's not minimalism, that's just digital hoarding of potential.`;
  }

  return templates[Math.floor(Math.random() * templates.length)];
}

function calculateProfileScore(user: { bio: string | null; location: string | null; blog: string; public_repos: number; followers: number }): number {
  let score = 5; // Base score
  
  if (!user.bio) score += 1;
  if (!user.location) score += 0.5;
  if (!user.blog) score += 0.5;
  if (user.public_repos === 0) score += 3;
  if (user.followers === 0 && user.public_repos > 5) score += 2;
  
  return Math.min(score, 10);
}

function calculateCommitScore(commits: { commit: { message: string } }[]): number {
  if (commits.length === 0) return 8;
  
  const messages = commits.map(c => c.commit.message);
  const lazyMessages = messages.filter(msg => 
    /^(fix|update|wip|oops|test|stuff)$/i.test(msg.split('\n')[0])
  );
  
  return Math.min(5 + (lazyMessages.length / messages.length) * 5, 10);
}

function calculateContributionScore(repos: { fork: boolean }[], commits: { commit: { author: { date: string } } }[]): number {
  let score = 3; // Base score
  
  const forkPercentage = (repos.filter(r => r.fork).length / Math.max(repos.length, 1)) * 100;
  if (forkPercentage > 70) score += 2;
  
  const recentCommits = commits.filter(c => {
    const commitDate = new Date(c.commit.author.date);
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    return commitDate > threeMonthsAgo;
  });
  
  if (recentCommits.length === 0) score += 3;
  else if (recentCommits.length < 10) score += 1;
  
  return Math.min(score, 10);
}

function calculateEmojiScore(commits: { commit: { message: string } }[]): number {
  if (commits.length === 0) return 5;
  
  const messages = commits.map(c => c.commit.message);
  const emojiPattern = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
  const emojiCommits = messages.filter(msg => emojiPattern.test(msg));
  
  const emojiPercentage = (emojiCommits.length / messages.length) * 100;
  
  if (emojiPercentage > 50) return 9;
  if (emojiPercentage > 30) return 7;
  if (emojiPercentage > 15) return 5;
  return 3;
}

function calculateRepositoryScore(repos: { description: string | null; stargazers_count: number; name: string }[]): number {
  if (repos.length === 0) return 10;
  
  let score = 3;
  
  const withoutDescription = repos.filter(r => !r.description || r.description.trim() === '');
  if (withoutDescription.length > repos.length * 0.6) score += 2;
  
  const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
  if (totalStars === 0 && repos.length > 5) score += 2;
  
  const suspiciousNames = repos.filter(repo => 
    ROAST_PATTERNS.repositories.suspicious.test(repo.name)
  );
  if (suspiciousNames.length > repos.length * 0.4) score += 1;
  
  return Math.min(score, 10);
}