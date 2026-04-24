/**
 * auth.hook.js — Authentication state and handlers.
 *
 * Business logic layer. Uses auth.api.js for HTTP calls.
 * Views import this hook — never auth.api.js directly.
 */

import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "../../components/ui/toast.utils";
import AuthMiddleware from "../../middleware/authentication/AuthMiddleware";
import CsrfMiddleware from "../../middleware/security/CsrfMiddleware";
import { authApi } from "./auth.api";

export const useAuth = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [integrityError, setIntegrityError] = useState(false);
    const [rateLimitSeconds, setRateLimitSeconds] = useState(null);
    const [accountLocked, setAccountLocked] = useState(false);
    const navigate = useNavigate();

    /**
     * Log in with userId + password.
     *
     * The view uses "username" as the form field name (UX label).
     * We map it to "userId" here to match the backend contract.
     *
     * The server sets the HTTP-only signed token + refreshToken cookies.
     * We only store the user payload in localStorage for isAuth() fast-path.
     */
    const login = useCallback(
        async (credentials, redirectPath = "/dashboard") => {
            setLoading(true);
            setError(null);
            setIntegrityError(false);
            setAccountLocked(false);
            try {
                const response = await authApi.login({
                    userId: credentials.username ?? credentials.userId,
                    password: credentials.password,
                });

                const user = response.data?.data?.user;
                if (user) {
                    AuthMiddleware.setLocalStorage("user", {
                        ...user,
                        _lastVerified: Date.now(),
                    });
                }

                AuthMiddleware.clearAuthCache();
                navigate(redirectPath);
                toast.success(response.data?.message || "Welcome!");
                return true;
            } catch (err) {
                const message = err.response?.data?.message || err.message || "Login failed";
                const errorType = err.response?.data?.error?.type;
                setError(message);
                if (err.response?.status === 422 && errorType === "DataIntegrityError") {
                    setIntegrityError(true);
                } else if (err.response?.status === 429) {
                    const details = err.response?.data?.error?.details ?? [];
                    const retryDetail = details.find((d) => d.field === "retryAfter");
                    const secs = parseInt(retryDetail?.issue, 10);
                    if (!isNaN(secs)) setRateLimitSeconds(secs);
                } else if (err.response?.status === 423) {
                    setAccountLocked(true);
                }
                toast.error(message);
                return false;
            } finally {
                setLoading(false);
            }
        },
        [navigate],
    );

    /**
     * Log out — calls server to clear HTTP-only cookies, then clears local state.
     * Server failure is non-critical: local state is cleared regardless.
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

    const clearRateLimit = useCallback(() => {
        setRateLimitSeconds(null);
        setError(null);
    }, []);

    return { loading, error, integrityError, login, logout, rateLimitSeconds, clearRateLimit, accountLocked };
};
