import { FaInstagram, FaGithub, FaSteam } from "react-icons/fa";

function Footer() {
    return (
        <footer className="relative bg-rail-navy-900 dark:bg-black/40">
            <div className="absolute top-0 inset-x-0 h-[3px] flex">
                <div className="flex-1" style={{ backgroundColor: '#DC241F' }} />
                <div className="flex-1" style={{ backgroundColor: '#0072CE' }} />
                <div className="flex-1" style={{ backgroundColor: '#A2AAAD' }} />
            </div>
            <div className="w-full px-4 sm:px-12 py-4 flex flex-col sm:flex-row items-center gap-2">
                <p className="flex-1 text-left font-rail font-bold tracking-rail uppercase text-xs text-white/40">
                    Train Simulator Classic · Scenario Tools
                </p>
                <p className="flex-1 text-center text-xs text-white/40">
                    All Rights Reserved © 2026
                </p>
                <div className="flex-1 flex items-center justify-end gap-1">
                    <a
                        href="https://www.instagram.com/smej_trains/"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Instagram"
                        className="flex items-center justify-center w-10 h-10 text-white/40 hover:text-white hover:bg-white/10 rounded-rail text-xl transition-colors"
                    >
                        <FaInstagram />
                    </a>
                    <a
                        href="https://github.com/whitej42/ts-dest-codes"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub"
                        className="flex items-center justify-center w-10 h-10 text-white/40 hover:text-white hover:bg-white/10 rounded-rail text-xl transition-colors"
                    >
                        <FaGithub />
                    </a>
                    <a
                        href="https://steamcommunity.com/profiles/76561198061381738/myworkshopfiles/?appid=24010"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Steam"
                        className="flex items-center justify-center w-10 h-10 text-white/40 hover:text-white hover:bg-white/10 rounded-rail text-xl transition-colors"
                    >
                        <FaSteam />
                    </a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
