/**
 * ClientErrorResponses.jsx — HTTP error page components.
 *
 * Pure UI — no API calls, no hooks beyond navigate.
 * All error pages share the same gradient + bounce animation treatment.
 */

import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import AuthMiddleware from "../../middleware/authentication/AuthMiddleware";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRepeat } from "@fortawesome/free-solid-svg-icons";
import { ICON_PLACE_SELF_CENTER } from "../../assets/styles/pre-set-styles";

const ErrorLayout = ({ code, title, linkTo, linkLabel }) => (
    <div
        className="flex justify-center min-h-screen overflow-hidden text-white font-sans
        bg-linear-to-br from-pink-600 via-red-600 to-orange-600 animate-fade-in"
    >
        <div className="flex flex-col items-center justify-center text-center px-4">
            <h1 className="mb-6 text-7xl font-extrabold xl:text-9xl drop-shadow-2xl animate-bounce-slow">
                {code}
            </h1>
            <p className="mb-12 text-2xl font-extrabold xl:text-5xl drop-shadow-lg animate-slide-up">
                {title}
            </p>
            <NavLink to={linkTo}>
                <div
                    className="px-6 py-3 font-bold text-white rounded-lg bg-white/20
                    hover:bg-white/30 border border-white/30 transition-all duration-200
                    hover:scale-105 active:scale-95"
                >
                    {linkLabel}
                </div>
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
        <div className="flex justify-center min-h-screen overflow-hidden text-white font-aumovio bg-linear-to-br from-pink-600 via-red-600 to-orange-600 animate-fade-in">
            <div className="flex flex-col items-center justify-center text-center animate-scale-in-center">
                <div className="mb-8 animate-bounce-slow">
                    <h1 className="text-6xl font-extrabold xl:text-9xl drop-shadow-2xl animate-pulse">
                        523
                    </h1>
                </div>
                <p className="mb-4 text-3xl font-extrabold delay-150 xl:text-6xl drop-shadow-lg animate-slide-up">
                    Service Is Currently Unavailable
                </p>
                <p
                    className="mb-4 text-base xl:text-2xl opacity-80 animate-slide-up delay-150"
                    style={{ maxWidth: 1080 }}
                >
                    This is usually caused by a temporary network issue, server
                    restart, or the application service being unavailable.
                    Please try again.
                </p>

                {/* Ticketing or support information could be added here in the future */}
                <div className="mt-8 text-base xl:text-lg opacity-80">
                    If the issue persists, please create a support ticket with
                    the following information:
                    <ul className="list-disc list-inside mt-2 text-left">
                        <li>Time of the issue</li>
                        <li>Actions taken before the error occurred</li>
                        <li>Any error messages or screenshots</li>
                    </ul>
                    <p className="mt-4">
                        Our support team will investigate and get back to you as
                        soon as possible.
                    </p>
                </div>
                <div className="mt-16 px-4 py-2 flex flex-row justify-center items-center gap-3 opacity-50 cursor-not-allowed">
                    <FontAwesomeIcon
                        className={`${ICON_PLACE_SELF_CENTER} text-white`}
                        icon={faRepeat}
                    />
                    <h1 className="text-center text-white font-aumovio-bold">
                        Please Refresh or Try Again Later
                    </h1>
                </div>
            </div>
        </div>
    );
}
