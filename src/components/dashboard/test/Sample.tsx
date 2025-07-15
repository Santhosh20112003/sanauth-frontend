import React, { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

interface WebSocketState {
  messages: string[];
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
}

const WebSocketDemo: React.FC = () => {
  const [state, setState] = useState<WebSocketState>({
    messages: [],
    isConnected: false,
    isLoading: true,
    error: null
  });
  const [client, setClient] = useState<Client | null>(null);

  useEffect(() => {
    const socket = new SockJS('http://localhost:9001/ws');
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        setState(prev => ({ ...prev, isConnected: true, isLoading: false }));
        stompClient.subscribe('/topic/messages', (message) => {
          try {
            const messageBody = message.body;
            setState(prev => ({
              ...prev,
              messages: [...prev.messages, messageBody]
            }));
          } catch (error) {
            setState(prev => ({
              ...prev,
              error: 'Failed to process message'
            }));
          }
        });
      },
      onDisconnect: () => {
        setState(prev => ({
          ...prev,
          isConnected: false,
          error: 'Connection lost. Attempting to reconnect...'
        }));
      },
      onStompError: (frame) => {
        setState(prev => ({
          ...prev,
          error: `WebSocket Error: ${frame.headers.message}`
        }));
      }
    });

    try {
      stompClient.activate();
      setClient(stompClient);
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to establish connection',
        isLoading: false
      }));
    }

    return () => {
      stompClient.deactivate();
    };
  }, []);

  const sendMessage = () => {
    if (client && state.isConnected) {
      try {
        client.publish({
          destination: '/app/sendMessage',
          body: 'Hello from React 👋',
        });
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: 'Failed to send message'
        }));
      }
    }
  };

  if (state.isLoading) {
    return <div>Connecting to WebSocket...</div>;
  }

  return (
    <div className="websocket-container">
      <h1>WebSocket Demo</h1>
      <div className="connection-status">
        Status: {state.isConnected ? 'Connected ✅' : 'Disconnected ❌'}
      </div>
      {state.error && (
        <div className="error-message">{state.error}</div>
      )}
      <button 
        onClick={sendMessage}
        disabled={!state.isConnected}
      >
        Send Message
      </button>
      <ul className="messages-list">
        {state.messages.map((msg, idx) => (
          <li key={idx}>{msg}</li>
        ))}
      </ul>
    </div>
  );
};

export default WebSocketDemo;
