import React, { useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { type Boxer, type JoinRequest } from './types';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import LeaderboardPage from './pages/LeaderboardPage';
import AdminPage from './pages/AdminPage';

// Mock Data
const initialBoxers: Boxer[] = [
  { id: 1, name: 'Tyson Fury', nickname: 'The Gypsy King', points: 15000, record: { wins: 34, losses: 1, draws: 1 }, address: '447123456789@safarifame.com', avatarUrl: 'https://picsum.photos/seed/tyson/200', bio: 'Heavyweight champion known for his unorthodox style and resilience.' },
  { id: 2, name: 'Oleksandr Usyk', nickname: 'The Cat', points: 14500, record: { wins: 22, losses: 0, draws: 0 }, address: '380912345678@safarifame.com', avatarUrl: 'https://picsum.photos/seed/usyk/200', bio: 'Undisputed cruiserweight and unified heavyweight champion, a master technician.' },
  { id: 3, name: 'Canelo Álvarez', nickname: 'Canelo', points: 12000, record: { wins: 61, losses: 2, draws: 2 }, address: '523312345678@safarifame.com', avatarUrl: 'https://picsum.photos/seed/canelo/200', bio: 'A four-division world champion, famous for his punching power and counterpunching.' },
  { id: 4, name: 'Naoya Inoue', nickname: 'The Monster', points: 11500, record: { wins: 27, losses: 0, draws: 0 }, address: '819012345678@safarifame.com', avatarUrl: 'https://picsum.photos/seed/inoue/200', bio: 'Undisputed bantamweight champion, feared for his devastating body shots.' },
  { id: 5, name: 'Terence Crawford', nickname: 'Bud', points: 10000, record: { wins: 40, losses: 0, draws: 0 }, address: '14021234567@safarifame.com', avatarUrl: 'https://picsum.photos/seed/crawford/200', bio: 'Undisputed welterweight champion, a switch-hitter with exceptional boxing IQ.' },
];

const initialJoinRequests: JoinRequest[] = [
  { id: 1, name: 'John Doe', nickname: 'The Hammer', phone: '254711223344', status: 'pending' },
  { id: 2, name: 'Jane Smith', nickname: 'Lights Out', phone: '254755667788', status: 'pending' },
];

export default function App() {
  const [boxers, setBoxers] = useState<Boxer[]>(initialBoxers);
  const [requests, setRequests] = useState<JoinRequest[]>(initialJoinRequests);

  const addRequest = (name: string, nickname: string, phone: string) => {
    const newRequest: JoinRequest = {
      id: Date.now(),
      name,
      nickname,
      phone,
      status: 'pending',
    };
    setRequests(prev => [...prev, newRequest]);
  };

  const handleRequest = (requestId: number, action: 'approve' | 'deny') => {
    const request = requests.find(r => r.id === requestId);
    if (!request) return;

    if (action === 'approve') {
      const newBoxer: Boxer = {
        id: Date.now(),
        name: request.name,
        nickname: request.nickname,
        points: 0,
        record: { wins: 0, losses: 0, draws: 0 },
        address: `${request.phone}@safarifame.com`,
        avatarUrl: `https://picsum.photos/seed/${request.name.replace(/\s+/g, '')}/200`,
        bio: 'A rising star in the SafariFame league.',
      };
      setBoxers(prev => [...prev, newBoxer]);
    }
    setRequests(prev => prev.filter(r => r.id !== requestId));
  };

  return (
    <HashRouter>
      <div className="min-h-screen bg-black font-sans">
        <Header />
        <main className="pt-20">
          <Routes>
            <Route path="/" element={<HomePage addRequest={addRequest} />} />
            <Route path="/leaderboard" element={<LeaderboardPage boxers={boxers} />} />
            <Route path="/admin" element={<AdminPage requests={requests} handleRequest={handleRequest} />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
}