/**
 * auth.api.js — Authentication API calls.
 *
 * Only HTTP calls live here. No state, no side effects, no React.
 * All functions return the raw Axios response.
 */

import httpClient from "../../middleware/HttpClient";

export const authApi = {
    /**
     * Login with username + password.
     * @param {{ username: string, password: string }} credentials
     */
    login: (credentials) => httpClient.post('user-auth/login', credentials),

    /**
     * Logout the current session on the server.
     */
    logout: () => httpClient.post('user-auth/logout'),

    /**
     * Verify the current JWT token.
     * @param {string} token
     */
    verify: (token) => httpClient.post('user-auth/verify', { TOKEN: token }),

    /**
     * Register a new user account.
     * @param {Object} userData
     */
    register: (userData) => httpClient.post('user-identity/register', userData),

    /**
     * Change password.
     * @param {{ currentPassword: string, newPassword: string }} payload
     */
    changePassword: (payload) => httpClient.post('user-auth/change-password', payload),
};