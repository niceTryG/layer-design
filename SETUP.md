# Layer Design - Local Setup Guide

## Full-Stack Architecture
- **Frontend**: React (Vite)
- **Backend**: Node.js + Express
- **Database**: SQLite3
- **Admin**: React dashboard at `/admin`

## Prerequisites
- Node.js 16+ installed
- npm 7+ installed

---

## Installation & Running Locally

### Step 1: Install Frontend Dependencies
```bash
npm install
```

### Step 2: Install Backend Dependencies
```bash
cd server
npm install
cd ..
```

### Step 3: Start Backend Server (Terminal 1)
```bash
cd server
npm start
```
Expected output:
```
🚀 Backend server running on http://localhost:3001
```

### Step 4: Start Frontend Dev Server (Terminal 2)
```bash
npm run dev
```
Expected output:
```
VITE v... ready in XXX ms
➜  Local:   http://localhost:5173/
```

---

## Access Your Site

- **Portfolio**: http://localhost:5173/
- **Admin Dashboard**: http://localhost:5173/?page=admin (or click "Admin" in navbar)

---

## Using the Admin Dashboard

### How to Add a New Project
1. Click **Admin** in the navbar
2. Click **Projects** tab
3. Fill in project details:
   - **Title**: Project name
   - **Subtitle**: Type (e.g., "Exterior", "Interior")
   - **Location**: Where it is
   - **Style**: Design style (e.g., "Modern", "Neo Classic")
   - **Image URL**: Paste Unsplash URL or your image URL  
   - **Description**: Project details
4. Click **Add Project** button
5. Project appears on Portfolio page immediately!

### How to Add Gallery Images
1. Go to **Gallery** tab
2. Paste image URL
3. Click **Add Image**

### How to Add Team Members
1. Go to **Team** tab
2. Fill in Name, Role, Image URL
3. Click **Add Member**

### How to Add Partners
1. Go to **Partners** tab
2. Enter partner name
3. Click **Add Partner**

---

## Database

Database file: `server/layer_design.db`

- Automatically created on first run
- Pre-seeded with sample data
- Delete it anytime to reset

---

## Troubleshooting

### "Backend not available" message
**Problem**: Frontend shows default data, changes don't save  
**Solution**: Check backend is running on port 3001
```bash
cd server
npm start
```

### Port already in use
**Problem**: "Port 3001 already in use"  
**Solution**: Kill process using that port or change in `server/server.js` (line: `const PORT = 3001`)

### Database errors
**Problem**: SQLite error on startup  
**Solution**: Delete `server/layer_design.db` and restart

### Changes not showing up
**Problem**: Admin form submitted but no update  
**Solution**: 
1. Check backend console for errors
2. Refresh browser page
3. Check browser console (F12) for network errors

---

## File Structure
```
layer-design/
├── src/
│   └── App.jsx                 ← Main React component
│   └── AdminPanel.jsx          ← Admin dashboard
├── server/
│   ├── server.js              ← Express API
│   ├── db.js                  ← SQLite setup
│   ├── package.json           ← Backend dependencies
│   └── layer_design.db        ← SQLite database
├── package.json               ← Frontend dependencies
└── SETUP.md                   ← This file
```

---

## API Endpoints (for reference)

**Projects**:
- `GET /api/projects` - Get all
- `POST /api/projects` - Create new
- `DELETE /api/projects/:id` - Delete

**Gallery**:
- `GET /api/gallery` - Get all
- `POST /api/gallery` - Add image
- `DELETE /api/gallery/:id` - Remove

**Team**:
- `GET /api/team` - Get all
- `POST /api/team` - Add member
- `DELETE /api/team/:id` - Remove

**Partners**:
- `GET /api/partners` - Get all
- `POST /api/partners` - Add partner
- `DELETE /api/partners/:id` - Remove

---

## Next Steps

### 1. Upload Your Own Images
- Use [Unsplash](https://unsplash.com) (free) or own CDN
- Paste URLs in admin dashboard

### 2. Deploy to Production
When ready to deploy:
- Build frontend: `npm run build`
- Deploy `dist/` folder to hosting (Vercel, Netlify, etc.)
- Deploy backend to Node hosting (Heroku, Railway, etc.)
- Update `API_BASE` in App.jsx to production backend URL

### 3. Customize More
- Edit colors in [src/App.jsx](src/App.jsx#L63) (CSS root variables)
- Edit contact info in InfoPage component
- Upload your actual logo in `public/LOGO.png`

---

**Questions?** Check backend console for API errors. All data changes instant on portfolio pages!
