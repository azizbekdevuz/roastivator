export interface GitHubUser {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
  name: string | null;
  company: string | null;
  blog: string;
  location: string | null;
  email: string | null;
  hireable: boolean | null;
  bio: string | null;
  twitter_username: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface GitHubRepo {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  private: boolean;
  owner: GitHubUser;
  html_url: string;
  description: string | null;
  fork: boolean;
  url: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  git_url: string;
  ssh_url: string;
  clone_url: string;
  svn_url: string;
  homepage: string | null;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  has_issues: boolean;
  has_projects: boolean;
  has_wiki: boolean;
  has_pages: boolean;
  has_downloads: boolean;
  archived: boolean;
  disabled: boolean;
  open_issues_count: number;
  license: {
    key: string;
    name: string;
    spdx_id: string;
    url: string;
    node_id: string;
  } | null;
  allow_forking: boolean;
  is_template: boolean;
  topics: string[];
  visibility: string;
  forks: number;
  open_issues: number;
  watchers: number;
  default_branch: string;
}

export interface GitHubCommit {
  sha: string;
  node_id: string;
  commit: {
    author: {
      name: string;
      email: string;
      date: string;
    };
    committer: {
      name: string;
      email: string;
      date: string;
    };
    message: string;
    tree: {
      sha: string;
      url: string;
    };
    url: string;
    comment_count: number;
    verification: {
      verified: boolean;
      reason: string;
      signature: string | null;
      payload: string | null;
    };
  };
  url: string;
  html_url: string;
  comments_url: string;
  author: GitHubUser | null;
  committer: GitHubUser | null;
  parents: Array<{
    sha: string;
    url: string;
    html_url: string;
  }>;
}

export interface GitHubData {
  user: GitHubUser;
  repos: GitHubRepo[];
  commits: GitHubCommit[];
}

export interface RoastResult {
  overallRoast: string;
  commitMessageRoasts: string[];
  contributionRoasts: string[];
  emojiRoasts: string[];
  repositoryRoasts: string[];
  score: number;
  metrics: {
    totalRepos: number;
    totalCommits: number;
    accountAgeYears: number;
    followerRatio: number;
    emojiUsagePercentage: number;
    averageCommitMessageLength: number;
    forkPercentage: number;
    starsReceived: number;
  };
}

export interface RoastAnalysisConfig {
  maxReposToAnalyze: number;
  maxCommitsPerRepo: number;
  minimumAccountAgeForRoasting: number;
  roastingSeverityLevel: 1 | 2 | 3 | 4 | 5;
  enableEasterEggs: boolean;
}

export type RoastCategory = 'profile' | 'commits' | 'contributions' | 'emojis' | 'repositories';

export type LoadingStep = 'fetching-user' | 'fetching-repos' | 'fetching-commits' | 'analyzing' | 'roasting';

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  status: 'success' | 'error';
  timestamp: string;
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
  used: number;
}