import { useState, useEffect } from 'react';
import './Tasks.css';

function Tasks() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [category, setCategory] = useState('Personal');
  const [dueDate, setDueDate] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (input.trim() === '') return;
    const newTask = {
      text: input,
      description,
      priority,
      category,
      dueDate,
      done: false,
      createdAt: new Date().toLocaleDateString(),
    };
    if (editIndex !== null) {
      const updated = tasks.map((t, i) =>
        i === editIndex ? { ...t, ...newTask } : t
      );
      setTasks(updated);
      setEditIndex(null);
    } else {
      setTasks([...tasks, newTask]);
    }
    clearForm();
    setShowForm(false);
  };

  const clearForm = () => {
    setInput('');
    setDescription('');
    setPriority('Medium');
    setCategory('Personal');
    setDueDate('');
  };

  const editTask = (index) => {
    const task = tasks[index];
    setInput(task.text);
    setDescription(task.description || '');
    setPriority(task.priority || 'Medium');
    setCategory(task.category || 'Personal');
    setDueDate(task.dueDate || '');
    setEditIndex(index);
    setShowForm(true);
  };

  const deleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const toggleTask = (index) => {
    const updated = tasks.map((t, i) =>
      i === index ? { ...t, done: !t.done } : t
    );
    setTasks(updated);
  };

  const filtered = tasks.filter(task => {
    const matchSearch = task.text.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === 'All' ? true :
      filter === 'Completed' ? task.done :
      !task.done;
    return matchSearch && matchFilter;
  });

  const priorityColor = (p) => {
    if (p === 'High') return '#ef4444';
    if (p === 'Medium') return '#f59e0b';
    return '#10b981';
  };

  return (
    <div className="tasks-page">
      <div className="tasks-container">

        {/* HEADER ROW */}
        <div className="tasks-header">
          <h2 className="page-title">📋 Tasks</h2>
          <button
            className="new-task-btn"
            onClick={() => {
              if (showForm) {
                setShowForm(false);
                clearForm();
                setEditIndex(null);
              } else {
                setShowForm(true);
              }
            }}
          >
            {showForm ? '✕ Close' : '+ New Task'}
          </button>
        </div>

        {/* FORM */}
        {showForm && (
          <div className="task-form">
            <input
              placeholder="Task title *"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
              autoFocus
            />
            <textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="form-row">
              <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option>Work</option>
                <option>Personal</option>
                <option>Study</option>
                <option>Shopping</option>
              </select>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            <button className="save-btn" onClick={addTask}>
              {editIndex !== null ? '✅ Update Task' : '✅ Add Task'}
            </button>
          </div>
        )}

        {/* SEARCH & FILTER */}
        <div className="search-filter-row">
          <input
            className="search-input"
            placeholder="🔍 Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="filter-btns">
            {['All', 'Pending', 'Completed'].map(f => (
              <button
                key={f}
                className={filter === f ? 'active' : ''}
                onClick={() => setFilter(f)}
              >{f}</button>
            ))}
          </div>
        </div>

        {/* TASK LIST */}
        <ul className="task-list">
          {filtered.length === 0 && (
            <div className="empty">
              <span>📭</span>
              <p>No tasks found!</p>
            </div>
          )}
          {filtered.map((task, i) => (
            <li key={i} className={task.done ? 'done' : ''}>
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => toggleTask(tasks.indexOf(task))}
              />
              <div className="task-info">
                <div className="task-title">{task.text}</div>
                {task.description && (
                  <div className="task-desc">{task.description}</div>
                )}
                <div className="task-meta">
                  <span className="badge" style={{ background: priorityColor(task.priority) }}>
                    {task.priority}
                  </span>
                  <span className="badge category">{task.category}</span>
                  {task.dueDate && (
                    <span className="due">📅 {task.dueDate}</span>
                  )}
                </div>
              </div>
              <div className="task-actions">
                <button className="edit-btn" onClick={() => editTask(tasks.indexOf(task))}>✏️</button>
                <button className="del-btn" onClick={() => deleteTask(tasks.indexOf(task))}>🗑️</button>
              </div>
            </li>
          ))}
        </ul>

      </div>
    </div>
  );
}

export default Tasks;