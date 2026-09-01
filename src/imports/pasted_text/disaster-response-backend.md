# PROMPT: GENERATE LOCAL BACKEND SOURCE CODE + MYSQL DATABASE

You are working on the existing **Disaster Response Coordination Platform** frontend.

The frontend has already been designed and implemented.

Now I need you to prepare the **backend source code and MySQL database files only**.

## VERY IMPORTANT

You are an AI that can work on the frontend project, but **you cannot run, deploy, configure, or directly implement the backend/database on my laptop**.

Therefore:

**DO NOT try to actually run the backend.**

**DO NOT claim that the database has been created.**

**DO NOT claim that the server is running.**

**DO NOT require access to my local MySQL installation.**

Instead, your job is to **WRITE ALL BACKEND SOURCE CODE FILES** and the **MySQL `database.sql` file** that I can later copy to my laptop and run locally.

The final result should be a complete backend codebase that is ready for me to install and run locally.

---

# 1. TECHNOLOGY STACK

The backend must use:

* Node.js
* Express.js
* TypeScript
* MySQL 8+
* mysql2
* JWT
* bcrypt
* Zod
* Multer
* CORS
* dotenv

Do NOT use:

* PostgreSQL
* `pg`
* MongoDB
* Firebase
* Supabase
* Prisma
* unnecessary ORM
* Redis
* Docker
* Kubernetes
* microservices
* GraphQL

Keep the backend simple.

The project is being developed by **3 members within one month**, so maintainability and simplicity are more important than over-engineering.

---

# 2. YOUR JOB

Generate the following:

```text
database.sql
```

and:

```text
server/
```

The `server/` directory must contain all necessary TypeScript source files.

For every file you generate, provide the **complete file content**.

Do not provide pseudocode.

Do not provide incomplete files.

Do not write:

```text
// implement this later
```

or:

```text
// your code here
```

Core backend functionality must have actual implementation.

---

# 3. EXPECTED PROJECT STRUCTURE

Generate a backend structure similar to:

```text
server/
│
├── src/
│   ├── config/
│   │   ├── database.ts
│   │   └── env.ts
│   │
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── user.controller.ts
│   │   ├── report.controller.ts
│   │   ├── task.controller.ts
│   │   ├── issue.controller.ts
│   │   ├── severity.controller.ts
│   │   ├── resource.controller.ts
│   │   ├── inventory.controller.ts
│   │   ├── allocation.controller.ts
│   │   ├── notification.controller.ts
│   │   ├── dashboard.controller.ts
│   │   └── map.controller.ts
│   │
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── role.middleware.ts
│   │   ├── error.middleware.ts
│   │   ├── upload.middleware.ts
│   │   └── validation.middleware.ts
│   │
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   ├── report.routes.ts
│   │   ├── task.routes.ts
│   │   ├── issue.routes.ts
│   │   ├── severity.routes.ts
│   │   ├── resource.routes.ts
│   │   ├── inventory.routes.ts
│   │   ├── allocation.routes.ts
│   │   ├── notification.routes.ts
│   │   ├── dashboard.routes.ts
│   │   └── map.routes.ts
│   │
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── report.service.ts
│   │   ├── task.service.ts
│   │   ├── issue.service.ts
│   │   ├── severity.service.ts
│   │   ├── resource.service.ts
│   │   ├── inventory.service.ts
│   │   ├── allocation.service.ts
│   │   ├── notification.service.ts
│   │   └── dashboard.service.ts
│   │
│   ├── validations/
│   │   ├── auth.validation.ts
│   │   ├── report.validation.ts
│   │   ├── task.validation.ts
│   │   ├── issue.validation.ts
│   │   ├── severity.validation.ts
│   │   ├── resource.validation.ts
│   │   └── inventory.validation.ts
│   │
│   ├── types/
│   │   ├── auth.types.ts
│   │   ├── report.types.ts
│   │   ├── task.types.ts
│   │   ├── issue.types.ts
│   │   └── common.types.ts
│   │
│   ├── utils/
│   │   ├── jwt.ts
│   │   ├── password.ts
│   │   ├── response.ts
│   │   └── id.ts
│   │
│   ├── app.ts
│   └── server.ts
│
├── uploads/
│   └── .gitkeep
│
├── package.json
├── tsconfig.json
├── .env.example
├── .gitignore
└── README.md
```

