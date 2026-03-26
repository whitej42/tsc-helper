import { Helmet } from 'react-helmet-async';
import RouteMap from '../components/features/RouteMap/RouteMap';

function Lines() {
    return (
        <div className="flex-1 flex flex-col min-h-0">
            <Helmet>
                <title>Routes | TSCTools</title>
                <meta name="description" content="Browse UK rail route and line information to help build more believable Train Simulator Classic scenarios." />
                <link rel="canonical" href="https://tsctools.co.uk/lines" />
            </Helmet>

            {/* Page header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-surface-dark-border flex-shrink-0">
                <h1 className="font-rail font-bold text-2xl tracking-tight text-rail-navy dark:text-white border-b-4 border-rail-red pb-1 inline-block">
                    Routes
                </h1>
            </div>

            {/* Map + sidebar fills remaining height */}
            <div className="flex-1 min-h-0 h-full">
                <RouteMap />
            </div>
        </div>
    );
}

export default Lines;
