import { FaInstagram, FaGithub, FaSteam } from "react-icons/fa";

function IconBar() {
    return (
        <div className="px-5 py-4">
            <p className="font-rail font-bold tracking-rail uppercase text-xs text-white/40 mb-3">Contact</p>
            <ul className="flex items-center gap-3">
                <li>
                    <a
                        href="https://www.instagram.com/smej_trains/"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Instagram"
                        className="flex items-center justify-center w-9 h-9 text-white/60 hover:text-white hover:bg-white/10 rounded-rail text-lg transition-colors"
                    >
                        <FaInstagram />
                    </a>
                </li>
                <li>
                    <a
                        href="https://github.com/whitej42/ts-dest-codes"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub"
                        className="flex items-center justify-center w-9 h-9 text-white/60 hover:text-white hover:bg-white/10 rounded-rail text-lg transition-colors"
                    >
                        <FaGithub />
                    </a>
                </li>
                <li>
                    <a
                        href="https://steamcommunity.com/profiles/76561198061381738/myworkshopfiles/?appid=24010"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Steam"
                        className="flex items-center justify-center w-9 h-9 text-white/60 hover:text-white hover:bg-white/10 rounded-rail text-lg transition-colors"
                    >
                        <FaSteam />
                    </a>
                </li>
            </ul>
        </div>
    );
}

export default IconBar;
