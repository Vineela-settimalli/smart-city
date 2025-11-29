import React from 'react';
import { HashRouter, Routes, Route, NavLink } from 'react-router-dom';

/* -----------------------
   Minimal auth helpers
   ----------------------- */
const AUTH_KEY = 'smartcity-auth';
function isAuthenticated() {
  return !!localStorage.getItem(AUTH_KEY);
}
function storeAuth(email) {
  localStorage.setItem(AUTH_KEY, JSON.stringify({ email, token: 'demo-token', loggedAt: Date.now() }));
}
function clearAuth() {
  localStorage.removeItem(AUTH_KEY);
}

/* ---------- App (merged with Login) ---------- */
export default function App() {
  // local auth state: show login if not authenticated
  const [auth, setAuth] = React.useState(() => isAuthenticated());

  if (!auth) {
    return <Login onSuccess={() => setAuth(true)} />;
  }

  return (
    <HashRouter>
      <div className="app">
        <Sidebar onLogout={() => { clearAuth(); setAuth(false); }} />
        <MainPanel />
      </div>
    </HashRouter>
  );
}

/* ---------- Login Component (minimal, demo) ---------- */
function Login({ onSuccess }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  function validate() {
    setError('');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return false;
    }
    return true;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    // simulate network delay
    await new Promise(r => setTimeout(r, 350));
    storeAuth(email.trim());
    setLoading(false);
    onSuccess && onSuccess();
  }

  return (
    <div className="page login-page" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="login-card" style={{ width: 420, borderRadius: 10, padding: 20 }}>
        <h2>SmartCity — Login</h2>
        <p className="muted">Sign in to manage or report city issues.</p>

        <form onSubmit={handleSubmit} style={{ marginTop: 12 }}>
          <label style={{ display: 'block', marginBottom: 10 }}>
            <div className="label">Email</div>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ddd' }}
              autoFocus
            />
          </label>

          <label style={{ display: 'block', marginBottom: 10 }}>
            <div className="label">Password</div>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ddd' }}
            />
          </label>

          {error && <div style={{ color: '#b00020', marginBottom: 8 }}>{error}</div>}

          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" className="btn primary" style={{ flex: 1 }} disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
            <button
              type="button"
              className="btn ghost"
              style={{ flex: 1 }}
              onClick={() => { setEmail(''); setPassword(''); setError(''); }}
              disabled={loading}
            >
              Clear
            </button>
          </div>

          <div style={{ marginTop: 10, fontSize: 13, color: '#666' }}>
            Demo: use any valid email and a password ≥ 6 chars.
          </div>
        </form>
      </div>
    </div>
  );
}

/* ---------- Sidebar ---------- */
function Sidebar({ onLogout }) {
  const [open, setOpen] = React.useState(true);

  return (
    <aside className={`sidebar ${open ? 'open' : 'collapsed'}`}>
      <div className="brand">
        <div className="logo">🏙</div>
        <div className="title">SmartCity</div>
      </div>

      <nav className="menu">
        <NavLink to="/" className="menu-link" end>
          Home
        </NavLink>
        <NavLink to="/services" className="menu-link">
          Services
        </NavLink>
        <NavLink to="/report" className="menu-link">
          Report Issue
        </NavLink>
        <NavLink to="/admin" className="menu-link">
          Admin
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <button className="btn ghost" onClick={() => setOpen(s => !s)}>
          {open ? 'Collapse' : 'Expand'}
        </button>

        <button
          className="btn"
          onClick={() => {
            // trigger logout handed from parent
            if (onLogout) onLogout();
            else { clearAuth(); window.location.reload(); }
          }}
        >
          Logout
        </button>
      </div>
    </aside>
  );
}

/* ---------- Main panel + routes ---------- */
function MainPanel() {
  return (
    <main className="main">
      <header className="topbar">
        <div className="search">
          <input placeholder="Search services or issues..." />
        </div>
        <div className="profile">Hello, Guest</div>
      </header>

      <section className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/report" element={<ReportIssueModalLauncher />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </section>

      <footer className="footer">
        <small>© {new Date().getFullYear()} SmartCity — Demo</small>
      </footer>
    </main>
  );
}

