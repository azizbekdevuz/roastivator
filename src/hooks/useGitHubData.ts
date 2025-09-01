'use client';

import { useState, useCallback } from 'react';
import { GitHubData, LoadingStep } from '../types/github';
import { GitHubClient, GitHubClientError } from '../lib/github-client';
import { validateUsername } from '../lib/validations';

interface UseGitHubDataState {
  data: GitHubData | null;
  loading: boolean;
  error: string | null;
  loadingStep: LoadingStep | null;
}

interface UseGitHubDataReturn extends UseGitHubDataState {
  fetchUserData: (username: string) => Promise<void>;
  reset: () => void;
  isValidUsername: (username: string) => boolean;
}

export const useGitHubData = (): UseGitHubDataReturn => {
  const [state, setState] = useState<UseGitHubDataState>({
    data: null,
    loading: false,
    error: null,
    loadingStep: null,
  });



  const updateLoadingStep = useCallback((step: LoadingStep | null) => {
    setState(prev => ({ ...prev, loadingStep: step }));
  }, []);

  const fetchUserData = useCallback(async (username: string) => {
    const validation = validateUsername(username);
    if (!validation.isValid) {
      setState(prev => ({
        ...prev,
        error: validation.error || 'Invalid username',
        loading: false,
        loadingStep: null,
      }));
      return;
    }

    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
      data: null,
      loadingStep: 'fetching-user',
    }));

    try {
      updateLoadingStep('fetching-user');
      await new Promise(resolve => setTimeout(resolve, 500)); // UX delay
      
      updateLoadingStep('fetching-repos');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      updateLoadingStep('fetching-commits');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      updateLoadingStep('analyzing');
      
      const client = new GitHubClient();
      const data = await client.fetchUserData(username);
      
      updateLoadingStep('roasting');
      await new Promise(resolve => setTimeout(resolve, 1000)); // Dramatic pause
      
      setState(prev => ({
        ...prev,
        data,
        loading: false,
        loadingStep: null,
      }));
    } catch (error) {
      let errorMessage = 'An unexpected error occurred';
      
      if (error instanceof GitHubClientError) {
        errorMessage = error.message;
        
        if (error.statusCode === 403 && error.rateLimitInfo?.remaining === 0) {
          const resetDate = new Date(error.rateLimitInfo.reset * 1000);
          errorMessage += ` Rate limit resets at ${resetDate.toLocaleTimeString()}.`;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      setState(prev => ({
        ...prev,
        error: errorMessage,
        loading: false,
        loadingStep: null,
      }));
    }
  }, [updateLoadingStep]);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      loadingStep: null,
    });
  }, []);

  const isValidUsername = useCallback((username: string) => {
    return validateUsername(username).isValid;
  }, []);

  return {
    ...state,
    fetchUserData,
    reset,
    isValidUsername,
  };
};