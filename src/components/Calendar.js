import { useState } from 'react';
import { useApp } from '../context/AppContext';
import './Calendar.css';

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];
const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function Calendar() {
  const { tasks } = useApp();
  const [current, setCurrent]   = useState(new Date());
  const [selected, setSelected] = useState(null);

  const year  = current.getFullYear();
  const month = current.getMonth();

  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth    = new Date(year, month + 1, 0).getDate();

  const todayStr = (() => {
    const t = new Date();
    return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2,'0')}-${String(t.getDate()).padStart(2,'0')}`;
  })();

  const toDateStr = (d) =>
    `${year}-${String(month + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;

  const tasksOn = (dateStr) => tasks.filter(t => t.dueDate === dateStr);

  /* build grid cells: leading empty slots then day numbers */
  const cells = [
    ...Array(firstDayOfWeek).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const prev = () => { setCurrent(new Date(year, month - 1, 1)); setSelected(null); };
  const next = () => { setCurrent(new Date(year, month + 1, 1)); setSelected(null); };

  const selectedTasks = selected ? tasksOn(selected) : [];

  return (
    <div className="cal-card">

      {/* ── header ── */}
      <div className="cal-header">
        <button className="cal-nav" onClick={prev}>‹</button>
        <span className="cal-title">{MONTH_NAMES[month]} {year}</span>
        <button className="cal-nav" onClick={next}>›</button>
      </div>

      {/* ── day-name row ── */}
      <div className="cal-grid">
        {DAY_NAMES.map(d => (
          <div key={d} className="cal-dayname">{d}</div>
        ))}

        {/* ── date cells ── */}
        {cells.map((d, i) => {
          if (!d) return <div key={`e-${i}`} className="cal-cell empty" />;
          const ds = toDateStr(d);
          const dayTasks  = tasksOn(ds);
          const isToday   = ds === todayStr;
          const isSel     = ds === selected;
          const hasTasks  = dayTasks.length > 0;
          const hasDone   = dayTasks.some(t => t.done);
          const hasHigh   = dayTasks.some(t => t.priority === 'High' && !t.done);

          return (
            <div
              key={ds}
              className={[
                'cal-cell',
                isToday  ? 'today'    : '',
                isSel    ? 'selected' : '',
                hasTasks ? 'has-tasks': '',
              ].join(' ')}
              onClick={() => setSelected(isSel ? null : ds)}
            >
              <span className="cal-day-num">{d}</span>
              {hasTasks && (
                <span
                  className="cal-dot"
                  style={{ background: hasHigh ? '#ef4444' : hasDone ? '#10b981' : '#f59e0b' }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* ── task list for selected date ── */}
      {selected && (
        <div className="cal-tasks">
          <div className="cal-tasks-header">
            <span>📅 {selected}</span>
            <button className="cal-close" onClick={() => setSelected(null)}>✕</button>
          </div>

          {selectedTasks.length === 0 ? (
            <p className="cal-empty">No tasks due — enjoy the day! 🎉</p>
          ) : (
            <ul className="cal-task-list">
              {selectedTasks.map((t, i) => (
                <li key={i} className={t.done ? 'done' : ''}>
                  <span
                    className="cal-priority-dot"
                    style={{
                      background:
                        t.priority === 'High'   ? '#ef4444' :
                        t.priority === 'Medium' ? '#f59e0b' : '#10b981',
                    }}
                  />
                  <span className="cal-task-text">{t.text}</span>
                  {t.done && <span className="cal-done-badge">✓</span>}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* ── legend ── */}
      <div className="cal-legend">
        <span><i style={{ background: '#ef4444' }} /> High priority pending</span>
        <span><i style={{ background: '#f59e0b' }} /> Pending</span>
        <span><i style={{ background: '#10b981' }} /> All done</span>
      </div>
    </div>
  );
}

export default Calendar;