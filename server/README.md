# Disaster Response Platform — Backend Server

Node.js + Express + TypeScript + MySQL API for the Disaster Response Coordination Platform.

---

## Requirements

| Tool | Version |
|------|---------|
| Node.js | 18+ |
| npm | 9+ |
| MySQL | 8+ |

---

## Installation

```bash
cd server
npm install
```

---

## Database setup

### Option A — MySQL command line

```bash
mysql -u root -p < ../database.sql
```

### Option B — MySQL Workbench

1. Open MySQL Workbench.
2. Go to **Server → Data Import**.
3. Choose **Import from Self-Contained File**.
4. Select `database.sql` from the project root.
5. Click **Start Import**.

---

## Environment setup

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Edit `.env`:

```
PORT=5000               # Port the server will listen on

NODE_ENV=development    # development | production

DB_HOST=localhost       # MySQL host
DB_PORT=3306            # MySQL port (default 3306)
DB_USER=root            # MySQL username
DB_PASSWORD=secret      # MySQL password — CHANGE THIS
DB_NAME=disaster_response

JWT_SECRET=change_me    # Long random string — CHANGE THIS
JWT_EXPIRES_IN=7d       # Token lifetime

FRONTEND_URL=http://localhost:5173   # Allowed CORS origin

MAX_FILE_SIZE=5242880   # 5 MB in bytes
```

---

## Start server

### Development (hot reload)

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Production start

```bash
npm start
```

### Type check only

```bash
npm run typecheck
```

---

## Health check

After starting the server, visit:

```
http://localhost:5000/api/v1/health
```

Expected response:

```json
{ "success": true, "message": "Server is running", "db": "connected" }
```

---

## Demo accounts

All passwords: **demo1234**

| Role | Email |
|------|-------|
| Citizen | citizen@example.com |
| Volunteer | volunteer@example.com |
| Admin | admin@example.com |

---

## API Reference

All endpoints are prefixed with `/api/v1`.

### Authentication

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/auth/register` | — | — | Register citizen or volunteer |
| POST | `/auth/login` | — | — | Login, returns JWT |
| GET | `/auth/me` | JWT | any | Current user info |
| POST | `/auth/logout` | JWT | any | Logout (client discards token) |

**Register body:**
```json
{ "name": "নাম", "email": "user@example.com", "password": "secret", "role": "citizen" }
```

**Login body:**
```json
{ "email": "user@example.com", "password": "secret" }
```

**Login response:**
```json
{ "success": true, "data": { "user": { ... }, "token": "eyJ..." } }
```

---

### Reports

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/reports` | JWT | citizen | Submit report (multipart/form-data with optional `images[]`) |
| GET | `/reports` | JWT | any | List reports (citizens see only their own) |
| GET | `/reports/:id` | JWT | any | Get single report |
| PATCH | `/reports/:id/status` | JWT | admin | Change status |
| DELETE | `/reports/:id` | JWT | citizen/admin | Delete report |

**Query params:** `?status=pending&severity=high&disasterType=বন্যা&search=সুনামগঞ্জ&page=1&limit=20`

---

### Tasks

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/tasks` | JWT | admin | Create task |
| GET | `/tasks` | JWT | admin/volunteer | List tasks (volunteers see only assigned) |
| GET | `/tasks/:id` | JWT | admin/volunteer | Get task |
| POST | `/tasks/:id/assign` | JWT | admin | Assign volunteer |
| PATCH | `/tasks/:id` | JWT | admin | Update task fields |
| PATCH | `/tasks/:id/status` | JWT | admin/volunteer | Update status/progress |

---

### Field Issues

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/issues` | JWT | volunteer | Report field issue (optional `image` file) |
| GET | `/issues` | JWT | admin/volunteer | List issues |
| GET | `/issues/:id` | JWT | admin/volunteer | Get issue |
| PATCH | `/issues/:id/status` | JWT | admin | Update status |

---

### Severity Assessment

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/reports/:id/severity` | JWT | admin | Create/update assessment |
| GET | `/reports/:id/severity` | JWT | any | Get assessment |

**Body:** `{ "affected_people_score": 18, "damage_score": 16, "medical_emergency_score": 14, "road_access_score": 16, "shelter_score": 14 }`  
Each score 0–20. Total auto-computed. 0–30 = low, 31–60 = medium, 61–80 = high, 81–100 = critical.

---

### Resources

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/resources` | JWT | any | List resources |
| POST | `/resources` | JWT | admin | Create resource |
| PATCH | `/resources/:id` | JWT | admin | Update resource |

---

### Inventory

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/inventory` | JWT | admin | List inventory |
| POST | `/inventory` | JWT | admin | Add inventory item |
| PATCH | `/inventory/:id` | JWT | admin | Update quantity/depot |
| GET | `/inventory/transactions` | JWT | admin | Transaction log |

---

### Resource Allocations

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/allocations` | JWT | admin | Allocate resource (transactional) |
| GET | `/allocations` | JWT | admin | List allocations |
| GET | `/allocations/:id` | JWT | admin | Get allocation |

---

### Notifications

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/notifications` | JWT | any | My notifications |
| PATCH | `/notifications/:id/read` | JWT | any | Mark one as read |
| PATCH | `/notifications/read-all` | JWT | any | Mark all as read |

---

### Dashboard

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/dashboard/citizen` | JWT | citizen | Citizen stats + recent reports |
| GET | `/dashboard/volunteer` | JWT | volunteer | Task stats + active tasks |
| GET | `/dashboard/admin` | JWT | admin | Platform-wide overview |

---

### Map

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/map/incidents` | JWT | any | All non-rejected reports with coordinates |
| GET | `/map/tasks` | JWT | any | Tasks with location |
| GET | `/map/issues` | JWT | any | Open field issues with coordinates |

---

## Standard response format

**Success:**
```json
{ "success": true, "message": "...", "data": {} }
```

**Paginated list:**
```json
{ "success": true, "data": [], "meta": { "page": 1, "limit": 20, "total": 100, "totalPages": 5 } }
```

**Error:**
```json
{ "success": false, "message": "..." }
```

---

## Frontend integration

The existing frontend uses `VITE_API_URL` as the base URL.  
Add to the frontend's `.env`:

```
VITE_API_URL=http://localhost:5000/api/v1
```

Replace mock data service calls with `fetch` or `axios` calls to the above endpoints, passing the JWT from `localStorage` / `sessionStorage` in the `Authorization: Bearer <token>` header.
