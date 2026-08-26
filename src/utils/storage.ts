import { User } from '../types';

const KEYS = {
  CURRENT_USER: 'techstore_current_user_v1',
  AUTH_TOKEN: 'techstore_auth_token_v1',
};

export function getCurrentUser(): User | null {
  try {
    const raw = localStorage.getItem(KEYS.CURRENT_USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setCurrentUser(user: User | null): void {
  if (user) {
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(KEYS.CURRENT_USER);
  }
}

export function setAuthToken(token: string | null): void {
  if (token) {
    localStorage.setItem(KEYS.AUTH_TOKEN, token);
  } else {
    localStorage.removeItem(KEYS.AUTH_TOKEN);
  }
}

export function getAuthToken(): string | null {
  try {
    return localStorage.getItem(KEYS.AUTH_TOKEN);
  } catch {
    return null;
  }
}
