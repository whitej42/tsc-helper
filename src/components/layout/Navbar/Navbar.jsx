import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from 'react-router-dom';
import { FaMoon, FaSun, FaTrain } from "react-icons/fa";
import { SiTransportforlondon, SiNationalrail } from "react-icons/si";
import { IoMdBoat } from "react-icons/io";
import SidebarStatus from "../../features/LineStatus/SidebarStatus";
import logo from "../../../assets/images/tsctoolslogo.png";

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
    const [statusOpen, setStatusOpen] = useState(false);
    const location = useLocation();
    const statusRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (statusRef.current && !statusRef.current.contains(e.target)) {
                setStatusOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="fixed top-0 inset-x-0 z-40 h-20 bg-rail-navy dark:bg-rail-navy-900 flex items-center px-4 shadow-rail">

            {/* NSE tri-colour stripe */}
            <div className="absolute bottom-0 inset-x-0 h-[3px] flex">
                <div className="flex-1" style={{ backgroundColor: '#DC241F' }} />
                <div className="flex-1" style={{ backgroundColor: '#0072CE' }} />
                <div className="flex-1" style={{ backgroundColor: '#A2AAAD' }} />
            </div>

            {/* Logo → home */}
            <Link to="/" className="shrink-0 hover:opacity-80 transition-opacity" aria-label="Home">
                <img src={logo} alt="TSC Tools" className="h-12 w-auto" />
            </Link>

            {/* Nav links — centered */}
            <ul className="flex flex-1 justify-center leading-none tracking-rail text-white">
                {navLinks.map(({ to, label }) => {
                    const active = location.pathname === to;
                    return (
                        <li key={to}>
                            <Link
                                to={to}
                                className={`inline-block items-center text-center px-3 py-2.5 m-1 rounded-rail font-rail font-semibold tracking-rail uppercase text-sm ${
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

            {/* Right side controls */}
            <div className="flex items-center gap-1 shrink-0">

                {/* Status popover */}
                <div className="relative" ref={statusRef}>
                    <button
                        onClick={() => setStatusOpen(o => !o)}
                        aria-label="Live status"
                        className={`flex items-center justify-center w-11 h-11 rounded-rail transition-colors text-xl ${
                            statusOpen
                                ? 'bg-white/10 text-white'
                                : 'text-white/70 hover:bg-white/10 hover:text-white'
                        }`}
                    >
                        <FaTrain />
                    </button>

                    {statusOpen && (
                        <div className="absolute right-0 top-full mt-2 w-72 bg-rail-navy-600 border border-white/10 rounded-rail shadow-xl p-3 z-50">
                            <Link
                                to="/status"
                                onClick={() => setStatusOpen(false)}
                                className="inline-flex items-center justify-center w-full font-rail font-bold tracking-rail uppercase text-xs text-rail-amber border border-rail-amber rounded-rail px-3 py-1.5 hover:bg-rail-amber hover:text-rail-navy transition-colors mb-3"
                            >
                                Live Status Updates
                            </Link>
                            <SidebarStatus title="Tube"          api_url={tube_api}   icon={SiTransportforlondon} />
                            <SidebarStatus title="National Rail" api_url={rail_api}   icon={SiNationalrail} />
                            <SidebarStatus title="TfL River Bus" api_url={river_api}  icon={IoMdBoat} />
                        </div>
                    )}
                </div>

                {/* Dark mode toggle */}
                <button
                    onClick={toggleTheme}
                    aria-label="Toggle theme"
                    className="flex items-center justify-center w-11 h-11 text-white/70 hover:text-rail-amber hover:bg-white/10 rounded-rail transition-colors text-xl"
                >
                    {isDark ? <FaSun /> : <FaMoon />}
                </button>
            </div>
        </header>
    );
}

export default Navbar;
