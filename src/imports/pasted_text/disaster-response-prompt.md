# Real-Time Disaster Response Coordination Platform

## Frontend Development Prompt — Part 1 of 3

You are an expert frontend engineer and UI/UX designer.

Build a modern, responsive, production-quality **frontend-only web application** for a university course project called:

**"দুর্যোগ প্রতিক্রিয়া সমন্বয় প্ল্যাটফর্ম"**

English subtitle:

**"Real-Time Disaster Response Coordination Platform"**

The project is designed for Bangladesh and focuses on coordinating citizens, volunteers/field workers, and administrators during floods, cyclones, and other disasters.

The frontend must be developed using:

* React.js
* React Router
* Leaflet.js / React Leaflet
* Modern CSS or Tailwind CSS
* Reusable React components
* Mock/local JSON data for frontend demonstration
* No backend implementation in this phase
* No unnecessary external dependencies

The final frontend should look like a **real emergency-response platform**, not like a generic student dashboard.

---

# 1. IMPORTANT PROJECT CONSTRAINT

There are **3 team members** and the complete project must be finished within **1 month**.

Therefore:

* Keep the architecture simple.
* Avoid unnecessary over-engineering.
* Build reusable components.
* Do not create features that are outside the project scope.
* Do not implement complex AI unless represented with a simple frontend simulation.
* Do not build a complicated state-management system unless necessary.
* Use mock data wherever backend APIs would normally be required.
* Every page must be achievable by a 3-person student team within approximately 4 weeks.
* Prioritize functionality, usability, and presentation quality.

The frontend should be structured so that three developers can work on different modules without constantly modifying the same files.

Recommended division:

### Member 1 — Citizen / Reporter

Responsible for:

* Landing page
* Authentication UI
* Citizen dashboard
* Disaster reporting
* Photo upload UI
* Location sharing UI
* Report tracking

### Member 2 — Volunteer / Field Worker

Responsible for:

* Volunteer dashboard
* Disaster map
* Assigned tasks
* Task status updates
* Field exception tagging

### Member 3 — Coordinator / Admin

Responsible for:

* Admin dashboard
* Report verification
* Severity scoring interface
* Resource allocation
* Inventory management
* Operational monitoring

The project presentation defines these three user roles and their responsibilities.

---

# 2. LANGUAGE REQUIREMENT

The interface should primarily use **Bangla**.

Use natural Bangla terminology rather than awkward direct translations.

Examples:

* Dashboard → ড্যাশবোর্ড
* Home → হোম
* Report Disaster → দুর্যোগের তথ্য দিন
* Disaster Report → দুর্যোগের প্রতিবেদন
* Volunteer → স্বেচ্ছাসেবক
* Field Worker → মাঠকর্মী
* Coordinator → সমন্বয়কারী
* Administrator → প্রশাসক
* Incident → ঘটনা
* Location → অবস্থান
* Submit → জমা দিন
* Verify → যাচাই করুন
* Pending → অপেক্ষমাণ
* Verified → যাচাইকৃত
* Rejected → বাতিল
* Completed → সম্পন্ন
* En Route → পথে রয়েছে
* Resources → ত্রাণ সামগ্রী
* Inventory → মজুত ব্যবস্থাপনা
* Severity → দুর্যোগের তীব্রতা
* Priority → অগ্রাধিকার
* Emergency → জরুরি অবস্থা

Where useful, show English terminology as a smaller secondary label.

Example:

**দুর্যোগের তীব্রতা**
`Severity Score`

Do not translate technical terms so aggressively that the UI becomes unnatural.

---

# 3. VISUAL DESIGN SYSTEM

Create a clean emergency-response visual identity.

## Primary color

Use a soft/light green based theme.

Primary:

`#2E7D5B`

Secondary light green:

`#E8F5E9`

Very light green background:

`#F4FBF6`

Dark green:

`#185C43`

Use green to communicate:

* safety
* coordination
* recovery
* verified information
* completed operations

## Supporting colors

White:

`#FFFFFF`

Background:

`#F7F9F8`

Text:

`#17221D`

Secondary text:

`#66736D`

Border:

`#DCE6E0`

Warning:

`#F59E0B`

Danger:

`#DC2626`

Info:

`#2563EB`

Success:

`#16A34A`

Do NOT make the entire interface green.

Use green mainly for:

* primary buttons
* active navigation
* important cards
* verified states
* positive indicators

Use white and very light gray/green for the majority of the UI.

---

# 4. DESIGN STYLE

The design should feel like a combination of:

* emergency management system
* modern Bangladeshi civic service
* professional SaaS dashboard
* humanitarian coordination platform

Avoid:

* excessive gradients
* excessive rounded cards
* childish illustrations
* neon colors
* excessive animations
* glassmorphism everywhere
* overly decorative UI
* huge unnecessary headings

Use:

* clean cards
* subtle shadows
* clear hierarchy
* readable typography
* consistent spacing
* meaningful icons
* responsive layouts
* clear status colors
* maps and data visualization

Use moderately rounded corners:

`10px – 14px`

Buttons:

`8px – 10px`

Cards:

`12px – 16px`

---

# 5. TYPOGRAPHY

Use a Bangla-friendly font.

Preferred:

**Noto Sans Bengali**

Fallback:

`system-ui, sans-serif`

Typography hierarchy:

### Main heading

32–40px desktop

### Section heading

22–28px

### Card heading

16–20px

### Body

14–16px

### Small metadata

12–13px

Make Bangla text highly readable.

Avoid tiny Bangla text.

---

# 6. GLOBAL APPLICATION STRUCTURE

Create the following frontend structure:

```text
src/
│
├── components/
│   ├── common/
│   ├── layout/
│   ├── navigation/
│   ├── cards/
│   ├── maps/
│   ├── forms/
│   ├── status/
│   └── charts/
│
├── pages/
│   ├── public/
│   ├── auth/
│   ├── citizen/
│   ├── volunteer/
│   └── admin/
│
├── data/
│   ├── mockReports.js
│   ├── mockTasks.js
│   ├── mockResources.js
│   ├── mockUsers.js
│   └── mockIncidents.js
│
├── routes/
│
├── hooks/
│
├── utils/
│
├── assets/
│
├── App.jsx
├── main.jsx
└── index.css
```

Keep components reusable.

For example:

```text
Button
Modal
Badge
StatusBadge
StatCard
DataTable
SearchBar
FilterBar
Sidebar
TopNavbar
NotificationDropdown
ConfirmDialog
EmptyState
LoadingState
MapContainer
```

---

# 7. RESPONSIVE REQUIREMENT

The entire application must work on:

* Desktop
* Laptop
* Tablet
* Mobile

Desktop is the primary target because this is a university web application.

However, the interface must not break on mobile.

Responsive behavior:

### Desktop

Sidebar + content area.

### Tablet

Collapsible sidebar.

### Mobile

Bottom navigation or hamburger menu.

Tables should become:

* horizontally scrollable
  OR
* responsive cards.

Maps should remain usable on small screens.

---

# 8. GLOBAL NAVIGATION

Create role-based navigation.

## Public navigation

Navbar:

```text
লোগো
হোম
কীভাবে কাজ করে
আমাদের লক্ষ্য
যোগাযোগ
লগইন
নিবন্ধন
```

Primary CTA:

**জরুরি তথ্য দিন**

---

# 9. PLATFORM LOGO

Create a simple text/icon-based logo.

Concept:

A combination of:

* location pin
* helping hands
* small disaster/emergency symbol

Logo text:

**দুর্যোগ সাড়া**

Secondary:

**Disaster Response**

Do not use a complicated logo.

The logo should work in:

* navbar
* sidebar
* login page
* mobile header

---

# 10. PUBLIC LANDING PAGE

Route:

```text
/
```

Build a highly polished landing page.

The hero section should immediately communicate the purpose of the system.

## Hero

Large heading:

**দুর্যোগের সময় দ্রুত সাড়া, একসাথে সমন্বিত উদ্যোগ**

Subtitle:

**নাগরিক, স্বেচ্ছাসেবক এবং প্রশাসনকে একটি প্ল্যাটফর্মে যুক্ত করে দুর্যোগ মোকাবিলায় দ্রুত ও কার্যকর সমন্বয়।**

Primary button:

**দুর্যোগের তথ্য দিন**

Secondary button:

**প্ল্যাটফর্ম সম্পর্কে জানুন**