You may adjust the structure if necessary, but **keep it simple and logical**.

Do not create files that have no real purpose.

---

# 4. DATABASE

Generate:

```text
database.sql
```

The database must use:

```text
MySQL 8+
```

Start with:

```sql
CREATE DATABASE IF NOT EXISTS disaster_response
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE disaster_response;
```

Use:

```text
ENGINE=InnoDB
```

for relational tables.

Use:

```text
utf8mb4
```

because the application contains Bangla text.

---

# 5. REQUIRED TABLES

Create the following tables:

```text
users
locations
reports
report_images
tasks
task_assignments
field_issues
severity_assessments
resources
inventory
inventory_transactions
resource_allocations
notifications
```

You may add a table only if it is genuinely necessary.

Do not create an unnecessarily complicated database.

---

# 6. USERS

Create:

```text
users
```

Fields:

```text
id
name
email
phone
password_hash
role
profile_image
created_at
updated_at
```

Roles:

```text
citizen
volunteer
admin
```

Email must be unique.

Passwords must be stored as bcrypt hashes.

Never expose `password_hash` through API responses.

---

# 7. REPORTS

Create:

```text
reports
```

Fields:

```text
id
report_code
citizen_id
disaster_type
title
description
affected_people
status
severity
severity_score
latitude
longitude
location_name
created_at
updated_at
```

Status:

```text
pending
verified
rejected
```

Severity:

```text
unassessed
low
medium
high
critical
```

Generate unique report codes from the backend.

Example:

```text
RPT-001
RPT-002
```

Do not trust the frontend to generate unique IDs.

---

# 8. REPORT IMAGES

Create:

```text
report_images
```

Fields:

```text
id
report_id
image_url
created_at
```

A report can have multiple images.

Use Multer for local image uploads.

Allowed formats:

```text
jpg
jpeg
png
webp
```

Maximum file size:

```text
5 MB
```

---

# 9. LOCATIONS

Create:

```text
locations
```

Fields:

```text
id
name
district
division
latitude
longitude
created_at
```

Include some Bangladesh demonstration locations.

Use Bangla-compatible database encoding.

---

# 10. TASKS

Create:

```text
tasks
```

Fields:

```text
id
task_code
report_id
title
description
priority
status
progress
location_id
created_by
created_at
updated_at
```

Priority:

```text
low
medium
high
critical
```

Status:

```text
assigned
en_route
in_progress
completed
```

Progress must remain between:

```text
0 and 100
```

---

# 11. TASK ASSIGNMENTS

Create:

```text
task_assignments
```

Fields:

```text
id
task_id
volunteer_id
assigned_by
assigned_at
```

A task can be assigned to a volunteer.

The backend must verify that the selected user actually has:

```text
role = volunteer
```

---

# 12. FIELD ISSUES

Create:

```text
field_issues
```

Fields:

```text
id
issue_code
reported_by
task_id
report_id
issue_type
description
location_name
latitude
longitude
image_url
status
created_at
updated_at
```

Status:

```text
reported
in_progress
resolved
```

---

# 13. SEVERITY ASSESSMENT

Create:

```text
severity_assessments
```

Fields:

```text
id
report_id
affected_people_score
damage_score
medical_emergency_score
road_access_score
shelter_score
total_score
severity_level
assessed_by
created_at
updated_at
```

The backend must calculate the final score.

Use:

```text
0–30 = low
31–60 = medium
61–80 = high
81–100 = critical
```

Update the related report's:

```text
severity
severity_score
```

after assessment.

---

# 14. RESOURCES

Create:

```text
resources
```

Fields:

```text
id
name
category
unit
description
created_at
updated_at
```

Example:

```text
পানি
খাবার
ওষুধ
কম্বল
টর্চ
প্রাথমিক চিকিৎসা সামগ্রী
```

---

# 15. INVENTORY

Create:

```text
inventory
```

Fields:

```text
id
resource_id
quantity
depot_name
location_id
created_at
updated_at
```

Quantity cannot become negative.

---

# 16. INVENTORY TRANSACTIONS

Create:

```text
inventory_transactions
```

Fields:

```text
id
inventory_id
transaction_type
quantity
reference_type
reference_id
created_by
created_at
```

Types:

```text
addition
allocation
adjustment
```

---

# 17. RESOURCE ALLOCATIONS

Create:

```text
resource_allocations
```

Fields:

