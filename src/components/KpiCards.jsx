// ── KpiCards.jsx ──────────────────────────────────────────────────────────────
import React from 'react';

const cards = (kpis, machines) => [
  { label: 'Total Power',    value: kpis?.totalPower  ? `${kpis.totalPower} kW`   : '—', sub: 'Live consumption',          color: '#4f9cf9' },
  { label: "Today's kWh",   value: kpis?.todayKWh    ? `${kpis.todayKWh}`        : '—', sub: 'Energy consumed today',     color: '#a78bfa' },
  { label: 'CO₂ Today',     value: kpis?.co2Today    ? `${kpis.co2Today} t`      : '—', sub: `${kpis?.treesEquiv||0} trees equiv`, color: '#34d399' },
  { label: 'Est. Cost',     value: kpis?.costToday   ? `₹${kpis.costToday}K`     : '—', sub: 'Today @ ₹6.7/kWh',         color: '#fbbf24' },
  { label: 'Machines',      value: `${kpis?.running||0} / ${kpis?.total||0}`,           sub: `${kpis?.idle||0} idle · ${kpis?.fault||0} fault`, color: '#f87171' },
  { label: 'Anomalies',     value: kpis?.anomalies   ? kpis.anomalies             : '0', sub: 'Detected this cycle',       color: '#fb923c' },
];

export default function KpiCards({ kpis, machines }) {
  return (
    <div style={styles.grid}>
      {cards(kpis, machines).map(c => (
        <div key={c.label} style={styles.card}>
          <div style={{ ...styles.bar, background: c.color }} />
          <div style={styles.label}>{c.label}</div>
          <div style={{ ...styles.value, color: c.color }}>{c.value}</div>
          <div style={styles.sub}>{c.sub}</div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  grid:  { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 24 },
  card:  { background: '#1e2433', borderRadius: 12, padding: '18px 20px', position: 'relative', overflow: 'hidden' },
  bar:   { position: 'absolute', top: 0, left: 0, right: 0, height: 3, borderRadius: '12px 12px 0 0' },
  label: { fontSize: 11, color: '#8892a4', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  value: { fontSize: 26, fontWeight: 700, marginBottom: 4 },
  sub:   { fontSize: 11, color: '#6b7280' },
};
