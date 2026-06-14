import React, { useState } from 'react';
import { useSocket }       from './hooks/useSocket';
import KpiCards            from './components/KpiCards';
import MachineTable        from './components/MachineTable';
import AnomalyPanel        from './components/AnomalyPanel';
import AlertsPanel         from './components/AlertsPanel';
import PowerChart          from './components/PowerChart';
import CarbonTab           from './components/CarbonTab';
import PredictionTab       from './components/PredictionTab';
import OptimizationTab     from './components/OptimizationTab';

const TABS = ['Overview','Machines','Carbon','Prediction','Optimization','Anomalies','Alerts'];

export default function App() {
  const [tab, setTab] = useState('Overview');
  const { machines, kpis, alerts, anomalies, connected, resolveAlert } = useSocket();
  const openAlerts = alerts.filter(a => !a.resolved);

  return (
    <div style={styles.app}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <div style={styles.logo}>⚡ SFEAS</div>
          <div style={styles.subtitle}>Smart Factory Energy Analytics System</div>
        </div>
        <div style={styles.headerRight}>
          <div style={{ ...styles.dot, background: connected ? '#34d399' : '#f87171' }} />
          <span style={styles.connText}>{connected ? 'Live' : 'Connecting...'}</span>
          <div style={styles.machineCount}>{machines.length} machines</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ ...styles.tabBtn, ...(tab===t ? styles.tabActive : {}) }}>
            {t}
            {t==='Alerts'     && openAlerts.length > 0    && <span style={styles.badge}>{openAlerts.length}</span>}
            {t==='Anomalies'  && anomalies.length > 0     && <span style={{ ...styles.badge, background:'#fbbf24' }}>{anomalies.length}</span>}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={styles.content}>
        {tab === 'Overview' && (
          <>
            <KpiCards kpis={kpis} machines={machines} />
            <PowerChart machines={machines} />
            <div style={styles.row}>
              <div style={{ flex:1 }}><AnomalyPanel anomalies={anomalies.slice(0,4)} /></div>
              <div style={{ flex:1 }}><AlertsPanel alerts={openAlerts.slice(0,4)} resolveAlert={resolveAlert} /></div>
            </div>
          </>
        )}
        {tab === 'Machines'      && <><KpiCards kpis={kpis} machines={machines} /><MachineTable machines={machines} /></>}
        {tab === 'Carbon'        && <><KpiCards kpis={kpis} machines={machines} /><CarbonTab machines={machines} kpis={kpis} /></>}
        {tab === 'Prediction'    && <><KpiCards kpis={kpis} machines={machines} /><PredictionTab kpis={kpis} /></>}
        {tab === 'Optimization'  && <><KpiCards kpis={kpis} machines={machines} /><OptimizationTab machines={machines} /></>}
        {tab === 'Anomalies'     && <><KpiCards kpis={kpis} machines={machines} /><AnomalyPanel anomalies={anomalies} /></>}
        {tab === 'Alerts'        && <><KpiCards kpis={kpis} machines={machines} /><AlertsPanel alerts={alerts} resolveAlert={resolveAlert} /></>}
      </div>

      <div style={styles.footer}>
        SFEAS · Node.js + Python ML + React · {new Date().getFullYear()} · Backend {connected?'✅':'❌'} · ML 🧠
      </div>
    </div>
  );
}

const styles = {
  app:         { minHeight:'100vh', background:'#0f1623', color:'#e2e8f0', fontFamily:"'Inter',system-ui,sans-serif" },
  header:      { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'20px 32px', background:'#1e2433', borderBottom:'1px solid #2d3748' },
  logo:        { fontSize:22, fontWeight:800, color:'#4f9cf9', letterSpacing:-0.5 },
  subtitle:    { fontSize:12, color:'#6b7280', marginTop:2 },
  headerRight: { display:'flex', alignItems:'center', gap:10 },
  dot:         { width:8, height:8, borderRadius:'50%' },
  connText:    { fontSize:12, color:'#9ca3af' },
  machineCount:{ background:'#2d3748', borderRadius:99, padding:'4px 12px', fontSize:12, color:'#9ca3af' },
  tabs:        { display:'flex', gap:2, padding:'0 32px', background:'#1e2433', borderBottom:'1px solid #2d3748', overflowX:'auto' },
  tabBtn:      { background:'none', border:'none', color:'#6b7280', padding:'14px 14px', cursor:'pointer', fontSize:13, borderBottom:'2px solid transparent', display:'flex', alignItems:'center', gap:6, whiteSpace:'nowrap' },
  tabActive:   { color:'#4f9cf9', borderBottomColor:'#4f9cf9' },
  badge:       { background:'#f87171', color:'#fff', borderRadius:99, padding:'1px 6px', fontSize:10, fontWeight:700 },
  content:     { padding:'24px 32px' },
  row:         { display:'flex', gap:16, flexWrap:'wrap' },
  footer:      { textAlign:'center', padding:16, color:'#374151', fontSize:11, borderTop:'1px solid #1e2433' },
};
