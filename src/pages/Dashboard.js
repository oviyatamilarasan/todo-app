import { useState } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis,
} from 'recharts';
import { useApp } from '../context/AppContext';
import Profile from '../components/Profile';
import Calendar from '../components/Calendar';
import './Dashboard.css';

/* ── colours ── */
const STATUS_COLORS = ['#10b981', '#f59e0b'];

/* Custom label rendered INSIDE each pie slice: shows the % */
const PieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.05) return null;
  const RAD = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + radius * Math.cos(-midAngle * RAD);
  const y = cy + radius * Math.sin(-midAngle * RAD);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central"
          fontSize={13} fontWeight={700}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

function Dashboard() {
  const { tasks, categories, getCategoryStats } = useApp();

  /* which view is currently shown in the "Task Status" card */
  const [statusView, setStatusView]   = useState('pie');   // 'pie' | 'bar'
  /* which view is shown in the "Priority Breakdown" card  */
  const [priorityView, setPriorityView] = useState('bar'); // 'bar' | 'pie'

  /* ── derived numbers ── */
  const total     = tasks.length;
  const completed = tasks.filter(t => t.done).length;
  const pending   = tasks.filter(t => !t.done).length;
  const high      = tasks.filter(t => t.priority === 'High').length;
  const completionPct = total ? Math.round((completed / total) * 100) : 0;

  /* ── chart data ── */
  const statusPieData = [
    { name: 'Completed', value: completed },
    { name: 'Pending',   value: pending   },
  ];

  const statusBarData = [
    { name: 'Completed', value: completed, fill: '#10b981' },
    { name: 'Pending',   value: pending,   fill: '#f59e0b' },
  ];

  const priorityData = [
    { name: 'High',   value: tasks.filter(t => t.priority === 'High').length,   fill: '#ef4444' },
    { name: 'Medium', value: tasks.filter(t => t.priority === 'Medium').length, fill: '#f59e0b' },
    { name: 'Low',    value: tasks.filter(t => t.priority === 'Low').length,    fill: '#10b981' },
  ];

  /* category breakdown */
  const categoryData = categories
    .map(c => ({ name: c.name, ...getCategoryStats(c.name), color: c.color }))
    .filter(c => c.total > 0);

  /* ── small toggle button component ── */
  const Toggle = ({ view, setView, opts }) => (
    <div className="chart-toggle">
      {opts.map(({ key, label }) => (
        <button
          key={key}
          className={view === key ? 'active' : ''}
          onClick={() => setView(key)}
        >
          {label}
        </button>
      ))}
    </div>
  );

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <h2 className="page-title">📊 Dashboard</h2>

        <Profile />

        {/* ── STAT CARDS ── */}
        <div className="stat-grid">
          <div className="stat-card" style={{ borderTop: '3px solid #667eea' }}>
            <span className="stat-icon">📋</span>
            <div className="stat-number">{total}</div>
            <div className="stat-label">Total Tasks</div>
          </div>
          <div className="stat-card" style={{ borderTop: '3px solid #10b981' }}>
            <span className="stat-icon">✅</span>
            <div className="stat-number" style={{ color: '#10b981' }}>{completed}</div>
            <div className="stat-label">Completed</div>
          </div>
          <div className="stat-card" style={{ borderTop: '3px solid #f59e0b' }}>
            <span className="stat-icon">⏳</span>
            <div className="stat-number" style={{ color: '#f59e0b' }}>{pending}</div>
            <div className="stat-label">Pending</div>
          </div>
          <div className="stat-card" style={{ borderTop: '3px solid #ef4444' }}>
            <span className="stat-icon">🔥</span>
            <div className="stat-number" style={{ color: '#ef4444' }}>{high}</div>
            <div className="stat-label">High Priority</div>
          </div>
        </div>

        {/* ── OVERALL PROGRESS BAR ── */}
        <div className="progress-card">
          <div className="progress-info">
            <span>Overall Completion</span>
            <span className="progress-pct">{completionPct}%</span>
          </div>
          <div className="overall-bar">
            <div
              className="overall-fill"
              style={{ width: `${completionPct}%` }}
            />
          </div>
          <div className="progress-sub">
            {completed} of {total} tasks completed
          </div>
        </div>

        {/* ── TWO CHART CARDS SIDE BY SIDE ── */}
        <div className="chart-row">

          {/* TASK STATUS (pie ↔ bar toggle) */}
          <div className="chart-card">
            <div className="chart-card-header">
              <h3>📈 Task Status</h3>
              <Toggle
                view={statusView}
                setView={setStatusView}
                opts={[{ key: 'pie', label: '🥧 Pie' }, { key: 'bar', label: '📊 Bar' }]}
              />
            </div>

            {statusView === 'pie' ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={statusPieData}
                    cx="50%" cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    labelLine={false}
                    label={PieLabel}
                  >
                    {statusPieData.map((_, i) => (
                      <Cell key={i} fill={STATUS_COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v, name) => [
                      `${v} tasks (${total ? Math.round((v / total) * 100) : 0}%)`,
                      name,
                    ]}
                    contentStyle={{ background: '#1a1a3e', border: 'none', borderRadius: 8 }}
                    itemStyle={{ color: 'white' }}
                  />
                  <Legend
                    formatter={(value) => (
                      <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
                        {value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={statusBarData} barSize={48}>
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" tick={{ fontSize: 12 }} />
                  <YAxis stroke="rgba(255,255,255,0.5)" tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip
                    formatter={(v, name) => [
                      `${v} (${total ? Math.round((v / total) * 100) : 0}%)`,
                      name,
                    ]}
                    contentStyle={{ background: '#1a1a3e', border: 'none', borderRadius: 8 }}
                    itemStyle={{ color: 'white' }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {statusBarData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}

            {/* Percentage summary pills */}
            <div className="status-pills">
              <span className="pill green">✅ {completionPct}% done</span>
              <span className="pill amber">⏳ {100 - completionPct}% left</span>
            </div>
          </div>

          {/* PRIORITY BREAKDOWN (bar ↔ pie toggle) */}
          <div className="chart-card">
            <div className="chart-card-header">
              <h3>🎯 Priority Breakdown</h3>
              <Toggle
                view={priorityView}
                setView={setPriorityView}
                opts={[{ key: 'bar', label: '📊 Bar' }, { key: 'pie', label: '🥧 Pie' }]}
              />
            </div>

            {priorityView === 'bar' ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={priorityData} barSize={48}>
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" tick={{ fontSize: 12 }} />
                  <YAxis stroke="rgba(255,255,255,0.5)" tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip
                    formatter={(v, name) => [
                      `${v} tasks (${total ? Math.round((v / total) * 100) : 0}%)`,
                      name,
                    ]}
                    contentStyle={{ background: '#1a1a3e', border: 'none', borderRadius: 8 }}
                    itemStyle={{ color: 'white' }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {priorityData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={priorityData}
                    cx="50%" cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    labelLine={false}
                    label={PieLabel}
                  >
                    {priorityData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v, name) => [
                      `${v} tasks (${total ? Math.round((v / total) * 100) : 0}%)`,
                      name,
                    ]}
                    contentStyle={{ background: '#1a1a3e', border: 'none', borderRadius: 8 }}
                    itemStyle={{ color: 'white' }}
                  />
                  <Legend
                    formatter={(value) => (
                      <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
                        {value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}

            {/* % breakdown pills */}
            <div className="status-pills">
              {priorityData.map((p) => (
                <span key={p.name} className="pill" style={{ background: `${p.fill}30`, border: `1px solid ${p.fill}80`, color: p.fill }}>
                  {p.name}: {total ? Math.round((p.value / total) * 100) : 0}%
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── CATEGORY BREAKDOWN ── */}
        {categoryData.length > 0 && (
          <div className="chart-card full-width" style={{ marginTop: 20 }}>
            <div className="chart-card-header">
              <h3>🗂️ Category Breakdown</h3>
            </div>
            <div className="category-breakdown">
              {categoryData.map((c) => (
                <div key={c.name} className="cat-breakdown-row">
                  <div className="cat-breakdown-label">
                    <span>{c.name}</span>
                    <span className="cat-breakdown-count">{c.total} tasks</span>
                  </div>
                  <div className="cat-breakdown-bar">
                    <div
                      className="cat-breakdown-fill"
                      style={{
                        width: `${c.total ? (c.completed / c.total) * 100 : 0}%`,
                        background: c.color,
                      }}
                    />
                  </div>
                  <span className="cat-breakdown-pct" style={{ color: c.color }}>
                    {c.total ? Math.round((c.completed / c.total) * 100) : 0}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── CALENDAR ── */}
        <div style={{ marginTop: 20 }}>
          <Calendar />
        </div>

      </div>
    </div>
  );
}

export default Dashboard;