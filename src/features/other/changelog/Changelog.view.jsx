/**
 * Changelog.view.jsx — Version History page.
 *
 * Displays all changelog entries grouped by displayDate using the Timeline
 * component.  SUPER_ADMIN users see Add / Edit / Delete controls.
 */

import {
    faBug,
    faCodeBranch,
    faFileLines,
    faGears,
    faLock,
    faPen,
    faPlus,
    faRocket,
    faShieldHalved,
    faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { ErrorBoundary } from "../../../components/feedback/ErrorBoundary";
import Button from "../../../components/ui/Button";
import Badge from "../../../components/ui/Badge";
import { Modal } from "../../../components/ui/Modal";
import { Skeleton } from "../../../components/ui/Skeleton";
import Timeline from "../../../components/ui/Timeline";
import { Input } from "../../../components/forms/Input";
import { Select } from "../../../components/forms/Select";
import { Textarea } from "../../../components/forms/Textarea";

import {
    ANIMATE_FADE_IN_UP,
    ANIMATE_PAGE_ENTER,
    ANIM_DELAY_0,
    ANIM_DELAY_100,
    ANIM_DELAY_200,
    BASE_COLOR_BG,
    BASE_COLOR_TEXT,
    GRADIENT_COLOR_TEXT,
    STANDARD_BORDER,
    TITLE_COLOR_TEXT,
    staggerDelay,
} from "../../../assets/styles/pre-set-styles";

import { useChangelog } from "./changelog.hook";

// ── Type → badge / icon / timeline-color config ───────────────────────────────

const TYPE_META = {
    feat:     { badge: "blue",    icon: faRocket,      label: "Feature",   color: "blue"    },
    fix:      { badge: "red",     icon: faBug,         label: "Bug Fix",   color: "danger"  },
    perf:     { badge: "purple",  icon: faGears,       label: "Performance", color: "purple" },
    refactor: { badge: "grey",    icon: faCodeBranch,  label: "Refactor",  color: "grey"    },
    security: { badge: "orange",  icon: faShieldHalved,label: "Security",  color: "orange"  },
    docs:     { badge: "cyan",    icon: faFileLines,   label: "Docs",      color: "blue"    },
    chore:    { badge: "grey",    icon: faGears,       label: "Chore",     color: "grey"    },
};

const TYPE_OPTIONS = Object.entries(TYPE_META).map(([value, { label }]) => ({ value, label }));

// ── Date formatting ───────────────────────────────────────────────────────────

function formatDisplayDate(iso) {
    const [y, m, d] = iso.split("-");
    return new Date(Number(y), Number(m) - 1, Number(d)).toLocaleDateString("en-US", {
        weekday: "long",
        year:    "numeric",
        month:   "long",
        day:     "numeric",
    });
}

// ── Sub-components ────────────────────────────────────────────────────────────

function VersionBadge({ version }) {
    return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-semibold text-orange-500 dark:text-orange-300 bg-orange-100/25 dark:bg-orange-400/15 border border-orange-400/30 dark:border-orange-400/25">
            v{version}
        </span>
    );
}

