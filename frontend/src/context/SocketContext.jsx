import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import { SOCKET_URL } from '../utils/api';

const SocketContext = createContext(null);

let socketSingleton = null;
let providerCount = 0;
let disconnectTimer = null;

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    providerCount += 1;
    if (disconnectTimer) {
      clearTimeout(disconnectTimer);
      disconnectTimer = null;
    }

    if (!socketSingleton) {
      socketSingleton = io(SOCKET_URL, { transports: ['websocket', 'polling'] });
    }

    const s = socketSingleton;
    setSocket(s);

    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);
    s.on('connect', onConnect);
    s.on('disconnect', onDisconnect);

    // initialize state if already connected
    if (s.connected) setConnected(true);

    return () => {
      providerCount -= 1;
      s.off('connect', onConnect);
      s.off('disconnect', onDisconnect);
      setSocket(null);
      setConnected(false);

      // In React dev StrictMode, effects mount/unmount quickly.
      // Delay disconnect to avoid "closed before established" warnings.
      if (providerCount <= 0) {
        disconnectTimer = setTimeout(() => {
          if (providerCount <= 0 && socketSingleton) {
            socketSingleton.disconnect();
            socketSingleton = null;
          }
        }, 800);
      }
    };
  }, []);

  const value = useMemo(
    () => ({
      socket,
      connected,
      subscribe: (payload) => {
        socket?.emit('subscribe', payload);
      },
    }),
    [socket, connected]
  );

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}

export function useSocket() {
  return useContext(SocketContext);
}
