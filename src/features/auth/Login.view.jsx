/**
 * Login.view.jsx — Login page.
 *
 * Presentation layer only. All logic lives in auth.hook.js.
 * Uses the Aumovio design-system components throughout.
 */

import { LockClosedIcon, UserIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import aumovio from "../../assets/img/aumovio.jpeg";
import Input from "../../components/forms/Input";
import Alert from "../../components/ui/Alert";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Logo from "../../components/ui/Logo";
import Divider from "../../components/ui/typography/Divider";
import { H4 } from "../../components/ui/typography/Heading";
import Paragraph from "../../components/ui/typography/Paragraph";
import { useAuth } from "./auth.hook";

const APP_NAME = import.meta.env.VITE_APP_NAME || "App";

export default function LoginView() {
    const { loading, error, login } = useAuth();
    const navigate = useNavigate();
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
        if (!ok) setErrorEffect(true);
    };

    const displayError = localError || error;

    return (
        <div className="fixed flex items-center w-full h-full min-h-screen font-aumovio">
            {/* Background image */}
            <div className="absolute inset-0 -z-10">
                <img
                    alt=""
                    className="object-cover w-full h-full"
                    src={aumovio}
                />
            </div>

            {/* Top-left logo — always on dark background image */}
            <div className="absolute z-50 top-2 left-2">
                <Logo variant="white" className="w-auto h-16 md:h-20 lg:h-24" />
            </div>

            {/* Blur overlay */}
            <div className="absolute inset-0 z-0">
                <div className="w-full h-full transition-colors duration-500 bg-white/20 dark:bg-black/90 backdrop-blur-3xl" />
            </div>

            {/* Page content */}
            <div className="relative z-10 w-full">
                <div className="container h-full mx-auto">
                    <div className="flex items-center justify-center h-full min-h-screen py-8">
                        <div className="w-11/12 md:w-7/12 lg:w-6/12 xl:w-5/12">
                            {/* Login Card */}
                            <Card
                                variant="glass"
                                padding="none"
                                className={`transition-smooth backface-hidden ${
                                    errorEffect
                                        ? "animate-shake ring-2 ring-danger-400"
                                        : ""
                                }`}
                                onAnimationEnd={() => setErrorEffect(false)}
                            >
                                <div className="px-6 py-8 lg:px-16">
                                    {/* Card Logo — theme-aware */}
                                    <div className="flex items-center justify-center mb-2 animate-fade-in-up">
                                        <Logo className="w-auto h-16 transition-transform duration-300 hover:scale-110 hover:rotate-6 drop-shadow-lg" />
                                    </div>

                                    <Divider variant="gradient" spacing="sm" />

                                    {/* Title */}
                                    <H4
                                        align="center"
                                        className="animate-fade-in-up"
                                    >
                                        Sign in to {APP_NAME}
                                    </H4>

                                    {/* Subtitle */}
                                    <Paragraph
                                        size="sm"
                                        color="muted"
                                        className="mt-2 text-center opacity-80 animate-fade-in-up"
                                    >
                                        Welcome back! Please sign in to your
                                        account
                                    </Paragraph>

                                    {/* Form */}
                                    <form
                                        className="mt-8 space-y-5 animate-fade-in-up"
                                        style={{ animationDelay: "0.2s" }}
                                        onSubmit={handleSubmit}
                                    >
                                        <Input
                                            label="Username"
                                            name="username"
                                            type="text"
                                            placeholder="Username or User ID"
                                            value={form.username}
                                            onChange={handleChange}
                                            autoComplete="username"
                                            leftIcon={UserIcon}
                                            error={
                                                errorEffect &&
                                                localError ===
                                                    "Username is required"
                                                    ? localError
                                                    : undefined
                                            }
                                        />

                                        <Input
                                            label="Password"
                                            name="password"
                                            type="password"
                                            placeholder="Password"
                                            value={form.password}
                                            onChange={handleChange}
                                            autoComplete="current-password"
                                            leftIcon={LockClosedIcon}
                                            error={
                                                errorEffect &&
                                                localError ===
                                                    "Password is required"
                                                    ? localError
                                                    : undefined
                                            }
                                        />

                                        {/* Server error */}
                                        {displayError &&
                                            localError !== displayError && (
                                                <Alert
                                                    variant="danger"
                                                    size="sm"
                                                    dismissible
                                                >
                                                    {displayError}
                                                </Alert>
                                            )}

                                        {/* Actions */}
                                        <div
                                            className="flex flex-col gap-3 pt-2 animate-fade-in-up"
                                            style={{ animationDelay: "0.4s" }}
                                        >
                                            <Button
                                                type="submit"
                                                variant="gradient"
                                                size="lg"
                                                fullWidth
                                                loading={loading}
                                            >
                                                {loading
                                                    ? "Signing In…"
                                                    : "Sign In"}
                                            </Button>

                                            <Divider
                                                label="or"
                                                variant="gradient"
                                                spacing="sm"
                                            />

                                            <Button
                                                variant="accent"
                                                size="lg"
                                                fullWidth
                                                onClick={() =>
                                                    navigate("/sign-up")
                                                }
                                            >
                                                Don&apos;t have an account? Sign
                                                up
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
