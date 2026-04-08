const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { db, initializeDatabase } = require('./db');

const app = express();
const PORT = Number(process.env.PORT) || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Setup multer for file uploads
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Serve uploaded files
app.use('/uploads', express.static(uploadDir));

// Initialize database
initializeDatabase();

// ─── AUTH ──────────────────────────────────────────────────────────────────────
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'layerdesign2024';
const sessions = new Map(); // token → expiry timestamp

// Purge expired sessions every minute
setInterval(() => {
  const now = Date.now();
  for (const [token, expiry] of sessions) {
    if (now > expiry) sessions.delete(token);
  }
}, 60_000);

function requireAuth(req, res, next) {
  const auth = req.headers['authorization'] || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!token || !sessions.has(token) || Date.now() > sessions.get(token)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

// POST /api/admin/login
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (!password || typeof password !== 'string') {
    return res.status(400).json({ error: 'Password required' });
  }
  // Constant-time comparison to prevent timing attacks
  const maxLen = 200;
  const provided = Buffer.from(password.padEnd(maxLen).slice(0, maxLen));
  const expected = Buffer.from(ADMIN_PASSWORD.padEnd(maxLen).slice(0, maxLen));
  const ok = password.length === ADMIN_PASSWORD.length && crypto.timingSafeEqual(provided, expected);
  if (!ok) {
    return res.status(401).json({ error: 'Invalid password' });
  }
  const token = crypto.randomBytes(32).toString('hex');
  sessions.set(token, Date.now() + 8 * 60 * 60 * 1000); // 8 hours
  res.json({ token });
});

// POST /api/admin/logout
app.post('/api/admin/logout', (req, res) => {
  const auth = req.headers['authorization'] || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (token) sessions.delete(token);
  res.json({ message: 'Logged out' });
});

// ─── API ENDPOINTS ─────────────────────────────────────────────

// GET all projects
app.get('/api/projects', (req, res) => {
  db.all('SELECT * FROM projects ORDER BY id DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// GET single project
app.get('/api/projects/:id', (req, res) => {
  db.get('SELECT * FROM projects WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row);
  });
});

// POST new project
app.post('/api/projects', requireAuth, upload.single('img'), (req, res) => {
  const { title, subtitle, location, style, description, grid_size } = req.body;
  const img = req.file ? `/uploads/${req.file.filename}` : (req.body.img || req.body.img_url);

  db.run(
    'INSERT INTO projects (title, subtitle, location, style, img, grid_size, description) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [title, subtitle, location, style, img, grid_size || 'auto', description],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, title, subtitle, location, style, img, grid_size: grid_size || 'auto', description });
    }
  );
});

// UPDATE project
app.put('/api/projects/:id', requireAuth, upload.single('img'), (req, res) => {
  const { title, subtitle, location, style, description, grid_size } = req.body;
  const img = req.file ? `/uploads/${req.file.filename}` : req.body.img;

  db.run(
    'UPDATE projects SET title = ?, subtitle = ?, location = ?, style = ?, img = ?, grid_size = ?, description = ? WHERE id = ?',
    [title, subtitle, location, style, img, grid_size || 'auto', description, req.params.id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: req.params.id, title, subtitle, location, style, img, grid_size: grid_size || 'auto', description });
    }
  );
});

// DELETE project
app.delete('/api/projects/:id', requireAuth, (req, res) => {
  db.run('DELETE FROM projects WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Project deleted' });
  });
});

// ─── GALLERY ENDPOINTS ─────

