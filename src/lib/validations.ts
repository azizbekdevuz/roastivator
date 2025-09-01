import { VALIDATION_RULES } from '../constants';

export class ValidationError extends Error {
  constructor(message: string, public field: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export const validateUsername = (username: string): { isValid: boolean; error?: string } => {
  if (!username || typeof username !== 'string') {
    return { isValid: false, error: 'Username is required' };
  }

  const trimmed = username.trim();

  if (trimmed.length < VALIDATION_RULES.username.minLength) {
    return { isValid: false, error: 'Username is too short' };
  }

  if (trimmed.length > VALIDATION_RULES.username.maxLength) {
    return { isValid: false, error: 'Username is too long (max 39 characters)' };
  }

  if (!VALIDATION_RULES.username.pattern.test(trimmed)) {
    return { 
      isValid: false, 
      error: 'Username can only contain alphanumeric characters and hyphens, cannot start or end with a hyphen' 
    };
  }

  if (VALIDATION_RULES.username.forbiddenNames.includes(trimmed.toLowerCase() as typeof VALIDATION_RULES.username.forbiddenNames[number])) {
    return { isValid: false, error: 'This username is not allowed' };
  }

  return { isValid: true };
};

export const sanitizeInput = (input: string): string => {
  return input.trim().toLowerCase().replace(/[^\w-]/g, '');
};

export const isValidGitHubUsername = (username: string): boolean => {
  const validation = validateUsername(username);
  return validation.isValid;
};