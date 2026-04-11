/**
 * Logout.view.jsx — Logout page.
 * Clears auth state on mount and redirects to login.
 */

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from "../../components/ui/Spinner";
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

    return <Spinner fullPage size="lg" label="Signing out…" />;
}