// GET gallery (all images, for backwards compatibility)
app.get('/api/gallery', (req, res) => {
  db.all('SELECT * FROM gallery ORDER BY COALESCE(NULLIF(sort_order, 0), id) ASC, id ASC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// GET gallery for specific project
app.get('/api/projects/:projectId/gallery', (req, res) => {
  db.all('SELECT * FROM gallery WHERE project_id = ? ORDER BY COALESCE(NULLIF(sort_order, 0), id) ASC, id ASC', [req.params.projectId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows || []);
  });
});

// POST gallery image to specific project
app.post('/api/projects/:projectId/gallery', requireAuth, upload.single('img'), (req, res) => {
  const url = req.file ? `/uploads/${req.file.filename}` : req.body.url;
  const projectId = req.params.projectId;
  const layout = req.body.layout || 'auto';

  db.get('SELECT COALESCE(MAX(sort_order), 0) AS max_order FROM gallery WHERE project_id = ?', [projectId], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    const nextOrder = (row?.max_order || 0) + 1;

    db.run('INSERT INTO gallery (project_id, url, layout, sort_order) VALUES (?, ?, ?, ?)', [projectId, url, layout, nextOrder], function(insertErr) {
      if (insertErr) return res.status(500).json({ error: insertErr.message });
      res.json({ id: this.lastID, project_id: projectId, url, layout, sort_order: nextOrder });
    });
  });
});

// Reorder gallery items for a project
app.put('/api/projects/:projectId/gallery/order', requireAuth, (req, res) => {
  const projectId = Number(req.params.projectId);
  const galleryIds = Array.isArray(req.body.galleryIds) ? req.body.galleryIds.map(Number).filter(Boolean) : [];

  if (!galleryIds.length) {
    return res.status(400).json({ error: 'galleryIds array required' });
  }

  db.serialize(() => {
    db.run('BEGIN TRANSACTION');

    let failed = false;
    galleryIds.forEach((id, index) => {
      db.run(
        'UPDATE gallery SET sort_order = ? WHERE id = ? AND project_id = ?',
        [index + 1, id, projectId],
        (err) => {
          if (err) {
            failed = true;
            console.error('Gallery reorder failed:', err.message);
          }
        }
      );
    });

    db.run(failed ? 'ROLLBACK' : 'COMMIT', (err) => {
      if (failed || err) {
        return res.status(500).json({ error: 'Failed to save gallery order' });
      }
      res.json({ message: 'Gallery order updated' });
    });
  });
});

// UPDATE gallery image layout/url
app.put('/api/gallery/:id', requireAuth, (req, res) => {
  const { url, layout } = req.body;

  db.run(
    'UPDATE gallery SET url = COALESCE(?, url), layout = COALESCE(?, layout) WHERE id = ?',
    [url, layout, req.params.id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: req.params.id, url, layout });
    }
  );
});

// DELETE gallery image
app.delete('/api/gallery/:id', requireAuth, (req, res) => {
  db.run('DELETE FROM gallery WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Gallery image deleted' });
  });
});

// ─── TEAM ENDPOINTS ─────

// GET team
app.get('/api/team', (req, res) => {
  db.all('SELECT * FROM team ORDER BY id DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST team member
app.post('/api/team', requireAuth, upload.single('img'), (req, res) => {
  const { name, role } = req.body;
  const img = req.file ? `/uploads/${req.file.filename}` : (req.body.img || req.body.img_url);

  db.run(
    'INSERT INTO team (name, role, img) VALUES (?, ?, ?)',
    [name, role, img],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, name, role, img });
    }
  );
});

// DELETE team member
app.delete('/api/team/:id', requireAuth, (req, res) => {
  db.run('DELETE FROM team WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Team member deleted' });
  });
});

// ─── PARTNERS ENDPOINTS ─────

// GET partners
app.get('/api/partners', (req, res) => {
  db.all('SELECT * FROM partners ORDER BY id', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST partner
app.post('/api/partners', requireAuth, (req, res) => {
  const { name, url } = req.body;

  db.run('INSERT INTO partners (name, url) VALUES (?, ?)', [name, url || null], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, name, url: url || null });
  });
});

// DELETE partner
app.delete('/api/partners/:id', requireAuth, (req, res) => {
  db.run('DELETE FROM partners WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Partner deleted' });
  });
});

// ─── INFO/SETTINGS ENDPOINTS ─────

// GET all info items
app.get('/api/info', (req, res) => {
  db.all('SELECT * FROM info ORDER BY id', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST new info item
app.post('/api/info', requireAuth, (req, res) => {
  const { key, title, value, type, emoji, url } = req.body;

  db.run(
    'INSERT INTO info (key, title, value, type, emoji, url) VALUES (?, ?, ?, ?, ?, ?)',
    [key, title, value, type || 'text', emoji, url],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, key, title, value, type, emoji, url });
    }
  );
});

// UPDATE info item
app.put('/api/info/:id', requireAuth, (req, res) => {
  const { key, title, value, type, emoji, url } = req.body;

  db.run(
    'UPDATE info SET key = ?, title = ?, value = ?, type = ?, emoji = ?, url = ? WHERE id = ?',
    [key, title, value, type, emoji, url, req.params.id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: req.params.id, key, title, value, type, emoji, url });
    }
  );
});

// DELETE info item
app.delete('/api/info/:id', requireAuth, (req, res) => {
  db.run('DELETE FROM info WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Info item deleted' });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📊 Admin dashboard available at http://localhost:5173/admin`);
});
