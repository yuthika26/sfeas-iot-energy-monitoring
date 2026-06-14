// ── PowerChart.jsx ────────────────────────────────────────────────────────────
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const STATUS_COLOR = { running: '#4f9cf9', idle: '#fbbf24', fault: '#f87171' };

export default function PowerChart({ machines }) {
  const [history, setHistory]   = useState([]);

  // Build bar chart data from machines
  const barData = machines.map(m => ({
    name:   m.id,
    power:  m.power,
    status: m.status,
  }));

  // Build total-power history line
  useEffect(() => {
    if (!machines.length) return;
    const total = machines.reduce((s, m) => s + m.power, 0);
    setHistory(prev => {
      const next = [...prev, { time: new Date().toLocaleTimeString(), total: parseFloat(total.toFixed(1)) }];
      return next.slice(-20);  // keep last 20 points
    });
  }, [machines]);

  return (
    <div style={styles.wrap}>
      <h2 style={styles.title}>Live Power per Machine (kW)</h2>
      {barData.length === 0 ? (
        <div style={styles.empty}>Waiting for data...</div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={barData} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
            <XAxis dataKey="name" tick={{ fill: '#8892a4', fontSize: 10 }} />
            <YAxis tick={{ fill: '#8892a4', fontSize: 10 }} unit=" kW" />
            <Tooltip
              contentStyle={{ background: '#1e2433', border: '1px solid #2d3748', borderRadius: 8, fontSize: 12 }}
              formatter={(v, n) => [`${v} kW`, 'Power']}
            />
            <Bar dataKey="power" radius={[4, 4, 0, 0]}>
              {barData.map((d, i) => (
                <Cell key={i} fill={STATUS_COLOR[d.status] || '#4f9cf9'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

const styles = {
  wrap:  { background: '#1e2433', borderRadius: 12, padding: 20, marginBottom: 24 },
  title: { margin: '0 0 16px', fontSize: 16, color: '#e2e8f0' },
  empty: { height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4b5563' },
};
