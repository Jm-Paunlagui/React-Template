/**
 * App.jsx — Router only.
 *
 * - ROLES defined here (numeric, universal)
 * - NO AREAS constant — permission strings defined inline at each route
 * - No providers — those live in main.jsx
 * - Lazy views with Suspense fallback
 */

import { Suspense, lazy } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./assets/styles/index.css";

import Footer from "./components/layout/footer/Footer";
import Navbar from "./components/layout/navbar/Navbar";
import ProtectedRoute from "./components/routing/ProtectedRoute";
import {
    BadRequest,
    InvalidToken,
    LoginTimeOut,
    PageNotFound,
    ServiceUnavailable,
    Unauthorized,
} from "./views/errors/ClientErrorResponses";

const LoginView = lazy(() => import("./features/auth/Login.view"));
const LogoutView = lazy(() => import("./features/auth/Logout.view"));
const DashboardView = lazy(() => import("./features/dashboard/Dashboard.view"));

// Role constants — your app defines these
// Permission strings (AREAS) are NOT here — they are inline at each route
const ROLES = { SADMIN: 3, ADMIN: 2, USER: 1 };

const BARE_ROUTES = [
    "/auth",
    "/sign-up",
    "/",
    "/user/logout",
    "/unauthorized",
    "/login-timeout",
    "/invalid-token",
    "/bad-request",
    "/page-not-found",
    "/service-is-currently-unavailable",
];

function ConditionalNavbar() {
    const { pathname } = useLocation();
    const isBare = BARE_ROUTES.some(
        (r) => pathname === r || pathname.startsWith(r + "/"),
    );
    return isBare ? null : <Navbar />;
}

function ConditionalFooter() {
    const { pathname } = useLocation();
    const isBare = BARE_ROUTES.some(
        (r) => pathname === r || pathname.startsWith(r + "/"),
    );
    return isBare ? null : <Footer />;
}

function PageLoader() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="w-8 h-8 border-4 rounded-full animate-spin border-primary-400 border-t-transparent" />
        </div>
    );
}

export default function App() {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                closeOnClick
                pauseOnHover
                draggable
                theme="colored"
                className="z-50"
            />
            <ConditionalNavbar />
            <main className="grow">
                <Suspense fallback={<PageLoader />}>
                    <Routes>
                        {/* Public */}
                        <Route
                            path="/"
                            element={<Navigate to="/auth" replace />}
                        />
                        <Route path="auth" element={<LoginView />} />
                        <Route path="user/logout" element={<LogoutView />} />

                        {/* Protected — role only */}
                        <Route
                            element={
                                <ProtectedRoute
                                    role={[
                                        ROLES.USER,
                                        ROLES.ADMIN,
                                        ROLES.SADMIN,
                                    ]}
                                />
                            }
                        >
                            <Route
                                path="dashboard"
                                element={<DashboardView />}
                            />
                        </Route>

                        {/* Protected — role + permission (uncomment and adapt)
                        <Route element={<ProtectedRoute
                            role={[ROLES.USER, ROLES.ADMIN, ROLES.SADMIN]}
                            check={(user) => user.area?.includes('INV_CON')}
                        />}>
                            <Route path="inventory" element={<InventoryView />} />
                        </Route>
                        */}

                        {/* Error pages */}
                        <Route path="unauthorized" element={<Unauthorized />} />
                        <Route path="bad-request" element={<BadRequest />} />
                        <Route
                            path="login-timeout"
                            element={<LoginTimeOut />}
                        />
                        <Route
                            path="invalid-token"
                            element={<InvalidToken />}
                        />
                        <Route
                            path="page-not-found"
                            element={<PageNotFound />}
                        />
                        {/*
                         * Security checkpoint error page.
                         * Reached when CsrfGate cannot establish an encrypted session
                         * (main.jsx does window.location.replace('/service-is-currently-unavailable')).
                         * Uses a distinct purple/indigo palette — not the red error palette —
                         * so users understand this is a protective security screen, not a bug.
                         */}
                        <Route
                            element={<ServiceUnavailable />}
                            path="service-is-currently-unavailable"
                        />
                        <Route
                            path="*"
                            element={<Navigate to="/page-not-found" replace />}
                        />
                    </Routes>
                </Suspense>
            </main>
            <ConditionalFooter />
        </div>
    );
}