/* ---------- Home ---------- */
function Home() {
  return (
    <div className="page">
      <div className="hero">
        <div>
          <h1>Welcome to SmartCity Portal</h1>
          <p className="muted">Access public services, report issues and interact with city authorities.</p>
          <div className="hero-actions">
            <a className="btn primary" href="#services">Explore services</a>
            <a className="btn" href="#report">Report an issue</a>
          </div>
        </div>

        <div className="hero-cards">
          <div className="info-card">
            <h4>Public Services</h4>
            <p>Water, Electricity, Waste & Transit updates.</p>
          </div>
          <div className="info-card">
            <h4>Infrastructure</h4>
            <p>Roads, Street-lights, Bridges — real-time status.</p>
          </div>
          <div className="info-card">
            <h4>Citizen Interaction</h4>
            <p>Submit issues and track them end-to-end.</p>
          </div>
        </div>
      </div>

      <section id="services" className="section">
        <h2>Featured Services</h2>
        <ServiceGrid />
      </section>
    </div>
  );
}

/* ---------- Services Component ---------- */
function Services() {
  const services = [
    { id: 1, name: 'Water Supply', desc: 'Distribution schedule & updates.' },
    { id: 2, name: 'Electricity', desc: 'Scheduled outages and notices.' },
    { id: 3, name: 'Waste Management', desc: 'Pickup schedule & recycling.' },
    { id: 4, name: 'Roads & Transport', desc: 'Roadworks and transit alerts.' },
    { id: 5, name: 'Public Safety', desc: 'Police, emergency contacts and safety alerts.' },
    { id: 6, name: 'Healthcare Services', desc: 'Nearby hospitals, clinics and health camps.' },
    { id: 7, name: 'Street Lighting', desc: 'Faulty streetlights and maintenance updates.' },
    { id: 8, name: 'Parks & Recreation', desc: 'Park timings, cleanliness and events.' },
    { id: 9, name: 'Drainage & Sewage', desc: 'Drainage cleaning, blockages and updates.' },
    { id: 10, name: 'Public Transport', desc: 'Bus routes, timings and service changes.' }
  ];

  return (
    <div className="page">
      <h2>All Services</h2>
      <div className="grid">
        {services.map(s => (
          <div key={s.id} className="service-card">
            <h3>{s.name}</h3>
            <p className="muted">{s.desc}</p>
            <div className="card-actions">
              <button className="btn small">View</button>
              <button className="btn ghost small">Report</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- ServiceGrid (used in Home) ---------- */
function ServiceGrid() {
  const services = [
    { id: 1, name: 'Water Supply', status: 'Normal', desc: 'Distribution schedule & updates.' },
    { id: 2, name: 'Electricity', status: 'Maintenance', desc: 'Scheduled outages and notices.' },
    { id: 3, name: 'Waste Management', status: 'Normal', desc: 'Pickup schedule & recycling.' },
    { id: 4, name: 'Roads & Transport', status: 'In Progress', desc: 'Roadworks and transit alerts.' },
    { id: 5, name: 'Street Lighting', status: 'Normal', desc: 'Streetlight repair & monitoring.' },
    { id: 6, name: 'Healthcare Services', status: 'Normal', desc: 'Hospitals, clinics & health help.' },
    { id: 7, name: 'Public Safety', status: 'Alert', desc: 'Emergencies and police alerts.' },
    { id: 8, name: 'Drainage & Sewage', status: 'In Progress', desc: 'Drainage cleanup & reports.' },
    { id: 9, name: 'Parks & Recreation', status: 'Normal', desc: 'Park status and activities.' },
    { id: 10, name: 'Public Transport', status: 'Maintenance', desc: 'Service interruptions & updates.' }
  ];

  return (
    <div className="grid">
      {services.map(s => {
        // safe className for pill (no spaces, lowercased)
        const safeStatusClass = s.status.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
        return (
          <article key={s.id} className="service-card" tabIndex={0}>
            <div className="card-head">
              <h3>{s.name}</h3>
              <span className={`pill ${safeStatusClass}`} style={pillStyle(s.status)}>
                {s.status}
              </span>
            </div>
            <p className="muted">{s.desc}</p>
            <div className="card-actions">
              <button className="btn small">View</button>
              <button className="btn ghost small">Report</button>
            </div>
          </article>
        );
      })}
    </div>
  );
}

/* ---------- Report Issue ---------- */
function ReportIssueModalLauncher() {
  const [open, setOpen] = React.useState(true);
  return (
    <div className="page">
      <h2>Report an Issue</h2>
      <p className="muted">Describe the problem and optionally add location / contact.</p>
      <div style={{ marginTop: 12 }}>
        <button className="btn primary" onClick={() => setOpen(true)}>Open Report Form</button>
      </div>
      {open && <ReportIssueModal onClose={() => setOpen(false)} />}
    </div>
  );
}

function ReportIssueModal({ onClose }) {
  const [title, setTitle] = React.useState('');
  const [desc, setDesc] = React.useState('');
  const [loc, setLoc] = React.useState('');
  const [saved, setSaved] = React.useState(false);

  function submit(e) {
    e.preventDefault();
    if (!title.trim() || !desc.trim()) {
      alert('Please add title and description.');
      return;
    }
    const issues = JSON.parse(localStorage.getItem('smartcity-issues') || '[]');
    const newIssue = { id: Date.now(), title, desc, loc, status: 'Open', createdAt: new Date().toISOString() };
    issues.unshift(newIssue);
    localStorage.setItem('smartcity-issues', JSON.stringify(issues));
    setSaved(true);
    setTimeout(() => { onClose(); }, 900);
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal>
      <div className="modal">
        <header className="modal-header">
          <h3>Report Issue</h3>
          <button className="btn ghost small" onClick={onClose}>Close</button>
        </header>
        <form className="modal-body" onSubmit={submit}>
          <label>
            <div className="label">Title</div>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Short title" />
          </label>
          <label>
            <div className="label">Description</div>
            <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Explain the issue" />
          </label>
          <label>
            <div className="label">Location (optional)</div>
            <input value={loc} onChange={e => setLoc(e.target.value)} placeholder="Street / ward / GPS" />
          </label>
          <div className="modal-actions">
            <button type="submit" className="btn primary">{saved ? 'Saved' : 'Submit'}</button>
            <button type="button" className="btn ghost" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ---------- Admin Panel ---------- */
function AdminPanel() {
  const [issues, setIssues] = React.useState(() => JSON.parse(localStorage.getItem('smartcity-issues') || '[]'));

  function changeStatus(id, next) {
    const updated = issues.map(i => i.id === id ? { ...i, status: next } : i);
    setIssues(updated);
    localStorage.setItem('smartcity-issues', JSON.stringify(updated));
  }

  function clearAll() {
    if (!confirm('Clear all issues?')) return;
    setIssues([]);
    localStorage.setItem('smartcity-issues', JSON.stringify([]));
  }

  return (
    <div className="page">
      <div className="admin-header">
        <h2>Admin — Issues</h2>
        <div>
          <button className="btn ghost" onClick={clearAll}>Clear all</button>
        </div>
      </div>

      {issues.length === 0 ? <p className="muted">No issues reported.</p> : (
        <div className="admin-list">
          {issues.map(i => (
            <div key={i.id} className="issue">
              <div>
                <div className="issue-title">{i.title}</div>
                <div className="muted small">{i.loc} • {new Date(i.createdAt).toLocaleString()}</div>
                <div className="issue-desc">{i.desc}</div>
              </div>
              <div className="issue-actions">
                <select value={i.status} onChange={e => changeStatus(i.id, e.target.value)}>
                  <option>Open</option>
                  <option>In Progress</option>
                  <option>Resolved</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- small inline pill style helper (keeps previous behavior) ---------- */
const pillStyle = status => {
  const base = { padding: '6px 10px', borderRadius: 999, fontSize: 12, fontWeight: 700 };
  switch (status) {
    case 'Normal': return { ...base, background: '#e6fff3', color: '#0b8646' };
    case 'Maintenance': return { ...base, background: '#fff7e6', color: '#b36b00' };
    case 'In Progress': return { ...base, background: '#e9f2ff', color: '#155bb0' };
    case 'Alert': return { ...base, background: '#ffecec', color: '#b00020' };
    default: return base;
  }
};