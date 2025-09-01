import { GitHubUser, GitHubRepo, GitHubCommit, ApiResponse, RateLimitInfo } from '../types/github';
import { API_ENDPOINTS } from '../constants';

export class GitHubClientError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public rateLimitInfo?: RateLimitInfo
  ) {
    super(message);
    this.name = 'GitHubClientError';
  }
}

export class GitHubClient {
  constructor() {
    // Configuration is handled in API routes
  }

  private async fetchWithErrorHandling<T>(url: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(url);
      
      const rateLimitInfo: RateLimitInfo = {
        limit: parseInt(response.headers.get('X-RateLimit-Limit') || '60'),
        remaining: parseInt(response.headers.get('X-RateLimit-Remaining') || '60'),
        reset: parseInt(response.headers.get('X-RateLimit-Reset') || '0'),
        used: parseInt(response.headers.get('X-RateLimit-Used') || '0'),
      };

      if (!response.ok) {
        let errorMessage = 'Unknown error occurred';
        
        switch (response.status) {
          case 404:
            errorMessage = 'User or repository not found';
            break;
          case 403:
            errorMessage = rateLimitInfo.remaining === 0 
              ? 'API rate limit exceeded. Please try again later.'
              : 'Access forbidden';
            break;
          case 422:
            errorMessage = 'Invalid request parameters';
            break;
          case 500:
            errorMessage = 'GitHub API is experiencing issues';
            break;
          default:
            errorMessage = `GitHub API error: ${response.status}`;
        }

        throw new GitHubClientError(errorMessage, response.status, rateLimitInfo);
      }

      const responseData = await response.json();
      
      return {
        data: responseData.data || responseData,
        status: 'success' as const,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      if (error instanceof GitHubClientError) {
        throw error;
      }
      
      throw new GitHubClientError(
        error instanceof Error ? error.message : 'Network error occurred',
        0
      );
    }
  }

  async fetchUser(username: string): Promise<ApiResponse<GitHubUser>> {
    return this.fetchWithErrorHandling<GitHubUser>(
      API_ENDPOINTS.github.user(username)
    );
  }

  async fetchRepos(username: string): Promise<ApiResponse<GitHubRepo[]>> {
    return this.fetchWithErrorHandling<GitHubRepo[]>(
      API_ENDPOINTS.github.repos(username)
    );
  }

  async fetchCommits(username: string, repoName: string): Promise<ApiResponse<GitHubCommit[]>> {
    return this.fetchWithErrorHandling<GitHubCommit[]>(
      API_ENDPOINTS.github.commits(username, repoName)
    );
  }

  async fetchUserData(username: string): Promise<{
    user: GitHubUser;
    repos: GitHubRepo[];
    commits: GitHubCommit[];
  }> {
    // Fetch user and repos in parallel
    const [userResponse, reposResponse] = await Promise.all([
      this.fetchUser(username),
      this.fetchRepos(username),
    ]);

    if (userResponse.status === 'error') {
      throw new Error(userResponse.error);
    }
    if (reposResponse.status === 'error') {
      throw new Error(reposResponse.error);
    }

    const user = userResponse.data!;
    const repos = reposResponse.data!;

    // Fetch commits from top non-fork repositories
    const topRepos = repos
      .filter(repo => !repo.fork && repo.size > 0)
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, 5);

    const commitPromises = topRepos.map(async (repo) => {
      try {
        const response = await this.fetchCommits(username, repo.name);
        return response.status === 'success' ? response.data! : [];
      } catch {
        return [];
      }
    });

    const commitArrays = await Promise.all(commitPromises);
    const commits = commitArrays.flat();

    return { user, repos, commits };
  }
}