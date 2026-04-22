/**
 * nav.config.jsx — Single source of truth for all navigation.
 *
 * To configure this for a new project:
 *   1. Update PUBLIC_LINKS with unauthenticated routes.
 *   2. Update AUTH_FLAT_LINKS with top-level authenticated routes (e.g. Dashboard).
 *   3. Update NAV_GROUPS per role with feature routes.
 *      • color        → sidebar group accent  (orange|purple|blue|success|danger|warn|grey)
 *      • icon         → JSX element           (shown in Sidebar; ignored by Navbar)
 *      • description  → subtitle string       (shown in Navbar dropdown; ignored by Sidebar)
 *
 * Both Navbar and Sidebar import from here — change once, both update.
 */

import { faHome, faQuestionCircle, faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BsCalendarCheck, BsQuestionCircleFill } from "react-icons/bs";
import { FaFileAlt, FaFileInvoiceDollar, FaMoneyBillAlt, FaUserAlt } from "react-icons/fa";
import { HiDocumentReport } from "react-icons/hi";
import { MdAutorenew, MdContactless, MdDataUsage, MdHistory, MdQrCode2, MdSpaceDashboard, MdThumbUp } from "react-icons/md";
import { RiCoupon3Fill } from "react-icons/ri";

// ── Unauthenticated flat links ────────────────────────────────────────────────
export const PUBLIC_LINKS = [
    { name: "Home", href: "/", icon: <FontAwesomeIcon icon={faHome} /> },
    { name: "Help", href: "/help", icon: <FontAwesomeIcon icon={faQuestionCircle} /> },
    { name: "Sign In", href: "/auth", icon: <FontAwesomeIcon icon={faSignInAlt} /> },
];

// ── Authenticated flat links (shown above groups in both layouts) ──────────────
export const AUTH_FLAT_LINKS = [{ name: "Dashboard", href: "/dashboard", icon: <MdSpaceDashboard size={16} /> }];

// ── Role-based nav groups ─────────────────────────────────────────────────────
// Add or remove roles here to match your backend's role strings.
export const NAV_GROUPS = {
    User: [
        {
            label: "Operations",
            color: "orange",
            items: [
                { name: "Consumption / QR", href: "/meal/consumption", icon: <MdDataUsage size={16} />, description: "Scan and record QR consumption" },
                { name: "Consumption 1", href: "/meal/consumption-1", icon: <MdDataUsage size={16} /> },
                { name: "Consumption 2", href: "/meal/consumption-2", icon: <MdDataUsage size={16} /> },
                { name: "QR Renewal", href: "/meal/qr-renewal", icon: <MdAutorenew size={16} />, description: "Renew expired QR stubs" },
            ],
        },
        {
            label: "Records",
            color: "danger",
            items: [{ name: "Prev Bal Request", href: "/meal/prev-bal-request", icon: <FaFileAlt size={16} />, description: "Submit previous balance requests" }],
        },
        {
            label: "Other",
            color: "grey",
            items: [{ name: "Help", href: "/help", icon: <BsQuestionCircleFill size={16} /> }],
        },
    ],

    Admin: [
        {
            label: "Operations",
            color: "orange",
            items: [
                { name: "Consumption / QR", href: "/meal/consumption", icon: <MdDataUsage size={16} />, description: "Scan and record QR consumption" },
                { name: "QR Renewal", href: "/meal/qr-renewal", icon: <MdAutorenew size={16} />, description: "Renew expired QR stubs" },
                { name: "QR Approval", href: "/meal/qr-approval", icon: <MdQrCode2 size={16} />, description: "Approve pending QR requests" },
            ],
        },
        {
            label: "Finance",
            color: "warn",
            items: [
                { name: "Subsidy", href: "/meal/subsidies", icon: <FaMoneyBillAlt size={16} />, description: "Manage meal subsidies" },
                { name: "Billing", href: "/meal/billing", icon: <FaFileInvoiceDollar size={16} />, description: "Invoice and billing records" },
            ],
        },
        {
            label: "Records",
            color: "danger",
            items: [
                { name: "Stub Issuance", href: "/meal/stub-issuance", icon: <RiCoupon3Fill size={16} />, description: "Issue meal stubs" },
                { name: "Stub Report", href: "/meal/stub-report", icon: <HiDocumentReport size={16} />, description: "Stub usage reports" },
                { name: "Prev Bal Request", href: "/meal/prev-bal-request", icon: <FaFileAlt size={16} /> },
                { name: "Prev Bal Approval", href: "/meal/prev-bal-approval", icon: <MdThumbUp size={16} />, description: "Approve previous balance requests" },
            ],
        },
        {
            label: "Management",
            color: "purple",
            items: [{ name: "Pay Period", href: "/meal/pay-period", icon: <BsCalendarCheck size={16} />, description: "Configure payroll pay periods" }],
        },
        {
            label: "Other",
            color: "grey",
            items: [{ name: "Help", href: "/help", icon: <BsQuestionCircleFill size={16} /> }],
        },
    ],

    SuperAdmin: [
        {
            label: "Operations",
            color: "orange",
            items: [
                { name: "Consumption / QR", href: "/meal/consumption", icon: <MdDataUsage size={16} />, description: "Scan and record QR consumption" },
                { name: "QR Renewal", href: "/meal/qr-renewal", icon: <MdAutorenew size={16} />, description: "Renew expired QR stubs" },
                { name: "QR Approval", href: "/meal/qr-approval", icon: <MdQrCode2 size={16} />, description: "Approve pending QR requests" },
            ],
        },
        {
            label: "Finance",
            color: "warn",
            items: [
                { name: "Subsidy", href: "/meal/subsidies", icon: <FaMoneyBillAlt size={16} />, description: "Manage meal subsidies" },
                { name: "Billing", href: "/meal/billing", icon: <FaFileInvoiceDollar size={16} />, description: "Invoice and billing records" },
            ],
        },
        {
            label: "Records",
            color: "danger",
            items: [
                { name: "Stub Issuance", href: "/meal/stub-issuance", icon: <RiCoupon3Fill size={16} />, description: "Issue meal stubs" },
                { name: "Stub Report", href: "/meal/stub-report", icon: <HiDocumentReport size={16} />, description: "Stub usage reports" },
                { name: "Prev Bal Request", href: "/meal/prev-bal-request", icon: <FaFileAlt size={16} /> },
                { name: "Prev Bal Approval", href: "/meal/prev-bal-approval", icon: <MdThumbUp size={16} />, description: "Approve previous balance requests" },
            ],
        },
        {
            label: "Management",
            color: "purple",
            items: [
                { name: "Pay Period", href: "/meal/pay-period", icon: <BsCalendarCheck size={16} />, description: "Configure payroll pay periods" },
                { name: "RFID Management", href: "/meal/rfid-management", icon: <MdContactless size={16} />, description: "Manage RFID cards and readers" },
                { name: "Logs Management", href: "/meal/logs-management", icon: <MdHistory size={16} />, description: "Audit and activity logs" },
                { name: "User Management", href: "/meal/user-management", icon: <FaUserAlt size={16} />, description: "Create and manage user accounts" },
            ],
        },
        {
            label: "Other",
            color: "grey",
            items: [{ name: "Help", href: "/help", icon: <BsQuestionCircleFill size={16} /> }],
        },
    ],
};
