/**
 * ProtectedRoute — Dynamic access control component.
 *
 * Ships a MECHANISM, not a hardcoded permission set.
 * Your application defines permission logic inline at the route level.
 *
 * Props:
 *   role        — array of allowed role numbers, e.g. [2, 3]
 *   check       — predicate: (user) => boolean  ← define permissions here
 *   redirectTo  — redirect path if unauthorized (default: '/unauthorized')
 *
 * Examples:
 *
 *   // Role-only
 *   <ProtectedRoute role={[ROLES.ADMIN, ROLES.SADMIN]} />
 *
 *   // Permission-based (your app defines the permission strings)
 *   <ProtectedRoute check={(user) => user.area?.includes('FINANCE')} />
 *
 *   // Combined
 *   <ProtectedRoute check={(user) =>
 *       user.userLevel >= ROLES.ADMIN && user.area?.includes('HR_MANAGER')
 *   } />
 */

import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthMiddleware from "../../middleware/authentication/AuthMiddleware";

export default function ProtectedRoute({
    role = null,
    check = null,
    redirectTo = "/unauthorized",
}) {
    const [status, setStatus] = useState("checking"); // 'checking' | 'allowed' | 'denied'

    useEffect(() => {
        let cancelled = false;

        const verify = async () => {
            const user = await AuthMiddleware.isAuth();

            if (cancelled) return;

            if (!user) {
                setStatus("denied");
                return;
            }

            // Role check
            if (role && !role.includes(user.user_data?.userLevel)) {
                setStatus("denied");
                return;
            }

            // Predicate check (dynamic permissions)
            if (check && !check(user.user_data ?? user)) {
                setStatus("denied");
                return;
            }

            setStatus("allowed");
        };

        verify();
        return () => {
            cancelled = true;
        };
    }, [role, check]);

    if (status === "checking") {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-8 h-8 border-4 rounded-full animate-spin border-primary-400 border-t-transparent" />
            </div>
        );
    }

    if (status === "denied") {
        return <Navigate to={redirectTo} replace />;
    }

    return <Outlet />;
}
