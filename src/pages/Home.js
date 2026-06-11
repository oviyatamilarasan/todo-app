import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const navigate = useNavigate();

  const hour = new Date().getHours();

  let greeting = "";
  let emoji = "";

  if (hour >= 5 && hour < 12) {
    greeting = "Good Morning";
    emoji = "☀️";
  } else if (hour >= 12 && hour < 17) {
    greeting = "Good Afternoon";
    emoji = "🌤️";
  } else if (hour >= 17 && hour < 21) {
    greeting = "Good Evening";
    emoji = "🌇";
  } else {
    greeting = "Good Night";
    emoji = "🌙";
  }

  return (
    <div className="home-wrapper">
      <div className="home">
        <div className="home-card">
          <div className="home-icon">📝</div>
          <h2 className="greeting">
            {emoji} {greeting}
          </h2>

        <p className="date">
            {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
        })}
        </p>

          

          <h1>Welcome to TodoApp</h1>

          <p>
            Stay organized, focused and productive every single day.
            Manage your tasks with ease!
          </p>

          <div className="home-features">
            <div className="feature">
              <span>✅</span>
              <p>Track your tasks</p>
            </div>
            <div className="feature">
              <span>📊</span>
              <p>View progress</p>
            </div>
            <div className="feature">
              <span>🗂️</span>
              <p>Organize by category</p>
            </div>
            <div className="feature">
              <span>🔍</span>
              <p>Search & filter</p>
            </div>
          </div>

          <button
            className="get-started-btn"
            onClick={() => navigate('/tasks')}
          >
            Get Started 🚀
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;