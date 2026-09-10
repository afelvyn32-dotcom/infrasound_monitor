import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Connect to WebSocket server via Vite proxy or direct port 5000
    const socketInstance = io(window.location.origin, {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 1000
    });

    socketInstance.on('connect', () => {
      console.log('[SocketContext] Connected to Infrasound WebSocket Server:', socketInstance.id);
      setIsConnected(true);
      socketInstance.emit('subscribe:alerts');
    });

    socketInstance.on('disconnect', () => {
      console.warn('[SocketContext] Disconnected from WebSocket Server');
      setIsConnected(false);
    });

    socketInstance.on('connect_error', (err) => {
      console.warn('[SocketContext] Connection error:', err.message);
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const subscribeToSensor = (sensorId) => {
    if (socket && isConnected) {
      socket.emit('subscribe:sensor', { sensorId });
    }
  };

  const unsubscribeFromSensor = (sensorId) => {
    if (socket && isConnected) {
      socket.emit('unsubscribe:sensor', { sensorId });
    }
  };

  const value = {
    socket,
    isConnected,
    subscribeToSensor,
    unsubscribeFromSensor
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
