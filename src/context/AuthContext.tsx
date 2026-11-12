"use client";

import * as React from "react";
import { authApi } from "@/lib/api/auth";
import { cartApi } from "@/lib/api/cart";
import {
  clearTokens,
  getAccessToken,
  getAnonymousCartToken,
  getRefreshToken,
} from "@/lib/api/client";
import { LoginRequest, RegisterRequest, UserResponse } from "@/lib/api/types";

interface AuthContextType {
  user: UserResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  isAuthModalOpen: boolean;
  authModalTab: "signin" | "register";
  openAuthModal: (tab?: "signin" | "register") => void;
  closeAuthModal: () => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);
  const [authModalTab, setAuthModalTab] = React.useState<"signin" | "register">("signin");

  // Load authenticated session on mount
  React.useEffect(() => {
    let isMounted = true;

    async function checkSession() {
      const token = getAccessToken();
      const refresh = getRefreshToken();

      if (!token && !refresh) {
        if (isMounted) setIsLoading(false);
        return;
      }

      try {
        const me = await authApi.getMe();
        if (isMounted) setUser(me);
      } catch (err) {
        // Token expired or invalid
        clearTokens();
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    checkSession();
    return () => {
      isMounted = false;
    };
  }, []);

  const login = React.useCallback(async (credentials: LoginRequest) => {
    await authApi.login(credentials);
    const currentUser = await authApi.getMe();
    setUser(currentUser);

    // Merge anonymous guest cart into customer account if guest cart exists
    const guestCartToken = getAnonymousCartToken();
    if (guestCartToken) {
      try {
        await cartApi.mergeCart(guestCartToken);
      } catch (e) {
        console.warn("Guest cart merge error after login:", e);
      }
    }

    setIsAuthModalOpen(false);
  }, []);

  const register = React.useCallback(
    async (data: RegisterRequest) => {
      await authApi.register(data);
      // Auto-login upon registration
      await login({ email: data.email, password: data.password });
    },
    [login]
  );

  const logout = React.useCallback(async () => {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      try {
        await authApi.logout(refreshToken);
      } catch {
        // Ignore logout network errors; local tokens are cleared
      }
    } else {
      clearTokens();
    }
    setUser(null);
  }, []);

  const openAuthModal = React.useCallback((tab: "signin" | "register" = "signin") => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = React.useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  const value = React.useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      register,
      logout,
      isAuthModalOpen,
      authModalTab,
      openAuthModal,
      closeAuthModal,
    }),
    [user, isLoading, login, register, logout, isAuthModalOpen, authModalTab, openAuthModal, closeAuthModal]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
