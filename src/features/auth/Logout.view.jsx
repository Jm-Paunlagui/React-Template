/**
 * Logout.view.jsx — Logout page.
 * Clears auth state on mount and redirects to login.
 */

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthMiddleware from "../../middleware/authentication/AuthMiddleware";
import CsrfMiddleware from "../../middleware/security/CsrfMiddleware";

export default function LogoutView() {
    const navigate = useNavigate();

    useEffect(() => {
        AuthMiddleware.signout();
        CsrfMiddleware.clearToken();
        const timer = setTimeout(() => navigate("/auth"), 1500);
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white">
            <div className="w-8 h-8 mb-4 border-4 rounded-full animate-spin border-primary-400 border-t-transparent" />
            <p className="text-gray-500">Signing out...</p>
        </div>
    );
}
