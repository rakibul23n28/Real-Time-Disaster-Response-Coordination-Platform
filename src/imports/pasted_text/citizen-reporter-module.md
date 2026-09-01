# Real-Time Disaster Response Coordination Platform

## Frontend Development Prompt — Part 2 of 3

Continue developing the existing React.js frontend from **Part 1**.

Do NOT redesign or replace the architecture created in Part 1.

Use the same:

* Bangla-first language
* Light green visual theme
* Responsive layout
* Reusable components
* Mock-data architecture
* Role-based routing
* Sidebar
* Topbar
* Status badges
* Cards
* Tables
* Leaflet map components

Part 2 focuses specifically on:

1. **Citizen / Reporter Module**
2. **Volunteer / Field Worker Module**

The goal is to make both modules fully demonstrable using frontend mock data.

---

# 1. CITIZEN / REPORTER MODULE

The citizen module allows ordinary users to:

* Register/login
* Report disasters
* Upload photos
* Share their location
* Track submitted reports
* View report details
* View disaster information on the map

These responsibilities are defined in the project's scope.

---

# 2. CITIZEN ROUTES

Implement:

```text
/citizen
/citizen/report
/citizen/reports
/citizen/reports/:id
/citizen/map
/citizen/profile
```

---

# 3. CITIZEN DASHBOARD

Route:

```text
/citizen
```

Create a clean dashboard.

Page heading:

**নাগরিক ড্যাশবোর্ড**

Subtitle:

**আপনার রিপোর্ট ও আশেপাশের দুর্যোগ পরিস্থিতি দেখুন।**

---

## Dashboard top section

Show an emergency CTA card.

Heading:

**আপনার এলাকায় দুর্যোগ দেখেছেন?**

Description:

**দ্রুত তথ্য প্রদান করুন যাতে সংশ্লিষ্ট কর্তৃপক্ষ ব্যবস্থা নিতে পারে।**

Button:

**দুর্যোগ রিপোর্ট করুন**

Use a strong green button.

---

# 4. CITIZEN STATISTICS

Create four stat cards.

```text
মোট রিপোর্ট
03

যাচাইকৃত
02

অপেক্ষমাণ
01

সম্পন্ন
01
```

Use mock data.

Do not hardcode these numbers inside the component.

Calculate them from mock reports where practical.

---

# 5. RECENT REPORTS

Heading:

**সাম্প্রতিক রিপোর্ট**

Display the citizen's latest reports.

Columns desktop:

```text
রিপোর্ট ID
দুর্যোগের ধরন
অবস্থান
তারিখ
অবস্থা
অ্যাকশন
```

Example:

```text
RPT-001
বন্যা
সুনামগঞ্জ
আজ, ১০:৩০
যাচাইকৃত
দেখুন
```

On mobile:

Convert rows into cards.

Each card should show:

* Report ID
* Disaster type
* Location
* Status
* Date
* View button

---

# 6. REPORT STATUS TIMELINE

When a citizen opens a report, show a visual status timeline.

Example:

```text
রিপোর্ট জমা
     │
     ●
     │
রিপোর্ট যাচাই
     │
     ●
     │
সহায়তা বরাদ্দ
     │
     ●
     │
কার্যক্রম সম্পন্ন
```

Possible states:

### ১. জমা হয়েছে

`Submitted`

### ২. যাচাই করা হচ্ছে

`Under Review`

### ৩. যাচাইকৃত

`Verified`

### ৪. সহায়তা বরাদ্দ

`Resource Allocated`

### ৫. কার্যক্রম চলছে

`In Progress`

### ৬. সম্পন্ন

`Completed`

The timeline should visually highlight the current state.

---

# 7. REPORT DETAIL PAGE

Route:

```text
/citizen/reports/:id
```

Create a detailed report view.

Header:

**রিপোর্টের বিস্তারিত**

Show:

```text
Report ID: RPT-001
Status: যাচাইকৃত
Reported: আজ, ১০:৩০
```

---

## Report information card

