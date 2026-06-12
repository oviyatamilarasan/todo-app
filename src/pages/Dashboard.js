import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';
import Profile from '../components/Profile';
import Calendar from '../components/Calendar';
import './Dashboard.css';

const COLORS = ['#10b981', '#f59e0b'];

function Dashboard() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('tasks');
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  const total = tasks.length;
  const completed = tasks.filter(t => t.done).length;
  const pending = tasks.filter(t => !t.done).length;
  const high = tasks.filter(t => t.priority === 'High').length;

  const pieData = [
    { name: 'Completed', value: completed || 0 },
    { name: 'Pending', value: pending || 0 },
  ];

  const barData = [
    { name: 'High', value: tasks.filter(t => t.priority === 'High').length },
    { name: 'Medium', value: tasks.filter(t => t.priority === 'Medium').length },
    { name: 'Low', value: tasks.filter(t => t.priority === 'Low').length },
  ];

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <h2 className="page-title">📊 Dashboard</h2>

        {/* Profile section */}
        <Profile />

        {/* Stats */}
        <div className="stat-grid">
          <div className="stat-card">
            <span className="stat-icon">📋</span>
            <div className="stat-number">{total}</div>
            <div className="stat-label">Total Tasks</div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">✅</span>
            <div className="stat-number" style={{ color: '#10b981' }}>{completed}</div>
            <div className="stat-label">Completed</div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">⏳</span>
            <div className="stat-number" style={{ color: '#f59e0b' }}>{pending}</div>
            <div className="stat-label">Pending</div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">🔥</span>
            <div className="stat-number" style={{ color: '#ef4444' }}>{high}</div>
            <div className="stat-label">High Priority</div>
          </div>
        </div>

        {/* Calendar first, then Charts */}
        <div className="charts-grid">
          <Calendar />

          <div className="chart-card">
            <h3>Task Status</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={70} dataKey="value" label>
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h3>Priority Breakdown</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={barData}>
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.6)" />
                <YAxis stroke="rgba(255,255,255,0.6)" />
                <Tooltip />
                <Bar dataKey="value" fill="#667eea" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;