// AuthContext.js

import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { showToast } from "@/lib/toastConfig";
import { User } from "@relearn/database";
import { ServerPassedVerfifiedChecksResponse } from "@/types/policies/authPolicies";
import emitter from "@/lib/eventEmitter";
import axiosInstance from "@/lib/401Interceptor";

interface AuthContextType {
  jwtToken: string | null;
  loading: boolean;
  user: User | null;
  signIn: (jwtToken: string, refreshToken: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserState: () => Promise<void>;
  passedPreflight: ServerPassedVerfifiedChecksResponse | null;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }) => {
  const [jwtToken, setJwtToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const [passedPreflight, setPassedPreflight] =
    useState<ServerPassedVerfifiedChecksResponse | null>(null);

  const validateToken = async (token: string): Promise<boolean> => {
    try {
      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_ID_SERVER_URL}/auth/validate-token`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return response.status === 200;
    } catch {
      return false;
    }
  };

  const refreshJwtToken = async (refreshToken: string) => {
    try {
      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_ID_SERVER_URL}/auth/refresh-jwt-token`,
        { refreshToken },
        {
          headers: { "Content-Type": "application/json" },
        },
      );
      const { jwtToken: newJwtToken, refreshToken: newRefreshToken } =
        response.data;
      await SecureStore.setItemAsync("jwtToken", newJwtToken);
      await SecureStore.setItemAsync("refreshToken", newRefreshToken);
      return { jwtToken: newJwtToken, refreshToken: newRefreshToken };
    } catch {
      return null;
    }
  };

  const hasUserPassedVerifiedChecks = async () => {
    try {
      const response = await axiosInstance.get(
        `${process.env.EXPO_PUBLIC_ID_SERVER_URL}/user/preflight/verify`,
      );
      setPassedPreflight(response.data);
    } catch (error) {
      console.error("Error in hasUserPassedVerifiedChecks", error);
    }
  };

  const updateUserState = useCallback(async () => {
    try {
      const response = await axiosInstance.get(
        `${process.env.EXPO_PUBLIC_ID_SERVER_URL}/user`,
      );
      setUser(response.data.user);
    } catch (error) {
      console.error("Error in updateUserState", error);
    }
  }, []);

  const initializeAuth = useCallback(async () => {
    try {
      const [jwtTokenL, refreshTokenL] = await Promise.all([
        SecureStore.getItemAsync("jwtToken"),
        SecureStore.getItemAsync("refreshToken"),
      ]);

      if (jwtTokenL && refreshTokenL) {
        const isValid = await validateToken(jwtTokenL);

        if (isValid) {
          setJwtToken(jwtTokenL);
          setRefreshToken(refreshTokenL);
        } else {
          const tokens = await refreshJwtToken(refreshTokenL);
          if (tokens) {
            setJwtToken(tokens.jwtToken);
            setRefreshToken(tokens.refreshToken);
          } else {
            showToast("Session Expired", "Please login again", "error");
            await signOut();
            return;
          }
        }

        await Promise.all([updateUserState(), hasUserPassedVerifiedChecks()]);
      }
    } catch (error) {
      console.error("Error initializing auth", error);
    } finally {
      setLoading(false);
    }
  }, [updateUserState]);

  useEffect(() => {
    initializeAuth();

    const handleLogout = async () => {
      await signOut();
    };

    const handleUserUpdateState = async () => {
      await Promise.all([updateUserState(), hasUserPassedVerifiedChecks()]);
    };

    emitter.on("logout", handleLogout);
    emitter.on("updateUserState", handleUserUpdateState);

    return () => {
      emitter.off("logout", handleLogout);
      emitter.off("updateUserState", handleUserUpdateState);
    };
  }, [initializeAuth, updateUserState]);

  const signIn = useCallback(
    async (jwtToken: string, refreshToken: string) => {
      setLoading(true);
      setJwtToken(jwtToken);
      setRefreshToken(refreshToken);
      await Promise.all([
        SecureStore.setItemAsync("jwtToken", jwtToken),
        SecureStore.setItemAsync("refreshToken", refreshToken),
      ]);
      await Promise.all([updateUserState(), hasUserPassedVerifiedChecks()]);
      setLoading(false);
    },
    [updateUserState],
  );

  const signOut = useCallback(async () => {
    try {
      if (jwtToken && refreshToken) {
        await axios.post(
          `${process.env.EXPO_PUBLIC_ID_SERVER_URL}/auth/logout`,
          { refreshToken },
          {
            headers: { Authorization: `Bearer ${jwtToken}` },
          },
        );
      }
    } catch (error) {
      console.error("Error in signOut", error);
    } finally {
      setJwtToken(null);
      setRefreshToken(null);
      setUser(null);
      await Promise.all([
        SecureStore.deleteItemAsync("jwtToken"),
        SecureStore.deleteItemAsync("refreshToken"),
      ]);
    }
  }, [jwtToken, refreshToken]);

  const authContextValue = useMemo(
    () => ({
      jwtToken,
      user,
      loading,
      signIn,
      signOut,
      updateUserState,
      passedPreflight,
    }),
    [
      jwtToken,
      user,
      loading,
      signIn,
      signOut,
      updateUserState,
      passedPreflight,
    ],
  );

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
