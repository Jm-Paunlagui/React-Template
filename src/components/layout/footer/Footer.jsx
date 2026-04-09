/**
 * footers/index.jsx
 * ─────────────────
 * Simple, reusable footer.
 * Replace the copy / links with your project's needs.
 */

import {
    BASE_COLOR_TEXT,
    MAIN_STRONG_COLOR_TEXT,
} from "../../../assets/styles/pre-set-styles";

export function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="w-full border-t border-grey-200 bg-white/80 backdrop-blur-sm font-aumovio">
            <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Brand */}
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-orange-400 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-aumovio-bold">
                            A
                        </span>
                    </div>
                    <span className={`text-sm ${MAIN_STRONG_COLOR_TEXT}`}>
                        {/* Replace with your app name */}
                        AppName
                    </span>
                </div>

                {/* Copyright */}
                <p className={`text-xs ${BASE_COLOR_TEXT}`}>
                    © {year} Aumovio. All rights reserved.
                </p>

                {/* Optional links */}
                <div className="flex gap-4">
                    {[
                        { label: "Privacy", href: "/privacy" },
                        { label: "Terms", href: "/terms" },
                    ].map((l) => (
                        <a
                            key={l.label}
                            href={l.href}
                            className="text-xs text-grey-500 hover:text-orange-400 transition-colors duration-200"
                        >
                            {l.label}
                        </a>
                    ))}
                </div>
            </div>
        </footer>
    );
}

export default Footer;
