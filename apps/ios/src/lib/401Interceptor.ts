// src/api/axios.js

import axios from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import * as SecureStore from 'expo-secure-store';
import { showToast } from './toastConfig';
import emitter from './eventEmitter';

// Create Axios instance
const axiosInstance = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_SERVER_URL
});

// Function that will be called to refresh authorization
const refreshAuthLogic = async (failedRequest) => {
    try {
        const refreshToken = await SecureStore.getItemAsync('refreshToken');
        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        const response = await axios.post(
            `${process.env.EXPO_PUBLIC_ID_SERVER_URL}/auth/refresh-jwt-token`,
            { refreshToken },
            { headers: { 'Content-Type': 'application/json' } }
        );
        const { jwtToken: newJwtToken, refreshToken: newRefreshToken } = await response.data;

        await SecureStore.setItemAsync('jwtToken', newJwtToken);
        await SecureStore.setItemAsync('refreshToken', newRefreshToken);

        /* Update the failed request with the new jwttoken that has been refreshed
         or regened */
        failedRequest.response.config.headers['Authorization'] = `Bearer ${newJwtToken}`;

        return Promise.resolve();
    } catch (error) {


        showToast("Session Expired", "Please login.", "error");

        return emitter.emit('logout');
    }
};



// Attach the interceptor
createAuthRefreshInterceptor(axiosInstance, refreshAuthLogic, {
    statusCodes: [401],
});


/* auto attach jwt token to every request so we dont have to specify
 in headers */
axiosInstance.interceptors.request.use(
    async (config) => {
        const token = await SecureStore.getItemAsync('jwtToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;
