import './About.css';

function About() {
  return (
    <div className="about-wrapper">
    <div className="about">
      <h2 className="page-title">ℹ️ About</h2>
      <div className="about-card">
        <div className="about-icon">📝</div>
        <h3>TodoApp</h3>
        <p>A beautiful multi-page task manager built with React. Designed to help you stay organized and productive every day.</p>

        <div className="about-grid">
          <div className="about-item">
            <span>⚛️</span>
            <p>Built with React</p>
          </div>
          <div className="about-item">
            <span>🗄️</span>
            <p>localStorage</p>
          </div>
          <div className="about-item">
            <span>📊</span>
            <p>Recharts</p>
          </div>
          <div className="about-item">
            <span>🎨</span>
            <p>Glassmorphism UI</p>
          </div>
        </div>

        <div className="about-version">
          <p>Version 1.0.0</p>
          <p>Built by <strong>Oviya Tamilarasan</strong> 💜</p>
          <p>Daily improved on GitHub 🚀</p>
        </div>
      </div>
    </div>
    </div>
  );
}

export default About;