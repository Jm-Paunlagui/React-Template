/**
 * pre-set-styles.jsx
 * ──────────────────
 * Centralised Tailwind class constants following the Aumovio brand guide.
 *
 * COLOR HIERARCHY
 * ───────────────
 * Primary   → orange-400  (#FF4208)   60 %
 * Secondary → purple-400  (#4827AF)   30 %
 * Accents   → blue / turquoise / yellow / grey  10 %
 * Validation → danger / warn / success
 *
 * All colour tokens map to the @theme tokens in index.css so they
 * are available as standard Tailwind utilities (e.g. bg-orange-400).
 */

import { faWarning } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// ============================================================================
// BACKGROUNDS
// ============================================================================
export const BASE_COLOR_BG =
    "bg-white bg-gradient-to-br from-white to-grey-100";
export const MAIN_FOREGROUND_COLOR_BG = "bg-orange-400";
export const MAIN_STRONG_COLOR_BG =
    "bg-orange-400 shadow-lg shadow-orange-400/25";
export const MAIN_OVERLAY_COLOR_BG = "bg-white/95 backdrop-blur-sm";
export const MAIN_PULSE_COLOR_BG = "bg-orange-400/15 animate-pulse";
export const GRADIENT_COLOR_BG =
    "bg-gradient-to-br from-[#ff850a] via-orange-400 to-purple-400";

// ============================================================================
// TEXT
// ============================================================================
export const TITLE_COLOR_TEXT = "text-black font-aumovio-bold tracking-tight";
export const SUBTITLE_COLOR_TEXT = "text-black/75 font-aumovio";
export const BASE_COLOR_TEXT = "text-black/85 font-normal leading-relaxed";
export const BASE_COLOR_TEXT_LIGHT =
    "text-white font-normal leading-relaxed drop-shadow-sm";
export const MAIN_COLOR_TEXT = "text-black/80 font-aumovio";
export const MAIN_FOREGROUND_COLOR_TEXT = "text-orange-400/90 font-aumovio";
export const MAIN_STRONG_COLOR_TEXT = "text-orange-400 drop-shadow-sm";
export const MAIN_OVERLAY_COLOR_TEXT = "text-white drop-shadow-md";
export const GRADIENT_COLOR_TEXT =
    "text-orange-400 font-aumovio-bold tracking-wide drop-shadow-sm";
export const SECONDARY_COLOR_TEXT = "text-white font-aumovio drop-shadow-sm";
export const ACCENT_COLOR_TEXT = "text-purple-400 font-aumovio-bold";
export const OPTIONS_COLOR_TEXT = "text-white font-aumovio";
export const WARNING_COLOR_TEXT = "text-danger-400 font-aumovio-bold";

// ============================================================================
// BACKGROUNDS (interactive)
// ============================================================================
export const MAIN_COLOR = "bg-orange-400 shadow-lg shadow-orange-400/20";
export const SECONDARY_COLOR = "bg-orange-400/8 border border-orange-400/20";
export const ACCENT_COLOR = "bg-purple-400/8 border border-purple-400/25";

// ============================================================================
// BORDERS
// ============================================================================
export const STANDARD_BORDER = "border border-grey-500/40 shadow-sm";
export const SECONDARY_COLOR_BORDER = "border border-purple-400/20 shadow-sm";
export const SECONDARY_BORDER = "border border-orange-400/25 shadow-sm";

// ============================================================================
// TRANSITIONS
// ============================================================================
export const DELAY_1 = "transition-all duration-300 ease-out delay-75";
export const DELAY_3 = "transition-all duration-500 ease-out delay-150";

// ============================================================================
// ICON PLACEMENT
// ============================================================================
export const ICON_PLACE_SELF_CENTER = "pr-2 place-self-center drop-shadow-sm";
export const ICON_PLACE_SELF_CENTER_1 = "place-self-center drop-shadow-sm";

// ============================================================================
// FORM FIELDS
// ============================================================================
export const TEXT_FIELD = `w-full p-2 font-aumovio-bold tracking-wider rounded-lg shadow-sm
  bg-white/95 backdrop-blur-sm
  focus:outline-none focus:ring-2 focus:ring-orange-400/40
  focus:border-orange-400/50 focus:shadow-md focus:shadow-orange-400/10
  transition-all duration-300`;

// ============================================================================
// DEFAULT BUTTON BASE
// ============================================================================
export const DEFAULT_BUTTON_TRANSITION = `border border-transparent rounded-lg
  hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98]
  hover:shadow-lg transition-all duration-300`;

// ============================================================================
// BUTTON VARIANTS
// ============================================================================

/** Primary orange button */
export const MAIN_BUTTON = `font-aumovio-bold tracking-wide
  text-orange-400 bg-orange-400/10 border border-orange-400/25
  hover:bg-orange-400 hover:text-white hover:border-transparent
  hover:shadow-xl hover:shadow-orange-400/30
  ${DEFAULT_BUTTON_TRANSITION}`;

