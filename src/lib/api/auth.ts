/**
 * Customer Authentication & Identity API
 */

import { apiClient, clearTokens, setTokens } from "./client";
import {
  ChangePasswordRequest,
  LoginRequest,
  RegisterRequest,
  TokenResponse,
  UserResponse,
} from "./types";

export const authApi = {
  async register(data: RegisterRequest): Promise<UserResponse> {
    return apiClient<UserResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
      skipAuth: true,
    });
  },

  async login(credentials: LoginRequest): Promise<TokenResponse> {
    const tokens = await apiClient<TokenResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
      skipAuth: true,
    });
    setTokens(tokens);
    return tokens;
  },

  async getMe(): Promise<UserResponse> {
    return apiClient<UserResponse>("/auth/me");
  },

  async logout(refreshToken: string): Promise<void> {
    try {
      await apiClient<{ message: string }>("/auth/logout", {
        method: "POST",
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
    } finally {
      clearTokens();
    }
  },

  async changePassword(data: ChangePasswordRequest): Promise<void> {
    await apiClient<{ message: string }>("/auth/change-password", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};
