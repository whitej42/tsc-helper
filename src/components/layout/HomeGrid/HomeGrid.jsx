import { Link } from 'react-router-dom';
import dest     from '../../../assets/images/dest-board.png';
import headcodes from '../../../assets/images/headcode.png';
import routes   from '../../../assets/images/routes.png';
import status   from '../../../assets/images/status.png';
import guides   from '../../../assets/images/guides.png';

const items = [
    { id: 1, title: 'Destination Codes',    to: '/destinations', imgSrc: dest,      accent: '#F5A623', sub: 'Look up destination board codes by locomotive class' },
    { id: 2, title: 'Headcode Generator',   to: '/headcodes',    imgSrc: headcodes,  accent: '#003087', sub: 'Generate and save authentic UK rail headcodes' },
    { id: 3, title: 'Routes',               to: '/lines',        imgSrc: routes,     accent: '#C00E14', sub: 'Browse route and line information' },
    { id: 4, title: 'Live Status Updates',  to: '/status',       imgSrc: status,     accent: '#0A7DC2', sub: 'Real-time TfL and National Rail service status' },
    { id: 5, title: 'Guides',               to: '/guides',       imgSrc: guides,     accent: '#6B7280', sub: 'Tips and guides for scenario building' },
];

function HomeGrid() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {items.map((item) => (
                <Link
                    key={item.id}
                    to={item.to}
                    className="group flex flex-col bg-white dark:bg-surface-dark-card rounded-card shadow-card hover:shadow-card-hover dark:shadow-dark-card dark:hover:shadow-dark-card-hover transition-all duration-200 hover:-translate-y-1 overflow-hidden border border-gray-200 dark:border-surface-dark-border"
                    style={{ borderLeftColor: item.accent, borderLeftWidth: '4px' }}
                >
                    {/* Image */}
                    <div className="overflow-hidden h-40 bg-gray-100 dark:bg-surface-dark-alt">
                        <img
                            src={item.imgSrc}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    </div>

                    {/* Text */}
                    <div className="px-4 py-3">
                        <h3
                            className="font-rail font-bold tracking-rail uppercase text-sm mb-1 text-rail-navy-900 dark:text-white"
                            style={{ color: undefined }}
                        >
                            {item.title}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-snug">
                            {item.sub}
                        </p>
                    </div>

                    {/* Accent bar on hover */}
                    <div
                        className="mt-auto h-1 w-0 group-hover:w-full transition-all duration-300"
                        style={{ backgroundColor: item.accent }}
                    />
                </Link>
            ))}
        </div>
    );
}

export default HomeGrid;
