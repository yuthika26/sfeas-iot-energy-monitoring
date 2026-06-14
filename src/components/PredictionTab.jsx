// ── PredictionTab.jsx ─────────────────────────────────────────────────────────
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import axios from 'axios';

export default function PredictionTab({ kpis }) {
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3001/api/prediction')
      .then(r => setPrediction(r.data))
      .catch(() => {});
  }, []);

  const chartData = prediction?.hourly?.map((kw, i) => ({
    hour: `+${i}h`,
    kw,
    limit: 1000,
  })) || [];

  const riskColor = { high: '#f87171', medium: '#fbbf24', low: '#34d399' };

  return (
    <div>
      {/* Stat cards */}
      <div style={styles.grid3}>
        <div style={styles.card}>
          <div style={styles.label}>Current Load</div>
          <div style={{ ...styles.val, color: '#4f9cf9' }}>{kpis?.totalPower || 0} <span style={styles.unit}>kW</span></div>
          <div style={styles.sub}>Live factory demand</div>
        </div>
        <div style={styles.card}>
          <div style={styles.label}>Next Hour Peak</div>
          <div style={{ ...styles.val, color: '#fbbf24' }}>{prediction?.next1h || '—'} <span style={styles.unit}>kW</span></div>
          <div style={styles.sub}>Predicted demand</div>
        </div>
        <div style={styles.card}>
          <div style={styles.label}>Demand Limit</div>
          <div style={{ ...styles.val, color: '#f87171' }}>1000 <span style={styles.unit}>kW</span></div>
          <div style={styles.sub}>Contract threshold</div>
        </div>
      </div>

      {/* Forecast chart */}
      <div style={styles.panel}>
        <h3 style={styles.title}>36-Hour Demand Forecast</h3>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={chartData} margin={{ top:10, right:10, left:0, bottom:0 }}>
            <defs>
              <linearGradient id="demandGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#4f9cf9" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#4f9cf9" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="hour" tick={{ fill:'#8892a4', fontSize:10 }} interval={5} />
            <YAxis tick={{ fill:'#8892a4', fontSize:10 }} unit=" kW" domain={[0, 1200]} />
            <Tooltip contentStyle={{ background:'#1e2433', border:'1px solid #2d3748', borderRadius:8, fontSize:12 }} />
            <ReferenceLine y={1000} stroke="#f87171" strokeDasharray="4 4" label={{ value:'Limit', fill:'#f87171', fontSize:11 }} />
            <Area type="monotone" dataKey="kw" stroke="#4f9cf9" fill="url(#demandGrad)" strokeWidth={2} name="Demand (kW)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Peak windows */}
      <div style={styles.panel}>
        <h3 style={styles.title}>Peak Demand Windows</h3>
        <div style={styles.peakList}>
          {(prediction?.peakWindows || []).map((p, i) => (
            <div key={i} style={{ ...styles.peakCard, borderLeft:`3px solid ${riskColor[p.risk]}` }}>
              <div style={styles.peakLeft}>
                <div style={{ color: riskColor[p.risk], fontSize:10, fontWeight:700, marginBottom:4 }}>{p.risk.toUpperCase()} RISK</div>
                <div style={styles.peakTime}>{p.time}</div>
                <div style={styles.peakLabel}>{p.label}</div>
              </div>
              <div style={{ color: riskColor[p.risk], fontSize:24, fontWeight:700 }}>{p.kw} <span style={{ fontSize:12, color:'#6b7280' }}>kW</span></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  grid3:    { display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:16, marginBottom:20 },
  card:     { background:'#1e2433', borderRadius:12, padding:'18px 20px' },
  label:    { fontSize:11, color:'#8892a4', textTransform:'uppercase', letterSpacing:1, marginBottom:8 },
  val:      { fontSize:28, fontWeight:700, marginBottom:4 },
  unit:     { fontSize:14, fontWeight:400 },
  sub:      { fontSize:11, color:'#6b7280' },
  panel:    { background:'#1e2433', borderRadius:12, padding:20, marginBottom:20 },
  title:    { margin:'0 0 16px', fontSize:15, color:'#e2e8f0' },
  peakList: { display:'flex', flexDirection:'column', gap:10 },
  peakCard: { background:'#151c2c', borderRadius:8, padding:'14px 16px', display:'flex', justifyContent:'space-between', alignItems:'center' },
  peakLeft: { flex:1 },
  peakTime: { fontSize:15, fontWeight:600, color:'#e2e8f0', marginBottom:2 },
  peakLabel:{ fontSize:12, color:'#9ca3af' },
};
