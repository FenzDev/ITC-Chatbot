import { api } from "@/lib/api-client";
import type { AuthResponse, LoginInput, RegisterInput, User } from "./types";

export const getUser = () => api<User>("/auth/me");
export const loginUser = (input: LoginInput) =>
  api<AuthResponse>("/auth/login", { method: "POST", body: input });
export const registerUser = (input: RegisterInput) =>
  api<AuthResponse>("/auth/register", { method: "POST", body: input });
