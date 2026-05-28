/**
 * changelog.hook.js
 *
 * State, server data, modals, and form logic for the Version History page.
 */

import { useCallback, useEffect, useState } from "react";
import { AuthMiddleware } from "../../../middleware/authentication/AuthMiddleware";
import { toast } from "../../../components/ui/toast.utils";
import { changelogApi } from "./changelog.api";

const EMPTY_FORM = {
    displayDate: "",
    version:     "",
    title:       "",
    summary:     "",
    type:        "feat",
    authors:     "",
    coAuthors:   "",
};

/**
 * @returns {object} hook
 */
export function useChangelog() {
    const [entries, setEntries]         = useState([]);
    const [loading, setLoading]         = useState(true);
    const [user, setUser]               = useState(null);

    // Modal state
    const [createOpen, setCreateOpen]   = useState(false);
    const [editTarget, setEditTarget]   = useState(null);   // entry being edited
    const [deleteTarget, setDeleteTarget] = useState(null); // entry pending delete

    // Form state (shared for create / edit)
    const [form, setForm]               = useState(EMPTY_FORM);
    const [saving, setSaving]           = useState(false);
    const [deleting, setDeleting]       = useState(false);

    // ── Auth ─────────────────────────────────────────────────────────────────
    useEffect(() => {
        let cancelled = false;
        (async () => {
            const u = await AuthMiddleware.isAuth();
            if (!cancelled) setUser(u || null);
        })();
        return () => { cancelled = true; };
    }, []);

    const isSuperAdmin = user?.role === "SUPER_ADMIN";

    // ── Fetch ─────────────────────────────────────────────────────────────────
    const fetchEntries = useCallback(async () => {
        setLoading(true);
        try {
            const res = await changelogApi.list();
            setEntries(res.data?.data ?? []);
        } catch {
            toast.error("Failed to load version history.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchEntries(); }, [fetchEntries]);

    // ── Create ────────────────────────────────────────────────────────────────
    const openCreate = useCallback(() => {
        setForm(EMPTY_FORM);
        setCreateOpen(true);
    }, []);

    const closeCreate = useCallback(() => {
        setCreateOpen(false);
        setForm(EMPTY_FORM);
    }, []);

    const handleCreate = useCallback(async () => {
        setSaving(true);
        try {
            const payload = buildPayload(form);
            const res = await changelogApi.create(payload);
            toast.success(res.data?.message ?? "Entry created.");
            await fetchEntries();
            closeCreate();
        } catch (err) {
            toast.error(err.response?.data?.message ?? "Failed to create entry.");
        } finally {
            setSaving(false);
        }
    }, [form, fetchEntries, closeCreate]);

    // ── Edit ──────────────────────────────────────────────────────────────────
    const openEdit = useCallback((entry) => {
        setEditTarget(entry);
        setForm({
            displayDate: entry.displayDate ?? "",
            version:     entry.version     ?? "",
            title:       entry.title       ?? "",
            summary:     entry.summary     ?? "",
            type:        entry.type        ?? "feat",
            authors:     (entry.authors    ?? []).join(", "),
            coAuthors:   (entry.coAuthors  ?? []).join(", "),
        });
    }, []);

    const closeEdit = useCallback(() => {
        setEditTarget(null);
        setForm(EMPTY_FORM);
    }, []);

    const handleUpdate = useCallback(async () => {
        if (!editTarget) return;
        setSaving(true);
        try {
            const payload = buildPayload(form);
            const res = await changelogApi.update(editTarget.id, payload);
            toast.success(res.data?.message ?? "Entry updated.");
            await fetchEntries();
            closeEdit();
        } catch (err) {
            toast.error(err.response?.data?.message ?? "Failed to update entry.");
        } finally {
            setSaving(false);
        }
    }, [editTarget, form, fetchEntries, closeEdit]);

    // ── Delete ────────────────────────────────────────────────────────────────
    const openDelete = useCallback((entry) => setDeleteTarget(entry), []);
    const closeDelete = useCallback(() => setDeleteTarget(null), []);

    const handleDelete = useCallback(async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            const res = await changelogApi.delete(deleteTarget.id);
            toast.success(res.data?.message ?? "Entry deleted.");
            await fetchEntries();
            closeDelete();
        } catch (err) {
            toast.error(err.response?.data?.message ?? "Failed to delete entry.");
        } finally {
            setDeleting(false);
        }
    }, [deleteTarget, fetchEntries, closeDelete]);

    // ── Form helpers ──────────────────────────────────────────────────────────
    const handleFormChange = useCallback((field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    }, []);

    return {
        entries,
        loading,
        user,
        isSuperAdmin,

        createOpen,
        openCreate,
        closeCreate,
        handleCreate,

        editTarget,
        openEdit,
        closeEdit,
        handleUpdate,

        deleteTarget,
        openDelete,
        closeDelete,
        handleDelete,

        form,
        handleFormChange,
        saving,
        deleting,
    };
}

// ── Internal helpers ──────────────────────────────────────────────────────────

/**
 * Converts form state to a clean API payload.
 * Authors/coAuthors: comma-separated string → trimmed string array.
 */
function buildPayload(form) {
    return {
        displayDate: form.displayDate.trim(),
        version:     form.version.trim(),
        title:       form.title.trim(),
        summary:     form.summary.trim(),
        type:        form.type,
        authors:     form.authors
            ? form.authors.split(",").map((a) => a.trim()).filter(Boolean)
            : [],
        coAuthors: form.coAuthors
            ? form.coAuthors.split(",").map((a) => a.trim()).filter(Boolean)
            : [],
    };
}
