export type User = { id: string; email: string; name: string };

export type LoginInput = { email: string; password: string };
export type RegisterInput = LoginInput & { name: string };

export type AuthResponse = { token?: string };
