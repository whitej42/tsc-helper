import { Helmet } from 'react-helmet-async';
import { useState, useMemo, useEffect } from "react";
import { FaSearch, FaStar, FaTag } from "react-icons/fa";
import { useLocos } from "../hooks/useLocos";
import LocoCard from "../components/features/Destinations/LocoCard";
import LocoDetailPanel from "../components/features/Destinations/LocoDetailPanel";

const FAVS_KEY = 'favouriteLocos';

function loadFavourites() {
    try {
        return JSON.parse(localStorage.getItem(FAVS_KEY)) || [];
    } catch {
        return [];
    }
}

function Destinations() {
    const { locos, loading, error } = useLocos();
    const [search, setSearch]         = useState('');
    const [selectedLoco, setSelected] = useState(null);
    const [pinnedLoco, setPinned]     = useState(null);
    const [favourites, setFavourites] = useState(loadFavourites);
    const [showFavsOnly, setShowFavsOnly]   = useState(false);
    const [showOperators, setShowOperators] = useState(true);

    // Persist favourites
    useEffect(() => {
        localStorage.setItem(FAVS_KEY, JSON.stringify(favourites));
    }, [favourites]);

    const toggleFavourite = (key) => {
        setFavourites(prev =>
            prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
        );
    };

    // Filter only — preserve original data order so starring doesn't reshuffle the grid
    const filtered = useMemo(() => {
        const q = search.toLowerCase().trim();
        let list = locos;
        if (q) list = list.filter(l => l.name.toLowerCase().includes(q));
        if (showFavsOnly) list = list.filter(l => favourites.includes(l.key));
        return list;
    }, [locos, search, favourites, showFavsOnly]);

    const handleSelect = (loco) => {
        if (pinnedLoco?.key === loco.key) return; // already shown as pinned
        setSelected(prev => prev?.key === loco.key ? null : loco);
    };

    const handleClose    = () => setSelected(null);
    const handleClosePin = () => { setPinned(null); setSelected(null); };
    const handlePin      = () => { setPinned(selectedLoco); setSelected(null); };
    const handleUnpin    = () => { setPinned(null); setSelected(null); };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-40 gap-3">
            <div className="w-8 h-8 border-2 border-rail-navy dark:border-rail-amber border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-bold tracking-rail uppercase text-gray-400 dark:text-gray-500">
                Loading…
            </span>
        </div>
    );

    if (error) return (
        <div className="flex items-center justify-center py-40 text-red-500">
            Failed to load data: {error}
        </div>
    );

    return (
        <div className="w-full max-w-7xl mx-auto px-6 py-10">
            <Helmet>
                <title>Destination Codes | TSCHelper</title>
                <meta name="description" content="Browse destination board codes for all Train Simulator Classic locomotive classes. Filter by class, save favourites, and look up codes fast." />
                <link rel="canonical" href="https://tscscenario.co.uk/destinations" />
            </Helmet>
            {/* ── Page heading ─────────────────────────────────────── */}
            <div className="mb-10">
                <h1 className="font-rail font-bold text-3xl sm:text-4xl tracking-tight text-rail-navy dark:text-white border-b-4 border-rail-red pb-2 inline-block">
                    Destination Codes
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-base mt-3">
                    Select a class to view its destination board codes.
                </p>
            </div>

            {/* ── Search + filter bar ──────────────────────────────── */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <div className="relative flex-1">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm" />
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search locomotive class…"
                        className="w-full pl-9 pr-4 py-3 rounded-card border border-gray-200 dark:border-surface-dark-border bg-white dark:bg-surface-dark-card text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-base focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 transition-colors"
                    />
                </div>

                <button
                    onClick={() => setShowFavsOnly(p => !p)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-card border text-sm font-bold tracking-rail uppercase transition-colors ${
                        showFavsOnly
                            ? 'bg-rail-amber border-rail-amber text-rail-navy-900'
                            : 'border-gray-200 dark:border-surface-dark-border bg-white dark:bg-surface-dark-card text-gray-500 dark:text-gray-400 hover:border-rail-amber hover:text-rail-amber'
                    }`}
                >
                    <FaStar className={showFavsOnly ? 'text-rail-navy-900' : 'text-gray-400'} />
                    Favourites
                    {favourites.length > 0 && (
                        <span className={`ml-1 text-xs rounded-full px-1.5 py-0.5 font-bold ${
                            showFavsOnly ? 'bg-rail-navy-900 text-white' : 'bg-gray-100 dark:bg-surface-dark-alt text-gray-500 dark:text-gray-400'
                        }`}>
                            {favourites.length}
                        </span>
                    )}
                </button>

                <button
                    onClick={() => setShowOperators(p => !p)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-card border text-sm font-bold tracking-rail uppercase transition-colors ${
                        showOperators
                            ? 'border-gray-200 dark:border-surface-dark-border bg-white dark:bg-surface-dark-card text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500'
                            : 'border-gray-400 dark:border-gray-500 bg-gray-100 dark:bg-surface-dark-alt text-gray-700 dark:text-gray-300'
                    }`}
                >
                    <FaTag />
                    {showOperators ? 'Hide Operators' : 'Show Operators'}
                </button>
            </div>

            {/* ── Results count ────────────────────────────────────── */}
            <p className="text-xs text-gray-400 dark:text-gray-500 tracking-rail uppercase mb-4">
                {filtered.length} class{filtered.length !== 1 ? 'es' : ''} found
            </p>

            {/* ── Card grid ────────────────────────────────────────── */}
            {filtered.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                    {filtered.map(loco => (
                        <LocoCard
                            key={loco.key}
                            loco={loco}
                            isFavourite={favourites.includes(loco.key)}
                            onToggleFavourite={toggleFavourite}
                            onSelect={handleSelect}
                            isSelected={selectedLoco?.key === loco.key || pinnedLoco?.key === loco.key}
                            showOperators={showOperators}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <p className="font-rail font-bold text-lg text-gray-300 dark:text-gray-600 tracking-rail uppercase">
                        No results
                    </p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                        Try a different search term
                    </p>
                </div>
            )}

            {/* ── Detail panels ────────────────────────────────────── */}
            {pinnedLoco && (
                <LocoDetailPanel
                    loco={pinnedLoco}
                    isFavourite={favourites.includes(pinnedLoco.key)}
                    onToggleFavourite={toggleFavourite}
                    onClose={handleClosePin}
                    isPinned={true}
                    onUnpin={handleUnpin}
                    offsetPanel={false}
                    showOverlay={!selectedLoco}
                />
            )}
            {selectedLoco && (
                <LocoDetailPanel
                    loco={selectedLoco}
                    isFavourite={favourites.includes(selectedLoco.key)}
                    onToggleFavourite={toggleFavourite}
                    onClose={handleClose}
                    isPinned={false}
                    onPin={handlePin}
                    offsetPanel={!!pinnedLoco}
                    showOverlay={true}
                />
            )}
        </div>
    );
}

export default Destinations;
