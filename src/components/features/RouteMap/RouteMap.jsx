import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Polyline, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import gemlData from '../../../data/routes/geml.json';
import bmlData from '../../../data/routes/bml.json';
import pdlData from '../../../data/routes/pdl.json';
import cmlData from '../../../data/routes/cml.json';
import wcmlSouthData from '../../../data/routes/wcml_south.json';
import wcmlTrentValleyData from '../../../data/routes/wcml_trent_valley.json';

const ALL_DATA = [gemlData, bmlData, pdlData, cmlData, wcmlSouthData, wcmlTrentValleyData];

// coordinates are [lng, lat] — Leaflet needs [lat, lng]
function toLatLng(station) {
    return [station.coordinates[1], station.coordinates[0]];
}

function buildRouteData(data) {
    const stationMap = new Map(data.stations.map(s => [s.id, s]));

    const mainLine = data.lines.find(l => !l.branchFrom);
    const branches = data.lines.filter(l => l.branchFrom);

    return {
        id: data.abbreviation.toLowerCase(),
        name: data.lineName,
        color: mainLine?.color ?? data.lines[0].color,
        mainLine: (mainLine?.stations ?? []).map(id => stationMap.get(id)),
        branches: branches.map(line => ({
            name: line.name,
            color: line.color,
            stations: line.stations.map(id => stationMap.get(id)),
            junction: stationMap.get(line.branchFrom) ?? null,
        })),
    };
}

function FitBounds({ allPositions }) {
    const map = useMap();
    const fitted = useRef(false);
    useEffect(() => {
        if (!fitted.current && allPositions.length > 0) {
            map.fitBounds(allPositions, { padding: [40, 40] });
            fitted.current = true;
        }
    }, [map, allPositions]);
    return null;
}

function FlyTo({ target }) {
    const map = useMap();
    useEffect(() => {
        if (target) map.flyTo(target, 14, { duration: 0.8 });
    }, [map, target]);
    return null;
}

function MapResizer({ openRoute }) {
    const map = useMap();
    useEffect(() => {
        const t = setTimeout(() => map.invalidateSize(), 50);
        return () => clearTimeout(t);
    }, [map, openRoute]);
    return null;
}

