import { Helmet } from 'react-helmet-async';
import { FaCheckCircle, FaClock, FaExternalLinkAlt } from "react-icons/fa";

const features = [
    {
        title: "Destination Boards",
        desc: "Look up destination board codes by locomotive class. No more cross-referencing spreadsheets, forum posts, or that one wiki page that hasn't been updated since 2014.",
        future: false,
    },
    {
        title: "Headcode Generator",
        desc: "Generate authentic UK rail headcodes for your services. Gets the format right so you don't have to think about it.",
        future: false,
    },
    {
        title: "Live Status Board",
        desc: "Real-time TfL and National Rail service status. Technically useful for scenario inspiration. Mostly just fun to have.",
        future: false,
    },
    {
        title: "Routes",
        desc: "Browse route and line information to help build more believable services.",
        future: true,
    },
    {
        title: "Guides",
        desc: "Tips, notes, and the occasional rabbit hole for scenario builders.",
        future: true,
    },
];

const upcoming = [
    "Expanded destination code coverage across more locomotive classes and eras",
    "Saved / favourited headcodes so you don't have to regenerate the same ones every session",
    "A proper scenario checklist — stock, headcodes, destinations, consists, all in one place",
    "More route detail, including historical timetable data for period-accurate scenarios",
    "Maybe a consist builder. We'll see.",
];

function SectionHeading({ children }) {
    return (
        <h2 className="font-rail font-bold text-2xl sm:text-3xl tracking-tight text-gray-900 dark:text-white mb-4">
            {children}
        </h2>
    );
}

function Section({ children, className = "" }) {
    return (
        <section className={`mb-12 ${className}`}>
            {children}
        </section>
    );
}

function About() {
    return (
        <div className="w-full max-w-3xl mx-auto px-6 py-10">
            <Helmet>
                <title>About | TSCTools</title>
                <meta name="description" content="TSCTools is a free tool for Train Simulator Classic scenario builders. Built by James — a train nerd who got fed up hunting for destination board codes." />
                <link rel="canonical" href="https://tsctools.co.uk/about" />
            </Helmet>

            {/* Hero */}
            <div className="mb-12">
                <div className="flex items-center gap-3 mb-4">
                    <h1 className="font-rail font-bold text-3xl sm:text-4xl tracking-tight text-rail-navy dark:text-white border-b-4 border-rail-red pb-2 inline-block">
                        About TSCTools
                    </h1>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-base">
                    A side project for Train Simulator Classic scenario builders.
                </p>
                <p className="text-base">
                    <a
                        href="https://steamcommunity.com/profiles/76561198061381738/myworkshopfiles/?appid=24010"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-rail-amber hover:text-rail-amber-light underline underline-offset-2 decoration-rail-amber/50 hover:decoration-rail-amber transition-colors font-semibold"
                    >
                        Check out my Steam Workshop for TSC scenarios
                        <FaExternalLinkAlt className="text-xs shrink-0" />
                    </a>
                </p>
            </div>

            {/* What is this */}
            <Section>
                <SectionHeading>What is this place?</SectionHeading>
                <div className="space-y-4 text-gray-700 dark:text-gray-300 text-base leading-relaxed">
                    <p>
                        TSCTools is a side project built to make Train Simulator Classic scenario
                        building a little less painful. In one place you'll find destination board
                        codes, a headcode generator, route and line information, and a live TfL and
                        National Rail status board. Everything you'd otherwise spend forty minutes
                        hunting across six different forum threads and a PDF from 2009.
                    </p>
                    <p>
                        It's free and it's a bit rough around the edges. I'm not a web designer as
                        you can probably tell. Manage your expectations accordingly.
                    </p>
                </div>
            </Section>

            {/* Features */}
            <Section>
                <SectionHeading>Features</SectionHeading>
                <ul className="space-y-3">
                    {features.map(f => (
                        <li key={f.title} className="flex items-start gap-3">
                            <span className="mt-1 shrink-0">
                                {f.future
                                    ? <FaClock className="text-gray-400 dark:text-gray-500" />
                                    : <FaCheckCircle className="text-green-500" />
                                }
                            </span>
                            <span className="text-gray-700 dark:text-gray-300 text-base">
                                <span className="font-bold text-gray-900 dark:text-white">{f.title}</span>
                                {f.future && (
                                    <span className="ml-2 text-xs font-bold tracking-rail uppercase px-1.5 py-0.5 rounded-rail bg-gray-200 dark:bg-surface-dark-alt text-gray-500 dark:text-gray-400">
                                        Coming soon
                                    </span>
                                )}
                                {" — "}{f.desc}
                            </span>
                        </li>
                    ))}
                </ul>
            </Section>

            {/* Who built this */}
            <Section>
                <SectionHeading>Who built this?</SectionHeading>
                <div className="space-y-4 text-gray-700 dark:text-gray-300 text-base leading-relaxed">
                    <p>
                        Hi, I'm James. By day I work in Formula 1, which is about as far from a
                        quiet Sunday morning service to Ramsgate as you can get. By night (and
                        weekends, and holidays, and any other time I can find) I'm a train nerd
                        who builds Train Simulator Classic scenarios for fun.
                    </p>
                    <p>
                        I got fed up of the same routine every time I started a new scenario. I'd
                        open a browser, search for destination board codes, dig out the route manuals,
                        find three conflicting sources, give up, make something up, feel quietly
                        guilty about it for the rest of the session. Multiply that by however
                        many services a scenario needs and it gets old fast. I'm maybe a little
                        OCD about getting the destination board codes right. Okay, very OCD.
                    </p>
                    <p>
                        I also wanted to actually learn some proper frontend development. 
                        Combining the two seemed like a reasonable excuse to build something, and here we are.
                    </p>
                </div>
            </Section>

            {/* UK-centricity */}
            <Section>
                <SectionHeading>A note on UK-centricity</SectionHeading>
                <div className="space-y-4 text-gray-700 dark:text-gray-300 text-base leading-relaxed">
                    <p>
                        Yes, this site is entirely focused on UK rail. The destination board codes, the
                        headcodes, the routes, the live status — all of it is very much a British
                        problem for British trains. I could apologise for this, but it is a .co.uk
                        site, so really you were warned at the URL.
                    </p>
                    <p>
                        If you're building scenarios for German ICEs or American freight runs, this
                        probably isn't your tool. Sorry about that. Bit British of me. Maybe in the
                        future ;)
                    </p>
                </div>
            </Section>

            {/* Coming soon */}
            <Section>
                <SectionHeading>What's coming (when I find the time)</SectionHeading>
                <p className="text-gray-500 dark:text-gray-400 text-base mb-4">
                    No promises, no roadmap, no board. Just a list of things I'd like to build
                    eventually, health, motivation, and the demands of motorsport permitting:
                </p>
                <ul className="space-y-2">
                    {upcoming.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-gray-700 dark:text-gray-300 text-base">
                            <FaClock className="mt-1 shrink-0 text-rail-amber" />
                            {item}
                        </li>
                    ))}
                </ul>
            </Section>

            {/* Anything else */}
            <Section>
                <SectionHeading>Anything else?</SectionHeading>
                <div className="space-y-4 text-gray-700 dark:text-gray-300 text-base leading-relaxed">
                    <p>
                        If something's wrong, missing, or broken genuinely do let me know. This is
                        a one person show built in stolen hours, so bugs happen and coverage has
                        gaps. I'd rather fix it than have you quietly suffer through incorrect
                        destination board codes.
                    </p>
                    <p>
                        And if you're building something brilliant in TSC, I'd love to hear about it.
                    </p>
                </div>
            </Section>

        </div>
    );
}

export default About;
