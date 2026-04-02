import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const heroContext = require.context('../../../assets/images/hero', false, /\.jpg$/);
const heroImages = heroContext.keys().map(heroContext);

function HomeHero() {
    const [currentIdx, setCurrentIdx] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIdx(i => {
                let next;
                do { next = Math.floor(Math.random() * heroImages.length); } while (next === i);
                return next;
            });
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="relative bg-gray-900 dark:bg-gray-950 overflow-hidden">
            {heroImages.map((src, i) => (
                <img
                    key={i}
                    src={src}
                    alt=""
                    aria-hidden="true"
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${i === currentIdx ? 'opacity-30' : 'opacity-0'}`}
                />
            ))}
            <div className="relative max-w-4xl mx-auto px-6 py-16 sm:py-22 flex flex-col items-center text-center gap-5">
                <div className="flex items-center gap-2 text-rail-amber">
                    <span className="font-rail font-bold tracking-widest uppercase text-xs text-white/40">
                        Train Simulator Classic
                    </span>
                </div>
                <h1 className="font-rail font-bold text-white tracking-tight text-5xl sm:text-6xl leading-tight">
                    Scenario Tools
                </h1>
                <p className="text-white/50 text-lg max-w-lg leading-relaxed">
                    Destination boards, headcode generation, and live network status.
                    Everything you need to build authentic UK rail scenarios.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 mb-3">
                    <Link
                        to="/destinations"
                        className="inline-flex items-center justify-center font-rail font-bold tracking-rail uppercase text-sm text-rail-amber border border-rail-amber rounded-rail px-4 py-2 hover:bg-rail-amber hover:text-rail-navy transition-colors"
                    >
                        Destination Boards
                    </Link>
                    <Link
                        to="/headcodes"
                        className="inline-flex items-center justify-center font-rail font-bold tracking-rail uppercase text-sm text-white border border-white/30 rounded-rail px-4 py-2 hover:bg-white/10 transition-colors"
                    >
                        Headcode Generator
                    </Link>
                </div>
                <Link
                    to="/about"
                    className="text-xs text-white/30 hover:text-white/60 transition-colors font-rail tracking-rail uppercase"
                >
                    About this site
                </Link>
            </div>
        </section>
    );
}

export default HomeHero;
