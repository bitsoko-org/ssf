import React, { useState, useEffect } from 'react';
import { type FightEvent } from '../types';
import { LocationIcon } from '../components/icons';

interface HomePageProps {
  addRequest: (name: string, nickname: string, phone: string) => void;
}

const CALENDAR_URL = "https://calendar.google.com/calendar/ical/7598c28c20e04ce699489a251aeb81b0d85d884d35e1ebbecd3c4ddbe125abe4%40group.calendar.google.com/public/basic.ics";

const parseICS = (icsData: string): FightEvent[] => {
    const events: FightEvent[] = [];
    const eventBlocks = icsData.match(/BEGIN:VEVENT([\s\S]*?)END:VEVENT/g);

    if (!eventBlocks) return [];

    eventBlocks.forEach((block, index) => {
        const summaryMatch = block.match(/SUMMARY:(.*)/);
        const locationMatch = block.match(/LOCATION:(.*)/);
        const dtstartMatch = block.match(/DTSTART(?:;VALUE=DATE)?:(\d{8})/);

        if (summaryMatch && dtstartMatch) {
            const title = summaryMatch[1].trim().replace(/\\,/g, ',');
            const [boxer1 = 'TBA', boxer2 = 'TBA'] = title.split(/\s+vs\s+/i).map(name => name.trim());
            
            const dateStr = dtstartMatch[1];
            const year = parseInt(dateStr.substring(0, 4), 10);
            const month = parseInt(dateStr.substring(4, 6), 10) - 1; // Month is 0-indexed in JS
            const day = parseInt(dateStr.substring(6, 8), 10);
            const date = new Date(Date.UTC(year, month, day));

            const location = locationMatch ? locationMatch[1].trim().replace(/\\,/g, ',') : 'Location To Be Announced';

            events.push({
                id: Date.now() + index, // Create a more unique key
                title,
                date,
                location,
                boxer1,
                boxer2,
            });
        }
    });

    // Sort events by date, earliest first
    return events.sort((a, b) => a.date.getTime() - b.date.getTime());
};


const Banner = () => (
    <div className="relative h-[60vh] md:h-[70vh] bg-black flex items-center justify-center overflow-hidden">
        <img
            src="https://picsum.photos/seed/belt/1920/1080"
            alt="Championship Belt"
            className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black"></div>
        <div className="relative text-center z-10 p-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white uppercase" style={{ textShadow: '0 0 15px rgba(250, 204, 21, 0.7)' }}>
                The SafariFame Belt
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-gray-300">
                Where legends are forged and champions are crowned. Witness the pinnacle of boxing excellence.
            </p>
        </div>
    </div>
);

const Calendar = ({ fightEvents }: { fightEvents: FightEvent[] }) => {
    if (fightEvents.length === 0) {
        return <p className="text-center text-gray-500">No upcoming fights scheduled at the moment.</p>;
    }
    
    return (
        <div className="grid gap-8 md:grid-cols-2">
            {fightEvents.map((event) => (
                <div key={event.id} className="bg-black border-2 border-gray-800 rounded-lg p-6 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 transform hover:scale-105 hover:border-yellow-400 transition-all duration-300">
                    <div className="flex flex-col items-center justify-center bg-gray-800 text-white w-24 h-24 rounded-lg flex-shrink-0">
                        <span className="text-4xl font-bold">{event.date.getUTCDate()}</span>
                        <span className="text-sm uppercase">{event.date.toLocaleString('default', { month: 'short', timeZone: 'UTC' })}</span>
                    </div>
                    <div className="text-center sm:text-left">
                        <h3 className="text-xl font-bold text-white">{event.boxer1} vs {event.boxer2}</h3>
                        <p className="text-yellow-400 font-semibold">{event.title}</p>
                        <div className="flex items-center justify-center sm:justify-start mt-2 text-gray-400">
                            <LocationIcon className="w-4 h-4 mr-2" />
                            <span>{event.location}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const JoinForm = ({ addRequest }: { addRequest: (name: string, nickname: string, phone: string) => void; }) => {
    const [name, setName] = useState('');
    const [nickname, setNickname] = useState('');
    const [phone, setPhone] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name && nickname && phone) {
            addRequest(name, nickname, phone);
            setName('');
            setNickname('');
            setPhone('');
            setSubmitted(true);
            setTimeout(() => setSubmitted(false), 3000);
        }
    };

    return (
        <div className="py-16 md:py-24 bg-black">
            <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-yellow-400 mb-4">Join The Ranks</h2>
                <p className="text-gray-300 mb-8">Think you have what it takes? Request to be added to the leaderboard.</p>
                {submitted ? (
                    <div className="bg-green-500 text-white font-bold rounded-lg p-4">
                        Request submitted successfully! The admin will review it shortly.
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" required className="w-full bg-gray-900 border border-gray-700 rounded-md p-3 text-white focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition" />
                        <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="Fighter Nickname" required className="w-full bg-gray-900 border border-gray-700 rounded-md p-3 text-white focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition" />
                        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone (e.g., 254700000000)" required pattern="\d+" className="w-full bg-gray-900 border border-gray-700 rounded-md p-3 text-white focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition" />
                        <button type="submit" className="w-full bg-yellow-400 text-black font-bold py-3 px-6 rounded-md hover:bg-yellow-500 transition-colors duration-300 transform hover:scale-105">
                            Request Entry
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default function HomePage({ addRequest }: HomePageProps) {
    const [fightEvents, setFightEvents] = useState<FightEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAndParseCalendar = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Using a CORS proxy to prevent browser-side cross-origin errors.
                const proxyUrl = 'https://corsproxy.io/?';
                const response = await fetch(`${proxyUrl}${encodeURIComponent(CALENDAR_URL)}`);

                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }
                const icsData = await response.text();
                const parsedEvents = parseICS(icsData);
                setFightEvents(parsedEvents);
            } catch (err) {
                console.error("Error fetching or parsing calendar:", err);
                setError("Could not load the fight calendar. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAndParseCalendar();
    }, []);

    return (
        <div>
            <Banner />
            <div className="py-16 md:py-24 bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-center text-yellow-400 mb-12">Upcoming Fights</h2>
                    {isLoading ? (
                        <div className="text-center text-gray-400">Loading Fights...</div>
                    ) : error ? (
                        <div className="text-center text-red-500">{error}</div>
                    ) : (
                        <Calendar fightEvents={fightEvents} />
                    )}
                </div>
            </div>
            <JoinForm addRequest={addRequest} />
        </div>
    );
}