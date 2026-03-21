import { useState, useEffect } from "react";
import '../../styles/dev.css';
import developerProfile from '../../assets/profile.webp';
import unimapLogo from '../../assets/logo.webp';
import mentorManish from '../../assets/DrMD.webp';
import mentorSaurabh from '../../assets/DrSA.webp';


const features = [
  { icon: "🔍", title: "Smart Search", desc: "Find any room, lab, or location instantly." },
  { icon: "🗺️", title: "Interactive Map", desc: "Clickable nodes for seamless exploration." },
  { icon: "⚡", title: "Real-Time Pathfinding", desc: "Shortest, most efficient routes on demand." },
  { icon: "🏢", title: "Multi-Floor Navigation", desc: "Navigate across floors and buildings." },
];

const mentors = [
  { initials: "MD", name: "Dr. Manish Dixit", role: "Professor & Head, CS", photo: mentorManish },
  { initials: "SA", name: "Dr. Saurabh Agarwal", role: "Assistant Professor", photo: mentorSaurabh },
];

export default function DevPage({ onBackToMap }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const timerId = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timerId);
  }, []);

  return (
    <div className="dev-page">
      <div className="dev-topbar">
        <button type="button" className="dev-back-btn" onClick={onBackToMap}>
          ← Back to Map
        </button>
      </div>

      {/* ── HERO ── */}
      <section className="hero">

        <div className="avatar-ring">
          <img src={developerProfile} alt="Developer profile" className="avatar-inner" />
        </div>

        <h1>Harshvardhan<br />Rawat</h1>
        <p className="hero-role">Computer Science & Design · 1st Year</p>
        <p className="hero-institution">📍 MITS-DU, Gwalior</p>

        <div className="hero-links">
          <a className="hero-link primary" href="https://linkedin.com/in/Harshvardhan-Rawat" target="_blank" rel="noreferrer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
            LinkedIn
          </a>
          <a className="hero-link ghost" href="https://github.com/HarshvardhanRawat" target="_blank" rel="noreferrer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
            GitHub
          </a>
          <a className="hero-link ghost" href="https://harshvardhanrawat.dev">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
            <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1 17.93V18a1 1 0 0 0-1-1H8v-2a1 1 0 0 0-1-1H4.07A8.018 8.018 0 0 1 4 12c0-.34.02-.673.07-1H6a1 1 0 0 0 1-1V8a1 1 0 0 0-.293-.707L5.05 5.636A7.98 7.98 0 0 1 12 4c.342 0 .68.021 1 .07V5a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V5.93c.952.283 1.82.757 2.56 1.374L17 8h-1a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h3.93c.05.327.07.66.07 1a8.018 8.018 0 0 1-.07 1H18a1 1 0 0 0-1 1v2h-2a1 1 0 0 0-1 1v1.93A8.026 8.026 0 0 1 11 19.93z" />
          </svg>
            Website
          </a>
        </div>

        <div className="scroll-hint">
          <div className="scroll-arrow" />
          scroll
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <main className="dev-section">

        {/* Project */}
        <div className="section-label">Featured Project</div>
        <h2 className="section-title">What I've built</h2>

        <div className="project-card">
          <div className="project-left">
            <div className="project-logo-box">
              <img src={unimapLogo} alt="UniMap Logo" className="project-logo-icon" />
            </div>
            <h3>Campus Navigator</h3>
            <p>Navigate your campus effortlessly with smart search, indoor routes, and quick destination guidance — built for MITS-DU Gwalior.</p>
          </div>

          <div className="project-right">
            {features.map(f => (
              <div key={f.title} className="feature-item">
                <span className="feature-icon">{f.icon}</span>
                <div>
                  <div className="feature-title">{f.title}</div>
                  <div className="feature-desc">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mentors */}
        <div className="mentors-section">
          <div className="mentors-label">Built under the guidance of</div>
          <div className="mentors-title">My Mentors</div>
          <div className="mentors-grid">
            {mentors.map((m) => (
              <div key={m.name} className="mentor-card">
                <div className="mentor-avatar">
                  {m.photo ? (
                    <img src={m.photo} alt={m.name} className="mentor-photo" />
                  ) : (
                    m.initials
                  )}
                </div>
                <div>
                  <div className="mentor-name">{m.name}</div>
                  <div className="mentor-role">{m.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feedback */}
        <div className="feedback-strip">
          <div>
            <h3>Leave a Suggestion or Report an Issue</h3>
            <p>Found a bug or have a suggestion? Let me know and I'll fix it or implement it as soon as possible.</p>
          </div>
          <a
            className="feedback-btn"
            href="https://forms.gle/iqhAWbbvWf2SDE2j9"
            target="_blank"
            rel="noreferrer"
          >
            ✍️ Give Feedback →
          </a>
        </div>

      </main>
    </div>
  );
}
