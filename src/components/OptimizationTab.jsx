// ── OptimizationTab.jsx ───────────────────────────────────────────────────────
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ACTION_COLOR = {
  'Schedule Shutdown': '#34d399',
  'Alert Maintenance': '#f87171',
  'Generate Schedule': '#4f9cf9',
  'Apply Rule':        '#a78bfa',
  'Configure':         '#fbbf24',
  'Get Estimate':      '#60a5fa',
};

export default function OptimizationTab({ machines }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3001/api/optimization')
      .then(r => setData(r.data))
      .catch(() => {});
  }, [machines]);

  const totalCO2Save = data?.recommendations?.reduce((s,r) => s + (r.co2Save||0), 0) || 0;

  return (
    <div>
      {/* Summary cards */}
      <div style={styles.grid3}>
        <div style={styles.card}>
          <div style={styles.label}>Potential Saving</div>
          <div style={{ ...styles.val, color:'#34d399' }}>{data?.potentialSavingPerDay || '—'}</div>
          <div style={styles.sub}>Per day across all measures</div>
        </div>
        <div style={styles.card}>
          <div style={styles.label}>CO₂ Reducible</div>
          <div style={{ ...styles.val, color:'#a78bfa' }}>{totalCO2Save} <span style={{ fontSize:14 }}>kg/day</span></div>
          <div style={styles.sub}>From recommended actions</div>
        </div>
        <div style={styles.card}>
          <div style={styles.label}>Idle Waste</div>
          <div style={{ ...styles.val, color:'#f87171' }}>{data?.idleWasteKW || 0} <span style={{ fontSize:14 }}>kW</span></div>
          <div style={styles.sub}>From {machines.filter(m=>m.status==='idle').length} idle machines</div>
        </div>
      </div>

      {/* Recommendations */}
      <div style={styles.panel}>
        <h3 style={styles.title}>Cost Optimization Recommendations</h3>
        <div style={styles.recList}>
          {(data?.recommendations || []).map((r, i) => (
            <div key={r.id} style={styles.recCard}>
              <div style={styles.recNum}>{i+1}</div>
              <div style={styles.recBody}>
                <div style={styles.recTitle}>{r.title}</div>
                <div style={styles.recDesc}>{r.desc}</div>
                <div style={styles.recMeta}>
                  <span style={styles.co2Badge}>🌱 {r.co2Save} kg CO₂/day saved</span>
                </div>
              </div>
              <div style={styles.recRight}>
                <div style={styles.saving}>{r.saving}</div>
                <button style={{ ...styles.actionBtn, background: (ACTION_COLOR[r.action]||'#4f9cf9')+'22', color: ACTION_COLOR[r.action]||'#4f9cf9', border:`1px solid ${ACTION_COLOR[r.action]||'#4f9cf9'}44` }}>
                  {r.action}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Idle machines quick view */}
      {machines.filter(m=>m.status==='idle').length > 0 && (
        <div style={styles.panel}>
          <h3 style={styles.title}>⚠️ Idle Machines — Shutdown Candidates</h3>
          <div style={styles.idleList}>
            {machines.filter(m=>m.status==='idle').map(m => (
              <div key={m.id} style={styles.idleCard}>
                <div>
                  <div style={styles.idleName}>{m.name}</div>
                  <div style={styles.idleDept}>{m.dept} · {m.id}</div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={styles.idlePower}>{m.power.toFixed(1)} kW wasted</div>
                  <div style={styles.idleCO2}>{m.co2.toFixed(1)} kg CO₂/hr</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  grid3:     { display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:16, marginBottom:20 },
  card:      { background:'#1e2433', borderRadius:12, padding:'18px 20px' },
  label:     { fontSize:11, color:'#8892a4', textTransform:'uppercase', letterSpacing:1, marginBottom:8 },
  val:       { fontSize:28, fontWeight:700, marginBottom:4 },
  sub:       { fontSize:11, color:'#6b7280' },
  panel:     { background:'#1e2433', borderRadius:12, padding:20, marginBottom:20 },
  title:     { margin:'0 0 16px', fontSize:15, color:'#e2e8f0' },
  recList:   { display:'flex', flexDirection:'column', gap:12 },
  recCard:   { background:'#151c2c', borderRadius:8, padding:'14px 16px', display:'flex', alignItems:'flex-start', gap:14 },
  recNum:    { width:28, height:28, borderRadius:'50%', background:'#2d3748', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color:'#9ca3af', flexShrink:0 },
  recBody:   { flex:1 },
  recTitle:  { fontSize:14, fontWeight:600, color:'#e2e8f0', marginBottom:4 },
  recDesc:   { fontSize:12, color:'#9ca3af', marginBottom:6 },
  recMeta:   { display:'flex', gap:8 },
  co2Badge:  { fontSize:11, color:'#34d399', background:'#34d39918', border:'1px solid #34d39933', borderRadius:99, padding:'2px 8px' },
  recRight:  { textAlign:'right', flexShrink:0 },
  saving:    { fontSize:18, fontWeight:700, color:'#34d399', marginBottom:8 },
  actionBtn: { fontSize:11, fontWeight:600, padding:'5px 12px', borderRadius:6, cursor:'pointer', whiteSpace:'nowrap' },
  idleList:  { display:'flex', flexDirection:'column', gap:8 },
  idleCard:  { background:'#151c2c', borderRadius:8, padding:'12px 16px', display:'flex', justifyContent:'space-between', alignItems:'center' },
  idleName:  { fontSize:14, fontWeight:600, color:'#e2e8f0', marginBottom:2 },
  idleDept:  { fontSize:12, color:'#6b7280' },
  idlePower: { fontSize:13, fontWeight:600, color:'#fbbf24' },
  idleCO2:   { fontSize:11, color:'#6b7280' },
};