Show:

**দুর্যোগের ধরন**

বন্যা

**অবস্থান**

সুনামগঞ্জ, বাংলাদেশ

**আক্রান্ত মানুষের আনুমানিক সংখ্যা**

320

**রিপোর্টের সময়**

আজ, ১০:৩০ AM

**বিবরণ**

এলাকার বেশ কয়েকটি বাড়িতে পানি প্রবেশ করেছে এবং প্রধান সড়কের একটি অংশ পানিতে ডুবে গেছে।

---

# 8. REPORT PHOTO SECTION

If a report contains an uploaded image, display:

**সংযুক্ত ছবি**

Create an image gallery.

For demo:

* 1–3 mock disaster images
* image preview
* click image → modal/lightbox

If there is no image:

Show:

**কোনো ছবি সংযুক্ত করা হয়নি।**

---

# 9. REPORT LOCATION

Display a small Leaflet map.

Heading:

**ঘটনার অবস্থান**

Show:

* location marker
* approximate coordinates
* location name

Example:

```text
সুনামগঞ্জ
Latitude: 25.0658
Longitude: 91.3950
```

The map should be a reusable component.

---

# 10. CREATE DISASTER REPORT

Route:

```text
/citizen/report
```

This is one of the most important screens in the entire project.

The form should feel like an emergency reporting interface.

Page title:

**দুর্যোগের তথ্য দিন**

Subtitle:

**ঘটনার সঠিক তথ্য প্রদান করুন যাতে দ্রুত ব্যবস্থা নেওয়া যায়।**

---

# 11. REPORT FORM LAYOUT

Desktop:

Two-column layout.

Left:

Form.

Right:

Live location/map preview.

Mobile:

Single-column layout.

---

# 12. DISASTER TYPE

Field:

**দুর্যোগের ধরন**

Dropdown:

```text
বন্যা
ঘূর্ণিঝড়
নদীভাঙন
জলাবদ্ধতা
ভূমিধস
অন্যান্য
```

Required.

---

# 13. INCIDENT TITLE

Field:

**ঘটনার শিরোনাম**

Placeholder:

**যেমন: সুনামগঞ্জে হঠাৎ বন্যায় বসতবাড়ি প্লাবিত**

Required.

---

# 14. DESCRIPTION

Textarea:

**ঘটনার বিস্তারিত বিবরণ**

Placeholder:

**ঘটনাটি কীভাবে ঘটেছে, কোন এলাকা আক্রান্ত এবং কী ধরনের সহায়তা প্রয়োজন তা লিখুন।**

Add character counter.

Example:

`0 / 500`

Maximum:

500 characters.

---

# 15. AFFECTED PEOPLE

Field:

**আক্রান্ত মানুষের আনুমানিক সংখ্যা**

Number input.

Example:

`320`

Do not allow negative values.

---

# 16. LOCATION SECTION

Heading:

**ঘটনার অবস্থান**

Provide two options:

```text
[ আমার বর্তমান অবস্থান ব্যবহার করুন ]

[ মানচিত্রে অবস্থান নির্বাচন করুন ]
```

When "বর্তমান অবস্থান" is clicked:

Show a mock geolocation loading state.

Then:

```text
✓ অবস্থান শনাক্ত হয়েছে

সুনামগঞ্জ, বাংলাদেশ
```

For frontend demo, use mock coordinates if browser geolocation is unavailable.

---

# 17. MAP LOCATION PICKER

Create a Leaflet map.

Features:

* draggable marker
* click map → move marker
* location label
* latitude
* longitude

Above the map:

**মানচিত্রে আপনার অবস্থান নির্বাচন করুন**

Below:

```text
অক্ষাংশ: 25.0658
দ্রাঘিমাংশ: 91.3950
```

Keep this implementation simple.

Do not build a complex geocoding system.

---

# 18. PHOTO UPLOAD

Section:

**ঘটনার ছবি**

Support:

* drag & drop
* click to upload
* image preview
* remove image

Text:

**ঘটনার বাস্তব ছবি থাকলে আপলোড করুন।**

Allowed:

* JPG
* JPEG
* PNG

Maximum demo size:

5 MB.

Show validation errors.

Example:

**ফাইলের আকার ৫ MB-এর বেশি হতে পারবে না।**

---

# 19. REPORT FORM VALIDATION

Required:

* Disaster type
* Title
* Description
* Location

Optional:

* Photo
* affected people count

Show inline validation.

Example:

```text
দুর্যোগের ধরন নির্বাচন করুন।
```

Do not show validation errors before the user interacts with the field unless submitting an incomplete form.

---

# 20. SUBMIT REPORT

Primary button:

**রিপোর্ট জমা দিন**

Secondary:

**বাতিল করুন**

On submit:

Show confirmation modal.

Heading:

**রিপোর্ট জমা দেবেন?**

Message:

**আপনার দেওয়া তথ্য প্রশাসনিক যাচাইয়ের জন্য পাঠানো হবে।**

Buttons:

**হ্যাঁ, জমা দিন**

**ফিরে যান**

---

# 21. SUCCESS STATE

After submission:

Show a success screen.

Icon:

Checkmark.

Heading:

**রিপোর্ট সফলভাবে জমা হয়েছে**

Message:

**আপনার রিপোর্ট প্রশাসনিক যাচাইয়ের জন্য পাঠানো হয়েছে।**

Show:

```text
রিপোর্ট ID
RPT-004

অবস্থা
অপেক্ষমাণ
```

Buttons:

**রিপোর্ট দেখুন**

**ড্যাশবোর্ডে ফিরে যান**

---

# 22. MY REPORTS

Route:

```text
/citizen/reports
```

Heading:

**আমার রিপোর্ট**

Create:

* search
* status filter
* disaster-type filter
* date filter

Search placeholder:

**রিপোর্ট খুঁজুন...**

Status filter:

```text
সব
অপেক্ষমাণ
যাচাইকৃত
বাতিল
চলমান
সম্পন্ন
```

---

# 23. CITIZEN MAP

Route:

```text
/citizen/map
```

Heading:

**দুর্যোগ মানচিত্র**

Subtitle:

**আপনার আশেপাশের সক্রিয় দুর্যোগ পরিস্থিতি দেখুন।**

Make the map the primary element of the page.

Desktop:

Map approximately 70–75% of the screen.

Right:

Incident information panel.

Mobile:

Map first, incident list below.

---

# 24. MAP MARKERS

Use mock incident markers.

Severity:

### High

Red

### Medium

Orange

### Low

Green

Each marker should open a popup.

Example:

```text
সুনামগঞ্জ বন্যা

তীব্রতা:
উচ্চ

আক্রান্ত:
320 জন

অবস্থা:
যাচাইকৃত

[ বিস্তারিত দেখুন ]
```

---

# 25. CITIZEN SAFETY INFORMATION

Add a small section below the map:

Heading:

**জরুরি পরিস্থিতিতে করণীয়**

Cards:

### নিরাপদ স্থানে যান

বন্যা বা ঘূর্ণিঝড়ের সময় ঝুঁকিপূর্ণ এলাকা এড়িয়ে চলুন।

### জরুরি তথ্য জানান

ঘটনার সঠিক অবস্থান ও তথ্য প্রদান করুন।

### স্থানীয় নির্দেশনা অনুসরণ করুন

প্রশাসন ও উদ্ধারকারী দলের নির্দেশনা অনুসরণ করুন।

Keep this informational and simple.

---

# 26. CITIZEN PROFILE

Route:

```text
/citizen/profile
```

Show:

* profile photo
* name
* email
* phone
* registration date
* total reports

Sections:

**ব্যক্তিগত তথ্য**

**যোগাযোগের তথ্য**

**অ্যাকাউন্ট সেটিংস**

Add:

**প্রোফাইল সম্পাদনা করুন**

Use a simple modal.

No backend required.

---

# ==================================================

