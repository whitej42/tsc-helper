import { useState, useMemo, useEffect, Fragment } from "react";
import { FaTimes, FaStar, FaRegStar, FaBook } from "react-icons/fa";
import { getPublisher, getOperatorStyle } from "./LocoCard";

function LocoDetailPanel({ loco, isFavourite, onToggleFavourite, onClose }) {
    const pub = getPublisher(loco.publisher);

    // Unique operators, sorted alphabetically by display label
    const operators = useMemo(() => {
        const keys = [...new Set((loco.trainVariants ?? []).map(v => v.operatorKey))];
        return keys.sort((a, b) => {
            const la = getOperatorStyle(a).label;
            const lb = getOperatorStyle(b).label;
            return la.localeCompare(lb);
        });
    }, [loco]);

    const [activeOperator, setActiveOperator] = useState(operators[0]);

    // Reset active tab when a different loco is opened
    useEffect(() => {
        setActiveOperator(operators[0]);
    }, [loco.key]); // eslint-disable-line react-hooks/exhaustive-deps

    // Variants for the active operator tab
    const activeVariants = useMemo(() => {
        return (loco.trainVariants ?? []).filter(v => v.operatorKey === activeOperator);
    }, [loco, activeOperator]);

    const hasOtherSide = useMemo(() => {
        return activeVariants.some(v => (v.displays ?? []).some(d => d.additional));
    }, [activeVariants]);

    const totalDests = useMemo(() => {
        return (loco.trainVariants ?? []).reduce((acc, v) => acc + (v.displays ?? []).length, 0);
    }, [loco]);

    return (
        <>
            {/* Overlay */}
            <div
                onClick={onClose}
                className="fixed inset-0 z-30 bg-black/50 lg:hidden animate-fade-in"
            />

            {/* Panel */}
            <div className="fixed top-14 right-0 bottom-0 z-40 w-full sm:w-[500px] bg-white dark:bg-surface-dark-card border-l border-gray-200 dark:border-surface-dark-border flex flex-col shadow-2xl animate-slide-in-right">

                {/* Header */}
                <div
                    className="flex items-start justify-between px-5 py-4 border-b border-gray-200 dark:border-surface-dark-border shrink-0"
                    style={{ borderTopColor: pub.color, borderTopWidth: '4px' }}
                >
                    <div className="flex-1 min-w-0 mr-3">
                        <div className="flex flex-wrap items-center gap-1.5 mb-2">
                            <span
                                className="text-[10px] font-bold tracking-rail uppercase rounded-rail px-2 py-0.5 text-white"
                                style={{ backgroundColor: pub.color }}
                            >
                                {pub.label}
                            </span>
                        </div>
                        <h2 className="font-rail font-bold tracking-tight text-lg text-rail-navy-900 dark:text-white leading-snug">
                            {loco.name}
                        </h2>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 mt-1">
                        {loco.manual_url && (
                            <a
                                href={loco.manual_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Open manual"
                                className="flex items-center justify-center w-8 h-8 rounded-rail hover:bg-gray-100 dark:hover:bg-surface-dark-alt transition-colors text-base text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-white"
                            >
                                <FaBook />
                            </a>
                        )}
                        <button
                            onClick={() => onToggleFavourite(loco.name)}
                            aria-label={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
                            className="flex items-center justify-center w-8 h-8 rounded-rail hover:bg-gray-100 dark:hover:bg-surface-dark-alt transition-colors text-base"
                        >
                            {isFavourite
                                ? <FaStar className="text-rail-amber" />
                                : <FaRegStar className="text-gray-400 dark:text-gray-500" />
                            }
                        </button>
                        <button
                            onClick={onClose}
                            aria-label="Close panel"
                            className="flex items-center justify-center w-8 h-8 rounded-rail text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-surface-dark-alt hover:text-gray-700 dark:hover:text-white transition-colors"
                        >
                            <FaTimes />
                        </button>
                    </div>
                </div>

                {/* Operator tabs — only shown when there is more than one */}
                {operators.length > 1 && (
                    <div className="flex overflow-x-auto gap-1 px-5 py-3 border-b border-gray-200 dark:border-surface-dark-border shrink-0 scrollbar-none">
                        {operators.map(op => {
                            const style  = getOperatorStyle(op);
                            const active = op === activeOperator;
                            return (
                                <button
                                    key={op}
                                    onClick={() => setActiveOperator(op)}
                                    className={`shrink-0 px-3 py-1.5 text-xs font-bold tracking-rail uppercase rounded-rail transition-colors whitespace-nowrap ${
                                        active
                                            ? 'text-white'
                                            : 'bg-gray-100 dark:bg-surface-dark-alt text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-surface-dark-border'
                                    }`}
                                    style={active ? { backgroundColor: style.color } : {}}
                                >
                                    {style.label}
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Destination table */}
                <div className="flex-1 overflow-y-auto">
                    <table className="w-full text-sm">
                        <thead className="sticky top-0 bg-gray-50 dark:bg-surface-dark-alt border-b border-gray-200 dark:border-surface-dark-border">
                            <tr>
                                <th className="px-5 py-2.5 text-left font-bold tracking-rail uppercase text-xs text-rail-navy/50 dark:text-gray-400 w-24">
                                    Code
                                </th>
                                <th className="px-5 py-2.5 text-left font-bold tracking-rail uppercase text-xs text-rail-navy/50 dark:text-gray-400">
                                    {hasOtherSide ? "Secondman's Side" : "Destination"}
                                </th>
                                {hasOtherSide && (
                                    <th className="px-5 py-2.5 text-left font-bold tracking-rail uppercase text-xs text-rail-navy/50 dark:text-gray-400">
                                        Driver's Side
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {activeVariants.map((variant, vi) => {
                                const opStyle = getOperatorStyle(variant.operatorKey);
                                return (
                                <Fragment key={vi}>
                                    {/* Section header — shown when the variant has a class or livery */}
                                    {(variant.class || variant.livery) && (
                                        <tr>
                                            <td
                                                colSpan={hasOtherSide ? 3 : 2}
                                                className="px-5 py-2 bg-gray-100 dark:bg-surface-dark-border/60"
                                            >
                                                <div className="flex flex-wrap items-center gap-1.5">
                                                    {variant.class && (
                                                        <span
                                                            className="text-[11px] font-bold tracking-rail uppercase rounded-rail px-2 py-0.5 text-white"
                                                            style={{ backgroundColor: pub.color }}
                                                        >
                                                            Class {variant.class}
                                                        </span>
                                                    )}
                                                    {variant.livery && (
                                                        <span
                                                            className="text-[11px] font-bold tracking-rail uppercase rounded-rail px-2 py-0.5"
                                                            style={{ backgroundColor: opStyle.color, color: opStyle.textColor }}
                                                        >
                                                            {variant.livery}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )}

                                    {(variant.displays ?? []).map((d, di) => (
                                        <tr
                                            key={`${vi}-${di}`}
                                            className="border-b border-gray-100 dark:border-surface-dark-border/50 hover:bg-gray-50 dark:hover:bg-surface-dark-alt/50 transition-colors"
                                        >
                                            <td className="px-5 py-2.5">
                                                <span
                                                    className="inline-flex items-center justify-center w-8 h-6 font-mono font-bold text-xs rounded-rail"
                                                    style={{ backgroundColor: opStyle.color, color: opStyle.textColor }}
                                                >
                                                    {d.code}
                                                </span>
                                            </td>
                                            <td className="px-5 py-2.5 text-rail-navy-900 dark:text-gray-200">
                                                {d.main}
                                            </td>
                                            {hasOtherSide && (
                                                <td className="px-5 py-2.5 text-rail-navy-900 dark:text-gray-200">
                                                    {d.additional ?? ''}
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </Fragment>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="shrink-0 px-5 py-3 border-t border-gray-200 dark:border-surface-dark-border">
                    <p className="text-xs text-gray-400 dark:text-gray-500 tracking-rail">
                        {totalDests} destination{totalDests !== 1 ? 's' : ''}
                        {loco.publisher ? ` · ${loco.publisher}` : ''}
                    </p>
                </div>
            </div>
        </>
    );
}

export default LocoDetailPanel;
