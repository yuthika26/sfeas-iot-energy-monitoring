// ── AlertsPanel.jsx ───────────────────────────────────────────────────────────
import React from 'react';

const TYPE_COLOR = { critical: '#f87171', warning: '#fbbf24', info: '#60a5fa' };
const TYPE_ICON  = { critical: '🔴', warning: '🟡', info: '🔵' };

export default function AlertsPanel({ alerts, resolveAlert }) {
  const open = alerts.filter(a => !a.resolved);

  return (
    <div style={styles.wrap}>
      <div style={styles.header}>
        <h2 style={styles.title}>Active Alerts</h2>
        <div style={styles.counts}>
          {['critical','warning','info'].map(t => (
            <span key={t} style={{ ...styles.badge, color: TYPE_COLOR[t], background: TYPE_COLOR[t] + '18', border: `1px solid ${TYPE_COLOR[t]}33` }}>
              {TYPE_ICON[t]} {open.filter(a => a.type === t).length} {t}
            </span>
          ))}
        </div>
      </div>

      {open.length === 0 ? (
        <div style={styles.empty}>✅ No active alerts</div>
      ) : (
        <div style={styles.list}>
          {open.map(a => (
            <div key={a.id} style={{ ...styles.card, borderLeft: `3px solid ${TYPE_COLOR[a.type]}` }}>
              <div style={styles.left}>
                <div style={{ ...styles.type, color: TYPE_COLOR[a.type] }}>{TYPE_ICON[a.type]} {a.type.toUpperCase()}</div>
                <div style={styles.atitle}>{a.title}</div>
                <div style={styles.desc}>{a.desc}</div>
                <div style={styles.time}>{new Date(a.ts).toLocaleTimeString()}</div>
              </div>
              <button style={styles.resolve} onClick={() => resolveAlert(a.id)}>
                Resolve
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  wrap:    { background: '#1e2433', borderRadius: 12, padding: 20, marginBottom: 24 },
  header:  { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 },
  title:   { margin: 0, fontSize: 16, color: '#e2e8f0' },
  counts:  { display: 'flex', gap: 8, flexWrap: 'wrap' },
  badge:   { fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 99 },
  list:    { display: 'flex', flexDirection: 'column', gap: 10 },
  card:    { background: '#151c2c', borderRadius: 8, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  left:    { flex: 1 },
  type:    { fontSize: 10, fontWeight: 700, letterSpacing: 1, marginBottom: 4 },
  atitle:  { fontSize: 13, fontWeight: 600, color: '#e2e8f0', marginBottom: 2 },
  desc:    { fontSize: 12, color: '#9ca3af', marginBottom: 4 },
  time:    { fontSize: 11, color: '#4b5563' },
  resolve: { background: '#2d3748', border: '1px solid #374151', color: '#9ca3af', borderRadius: 6, padding: '6px 14px', cursor: 'pointer', fontSize: 12, whiteSpace: 'nowrap' },
  empty:   { textAlign: 'center', padding: 40, color: '#34d399' },
};
