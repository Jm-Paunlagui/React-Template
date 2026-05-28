/**
 * useDocumentTitle.js — Set document.title dynamically.
 *
 * Usage:
 *   useDocumentTitle('Admin Management');              // "Admin Management — App"
 *   useDocumentTitle('Dashboard', 'MyApp');           // "Dashboard — MyApp"
 *   useDocumentTitle('Report', undefined, true);      // keep title on unmount
 */

import { useEffect, useRef } from "react";

export function useDocumentTitle(title, suffix, keepOnUnmount = false) {
    const appName = suffix ?? import.meta.env.VITE_APP_NAME ?? "App";
    const prevTitle = useRef(document.title);

    useEffect(() => {
        if (!title) return;
        document.title = appName ? `${title} — ${appName}` : title;
        return () => {
            if (!keepOnUnmount) document.title = prevTitle.current;
        };
    }, [title, appName, keepOnUnmount]);
}

export default useDocumentTitle;
