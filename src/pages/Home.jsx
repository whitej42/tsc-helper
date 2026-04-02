import { Helmet } from 'react-helmet-async';
import HomeGrid from "../components/layout/HomeGrid/HomeGrid";
import HomeHero from "../components/layout/HomeHero/HomeHero";

function Home() {
    return (
        <div className="flex flex-col">
            <Helmet>
                <title>TSCTools | Train Simulator Classic Scenario Tools</title>
                <meta name="description" content="Destination board codes, headcode generation, and live UK rail status. Everything you need to build authentic Train Simulator Classic scenarios." />
                <link rel="canonical" href="https://tsctools.co.uk/" />
            </Helmet>
            {/* ── Hero ─────────────────────────────────────────────── */}
            <HomeHero />

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
