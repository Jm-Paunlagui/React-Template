/**
 * Select — Styled dropdown for option picking.
 *
 * Props:
 *   options  — [{ value, label, group? }]
 *   value, onChange, label, placeholder, error, disabled, multiple, size
 */
import { ChevronDownIcon } from "@heroicons/react/24/outline";

export function Select({ options = [], value, onChange, label, placeholder = "Select…", error, disabled = false, multiple = false, size = "md", id, name }) {
    const inputId = id ?? name;
    const SZ = {
        sm: "py-1.5 text-xs",
        md: "py-2 text-sm",
        lg: "py-3 text-base",
    };

    const groups = [...new Set(options.map((o) => o.group).filter(Boolean))];
    const ungrouped = options.filter((o) => !o.group);

    const renderOptions = (opts) =>
        opts.map((o) => (
            <option key={o.value} value={o.value}>
                {o.label}
            </option>
        ));

    return (
        <div className="font-aumovio">
            {label && (
                <label htmlFor={inputId} className="block text-xs font-aumovio-bold text-black/70 dark:text-white/70 mb-1.5">
                    {label}
                </label>
            )}
            <div className="relative">
                <select
                    id={inputId}
                    name={name}
                    value={value}
                    multiple={multiple}
                    disabled={disabled}
                    onChange={(e) => onChange?.(multiple ? [...e.target.selectedOptions].map((o) => o.value) : e.target.value)}
                    className={`w-full rounded-xl border px-3 pr-8 font-aumovio appearance-none cursor-pointer
            bg-white dark:bg-[#1a1030] text-black/85 dark:text-white/85
            focus:outline-none focus:ring-2 focus:shadow-md transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            ${SZ[size] ?? SZ.md}
            ${error ? "border-danger-400 focus:ring-danger-400/30" : "border-grey-300 dark:border-grey-700 focus:ring-orange-400/30 focus:border-orange-400"}`}
                >
                    {placeholder && !multiple && <option value="">{placeholder}</option>}
                    {groups.length > 0 ? (
                        <>
                            {ungrouped.length > 0 && renderOptions(ungrouped)}
                            {groups.map((g) => (
                                <optgroup key={g} label={g}>
                                    {renderOptions(options.filter((o) => o.group === g))}
                                </optgroup>
                            ))}
                        </>
                    ) : (
                        renderOptions(options)
                    )}
                </select>
                {!multiple && <ChevronDownIcon className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-grey-400 pointer-events-none" />}
            </div>
            {error && <p className="mt-1.5 text-xs text-danger-400 font-aumovio-bold">{error}</p>}
        </div>
    );
}

export default Select;
