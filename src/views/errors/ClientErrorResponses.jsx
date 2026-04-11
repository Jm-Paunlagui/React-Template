/**
 * ClientErrorResponses.jsx — HTTP error page components.
 *
 * Pure UI — no API calls, no hooks beyond navigate.
 * All error pages share the same gradient + bounce animation treatment.
 * Uses Aumovio design-system components throughout.
 */

import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import Button from "../../components/ui/Button";
import { H1 } from "../../components/ui/typography/Heading";
import List from "../../components/ui/typography/List";
import Paragraph from "../../components/ui/typography/Paragraph";
import AuthMiddleware from "../../middleware/authentication/AuthMiddleware";

const ErrorLayout = ({ code, title, linkTo, linkLabel, children }) => (
    <div
        className="flex justify-center min-h-screen overflow-hidden text-white font-aumovio
        bg-linear-to-br from-pink-600 via-red-600 to-orange-600 animate-fade-in"
    >
        <div className="flex flex-col items-center justify-center text-center px-4">
            <H1 className="mb-6 text-7xl! xl:text-9xl! text-white! drop-shadow-2xl animate-bounce-slow">
                {code}
            </H1>
            <Paragraph className="mb-12 text-2xl! xl:text-5xl! font-extrabold! text-white! drop-shadow-lg animate-slide-up">
                {title}
            </Paragraph>
            {children}
            <NavLink to={linkTo}>
                <Button
                    variant="ghost"
                    size="lg"
                    className="bg-white/20! text-white! border-white/30! hover:bg-white/30! hover:text-white!"
                >
                    {linkLabel}
                </Button>
            </NavLink>
        </div>
    </div>
);

export function Unauthorized() {
    return (
        <ErrorLayout
            code="401"
            title="Unauthorized Access"
            linkTo="/"
            linkLabel="Return Home"
        />
    );
}

export function BadRequest() {
    return (
        <ErrorLayout
            code="400"
            title="Bad Request"
            linkTo="/"
            linkLabel="Return Home"
        />
    );
}

export function PageNotFound() {
    return (
        <ErrorLayout
            code="404"
            title="Page Not Found"
            linkTo="/"
            linkLabel="Return Home"
        />
    );
}

export function LoginTimeOut() {
    useEffect(() => {
        AuthMiddleware.signout();
    }, []);
    return (
        <ErrorLayout
            code="440"
            title="Session Expired — Please Sign In Again"
            linkTo="/auth"
            linkLabel="Sign In"
        />
    );
}

export function InvalidToken() {
    useEffect(() => {
        AuthMiddleware.signout();
    }, []);
    return (
        <ErrorLayout
            code="498"
            title="Invalid Token"
            linkTo="/auth"
            linkLabel="Sign In"
        />
    );
}

export function ServiceUnavailable() {
    return (
        <ErrorLayout
            code="523"
            title="Service Is Currently Unavailable"
            linkTo="/"
            linkLabel="Return Home"
        >
            <Paragraph className="mb-4 text-base! xl:text-2xl! text-white/80! animate-slide-up delay-150 max-w-270">
                This is usually caused by a temporary network issue, server
                restart, or the application service being unavailable. Please
                try again.
            </Paragraph>

            <div className="mt-8 text-base xl:text-lg text-white/80">
                <Paragraph className="text-white/80!">
                    If the issue persists, please create a support ticket with
                    the following information:
                </Paragraph>
                <div className="mt-2 text-left text-white/80 [&_li]:text-white/80!">
                    <List
                        variant="ul"
                        items={[
                            "Time of the issue",
                            "Actions taken before the error occurred",
                            "Any error messages or screenshots",
                        ]}
                    />
                </div>
                <Paragraph className="mt-4 text-white/80!">
                    Our support team will investigate and get back to you as
                    soon as possible.
                </Paragraph>
            </div>

            <div className="mt-16 px-4 py-2 flex flex-row justify-center items-center gap-3 opacity-50 cursor-not-allowed mb-8">
                <ArrowPathIcon className="w-5 h-5 text-white" />
                <Paragraph className="text-white! font-aumovio-bold!">
                    Please Refresh or Try Again Later
                </Paragraph>
            </div>
        </ErrorLayout>
    );
}
