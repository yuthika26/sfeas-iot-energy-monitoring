// ── CarbonTab.jsx ─────────────────────────────────────────────────────────────
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#4f9cf9','#a78bfa','#34d399','#fbbf24','#f87171','#fb923c','#60a5fa','#818cf8'];

export default function CarbonTab({ machines, kpis }) {
  // Department rollup
  const deptMap = {};
  machines.forEach(m => {
    if (!deptMap[m.dept]) deptMap[m.dept] = { dept: m.dept, co2: 0, power: 0, count: 0 };
    deptMap[m.dept].co2   += m.co2;
    deptMap[m.dept].power += m.power;
    deptMap[m.dept].count += 1;
  });
  const depts = Object.values(deptMap).sort((a,b) => b.co2 - a.co2);

  const totalCO2Rate = machines.reduce((s, m) => s + m.co2, 0);

  return (
    <div>
      {/* Top stat cards */}
      <div style={styles.grid3}>
        <div style={styles.card}>
          <div style={styles.cardLabel}>CO₂ Rate Now</div>
          <div style={{ ...styles.cardVal, color: '#34d399' }}>{totalCO2Rate.toFixed(0)} <span style={styles.unit}>kg/hr</span></div>
          <div style={styles.cardSub}>Emission factor: 0.82 kg/kWh</div>
        </div>
        <div style={styles.card}>
          <div style={styles.cardLabel}>CO₂ Today</div>
          <div style={{ ...styles.cardVal, color: '#a78bfa' }}>{kpis?.co2Today || 0} <span style={styles.unit}>tonnes</span></div>
          <div style={styles.cardSub}>≈ {kpis?.treesEquiv || 0} trees needed to offset</div>
        </div>
        <div style={styles.card}>
          <div style={styles.cardLabel}>Idle CO₂ Waste</div>
          <div style={{ ...styles.cardVal, color: '#f87171' }}>
            {machines.filter(m=>m.status==='idle').reduce((s,m)=>s+m.co2,0).toFixed(1)} <span style={styles.unit}>kg/hr</span>
          </div>
          <div style={styles.cardSub}>From {machines.filter(m=>m.status==='idle').length} idle machines</div>
        </div>
      </div>

      <div style={styles.row}>
        {/* Pie chart */}
        <div style={{ ...styles.panel, flex: 1 }}>
          <h3 style={styles.panelTitle}>CO₂ by Department</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={depts} dataKey="co2" nameKey="dept" cx="50%" cy="50%" outerRadius={90} label={({dept, percent}) => `${dept} ${(percent*100).toFixed(0)}%`} labelLine={false}>
                {depts.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v) => [`${v.toFixed(1)} kg/hr`, 'CO₂']} contentStyle={{ background: '#1e2433', border: '1px solid #2d3748', borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Department table */}
        <div style={{ ...styles.panel, flex: 1 }}>
          <h3 style={styles.panelTitle}>Department Breakdown</h3>
          <table style={styles.table}>
            <thead>
              <tr>{['Department','Machines','Power (kW)','CO₂ (kg/hr)','% of Total'].map(h=>(
                <th key={h} style={styles.th}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {depts.map((d, i) => (
                <tr key={d.dept} style={styles.tr}>
                  <td style={styles.td}><span style={{color: COLORS[i%COLORS.length], fontWeight:600}}>{d.dept}</span></td>
                  <td style={styles.td}>{d.count}</td>
                  <td style={styles.td}>{d.power.toFixed(1)}</td>
                  <td style={styles.td}>{d.co2.toFixed(1)}</td>
                  <td style={styles.td}>{totalCO2Rate > 0 ? ((d.co2/totalCO2Rate)*100).toFixed(1) : 0}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Machine CO2 list */}
      <div style={styles.panel}>
        <h3 style={styles.panelTitle}>CO₂ per Machine (kg/hr)</h3>
        <div style={styles.barList}>
          {[...machines].sort((a,b)=>b.co2-a.co2).map(m => (
            <div key={m.id} style={styles.barRow}>
              <div style={styles.barLabel}>{m.id} <span style={styles.barName}>{m.name}</span></div>
              <div style={styles.barTrack}>
                <div style={{ ...styles.barFill, width: `${Math.min(100,(m.co2/totalCO2Rate)*100*3)}%`, background: m.status==='fault'?'#f87171':m.status==='idle'?'#fbbf24':'#34d399' }} />
              </div>
              <div style={styles.barVal}>{m.co2.toFixed(1)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  grid3:     { display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:16, marginBottom:20 },
  card:      { background:'#1e2433', borderRadius:12, padding:'18px 20px' },
  cardLabel: { fontSize:11, color:'#8892a4', textTransform:'uppercase', letterSpacing:1, marginBottom:8 },
  cardVal:   { fontSize:28, fontWeight:700, marginBottom:4 },
  cardSub:   { fontSize:11, color:'#6b7280' },
  unit:      { fontSize:14, fontWeight:400 },
  row:       { display:'flex', gap:16, marginBottom:20, flexWrap:'wrap' },
  panel:     { background:'#1e2433', borderRadius:12, padding:20, marginBottom:20 },
  panelTitle:{ margin:'0 0 16px', fontSize:15, color:'#e2e8f0' },
  table:     { width:'100%', borderCollapse:'collapse', fontSize:13 },
  th:        { textAlign:'left', padding:'8px 10px', color:'#8892a4', borderBottom:'1px solid #2d3748', fontSize:11, textTransform:'uppercase' },
  tr:        { borderBottom:'1px solid #1a2030' },
  td:        { padding:'10px 10px', color:'#cbd5e1' },
  barList:   { display:'flex', flexDirection:'column', gap:8 },
  barRow:    { display:'flex', alignItems:'center', gap:10 },
  barLabel:  { width:120, fontSize:12, color:'#9ca3af', flexShrink:0 },
  barName:   { color:'#6b7280', fontSize:11 },
  barTrack:  { flex:1, height:8, background:'#2d3748', borderRadius:4, overflow:'hidden' },
  barFill:   { height:'100%', borderRadius:4, transition:'width 0.5s' },
  barVal:    { width:45, textAlign:'right', fontSize:12, color:'#9ca3af' },
};