```text
id
allocation_code
report_id
resource_id
quantity
allocated_by
status
created_at
```

Status:

```text
allocated
cancelled
```

When allocating resources:

1. Begin MySQL transaction.
2. Check inventory.
3. Lock inventory row.
4. Verify sufficient quantity.
5. Decrease inventory.
6. Create allocation.
7. Create inventory transaction.
8. Create notification.
9. Commit.

If anything fails:

```text
ROLLBACK
```

Inventory must never become negative.

---

# 18. NOTIFICATIONS

Create:

```text
notifications
```

Fields:

```text
id
user_id
title
message
type
reference_type
reference_id
is_read
created_at
```

Users can only see their own notifications.

---

# 19. AUTHENTICATION API

Implement:

```text
POST /api/v1/auth/register
POST /api/v1/auth/login
GET  /api/v1/auth/me
POST /api/v1/auth/logout
```

Use JWT authentication.

Use bcrypt for password hashing.

Do not allow registration requests to create an admin account.

---

# 20. REPORT API

Implement:

```text
POST   /api/v1/reports
GET    /api/v1/reports
GET    /api/v1/reports/:id
PATCH  /api/v1/reports/:id
DELETE /api/v1/reports/:id
PATCH  /api/v1/reports/:id/status
```

Citizens can create reports.

Citizens can only view their own reports.

Admins can view all reports.

Only admins can verify/reject reports.

---

# 21. TASK API

Implement:

```text
POST  /api/v1/tasks
GET   /api/v1/tasks
GET   /api/v1/tasks/:id
POST  /api/v1/tasks/:id/assign
PATCH /api/v1/tasks/:id
PATCH /api/v1/tasks/:id/status
```

Admins create and assign tasks.

Volunteers can view tasks assigned to them.

Volunteers can update only their own assigned tasks.

---

# 22. FIELD ISSUE API

Implement:

```text
POST  /api/v1/issues
GET   /api/v1/issues
GET   /api/v1/issues/:id
PATCH /api/v1/issues/:id/status
```

Volunteers can report field issues.

Admins can manage issue status.

---

# 23. SEVERITY API

Implement:

```text
POST /api/v1/reports/:id/severity
GET  /api/v1/reports/:id/severity
```

The server must calculate severity.

Do not blindly trust a severity value supplied by the frontend.

---

# 24. RESOURCE API

Implement:

```text
GET   /api/v1/resources
POST  /api/v1/resources
PATCH /api/v1/resources/:id
```

Only admins can create/update resources.

---

# 25. INVENTORY API

Implement:

```text
GET   /api/v1/inventory
POST  /api/v1/inventory
PATCH /api/v1/inventory/:id
GET   /api/v1/inventory/transactions
```

Only admins can modify inventory.

---

# 26. ALLOCATION API

Implement:

```text
POST /api/v1/allocations
GET  /api/v1/allocations
GET  /api/v1/allocations/:id
```

Only admins can allocate resources.

Use MySQL transactions.

Use row locking when checking inventory.

---

# 27. NOTIFICATION API

Implement:

```text
GET   /api/v1/notifications
PATCH /api/v1/notifications/:id/read
PATCH /api/v1/notifications/read-all
```

---

# 28. DASHBOARD API

Implement:

```text
GET /api/v1/dashboard/citizen
GET /api/v1/dashboard/volunteer
GET /api/v1/dashboard/admin
```

Return real database information.

Do not use hardcoded dashboard numbers.

---

# 29. MAP API

Implement:

```text
GET /api/v1/map/incidents
GET /api/v1/map/tasks
GET /api/v1/map/issues
```

Return:

```text
id
code
latitude
longitude
severity/status
locationName
```

as appropriate.

---

# 30. ROLE PERMISSIONS

Implement backend authorization.

### Citizen

Can:

```text
register
login
create report
view own reports
edit own profile
view notifications
```

Cannot:

```text
verify reports
manage inventory
allocate resources
manage other users
```

### Volunteer

Can:

```text
login
view assigned tasks
update assigned tasks
report field issues
view notifications
edit profile
```

Cannot:

```text
verify reports
allocate resources
modify inventory
```

### Admin

Can:

```text
manage reports
verify/reject reports
create tasks
assign volunteers
manage issues
manage severity
manage resources
manage inventory
allocate resources
view dashboards
```

---

# 31. SECURITY