export default function RouteMap() {
    const [flyTarget, setFlyTarget] = useState(null);
    const [openRoute, setOpenRoute] = useState(null);

    const routes = ALL_DATA.map(buildRouteData);

    const allPositions = routes.flatMap(r => [
        ...r.mainLine.map(toLatLng),
        ...r.branches.flatMap(b => b.stations.map(toLatLng)),
    ]);
    const firstPos = allPositions[0] ?? [51.5, -0.1];

    return (
        <div className="flex h-full">
            {/* Map */}
            <div className="flex-1 min-w-0 min-h-0">
                <MapContainer
                    center={firstPos}
                    zoom={10}
                    scrollWheelZoom={true}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <FitBounds allPositions={allPositions} />
                    <MapResizer openRoute={openRoute} />
                    {flyTarget && <FlyTo target={flyTarget} />}

                    {routes.map(route => (
                        <Polyline
                            key={`${route.id}-main`}
                            positions={route.mainLine.map(toLatLng)}
                            pathOptions={{ color: route.color, weight: 4, opacity: 0.85 }}
                            eventHandlers={{
                                click(e) {
                                    e.target
                                        .bindPopup(
                                            `<div style="min-width:180px">
                                                <p style="font-weight:700;font-size:14px;margin:0 0 4px">${route.name}</p>
                                                <p style="font-size:11px;color:#888;margin:0">${route.mainLine.length} stations</p>
                                            </div>`
                                        )
                                        .openPopup(e.latlng);
                                },
                            }}
                        />
                    ))}

                    {routes.flatMap(route =>
                        route.branches.map(branch => (
                            <Polyline
                                key={`${route.id}-${branch.name}`}
                                positions={branch.junction
                                    ? [toLatLng(branch.junction), ...branch.stations.map(toLatLng)]
                                    : branch.stations.map(toLatLng)}
                                pathOptions={{ color: branch.color, weight: 4, opacity: 0.85 }}
                                eventHandlers={{
                                    click(e) {
                                        e.target
                                            .bindPopup(
                                                `<div style="min-width:180px">
                                                    <p style="font-weight:700;font-size:14px;margin:0 0 4px">${branch.name}</p>
                                                    <p style="font-size:12px;color:#555;margin:0 0 4px">Branch of ${route.name}</p>
                                                    ${branch.junction ? `<p style="font-size:11px;color:#888;margin:0">Junction: ${branch.junction.name}</p>` : ''}
                                                </div>`
                                            )
                                            .openPopup(e.latlng);
                                    },
                                }}
                            />
                        ))
                    )}

                    {routes.map(route =>
                        route.mainLine.map((station, i) => (
                            <CircleMarker
                                key={`${route.id}-main-${i}`}
                                center={toLatLng(station)}
                                radius={5}
                                pathOptions={{ color: route.color, fillColor: '#ffffff', fillOpacity: 1, weight: 2 }}
                            >
                                <Popup>
                                    <span style={{ fontWeight: 600, fontSize: 13 }}>{station.name}</span>
                                    <br />
                                    <span style={{ fontSize: 11, color: '#666' }}>{route.name}</span>
                                </Popup>
                            </CircleMarker>
                        ))
                    )}

                    {routes.flatMap(route =>
                        route.branches.flatMap(branch =>
                            branch.stations.map((station, i) => (
                                <CircleMarker
                                    key={`${route.id}-${branch.name}-${i}`}
                                    center={toLatLng(station)}
                                    radius={4}
                                    pathOptions={{ color: branch.color, fillColor: '#ffffff', fillOpacity: 1, weight: 2 }}
                                >
                                    <Popup>
                                        <span style={{ fontWeight: 600, fontSize: 13 }}>{station.name}</span>
                                        <br />
                                        <span style={{ fontSize: 11, color: '#666' }}>{branch.name}</span>
                                    </Popup>
                                </CircleMarker>
                            ))
                        )
                    )}
                </MapContainer>
            </div>

            {/* Sidebar */}
            <div className="w-72 flex-shrink-0 flex flex-col bg-white dark:bg-surface-dark border-l border-gray-200 dark:border-surface-dark-border overflow-y-auto">
                <div className="px-4 py-3 border-b border-gray-200 dark:border-surface-dark-border flex-shrink-0">
                    <p className="font-rail font-bold text-sm uppercase tracking-widest text-gray-500 dark:text-gray-400">
                        Routes
                    </p>
                </div>

                {routes.map(route => (
                    <div key={route.id} className="border-b border-gray-100 dark:border-surface-dark-border">
                        <button
                            onClick={() => setOpenRoute(openRoute === route.id ? null : route.id)}
                            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                        >
                            <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: route.color }} />
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm text-rail-navy dark:text-white truncate">{route.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {route.mainLine.length} stations
                                    {route.branches.length > 0 && ` · ${route.branches.length} branch${route.branches.length > 1 ? 'es' : ''}`}
                                </p>
                            </div>
                            <svg
                                className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${openRoute === route.id ? 'rotate-180' : ''}`}
                                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {openRoute === route.id && (
                            <div className="pb-2">
                                <ul>
                                    {route.mainLine.map((station, i) => (
                                        <li key={i}>
                                            <button
                                                onClick={() => setFlyTarget(toLatLng(station))}
                                                className="w-full flex items-center gap-3 px-4 py-1.5 text-left hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
                                            >
                                                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: route.color }} />
                                                <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-rail-navy dark:group-hover:text-white transition-colors">
                                                    {station.name}
                                                </span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>

                                {route.branches.map(branch => (
                                    <div key={branch.name} className="mt-1">
                                        <div className="flex items-center gap-2 px-4 py-1.5">
                                            <svg className="w-3 h-3 flex-shrink-0" style={{ color: route.color }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" d="M5 12h14M12 5l7 7-7 7" />
                                            </svg>
                                            <span className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 truncate">
                                                {branch.name}
                                            </span>
                                        </div>
                                        <ul>
                                            {branch.stations.map((station, i) => (
                                                <li key={i}>
                                                    <button
                                                        onClick={() => setFlyTarget(toLatLng(station))}
                                                        className="w-full flex items-center gap-3 pl-8 pr-4 py-1.5 text-left hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
                                                    >
                                                        <span className="w-1.5 h-1.5 rounded-sm flex-shrink-0 opacity-70" style={{ backgroundColor: route.color }} />
                                                        <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-rail-navy dark:group-hover:text-white transition-colors">
                                                            {station.name}
                                                        </span>
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
