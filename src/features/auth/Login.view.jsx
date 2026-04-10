/**
 * Login.view.jsx — Login page.
 *
 * Presentation layer only. All logic lives in auth.hook.js.
 * Visual design ported from OPITS-FE AuthLogin.jsx.
 */

import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../../assets/aumovio/AUMOVIO_Logo_orange_black_RGB.png";
import whiteLogo from "../../assets/aumovio/Aumovio_Logo_white_white_RGB.png";
import aumovio from "../../assets/img/aumovio.jpeg";
import {
    ACCENT_BUTTON,
    BASE_COLOR_BG,
    ERROR_MESSAGE,
    MAIN_COLOR_TEXT,
    SUBTITLE_COLOR_TEXT,
    TEXT_FIELD,
    TITLE_COLOR_TEXT,
} from "../../assets/styles/pre-set-styles";
import LoadingSpinner from "../../components/feedback/LoadingSpinner";
import { useAuth } from "./auth.hook";

const APP_NAME = import.meta.env.VITE_APP_NAME || "App";

export default function LoginView() {
    const { loading, error, login } = useAuth();
    const [form, setForm] = useState({ username: "", password: "" });
    const [errorEffect, setErrorEffect] = useState(false);
    const [localError, setLocalError] = useState("");

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setErrorEffect(false);
        setLocalError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.username.trim()) {
            setLocalError("Username is required");
            setErrorEffect(true);
            return;
        }
        if (!form.password.trim()) {
            setLocalError("Password is required");
            setErrorEffect(true);
            return;
        }

        const ok = await login(form);
        if (!ok) {
            setErrorEffect(true);
        }
    };

    const displayError = localError || error;

    return (
        <div className="fixed flex items-center w-full h-full min-h-screen font-aumovio">
            {/* Background image */}
            <div className="absolute inset-0 -z-10">
                <img
                    alt="bg"
                    className="object-cover w-full h-full"
                    src={aumovio}
                />
            </div>

            {/* Top-left logo */}
            <div className="absolute top-0.5 left-0.5 z-50">
                <img
                    alt="logo"
                    className="w-auto h-16 md:h-20 lg:h-24"
                    src={whiteLogo}
                />
            </div>

            {/* Blur overlay */}
            <div className="absolute inset-0 z-0">
                <div className="w-full h-full bg-white/20 backdrop-blur-3xl" />
            </div>

            {/* Page content */}
            <div className="relative z-10 w-full">
                <div className="container h-full mx-auto">
                    <div className="flex items-center content-center justify-center h-full min-h-screen py-8">
                        <div className="w-11/12 md:w-7/12 lg:w-6/12 xl:w-5/12">
                            <div
                                className={`relative flex flex-col w-full min-w-0 wrap-break-word ${BASE_COLOR_BG} rounded-lg shadow-lg transition-smooth backface-hidden ${errorEffect ? "animate-shake outline-2 outline-red-500" : ""}`}
                                onAnimationEnd={() => setErrorEffect(false)}
                            >
                                <div className="px-6 lg:px-28">
                                    {/* Logo */}
                                    <NavLink to="/">
                                        <div className="flex items-center justify-center py-2 text-gray-800 animate-fade-in-up">
                                            <img
                                                alt="logo"
                                                className="w-auto h-16 mt-4 transition-smooth backface-hidden hover:scale-110 hover:rotate-12 drop-shadow-lg"
                                                src={logo}
                                            />
                                        </div>
                                    </NavLink>

                                    <div className="flex-auto pt-0 mb-24 -mt-14">
                                        {/* Title */}
                                        <h6
                                            className={`mt-16 text-xl ${TITLE_COLOR_TEXT} xl:text-3xl text-center animate-fade-in-up`}
                                        >
                                            Sign in to {APP_NAME}
                                        </h6>

                                        {/* Subtitle */}
                                        <p
                                            className={`text-center ${SUBTITLE_COLOR_TEXT} opacity-70 mt-2 animate-fade-in-up`}
                                            style={{ animationDelay: "0.1s" }}
                                        >
                                            Welcome back! Please sign in to your
                                            account
                                        </p>

                                        <div className="mt-6 text-start">
                                            <div
                                                className="animate-fade-in-up"
                                                style={{
                                                    animationDelay: "0.2s",
                                                }}
                                            >
                                                <form
                                                    className="relative mx-auto mt-6 mb-6 max-w-screen"
                                                    onSubmit={handleSubmit}
                                                >
                                                    <div className="space-y-6">
                                                        <div>
                                                            <input
                                                                className={`${TEXT_FIELD} outline transition-smooth focus:scale-[1.02] backface-hidden ${
                                                                    errorEffect
                                                                        ? "outline-red-500 placeholder-red-500 text-red-500 outline-2 animate-shake"
                                                                        : `${MAIN_COLOR_TEXT} bg-white bg-opacity-70 outline-orange-100 outline-2 focus:outline-orange-300 focus:shadow-lg hover:shadow-md`
                                                                }`}
                                                                name="username"
                                                                onChange={
                                                                    handleChange
                                                                }
                                                                placeholder="Username or User ID"
                                                                type="text"
                                                                value={
                                                                    form.username
                                                                }
                                                                autoComplete="username"
                                                            />
                                                        </div>
                                                        <div>
                                                            <input
                                                                className={`${TEXT_FIELD} outline transition-smooth focus:scale-[1.02] backface-hidden ${
                                                                    errorEffect
                                                                        ? "outline-red-500 placeholder-red-500 text-red-500 outline-2 animate-shake"
                                                                        : `${MAIN_COLOR_TEXT} bg-white bg-opacity-70 outline-orange-100 outline-2 focus:outline-orange-300 focus:shadow-lg hover:shadow-md`
                                                                }`}
                                                                name="password"
                                                                onChange={
                                                                    handleChange
                                                                }
                                                                placeholder="Password"
                                                                type="password"
                                                                value={
                                                                    form.password
                                                                }
                                                                autoComplete="current-password"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Error message */}
                                                    {displayError && (
                                                        <div
                                                            className={`mt-2 ${ERROR_MESSAGE} animate-fade-in-up`}
                                                        >
                                                            {displayError}
                                                        </div>
                                                    )}

                                                    <div
                                                        className="flex flex-col justify-center mt-8 space-y-4 animate-fade-in-up"
                                                        style={{
                                                            animationDelay:
                                                                "0.4s",
                                                        }}
                                                    >
                                                        <button
                                                            className={`px-4 py-2 flex flex-row justify-center items-center rounded-lg shadow-lg transform transition-smooth backface-hidden hover:scale-105 hover:shadow-xl ${ACCENT_BUTTON} ${
                                                                loading
                                                                    ? "opacity-50 cursor-not-allowed pointer-events-none"
                                                                    : ""
                                                            }`}
                                                            type="submit"
                                                            disabled={loading}
                                                        >
                                                            {loading ? (
                                                                <LoadingSpinner size="sm" />
                                                            ) : null}
                                                            <span
                                                                className={
                                                                    loading
                                                                        ? "ml-2"
                                                                        : ""
                                                                }
                                                            >
                                                                {loading
                                                                    ? "Signing In..."
                                                                    : "Sign In"}
                                                            </span>
                                                        </button>
                                                        <Link
                                                            to="/sign-up"
                                                            className={`px-4 py-2 text-center transition-smooth backface-hidden ${ACCENT_BUTTON} block rounded-lg hover:shadow-lg transform hover:scale-105`}
                                                        >
                                                            Don&apos;t have an
                                                            account? Sign up
                                                        </Link>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