Implement:

```text
JWT authentication
bcrypt passwords
Zod validation
role authorization
parameterized MySQL queries
centralized error handling
CORS
file validation
file size validation
```

Never concatenate user input directly into SQL.

Use:

```typescript
pool.execute(sql, values)
```

with parameterized values.

---

# 32. MYSQL CONNECTION

Use:

```typescript
mysql2/promise
```

Create a connection pool.

Environment variables:

```text
DB_HOST
DB_PORT
DB_USER
DB_PASSWORD
DB_NAME
```

Do not hardcode credentials.

---

# 33. ENVIRONMENT FILE

Generate:

```text
.env.example
```

containing:

```text
PORT=5000

NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=disaster_response

JWT_SECRET=change_this_secret
JWT_EXPIRES_IN=7d

FRONTEND_URL=http://localhost:5173

MAX_FILE_SIZE=5242880
```

---

# 34. PACKAGE.JSON

Generate a working `package.json`.

Required dependencies should include only what is necessary:

```text
express
mysql2
bcrypt
jsonwebtoken
zod
multer
cors
dotenv
```

Development dependencies:

```text
typescript
tsx
@types/node
@types/express
@types/bcrypt
@types/jsonwebtoken
@types/multer
```

Add scripts:

```text
npm run dev
npm run build
npm start
npm run typecheck
```

---

# 35. TYPESCRIPT CONFIGURATION

Generate:

```text
tsconfig.json
```

Use strict TypeScript.

