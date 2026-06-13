import { useState } from 'react';
import { useApp } from '../context/AppContext';
import './Calendar.css';

function Calendar() {
  const { tasks } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  const prevMonth = () => { setCurrentDate(new Date(year, month - 1, 1)); setSelectedDate(null); };
  const nextMonth = () => { setCurrentDate(new Date(year, month + 1, 1)); setSelectedDate(null); };

  const formatDate = (d) => {
    const m = String(month + 1).padStart(2, '0');
    const day = String(d).padStart(2, '0');
    return `${year}-${m}-${day}`;
  };

  const tasksForDate = (dateStr) => tasks.filter(t => t.dueDate === dateStr);

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="calendar-card">
      <div className="calendar-header">
        <button onClick={prevMonth}>◀</button>
        <h3>{monthNames[month]} {year}</h3>
        <button onClick={nextMonth}>▶</button>
      </div>

      <div className="calendar-grid">
        {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
          <div className="calendar-dayname" key={d}>{d}</div>
        ))}
        {cells.map((d, i) => {
          if (!d) return <div className="calendar-cell empty" key={i}></div>;
          const dateStr = formatDate(d);
          const dayTasks = tasksForDate(dateStr);
          const isToday = dateStr === todayStr;
          const isSelected = dateStr === selectedDate;
          return (
            <div
              key={i}
              className={`calendar-cell ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${dayTasks.length ? 'has-tasks' : ''}`}
              onClick={() => setSelectedDate(dateStr)}
            >
              <span>{d}</span>
              {dayTasks.length > 0 && <div className="task-dot"></div>}
            </div>
          );
        })}
      </div>

      {selectedDate && (
        <div className="calendar-tasks">
          <h4>📅 Tasks on {selectedDate}</h4>
          {tasksForDate(selectedDate).length === 0 ? (
            <p className="no-task-text">No tasks due this day 🎉</p>
          ) : (
            <ul>
              {tasksForDate(selectedDate).map((t, i) => (
                <li key={i} className={t.done ? 'done' : ''}>
                  <span
                    className="dot-priority"
                    style={{
                      background:
                        t.priority === 'High' ? '#ef4444' :
                        t.priority === 'Medium' ? '#f59e0b' : '#10b981'
                    }}
                  ></span>
                  {t.text}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default Calendar;