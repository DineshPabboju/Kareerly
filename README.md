# folio. — Modern Job Application Tracker

<p align="center">
  <img src="screenshots/board-overview.png" alt="folio. Kanban Board" width="100%" />
</p>

<p align="center">
  A sleek, distraction-free job application tracking platform with a Kanban pipeline, real-time funnel analytics, drag-and-drop stage management, and isolated multi-user authentication.
</p>

<p align="center">
  <a href="https://folio-job-track.vercel.app">
    <img src="https://img.shields.io/badge/Live_Demo-folio--job--track.vercel.app-f2643b?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo" />
  </a>
  <a href="https://folio-wupk.onrender.com">
    <img src="https://img.shields.io/badge/API_Status-Online-46a35c?style=for-the-badge&logo=render&logoColor=white" alt="API Status" />
  </a>
  <a href="https://github.com/DineshPabboju/folio.">
    <img src="https://img.shields.io/badge/GitHub-Repository-1d2420?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Repo" />
  </a>
</p>

<!-- ---

## 🌐 Live Application

- **Frontend (Vercel)**: [https://folio-job-track.vercel.app](https://folio-job-track.vercel.app)
- **Backend API (Render)**: [https://folio-wupk.onrender.com](https://folio-wupk.onrender.com)
- **Interactive Swagger Docs**: [https://folio-wupk.onrender.com/docs](https://folio-wupk.onrender.com/docs)

--- -->

## ✨ Key Features

- **📋 4-Stage Kanban Pipeline**: Organize job applications across `Wishlist`, `Applied`, `Interviewing`, and `Closed` with custom color indicators and live application counters.
- **🔄 Drag & Drop Workflow**: Fluid native HTML5 drag-and-drop card movement across columns with instant visual feedback and smooth animations.
- **··· Quick Stage Dropdown**: Quick card actions menu with stage indicators, status dots, edit modal triggers, and safe delete options.
- **📊 Application Insights**: In-depth analytics dashboard featuring recruiting funnel progress bars, interview conversion velocity, active pipeline metrics, and upcoming milestone dates.
- **🔍 Instant Search & Quick Filters**: Real-time filtering across company name, position role, location, and personal notes, alongside one-click status filter badges.
- **🔒 Isolated Authentication**: Strict user isolation with Argon2 password hashing and JWT bearer tokens — each registered candidate accesses only their personal pipeline.
- **⚡ Optimistic UI**: Immediate UI updates with automatic rollback on network disruption and live toast notifications.
- **☁️ Production PostgreSQL Ready**: Zero-config cloud PostgreSQL engine with automated table migrations on boot, SSL normalization, and connection pooling.

---

## 📸 Screenshots

### 1. Kanban Pipeline & Board Overview
Manage opportunities visually with real-time response rates and stage-by-stage organization.
![Board Overview](screenshots/board-overview.png)

### 2. Application Insights & Funnel Analytics
Track recruiting conversion rates, interview milestones, and application velocity.
![Application Insights](screenshots/insights-analytics.png)

### 3. User Authentication & Onboarding
Clean, secure onboarding modal with instant session initialization.
![Authentication Modal](screenshots/auth-modal.png)

### 4. Form Validation & UX Feedback
Intuitive client-side and server-side validation with real-time error toasts.
![Form Validation](screenshots/auth-validation.png)

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 18](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Dev Server**: [Vite](https://vitejs.dev/)
- **Styling**: Custom CSS design system inspired by minimalist editorial typography (`Manrope` + `DM Mono`)
- **Drag and Drop**: Native HTML5 Drag & Drop API with optimistic updates
- **HTTP Client**: [Axios](https://axios-http.com/) with automatic Bearer token interceptors
- **Deployment**: [Vercel](https://vercel.com/)

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python 3.12)
- **ASGI Server**: [Uvicorn](https://www.uvicorn.org/)
- **Database ORM**: [SQLAlchemy 2.0](https://www.sqlalchemy.org/) Async with `AsyncSession`
- **Database Engine**:
  - Production: [PostgreSQL](https://www.postgresql.org/) via [`asyncpg`](https://github.com/MagicStack/asyncpg) (Hosted on [Neon](https://neon.tech/))
  - Local: [SQLite](https://www.sqlite.org/) via [`aiosqlite`](https://github.com/omnilib/aiosqlite)
- **Security & Hashing**: [Argon2](https://www.argon2.com/) via `pwdlib` and JWT via `pyjwt`
- **Data Validation**: [Pydantic v2](https://docs.pydantic.dev/) & `pydantic-settings`
- **Deployment**: [Render](https://render.com/)

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: >= 18.x
- **Python**: >= 3.12
- **uv** (recommended) or **pip**
- **Git**

---

### 1. Clone the Repository
```bash
git clone https://github.com/DineshPabboju/folio..git
cd folio.
```

---

### 2. Backend Setup

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   # Using uv (fastest)
   uv venv
   .venv\Scripts\activate   # On Windows
   # source .venv/bin/activate  # On macOS/Linux

   # Install dependencies
   uv pip install -r requirements.txt
   ```

3. Create your `.env` configuration:
   ```bash
   cp .env.example .env
   ```

4. Configure `.env`:
   ```env
   SECRET_KEY=your_strong_secret_key_here
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=1440
   FRONTEND_URL=http://localhost:5173

   # Local SQLite:
   DATABASE_URL=sqlite+aiosqlite:///./app.db

   # Or Cloud PostgreSQL (Neon, Render, Supabase):
   # DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
   ```

5. Run the backend development server:
   ```bash
   uv run uvicorn src.app:app --reload --port 8000
   ```
   The backend will start at `http://127.0.0.1:8000` and automatically create all database tables.

---

### 3. Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in `frontend/`:
   ```env
   # Local backend
   VITE_API_URL=http://127.0.0.1:8000

   # Or production backend
   # VITE_API_URL=https://folio-wupk.onrender.com
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

---

## 📡 API Reference

Interactive OpenAPI documentation is available at `/docs` (e.g. `http://127.0.0.1:8000/docs`).

### Authentication (`/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/auth/signup` | Register a new user account | ❌ |
| `POST` | `/auth/login` | Authenticate user and receive JWT access token | ❌ |
| `GET` | `/auth/me` | Fetch profile details of currently logged-in user | ✅ |

### Job Applications (`/job_applications`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/job_applications` | List applications for authenticated user (supports `?search=` and `?status=`) | ✅ |
| `GET` | `/job_applications/{id}` | Retrieve single application details | ✅ |
| `POST` | `/job_applications` | Create a new job application | ✅ |
| `PATCH` | `/job_applications/{id}/status` | Move application to another stage (`wishlist`, `applied`, `interviewing`, `closed`) | ✅ |
| `PUT` | `/job_applications/{id}` | Update application details (company, role, dates, notes) | ✅ |
| `DELETE` | `/job_applications/{id}` | Delete an application | ✅ |

---

## 🏛️ Architecture & Reliability

- **Dynamic Connection Normalization**: Translates `postgres://` or `postgresql://` connection strings into `postgresql+asyncpg://` and strips libpq-only parameters (`channel_binding`, `sslmode`) into native asyncpg SSL contexts.
- **Offset-Naive UTC Normalization**: Built-in `UTCDateTime` TypeDecorator automatically normalizes timezone-aware timestamps to naive UTC before writing to `TIMESTAMP WITHOUT TIME ZONE` PostgreSQL columns, preventing asyncpg `DataError` exceptions.
- **Cross-Database Status Mapping**: Custom `ApplicationStatusType` maps Python enums to a standard `VARCHAR(50)` check constraint with fuzzy case-insensitivity on database reads.
- **Global CORS Fallback**: Custom global exception handlers ensure that CORS headers are attached even during unhandled server exceptions, eliminating browser CORS false-positives.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👨‍💻 Author

**Dinesh Pabboju**
- **GitHub**: [@DineshPabboju](https://github.com/DineshPabboju)
- **Live Project**: [folio.](https://folio-job-track.vercel.app)
