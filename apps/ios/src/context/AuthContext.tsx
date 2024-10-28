// AuthContext.js

import React, { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { showToast } from '@/lib/toastConfig';
import { Prisma, User } from '@relearn/database'
import { ServerPassedVerfifiedChecksResponse, ValidateTokenReturnPolicy } from '@/types/policies/authPolicies';
import emitter from '@/lib/eventEmitter';
import axiosInstance from '@/lib/401Interceptor';

interface AuthContext {
    jwtToken: string | null;
    loading: boolean;
    user: User | null;
    signIn: (jwtToken: string, refreshToken: string) => Promise<void>;
    signOut: () => Promise<void>;
    updateUserState: () => void;
    passedPreflight: ServerPassedVerfifiedChecksResponse;
}

export const AuthContext = createContext<AuthContext>(null);

export const AuthProvider = ({ children }) => {
    const [jwtToken, setJwtToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true); // To handle initial loading state
    const [user, setUser] = useState<User | null>(null);
    const [passedPreflight, setPassedPreflight] = useState<ServerPassedVerfifiedChecksResponse | null>(null);

    useEffect(() => {
        // Check for existing token when the app loads
        const loadToken = async () => {
            try {
                // +L for local vars
                const jwtTokenL = await SecureStore.getItemAsync('jwtToken');
                const refreshTokenL = await SecureStore.getItemAsync('refreshToken');

                if (jwtTokenL && refreshTokenL) {
                    // Optionally, validate the token with the backend
                    const { valid, user } = await validateToken(jwtTokenL);
                    if (valid) {
                        setJwtToken(jwtTokenL);
                        setRefreshToken(refreshTokenL);

                        await updateUserState();
                        await hasUserPassedVerifiedChecks();

                    } else {
                        // attempt to rfresh the access token.
                        const tokens = await refreshJwtToken(refreshTokenL);
                        if (tokens) {
                            setJwtToken(tokens.jwtToken);
                            setRefreshToken(tokens.refreshToken);
                            await updateUserState()
                            await hasUserPassedVerifiedChecks();
                        } else {
                            // no tokens due to refreshJwtToken not successfull.
                            showToast("Session Expired", "Please login again", "error")
                            await signOut();
                        }


                    }
                }
            } catch (error) {
                console.error('Error loading token', error);
            } finally {
                setLoading(false);
            }
        };

        loadToken();


        const handleLogout = async () => {
            await signOut();
        };
        // listen to logout event from 401Interceptor
        emitter.on('logout', handleLogout);

        const handleUserUpdateState = async () => {
            await updateUserState();
            await hasUserPassedVerifiedChecks();
        }
        // listen to user update request from 401Interceptor
        emitter.on('updateUserState', handleUserUpdateState)

        // Cleanup listener on unmount
        return () => {
            emitter.off('logout', handleLogout);
        };

    }, []);

    const refreshJwtToken = async (refreshToken: string) => {
        try {
            const response = await axios.post(
                `${process.env.EXPO_PUBLIC_SERVER_URL}/auth/refresh-jwt-token`,
                { refreshToken },
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            const { jwtToken: newJwtToken, refreshToken: newRefreshToken } = await response.data;
            await SecureStore.setItemAsync('jwtToken', newJwtToken);
            await SecureStore.setItemAsync('refreshToken', newRefreshToken);
            setJwtToken(newJwtToken);
            setRefreshToken(newRefreshToken);
            return { jwtToken: newJwtToken, refreshToken: newRefreshToken };
        } catch (error) {
            return null;
        }
    };

    const hasUserPassedVerifiedChecks = async () => {
        try {
            const response = await axiosInstance.get(`${process.env.EXPO_PUBLIC_SERVER_URL}/user/preflight/verify`);
            const data: ServerPassedVerfifiedChecksResponse = await response.data;

            setPassedPreflight(data)
        } catch (error) {
            return { passed: false, message: "An error occured." };
        }
    }

    const updateUserState = async () => {
        try {
            const response = await axiosInstance.get(`${process.env.EXPO_PUBLIC_SERVER_URL}/user`);
            const { user }: { user: User } = await response.data;
            setUser(user);
        } catch (error) {
            return null;
        }

    }

    const validateToken = async (token: string): Promise<ValidateTokenReturnPolicy> => {
        try {
            const response = await axios.post(
                `${process.env.EXPO_PUBLIC_SERVER_URL}/auth/validate-token`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                }
            );

            // deconstruct object
            return { valid: response.status === 201 };
        } catch (error) {
            return { valid: false };
        }
    };

    const signIn = async (jwtToken: string, refreshToken: string) => {
        setLoading(true)
        setJwtToken(jwtToken);
        setRefreshToken(refreshToken)
        await SecureStore.setItemAsync('jwtToken', jwtToken);
        await SecureStore.setItemAsync('refreshToken', refreshToken);
        await updateUserState()
        await hasUserPassedVerifiedChecks();
        setLoading(false)
    };

    const signOut = async () => {
        try {
            if (jwtToken && refreshToken) {
                await axios.post(
                    `${process.env.EXPO_PUBLIC_SERVER_URL}/auth/logout`,
                    { refreshToken },
                    {
                        headers: { Authorization: `Bearer ${jwtToken}` },
                    }
                );
            }
        } catch (error) {
            console.log(error)
        }
        setJwtToken(null);
        setRefreshToken(null);
        setUser(null);
        await SecureStore.deleteItemAsync('jwtToken');
        await SecureStore.deleteItemAsync('refreshToken');

    };

    return (
        <AuthContext.Provider value={{ jwtToken, user, loading, signIn, signOut, updateUserState, passedPreflight }}>
            {children}
        </AuthContext.Provider>
    );
};
