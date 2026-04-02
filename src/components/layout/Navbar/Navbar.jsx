import { useState } from "react";
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaMoon, FaSun } from "react-icons/fa";
import { SiTransportforlondon, SiNationalrail } from "react-icons/si";
import { IoMdBoat } from "react-icons/io";
import SidebarStatus from "../../features/LineStatus/SidebarStatus";
import IconBar from "./IconBar";

const tube_api  = "https://api.tfl.gov.uk/Line/Mode/tube,overground,dlr,tram,elizabeth-line/Status";
const rail_api  = "https://api.tfl.gov.uk/Line/Mode/national-rail/Status";
const river_api = "https://api.tfl.gov.uk/Line/Mode/river-bus/Status";

const navLinks = [
    { to: '/',             label: 'Home' },
    { to: '/destinations', label: 'Destination Boards' },
    { to: '/headcodes',    label: 'Headcode Generator' },
    { to: '/routes',        label: 'Routes' },
    { to: '/guides',       label: 'Guides' },
    { to: '/about',        label: 'About' },
];

function Navbar({ isDark, toggleTheme }) {
    const [sidebar, setSidebar] = useState(false);
    const location = useLocation();

    const close = () => setSidebar(false);

    return (
        <>
            {/* ── Top bar ──────────────────────────────────────────── */}
            <header className="fixed top-0 inset-x-0 z-40 h-14 bg-rail-navy dark:bg-rail-navy-900 flex items-center px-4 shadow-rail">

                {/* NSE tri-colour stripe */}
                <div className="absolute bottom-0 inset-x-0 h-[3px] flex">
                    <div className="flex-1" style={{ backgroundColor: '#DC241F' }} />
                    <div className="flex-1" style={{ backgroundColor: '#0072CE' }} />
                    <div className="flex-1" style={{ backgroundColor: '#A2AAAD' }} />
                </div>

                {/* Menu toggle */}
                <button
                    onClick={() => setSidebar(true)}
                    aria-label="Open menu"
                    className="flex items-center justify-center w-9 h-9 text-white/70 hover:text-white hover:bg-white/10 rounded-rail transition-colors text-lg"
                >
                    <FaBars />
                </button>

                {/* Site title */}
                <Link
                    to="/"
                    className="flex-1 text-center font-rail font-bold tracking-rail text-white uppercase text-lg px-2 leading-none"
                >
                    <span className="hidden sm:inline">Train Simulator Classic · Scenario Tools</span>
                    <span className="sm:hidden">TSC · Scenario Tools</span>
                </Link>

                {/* Dark mode toggle */}
                <button
                    onClick={toggleTheme}
                    aria-label="Toggle theme"
                    className="flex items-center justify-center w-9 h-9 text-white/70 hover:text-rail-amber hover:bg-white/10 rounded-rail transition-colors text-lg"
                >
                    {isDark ? <FaSun /> : <FaMoon />}
                </button>
            </header>

            {/* ── Overlay ──────────────────────────────────────────── */}
            <div
                onClick={close}
                className={`fixed inset-0 z-40 bg-black/60 transition-opacity duration-300 ${
                    sidebar ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
            />

            {/* ── Sidebar ──────────────────────────────────────────── */}
            <nav
                className={`fixed top-0 left-0 h-full w-80 z-50 bg-rail-navy dark:bg-surface-dark-alt flex flex-col overflow-y-auto transform transition-transform duration-300 ease-in-out ${
                    sidebar ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Sidebar header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-rail-navy-700 dark:border-surface-dark-border shrink-0">
                    <div className="flex items-center gap-2 text-white">
                        <span className="font-rail font-bold tracking-rail uppercase text-sm">Navigation</span>
                    </div>
                    <button
                        onClick={close}
                        aria-label="Close menu"
                        className="flex items-center justify-center w-8 h-8 text-white/60 hover:text-white hover:bg-white/10 rounded-rail transition-colors"
                    >
                        <FaTimes />
                    </button>
                </div>

                {/* Nav links */}
                <ul className="py-3 px-3 border-b border-rail-navy-700 dark:border-surface-dark-border shrink-0">
                    {navLinks.map(({ to, label }) => {
                        const active = location.pathname === to;
                        return (
                            <li key={to}>
                                <Link
                                    to={to}
                                    onClick={close}
                                    className={`flex items-center px-3 py-2.5 rounded-rail font-rail font-semibold tracking-rail uppercase text-sm transition-colors ${
                                        active
                                            ? 'bg-rail-red text-white'
                                            : 'text-white/80 hover:bg-white/10 hover:text-white'
                                    }`}
                                >
                                    {label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>

                {/* Live status section */}
                <div className="flex-1 px-4 py-4 overflow-y-auto">
                    <Link
                        to="/status"
                        onClick={close}
                        className="inline-flex items-center justify-center w-full font-rail font-bold tracking-rail uppercase text-sm text-rail-amber border border-rail-amber rounded-rail px-3 py-1.5 hover:bg-rail-amber hover:text-rail-navy transition-colors mb-3"
                    >
                        Live Status Updates
                    </Link>
                    <SidebarStatus title="Tube"           api_url={tube_api}   icon={SiTransportforlondon} />
                    <SidebarStatus title="National Rail"  api_url={rail_api}   icon={SiNationalrail} />
                    <SidebarStatus title="TfL River Bus"  api_url={river_api}  icon={IoMdBoat} />
                </div>

                {/* Contact / social */}
                <div className="shrink-0 border-t border-rail-navy-700 dark:border-surface-dark-border">
                    <IconBar />
                </div>
            </nav>
        </>
    );
}

export default Navbar;
