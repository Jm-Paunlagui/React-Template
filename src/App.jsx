/**
 * App.jsx — Router only.
 *
 * - ROLES defined here (numeric, universal)
 * - NO AREAS constant — permission strings defined inline at each route
 * - No providers — those live in main.jsx
 * - Lazy views with Suspense fallback
 * - Supports "top" (navbar) and "sidebar" layout modes via LayoutContext
 */

import { Suspense, lazy } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./assets/styles/index.css";

import Footer from "./components/layout/Footer";
import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";
import ProtectedRoute from "./components/routing/ProtectedRoute";
import { useLayout } from "./contexts/layout/LayoutContext";
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

function isBareRoute(pathname) {
    return BARE_ROUTES.some(
        (r) => pathname === r || pathname.startsWith(r + "/"),
    );
}

function ConditionalNavbar() {
    const { pathname } = useLocation();
    const { layout } = useLayout();
    if (isBareRoute(pathname)) return null;
    if (layout === "sidebar") return null; // sidebar mode uses Sidebar.jsx instead
    return <Navbar />;
}

function ConditionalSidebar() {
    const { pathname } = useLocation();
    const { layout } = useLayout();
    if (isBareRoute(pathname)) return null;
    if (layout !== "sidebar") return null;
    return <Sidebar />;
}

function ConditionalFooter() {
    const { pathname } = useLocation();
    const { layout } = useLayout();
    if (isBareRoute(pathname)) return null;
    if (layout === "sidebar") return null; // sidebar mode omits footer
    return <Footer />;
}

function PageLoader() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="w-8 h-8 border-4 border-orange-400 rounded-full animate-spin border-t-transparent" />
        </div>
    );
}

function AppContent() {
    const { pathname } = useLocation();
    const { layout, sidebarOpen } = useLayout();
    const bare = isBareRoute(pathname);
    const useSidebar = !bare && layout === "sidebar";

    return (
        <div className="flex min-h-screen bg-white dark:bg-[#0D0D14] transition-colors duration-300">
            <ConditionalSidebar />
            <div
                className={`flex flex-col flex-1 min-h-screen transition-all duration-300 ${
                    useSidebar ? (sidebarOpen ? "ml-64" : "ml-16") : ""
                }`}
            >
                <ConditionalNavbar />
                <main className="grow">
                    <Suspense fallback={<PageLoader />}>
                        <AppRoutes />
                    </Suspense>
                </main>
                <ConditionalFooter />
            </div>
        </div>
    );
}

function AppRoutes() {
    return (
        <Routes>
            {/* Public */}
            <Route path="/" element={<Navigate to="/auth" replace />} />
            <Route path="auth" element={<LoginView />} />
            <Route path="user/logout" element={<LogoutView />} />

            {/* Protected — role only */}
            <Route
                element={
                    <ProtectedRoute
                        role={[ROLES.USER, ROLES.ADMIN, ROLES.SADMIN]}
                    />
                }
            >
                <Route path="dashboard" element={<DashboardView />} />
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
            <Route path="login-timeout" element={<LoginTimeOut />} />
            <Route path="invalid-token" element={<InvalidToken />} />
            <Route path="page-not-found" element={<PageNotFound />} />
            <Route
                element={<ServiceUnavailable />}
                path="service-is-currently-unavailable"
            />
            <Route
                path="*"
                element={<Navigate to="/page-not-found" replace />}
            />
        </Routes>
    );
}

export default function App() {
    return (
        <>
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
            <AppContent />
        </>
    );
}
