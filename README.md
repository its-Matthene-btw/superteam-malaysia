<p align="center">
<strong>A modern Web3 community platform built for Superteam Malaysia to serve as the digital hub for builders, creators, and founders in the Solana ecosystem.</strong>
</p>

<p align="center">
This project is a submission for the <strong>Superteam Malaysia Website Design & Build Challenge</strong>.
</p>

---

## Live Demo

The platform is deployed and accessible live:

| Site | Link |
|-----|------|
| Live Site | https://superteam-malaysia-sigma.vercel.app |
| Admin CMS | https://superteam-malaysia-sigma.vercel.app/admin |

---

## Admin Access (Demo)

A custom CMS dashboard is available for content management.

Judges can use the following demo credentials to explore the admin panel.

**Email:** admin@superteam.my  
**Password:** Admin123!secure 

> Note: These credentials provide full access to the CMS for demonstration purposes and should be changed in a production environment.

---

## Features

The platform is designed to be a comprehensive resource for the Superteam MY community.

### Dynamic Events System
Browse upcoming and past events, workshops, and hackathons.

### Luma Event Integration
View an embedded Luma calendar and link directly to Luma for event registration.

### Ecosystem Explorer
Discover projects being built within the Superteam MY ecosystem with detailed project pages.

### Community Members Directory
A filterable directory of community members and their profiles.

### Full-Featured Admin CMS
A secure custom-built dashboard for non-technical admins to manage all site content.

### Announcements & Blog
A system for publishing news, updates, and articles.

### Wall of Love
A showcase of community testimonials and success stories.

### Admin Contact Inbox
A dedicated inbox for viewing and managing messages sent via the contact form.

### Newsletter Collection
Functionality to capture user emails for newsletters.

### Fully Responsive Design
A seamless experience across desktop, tablet, and mobile devices.

---

## Luma Integration

The website integrates directly with **Luma** to streamline event management and provide a single source of truth for all community events.

**Event Cards**
Upcoming events are displayed dynamically with direct links to their Luma registration pages.

**Embedded Calendar**
A dedicated page features an embedded Luma calendar for a comprehensive view of all scheduled events.

**Dynamic Updates**
The system dynamically fetches and displays the latest event information to ensure content is always up to date.

---

## CMS System

The custom-built Content Management System empowers administrators to manage the entire platform without writing code.

Admins can perform full CRUD operations for:

- Events (create, edit, publish)
- Members (community directory management)
- Ecosystem Projects
- Announcements and articles
- Partners & Stats
- Testimonials
- Contact Messages

---

## Tech Stack

**Frontend**
- Next.js
- React
- Tailwind CSS

**Backend**
- Supabase (PostgreSQL Database)
- Supabase Authentication
- Supabase Storage

**Integrations**
- Luma (Events)
- Twitter/X (Embedded Content)

---

## Architecture

The platform uses a modern decoupled architecture with a **Next.js frontend** and **Supabase backend**.


+--------------------------+ +---------------------------+ +-----------------------------+
| User / Visitor | <--> | Next.js Frontend | <--> | Supabase Backend |
+--------------------------+ | (Hosted on Vercel) | | (PostgreSQL, Auth, Storage)|
+---------------------------+ +-----------------------------+
|
v
+--------------------------+ +---------------------------+
| Administrator | <--> | Admin CMS Dashboard |
+--------------------------+ | (/admin route) |
+---------------------------+


**Frontend**
The Next.js application renders the UI and fetches data. It is deployed on Vercel for performance and continuous deployment.

**Backend**
Supabase provides the PostgreSQL database, authentication for the admin panel, and asset storage.

**Data Fetching**
Data is fetched dynamically from Supabase and rendered on the frontend.

---

## Project Structure


/
├── app/
│ ├── (public)/
│ │ ├── events/
│ │ ├── ecosystem/
│ │ ├── members/
│ │ ├── news/
│ │ └── contact/
│ │
│ └── (admin)/
│ └── admin/
│ ├── dashboard/
│ ├── events/
│ ├── members/
│ └── ...
│
├── components/
│ ├── ui/
│ └── home/
│
└── lib/
└── supabase/


---

## Installation

Clone the repository:


git clone https://github.com/its-Matthene-btw/superteam-malaysia.git


Install dependencies:


npm install


Create a `.env.local` file:


NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key


Run the development server:


npm run dev


Open:


http://localhost:3000


---

## Deployment

The project is deployed using **Vercel**.

Build command:


npm run build


---

## Screenshots

*(Placeholder section)*

- Landing Page
- Events Page
- Ecosystem Explorer
- Admin CMS Dashboard

---

## Future Improvements

- Deeper Luma API Integration
- Web3 Wallet Login
- Advanced Member Profiles
- Admin Analytics Dashboard

---

<p align="center">
Built with ❤️ for the <strong>Superteam Malaysia Website Design & Build Challenge</strong>.
</p>