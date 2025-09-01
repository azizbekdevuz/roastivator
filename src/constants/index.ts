import { RoastAnalysisConfig } from '../types/github';

export const APP_CONFIG = {
  name: 'Roastivator',
  version: '1.0.0',
  description: 'GitHub Profile Roaster',
  github: {
    apiUrl: 'https://api.github.com',
    userAgent: 'Roastivator-App',
    rateLimit: {
      requestsPerHour: 60,
      burstLimit: 10,
    },
  },
  ui: {
    animationDuration: 300,
    loadingMessageInterval: 2000,
    maxUsernameLength: 39, // GitHub max username length
    minUsernameLength: 1,
  },
} as const;

export const ROAST_CONFIG: RoastAnalysisConfig = {
  maxReposToAnalyze: 30,
  maxCommitsPerRepo: 10,
  minimumAccountAgeForRoasting: 0,
  roastingSeverityLevel: 3,
  enableEasterEggs: true,
} as const;

export const ROAST_PATTERNS = {
  commitMessages: {
    lazy: [
      { pattern: /^fix$|^fixed$|^fixes$/i, severity: 3 },
      { pattern: /^update$|^updated$/i, severity: 2 },
      { pattern: /^wip$|^work in progress$/i, severity: 4 },
      { pattern: /^oops$|^whoops$/i, severity: 4 },
      { pattern: /^lol$|^haha$|^lmao$/i, severity: 2 },
      { pattern: /^asdf$|^test$|^testing$/i, severity: 3 },
      { pattern: /^stuff$|^things$/i, severity: 3 },
      { pattern: /^temp$|^temporary$/i, severity: 2 },
      { pattern: /^refactor$/i, severity: 2 },
      { pattern: /^cleanup$/i, severity: 2 },
    ],
    professional: [
      { pattern: /^feat(\(.+\))?:|^feature:/i, severity: -1 },
      { pattern: /^fix(\(.+\))?:|^bugfix:/i, severity: -1 },
      { pattern: /^docs(\(.+\))?:/i, severity: -1 },
      { pattern: /^style(\(.+\))?:/i, severity: -1 },
      { pattern: /^refactor(\(.+\))?:/i, severity: -1 },
      { pattern: /^test(\(.+\))?:/i, severity: -1 },
    ],
  },
  repositories: {
    suspicious: /test|demo|practice|tutorial|learning|copy|clone|backup|playground|sandbox/i,
    professional: /api|service|lib|framework|tool|cli|sdk|package|module/i,
  },
  emojis: {
    overused: /🎉|🚀|💯|✨|🔥|❤️|👍|🎊|🌟/g,
    professional: /📝|🐛|⚡|🔧|📦|🎯|🔍|💡/g,
  },
} as const;

export const LOADING_MESSAGES = [
  "Scanning repositories for crimes against humanity...",
  "Analyzing commit messages that would make your CS professor cry...",
  "Counting emoji usage and judging you for it...",
  "Discovering coding patterns that defy all logic...",
  "Measuring the gap between your ambition and actual output...",
  "Calculating your ratio of TODO comments to actual features...",
  "Finding evidence of copy-paste programming...",
  "Detecting signs of Stack Overflow dependency...",
  "Evaluating your relationship with proper documentation...",
  "Assessing the creativity of your variable names...",
  "Checking if you actually test your code...",
  "Analyzing your commit frequency vs. coffee consumption...",
] as const;

export const EASTER_EGGS = {
  'torvalds': {
    roast: "Linus Torvalds? Really? The man who created Linux and Git is being roasted by a website that probably runs on his inventions. The audacity is almost as impressive as your kernel contributions.",
    score: 1,
  },
  'gaearon': {
    roast: "Dan Abramov getting roasted? The React team might revoke your JSX privileges for this. Your useEffect hooks are cleaner than most people's entire codebases.",
    score: 1,
  },
  'sindresorhus': {
    roast: "Sindre Sorhus? You have more npm packages than most people have GitHub repos. You're basically the human embodiment of 'npm install everything'.",
    score: 1,
  },
  'addyosmani': {
    roast: "Addy Osmani? The man who wrote half the web performance guidelines is here for a roast? Your Lighthouse scores are probably perfect, aren't they?",
    score: 1,
  },
  'tj': {
    roast: "TJ Holowaychuk? The Express.js and Koa creator? You've probably forgotten more JavaScript frameworks than most people have ever learned.",
    score: 1,
  },
  'kentcdodds': {
    roast: "Kent C. Dodds? The testing guru himself? Your test coverage is probably so high it makes other developers question their life choices.",
    score: 1,
  },
  'wesbos': {
    roast: "Wes Bos? The man who taught half the internet JavaScript? Your courses probably have better documentation than most production codebases.",
    score: 1,
  },
} as const;

export const DEMO_USERNAMES = ['octocat', 'defunkt', 'mojombo', 'pjhyett', 'wycats', 'dhh', 'fabpot', 'taylorotwell'] as const;

export const VALIDATION_RULES = {
  username: {
    minLength: 1,
    maxLength: 39,
    pattern: /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i,
    forbiddenNames: ['api', 'www', 'admin', 'root', 'support'],
  },
} as const;

export const API_ENDPOINTS = {
  github: {
    user: (username: string) => `/api/github?username=${username}&type=user`,
    repos: (username: string) => `/api/github?username=${username}&type=repos`,
    commits: (username: string, repo: string) => `/api/github?username=${username}&type=commits&repo=${repo}`,
  },
} as const;