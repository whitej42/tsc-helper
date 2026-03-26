function Footer() {
    return (
        <footer className="relative bg-rail-navy-900 dark:bg-black/40">
            <div className="absolute top-0 inset-x-0 h-[3px] flex">
                <div className="flex-1" style={{ backgroundColor: '#DC241F' }} />
                <div className="flex-1" style={{ backgroundColor: '#0072CE' }} />
                <div className="flex-1" style={{ backgroundColor: '#A2AAAD' }} />
            </div>
            <div className="w-full px-4 sm:px-12 py-4 flex flex-col sm:flex-row items-center gap-2">
                <p className="flex-1 text-left font-rail font-bold tracking-rail uppercase text-xs text-white/40">
                    Train Simulator Classic · Scenario Helper
                </p>
                <p className="flex-1 text-center text-xs text-white/40">
                    All Rights Reserved © 2026
                </p>
                <p className="flex-1 text-right text-xs text-white/40 flex items-center justify-end gap-1">
                    Powered by Amazon Web Services
                </p>
            </div>
        </footer>
    );
}

export default Footer;
