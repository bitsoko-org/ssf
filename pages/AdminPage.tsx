
import React from 'react';
import { type JoinRequest } from '../types';

interface AdminPageProps {
  requests: JoinRequest[];
  handleRequest: (requestId: number, action: 'approve' | 'deny') => void;
}

export default function AdminPage({ requests, handleRequest }: AdminPageProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl md:text-5xl font-extrabold text-center text-yellow-400 mb-10">Admin Panel</h1>
      <h2 className="text-2xl font-bold text-white mb-6">Pending Join Requests</h2>

      <div className="bg-black border-2 border-gray-800 rounded-lg shadow-lg shadow-yellow-400/10">
        {requests.length > 0 ? (
          <ul className="divide-y-2 divide-gray-800">
            {requests.map((request) => (
              <li key={request.id} className="p-4 md:p-6 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                <div>
                  <p className="font-bold text-white text-lg">{request.name} <span className="text-gray-400 font-normal">"{request.nickname}"</span></p>
                  <p className="text-gray-500 font-mono">{request.phone}</p>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleRequest(request.id, 'approve')}
                    className="bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-300"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleRequest(request.id, 'deny')}
                    className="bg-red-600 text-white font-bold py-2 px-4 rounded-md hover:bg-red-700 transition-colors duration-300"
                  >
                    Deny
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <p>No pending requests at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