Hero visual:

Show a simplified disaster-response map with:

* affected areas
* volunteer markers
* relief camps
* resource markers

Do not require real backend data.

Use mock data.

---

# 11. EMERGENCY BANNER

Immediately below or integrated into the hero:

Create an emergency information banner.

Example:

**জরুরি পরিস্থিতি?**

**নিকটস্থ বিপদ সম্পর্কে এখনই তথ্য দিন।**

Button:

**রিপোর্ট করুন**

Use red/orange only for the emergency indicator.

Do not make the entire page red.

---

# 12. PROBLEM SECTION

Heading:

**কেন এই প্ল্যাটফর্ম?**

Show four problems:

### ১. সমন্বয়ের অভাব

বিভিন্ন সংস্থা ও স্বেচ্ছাসেবক আলাদাভাবে কাজ করলে জরুরি সহায়তা পৌঁছাতে দেরি হয়।

### ২. তথ্যের বিলম্ব

ম্যানুয়াল যোগাযোগের কারণে গুরুত্বপূর্ণ তথ্য দ্রুত ছড়িয়ে পড়ে না।

### ৩. ত্রাণের অপচয়

একই এলাকায় অতিরিক্ত সহায়তা গেলেও অন্য এলাকায় প্রয়োজনীয় সামগ্রী পৌঁছাতে পারে না।

### ৪. অগ্রাধিকার নির্ধারণের সমস্যা

কোন এলাকায় আগে সহায়তা পাঠানো উচিত তা নির্ধারণ করা কঠিন হয়।

These problems are directly aligned with the project's stated motivation and problem statement.

---

# 13. HOW IT WORKS SECTION

Create a 5-step visual process.

### Step 1

**তথ্য দিন**

নাগরিক দুর্যোগের তথ্য ও অবস্থান পাঠায়।

### Step 2

**যাচাই করুন**

প্রশাসক রিপোর্ট যাচাই করে।

### Step 3

**তীব্রতা নির্ধারণ**

সিস্টেম দুর্যোগের তীব্রতা অনুযায়ী অগ্রাধিকার নির্ধারণ করে।

### Step 4

**সহায়তা বরাদ্দ**

প্রয়োজন অনুযায়ী ত্রাণ ও সম্পদ বরাদ্দ করা হয়।

### Step 5

**মাঠপর্যায়ে কার্যক্রম**

স্বেচ্ছাসেবক কাজ গ্রহণ করে এবং অগ্রগতি আপডেট করে।

This follows the project's proposed workflow from report submission to task completion.

Use a horizontal timeline on desktop and vertical timeline on mobile.

---

# 14. CORE FEATURES SECTION

Create feature cards for:

### Live Incident Reporting

**রিয়েল-টাইম দুর্যোগ রিপোর্টিং**

Citizens can submit disaster information with location and photos.

### Interactive Map

**ইন্টার‌্যাক্টিভ দুর্যোগ মানচিত্র**

Display affected zones, relief camps, and resources.

### Volunteer Task Tracking

**স্বেচ্ছাসেবক কাজের ট্র্যাকিং**

Volunteers can receive tasks and update their status.

### Field Exception Tagging

**মাঠপর্যায়ের সমস্যা জানানো**

Quickly report:

* রাস্তা বন্ধ
* অতিরিক্ত ত্রাণ প্রয়োজন
* নৌকা প্রয়োজন
* চিকিৎসা সহায়তা প্রয়োজন

### Admin Verification

**রিপোর্ট যাচাই**

Administrators verify citizen reports.

### Severity Scoring

**দুর্যোগের তীব্রতা নির্ধারণ**

Rank affected areas based on severity.

### Resource Allocation

**ত্রাণ বরাদ্দ**

Match available resources with high-priority locations.

### Inventory Management

**ত্রাণ মজুত ব্যবস্থাপনা**

Track food, medicine, water, and other resources.

These features should reflect the project's defined core capabilities.

---

# 15. USER ROLE SECTION

Create three large role cards.

## নাগরিক / তথ্যদাতা

Icon: User / Megaphone

Capabilities:

* নিবন্ধন ও লগইন
* দুর্যোগের তথ্য প্রদান
* ছবি আপলোড
* অবস্থান শেয়ার
* রিপোর্টের অবস্থা দেখা

