import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar/Navbar';
import Footer from './components/layout/Footer/Footer';

import Home from './pages/Home';
import Destinations from './pages/Destinations';
import Lines from './pages/Routes';
import Headcodes from './pages/Headcodes';
import Status from './pages/Status';
import Guides from './pages/Guides';
import About from './pages/About';
import NotFound from './pages/NotFound';

function App() {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem('theme');
    return stored ? stored === 'dark' : true; // default: dark
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <Router>
      <div className="min-h-screen bg-platform-grey dark:bg-surface-dark text-rail-navy dark:text-mist-grey flex flex-col">
        <Navbar isDark={isDark} toggleTheme={() => setIsDark(d => !d)} />

        {/* Offset for fixed navbar */}
        <main className="flex-1 flex flex-col pt-20">
          {/* <div className="w-full max-w-4xl mx-auto px-4 py-3">
            <div className="bg-rail-red/10 border border-rail-red/30 text-rail-red dark:bg-rail-red/20 dark:border-rail-red/50 dark:text-red-300 rounded-card px-4 py-2 text-sm font-semibold text-center tracking-rail">
              This site is still under development — some features may not work as expected.
            </div>
          </div> */}

          <Routes>
            <Route path="/"             element={<Home />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/routes"        element={<Lines />} />
            <Route path="/headcodes"    element={<Headcodes />} />
            <Route path="/status"       element={<Status />} />
            <Route path="/guides"       element={<Guides />} />
            <Route path="/about"        element={<About />} />
            <Route path="*"             element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
