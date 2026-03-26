import { useState, useEffect } from "react";
import { FaArrowCircleRight, FaSave, FaRedo, FaCopy, FaEraser, FaTimes, FaInfoCircle, FaDice, FaCheckCircle, FaRegCircle } from "react-icons/fa";

const CLASS_OPTIONS = [
    { label: "1 — Express Passenger",                                              value: "1" },
    { label: "2 — Stopping Passenger",                                             value: "2" },
    { label: "3 — Express Parcels",                                                value: "3" },
    { label: "4 — Fast Freight",                                                   value: "4" },
    { label: "5 — Empty Stock",                                                    value: "5" },
    { label: "6 — Freight up to 60 mph",                                           value: "6" },
    { label: "7 — Freight up to 45 mph",                                           value: "7" },
    { label: "8 — Freight up to 35 mph",                                           value: "8" },
    { label: "9 — Special / Channel Tunnel / Avanti",                              value: "9" },
];

const inputClass = "w-full rounded-card border border-gray-200 dark:border-surface-dark-border bg-white dark:bg-surface-dark px-3 py-2.5 text-sm text-rail-navy-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-rail-navy dark:focus:ring-rail-amber transition-colors disabled:opacity-40 disabled:cursor-not-allowed";
const labelClass = "block text-xs font-bold tracking-rail uppercase text-gray-500 dark:text-gray-400 mb-1.5";

