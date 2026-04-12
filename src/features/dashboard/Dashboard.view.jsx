/**
 * Dashboard.jsx
 * ─────────────
 * Authenticated landing page.
 * Replace with your project's real dashboard content.
 */

import { BASE_COLOR_TEXT, STATUS_BLUE, STATUS_GREEN, STATUS_WARNING, TITLE_COLOR_TEXT } from "../../assets/styles/pre-set-styles";

export default function Dashboard() {
    return (
        <div className="max-w-7xl mx-auto px-4 py-10 font-aumovio space-y-8">
            {/* Page header */}
            <div>
                <h1 className={`text-3xl font-extrabold ${TITLE_COLOR_TEXT}`}>Dashboard</h1>
                <p className={`mt-1 ${BASE_COLOR_TEXT}`}>Welcome back. Here's your overview.</p>
            </div>

            {/* Stat cards — replace with real data */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                    { label: "Active Items", value: "—", status: STATUS_GREEN },
                    {
                        label: "Pending Actions",
                        value: "—",
                        status: STATUS_WARNING,
                    },
                    { label: "Total Records", value: "—", status: STATUS_BLUE },
                ].map((s) => (
                    <div key={s.label} className="bg-white dark:bg-[#1a1030] rounded-xl border border-grey-200 dark:border-grey-700 shadow-sm p-6 space-y-3">
                        <p className={`text-sm ${BASE_COLOR_TEXT}`}>{s.label}</p>
                        <p className={`text-4xl font-extrabold ${TITLE_COLOR_TEXT}`}>{s.value}</p>
                        <span className={`inline-block px-3 py-1 text-xs rounded-full ${s.status}`}>Up to date</span>
                    </div>
                ))}
            </div>

            {/* Placeholder content area */}
            <div className="bg-white dark:bg-[#1a1030] rounded-xl border border-grey-200 dark:border-grey-700 shadow-sm p-8 text-center">
                <p className={`${BASE_COLOR_TEXT} text-lg`}>Your dashboard content goes here.</p>
            </div>
        </div>
    );
}
