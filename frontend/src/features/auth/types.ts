export type User = { id: string; email: string; name: string; role: "member" | "admin" };

export type LoginInput = { email: string; password: string };
export type RegisterInput = LoginInput & { name: string };

export type AuthResponse = { user: User };
