import { Helmet } from 'react-helmet-async';
import LineStatusList from "../components/features/LineStatus/LineStatusList";
import { SiTransportforlondon, SiNationalrail } from "react-icons/si";
import { IoMdBoat } from "react-icons/io";

const tube_api  = "https://api.tfl.gov.uk/Line/Mode/tube,overground,dlr,tram,elizabeth-line/Status";
const rail_api  = "https://api.tfl.gov.uk/Line/Mode/national-rail/Status";
const river_api = "https://api.tfl.gov.uk/Line/Mode/river-bus/Status";

function Status() {
    return (
        <div className="w-full max-w-3xl mx-auto px-6 py-10">
            <Helmet>
                <title>Live Status | TSCTools</title>
                <meta name="description" content="Real-time TfL and National Rail service status. Tube, Overground, Elizabeth line, DLR, and National Rail — all in one place." />
                <link rel="canonical" href="https://tsctools.co.uk/status" />
            </Helmet>
            {/* Page heading */}
            <div className="mb-10">
                <h1 className="font-rail font-bold text-3xl sm:text-4xl tracking-tight text-rail-navy dark:text-white border-b-4 border-rail-red pb-2 inline-block">
                    Live Status
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-base mt-3">
                    Real-time service information from TfL and National Rail.
                </p>
            </div>

            {/* Status sections */}
            <div>
                <section>
                    <LineStatusList title="Tube" icon={<SiTransportforlondon />} api_url={tube_api} enabled={true} />
                </section>

                <section>
                    <LineStatusList title="National Rail" icon={<SiNationalrail />} api_url={rail_api} />
                </section>

                <section>
                    <LineStatusList title="TFL River Bus" icon={<IoMdBoat />} api_url={river_api} />
                </section>
            </div>
        </div>
    );
}

export default Status;
