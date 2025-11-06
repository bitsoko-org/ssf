import React, { useState, useMemo } from 'react';
import { type Boxer } from '../types';
import { ChevronDownIcon } from '../components/icons';

interface LeaderboardPageProps {
  boxers: Boxer[];
}

// Fix: Define a named interface for component props to resolve TS error with `key` prop.
interface BoxerListItemProps {
  boxer: Boxer;
  rank: number;
}

// Fix: Explicitly type BoxerListItem as a React.FC to resolve the TypeScript error
// where the 'key' prop was being incorrectly validated against the component's props.
const BoxerListItem: React.FC<BoxerListItemProps> = ({ boxer, rank }) => {
    const [isOpen, setIsOpen] = useState(false);

    const rankColor = rank === 1 ? 'bg-yellow-400 text-black' : rank === 2 ? 'bg-gray-400 text-black' : rank === 3 ? 'bg-yellow-600 text-white' : 'bg-gray-700 text-white';

    return (
        <div className="border-b-2 border-gray-800 last:border-b-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center p-4 text-left hover:bg-gray-900 transition-colors duration-200"
                aria-expanded={isOpen}
                aria-controls={`boxer-details-${boxer.id}`}
            >
                <div className="flex items-center space-x-4 flex-grow">
                    <div className={`flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold text-xl ${rankColor}`}>
                        {rank}
                    </div>
                    <img className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover" src={boxer.avatarUrl} alt={boxer.name} />
                    <div className="flex-grow">
                        <p className="text-lg md:text-xl font-bold text-white">{boxer.name}</p>
                        <p className="text-sm md:text-base text-gray-400">"{boxer.nickname}"</p>
                    </div>
                </div>
                <div className="text-right ml-4 flex-shrink-0">
                    <p className="text-lg md:text-xl font-bold text-yellow-400">{boxer.points.toLocaleString()} PTS</p>
                </div>
                <ChevronDownIcon className={`w-6 h-6 ml-4 text-gray-500 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div id={`boxer-details-${boxer.id}`} className="bg-gray-900 p-4 md:p-6 text-gray-300 animate-fade-in">
                    <p className="mb-6 italic">"{boxer.bio}"</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6 text-center">
                        <div className="bg-black p-3 rounded-lg">
                            <p className="text-sm text-gray-500 uppercase tracking-wider">Record</p>
                            <p className="text-lg font-bold text-white">{boxer.record.wins}W - {boxer.record.losses}L - {boxer.record.draws}D</p>
                        </div>
                        <div className="bg-black p-3 rounded-lg">
                            <p className="text-sm text-gray-500 uppercase tracking-wider">Points</p>
                            <p className="text-lg font-bold text-yellow-400">{boxer.points.toLocaleString()}</p>
                        </div>
                    </div>

                    <div className="bg-black p-4 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">Address:</p>
                        <p className="font-mono text-yellow-400 break-all mb-4">{boxer.address}</p>
                        
                        <a 
                          href={`lightning:${boxer.address}`} 
                          className="md:hidden w-full text-center bg-yellow-400 text-black font-bold py-3 px-6 rounded-md hover:bg-yellow-500 transition-colors duration-300 transform hover:scale-105 block"
                        >
                            Send Sats
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
};

export default function LeaderboardPage({ boxers }: LeaderboardPageProps) {
    const sortedBoxers = useMemo(() => 
        [...boxers].sort((a, b) => b.points - a.points), 
        [boxers]
    );

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-center text-yellow-400 mb-2">Leaderboard</h1>
            <p className="text-center text-gray-400 mb-10">Rankings based on crypto points received by fighters. 100% payout to boxer. 1000 sats ~ 1 point.</p>

            <div className="bg-black border-2 border-gray-800 rounded-lg overflow-hidden shadow-lg shadow-yellow-400/10">
                {sortedBoxers.map((boxer, index) => (
                    <BoxerListItem key={boxer.id} boxer={boxer} rank={index + 1} />
                ))}
            </div>
        </div>
    );
}

// Add a simple fade-in animation for the expanded details
const style = document.createElement('style');
style.innerHTML = `
    @keyframes fade-in {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in {
        animation: fade-in 0.3s ease-out;
    }
`;
document.head.appendChild(style);
