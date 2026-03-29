# Help2Others

# 🌊 H2O — Food Donation Web Application

## 📌 Overview

**H2O (Help2Others)** is a web platform that connects **food donors** with **NGOs**, **social workers**, and **delivery pickers** so surplus food can be listed, requested, and tracked through its lifecycle. Donors describe food, pickup windows, and **manual address details** (street, city, postal code). The app focuses on **form-based location text** and **district or city filters**, not GPS or map-based geolocation.

Goals:

- Reduce food waste by making donations visible and actionable.
- Give coordinators simple **status updates** (for example picked up, delivered).
- Support **one-time** and **recurring** donation schedules where implemented.

---

## 🚀 Features

| Area | What you get |
|------|----------------|
| **Donations** | Create listings with food type, quantity, unit, description, optional photo, expiry, pickup window, address fields, special instructions. |
| **Recurring donations** | Optional schedules (e.g. daily, weekly) with follow-up rows for the next occurrence. |
| **Discovery** | Fetch donor listings **by district** (implemented using the **city** field as the district key in the API). |
| **Coordination** | Simulated **notify social worker** flow that returns placeholder assignee details (ready to swap for real email/SMS). |
| **Status** | **PATCH** endpoint to update donation status for workflows involving social workers and pickers. |
| **Dashboards** | Separate UI areas for donors, social workers, and delivery pickers (React routes and components). |

**Not part of this project’s documented design (per product scope):**

- **No JWT-based authentication** in the main documented API flow (no token login flow described here).
- **No production geolocation stack** — no reliance on browser GPS, Google Maps APIs, or map matching for “nearby” donors; proximity is expressed through **address text** and **city/district** filters.

---

## 🛠️ Tech stack

| Layer | Technology |
|------|------------|
| **Frontend** | React 19, Vite 6, React Router 7, Axios, Lucide React |
| **Backend (primary)** | Node.js, Express 5, `mysql2`, Multer (image uploads), CORS |
| **Database** | **MySQL** (database name used in code: `food_donation_db`) |
| **Optional / additional** | Java 17 + **Spring Boot 3.1** + Spring Data JPA under `Help2Others/backend/backend` (Maven) — separate REST layer; configure datasource separately if you use it |

**Hosting:** Suitable for any Node + MySQL host (e.g. Railway, Render, a VPS) and a static or SSR frontend host (e.g. Vercel for the built Vite app). Adjust CORS and API base URLs for production.

---

## 📁 Repository layout

```
Help2Others/
├── backend/                 # Express API (server.js), uploads/, npm dependencies
│   └── backend/             # Spring Boot Maven project (optional)
└── frontend/                # Vite + React app (npm run dev)
```

If you also have a nested `frontend/frontend` copy in your tree, use **one** active frontend folder and point your scripts to that tree to avoid confusion.

---

## ✅ Prerequisites

- **Node.js** (LTS recommended) and npm  
- **MySQL** 8.x (or compatible) with a user that can create/use `food_donation_db`  
- **Java 17** and **Maven** (only if you run the Spring Boot submodule)

---

## 🗄️ Database setup

1. Create the database:
   ```sql
   CREATE DATABASE food_donation_db;
   ```
2. Create tables expected by the Express app. At minimum the code references:
   - **`donations1`** — main insert/update path for new donations and status updates (columns include `food_type`, `description`, `quantity`, `unit`, `image_url`, datetimes, `is_recurring`, `recurring_frequency`, `address`, `city`, `zip_code`, `special_instructions`, `status`, `donation_id`, `created_at`, etc.).
   - **`recurring_schedules`** — `donation_id`, `next_occurrence_date`.
   - **`donations`** — referenced by `GET /api/donations` (align this with `donations1` in your schema or adjust the route for a single table).

Exact `CREATE TABLE` statements are not committed in this repo; derive them from `server.js` and your migration practice, or use Spring Boot `ddl-auto` only for the JPA entities in the Java module (keep Express and JPA schemas in sync if you use both).

3. **Security:** Replace hardcoded MySQL credentials in `server.js` and `application.properties` with environment variables before deploying.

---

## 📦 Installation and local run

### 1. Clone the repository

```bash
git clone https://github.com/your-username/Help2Others.git
cd Help2Others/Help2Others
```

(Adjust the folder depth if your clone puts `backend` and `frontend` directly under the repo root.)

### 2. Backend (Express)

```bash
cd backend
npm install
```

Configure MySQL `host`, `user`, `password`, and `database` in `server.js` (or refactor to `process.env`).

Ensure an `uploads/` directory exists next to `server.js` (Multer writes there).

```bash
npm start
```

The API listens on **`http://localhost:5000`** by default (`PORT` env overrides).

### 3. Frontend (Vite + React)

```bash
cd ../frontend
npm install
npm run dev
```

Open the URL printed in the terminal (typically **`http://localhost:5173`**).

Point the frontend Axios base URL to `http://localhost:5000` (or your deployed API) wherever API calls are configured.

### 4. Optional: Spring Boot API

```bash
cd ../backend/backend
mvn spring-boot:run
```

Use `application.properties` (or profiles) for datasource settings. This service is independent of Express unless you unify ports and routes.

---

## 🔌 API reference (Express)

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/donations` | Create donation (`multipart/form-data`; optional `image` file; JSON fields for food and pickup metadata). |
| `GET` | `/api/donations` | List donations (implementation queries table `donations`). |
| `GET` | `/api/donors?district=<name>` | List donors where `city` matches the given district. |
| `POST` | `/api/notify-social-worker` | Body: `{ "district": "..." }` — simulated assignment response. |
| `PATCH` | `/api/donations/:donation_id/status` | Body: `{ "status": "..." }` — update row in `donations1`. |
| Static | `/uploads/...` | Served files from Multer uploads. |

---

## 📜 Scripts summary

| Location | Command | Purpose |
|----------|---------|---------|
| `backend` | `npm start` | Run Express on port 5000 |
| `backend` | `npm run dev` | Run with nodemon (if configured) |
| `frontend` | `npm run dev` | Vite dev server |
| `frontend` | `npm run build` | Production build |
| `frontend` | `npm run preview` | Preview production build |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome.

1. Fork the repository  
2. Create a branch: `git checkout -b feature/your-feature`  
3. Commit: `git commit -m "Add your feature"`  
4. Push: `git push origin feature/your-feature`  
5. Open a Pull Request  

---

## 📄 License

This project is licensed under the **MIT License** — see the `LICENSE` file if present in the repository.

---

## 🙌 Acknowledgements

- NGOs and food donors supporting food redistribution  
- Open-source contributors and maintainers of React, Vite, Express, and MySQL tooling  
- Everyone reporting issues and suggesting improvements  