Button:

**নাগরিক হিসেবে শুরু করুন**

---

## স্বেচ্ছাসেবক / মাঠকর্মী

Icon: Volunteer / Shield

Capabilities:

* দুর্যোগ মানচিত্র দেখা
* কাজ গ্রহণ
* কাজের অবস্থা আপডেট
* মাঠপর্যায়ের সমস্যা জানানো

Button:

**স্বেচ্ছাসেবক হিসেবে শুরু করুন**

---

## সমন্বয়কারী / প্রশাসক

Icon: Dashboard / Settings

Capabilities:

* রিপোর্ট যাচাই
* দুর্যোগ এলাকা পর্যবেক্ষণ
* ত্রাণ বরাদ্দ
* মজুত ব্যবস্থাপনা
* কার্যক্রম পর্যবেক্ষণ

Button:

**প্রশাসনিক প্যানেল**

The role responsibilities should remain consistent with the project scope.

---

# 16. STATISTICS SECTION

Create a visual statistics section using mock values.

Example:

```text
১,২৪৮
মোট রিপোর্ট

৩৬৪
যাচাইকৃত ঘটনা

১৮৭
সক্রিয় স্বেচ্ছাসেবক

৫৬
সক্রিয় দুর্যোগ এলাকা
```

These are demo values only.

Clearly structure the frontend so they can later be replaced with API data.

Use animated count-up only if it can be implemented simply.

Do not spend significant development time on complicated animations.

---

# 17. MAP PREVIEW

Create a landing-page map preview.

Title:

**বর্তমান দুর্যোগ পরিস্থিতি**

Map should show mock Bangladesh locations.

Example locations:

* Sylhet
* Sunamganj
* Cox's Bazar
* Khulna
* Barisal

Markers:

### Red

High severity

### Orange

Medium severity

### Green

Low severity / monitored

Add small legend:

```text
● উচ্চ ঝুঁকি
● মাঝারি ঝুঁকি
● পর্যবেক্ষণে
```

Use Leaflet.js.

The project specifically identifies Leaflet.js and OpenStreetMap/Geolocation APIs for the frontend mapping layer.

---

# 18. AUTHENTICATION UI

Create:

```text
/login
/register
/forgot-password
```

## Login page

Split-screen desktop layout.

Left:

Platform branding and disaster-response illustration/map.

Right:

Login form.

Heading:

**স্বাগতম**

Subtitle:

**আপনার অ্যাকাউন্টে প্রবেশ করুন**

Fields:

* ইমেইল / মোবাইল নম্বর
* পাসওয়ার্ড

Checkbox:

**আমাকে মনে রাখুন**

Button:

**লগইন করুন**

Links:

**পাসওয়ার্ড ভুলে গেছেন?**

**নতুন অ্যাকাউন্ট তৈরি করুন**

---

# 19. DEMO LOGIN

Since there is no backend yet, create a demo authentication mechanism.

Allow users to select:

```text
ডেমো অ্যাকাউন্ট

○ নাগরিক
○ স্বেচ্ছাসেবক
○ প্রশাসক
```

When selected, automatically populate demo credentials or directly enter the relevant dashboard.

Example:

```text
নাগরিক হিসেবে দেখুন
স্বেচ্ছাসেবক হিসেবে দেখুন
প্রশাসক হিসেবে দেখুন
```

This is important for the university project demonstration.

---

# 20. REGISTRATION PAGE

Create role selection.

Heading:

**অ্যাকাউন্ট তৈরি করুন**

First choose:

```text
আপনি কীভাবে প্ল্যাটফর্ম ব্যবহার করবেন?

[ নাগরিক ]
[ স্বেচ্ছাসেবক ]
```

Admin registration must NOT be publicly available.

Admin accounts should be represented as preconfigured demo accounts.

Fields:

* পূর্ণ নাম
* ইমেইল
* মোবাইল নম্বর
* পাসওয়ার্ড
* পাসওয়ার্ড নিশ্চিত করুন

For volunteer registration:

Additional fields:

* দক্ষতার ধরন
* এলাকা
* জরুরি যোগাযোগ নম্বর

Keep the form simple.

---

# 21. GLOBAL SIDEBAR

After login, create a reusable sidebar.