/** Secondary purple button */
export const ACCENT_BUTTON = `font-aumovio-bold tracking-wide
  text-purple-400 bg-purple-400/10 border border-purple-400/20
  hover:bg-purple-400 hover:text-white hover:border-transparent
  hover:shadow-xl hover:shadow-purple-400/30
  ${DEFAULT_BUTTON_TRANSITION}`;

/** Danger / destructive button */
export const DANGER_BUTTON = `font-aumovio-bold tracking-wide
  text-danger-400 bg-danger-100 border border-danger-400/20
  hover:bg-danger-400 hover:text-white hover:border-transparent
  hover:shadow-xl hover:shadow-danger-400/30
  ${DEFAULT_BUTTON_TRANSITION}`;

/** Ghost / options button */
export const OPTIONS_BUTTON = `font-aumovio-bold tracking-wide
  text-black/80 bg-orange-400/8 border border-orange-400/20
  hover:bg-orange-400 hover:text-white hover:border-transparent
  hover:shadow-xl hover:shadow-orange-400/30
  ${DEFAULT_BUTTON_TRANSITION}`;

/** Warning button */
export const WARNING_BUTTON = `font-aumovio-bold tracking-wide
  text-warn-400 bg-warn-100/20 border border-warn-400/30
  hover:bg-warn-100/20 hover:text-black hover:border-transparent
  hover:shadow-xl hover:shadow-warn-400/30
  ${DEFAULT_BUTTON_TRANSITION}`;

export const DEFAULT_BUTTON = `font-aumovio-bold tracking-wide text-white drop-shadow-sm ${DEFAULT_BUTTON_TRANSITION}`;
export const CONTRAST = `font-aumovio-bold tracking-wide text-orange-400 drop-shadow-sm ${DEFAULT_BUTTON_TRANSITION}`;

// ============================================================================
// STATUS BADGES
// ============================================================================
export const STATUS_GREEN =
    "font-aumovio-bold tracking-wide text-success-400 bg-success-100/60 border border-success-400/30 rounded-lg shadow-sm";
export const STATUS_RED =
    "font-aumovio-bold tracking-wide text-danger-400  bg-danger-100      border border-danger-400/30  rounded-lg shadow-sm";
export const STATUS_WARNING =
    "font-aumovio-bold tracking-wide text-warn-400    bg-warn-100/20     border border-warn-400/30    rounded-lg shadow-sm";
export const STATUS_BLUE =
    "font-aumovio-bold tracking-wide text-blue-400    bg-blue-100/25     border border-blue-400/30    rounded-lg shadow-sm";
export const STATUS_PURPLE =
    "font-aumovio-bold tracking-wide text-purple-400  bg-purple-100/28   border border-purple-400/35  rounded-lg shadow-sm";
export const STATUS_CYAN =
    "font-aumovio-bold tracking-wide text-turquoise-400 bg-turquoise-100/22 border border-turquoise-400/25 rounded-lg shadow-sm";
export const STATUS_AMBER =
    "font-aumovio-bold tracking-wide text-yellow-400  bg-yellow-100      border border-yellow-400/30  rounded-lg shadow-sm";

// ============================================================================
// HEALTH INDICATOR DOTS
// ============================================================================
export const STATUS_INDICATOR_ACTIVE =
    "w-2.5 h-2.5 bg-success-400 rounded-full flex-shrink-0 shadow-sm ring-2 ring-success-400/30 animate-pulse";
export const STATUS_INDICATOR_INACTIVE =
    "w-2.5 h-2.5 bg-grey-500    rounded-full flex-shrink-0 shadow-sm";
export const STATUS_INDICATOR_WARNING =
    "w-2.5 h-2.5 bg-warn-100/20 rounded-full flex-shrink-0 shadow-sm ring-2 ring-warn-400/30";
export const STATUS_INDICATOR_ERROR =
    "w-2.5 h-2.5 bg-danger-400  rounded-full flex-shrink-0 shadow-sm ring-2 ring-danger-400/30 animate-pulse";

// ============================================================================
// STATUS TEXT / BG / BORDER MAPS  (keyed by colour name)
// ============================================================================
export const STATUS_TEXT_COLORS = {
    green: "text-success-400   font-aumovio-bold",
    red: "text-danger-400    font-aumovio-bold",
    warning: "text-warn-400      font-aumovio-bold",
    blue: "text-blue-400      font-aumovio-bold",
    purple: "text-purple-400    font-aumovio-bold",
    cyan: "text-turquoise-400 font-aumovio-bold",
    turquoise: "text-turquoise-400 font-aumovio-bold",
    amber: "text-yellow-400    font-aumovio-bold",
    grey: "text-grey-500      font-aumovio-bold",
    orange: "text-orange-400    font-aumovio-bold",
};

export const STATUS_BG_COLORS = {
    green: "bg-success-100/20   shadow-sm",
    red: "bg-danger-100/20    shadow-sm",
    warning: "bg-warn-100/20      shadow-sm",
    blue: "bg-blue-100/25      shadow-sm",
    purple: "bg-purple-100/28    shadow-sm",
    cyan: "bg-turquoise-100/22 shadow-sm",
    turquoise: "bg-turquoise-100    shadow-sm",
    amber: "bg-yellow-100       shadow-sm",
    grey: "bg-grey-100         shadow-sm",
    orange: "bg-orange-100/20    shadow-sm",
};

