import { Helmet } from 'react-helmet-async';
import HomeGrid from "../components/layout/HomeGrid/HomeGrid";
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div className="flex flex-col">
            <Helmet>
                <title>TSCTools | Train Simulator Classic Scenario Tools</title>
                <meta name="description" content="Destination board codes, headcode generation, and live UK rail status. Everything you need to build authentic Train Simulator Classic scenarios." />
                <link rel="canonical" href="https://tsctools.co.uk/" />
            </Helmet>
            {/* ── Hero ─────────────────────────────────────────────── */}
            <section className="bg-gray-900 dark:bg-gray-950">
                <div className="max-w-4xl mx-auto px-6 py-16 sm:py-22 flex flex-col items-center text-center gap-5">
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

            {/* ── Feature grid ─────────────────────────────────────── */}
            <section className="flex-1 w-full mx-auto px-6 py-12">
                <p className="font-rail font-bold tracking-widest uppercase text-xs text-gray-400 dark:text-gray-500 mb-8 text-center">
                    Tools &amp; Features
                </p>
                <HomeGrid />
            </section>
        </div>
    );
}

export default Home;
