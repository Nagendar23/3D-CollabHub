# 3D CollabHub

A full-stack platform for collaborative 3D model management, version control, and real-time commenting. Perfect for teams working with 3D assets, CAD files, or 3D artwork.

---

##  What is 3D CollabHub?

Think of it as **Google Drive meets GitHub, but for 3D models**. Upload your 3D files (GLB, GLTF, OBJ, STL), organize them into projects, track versions as you iterate, and comment directly on models with your team.

### Key Features

- **📁 Project Management** — Organize 3D files into projects with descriptions
- **📦 3D Viewer** — Built-in viewer with zoom, pan, and lighting controls
- **🔄 Version Control** — Upload new versions of files and easily switch between them
- **💬 Comments & Collaboration** — Leave comments on files for team feedback
- **🔐 Ownership & Access** — Secure file access with user-based authorization
- **☁️ Cloud Storage** — Files stored securely on Cloudinary
- **⚡ Performance Optimized** — Memoized components, model caching, virtual scrolling

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier works)
- Cloudinary account (for file storage)

### Installation

**1. Clone & Setup Backend**
```bash
cd backend
npm install
cp .env.example .env  # Configure with your credentials
npm run dev           # Starts on http://localhost:8000
```

**2. Setup Frontend**
```bash
cd frontend
npm install
npm run dev           # Starts on http://localhost:3000
```

**3. Environment Variables**

**Backend** (`backend/.env`):
```
PORT=8000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/3dcollabhub
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_KEY=your_api_key
CLOUDINARY_SECRET=your_api_secret
JWT_SECRET=your_super_secret_jwt_key_12345
```

**Frontend** (`frontend/.env.local`):
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

---

## 🏗️ Project Structure

```
3DCollabHub/
├── backend/
│   ├── src/
│   │   ├── app.js                 # Express app setup
│   │   ├── server.js              # Server entry
│   │   ├── controllers/           # Business logic
│   │   ├── routes/                # API endpoints
│   │   ├── models/                # MongoDB schemas
│   │   ├── middleware/            # Auth, uploads
│   │   └── config/                # DB, Cloudinary config
│   └── package.json
│
└── frontend/
    ├── app/                       # Next.js app router pages
    ├── components/
    │   ├── auth/                  # Login/Signup forms
    │   ├── files/                 # File viewer, versions, comments
    │   ├── projects/              # Project grid, cards
    │   ├── viewer/                # 3D viewer components
    │   └── layout/                # Navbar, sidebar
    ├── hooks/                     # Custom React hooks
    ├── lib/                       # Utilities, API calls
    └── package.json
```

---

## 🔌 API Documentation

All endpoints require JWT authentication (except auth endpoints). Base URL: `http://localhost:8000/api`

### **Authentication**

#### Sign Up
```http
POST /auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```
**Response:** `{ token, user }`

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}
```
**Response:** `{ token, user }`

---

### **Projects**

#### Create Project
```http
POST /project
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Product Redesign 2024",
  "description": "New product iteration with updated models"
}
```
**Response:** `{ _id, title, description, createdAt }`

#### Get All Projects
```http
GET /project
Authorization: Bearer {token}
```
**Response:** `[{ _id, title, description, fileCount, createdAt }, ...]`

#### Get Single Project
```http
GET /project/:projectId
Authorization: Bearer {token}
```
**Response:** `{ _id, title, description, files, createdAt }`

#### Update Project
```http
PUT /project/:projectId
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated description"
}
```

#### Delete Project
```http
DELETE /project/:projectId
Authorization: Bearer {token}
```
**Note:** Deletes all files, versions, and comments in the project

---

### **Files**

#### Upload File
```http
POST /files/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data

- projectId: (form field)
- file: (file input, .glb/.gltf/.obj/.stl only)
```
**Response:** `{ _id, name, currentVersion, createdAt }`

#### Get Project Files
```http
GET /files/project/:projectId
Authorization: Bearer {token}
```
**Response:** `[{ _id, name, currentVersion, createdAt }, ...]`

#### Get Single File
```http
GET /files/:fileId
Authorization: Bearer {token}
```
**Response:** `{ _id, name, currentVersion, allVersions, comments }`

#### Get File Versions
```http
GET /files/:fileId/versions
Authorization: Bearer {token}
```
**Response:** `[{ _id, versionNumber, fileUrl, fileSize, createdAt }, ...]`

#### Delete File
```http
DELETE /files/:fileId
Authorization: Bearer {token}
```
**Note:** Deletes all versions and comments, cleans Cloudinary assets

---

### **Comments**

#### Get File Comments
```http
GET /files/:fileId/comments
Authorization: Bearer {token}
```
**Response:** `[{ _id, text, user, createdAt }, ...]`

#### Add Comment
```http
POST /files/:fileId/comment
Authorization: Bearer {token}
Content-Type: application/json

