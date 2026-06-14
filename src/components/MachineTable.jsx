// ── MachineTable.jsx ──────────────────────────────────────────────────────────
import React, { useState } from 'react';

const STATUS_COLOR = { running: '#34d399', idle: '#fbbf24', fault: '#f87171' };

export default function MachineTable({ machines }) {
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all'
    ? machines
    : machines.filter(m => m.status === filter);

  return (
    <div style={styles.wrap}>
      <div style={styles.header}>
        <h2 style={styles.title}>Machine Status</h2>
        <div style={styles.filters}>
          {['all','running','idle','fault'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ ...styles.btn, ...(filter === f ? styles.btnActive : {}) }}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              {['ID','Machine','Dept','Status','Power (kW)','Voltage (V)','Current (A)','Temp (°C)','Load (%)','CO₂ (kg/hr)'].map(h => (
                <th key={h} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={10} style={styles.empty}>No machines — waiting for data...</td></tr>
            ) : filtered.map(m => (
              <tr key={m.id} style={styles.tr}>
                <td style={styles.td}>{m.id}</td>
                <td style={styles.td}>{m.name}</td>
                <td style={styles.td}>{m.dept}</td>
                <td style={styles.td}>
                  <span style={{ ...styles.badge, background: STATUS_COLOR[m.status] + '22', color: STATUS_COLOR[m.status], border: `1px solid ${STATUS_COLOR[m.status]}44` }}>
                    {m.status}
                  </span>
                </td>
                <td style={styles.td}>{m.power}</td>
                <td style={styles.td}>{m.voltage}</td>
                <td style={styles.td}>{m.current}</td>
                <td style={{ ...styles.td, color: m.temp > 88 ? '#f87171' : m.temp > 75 ? '#fbbf24' : 'inherit' }}>{m.temp}</td>
                <td style={styles.td}>{m.load}%</td>
                <td style={styles.td}>{m.co2}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  wrap:     { background: '#1e2433', borderRadius: 12, padding: 20, marginBottom: 24 },
  header:   { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 },
  title:    { margin: 0, fontSize: 16, color: '#e2e8f0' },
  filters:  { display: 'flex', gap: 8 },
  btn:      { background: '#2d3748', border: '1px solid #374151', color: '#9ca3af', borderRadius: 6, padding: '4px 12px', cursor: 'pointer', fontSize: 12 },
  btnActive:{ background: '#4f9cf9', color: '#fff', borderColor: '#4f9cf9' },
  tableWrap:{ overflowX: 'auto' },
  table:    { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
  th:       { textAlign: 'left', padding: '8px 12px', color: '#8892a4', borderBottom: '1px solid #2d3748', whiteSpace: 'nowrap', fontSize: 11, textTransform: 'uppercase' },
  tr:       { borderBottom: '1px solid #1a2030' },
  td:       { padding: '10px 12px', color: '#cbd5e1', whiteSpace: 'nowrap' },
  badge:    { padding: '2px 10px', borderRadius: 99, fontSize: 11, fontWeight: 600 },
  empty:    { padding: 40, textAlign: 'center', color: '#4b5563' },
};
