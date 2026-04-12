/**
 * AuthMiddleware — Authentication helpers.
 *
 * Static class providing cookie/localStorage helpers and the isAuth()
 * check with a 5-minute cache. Mirrors the express-template's AuthMiddleware
 * philosophy: ships a mechanism, not domain-specific logic.
 *
 * Usage:
 *   import AuthMiddleware from '../../middleware/authentication/AuthMiddleware';
 *
 *   const user = await AuthMiddleware.isAuth();
 *   AuthMiddleware.authenticate(token, () => navigate('/dashboard'));
 *   AuthMiddleware.signout();
 */

import cookie from "js-cookie";
import httpClient from "../HttpClient";

// Cache config — avoid redundant /verify calls
let _authCache = null;
let _authCacheTimestamp = null;
let _pendingAuthRequest = null;
const AUTH_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

class AuthMiddleware {
    // ─── Cookie helpers ───────────────────────────────────────────────────────

    static setCookie(key, value, options = {}) {
        if (typeof window === "undefined") return;
        cookie.set(key, value, {
            domain: window.location.hostname,
            sameSite: "Strict",
            path: "/",
            ...options,
        });
    }

    static getCookie(key) {
        if (typeof window === "undefined") return null;
        return cookie.get(key) ?? null;
    }

    static removeCookie(key) {
        if (typeof window === "undefined") return;
        cookie.remove(key, {
            domain: window.location.hostname,
            path: "/",
            sameSite: "strict",
        });
    }

    // ─── LocalStorage helpers ─────────────────────────────────────────────────

    static setLocalStorage(key, value) {
        if (typeof window === "undefined") return;
        localStorage.setItem(key, JSON.stringify(value));
    }

    static getLocalStorage(key) {
        if (typeof window === "undefined") return null;
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        try {
            return JSON.parse(raw);
        } catch {
            return null;
        }
    }

    static removeLocalStorage(key) {
        if (typeof window === "undefined") return;
        localStorage.removeItem(key);
    }

    // ─── Auth lifecycle ───────────────────────────────────────────────────────

    /**
     * Set token cookie and call next() — call after successful login.
     */
    static authenticate(token, next) {
        AuthMiddleware.setCookie("token", token);
        next();
    }

    /**
     * Sign out — clear all auth state client-side.
     * Does NOT call the logout endpoint (that's the feature's job).
     */
    static signout() {
        AuthMiddleware.clearAuthCache();
        AuthMiddleware.removeCookie("token");
        AuthMiddleware.removeLocalStorage("user");
    }

    /**
     * Clear the auth cache — call after login, logout, or token refresh.
     */
    static clearAuthCache() {
        _authCache = null;
        _authCacheTimestamp = null;
        _pendingAuthRequest = null;
    }

    /**
     * Check if the user is authenticated.
     *
     * 1. Returns false immediately if no token cookie exists
     * 2. Returns cached user if cache is still valid (5 min)
     * 3. Returns recent localStorage user if _lastVerified is < 5 min ago
     * 4. Otherwise calls POST /user-auth/verify and caches the result
     *
     * @returns {Object|false} user object or false
     */
    static async isAuth() {
        if (typeof window === "undefined") return false;

        const token = AuthMiddleware.getCookie("token");
        if (!token) {
            AuthMiddleware.clearAuthCache();
            return false;
        }

        const userStr = localStorage.getItem("user");
        if (!userStr) {
            AuthMiddleware.clearAuthCache();
            return false;
        }

        // Return from cache
        if (_authCache && _authCacheTimestamp && Date.now() - _authCacheTimestamp < AUTH_CACHE_DURATION) {
            return _authCache;
        }

        // Deduplicate concurrent calls
        if (_pendingAuthRequest) return _pendingAuthRequest;

        // Check if stored user data is recent enough
        try {
            const user = JSON.parse(userStr);
            if (user._lastVerified && Date.now() - user._lastVerified < 5 * 60 * 1000) {
                _authCache = user;
                _authCacheTimestamp = Date.now();
                return user;
            }
        } catch {
            /* fall through to verify */
        }

        // Verify with backend
        _pendingAuthRequest = (async () => {
            try {
                const response = await httpClient.post("user-auth/verify", { TOKEN: token });
                const user = response.data?.data?.user || response.data?.user;

                if (user) {
                    const userWithTimestamp = { ...user, _lastVerified: Date.now() };
                    _authCache = userWithTimestamp;
                    _authCacheTimestamp = Date.now();
                    _pendingAuthRequest = null;
                    localStorage.setItem("user", JSON.stringify(userWithTimestamp));
                    return userWithTimestamp;
                }

                AuthMiddleware.clearAuthCache();
                return false;
            } catch {
                AuthMiddleware.clearAuthCache();
                return false;
            }
        })();

        return _pendingAuthRequest;
    }
}

// Singleton export
const authMiddleware = new AuthMiddleware();
export default authMiddleware;
export { AuthMiddleware };