Top:

Logo

Then role-specific navigation.

Citizen:

```text
ড্যাশবোর্ড
দুর্যোগ রিপোর্ট করুন
আমার রিপোর্ট
মানচিত্র
প্রোফাইল
```

Volunteer:

```text
ড্যাশবোর্ড
দুর্যোগ মানচিত্র
আমার কাজ
মাঠের সমস্যা
প্রোফাইল
```

Admin:

```text
ড্যাশবোর্ড
রিপোর্ট যাচাই
দুর্যোগ মানচিত্র
তীব্রতা বিশ্লেষণ
ত্রাণ বরাদ্দ
মজুত ব্যবস্থাপনা
অপারেশন
```

Bottom:

```text
নোটিফিকেশন
সেটিংস
লগআউট
```

---

# 22. GLOBAL TOPBAR

Topbar contains:

Left:

Page title / breadcrumb.

Right:

* notification bell
* emergency status indicator
* user avatar
* user name
* role

Example:

```text
হ্যালো, Rakibul
স্বেচ্ছাসেবক
```

Notification dropdown should show mock notifications.

Example:

**নতুন কাজ বরাদ্দ হয়েছে**

**সিলেট অঞ্চলের একটি রিপোর্ট যাচাই করা হয়েছে**

---

# 23. GLOBAL STATUS SYSTEM

Create reusable status badges.

### Pending

`অপেক্ষমাণ`

Yellow/amber.

### Verified

`যাচাইকৃত`

Green.

### Rejected

`বাতিল`

Red.

### In Progress

`চলমান`

Blue.

### En Route

`পথে রয়েছে`

Blue.

### Completed

`সম্পন্ন`

Green.

### Critical

`অতি জরুরি`

Dark red.

Do not rely only on color.

Always include text and/or icon.

This improves accessibility.

---

# 24. GLOBAL EMPTY STATES

Every major page must have a meaningful empty state.

Example:

```text
কোনো রিপোর্ট পাওয়া যায়নি

বর্তমানে আপনার কোনো দুর্যোগ রিপোর্ট নেই।

[ নতুন রিপোর্ট তৈরি করুন ]
```

Use an appropriate icon.

Do not leave blank white areas.

---

# 25. GLOBAL ERROR STATES

Create reusable error UI.

Example:

```text
দুঃখিত, তথ্য লোড করা যায়নি।

আবার চেষ্টা করুন।

[ পুনরায় চেষ্টা ]
```

For location errors:

```text
আপনার অবস্থান শনাক্ত করা যায়নি।

ব্রাউজারে Location Permission চালু করে আবার চেষ্টা করুন।
```

---

# 26. GLOBAL LOADING STATES

Use skeleton loaders for:

* dashboard cards
* tables
* map sections
* report lists

Avoid unnecessary full-page spinners.

---

# 27. ACCESSIBILITY

Make accessibility a priority.

Requirements:

* readable contrast
* keyboard-friendly forms
* visible focus states
* button labels
* alt text
* icons should not be the only indicator
* meaningful form validation
* responsive text

Bangla text must remain readable at all screen sizes.

---

# 28. FRONTEND MOCK DATA

Create mock data files.

Example:

```js
const reports = [
  {
    id: "RPT-001",
    location: "সুনামগঞ্জ",
    disasterType: "বন্যা",
    severity: "high",
    status: "verified",
    reportedAt: "আজ, ১০:৩০ AM",
    affectedPeople: 320
  }
];
```

Create realistic Bangladesh-focused mock data.

Disaster types:

* বন্যা
* ঘূর্ণিঝড়
* নদীভাঙন
* জলাবদ্ধতা
* ভূমিধস

Do not hardcode mock data directly inside every component.

---

# 29. ROUTING

Implement role-based frontend routes.

Public:

```text
/
/login
/register
/forgot-password
```

Citizen:

```text
/citizen
/citizen/report
/citizen/reports
/citizen/reports/:id
/citizen/map
/citizen/profile
```

Volunteer:

```text
/volunteer
/volunteer/map
/volunteer/tasks
/volunteer/tasks/:id
/volunteer/issues
/volunteer/profile
```

Admin:

```text
/admin
/admin/reports
/admin/reports/:id
/admin/map
/admin/severity
/admin/resources
/admin/inventory
/admin/operations
```

