import { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:3001/api';

export default function AdminPanel() {
  const [tab, setTab] = useState('projects');
  const [projects, setProjects] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [team, setTeam] = useState([]);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [editingId, setEditingId] = useState(null);

  // Form states
  const [projectForm, setProjectForm] = useState({ title: '', subtitle: '', location: '', style: '', img: '', description: '' });

  // Load data
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [pRes, gRes, tRes, paRes] = await Promise.all([
        fetch(`${API_BASE}/projects`),
        fetch(`${API_BASE}/gallery`),
        fetch(`${API_BASE}/team`),
        fetch(`${API_BASE}/partners`),
      ]);

      if (pRes.ok) setProjects(await pRes.json());
      if (gRes.ok) setGallery(await gRes.json());
      if (tRes.ok) setTeam(await tRes.json());
      if (paRes.ok) setPartners(await paRes.json());
    } catch (err) {
      showMessage('❌ Failed to load data', 'error');
    }
    setLoading(false);
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 4000);
  };

  const startEditProject = (project) => {
    setEditingId(project.id);
    setProjectForm(project);
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    if (!projectForm.title || !projectForm.img) {
      showMessage('❌ Title and Image URL required');
      return;
    }

    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `${API_BASE}/projects/${editingId}` : `${API_BASE}/projects`;

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectForm),
      });

      if (res.ok) {
        setProjectForm({ title: '', subtitle: '', location: '', style: '', img: '', description: '' });
        setEditingId(null);
        loadAllData();
        showMessage(editingId ? '✅ Project updated' : '✅ Project added');
      } else {
        showMessage('❌ Failed to save');
      }
    } catch (err) {
      showMessage('❌ Error: ' + err.message);
    }
  };

  const deleteProject = async (id) => {
    if (!confirm('Delete project?')) return;
    try {
      await fetch(`${API_BASE}/projects/${id}`, { method: 'DELETE' });
      loadAllData();
      showMessage('✅ Deleted');
    } catch {
      showMessage('❌ Error');
    }
  };

  const css = `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    .admin-wrapper {
      min-height: 100vh;
      background: linear-gradient(135deg, #f5f5f7 0%, #ddd 100%);
      padding: 40px 20px;
    }

    .admin-container {
      max-width: 1600px;
      margin: 0 auto;
    }

    .admin-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 40px;
      padding: 30px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .admin-header h1 {
      font-size: 32px;
      font-weight: 800;
      color: #000;
    }

    .back-link {
      padding: 12px 24px;
      background: black;
      color: white;
      border: none;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
    }

    .back-link:hover {
      background: #333;
      transform: translateY(-2px);
    }

    .message {
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 16px 24px;
      background: white;
      border-left: 4px solid #10b981;
      border-radius: 6px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      font-size: 14px;
      font-weight: 600;
      z-index: 1000;
      animation: slideIn 0.3s ease;
    }

    @keyframes slideIn {
      from { transform: translateX(500px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }

    .admin-tabs {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-bottom: 40px;
    }

    .admin-tab-btn {
      padding: 16px;
      background: white;
      border: 2px solid #ddd;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .admin-tab-btn:hover {
      border-color: black;
    }

    .admin-tab-btn.active {
      background: black;
      color: white;
      border-color: black;
    }

    .admin-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }

    .admin-card {
      background: white;
      border-radius: 12px;
      padding: 32px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .admin-card.edit-mode {
      background: #fffbeb;
      border: 2px solid #fbbf24;
    }

    .admin-card h3 {
      font-size: 22px;
      font-weight: 800;
      margin-bottom: 24px;
      color: #000;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      font-size: 12px;
      font-weight: 700;
      margin-bottom: 8px;
      color: #333;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .form-group input,
    .form-group textarea {
      width: 100%;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 14px;
      font-family: inherit;
    }

    .form-group input:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: black;
      box-shadow: 0 0 0 3px rgba(0,0,0,0.1);
    }

    .form-group textarea {
      resize: vertical;
      min-height: 100px;
    }

    .form-actions {
      display: flex;
      gap: 12px;
      margin-top: 24px;
    }

    .form-submit {
      flex: 1;
      padding: 14px;
      background: black;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      text-transform: uppercase;
      letter-spacing: 1px;
      transition: all 0.2s;
    }

    .form-submit:hover {
      background: #333;
      transform: translateY(-2px);
      box-shadow: 0 8px 16px rgba(0,0,0,0.2);
    }

    .form-cancel {
      flex: 1;
      padding: 14px;
      background: #f3f4f6;
      color: black;
      border: 2px solid #ddd;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      text-transform: uppercase;
      letter-spacing: 1px;
      transition: all 0.2s;
    }

    .form-cancel:hover {
      background: #e5e7eb;
      border-color: black;
    }

    .list-section h3 {
      font-size: 22px;
      font-weight: 800;
      margin-bottom: 20px;
      color: #000;
    }

    .list-item {
      padding: 18px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      margin-bottom: 12px;
      background: #f9fafb;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: all 0.2s;
    }

    .list-item:hover {
      background: #f3f4f6;
      border-color: #bfdbfe;
    }

    .list-item-content {
      flex: 1;
    }

    .list-item-title {
      font-weight: 700;
      font-size: 16px;
      color: #000;
      margin-bottom: 4px;
    }

    .list-item-meta {
      font-size: 13px;
      color: #666;
    }

    .list-item-actions {
      display: flex;
      gap: 8px;
      margin-left: 12px;
    }

    .btn-edit {
      padding: 8px 16px;
      background: #0066cc;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
      text-transform: uppercase;
    }

    .btn-edit:hover {
      background: #0052a3;
      transform: scale(1.05);
    }

    .btn-delete {
      padding: 8px 16px;
      background: #ef4444;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
      text-transform: uppercase;
    }

    .btn-delete:hover {
      background: #dc2626;
      transform: scale(1.05);
    }

    .empty {
      text-align: center;
      padding: 40px;
      color: #999;
      font-style: italic;
    }

    @media (max-width: 1024px) {
      .admin-content { grid-template-columns: 1fr; }
      .admin-tabs { grid-template-columns: repeat(2, 1fr); }
    }

    @media (max-width: 600px) {
      .admin-tabs { grid-template-columns: 1fr; }
      .list-item { flex-direction: column; align-items: flex-start; }
      .list-item-actions { width: 100%; margin-left: 0; margin-top: 12px; }
      .btn-edit, .btn-delete { flex: 1; }
    }
  `;

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <div>
      <style>{css}</style>
      <div className="admin-wrapper">
        <div className="admin-container">
          <div className="admin-header">
            <h1>📊 ADMIN PANEL</h1>
            <a href="/" className="back-link">← Back to Site</a>
          </div>

          {message && <div className="message">{message}</div>}

          <div className="admin-tabs">
            {[{ id: 'projects', label: '🏗️ Projects' }, { id: 'gallery', label: '🖼️ Gallery' }, { id: 'team', label: '👥 Team' }, { id: 'partners', label: '🤝 Partners' }].map(t => (
              <button
                key={t.id}
                className={`admin-tab-btn ${tab === t.id ? 'active' : ''}`}
                onClick={() => setTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* PROJECTS */}
          {tab === 'projects' && (
            <div className="admin-content">
              <div className={`admin-card ${editingId ? 'edit-mode' : ''}`}>
                <h3>{editingId ? '✏️ EDIT PROJECT' : '➕ NEW PROJECT'}</h3>
                <form onSubmit={handleSaveProject}>
                  <div className="form-group">
                    <label>Title *</label>
                    <input type="text" value={projectForm.title} onChange={e => setProjectForm({...projectForm, title: e.target.value})} placeholder="Project name" required />
                  </div>
                  <div className="form-group">
                    <label>Subtitle</label>
                    <input type="text" value={projectForm.subtitle} onChange={e => setProjectForm({...projectForm, subtitle: e.target.value})} placeholder="e.g., Exterior" />
                  </div>
                  <div className="form-group">
                    <label>Location</label>
                    <input type="text" value={projectForm.location} onChange={e => setProjectForm({...projectForm, location: e.target.value})} placeholder="e.g., Dubai, UAE" />
                  </div>
                  <div className="form-group">
                    <label>Style</label>
                    <input type="text" value={projectForm.style} onChange={e => setProjectForm({...projectForm, style: e.target.value})} placeholder="e.g., Modern" />
                  </div>
                  <div className="form-group">
                    <label>Image URL *</label>
                    <input type="url" value={projectForm.img} onChange={e => setProjectForm({...projectForm, img: e.target.value})} placeholder="https://..." required />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea value={projectForm.description} onChange={e => setProjectForm({...projectForm, description: e.target.value})} placeholder="Tell us about this project..." />
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="form-submit">{editingId ? '💾 Update' : '✅ Create'}</button>
                    {editingId && <button type="button" className="form-cancel" onClick={() => { setEditingId(null); setProjectForm({ title: '', subtitle: '', location: '', style: '', img: '', description: '' }); }}>Cancel</button>}
                  </div>
                </form>
              </div>

              <div className="admin-card">
                <div className="list-section">
                  <h3>All Projects ({projects.length})</h3>
                  {projects.length === 0 ? (
                    <div className="empty">No projects. Create one →</div>
                  ) : (
                    projects.map(p => (
                      <div key={p.id} className="list-item">
                        <div className="list-item-content">
                          <div className="list-item-title">{p.title}</div>
                          <div className="list-item-meta">{p.location} • {p.style}</div>
                        </div>
                        <div className="list-item-actions">
                          <button className="btn-edit" onClick={() => startEditProject(p)}>Edit</button>
                          <button className="btn-delete" onClick={() => deleteProject(p.id)}>Delete</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
