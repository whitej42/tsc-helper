import { Helmet } from 'react-helmet-async';
import { FaBook } from "react-icons/fa";

function Guides() {
    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-8">
            <Helmet>
                <title>Guides | TSCTools</title>
                <meta name="description" content="Tips, notes, and guides for Train Simulator Classic scenario builders." />
                <link rel="canonical" href="https://tsctools.co.uk/guides" />
            </Helmet>
            <div className="mb-8">
                <h1 className="font-rail font-bold text-3xl sm:text-4xl tracking-tight text-rail-navy dark:text-white border-b-4 border-rail-red pb-2 inline-block">
                    Guides
                </h1>
            </div>
            <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-gray-200 dark:border-surface-dark-border rounded-card">
                <FaBook className="text-4xl text-gray-300 dark:text-gray-600 mb-4" />
                <p className="font-rail font-bold tracking-rail uppercase text-sm text-gray-400 dark:text-gray-500">
                    Under Construction
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 max-w-xs">
                    Scenario building guides are coming soon.
                </p>
            </div>
        </div>
    );
}

export default Guides;
