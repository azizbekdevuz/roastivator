import { NextRequest, NextResponse } from 'next/server';
import { validateUsername } from '../../../lib/validations';
import { APP_CONFIG } from '../../../constants';

interface GitHubApiError {
  message: string;
  documentation_url?: string;
  status?: number;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');
  const type = searchParams.get('type') as 'user' | 'repos' | 'commits';
  const repo = searchParams.get('repo');

  // Validate required parameters
  if (!username) {
    return NextResponse.json(
      { error: 'Username is required', status: 'error', timestamp: new Date().toISOString() }, 
      { status: 400 }
    );
  }

  // Validate username format
  const validation = validateUsername(username);
  if (!validation.isValid) {
    return NextResponse.json(
      { error: validation.error, status: 'error', timestamp: new Date().toISOString() }, 
      { status: 400 }
    );
  }

  if (!['user', 'repos', 'commits'].includes(type)) {
    return NextResponse.json(
      { error: 'Invalid type parameter. Must be user, repos, or commits', status: 'error', timestamp: new Date().toISOString() }, 
      { status: 400 }
    );
  }

  if (type === 'commits' && !repo) {
    return NextResponse.json(
      { error: 'Repository name is required for commits', status: 'error', timestamp: new Date().toISOString() }, 
      { status: 400 }
    );
  }

  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': APP_CONFIG.github.userAgent,
    'X-GitHub-Api-Version': '2022-11-28',
  };

  try {
    let url = '';
    
    switch (type) {
      case 'user':
        url = `${APP_CONFIG.github.apiUrl}/users/${encodeURIComponent(username)}`;
        break;
      case 'repos':
        url = `${APP_CONFIG.github.apiUrl}/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=${APP_CONFIG.github.rateLimit.burstLimit}`;
        break;
      case 'commits':
        url = `${APP_CONFIG.github.apiUrl}/repos/${encodeURIComponent(username)}/${encodeURIComponent(repo!)}/commits?per_page=10`;
        break;
    }

    const response = await fetch(url, { 
      headers,
      next: { revalidate: 300 } // Cache for 5 minutes
    });
    
    // Extract rate limit information
    const rateLimitInfo = {
      limit: parseInt(response.headers.get('X-RateLimit-Limit') || '60'),
      remaining: parseInt(response.headers.get('X-RateLimit-Remaining') || '60'),
      reset: parseInt(response.headers.get('X-RateLimit-Reset') || '0'),
      used: parseInt(response.headers.get('X-RateLimit-Used') || '0'),
    };

    if (!response.ok) {
      const errorBody: GitHubApiError = await response.json().catch(() => ({}));
      
      let errorMessage = 'Unknown error occurred';
      const statusCode = response.status;
      
      switch (response.status) {
        case 404:
          errorMessage = type === 'commits' 
            ? `Repository '${repo}' not found or has no commits`
            : 'User not found';
          break;
        case 403:
          errorMessage = rateLimitInfo.remaining === 0 
            ? `API rate limit exceeded. Limit resets at ${new Date(rateLimitInfo.reset * 1000).toLocaleTimeString()}.`
            : 'Access forbidden. Repository may be private.';
          break;
        case 422:
          errorMessage = 'Invalid request parameters';
          break;
        case 500:
        case 502:
        case 503:
          errorMessage = 'GitHub API is experiencing issues. Please try again later.';
          break;
        default:
          errorMessage = errorBody.message || `GitHub API error: ${response.status}`;
      }

      return NextResponse.json(
        { 
          error: errorMessage, 
          status: 'error', 
          timestamp: new Date().toISOString(),
          rateLimitInfo 
        },
        { status: statusCode }
      );
    }

    const data = await response.json();
    
    return NextResponse.json({
      data,
      status: 'success',
      timestamp: new Date().toISOString(),
      rateLimitInfo,
    });
    
  } catch (error: unknown) {
    console.error('GitHub API Error:', error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to fetch GitHub data',
        status: 'error',
        timestamp: new Date().toISOString() 
      },
      { status: 500 }
    );
  }
}