import { useState, useEffect } from 'react';
import './Categories.css';

const CATEGORIES = [
  { name: 'Work', icon: '💼', color: '#667eea' },
  { name: 'Personal', icon: '👤', color: '#f59e0b' },
  { name: 'Study', icon: '📚', color: '#10b981' },
  { name: 'Shopping', icon: '🛒', color: '#ef4444' },
];

function Categories() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('tasks');
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  return (
<div className="categories-wrapper">
    <div className="categories">
      <h2 className="page-title">🗂️ Categories</h2>
      <div className="category-grid">
        {CATEGORIES.map((cat) => {
          const catTasks = tasks.filter(t => t.category === cat.name);
          const completed = catTasks.filter(t => t.done).length;
          return (
            <div className="category-card" key={cat.name}
              style={{ borderTop: `4px solid ${cat.color}` }}>
              <div className="cat-header">
                <span className="cat-icon">{cat.icon}</span>
                <h3>{cat.name}</h3>
                <span className="cat-count">{catTasks.length} tasks</span>
              </div>
              <div className="cat-progress">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: catTasks.length ? `${(completed / catTasks.length) * 100}%` : '0%',
                      background: cat.color
                    }}
                  />
                </div>
                <span>{completed}/{catTasks.length} done</span>
              </div>
              <ul className="cat-tasks">
                {catTasks.length === 0 && (
                  <p className="no-tasks">No tasks here!</p>
                )}
                {catTasks.slice(0, 4).map((task, i) => (
                  <li key={i} className={task.done ? 'done' : ''}>
                    <span className="dot" style={{ background: cat.color }}></span>
                    {task.text}
                  </li>
                ))}
                {catTasks.length > 4 && (
                  <p className="more">+{catTasks.length - 4} more tasks</p>
                )}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
    </div>
  );
}

export default Categories;