function HeadcodeGenerator() {
    const [trainClass,    setTrainClass]    = useState("");
    const [trainLetter,   setTrainLetter]   = useState("");
    const [serviceNumber, setServiceNumber] = useState("");
    const [headcode,      setHeadcode]      = useState("");
    const [randomLetter,  setRandomLetter]  = useState(false);
    const [randomService, setRandomService] = useState(false);
    const [savedHeadcodes, setSavedHeadcodes] = useState([]);
    const [usedHeadcodes, setUsedHeadcodes] = useState(() => new Set(JSON.parse(localStorage.getItem("usedHeadcodes")) || []));
    const [customHeadcode, setCustomHeadcode] = useState("");
    const [warning, setWarning] = useState("");
    const [copied,  setCopied]  = useState("");

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("savedHeadcodes")) || [];
        setSavedHeadcodes(stored);
    }, []);

    useEffect(() => {
        localStorage.setItem("savedHeadcodes", JSON.stringify(savedHeadcodes));
    }, [savedHeadcodes]);

    const getRandomLetter = () => "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)];
    const getRandomService = () => String(Math.floor(Math.random() * 100)).padStart(2, '0');

    const generateHeadcode = () => {
        setWarning("");
        const letter  = randomLetter  ? getRandomLetter()  : trainLetter;
        const service = randomService ? getRandomService() : serviceNumber;
        if (trainClass && letter && service) {
            setHeadcode(`${trainClass}${letter}${service}`);
        } else {
            setWarning("Please fill in all fields to generate a headcode.");
        }
    };

    const clearFields = () => {
        setTrainClass(""); setTrainLetter(""); setServiceNumber("");
        setHeadcode(""); setRandomLetter(false); setRandomService(false); setWarning("");
    };

    const saveHeadcode = () => {
        if (!headcode)                       { setWarning("Please generate a headcode first."); return; }
        if (savedHeadcodes.includes(headcode)) { setWarning("This headcode is already saved."); return; }
        setSavedHeadcodes(prev => [...prev, headcode]);
        setWarning("");
    };

    const saveCustomHeadcode = () => {
        if (!customHeadcode)                            { setWarning("Please enter a headcode first."); return; }
        if (savedHeadcodes.includes(customHeadcode))    { setWarning("This headcode is already saved."); return; }
        setSavedHeadcodes(prev => [...prev, customHeadcode]);
        setCustomHeadcode("");
        setWarning("");
    };

    const removeHeadcode  = (hc) => {
        setSavedHeadcodes(prev => prev.filter(h => h !== hc));
        setUsedHeadcodes(prev => { const next = new Set(prev); next.delete(hc); localStorage.setItem("usedHeadcodes", JSON.stringify([...next])); return next; });
    };

    const toggleUsed = (hc) => setUsedHeadcodes(prev => {
        const next = new Set(prev);
        next.has(hc) ? next.delete(hc) : next.add(hc);
        localStorage.setItem("usedHeadcodes", JSON.stringify([...next]));
        return next;
    });
    const copyToClipboard = (hc) => {
        navigator.clipboard.writeText(hc)
            .then(() => { setCopied(hc); setTimeout(() => setCopied(""), 2000); })
            .catch(() => {});
    };
    const clearSaved = () => { setSavedHeadcodes([]); localStorage.removeItem("savedHeadcodes"); };

    const regenHint = (randomLetter && randomService)
        ? "Click Generate again for a new letter and service number."
        : randomLetter  ? "Click Generate again for a new random letter."
        : randomService ? "Click Generate again for a new random service number."
        : null;

    return (
        <div className="w-full max-w-6xl mx-auto px-4 py-8">

            {/* ── Page heading ─────────────────────────────────────── */}
            <div className="mb-8">
                <h1 className="font-rail font-bold text-3xl sm:text-4xl tracking-tight text-rail-navy dark:text-white border-b-4 border-rail-red pb-2 inline-block">
                    Headcode Generator
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                    Generate authentic UK National Rail four-character headcodes.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

                {/* ── Left panel: generator ────────────────────────── */}
                <div className="bg-white dark:bg-surface-dark-card rounded-card border border-gray-200 dark:border-surface-dark-border shadow-card overflow-hidden">
                    {/* Panel header stripe */}
                    <div className="h-1 bg-rail-navy dark:bg-rail-amber" />
                    <div className="px-6 py-5">
                        <h2 className="font-rail font-bold tracking-rail uppercase text-sm text-rail-navy dark:text-rail-amber mb-5">
                            Build a Headcode
                        </h2>

                        <form onSubmit={(e) => { e.preventDefault(); generateHeadcode(); }} className="space-y-5">

                            {/* Train class */}
                            <div>
                                <label className={labelClass}>Train Class</label>
                                <select
                                    value={trainClass}
                                    onChange={e => setTrainClass(e.target.value)}
                                    className={inputClass}
                                >
                                    <option value="" disabled>Select train class…</option>
                                    {CLASS_OPTIONS.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Train letter */}
                            <div>
                                <label className={labelClass}>Train Letter (A–Z)</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="text"
                                        maxLength="1"
                                        value={trainLetter}
                                        onChange={e => setTrainLetter(e.target.value.toUpperCase())}
                                        pattern="[A-Za-z]"
                                        disabled={randomLetter}
                                        placeholder={randomLetter ? "Random" : "e.g. A"}
                                        className={`${inputClass} flex-1`}
                                    />
                                    <label className="flex items-center gap-2 cursor-pointer shrink-0">
                                        <input
                                            type="checkbox"
                                            checked={randomLetter}
                                            onChange={() => { setRandomLetter(p => !p); setTrainLetter(""); }}
                                            className="w-4 h-4 accent-rail-navy dark:accent-rail-amber rounded"
                                        />
                                        <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                            <FaDice className="text-rail-amber" /> Random
                                        </span>
                                    </label>
                                </div>
                            </div>

                            {/* Service number */}
                            <div>
                                <label className={labelClass}>Service Number (00–99)</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="text"
                                        maxLength="2"
                                        value={serviceNumber}
                                        onChange={e => setServiceNumber(e.target.value)}
                                        pattern="[0-9]{2}"
                                        disabled={randomService}
                                        placeholder={randomService ? "Random" : "e.g. 42"}
                                        className={`${inputClass} flex-1`}
                                    />
                                    <label className="flex items-center gap-2 cursor-pointer shrink-0">
                                        <input
                                            type="checkbox"
                                            checked={randomService}
                                            onChange={() => { setRandomService(p => !p); setServiceNumber(""); }}
                                            className="w-4 h-4 accent-rail-navy dark:accent-rail-amber rounded"
                                        />
                                        <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                            <FaDice className="text-rail-amber" /> Random
                                        </span>
                                    </label>
                                </div>
                            </div>

                            {/* Warning */}
                            {warning && (
                                <div className="flex items-start gap-2 bg-rail-red/10 border border-rail-red/30 text-rail-red dark:bg-rail-red/20 dark:text-red-300 rounded-card px-3 py-2 text-sm">
                                    <FaInfoCircle className="mt-0.5 shrink-0" />
                                    <span>{warning}</span>
                                </div>
                            )}

                            {/* Action buttons */}
                            <div className="flex flex-wrap gap-2 pt-1">
                                <button
                                    type="submit"
                                    className="flex items-center gap-2 bg-rail-navy dark:bg-rail-amber text-white dark:text-rail-navy-900 font-bold tracking-rail uppercase text-xs rounded-rail px-4 py-2.5 hover:bg-rail-navy-700 dark:hover:bg-rail-amber-dark transition-colors shadow-rail"
                                >
                                    <FaArrowCircleRight /> Generate
                                </button>
                                <button
                                    type="button"
                                    onClick={saveHeadcode}
                                    className="flex items-center gap-2 bg-white dark:bg-surface-dark border border-gray-200 dark:border-surface-dark-border text-rail-navy dark:text-white font-bold tracking-rail uppercase text-xs rounded-rail px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-surface-dark-alt transition-colors"
                                >
                                    <FaSave /> Save
                                </button>
                                <button
                                    type="button"
                                    onClick={clearFields}
                                    className="flex items-center gap-2 bg-white dark:bg-surface-dark border border-gray-200 dark:border-surface-dark-border text-gray-500 dark:text-gray-400 font-bold tracking-rail uppercase text-xs rounded-rail px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-surface-dark-alt transition-colors"
                                >
                                    <FaRedo /> Reset
                                </button>
                            </div>
                        </form>

                        {/* ── Departure board display ──────────────── */}
                        {headcode && (
                            <div className="mt-6 bg-rail-navy-900 dark:bg-black/60 rounded-card border border-rail-navy-700 dark:border-surface-dark-border shadow-board px-6 py-6 text-center">
                                <p className="text-[10px] font-bold tracking-board uppercase text-white/30 mb-3">
                                    Generated Headcode
                                </p>
                                <div className="font-mono text-5xl sm:text-6xl font-bold tracking-board text-rail-amber">
                                    {headcode}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => copyToClipboard(headcode)}
                                    className={`mt-4 inline-flex items-center gap-2 text-xs font-bold tracking-rail uppercase rounded-rail px-3 py-1.5 transition-colors ${
                                        copied === headcode
                                            ? 'bg-green-500/20 text-green-400'
                                            : 'bg-white/10 text-white/50 hover:bg-white/20 hover:text-white'
                                    }`}
                                >
                                    <FaCopy className="text-[11px]" />
                                    {copied === headcode ? 'Copied!' : 'Copy'}
                                </button>
                                {regenHint && (
                                    <p className="text-xs text-white/40 mt-3 leading-snug">{regenHint}</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Right panel: saved headcodes ─────────────────── */}
                <div className="flex flex-col gap-4">

                    {/* Custom save */}
                    <div className="bg-white dark:bg-surface-dark-card rounded-card border border-gray-200 dark:border-surface-dark-border shadow-card overflow-hidden">
                        <div className="h-1 bg-rail-amber" />
                        <div className="px-6 py-5">
                            <h2 className="font-rail font-bold tracking-rail uppercase text-sm text-rail-navy dark:text-rail-amber mb-4">
                                Save Custom Headcode
                            </h2>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    maxLength="4"
                                    value={customHeadcode}
                                    onChange={e => setCustomHeadcode(e.target.value.toUpperCase())}
                                    placeholder="e.g. 1A42"
                                    className={`${inputClass} font-mono`}
                                />
                                <button
                                    onClick={saveCustomHeadcode}
                                    className="flex items-center gap-2 bg-rail-navy dark:bg-rail-amber text-white dark:text-rail-navy-900 font-bold tracking-rail uppercase text-xs rounded-rail px-4 py-2.5 hover:bg-rail-navy-700 dark:hover:bg-rail-amber-dark transition-colors shrink-0 shadow-rail"
                                >
                                    <FaSave /> Save
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Saved list */}
                    {savedHeadcodes.length > 0 && (
                        <div className="bg-white dark:bg-surface-dark-card rounded-card border border-gray-200 dark:border-surface-dark-border shadow-card overflow-hidden">
                            <div className="h-1 bg-rail-red" />
                            <div className="px-6 py-5">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="font-rail font-bold tracking-rail uppercase text-sm text-rail-navy dark:text-rail-amber">
                                        Saved Headcodes
                                        <span className="ml-2 text-xs font-bold bg-rail-navy dark:bg-rail-amber text-white dark:text-rail-navy-900 rounded-full px-2 py-0.5">
                                            {savedHeadcodes.length}
                                        </span>
                                    </h2>
                                    <button
                                        onClick={clearSaved}
                                        className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 hover:text-rail-red dark:hover:text-red-400 font-bold tracking-rail uppercase transition-colors"
                                    >
                                        <FaEraser /> Clear all
                                    </button>
                                </div>

                                {copied && (
                                    <div className="mb-3 text-xs font-bold text-green-600 dark:text-green-400 tracking-rail uppercase">
                                        Copied to clipboard!
                                    </div>
                                )}

                                <ul className="space-y-2">
                                    {savedHeadcodes.map((hc) => {
                                        const isUsed = usedHeadcodes.has(hc);
                                        return (
                                        <li key={hc} className={`flex items-center gap-3 rounded-card border px-3 py-2 transition-colors ${
                                            isUsed
                                                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700/50'
                                                : 'bg-gray-50 dark:bg-surface-dark border-gray-100 dark:border-surface-dark-border'
                                        }`}>
                                            {/* Used toggle */}
                                            <button
                                                onClick={() => toggleUsed(hc)}
                                                aria-label={isUsed ? "Mark as unused" : "Mark as used"}
                                                className={`shrink-0 text-xl transition-colors ${isUsed ? 'text-green-500' : 'text-gray-300 dark:text-gray-600 hover:text-green-400'}`}
                                            >
                                                {isUsed ? <FaCheckCircle /> : <FaRegCircle />}
                                            </button>
                                            {/* Headcode display */}
                                            <span className={`font-mono font-bold text-lg tracking-board flex-1 ${isUsed ? 'text-green-700 dark:text-green-400' : 'text-rail-navy-900 dark:text-white'}`}>
                                                {hc}
                                            </span>
                                            {/* Copy */}
                                            <button
                                                onClick={() => copyToClipboard(hc)}
                                                aria-label="Copy headcode"
                                                className={`flex items-center justify-center w-7 h-7 rounded-rail transition-colors text-sm ${
                                                    copied === hc
                                                        ? 'text-green-500 bg-green-50 dark:bg-green-900/20'
                                                        : 'text-gray-400 hover:text-rail-navy dark:hover:text-white hover:bg-gray-100 dark:hover:bg-surface-dark-alt'
                                                }`}
                                            >
                                                <FaCopy />
                                            </button>
                                            {/* Remove */}
                                            <button
                                                onClick={() => removeHeadcode(hc)}
                                                aria-label="Remove headcode"
                                                className="flex items-center justify-center w-7 h-7 rounded-rail text-gray-400 hover:text-rail-red dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-surface-dark-alt transition-colors text-sm"
                                            >
                                                <FaTimes />
                                            </button>
                                        </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default HeadcodeGenerator;
