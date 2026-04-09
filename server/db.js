const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, 'layer_design.db');

let db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) console.error('Error opening database:', err);
  else console.log('Connected to SQLite database');
});

// Initialize database schema
function initializeDatabase() {
  db.serialize(() => {
    // Projects table
    db.run(`
      CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        subtitle TEXT,
        location TEXT,
        style TEXT,
        img TEXT,
        grid_size TEXT DEFAULT 'auto',
        project_type TEXT DEFAULT '',
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Lightweight migration for existing databases
    db.run("ALTER TABLE projects ADD COLUMN grid_size TEXT DEFAULT 'auto'", (err) => {
      if (err && !String(err.message).includes('duplicate column name')) {
        console.error('Migration error (grid_size):', err.message);
      }
    });

    db.run("ALTER TABLE projects ADD COLUMN project_type TEXT DEFAULT ''", (err) => {
      if (err && !String(err.message).includes('duplicate column name')) {
        console.error('Migration error (project_type):', err.message);
      }
    });

    // Gallery images table (now per-project)
    db.run(`
      CREATE TABLE IF NOT EXISTS gallery (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER NOT NULL,
        url TEXT NOT NULL,
        layout TEXT DEFAULT 'auto',
        sort_order INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
      )
    `);

    db.run("ALTER TABLE gallery ADD COLUMN layout TEXT DEFAULT 'auto'", (err) => {
      if (err && !String(err.message).includes('duplicate column name')) {
        console.error('Migration error (gallery.layout):', err.message);
      }
    });

    db.run("ALTER TABLE gallery ADD COLUMN sort_order INTEGER DEFAULT 0", (err) => {
      if (err && !String(err.message).includes('duplicate column name')) {
        console.error('Migration error (gallery.sort_order):', err.message);
      }
    });

    // Backfill ordering for existing rows once sort_order exists.
    db.run('UPDATE gallery SET sort_order = id WHERE sort_order IS NULL OR sort_order = 0');

    // Team members table
    db.run(`
      CREATE TABLE IF NOT EXISTS team (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        role TEXT,
        img TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Partners table
    db.run(`
      CREATE TABLE IF NOT EXISTS partners (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        url TEXT
      )
    `);

    db.run("ALTER TABLE partners ADD COLUMN url TEXT", (err) => {
      if (err && !String(err.message).includes('duplicate column name')) {
        console.error('Migration error (partners.url):', err.message);
      }
    });

    // Info/Settings table for editable content (social links, contact info, etc)
    db.run(`
      CREATE TABLE IF NOT EXISTS info (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT UNIQUE NOT NULL,
        title TEXT,
        value TEXT,
        type TEXT DEFAULT 'text',
        emoji TEXT,
        url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Check if tables are empty and seed with initial data
    db.get("SELECT COUNT(*) as count FROM projects", (err, row) => {
    if (err) {
        console.error('Seed check error:', err.message);
        return;
    }

    const allowSeed = process.env.SEED_DEMO_DATA === '1';

    if (row.count === 0 && allowSeed) {
        seedDatabase();
    }
    });
  });
}

function seedDatabase() {
  const projects = [
    { title: "APEX Tower", subtitle: "Exterior", location: "Dubai, UAE", style: "Contemporary", img: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=900&q=80", grid_size: 'wide', description: "Modern exterior design..." },
    { title: "APEX Tower", subtitle: "Interior", location: "Dubai, UAE", style: "Modern", img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&q=80", grid_size: 'tall', description: "Contemporary interior..." },
    { title: "APEX Restaurant", subtitle: "Modern Design", location: "Dubai, UAE", style: "Contemporary", img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&q=80", grid_size: 'normal', description: "Restaurant design..." },
    { title: "Durmen Villa", subtitle: "Neo Classic", location: "Tashkent, UZB", style: "Neo Classic", img: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=900&q=80", grid_size: 'wide', description: "Villa design..." },
    { title: "Nest ONE Apartment", subtitle: "Modern Design", location: "Tashkent, UZB", style: "Modern", img: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=900&q=80", grid_size: 'normal', description: "Apartment design..." },
    { title: "Oxygen Apartment", subtitle: "Neo Classic", location: "Tashkent, UZB", style: "Neo Classic", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80", grid_size: 'tall', description: "Classic apartment..." },
    { title: "Plove Lounge", subtitle: "Lounge Bar", location: "Tashkent, UZB", style: "Contemporary", img: "https://images.unsplash.com/photo-1525610553991-2bede1a236e2?w=900&q=80", grid_size: 'normal', description: "Lounge bar design..." },
    { title: "Private Villa", subtitle: "Modern Design", location: "Tashkent, UZB", style: "Modern", img: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=900&q=80", grid_size: 'wide', description: "Private villa..." },
    { title: "Boulevard Apartments", subtitle: "Interior Design", location: "Tashkent, UZB", style: "Contemporary", img: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=900&q=80", grid_size: 'normal', description: "Boulevard project..." },
    { title: "Gabus Apartments", subtitle: "Modern Design", location: "Tashkent, UZB", style: "Modern", img: "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=900&q=80", grid_size: 'tall', description: "Gabus project..." },
    { title: "Private Villa Ext.", subtitle: "Classic Design", location: "Tashkent, UZB", style: "Classic", img: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=900&q=80", grid_size: 'normal', description: "Villa exterior..." },
    { title: "Gardens Residence", subtitle: "Neo Classic", location: "Tashkent, UZB", style: "Neo Classic", img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&q=80", grid_size: 'wide', description: "Gardens project..." },
    { title: "Cambridge Residence", subtitle: "Neo Classical", location: "Moscow, RU", style: "Neo Classic", img: "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=900&q=80", grid_size: 'normal', description: "Cambridge project..." },
    { title: "Sayram Village", subtitle: "Neo Classical", location: "Tashkent, UZB", style: "Neo Classic", img: "https://images.unsplash.com/photo-1602941525421-8f8b81d3edbb?w=900&q=80", grid_size: 'tall', description: "Sayram project..." },
    { title: "Private House Int.", subtitle: "Neo Classic", location: "Moscow, RU", style: "Neo Classic", img: "https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=900&q=80", grid_size: 'normal', description: "House interior..." },
    { title: "Office Interior", subtitle: "Modern Design", location: "Dubai, UAE", style: "Modern", img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&q=80", grid_size: 'wide', description: "Office design..." },
    { title: "Fazo Residence", subtitle: "Exterior Design", location: "Tashkent, UZB", style: "Contemporary", img: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=900&q=80", grid_size: 'normal', description: "Fazo project..." },
    { title: "Humo Arena", subtitle: "Interior Design", location: "Tashkent, UZB", style: "Modern", img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=900&q=80", grid_size: 'tall', description: "Arena design..." },
  ];

  let projectCount = 0;
  
  projects.forEach((p, index) => {
    db.run(
      "INSERT INTO projects (title, subtitle, location, style, img, grid_size, project_type, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [p.title, p.subtitle, p.location, p.style, p.img, p.grid_size || 'auto', p.project_type || '', p.description],
      function() { projectCount++; }
    );
  });

  // Once all projects are inserted, add gallery images per project
  setTimeout(() => {
    db.all('SELECT id FROM projects ORDER BY id ASC', [], (err, projectRows) => {
      if (!err && projectRows) {
        // Gallery images mapped to specific projects
        const projectGalleries = [
          { projectId: projectRows[0]?.id, images: [
            "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1400&q=85",
            "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1400&q=85",
          ]},
          { projectId: projectRows[1]?.id, images: [
            "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1400&q=85",
            "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1400&q=85",
          ]},
          { projectId: projectRows[2]?.id, images: [
            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1400&q=85",
          ]},
        ];

        projectGalleries.forEach(pg => {
          if (pg.projectId) {
            pg.images.forEach(img => {
              db.run(
                "INSERT INTO gallery (project_id, url) VALUES (?, ?)",
                [pg.projectId, img]
              );
            });
          }
        });
      }
    });
  }, 500);

  const team = [
    { name: "Aleksandra Morozova", role: "Principal Architect", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80" },
    { name: "Dmitri Volkov", role: "Interior Designer", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80" },
    { name: "Nilufar Rashidova", role: "Project Manager", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&q=80" },
    { name: "Ivan Petrov", role: "3D Visualizer", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80" },
    { name: "Maria Kuznetsova", role: "Lead Designer", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80" },
    { name: "Timur Yusupov", role: "Architect", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&q=80" },
  ];

  team.forEach(t => {
    db.run(
      "INSERT INTO team (name, role, img) VALUES (?, ?, ?)",
      [t.name, t.role, t.img]
    );
  });

  const partners = ["Miele", "Boffi", "Minotti", "Poliform", "Flos", "Vitra", "Knoll", "Fritz Hansen"];
  partners.forEach(p => {
    db.run("INSERT INTO partners (name, url) VALUES (?, ?)", [p, null]);
  });

  // Seed info/social links
  const info = [
    { key: 'email', title: 'Email', value: 'hello@layerdesign.com', type: 'email', emoji: '📧', url: 'mailto:hello@layerdesign.com' },
    { key: 'phone', title: 'Phone', value: '+1 (555) 123-4567', type: 'phone', emoji: '📱', url: 'tel:+15551234567' },
    { key: 'address', title: 'Address', value: '123 Design Street, Creative City, CC 12345', type: 'text', emoji: '📍', url: null },
    { key: 'instagram', title: 'Instagram', value: '@layerdesign', type: 'social', emoji: '📸', url: 'https://instagram.com/layerdesign' },
    { key: 'telegram', title: 'Telegram', value: '@layerdesign', type: 'social', emoji: '✈️', url: 'https://t.me/layerdesign' },
    { key: 'x', title: 'X (Twitter)', value: '@layerdesign', type: 'social', emoji: '𝕏', url: 'https://x.com/layerdesign' },
    { key: 'facebook', title: 'Facebook', value: 'Layer Design Studio', type: 'social', emoji: '👥', url: 'https://facebook.com/layerdesign' },
    { key: 'linkedin', title: 'LinkedIn', value: 'Layer Design Studio', type: 'social', emoji: '💼', url: 'https://linkedin.com/company/layerdesign' },
  ];

  info.forEach(i => {
    db.run(
      "INSERT INTO info (key, title, value, type, emoji, url) VALUES (?, ?, ?, ?, ?, ?)",
      [i.key, i.title, i.value, i.type, i.emoji, i.url]
    );
  });

  console.log('Database seeded with initial data');
}

module.exports = { db, initializeDatabase };
