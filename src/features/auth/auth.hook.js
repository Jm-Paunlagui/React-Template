/**
 * auth.hook.js — Authentication state and handlers.
 *
 * Business logic layer. Uses auth.api.js for HTTP calls.
 * Views import this hook — never auth.api.js directly.
 */

import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AuthMiddleware from "../../middleware/authentication/AuthMiddleware";
import CsrfMiddleware from "../../middleware/security/CsrfMiddleware";
import { authApi } from "./auth.api";

export const useAuth = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    /**
     * Log in with username + password.
     * On success: sets token cookie, clears auth cache, redirects to dashboard.
     */
    const login = useCallback(
        async (credentials, redirectPath = "/dashboard") => {
            setLoading(true);
            setError(null);
            try {
                const response = await authApi.login(credentials);
                const token = response.data?.data?.token || response.data?.token;

                if (!token) throw new Error("No token in response");

                AuthMiddleware.authenticate(token, () => {
                    // Store user data if returned
                    const user = response.data?.data?.user || response.data?.user;
                    if (user) {
                        AuthMiddleware.setLocalStorage("user", {
                            ...user,
                            _lastVerified: Date.now(),
                        });
                    }
                    navigate(redirectPath);
                });

                toast.success(response.data?.message || "Welcome!");
                return true;
            } catch (err) {
                const message = err.response?.data?.message || err.message || "Login failed";
                setError(message);
                toast.error(message);
                return false;
            } finally {
                setLoading(false);
            }
        },
        [navigate],
    );

    /**
     * Log out — calls server endpoint, then clears local auth state.
     */
    const logout = useCallback(async () => {
        try {
            await authApi.logout();
        } catch {
            /* server logout failure is non-critical */
        }

        AuthMiddleware.signout();
        CsrfMiddleware.clearToken();
        toast.success("Signed out");
        navigate("/auth");
    }, [navigate]);

    /**
     * Register a new user account.
     */
    const register = useCallback(
        async (userData, redirectPath = "/auth") => {
            setLoading(true);
            setError(null);
            try {
                const response = await authApi.register(userData);
                toast.success(response.data?.message || "Account created");
                navigate(redirectPath);
                return true;
            } catch (err) {
                const message = err.response?.data?.message || "Registration failed";
                setError(message);
                toast.error(message);
                return false;
            } finally {
                setLoading(false);
            }
        },
        [navigate],
    );

    /**
     * Change password.
     */
    const changePassword = useCallback(async (payload) => {
        setLoading(true);
        setError(null);
        try {
            const response = await authApi.changePassword(payload);
            toast.success(response.data?.message || "Password changed");
            return true;
        } catch (err) {
            const message = err.response?.data?.message || "Failed to change password";
            setError(message);
            toast.error(message);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    return { loading, error, login, logout, register, changePassword };
};
