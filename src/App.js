import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState("");

  // Save to localStorage every time tasks change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (input.trim() === "") return;
    setTasks([...tasks, { text: input, done: false }]);
    setInput("");
  };

  const toggleTask = (index) => {
    const updated = tasks.map((task, i) =>
      i === index ? { ...task, done: !task.done } : task
    );
    setTasks(updated);
  };

  const deleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const completed = tasks.filter((t) => t.done).length;
  const pending = tasks.length - completed;

  return (
    <div className="bg">
      <div className="app">
        <h1>✅ Todo App</h1>
        <p className="subtitle">Stay organized, stay productive!</p>

        <div className="input-row">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            placeholder="Add a new task..."
          />
          <button className="add-btn" onClick={addTask}>+</button>
        </div>

        <div className="stats">
          <div className="stat-box">
            <div className="number">{tasks.length}</div>
            <div className="label">Total</div>
          </div>
          <div className="stat-box">
            <div className="number" style={{ color: "#f59e0b" }}>{pending}</div>
            <div className="label">Pending</div>
          </div>
          <div className="stat-box">
            <div className="number" style={{ color: "#10b981" }}>{completed}</div>
            <div className="label">Completed</div>
          </div>
        </div>

        <ul>
          {tasks.length === 0 && (
            <div className="empty">
              <span className="empty-icon">📋</span>
              No tasks yet! Add one above 👆
            </div>
          )}
          {tasks.map((task, i) => (
            <li key={i} className={task.done ? "done" : ""}>
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => toggleTask(i)}
                className="checkbox"
              />
              <span>{task.text}</span>
              <button className="delete-btn" onClick={() => deleteTask(i)}>🗑️</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;