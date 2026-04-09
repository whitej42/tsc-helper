import { Helmet } from 'react-helmet-async';
import RouteMap from '../components/features/RouteMap/RouteMap';

function Lines() {
    return (
        <div className="h-[calc(100vh-3.5rem)] flex flex-col">
            <Helmet>
                <title>Routes | TSCTools</title>
                <meta name="description" content="Browse UK rail route and line information to help build more believable Train Simulator Classic scenarios." />
                <link rel="canonical" href="https://tsctools.co.uk/lines" />
            </Helmet>

            {/* Page header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-surface-dark-border flex-shrink-0 flex items-baseline gap-4">
                <h1 className="font-rail font-bold text-2xl tracking-tight text-rail-navy dark:text-white border-b-4 border-rail-red pb-1 shrink-0">
                    Routes
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                    | Explore UK routes available in Train Simulator Classic. Click a route on the map to view more details about it, including which DLC packs it's included in.
                </p>
            </div>

            {/* Map + sidebar fills remaining height */}
            <div className="flex-1 min-h-0 h-full">
                <RouteMap />
            </div>
        </div>
    );
}

export default Lines;