# VOLUNTEER / FIELD WORKER MODULE

# ==================================================

# 27. VOLUNTEER ROUTES

Implement:

```text
/volunteer
/volunteer/map
/volunteer/tasks
/volunteer/tasks/:id
/volunteer/issues
/volunteer/profile
```

The volunteer role is responsible for viewing disaster areas, receiving assigned tasks, updating task status, and reporting field issues.

---

# 28. VOLUNTEER DASHBOARD

Route:

```text
/volunteer
```

Heading:

**স্বেচ্ছাসেবক ড্যাশবোর্ড**

Subtitle:

**আপনার দায়িত্ব, দুর্যোগ এলাকা এবং মাঠপর্যায়ের কার্যক্রম দেখুন।**

---

# 29. VOLUNTEER STATISTICS

Show:

```text
সক্রিয় কাজ
03

সম্পন্ন কাজ
12

জরুরি কাজ
01

রিপোর্ট করা সমস্যা
04
```

Use reusable StatCard.

---

# 30. ACTIVE TASK CARD

Create a prominent card:

```text
জরুরি ত্রাণ বিতরণ

📍 সুনামগঞ্জ

অগ্রাধিকার:
অতি জরুরি

আক্রান্ত:
320 জন

সময়:
আজ, ২:৩০ PM
```

Button:

**কাজটি দেখুন**

If critical:

Use subtle red accent.

Do not make the whole card red.

---

# 31. TASK STATUS

Volunteer tasks must support:

```text
নতুন
Assigned

পথে রয়েছে
En Route

চলমান
In Progress

সম্পন্ন
Completed
```

The project's core workflow explicitly includes volunteers receiving tasks and updating task status.

Create a status progression UI:

```text
নতুন
 ↓
পথে রয়েছে
 ↓
চলমান
 ↓
সম্পন্ন
```

---

# 32. TASK LIST

Route:

```text
/volunteer/tasks
```

Heading:

**আমার কাজ**

Filters:

```text
সব
নতুন
পথে রয়েছে
চলমান
সম্পন্ন
জরুরি
```

Search:

**কাজ খুঁজুন...**

---

# 33. TASK CARD

Each task should contain:

```text
Task ID
TASK-023

Task name
ত্রাণ বিতরণ

Location
সুনামগঞ্জ

Priority
অতি জরুরি

Assigned
আজ, ১১:২০ AM

Status
পথে রয়েছে
```

Button:

**বিস্তারিত দেখুন**

---

# 34. TASK DETAIL

Route:

```text
/volunteer/tasks/:id
```

Heading:

**কাজের বিস্তারিত**

Show:

### Task information

```text
Task ID
TASK-023

কাজ
ত্রাণ বিতরণ

এলাকা
সুনামগঞ্জ

অগ্রাধিকার
অতি জরুরি

আক্রান্ত মানুষ
320

বরাদ্দকৃত স্বেচ্ছাসেবক
4 জন
```

---

# 35. TASK LOCATION MAP

Add Leaflet map.

Show:

* destination
* volunteer current/demo location
* route-like visual representation if easy

Do NOT implement real navigation.

For frontend demo, use:

**আপনার অবস্থান**

and

**কাজের অবস্থান**

markers.

---

# 36. TASK DESCRIPTION

Example:

**কাজের নির্দেশনা**

সুনামগঞ্জের নির্ধারিত এলাকায় খাবার ও বিশুদ্ধ পানি বিতরণ করতে হবে।

**প্রয়োজনীয় সামগ্রী**

```text
পানি — 200 বোতল
খাবার প্যাকেট — 150
ওষুধ — 20 প্যাকেট
```

---

# 37. UPDATE TASK STATUS

Create a prominent action section.

Heading:

**কাজের অবস্থা আপডেট করুন**

Buttons:

```text
[ পথে রয়েছি ]

[ কাজ শুরু করেছি ]

[ কাজ সম্পন্ন ]
```

Only show logical next actions.

Example:

If current status is:

`Assigned`

show:

**পথে রয়েছি**

If:

`En Route`

show:

**কাজ শুরু করেছি**

If:

`In Progress`

show:

**কাজ সম্পন্ন**

---

# 38. STATUS CONFIRMATION

Before changing status:

Show modal.

Example:

**আপনি কি নিশ্চিত যে আপনি এখন কাজের জন্য রওনা দিয়েছেন?**

Buttons:

**হ্যাঁ, আপডেট করুন**

**বাতিল**

After update:

Toast:

**কাজের অবস্থা সফলভাবে আপডেট হয়েছে।**

---

# 39. FIELD EXCEPTION TAGGING

This is an important feature.

Route:

```text
/volunteer/issues
```

Heading:

**মাঠপর্যায়ের সমস্যা**

Subtitle:

**কাজের সময় কোনো সমস্যা হলে দ্রুত জানিয়ে দিন।**

The project specifically includes preset field exception tags to allow volunteers to quickly flag problems without complex messaging.

---

# 40. QUICK ISSUE TAGS

Create large selectable buttons:

```text
🚧 রাস্তা বন্ধ

📦 অতিরিক্ত ত্রাণ প্রয়োজন

🚑 চিকিৎসা সহায়তা প্রয়োজন

🚤 নৌকা প্রয়োজন

👥 অতিরিক্ত স্বেচ্ছাসেবক প্রয়োজন

⚠️ অন্যান্য জরুরি সমস্যা
```

Use cards/buttons rather than a complicated form.

---

# 41. ISSUE REPORT FLOW

Volunteer selects:

**রাস্তা বন্ধ**

Then show:

```text
সমস্যার অবস্থান
[ মানচিত্র ]

সংক্ষিপ্ত বিবরণ
[________________________]

ছবি
[ ছবি যোগ করুন ]
```

Button:

**সমস্যাটি জানান**

---

# 42. ISSUE SUCCESS

After submission:

```text
✓ সমস্যা সফলভাবে জানানো হয়েছে

সমস্যার ধরন:
রাস্তা বন্ধ

অবস্থা:
প্রশাসনের কাছে পাঠানো হয়েছে
```

Button:

**ঠিক আছে**

---

# 43. FIELD ISSUE LIST

Show previously submitted issues.

Columns:

```text
সমস্যা
অবস্থান
রিপোর্টের সময়
অবস্থা
```

Example:

```text
রাস্তা বন্ধ
সুনামগঞ্জ
আজ ১:২৫ PM
জানানো হয়েছে
```

---

# 44. VOLUNTEER DISASTER MAP

Route:

```text
/volunteer/map
```

This is one of the most important volunteer screens.

Heading:

**দুর্যোগ ও কাজের মানচিত্র**

Show:

* affected areas
* active incidents
* assigned tasks
* relief camps
* volunteer locations

---

# 45. MAP FILTERS

Top of map:

```text
[ সব ]

[ দুর্যোগ ]

[ আমার কাজ ]

[ ত্রাণ ক্যাম্প ]

[ স্বেচ্ছাসেবক ]
```

Add severity filter:

```text
সব
উচ্চ
মাঝারি
কম
```

Keep filters simple.

---

# 46. MAP SIDE PANEL

Desktop right-side panel:

**সক্রিয় কার্যক্রম**

List:

```text
সুনামগঞ্জ বন্যা
অতি জরুরি
320 জন আক্রান্ত

কক্সবাজার ঘূর্ণিঝড়
উচ্চ
540 জন আক্রান্ত

খুলনা জলাবদ্ধতা
মাঝারি
180 জন আক্রান্ত
```

Clicking an item should center the map on that location.

---

# 47. VOLUNTEER PROFILE

Route:

```text
/volunteer/profile
```

Show:

```text
নাম
Rakibul Hasan

ভূমিকা
স্বেচ্ছাসেবক / মাঠকর্মী

এলাকা
সুনামগঞ্জ

মোট কাজ
15

সম্পন্ন
12

সক্রিয়
3
```

