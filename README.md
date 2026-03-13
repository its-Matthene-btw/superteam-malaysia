# Superteam Malaysia — Web3 Community Platform

A modern **Web3 community platform** built for **Superteam Malaysia** to serve as the digital hub for builders, creators, and founders in the **Solana ecosystem**.

This project is a submission for the **Superteam Malaysia Website Design & Build Challenge**.

---

# 🌐 Live Demo

The platform is deployed and accessible online.

| Platform         | Link                                              |
| ---------------- | ------------------------------------------------- |
| **Live Website** | https://superteam-malaysia-sigma.vercel.app       |
| **Admin CMS**    | https://superteam-malaysia-sigma.vercel.app/admin |

---

# 🔐 Admin CMS Demo Access

A custom CMS dashboard is available for content management.

Judges can log in using the following demo accounts to explore **role-based permissions**.

| Role       | Email                                             | Password        | Access              |
| ---------- | ------------------------------------------------- | --------------- | ------------------- |
| **Admin**  | [admin@superteam.my](mailto:admin@superteam.my)   | Admin123!secure | Full CMS access     |
| **Editor** | [editor@superteam.my](mailto:editor@superteam.my) | Admin123!secure | Content management  |
| **Viewer** | [viewer@superteam.my](mailto:viewer@superteam.my) | Admin123!secure | Read-only dashboard |

⚠️ **Note:** These credentials are for demonstration purposes only and should be changed in production.

---

# 🛠 Features

The platform is designed to be the **digital hub for the Superteam Malaysia community**.

### Dynamic Events System

Browse upcoming and past:

* Workshops
* Hackathons
* Community meetups

Events update dynamically from the CMS.

---

### Luma Event Integration

The platform integrates with **Luma** for event management.

Features include:

* Embedded Luma calendar
* Direct event registration
* Dynamic event cards
* Upcoming and past event listings

---

### Ecosystem Explorer

Discover projects built within the **Superteam MY ecosystem**.

Each project includes:

* Description
* Project links
* Team information
* Ecosystem connections

---

### Community Members Directory

A searchable directory of community builders.

Features include:

* Profile photos
* Roles and companies
* Skill tags
* Social links

---

### Full Admin CMS

A custom-built CMS dashboard allows non-technical administrators to manage the entire platform.

Admins can perform full CRUD operations for:

* Events
* Members
* Ecosystem Projects
* Announcements & Blog
* Partners
* Testimonials
* Community Stats
* Contact Messages

---

### Wall of Love

A section highlighting testimonials and success stories from the Superteam Malaysia community.

---

### Contact Inbox

Messages submitted through the contact form are stored and managed inside the CMS dashboard.

---

### Newsletter Collection

User emails are collected for community announcements and newsletters.

---

### Fully Responsive Design

The platform provides a seamless experience across:

* Desktop
* Tablet
* Mobile

---

# 🔑 Role-Based Access Control (RBAC)

The CMS implements **role-based access control** to ensure secure access to administrative tools.

| Role       | Permissions                                     |
| ---------- | ----------------------------------------------- |
| **Admin**  | Full system access including user management    |
| **Editor** | Manage and edit content but cannot manage users |
| **Viewer** | Read-only access to the dashboard               |

### Admin Permissions

* Manage users and roles
* Manage events
* Manage members
* Manage ecosystem projects
* Manage announcements
* Manage partners and statistics
* Access admin tools

### Editor Permissions

* Create and edit events
* Update member profiles
* Manage ecosystem projects
* Publish announcements and articles
* Update partners and stats

### Viewer Permissions

* View dashboard
* View CMS data
* Read-only access to content

Restrictions are enforced through:

* Protected routes
* Role-based UI controls
* Backend permission validation

---

# 🧱 Tech Stack

## Frontend

* **Next.js**
* **React**
* **Tailwind CSS**

## Backend

* **Supabase (PostgreSQL)**
* **Supabase Authentication**
* **Supabase Storage**

## Integrations

* **Luma** – Event management
* **Twitter / X** – Embedded social content

---

# 🏗 Architecture

The platform follows a **decoupled architecture** with a Next.js frontend and Supabase backend.

```
User / Visitor
      │
      ▼
Next.js Frontend (Vercel)
      │
      ▼
Supabase Backend
(PostgreSQL, Auth, Storage)
      │
      ▼
Admin CMS Dashboard
(/admin route)
```

### Frontend

The Next.js application renders UI components and fetches dynamic data.

### Backend

Supabase provides:

* PostgreSQL database
* Authentication
* File storage

---

# 📁 Project Structure

```
/
├── app
│   ├── (public)
│   │   ├── events
│   │   ├── ecosystem
│   │   ├── members
│   │   ├── news
│   │   └── contact
│   │
│   └── (admin)
│       └── admin
│           ├── dashboard
│           ├── events
│           ├── members
│           ├── ecosystem
│           └── users
│
├── components
│   ├── ui
│   └── home
│
└── lib
    └── supabase
```

---

# ⚙️ Installation

### Clone the repository

```bash
git clone https://github.com/its-Matthene-btw/superteam-malaysia.git
```

### Install dependencies

```bash
npm install
```

### Create environment variables

Create `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Run development server

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

---

# 🚀 Deployment

The platform is deployed using **Vercel**.

Build command:

```bash
npm run build
```

---

# 🔮 Future Improvements

Possible future enhancements include:

* Deeper **Luma API integration**
* **Web3 wallet authentication**
* Advanced **member reputation system**
* **Admin analytics dashboard**
* Community **bounty tracking**

---

# ❤️ Acknowledgment

Built with ❤️ for the **Superteam Malaysia Website Design & Build Challenge**.
