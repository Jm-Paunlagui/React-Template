import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "../../../components/ui/toast.utils";
import { useRequest } from "../../../hooks/useRequest";
import { auditLogApi } from "./loggingnobservability.api";

/**
 * Format a Date object as a local YYYY-MM-DD string without UTC conversion.
 * Using toISOString() would apply a UTC offset that shifts the date back by one
 * day for users in UTC+ timezones.
 *
 * @param {Date} d
 * @returns {string}
 */
const _localDateStr = (d) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
};

const _thirtyDaysAgo = () => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return _localDateStr(d);
};

const _today = () => _localDateStr(new Date());

/**
 * Hook for the Logging & Observability feature.
 * Manages stats date range, table filters, pagination, and data fetching.
 *
 * @returns {object} All state and callbacks needed by LogsManagementView.
 */
const useLogsManagement = () => {
    const [statsDateRange, setStatsDateRange] = useState({
        fromDate: _thirtyDaysAgo(),
        toDate: _today(),
    });

    const [filters, setFilters] = useState({
        fromDate: "",
        toDate: "",
        method: "",
        statusCategory: "",
        search: "",
    });

    const [page, setPage] = useState(1);
    const pageSize = 20;

    // ── Investigation modal state ──
    const [selectedRow, setSelectedRow] = useState(null);
    const [logsModalOpen, setLogsModalOpen] = useState(false);
    const [requestLogsData, setRequestLogsData] = useState(null);
    const [requestLogsLoading, setRequestLogsLoading] = useState(false);

    // Keys must be stable primitive strings — arrays compare by reference in
    // useCallback deps and Map lookups, causing a cache miss and new API call
    // every render (infinite loop).
    const statsKey = `audit-logs/stats?from=${statsDateRange.fromDate}&to=${statsDateRange.toDate}`;
    const listKey = `audit-logs/list?page=${page}&from=${filters.fromDate}&to=${filters.toDate}&method=${filters.method}&status=${filters.statusCategory}&search=${filters.search}`;

    const { data: statsData, loading: statsLoading, refetch: refetchStats } = useRequest(statsKey, () => auditLogApi.stats(statsDateRange), { staleTime: 60_000 });

    const { data: listData, loading: listLoading, refetch: refetchList } = useRequest(listKey, () => auditLogApi.list({ ...filters, page, pageSize }), { staleTime: 30_000 });

    // ── Auto-refresh (30 s, paused while browser tab is hidden) ──────────────────
    const REFRESH_SECS = 30;

    const [countdown, setCountdown] = useState(REFRESH_SECS);
    const [isAutoRefreshing, setIsAutoRefreshing] = useState(false);

    // Always-current refs — updated each render; safe to read inside the interval
    // callback without re-running the effect (CWE-362 stale-closure guard).
    const latestRefetchStats = useRef(refetchStats);
    const latestRefetchList = useRef(refetchList);
    latestRefetchStats.current = refetchStats;
    latestRefetchList.current = refetchList;

    const cdRef = useRef(REFRESH_SECS);    // live countdown, readable in interval
    const pausedRef = useRef(false);       // true when document is hidden
    const isRefreshingRef = useRef(false); // guard against concurrent refreshes

    /**
     * Force-refresh both stats and list, then reset the 30-second countdown.
     * Idempotent: concurrent calls are collapsed into one in-flight request.
     *
     * @returns {Promise<void>}
     */
    const triggerRefresh = useCallback(async () => {
        if (isRefreshingRef.current) return;
        isRefreshingRef.current = true;
        cdRef.current = REFRESH_SECS;
        setCountdown(REFRESH_SECS);
        setIsAutoRefreshing(true);
        try {
            await Promise.all([latestRefetchStats.current(), latestRefetchList.current()]);
        } finally {
            isRefreshingRef.current = false;
            setIsAutoRefreshing(false);
        }
    }, []);

    useEffect(() => {
        const tick = () => {
            if (pausedRef.current || isRefreshingRef.current) return;
            cdRef.current -= 1;
            setCountdown(cdRef.current);
            if (cdRef.current <= 0) triggerRefresh();
        };

        const onVisibilityChange = () => {
            pausedRef.current = document.visibilityState === "hidden";
            // If we returned to the page and the countdown had already expired,
            // refresh immediately rather than waiting for the next tick.
            if (!pausedRef.current && cdRef.current <= 0 && !isRefreshingRef.current) {
                triggerRefresh();
            }
        };

        const id = setInterval(tick, 1_000);
        document.addEventListener("visibilitychange", onVisibilityChange);
        return () => {
            clearInterval(id);
            document.removeEventListener("visibilitychange", onVisibilityChange);
        };
    }, [triggerRefresh]);

    /**
     * Update a single filter field and reset pagination to page 1.
     *
     * @param {string} field - The filter key to update.
     * @param {string} value - The new value.
     */
    const handleFilterChange = (field, value) => {
        setFilters((prev) => {
            if (prev[field] === value) return prev;
            return { ...prev, [field]: value };
        });
        setPage(1);
    };

    /**
     * Navigate to a specific table page.
     *
     * @param {number} newPage
     */
    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    /**
     * Open the investigation modal for a specific audit log row.
     * Fetches correlated log lines by REQUEST_ID from the server.
     *
     * @param {object} row - Audit log row from the table.
     */
    const handleViewRow = async (row) => {
        setSelectedRow(row);
        setLogsModalOpen(true);
        setRequestLogsData(null);
        setRequestLogsLoading(true);
        try {
            const date = _localDateStr(new Date(row.CREATED_AT));
            const data = await auditLogApi.requestLogs(row.REQUEST_ID, date);
            setRequestLogsData(data);
        } catch {
            setRequestLogsData({ status: "error", data: { lines: [] } });
            toast.error("Could not load log trace for this request.");
        } finally {
            setRequestLogsLoading(false);
        }
    };

    /** Close the investigation modal and reset its state. */
    const handleCloseLogsModal = () => {
        setLogsModalOpen(false);
        setSelectedRow(null);
        setRequestLogsData(null);
    };

    /**
     * Export a single request trace as an Excel (.xlsx) file.
     * Downloads the workbook generated by the backend (Request Summary + Log Trace sheets).
     *
     * @param {object} row  - Audit log row (must have REQUEST_ID and CREATED_AT).
     * @param {string} date - ISO date string YYYY-MM-DD for the log file search.
     * @returns {Promise<void>}
     */
    const handleExportTrace = async (row, date) => {
        if (!row?.REQUEST_ID || !date) return;
        try {
            const buffer = await auditLogApi.traceExcel(row.REQUEST_ID, date);
            const url = URL.createObjectURL(new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
            const a = document.createElement("a");
            a.href = url;
            a.download = `trace-${row.REQUEST_ID}-${date.replace(/-/g, "")}.xlsx`;
            a.click();
            URL.revokeObjectURL(url);
        } catch {
            toast.error("Failed to export trace. Please try again.");
        }
    };

    // ── Delete Logging stepper state ──────────────────────────────────────────
    const [deleteStep, setDeleteStep] = useState(1);
    const [deleteFromDate, setDeleteFromDate] = useState("");
    const [deleteToDate, setDeleteToDate] = useState("");
    const [deleteConfirmed, setDeleteConfirmed] = useState(false);
    const [deleting, setDeleting] = useState(false);

    /**
     * Download Excel export of DB audit records for the selected delete range.
     * Triggers a browser download of the generated workbook.
     *
     * @returns {Promise<void>}
     */
    const handleExportDeleteExcel = async () => {
        if (!deleteFromDate || !deleteToDate) return;
        try {
            const res = await auditLogApi.exportExcel({ fromDate: deleteFromDate, toDate: deleteToDate });
            const url = URL.createObjectURL(new Blob([res], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
            const a = document.createElement("a");
            a.href = url;
            a.download = `audit-logs-${deleteFromDate}-to-${deleteToDate}.xlsx`;
            a.click();
            URL.revokeObjectURL(url);
            triggerRefresh();
        } catch {
            toast.error("Failed to generate Excel export.");
        }
    };

    /**
     * Download ZIP of server log files for the selected delete range.
     * Triggers a browser download of the generated archive.
     *
     * @returns {Promise<void>}
     */
    const handleExportDeleteLogs = async () => {
        if (!deleteFromDate || !deleteToDate) return;
        try {
            const res = await auditLogApi.exportLogs({ fromDate: deleteFromDate, toDate: deleteToDate });
            const url = URL.createObjectURL(new Blob([res], { type: "application/zip" }));
            const a = document.createElement("a");
            a.href = url;
            a.download = `server-logs-${deleteFromDate}-to-${deleteToDate}.zip`;
            a.click();
            URL.revokeObjectURL(url);
            triggerRefresh();
        } catch {
            toast.error("Failed to generate log ZIP.");
        }
    };

    /**
     * Permanently delete all audit DB records and log files in the selected range.
     * Advances the stepper to step 3 on success.
     *
     * @returns {Promise<void>}
     */
    const handleConfirmDelete = async () => {
        if (!deleteConfirmed || !deleteFromDate || !deleteToDate) return;
        setDeleting(true);
        try {
            await auditLogApi.deleteRange({ fromDate: deleteFromDate, toDate: deleteToDate });
            toast.success("Audit records and log files permanently deleted.");
            setDeleteStep(3);
            triggerRefresh();
        } catch {
            toast.error("Deletion failed. Please try again.");
        } finally {
            setDeleting(false);
        }
    };

    /**
     * Reset the Delete Logging stepper back to step 1, clearing all state.
     */
    const handleResetDeleteStepper = () => {
        setDeleteStep(1);
        setDeleteFromDate("");
        setDeleteToDate("");
        setDeleteConfirmed(false);
    };

    return {
        // Stats
        statsData,
        statsLoading,
        statsDateRange,
        setStatsDateRange,
        // List
        listData,
        listLoading,
        filters,
        page,
        pageSize,
        // Callbacks
        handleFilterChange,
        handlePageChange,
        refetchList,
        // Auto-refresh
        countdown,
        isAutoRefreshing,
        triggerRefresh,
        // Trace modal
        logsModalOpen,
        selectedRow,
        requestLogsData,
        requestLogsLoading,
        handleViewRow,
        handleCloseLogsModal,
        handleExportTrace,
        // Delete Logging stepper
        deleteStep,
        setDeleteStep,
        deleteFromDate,
        setDeleteFromDate,
        deleteToDate,
        setDeleteToDate,
        deleteConfirmed,
        setDeleteConfirmed,
        deleting,
        handleExportDeleteExcel,
        handleExportDeleteLogs,
        handleConfirmDelete,
        handleResetDeleteStepper,
    };
};

export default useLogsManagement;
