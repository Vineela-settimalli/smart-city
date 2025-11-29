// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Sidebar />
        <MainPanel />
      </div>
    </BrowserRouter>
  );
}

/* ---------- Sidebar ---------- */
function Sidebar() {
  const [open, setOpen] = React.useState(true);

  return (
    <aside className={`sidebar ${open ? 'open' : 'collapsed'}`}>
      <div className="brand">
        <div className="logo">🏙️</div>
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
    { id: 4, name: 'Roads & Transport', desc: 'Roadworks and transit alerts.' }
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
    { id: 4, name: 'Roads & Transport', status: 'In Progress', desc: 'Roadworks and transit alerts.' }
  ];

  return (
    <div className="grid">
      {services.map(s => (
        <article key={s.id} className="service-card" tabIndex={0}>
          <div className="card-head">
            <h3>{s.name}</h3>
            <span className={`pill ${s.status === 'Normal' ? 'green' : s.status === 'Maintenance' ? 'amber' : 'blue'}`}>
              {s.status}
            </span>
          </div>
          <p className="muted">{s.desc}</p>
          <div className="card-actions">
            <button className="btn small">View</button>
            <button className="btn ghost small">Report</button>
          </div>
        </article>
      ))}
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
