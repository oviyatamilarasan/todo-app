import { useState } from 'react';
import { useApp } from '../context/AppContext';
import './Tasks.css';

function Tasks() {
  // Centralized task & category state coming from Context API
  const {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    categories,
    defaultCategory,
  } = useApp();

  const [input, setInput] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [category, setCategory] = useState(defaultCategory);
  const [dueDate, setDueDate] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const clearForm = () => {
    setInput('');
    setDescription('');
    setPriority('Medium');
    setCategory(defaultCategory);
    setDueDate('');
  };

  const handleSave = () => {
    if (input.trim() === '') return;

    const taskData = {
      text: input,
      description,
      priority,
      category,
      dueDate,
    };

    if (editIndex !== null) {
      updateTask(editIndex, taskData);
      setEditIndex(null);
    } else {
      addTask(taskData);
    }

    clearForm();
    setShowForm(false);
  };

  const editTask = (index) => {
    const task = tasks[index];
    setInput(task.text);
    setDescription(task.description || '');
    setPriority(task.priority || 'Medium');
    // Fall back to the default category in case the task's original
    // category was renamed/deleted in a way that no longer matches.
    setCategory(
      categories.some((c) => c.name === task.category) ? task.category : defaultCategory
    );
    setDueDate(task.dueDate || '');
    setEditIndex(index);
    setShowForm(true);
  };

  const filtered = tasks.filter((task) => {
    const matchSearch = task.text.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === 'All' ? true : filter === 'Completed' ? task.done : !task.done;
    return matchSearch && matchFilter;
  });

  const priorityColor = (p) => {
    if (p === 'High') return '#ef4444';
    if (p === 'Medium') return '#f59e0b';
    return '#10b981';
  };

  // Look up a category's color by name so task badges stay in sync
  // with whatever color the user picked on the Categories page.
  const categoryColor = (name) => categories.find((c) => c.name === name)?.color;

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
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
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

              {/* Category dropdown is now fully dynamic - it reflects
                  whatever categories exist in the shared Context state. */}
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>

              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            <button className="save-btn" onClick={handleSave}>
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
            {['All', 'Pending', 'Completed'].map((f) => (
              <button
                key={f}
                className={filter === f ? 'active' : ''}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
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
          {filtered.map((task, i) => {
            const realIndex = tasks.indexOf(task);
            return (
              <li key={realIndex} className={task.done ? 'done' : ''}>
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => toggleTask(realIndex)}
                />
                <div className="task-info">
                  <div className="task-title">{task.text}</div>
                  {task.description && (
                    <div className="task-desc">{task.description}</div>
                  )}
                  <div className="task-meta">
                    <span
                      className="badge"
                      style={{ background: priorityColor(task.priority) }}
                    >
                      {task.priority}
                    </span>
                    <span
                      className="badge category"
                      style={
                        categoryColor(task.category)
                          ? { background: categoryColor(task.category) }
                          : undefined
                      }
                    >
                      {task.category}
                    </span>
                    {task.dueDate && <span className="due">📅 {task.dueDate}</span>}
                  </div>
                </div>
                <div className="task-actions">
                  <button className="edit-btn" onClick={() => editTask(realIndex)}>
                    ✏️
                  </button>
                  <button className="del-btn" onClick={() => deleteTask(realIndex)}>
                    🗑️
                  </button>
                </div>
              </li>
            );
          })}
        </ul>

      </div>
    </div>
  );
}

export default Tasks;