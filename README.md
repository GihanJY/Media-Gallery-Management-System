# 📸 Media Gallery Management System

A full-stack **Media Gallery Web Application** with contact form integration built using the **MERN stack**. This application allows users to manage media files, messages, and profiles with secure authentication and an intuitive UI.

---

## 🚀 Project Features

### 🔐 Authentication
- Google OAuth 2.0 login
- Manual registration with Gmail OTP verification
- Forgot password using Gmail OTP
- Route protection with role-based middleware

### 🖼️ Media Gallery
- **Upload & Validation**
  - Drag & drop interface (JPG/PNG, max 5MB)
  - Metadata input (title, description, tags)
- **Gallery Management**
  - Personal/shared galleries
  - Search and filter by tags or titles
  - Full-screen image view with slider
- **CRUD Operations**
  - Add, edit, delete media items
  - Bulk image selection support
- **ZIP Generation**
  - Download selected images as a ZIP (via backend/frontend)

### 📬 Contact Form
- **User Actions**
  - Submit, edit, delete messages
- **Admin Actions**
  - View all messages
  - Delete any message

### 👤 User Management (Admin Only)
- View and edit user profiles
- Soft-delete/deactivate accounts

---

## 🧩 Tech Stack

| Area       | Technologies |
|------------|--------------|
| Frontend   | React, Tailwind CSS / Bootstrap |
| Backend    | Node.js, Express.js |
| Database   | MongoDB |
| Auth       | Google OAuth 2.0, JWT, Nodemailer (OTP) |
| Storage    | Cloudinary or local filesystem |
| Libraries  | Multer, Archiver, React Dropzone |

---

## 📂 Folder Structure

```
project-root/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── utils/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── ...
├── .env
├── README.md
└── env_files.zip
```

