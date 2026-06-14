// ── AnomalyPanel.jsx ──────────────────────────────────────────────────────────
import React from 'react';

const scoreColor = s => s >= 0.7 ? '#f87171' : s >= 0.5 ? '#fbbf24' : '#34d399';
const scoreLabel = s => s >= 0.7 ? 'CRITICAL' : s >= 0.5 ? 'WARNING' : 'INFO';

export default function AnomalyPanel({ anomalies }) {
  if (!anomalies.length) return (
    <div style={styles.wrap}>
      <h2 style={styles.title}>Anomaly Detection</h2>
      <div style={styles.empty}>✅ No anomalies detected — all machines normal</div>
    </div>
  );

  return (
    <div style={styles.wrap}>
      <div style={styles.header}>
        <h2 style={styles.title}>Anomaly Detection</h2>
        <span style={styles.count}>{anomalies.length} detected</span>
      </div>
      <div style={styles.list}>
        {anomalies.map(a => (
          <div key={a.machineId} style={styles.card}>
            <div style={styles.left}>
              <div style={{ ...styles.severity, color: scoreColor(a.score), borderColor: scoreColor(a.score) + '44', background: scoreColor(a.score) + '15' }}>
                {scoreLabel(a.score)}
              </div>
              <div style={styles.mname}>{a.machineName}</div>
              <div style={styles.mdept}>{a.dept} · {a.machineId}</div>
              {a.reason && <div style={styles.reason}>{a.reason}</div>}
            </div>
            <div style={styles.right}>
              <div style={styles.scoreWrap}>
                <div style={styles.scoreNum(a.score)}>{(a.score * 100).toFixed(0)}</div>
                <div style={styles.scoreLabel}>score</div>
              </div>
              <div style={styles.model}>{a.model}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  wrap:      { background: '#1e2433', borderRadius: 12, padding: 20, marginBottom: 24 },
  header:    { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  title:     { margin: 0, fontSize: 16, color: '#e2e8f0' },
  count:     { background: '#f8717122', color: '#f87171', border: '1px solid #f8717144', borderRadius: 99, padding: '2px 12px', fontSize: 12 },
  list:      { display: 'flex', flexDirection: 'column', gap: 10 },
  card:      { background: '#151c2c', borderRadius: 8, padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  left:      { flex: 1 },
  right:     { textAlign: 'center', marginLeft: 16 },
  severity:  { display: 'inline-block', fontSize: 10, fontWeight: 700, letterSpacing: 1, padding: '2px 8px', borderRadius: 4, border: '1px solid', marginBottom: 6 },
  mname:     { fontSize: 14, fontWeight: 600, color: '#e2e8f0', marginBottom: 2 },
  mdept:     { fontSize: 12, color: '#6b7280', marginBottom: 4 },
  reason:    { fontSize: 12, color: '#9ca3af' },
  scoreWrap: { marginBottom: 4 },
  scoreNum:  s => ({ fontSize: 28, fontWeight: 700, color: scoreColor(s) }),
  scoreLabel:{ fontSize: 10, color: '#6b7280', textTransform: 'uppercase' },
  model:     { fontSize: 10, color: '#4b5563' },
  empty:     { textAlign: 'center', padding: 40, color: '#34d399' },
};
