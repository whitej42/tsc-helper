import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { FaTrain } from 'react-icons/fa';

function NotFound() {
    return (
        <>
            <Helmet>
                <title>404 — Page Not Found | TSCTools</title>
                <meta name="robots" content="noindex" />
            </Helmet>
            <div className="flex flex-col items-center justify-center flex-1 px-6 py-24 text-center">
                <FaTrain className="text-5xl text-gray-300 dark:text-gray-600 mb-6" />
                <p className="font-rail font-bold tracking-widest uppercase text-xs text-rail-red mb-3">
                    404
                </p>
                <h1 className="font-rail font-bold text-3xl sm:text-4xl tracking-tight text-rail-navy dark:text-white mb-3">
                    Wrong Platform
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-base max-w-sm mb-8">
                    This page doesn't exist. Maybe it was cancelled, diverted, or never ran in the first place.
                </p>
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 font-rail font-bold tracking-rail uppercase text-sm text-rail-amber border border-rail-amber rounded-rail px-4 py-2 hover:bg-rail-amber hover:text-rail-navy transition-colors"
                >
                    Back to the concourse
                </Link>
            </div>
        </>
    );
}

export default NotFound;
