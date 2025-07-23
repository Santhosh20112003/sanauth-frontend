import React, { useEffect, useState } from 'react';
import { RiArrowLeftLine, RiWindowsFill, RiAndroidFill, RiAppleFill, RiChromeFill, RiFirefoxFill, RiSafariFill, RiEdgeFill, RiOperaFill } from 'react-icons/ri';
import { FaLinux } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import request from '../../config/axios_config';
import { useUserAuth } from '../../context/UserAuthContext';

interface Session {
  id: string;
  device: string;
  location: string;
  ip: string;
  lastActive: string;
  current: boolean;
}

interface ApiSession {
  email: string;
  token: string;
  loginTime: string;
  deviceInfo: string;
  ipAddress: string;
  location: string;
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

const getDeviceIcon = (deviceInfo: string) => {
  const info = deviceInfo.toLowerCase();
  
  // OS Icons
  if (info.includes('windows')) return <RiWindowsFill className="mr-2 text-[#00A4EF]" />;
  if (info.includes('mac') || info.includes('ios')) return <RiAppleFill className="mr-2 text-[#555555]" />;
  if (info.includes('android')) return <RiAndroidFill className="mr-2 text-[#3DDC84]" />;
  if (info.includes('linux')) return <FaLinux className="mr-2 text-[#FCC624]" />;

  // Browser Icons (if no OS match)
  if (info.includes('chrome')) return <RiChromeFill className="mr-2 text-[#4285F4]" />;
  if (info.includes('firefox')) return <RiFirefoxFill className="mr-2 text-[#FF7139]" />;
  if (info.includes('safari')) return <RiSafariFill className="mr-2 text-[#000000]" />;
  if (info.includes('edge')) return <RiEdgeFill className="mr-2 text-[#0078D7]" />;
  if (info.includes('opera')) return <RiOperaFill className="mr-2 text-[#FF1B2D]" />;

  return null;
};

const isCurrentSession = (sessionToken: string): boolean => {
  const currentToken = localStorage.getItem('token') || sessionStorage.getItem('token');
  return sessionToken === currentToken;
};

const SessionItem: React.FC<{
  session: Session;
  onRevoke: (id: string) => void;
  isRevoking: string | null;
}> = ({ session, onRevoke, isRevoking }) => {
  const isCurrentActive = isCurrentSession(session.id);
  
  return (
    <div className={`p-4 rounded-lg border ${isCurrentActive ? 'border-blue-200' : 'border-gray-200'}`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              {getDeviceIcon(session.device)}
              <h3 className="font-medium text-gray-900">{session.device}</h3>
            </div>
            {isCurrentActive && (
              <div className="flex items-center px-2 py-1 bg-blue-50 border border-blue-100 rounded-full">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1.5"></div>
                <span className="text-xs font-medium text-blue-700">This Device</span>
              </div>
            )}
          </div>
          
          <div className={`mt-2 flex flex-col gap-1 ${isCurrentActive ? 'text-blue-900/70' : 'text-gray-500'}`}>
            <div className="text-sm flex items-center gap-2">
              <div className="flex items-center">
                {isCurrentActive && '📍 '}
                {session.location}
              </div>
              <span className="text-gray-300">•</span>
              <div>IP: {session.ip}</div>
            </div>
            <div className="text-xs">
              <span className={`font-medium ${isCurrentActive ? 'text-blue-600' : ''}`}>
                Last active:
              </span>{' '}
              {getTimeSince(session.lastActive)}
            </div>
          </div>
        </div>

        {!isCurrentActive && (
          <button
            onClick={() => onRevoke(session.id)}
            disabled={isRevoking === session.id}
            className={`text-sm px-3 py-1.5 rounded-md transition-all ${
              isRevoking === session.id 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'text-red-600 hover:bg-red-50 hover:shadow-sm active:bg-red-100'
            }`}
            aria-label={`Revoke session on ${session.device}`}
          >
            {isRevoking === session.id ? 'Revoking...' : 'Revoke'}
          </button>
        )}
      </div>
    </div>
  );
};

const ActiveSessions: React.FC<ActiveSessionsProps> = () => {
  const { SignOut } = useUserAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRevoking, setIsRevoking] = useState<string | null>(null);
  const standalone = false;

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await request.post("/api/users/get/session/list");
        const data: ApiSession[] = response.data;
        
        if (!data) {
          setSessions([]);
          return;
        }

        const transformedSessions = data.map(session => ({
          id: session.token,
          device: session.deviceInfo,
          location: session.location,
          ip: session.ipAddress,
          lastActive: session.loginTime,
          current: isCurrentSession(session.token)
        }))
        // Sort sessions to put current session first
        .sort((a, b) => {
          if (a.current) return -1;
          if (b.current) return 1;
          return new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime();
        });

        setSessions(transformedSessions);
      } catch (error) {
        console.error('Failed to fetch sessions:', error);
        setSessions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const onRevokeSession = async (sessionId: string) => {
    try {
      setIsRevoking(sessionId);
      const response = await request.post(`/api/users/revoke/${sessionId}`);
      
      if (response.data?.message === "Revoked successful") {
        // Remove the session from the list
        setSessions(prevSessions => 
          prevSessions.filter(session => session.id !== sessionId)
        );
        
        // Only call SignOut if it's the current session
        const currentToken = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (sessionId === currentToken) {
          await SignOut(sessionId);
        }
      } else {
        throw new Error("Revocation failed");
      }
    } catch (error) {
      console.error('Failed to revoke session:', error);
    } finally {
      setIsRevoking(null);
    }
  };

  const onRevokeAllOtherSessions = async () => {
    // TODO: Implement revoke all sessions API call
    console.log('Revoking all other sessions');
  };

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
                isRevoking={isRevoking}
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