export const STATUS_BORDER_COLORS = {
    green: "border border-success-400/30",
    red: "border border-danger-400/30",
    warning: "border border-warn-400",
    blue: "border border-blue-400/30",
    purple: "border border-purple-400/35",
    cyan: "border border-turquoise-400/25",
    turquoise: "border border-turquoise-400/25",
    amber: "border border-yellow-400/30",
    grey: "border border-grey-500/30",
    orange: "border border-orange-400/30",
};

// ============================================================================
// SYSTEM HEALTH STATUS COLORS
// ============================================================================
export const HEALTH_STATUS_COLORS = {
    healthy: "text-success-400 drop-shadow-sm",
    warning: "text-warn-400    drop-shadow-sm",
    error: "text-danger-400  drop-shadow-sm",
    unknown: "text-grey-500    drop-shadow-sm",
};

// ============================================================================
// ALERT STYLES
// ============================================================================
export const ALERT_ERROR =
    "bg-danger-100  border border-danger-400/30  text-danger-400  px-6 py-2 rounded-lg shadow-lg backdrop-blur-sm";
export const ALERT_SUCCESS =
    "bg-success-100 border border-success-400/30 text-success-400 px-6 py-2 rounded-lg shadow-lg backdrop-blur-sm";
export const ALERT_WARNING =
    "bg-warn-100/20 border border-warn-400/30    text-warn-400    px-6 py-2 rounded-lg shadow-lg backdrop-blur-sm";
export const ALERT_INFO =
    "bg-purple-100/15 border border-purple-400/25 text-purple-400 px-6 py-2 rounded-lg shadow-lg backdrop-blur-sm";

// ============================================================================
// CARD STYLES
// ============================================================================
export const CARD_ERROR =
    "bg-danger-100  p-6 rounded-lg shadow-xl border border-danger-400/20  backdrop-blur-sm";
export const CARD_SUCCESS =
    "bg-success-100 p-6 rounded-lg shadow-xl border border-success-400/20 backdrop-blur-sm";
export const CARD_WARNING =
    "bg-warn-100/20 p-6 rounded-lg shadow-xl border border-warn-400/20    backdrop-blur-sm";
export const CARD_INFO =
    "bg-purple-100/15 p-6 rounded-lg shadow-xl border border-purple-400/20 backdrop-blur-sm";
export const CARD_PURPLE =
    "bg-purple-100/25  p-6 rounded-lg shadow-xl border border-purple-400/25 backdrop-blur-sm";

// ============================================================================
// FORM VALIDATION
// ============================================================================
export const INPUT_ERROR =
    "outline-danger-400 placeholder-danger-400/70 text-danger-400 bg-danger-100/20 border-danger-400/50";
export const ERROR_MESSAGE =
    "font-aumovio-bold text-danger-400  bg-danger-100  border border-danger-400/30  rounded-lg p-4 wrap-break-word shadow-sm";
export const SUCCESS_MESSAGE =
    "font-aumovio-bold text-success-400 bg-success-100 border border-success-400/30 rounded-lg shadow-sm";
export const WARNING_MESSAGE =
    "font-aumovio-bold text-warn-400    bg-warn-100/20 border border-warn-400/30    rounded-lg shadow-sm";
export const INFO_MESSAGE =
    "font-aumovio-bold text-purple-400  bg-purple-100/15 border border-purple-400/25 rounded-lg shadow-sm";

// ============================================================================
// RADIO / CHECKBOX
// ============================================================================
export const PRIMARY_RADIO = `bg-white border border-purple-400/30 shadow-sm cursor-pointer focus:outline-none
  hover:bg-purple-100/10 hover:shadow-md
  peer-checked:ring-2 peer-checked:ring-purple-400/50
  peer-checked:text-purple-400 peer-checked:bg-purple-100/15
  peer-checked:border-purple-400 peer-checked:shadow-lg
  ${DEFAULT_BUTTON_TRANSITION}`;

export const DANGER_RADIO = `bg-white border border-danger-400/30 rounded-lg shadow-sm cursor-pointer focus:outline-none
  hover:bg-danger-100/70 hover:shadow-md
  peer-checked:ring-2 peer-checked:ring-danger-400/50
  peer-checked:text-danger-400 peer-checked:bg-danger-100
  peer-checked:border-danger-400 peer-checked:shadow-lg
  ${DEFAULT_BUTTON_TRANSITION}`;

// ============================================================================
// UTILITY — Email not set
// ============================================================================
/**
 * Warning banner displayed when a secondary email has not been configured.
 * @param {string} [email_type=''] - Optional label, e.g. "Recovery".
 */
export function EMAIL_NOT_SET(email_type = "") {
    return (
        <div className="px-5 py-2 pl-4 flex flex-row justify-start rounded-lg cursor-default text-white bg-warn-100/20">
            <FontAwesomeIcon
                className={ICON_PLACE_SELF_CENTER}
                icon={faWarning}
            />
            {email_type} email not set up yet for this account.
        </div>
    );
}