Create a simple protected-route system based on mock authentication.

---

# 30. COMPONENT REUSABILITY

Before building individual dashboards, create shared components.

At minimum:

```text
AppLayout
Sidebar
Topbar
MobileNav
PageHeader
StatCard
StatusBadge
PriorityBadge
Button
Input
Select
Textarea
Modal
ConfirmModal
DataTable
SearchInput
FilterDropdown
NotificationPanel
UserAvatar
EmptyState
ErrorState
LoadingSkeleton
MapLegend
MapMarker
```

Do not duplicate these components between roles.

---

# 31. LANDING PAGE FOOTER

Create a professional footer.

Sections:

### প্ল্যাটফর্ম

* আমাদের সম্পর্কে
* কীভাবে কাজ করে
* বৈশিষ্ট্য

### ব্যবহারকারী

* নাগরিক
* স্বেচ্ছাসেবক
* প্রশাসন

### সহায়তা

* সাহায্য
* যোগাযোগ
* জরুরি নির্দেশনা

Footer text:

**দুর্যোগ সাড়া — সমন্বিত উদ্যোগে দ্রুত প্রতিক্রিয়া।**

Add:

**© 2026 Disaster Response Coordination Platform**

---

# 32. DO NOT IMPLEMENT YET

In this first stage, do NOT spend time implementing:

* backend APIs
* MySQL
* Node.js
* Express
* real authentication
* real SMS
* real notification service
* AI prediction
* drone monitoring
* weather API
* offline mode

These are outside the immediate frontend implementation scope or future enhancements.

The project presentation lists several of these as future enhancements, including mobile applications, offline reporting, AI severity prediction, drone monitoring, SMS notifications, weather integration, and analytics.

Represent future functionality only with placeholders if necessary.

---

# 33. DEVELOPMENT PRIORITY

Build in this order:

### Phase 1

Design system

### Phase 2

Global layout

### Phase 3

Navbar/sidebar

### Phase 4

Routing

### Phase 5

Authentication/demo login

### Phase 6

Landing page

### Phase 7

Shared components

### Phase 8

Role-specific dashboards

Do not start with complicated dashboard pages before the shared layout is stable.

---

# 34. CODE QUALITY

Follow these rules:

* Clean React components
* Meaningful variable names
* No massive components
* Avoid duplicated JSX
* Keep mock data separate
* Use reusable components
* Use consistent naming
* Keep CSS organized
* Add comments only where useful
* Avoid unnecessary libraries
* Avoid unnecessary animations
* Do not create placeholder buttons that do nothing unless clearly marked as demo functionality

Every visible interaction should either work or provide a clear demo behavior.

---

# 35. DEMO EXPERIENCE

The final frontend should be optimized for a university project demonstration.

A presenter should be able to:

1. Open the website.
2. Explain the platform.
3. Login as Citizen.
4. Create a disaster report using mock data.
5. Logout.
6. Login as Volunteer.
7. See the reported disaster on the map.
8. Receive a task.
9. Update task status.
10. Report a field exception.
11. Logout.
12. Login as Admin.
13. See the incoming report.
14. Verify the report.
15. See severity/priority.
16. Allocate resources.
17. View inventory.

The later parts of this prompt will define those role-specific screens in detail.

---

# 36. FINAL UI QUALITY CHECK

Before considering Part 1 complete, verify:

* [ ] Bangla UI is readable.
* [ ] Light green theme is consistent.
* [ ] Desktop layout looks professional.
* [ ] Mobile layout does not break.
* [ ] Landing page is polished.
* [ ] Login works with demo accounts.
* [ ] Registration UI works.
* [ ] Role-based routing works.
* [ ] Sidebar changes according to role.
* [ ] Topbar works.
* [ ] Notifications have mock data.
* [ ] Shared components are reusable.
* [ ] Leaflet map preview works.
* [ ] Mock data is separated from UI.
* [ ] No backend dependency exists.
* [ ] No unnecessary libraries are introduced.
* [ ] The UI feels like a real disaster-response platform.

IMPORTANT:

Do not move to backend development.

This is a **frontend implementation**.

Build the foundation carefully because Parts 2 and 3 will extend this exact frontend architecture.