Prefer:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "dist"
  }
}
```

Adjust if necessary so the generated project actually compiles.

---

# 36. HEALTH CHECK

Implement:

```text
GET /api/v1/health
```

Return something like:

```json
{
  "success": true,
  "message": "Server is running"
}
```

Preferably check the MySQL connection too.

---

# 37. STANDARD RESPONSE FORMAT

Use:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

For errors:

```json
{
  "success": false,
  "message": "Something went wrong"
}
```

For lists:

```json
{
  "success": true,
  "data": [],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

Keep API responses consistent.

---

# 38. PAGINATION

Support:

```text
?page=1&limit=20
```

for large lists.

Maximum limit should be reasonable, for example:

```text
100
```

---

# 39. SEARCH AND FILTERING

Reports should support:

```text
status
severity
disasterType
search
page
limit
```

Example:

```text
GET /api/v1/reports?status=pending
GET /api/v1/reports?severity=critical
GET /api/v1/reports?search=সুনামগঞ্জ
```

Use parameterized SQL.

---

# 40. AUTOMATIC NOTIFICATIONS

Implement notifications for:

```text
new report
report verified
report rejected
task assigned
task completed
field issue reported
resource allocated
```

Examples:

```text
Citizen creates report
→ Admin notification

Admin verifies report
→ Citizen notification

Admin assigns task
→ Volunteer notification

Volunteer completes task
→ Admin notification
```

---

# 41. DEMO DATA

Include seed/demo data inside `database.sql`.

Include:

```text
1 demo citizen
1 demo volunteer
1 demo admin

8–12 disaster reports
6–10 tasks
4–6 field issues
8–12 resources
inventory records
notifications
severity assessments
resource allocations
```

Use realistic Bangladesh-focused data.

Use Bangla descriptions where appropriate.

---

# 42. DEMO ACCOUNTS

Create demo users in `database.sql`.

Use:

```text
citizen@example.com
volunteer@example.com
admin@example.com
```

Passwords must be stored as bcrypt hashes.

Document the demo login credentials in `README.md`.

---

# 43. FRONTEND COMPATIBILITY

The existing frontend already exists.

Before generating backend response structures, inspect the frontend code and identify:

```text
API expectations
field names
route names
status values
authentication flow
dashboard data requirements
report structure
task structure
notification structure
```

The backend must be compatible with the existing frontend.

If the frontend currently uses mock data, the backend API should replace those mock data sources.

Do not redesign the frontend.

---

# 44. FRONTEND API BASE URL

The frontend should be able to use:

```text
VITE_API_URL=http://localhost:5000/api/v1
```

Do not hardcode API URLs throughout frontend components.

If an API service layer already exists, adapt it instead of creating unnecessary duplicate services.

---

# 45. NO MOCK BACKEND

Do not generate fake endpoints such as:

```typescript
return mockReports;
```

The backend must use MySQL.

The frontend can initially contain mock data, but the generated backend itself must be designed for real MySQL data.

---

# 46. FILE UPLOADS

Use:

```text
server/uploads/
```

for local uploaded images.

Configure Express to serve:

```text
/uploads/filename
```

Validate:

```text
file type
file size
```

Do not accept executable files.

---

# 47. TRANSACTIONS

Use MySQL transactions for operations such as:

### Resource allocation

```text
BEGIN
↓
SELECT inventory FOR UPDATE
↓
check quantity
↓
UPDATE inventory
↓
INSERT allocation
↓
INSERT inventory transaction
↓
INSERT notification
↓
COMMIT
```

### Task assignment

```text
BEGIN
↓
verify task
↓
verify volunteer
↓
insert assignment
↓
insert notification
↓
COMMIT
```

Rollback if any step fails.

---

# 48. ERROR HANDLING

Create centralized error middleware.

Handle:

```text
400
401
403
404
409
422
500
```

Do not expose internal database errors, passwords, JWT secrets, or stack traces to users.

---

# 49. README

Generate:

```text
server/README.md
```

The README must explain exactly how **I can run the generated backend on my own laptop**.

Include:

## Requirements

```text
Node.js
MySQL 8+
npm
```

## Installation

```bash
cd server
npm install
```

## Database setup

Explain how to import:

```text
database.sql
```

using both:

```text
MySQL command line
```

and, if useful:

```text
MySQL Workbench
```

For example:

```bash
mysql -u root -p < database.sql
```

## Environment setup

Explain:

```text
.env.example
→
.env
```

and explain each database variable.

## Start server

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Production start

```bash
npm start
```

## Health check

```text
http://localhost:5000/api/v1/health
```

---

# 50. API DOCUMENTATION

Document all generated endpoints.

Include:

```text
method
endpoint
authentication requirement
role
request body
response example
```

Keep it simple enough for the three team members to understand.

---

# 51. TEAM-FRIENDLY CODE

Remember:

**3 developers + 1 month**

Therefore:

* Keep functions understandable.
* Keep controllers reasonably small.
* Keep business logic in services.
* Use clear names.
* Avoid unnecessary abstraction.
* Avoid unnecessary design patterns.
* Add comments only where they improve understanding.
* Keep SQL readable.
* Keep API behavior predictable.

---

# 52. FINAL FILE LIST

Before finishing, make sure you have generated:

```text
database.sql

server/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   ├── types/
│   ├── utils/
│   ├── validations/
│   ├── app.ts
│   └── server.ts
│
├── uploads/
│   └── .gitkeep
│
├── package.json
├── tsconfig.json
├── .env.example
├── .gitignore
└── README.md
```

You may change the exact structure if there is a good reason, but every required functionality must still be implemented.

---

# 53. VERY IMPORTANT OUTPUT FORMAT

Do not just explain the backend.

**GENERATE THE ACTUAL FILE CONTENT.**

For example:

```text
database.sql
```

then provide the complete SQL.

Then:

```text
server/package.json
```

and provide the complete file.

Then:

```text
server/tsconfig.json
```

and provide the complete file.

Then:

```text
server/src/config/database.ts
```

and provide the complete file.

Continue until all required files are provided.

---

# 54. DO NOT CLAIM TO RUN ANYTHING

You are only generating source files.

Do NOT say:

```text
Database successfully created.
```

Do NOT say:

```text
Server successfully started.
```

Do NOT say:

```text
MySQL connection verified.
```

unless you actually have the ability to perform those operations.

Instead, provide instructions so **I can perform them locally**.

---

# 55. FINAL OBJECTIVE

The final output should give me everything necessary to manually create this structure on my laptop:

```text
Disaster Response Platform
│
├── Frontend
│
├── Backend
│   └── server/
│
└── MySQL
    └── database.sql
```

I will personally:

1. Create the `server` folder.
2. Copy your generated files into it.
3. Install Node.js dependencies.
4. Install/configure MySQL.
5. Import `database.sql`.
6. Create `.env`.
7. Run the backend locally.
8. Connect the existing frontend to the backend.

Your responsibility is to provide **complete, consistent, compatible backend source code and database SQL** so that these steps are straightforward.

**Do not attempt to build the backend yourself.**

**Do not attempt to access my local database.**

**Do not deploy anything.**

**Only generate the files and instructions I need to implement the backend locally.**
