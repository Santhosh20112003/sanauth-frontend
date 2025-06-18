import React from 'react';
import { RiArrowLeftLine } from 'react-icons/ri';
import { Link } from 'react-router-dom';

interface Session {
  id: string;
  device: string;
  location: string;
  ip: string;
  lastActive: string;
  current: boolean;
}

interface ActiveSessionsProps {
  sessions?: Session[];
  onRevokeSession?: (sessionId: string) => void;
  onRevokeAllOtherSessions?: () => void;
  standalone?: boolean;
  isLoading?: boolean;
}

const getTimeSince = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  } catch (error) {
    console.error("Time calculation error:", error);
    return "Unknown time";
  }
};

const SessionItem: React.FC<{
  session: Session;
  onRevoke: (id: string) => void;
}> = ({ session, onRevoke }) => (
  <div
    className={`p-4 rounded-lg border ${session.current ? 'border-[#67c6ff] bg-[#67c6ff]/5' : 'border-gray-200'}`}
  >
    <div className="flex justify-between">
      <div>
        <div className="flex items-center">
          <h3 className="font-medium text-gray-800">{session.device}</h3>
          {session.current && (
            <span className="ml-2 text-xs bg-[#67c6ff]/10 text-[#67c6ff] px-2 py-0.5 rounded-full">
              Current Session
            </span>
          )}
        </div>
        <div className="text-sm text-gray-500 mt-1">
          {session.location} • IP: {session.ip}
        </div>
        <div className="text-xs text-gray-500 mt-0.5">
          <span className="font-medium">Last active:</span> {getTimeSince(session.lastActive)}
        </div>
      </div>

      {!session.current && (
        <button
          onClick={() => onRevoke(session.id)}
          className="text-sm text-red-600 hover:text-red-700"
          aria-label={`Revoke session on ${session.device}`}
        >
          Revoke
        </button>
      )}
    </div>
  </div>
);

const ActiveSessions: React.FC<ActiveSessionsProps> = () => {

  const sessions = [
    {
      id: '1',
      device: 'MacBook Pro',
      location: 'New York, USA',
      ip: '172. 16.254.1',
      lastActive: '2023-10-01T12:34:56Z',
      current: true,
    },
    {
      id: '2',
      device: 'iPhone 14',
      location: 'San Francisco, USA',
      ip: '192. 168.1.1',
      lastActive: '2023-10-02T08:20:30Z',
      current: false,
    },
    {
      id: '3',
      device: 'Windows Desktop',
      location: 'London, UK',
      ip: '192. 168.1.2',
      lastActive: '2023-10-03T15:45:00Z',
      current: false,
    }
  ];
  const onRevokeSession = () => {
    console.log('Revoke session function not provided');
  };
  const onRevokeAllOtherSessions = () => console.log('Revoke all sessions function not provided');
  const standalone = false;
  const isLoading = false;
  const hasOtherSessions = sessions.some(session => !session.current);

  return (
    <div className={`${standalone ? 'p-6 max-w-6xl mx-auto' : ''}`}>
      {standalone && (
        <div className="flex items-center mb-6">
          <Link to="/profile" className="flex items-center text-gray-600 hover:text-gray-900 mr-4">
            <RiArrowLeftLine className="mr-1" /> Back to Profile
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Active Sessions</h1>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {!standalone && <h2 className="text-lg font-semibold text-gray-800 mb-6">Active Sessions</h2>}

        {isLoading ? (
          <div className="py-8 flex justify-center">
            <div className="animate-pulse text-center">
              <div className="h-4 w-32 bg-gray-200 rounded mb-4 mx-auto"></div>
              <div className="h-10 w-64 bg-gray-100 rounded"></div>
            </div>
          </div>
        ) : sessions.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            No active sessions found.
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map(session => (
              <SessionItem
                key={session.id}
                session={session}
                onRevoke={onRevokeSession}
              />
            ))}
          </div>
        )}

        {hasOtherSessions && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={onRevokeAllOtherSessions}
              className="px-4 py-2 border border-red-300 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
              aria-label="Revoke all sessions except current one"
            >
              Revoke All Other Sessions
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveSessions;
