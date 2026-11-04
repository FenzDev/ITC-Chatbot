import { api } from '@/lib/api-client';
import type { AuthResponse, RegisterInput, AuthUser, LoginInput } from './types';

export const registerUser = (input: RegisterInput) =>
  api<AuthResponse>('/auth/register', { method: 'POST', body: input });
export const loginUser = (input: LoginInput) =>
  api<AuthResponse>('/auth/login', { method: 'POST', body: input });
export const logoutUser = () =>
  api<AuthResponse>('/auth/register', { method: 'POST' });
export const getUser = () =>
  api<AuthUser>('/auth/me', { method: 'GET' }).then((auth) => auth.user);
