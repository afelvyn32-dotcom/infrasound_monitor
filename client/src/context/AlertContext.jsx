import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSocket } from './SocketContext';
import { alertService } from '../services/alertService';
import { useAuth } from './AuthContext';

const AlertContext = createContext(null);

// Web Audio API beep synthesizer (no external audio assets required)
const playAlertBeep = (severity) => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = severity === 'CRITICAL' ? 'sawtooth' : 'sine';
    osc.frequency.setValueAtTime(severity === 'CRITICAL' ? 880 : 440, ctx.currentTime);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch (e) {
    // AudioContext autoplay might be blocked before first user gesture
  }
};

export const AlertProvider = ({ children }) => {
  const { socket, isConnected } = useSocket();
  const { user } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [latestPopup, setLatestPopup] = useState(null);

  // Fetch initial alerts
  useEffect(() => {
    if (user) {
      alertService.getAll({ limit: 30 }).then((res) => {
        if (res.success) {
          setAlerts(res.data);
          setUnreadCount(res.unacknowledgedCount);
        }
      }).catch(err => console.warn('[AlertContext] Failed to fetch alerts:', err.message));
    }
  }, [user]);

  // Listen to live socket alerts
  useEffect(() => {
    if (!socket) return;

    const handleNewAlert = (alert) => {
      console.log('[AlertContext] Real-time alert received:', alert);
      setAlerts(prev => [alert, ...prev]);
      setUnreadCount(prev => prev + 1);
      setLatestPopup(alert);

      // Play sound if user has enabled browser sound
      if (user?.notificationSettings?.browserSound) {
        playAlertBeep(alert.severity);
      }

      // Auto dismiss banner popup after 6 seconds
      setTimeout(() => {
        setLatestPopup(curr => (curr?.alertId === alert.alertId ? null : curr));
      }, 6000);
    };

    socket.on('alert:new', handleNewAlert);

    return () => {
      socket.off('alert:new', handleNewAlert);
    };
  }, [socket, user]);

  const acknowledgeAlert = async (alertId) => {
    try {
      const res = await alertService.acknowledge(alertId);
      if (res.success) {
        setAlerts(prev => prev.map(a => a.alertId === alertId ? { ...a, isAcknowledged: true } : a));
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('[AlertContext] Error acknowledging alert:', err.message);
    }
  };

  const acknowledgeAll = async () => {
    try {
      const res = await alertService.acknowledgeAll();
      if (res.success) {
        setAlerts(prev => prev.map(a => ({ ...a, isAcknowledged: true })));
        setUnreadCount(0);
      }
    } catch (err) {
      console.error('[AlertContext] Error acknowledging all alerts:', err.message);
    }
  };

  const dismissPopup = () => setLatestPopup(null);

  const value = {
    alerts,
    unreadCount,
    latestPopup,
    dismissPopup,
    acknowledgeAlert,
    acknowledgeAll
  };

  return <AlertContext.Provider value={value}>{children}</AlertContext.Provider>;
};

export const useAlerts = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlerts must be used within an AlertProvider');
  }
  return context;
};