{
  "text": "This model looks great! Love the details."
}
```
**Response:** `{ _id, text, user, createdAt }`

---

## 🎯 Features Explained

### Version Control
Every time you upload a new version of a file, the system keeps the old one. You can see the full history and switch between versions instantly without re-downloading.

### Smart Caching
- **Versions cached:** Fetching versions twice won't make two API calls
- **Models cached:** The 3D viewer remembers models, so switching versions is instant
- **Components memoized:** React prevents unnecessary re-renders

### Secure Access
- Only project owners can see their files
- Files are stored on Cloudinary (automatic cleanup on delete)
- JWT tokens validate every request

### 3D Viewer
- Supports: **GLB, GLTF, OBJ, STL** formats
- Features: Zoom, pan, rotate, lighting
- Shows file info: version number, size, upload date

---

## 🛠️ Tech Stack

**Frontend:**
- Next.js 16 (React 19) with App Router
- Three.js + React Three Fiber (3D rendering)
- Tailwind CSS (styling)
- Axios (API calls)

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- Cloudinary (file storage)
- JWT (authentication)
- Multer (file uploads)

---

## 📤 Deployment

### Deploy to Vercel (Frontend) + Railway (Backend)

**Backend on Railway:**
1. Go to [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Select repo, set environment variables (MONGO_URI, CLOUDINARY_*, JWT_SECRET, PORT)
4. Railway auto-deploys on git push
5. Copy backend URL (e.g., `https://your-app.railway.app`)

**Frontend on Vercel:**
1. Go to [vercel.com](https://vercel.com)
2. New Project → Select GitHub repo
3. Set root to `./frontend`
4. Add `NEXT_PUBLIC_API_URL=https://your-railway-url/api`
5. Deploy — Vercel auto-redeploys on push

**Result:** Full-stack app live and connected ✅

---

## 🔍 How It Works

### User Journey
1. **Sign Up** → Create account with email/password
2. **Create Project** → Organize 3D files by project
3. **Upload File** → Choose .glb/.gltf/.obj/.stl file (validated)
4. **View & Interact** → See 3D model in viewer, zoom/pan/rotate
5. **Version Iterate** → Upload new versions, switch between them
6. **Collaborate** → Leave comments for team feedback
7. **Track History** → See all versions with timestamps and sizes

### Behind the Scenes
- Files uploaded to Cloudinary (secure cloud storage)
- Each version stored with metadata (size, fileType, uploadedBy)
- Comments linked to files, user info included
- Projects link files together, deletions cascade safely
- Frontend caches frequently accessed data

---

## ⚡ Performance Optimizations

- **Component Memoization:** Prevents unnecessary re-renders
- **Model Caching:** 3D models cached by version ID
- **Lazy Loading:** Heavy components (viewer) load on demand
- **Abortable Requests:** Cancel old requests when changing pages
- **Virtual Scrolling:** Long comment/version lists scroll efficiently
- **Version Caching:** Fetches versions once, uses cache on revisit

---

## 🔐 Security

- **JWT Authentication:** Signed tokens, expire on logout
- **Ownership Validation:** Users can only access their own files
- **File Type Validation:** 
  - Frontend: checks extension before upload
  - Backend: validates MIME type on receipt
  - Supported: `application/octet-stream` (STL), `model/gltf-binary` (GLB), `model/gltf+json` (GLTF), `model/obj` (OBJ)
- **Cloudinary Cleanup:** Deleted files cleaned up automatically
- **Environment Variables:** Secrets never committed to repo

---

## 💡 Future Ideas

- Real-time collaboration (WebSocket for live comments)
- 3D model annotations & measurements
- Batch file operations
- Model comparison side-by-side
- Export as PDF/image
- Team workspaces
- Usage analytics

---

