import stationsData from '../../../data/stations.json';

// Build station lookup: CRS code → station object
export const stationLookup = new Map(stationsData.map(s => [s.crsCode, s]));

// All packs from every publisher, normalised to a flat array
const packFiles = require.context('../../../data/dlc_packs', false, /\.json$/);
const allPacks = packFiles.keys().flatMap(key => Object.values(packFiles(key)).flat());

// Build DLC pack lookup: route abbreviation → packs[] (deduplicated by id)
export const dlcByRoute = new Map();
for (const pack of allPacks) {
    for (const abbrev of (pack.routes ?? [])) {
        if (!dlcByRoute.has(abbrev)) dlcByRoute.set(abbrev, []);
        const existing = dlcByRoute.get(abbrev);
        if (!existing.find(p => p.id === pack.id)) existing.push(pack);
    }
}

// stations.json uses lat/long directly
export function toLatLng(station) {
    return [station.lat, station.long];
}

export function buildRouteData(data) {
    const resolveStations = (codes) =>
        codes.map(code => stationLookup.get(code)).filter(Boolean);

    const mainLine = data.lines.find(l => !l.branchFrom);
    const branches = data.lines.filter(l => l.branchFrom);

    return {
        id: data.abbreviation.toLowerCase(),
        name: data.lineName,
        abbreviation: data.abbreviation,
        color: mainLine?.color ?? data.lines[0].color,
        dlcPacks: dlcByRoute.get(data.abbreviation) ?? [],
        mainLine: resolveStations(mainLine?.stations ?? []),
        branches: branches.map(line => ({
            name: line.name,
            color: line.color,
            stations: resolveStations(line.stations),
            junction: stationLookup.get(line.branchFrom) ?? null,
        })),
    };
}

export function dlcPacksHtml(packs) {
    if (!packs.length) return '';
    return `
        <p style="font-size:11px;font-weight:600;color:#555;margin:6px 0 3px">DLC Pack${packs.length > 1 ? 's' : ''}:</p>
        ${packs.map(p => `<p style="font-size:11px;margin:0 0 2px"><a href="${p.store_url}" target="_blank" rel="noreferrer" style="color:#1d6fa4;text-decoration:none">${p.name}</a></p>`).join('')}
    `;
}