function AuthorList({ authors, coAuthors }) {
    if (!authors?.length && !coAuthors?.length) return null;
    return (
        <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs ${BASE_COLOR_TEXT} opacity-60`}>
            {authors?.length > 0 && (
                <span>
                    <span className="font-semibold opacity-80">By:</span>{" "}
                    {authors.join(", ")}
                </span>
            )}
            {coAuthors?.length > 0 && (
                <span>
                    <span className="font-semibold opacity-80">Co-authors:</span>{" "}
                    {coAuthors.join(", ")}
                </span>
            )}
        </div>
    );
}

function EntryActions({ entry, isSuperAdmin, onEdit, onDelete }) {
    if (!isSuperAdmin) return null;
    return (
        <div className="flex items-center gap-1 ml-2 shrink-0">
            <button
                onClick={() => onEdit(entry)}
                aria-label="Edit entry"
                className="p-1.5 rounded-lg text-grey-400 hover:text-blue-400 hover:bg-blue-400/10 transition-colors duration-150"
            >
                <FontAwesomeIcon icon={faPen} className="w-3 h-3" />
            </button>
            <button
                onClick={() => onDelete(entry)}
                aria-label="Delete entry"
                className="p-1.5 rounded-lg text-grey-400 hover:text-danger-400 hover:bg-danger-400/10 transition-colors duration-150"
            >
                <FontAwesomeIcon icon={faTrashCan} className="w-3 h-3" />
            </button>
        </div>
    );
}

// ── Changelog form (shared create / edit) ─────────────────────────────────────

function ChangelogForm({ form, onChange }) {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                    label="Display Date"
                    type="date"
                    name="displayDate"
                    value={form.displayDate}
                    onChange={(e) => onChange("displayDate", e.target.value)}
                    required
                />
                <Input
                    label="Version (e.g. 1.15.0)"
                    name="version"
                    value={form.version}
                    onChange={(e) => onChange("version", e.target.value)}
                    required
                />
            </div>
            <Select
                label="Type"
                options={TYPE_OPTIONS}
                value={form.type}
                onChange={(v) => onChange("type", v)}
            />
            <Input
                label="Title"
                name="title"
                value={form.title}
                onChange={(e) => onChange("title", e.target.value)}
                required
            />
            <Textarea
                label="Summary (user-friendly description)"
                name="summary"
                value={form.summary}
                onChange={(e) => onChange("summary", e.target.value)}
                rows={5}
                required
            />
            <Input
                label="Authors (comma-separated)"
                name="authors"
                placeholder="e.g. John Smith, Jane Doe"
                value={form.authors}
                onChange={(e) => onChange("authors", e.target.value)}
            />
            <Input
                label="Co-authors (comma-separated)"
                name="coAuthors"
                placeholder="e.g. Alice Johnson"
                value={form.coAuthors}
                onChange={(e) => onChange("coAuthors", e.target.value)}
            />
        </div>
    );
}

// ── Date group separator ──────────────────────────────────────────────────────

function DateGroupHeader({ displayDate, index }) {
    return (
        <div className={`flex items-center gap-3 ${ANIMATE_FADE_IN_UP} ${staggerDelay(index)}`}>
            <div className="h-px flex-1 bg-grey-200 dark:bg-[#251d3a]" />
            <span className={`text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full bg-grey-100 dark:bg-[#251d3a] ${BASE_COLOR_TEXT} opacity-60`}>
                {formatDisplayDate(displayDate)}
            </span>
            <div className="h-px flex-1 bg-grey-200 dark:bg-[#251d3a]" />
        </div>
    );
}

// ── Main content ──────────────────────────────────────────────────────────────

function ChangelogContent() {
    const hook = useChangelog();

    // Build Timeline items per group
    const groups = groupByDate(hook.entries);
    const dateKeys = Object.keys(groups).sort((a, b) => b.localeCompare(a));

    return (
        <div className="max-w-3xl mx-auto px-4 py-10 font-aumovio space-y-10">

            {/* ── Header ─────────────────────────────────────────────────── */}
            <div className={`flex flex-wrap items-start justify-between gap-4 ${ANIMATE_FADE_IN_UP} ${ANIM_DELAY_0}`}>
                <div>
                    <h1 className={`text-3xl font-extrabold ${TITLE_COLOR_TEXT}`}>
                        Version{" "}
                        <span className={GRADIENT_COLOR_TEXT}>History</span>
                    </h1>
                    <p className={`mt-1 text-sm ${BASE_COLOR_TEXT} opacity-70`}>
                        What&apos;s changed in the eMeal Monitoring System
                    </p>
                </div>
                {hook.isSuperAdmin && (
                    <Button variant="primary" size="sm" onClick={hook.openCreate}>
                        <FontAwesomeIcon icon={faPlus} className="mr-1.5 w-3.5 h-3.5" />
                        New Entry
                    </Button>
                )}
            </div>

            {/* ── Loading skeleton ───────────────────────────────────────── */}
            {hook.loading && (
                <div className={`space-y-8 ${ANIMATE_FADE_IN_UP} ${ANIM_DELAY_100}`}>
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="space-y-3">
                            <Skeleton className="h-4 w-48 rounded-full" />
                            <div className={`p-5 rounded-2xl ${BASE_COLOR_BG} ${STANDARD_BORDER} space-y-2`}>
                                <Skeleton className="h-5 w-2/3 rounded" />
                                <Skeleton className="h-4 w-full rounded" />
                                <Skeleton className="h-4 w-4/5 rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Empty state ────────────────────────────────────────────── */}
            {!hook.loading && hook.entries.length === 0 && (
                <div className={`text-center py-20 rounded-2xl ${BASE_COLOR_BG} ${STANDARD_BORDER} ${ANIMATE_FADE_IN_UP} ${ANIM_DELAY_100}`}>
                    <FontAwesomeIcon icon={faLock} className="text-4xl text-grey-300 dark:text-grey-600 mb-3" />
                    <p className={`${BASE_COLOR_TEXT} opacity-60`}>No changelog entries yet.</p>
                </div>
            )}

            {/* ── Date groups ────────────────────────────────────────────── */}
            {!hook.loading && dateKeys.map((date, groupIdx) => {
                const items = groups[date].map((entry) => {
                    const meta = TYPE_META[entry.type] ?? TYPE_META.feat;
                    return {
                        id:    entry.id,
                        title: (
                            <div className="flex flex-wrap items-center justify-between gap-2 w-full">
                                <div className="flex flex-wrap items-center gap-2 min-w-0">
                                    <VersionBadge version={entry.version} />
                                    <span className="font-semibold text-sm text-black/85 dark:text-white/90 leading-tight">
                                        {entry.title}
                                    </span>
                                    <Badge variant={meta.badge} size="xs" pill>
                                        {meta.label}
                                    </Badge>
                                </div>
                                <EntryActions
                                    entry={entry}
                                    isSuperAdmin={hook.isSuperAdmin}
                                    onEdit={hook.openEdit}
                                    onDelete={hook.openDelete}
                                />
                            </div>
                        ),
                        description: (
                            <div>
                                <p className={`text-sm leading-relaxed ${BASE_COLOR_TEXT} opacity-80`}>
                                    {entry.summary}
                                </p>
                                <AuthorList authors={entry.authors} coAuthors={entry.coAuthors} />
                            </div>
                        ),
                        date:  null, // date shown in the group header
                        icon:  () => <FontAwesomeIcon icon={meta.icon} className="w-3.5 h-3.5" />,
                        color: meta.color,
                    };
                });

                return (
                    <div key={date} className={`space-y-4 ${ANIMATE_FADE_IN_UP} ${staggerDelay(groupIdx)}`}>
                        <DateGroupHeader displayDate={date} index={groupIdx} />
                        <div className={`pl-2 pr-1 py-4 rounded-2xl ${BASE_COLOR_BG} ${STANDARD_BORDER}`}>
                            <Timeline items={items} variant="left" connect={items.length > 1} />
                        </div>
                    </div>
                );
            })}

            {/* ── Summary footer ─────────────────────────────────────────── */}
            {!hook.loading && hook.entries.length > 0 && (
                <p className={`text-center text-xs ${BASE_COLOR_TEXT} opacity-40 pb-4 ${ANIMATE_FADE_IN_UP} ${ANIM_DELAY_200}`}>
                    Showing {hook.entries.length} release{hook.entries.length !== 1 ? "s" : ""} across {dateKeys.length} date{dateKeys.length !== 1 ? "s" : ""}
                </p>
            )}

            {/* ── Create modal ────────────────────────────────────────────── */}
            <Modal
                open={hook.createOpen}
                onClose={hook.closeCreate}
                title="New Changelog Entry"
                footer={
                    <>
                        <Button variant="ghost" onClick={hook.closeCreate} disabled={hook.saving}>
                            Cancel
                        </Button>
                        <Button variant="primary" loading={hook.saving} onClick={hook.handleCreate}>
                            Create Entry
                        </Button>
                    </>
                }
            >
                <ChangelogForm form={hook.form} onChange={hook.handleFormChange} />
            </Modal>

            {/* ── Edit modal ─────────────────────────────────────────────── */}
            <Modal
                open={!!hook.editTarget}
                onClose={hook.closeEdit}
                title="Edit Changelog Entry"
                footer={
                    <>
                        <Button variant="ghost" onClick={hook.closeEdit} disabled={hook.saving}>
                            Cancel
                        </Button>
                        <Button variant="primary" loading={hook.saving} onClick={hook.handleUpdate}>
                            Save Changes
                        </Button>
                    </>
                }
            >
                <ChangelogForm form={hook.form} onChange={hook.handleFormChange} />
            </Modal>

            {/* ── Delete confirm modal ───────────────────────────────────── */}
            <Modal
                open={!!hook.deleteTarget}
                onClose={hook.closeDelete}
                title="Delete Entry"
                variant="danger"
                footer={
                    <>
                        <Button variant="ghost" onClick={hook.closeDelete} disabled={hook.deleting}>
                            Cancel
                        </Button>
                        <Button variant="danger" loading={hook.deleting} onClick={hook.handleDelete}>
                            Delete
                        </Button>
                    </>
                }
            >
                <p className={`text-sm ${BASE_COLOR_TEXT}`}>
                    Are you sure you want to permanently delete{" "}
                    <span className="font-semibold">&ldquo;{hook.deleteTarget?.title}&rdquo;</span>?
                    This action cannot be undone.
                </p>
            </Modal>
        </div>
    );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Groups entries by displayDate (already adjusted: Sat→Fri, Sun→Mon on the backend seed).
 * @param {object[]} entries
 * @returns {Record<string, object[]>}
 */
function groupByDate(entries) {
    return entries.reduce((acc, entry) => {
        const key = entry.displayDate;
        if (!acc[key]) acc[key] = [];
        acc[key].push(entry);
        return acc;
    }, {});
}

// ── Export ────────────────────────────────────────────────────────────────────

export default function ChangelogView() {
    return (
        <div className={ANIMATE_PAGE_ENTER}>
            <ErrorBoundary>
                <ChangelogContent />
            </ErrorBoundary>
        </div>
    );
}
