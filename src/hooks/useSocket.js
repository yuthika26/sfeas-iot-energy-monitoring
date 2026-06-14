// ── useSocket.js — live data hook ─────────────────────────────────────────────
import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

const API  = 'http://localhost:3001';
const WS   = 'http://localhost:3001';

export function useSocket() {
  const [machines,  setMachines]  = useState([]);
  const [kpis,      setKpis]      = useState(null);
  const [alerts,    setAlerts]    = useState([]);
  const [anomalies, setAnomalies] = useState([]);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    // ── Initial REST fetch so data shows before WS connects ──────────────────
    const fetchAll = async () => {
      try {
        const [mRes, kRes, aRes, anRes] = await Promise.all([
          axios.get(`${API}/api/machines`),
          axios.get(`${API}/api/kpis`),
          axios.get(`${API}/api/alerts`),
          axios.get(`${API}/api/anomalies`),
        ]);
        setMachines(mRes.data.machines  || []);
        setKpis(kRes.data);
        setAlerts(aRes.data.alerts      || []);
        setAnomalies(anRes.data.anomalies || []);
      } catch (e) {
        console.warn('REST fetch failed — waiting for WebSocket', e.message);
      }
    };
    fetchAll();

    // ── WebSocket ─────────────────────────────────────────────────────────────
    const socket = io(WS, { transports: ['websocket', 'polling'] });
    socketRef.current = socket;

    socket.on('connect',    () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    socket.on('machines:update',  data => setMachines(data));
    socket.on('kpis:update',      data => setKpis(data));
    socket.on('alerts:update',    data => setAlerts(data));
    socket.on('anomalies:update', data => setAnomalies(data));

    return () => socket.disconnect();
  }, []);

  const resolveAlert = (id) => {
    socketRef.current?.emit('alert:resolve', { id });
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  return { machines, kpis, alerts, anomalies, connected, resolveAlert };
}