Add a simple availability toggle:

**জরুরি কাজে উপলব্ধ**

Toggle:

`ON / OFF`

This is frontend-only.

---

# 48. VOLUNTEER NOTIFICATIONS

Use the global notification component.

Example:

```text
নতুন কাজ বরাদ্দ হয়েছে

TASK-023 আপনাকে বরাদ্দ করা হয়েছে।

10 মিনিট আগে
```

Another:

```text
আপনার রিপোর্ট করা "রাস্তা বন্ধ" সমস্যাটি প্রশাসন দেখেছে।

30 মিনিট আগে
```

---

# 49. MOBILE EXPERIENCE

Volunteer users may be working in the field.

Therefore the volunteer interface must prioritize mobile usability.

On mobile:

* large buttons
* large touch targets
* simple navigation
* minimal text
* map easily accessible
* quick issue reporting

The field issue buttons should be large enough to tap easily.

Avoid tiny dropdowns.

---

# 50. CITIZEN + VOLUNTEER DEMO WORKFLOW

The frontend should support this complete mock workflow:

### Step 1 — Citizen

Login as citizen.

Go to:

**দুর্যোগ রিপোর্ট করুন**

Submit:

```text
বন্যা
সুনামগঞ্জ
320 affected
photo
location
description
```

---

### Step 2 — Citizen

Report appears under:

**আমার রিপোর্ট**

Status:

**অপেক্ষমাণ**

---

### Step 3 — Volunteer

Logout.

Login as volunteer.

Open:

**দুর্যোগ মানচিত্র**

See:

**সুনামগঞ্জ বন্যা**

---

### Step 4 — Volunteer

Open assigned task:

**ত্রাণ বিতরণ**

Status:

**নতুন**

Click:

**পথে রয়েছি**

Status becomes:

**পথে রয়েছে**

---

### Step 5 — Volunteer

Click:

**কাজ শুরু করেছি**

Status becomes:

**চলমান**

---

### Step 6 — Volunteer

Encounter:

**রাস্তা বন্ধ**

Select:

**🚧 রাস্তা বন্ধ**

Submit issue.

---

### Step 7 — Volunteer

Finish work.

Click:

**কাজ সম্পন্ন**

Status becomes:

**সম্পন্ন**

---

# 51. MOCK STATE MANAGEMENT

Because there is no backend yet, create a lightweight frontend state system.

Recommended:

React Context or simple shared state.

Maintain:

```text
currentUser
reports
tasks
fieldIssues
notifications
```

When a citizen submits a report:

Add it to mock state.

When volunteer changes task status:

Update the task in shared state.

When volunteer submits an issue:

Add it to shared state.

This allows the demo to feel like a connected system even without the backend.

---

# 52. DO NOT CREATE SEPARATE DUPLICATE DATA

Do NOT create:

```text
citizenReports.js
volunteerReports.js
adminReports.js
```

Instead create one shared source:

```text
mockReports.js
```

The same report should eventually be visible to:

* Citizen
* Volunteer
* Admin

This is important for the later integration.

---

# 53. RECOMMENDED MOCK DATA STRUCTURE

Reports:

```js
{
  id: "RPT-001",
  reporterId: "USR-001",
  disasterType: "বন্যা",
  title: "সুনামগঞ্জে আকস্মিক বন্যা",
  description: "...",
  location: {
    name: "সুনামগঞ্জ",
    lat: 25.0658,
    lng: 91.3950
  },
  affectedPeople: 320,
  photos: [],
  status: "verified",
  severity: "high",
  createdAt: "2026-09-01T10:30:00"
}
```

Tasks:

```js
{
  id: "TASK-023",
  reportId: "RPT-001",
  title: "ত্রাণ বিতরণ",
  location: "সুনামগঞ্জ",
  priority: "critical",
  status: "assigned",
  assignedVolunteers: ["VOL-001"],
  resources: [
    {
      name: "পানি",
      quantity: 200
    }
  ]
}
```

Field issue:

```js
{
  id: "ISSUE-004",
  taskId: "TASK-023",
  type: "road_blocked",
  label: "রাস্তা বন্ধ",
  location: {
    name: "সুনামগঞ্জ",
    lat: 25.0658,
    lng: 91.3950
  },
  description: "...",
  status: "reported",
  createdAt: "2026-09-01T13:25:00"
}
```

---

# 54. FRONTEND INTERACTION REQUIREMENTS

The following must actually work:

### Citizen

* Login
* Role selection
* Report creation
* Form validation
* Image preview
* Location selection
* Report submission
* Report list
* Report detail
* Map interaction

### Volunteer

* Dashboard
* Task list
* Task detail
* Status update
* Map interaction
* Field issue selection
* Field issue submission
* Notifications

---

# 55. SIMULATE BACKEND DELAYS

To make the demo feel realistic, optionally simulate:

```text
Loading...
```

for approximately 500–800ms during:

* report submission
* task update
* issue submission

Do not overuse fake loading.

---

# 56. TOAST NOTIFICATIONS

Create a reusable toast system.

Examples:

Success:

**রিপোর্ট সফলভাবে জমা হয়েছে।**

**কাজের অবস্থা আপডেট হয়েছে।**

**সমস্যাটি সফলভাবে জানানো হয়েছে।**

Error:

**কিছু সমস্যা হয়েছে। আবার চেষ্টা করুন।**

Info:

**নতুন একটি কাজ আপনার জন্য বরাদ্দ করা হয়েছে।**

---

# 57. RESPONSIVE DESIGN CHECK

Citizen:

* Report form works on mobile.
* Photo upload works.
* Map does not overflow.
* Cards stack vertically.

Volunteer:

* Task actions are easy to tap.
* Field issue buttons are large.
* Map works on mobile.
* Sidebar collapses.
* Tables become cards.

---

# 58. PERFORMANCE

Because the team has only one month:

Do NOT optimize prematurely.

However:

* Avoid unnecessary re-renders.
* Keep maps in reusable components.
* Do not load huge images.
* Use local/mock images with reasonable sizes.
* Avoid unnecessary animation libraries.

---

# 59. PART 2 COMPLETION CHECKLIST

Citizen:

* [ ] Citizen dashboard
* [ ] Citizen statistics
* [ ] Create report page
* [ ] Disaster type selection
* [ ] Description
* [ ] Affected people
* [ ] Location picker
* [ ] Leaflet map
* [ ] Photo upload
* [ ] Image preview
* [ ] Form validation
* [ ] Report submission
* [ ] Success state
* [ ] My reports
* [ ] Report detail
* [ ] Report timeline
* [ ] Citizen map
* [ ] Citizen profile
* [ ] Notifications

Volunteer:

* [ ] Volunteer dashboard
* [ ] Statistics
* [ ] Active task
* [ ] Task list
* [ ] Task detail
* [ ] Task map
* [ ] Task status update
* [ ] Status confirmation
* [ ] Field issue page
* [ ] Quick exception tags
* [ ] Issue submission
* [ ] Issue list
* [ ] Volunteer disaster map
* [ ] Map filters
* [ ] Volunteer profile
* [ ] Notifications

Integration:

* [ ] Shared reports state
* [ ] Shared tasks state
* [ ] Shared field issues state
* [ ] Citizen report appears in shared system
* [ ] Volunteer can interact with assigned task
* [ ] Volunteer status updates persist during demo
* [ ] Field issue appears in shared state
* [ ] No duplicated data sources

---

# 60. IMPORTANT DEVELOPMENT RULE

Do not start building the Admin module yet.

First make sure the Citizen and Volunteer modules work smoothly with the shared mock state.

The next part will build:

* Coordinator/Admin Dashboard
* Report Verification
* Severity Scoring
* Resource Allocation
* Inventory Management
* Operations Monitoring
* Admin Map
* Analytics
* Final integration
* Final 1-month team development plan

Use the same visual language and component architecture from Parts 1 and 2.
