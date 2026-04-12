/**
 * Datepicker — Calendar date selection.
 *
 * Props:
 *   value      — Date | null
 *   onChange   — (date: Date) => void
 *   placeholder — string
 *   minDate    — Date
 *   maxDate    — Date
 *   disabled   — boolean
 *   range      — boolean (returns [startDate, endDate])
 */
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { addMonths, eachDayOfInterval, endOfMonth, endOfWeek, format, isAfter, isBefore, isSameDay, isSameMonth, isToday, startOfMonth, startOfWeek, subMonths } from "date-fns";
import { useEffect, useRef, useState } from "react";

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export function Datepicker({ value = null, onChange, placeholder = "Select date", minDate, maxDate, disabled = false }) {
    const [open, setOpen] = useState(false);
    const [viewDate, setViewDate] = useState(value ?? new Date());
    const ref = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (!ref.current?.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const days = eachDayOfInterval({
        start: startOfWeek(startOfMonth(viewDate)),
        end: endOfWeek(endOfMonth(viewDate)),
    });

    const isDisabled = (d) => (minDate && isBefore(d, minDate)) || (maxDate && isAfter(d, maxDate));

    return (
        <div ref={ref} className="relative inline-block w-full font-aumovio">
            <button
                type="button"
                onClick={() => !disabled && setOpen((o) => !o)}
                disabled={disabled}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg border text-sm text-left
          bg-white dark:bg-[#1a1030] text-black/80 dark:text-white/80
          transition-all duration-200
          ${open ? "border-orange-400 ring-2 ring-orange-400/30 shadow-md" : "border-grey-300 dark:border-grey-700 hover:border-orange-400/50"}
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            >
                <CalendarIcon className="w-4 h-4 text-grey-400 shrink-0" />
                <span className={value ? "text-black dark:text-white" : "text-grey-400"}>{value ? format(value, "MMM dd, yyyy") : placeholder}</span>
            </button>

            {open && (
                <div
                    className="absolute top-full left-0 mt-2 z-50 bg-white dark:bg-[#1a1030]
          border border-grey-200 dark:border-grey-700 rounded-xl shadow-2xl p-4 w-72 animate-scale-in"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <button onClick={() => setViewDate(subMonths(viewDate, 1))} className="p-1.5 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-400/10 text-grey-500 hover:text-orange-400 transition-colors">
                            <ChevronLeftIcon className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-aumovio-bold text-black/85 dark:text-white/90">{format(viewDate, "MMMM yyyy")}</span>
                        <button onClick={() => setViewDate(addMonths(viewDate, 1))} className="p-1.5 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-400/10 text-grey-500 hover:text-orange-400 transition-colors">
                            <ChevronRightIcon className="w-4 h-4" />
                        </button>
                    </div>
                    {/* Day names */}
                    <div className="grid grid-cols-7 mb-2">
                        {DAYS.map((d) => (
                            <span key={d} className="py-1 text-xs text-center font-aumovio-bold text-grey-400">
                                {d}
                            </span>
                        ))}
                    </div>
                    {/* Days */}
                    <div className="grid grid-cols-7 gap-0.5">
                        {days.map((day, i) => {
                            const outside = !isSameMonth(day, viewDate);
                            const selected = value && isSameDay(day, value);
                            const today = isToday(day);
                            const dis = isDisabled(day);
                            return (
                                <button
                                    key={i}
                                    onClick={() => {
                                        if (!dis) {
                                            onChange?.(day);
                                            setOpen(false);
                                        }
                                    }}
                                    disabled={dis}
                                    className={`h-8 w-8 mx-auto rounded-lg text-xs transition-all duration-150
                    ${selected ? "bg-orange-400 text-white font-aumovio-bold shadow-md" : ""}
                    ${today && !selected ? "ring-2 ring-orange-400 text-orange-400 font-aumovio-bold" : ""}
                    ${outside ? "text-grey-300 dark:text-grey-600" : "text-black/80 dark:text-white/80"}
                    ${dis ? "opacity-30 cursor-not-allowed" : "hover:bg-orange-50 dark:hover:bg-orange-400/10 hover:text-orange-400"}`}
                                >
                                    {format(day, "d")}
                                </button>
                            );
                        })}
                    </div>
                    {/* Today shortcut */}
                    <div className="pt-3 mt-3 border-t border-grey-100 dark:border-grey-700">
                        <button
                            onClick={() => {
                                onChange?.(new Date());
                                setOpen(false);
                            }}
                            className="text-xs text-orange-400 hover:underline font-aumovio-bold"
                        >
                            Today
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Datepicker;
