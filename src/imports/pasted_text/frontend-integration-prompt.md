# FINAL FRONTEND INTEGRATION & FUNCTIONALITY PROMPT

## Real-Time Disaster Response Coordination Platform

You have already implemented Parts 1, 2, and 3 of the project.

Now perform the **FINAL FRONTEND INTEGRATION, FUNCTIONALITY, NAVIGATION, BUG-FIXING, AND QUALITY-ASSURANCE PHASE**.

Do NOT simply add another page.

Your task is to make the **ENTIRE FRONTEND WORK PROPERLY AS ONE COMPLETE APPLICATION**.

The project must be suitable for a university CSE course-project demonstration and must be realistic for a team of 3 members completing the project within one month.

---

# 1. MOST IMPORTANT REQUIREMENT

## EVERY NAVIGATION MUST WORK.

There must be **NO dead links, dead buttons, fake navigation, broken routes, or buttons that visually appear functional but do nothing**.

Audit the entire application.

Every:

* Navbar link
* Sidebar link
* Mobile navigation item
* Footer link
* CTA button
* Dashboard card
* Table action
* "View Details" button
* "Back" button
* "Create" button
* "Submit" button
* "Edit" button
* "Delete" button
* "Verify" button
* "Reject" button
* "Allocate" button
* "Update Status" button
* Notification
* Map marker
* Map popup action
* Modal button
* Profile action
* Logout button

must either:

1. Navigate to a valid page,
2. Open a functional modal,
3. Update application state,
4. Submit/update mock data,
5. Perform the expected UI interaction,

or be removed.

Do NOT leave meaningless buttons.

---

# 2. COMPLETE ROUTE AUDIT

Verify every route exists.

## Public

```text
/
 /login
 /register
 /forgot-password
```

## Citizen

```text
/citizen
/citizen/report
/citizen/reports
/citizen/reports/:id
/citizen/map
/citizen/profile
```

## Volunteer

```text
/volunteer
/volunteer/map
/volunteer/tasks
/volunteer/tasks/:id
/volunteer/issues
/volunteer/profile
```

## Admin

```text
/admin
/admin/reports
/admin/reports/:id
/admin/map
/admin/severity
/admin/resources
/admin/inventory
/admin/operations
/admin/profile
```

Every route must render the correct page.

---

# 3. NAVIGATION RULE

Use React Router consistently.

Do NOT use random:

```text
window.location.href
```

for internal navigation.

Use:

```text
Link
NavLink
useNavigate()
```

where appropriate.

Internal navigation must happen without unnecessarily reloading the entire application.

---

# 4. NAVBAR FUNCTIONALITY

Audit the public navbar.

## Logo

Clicking the logo:

```text
→ /
```

## হোম

```text
→ /
```

## কীভাবে কাজ করে

Scroll or navigate to the appropriate section/page.

If it is an anchor:

```text
/#how-it-works
```

Make sure the section actually exists.

## আমাদের লক্ষ্য

Navigate or scroll to the relevant section.

## যোগাযোগ

Navigate or scroll to the contact/footer section.

## লগইন

```text
→ /login
```

## নিবন্ধন

```text
→ /register
```

## জরুরি তথ্য দিন

```text
→ /login
```

If the user is already logged in as citizen:

```text
→ /citizen/report
```

---

# 5. AUTHENTICATION MUST WORK

Implement frontend demo authentication.

Available demo roles:

```text
Citizen
Volunteer
Admin
```

Login must actually determine the selected role.

After successful login:

### Citizen

```text
→ /citizen
```

### Volunteer

```text
→ /volunteer
```

### Admin

```text
→ /admin
```

Store the current demo session using a simple frontend mechanism such as:

```text
Context
localStorage
```

Do NOT store real passwords.

---

# 6. LOGOUT MUST WORK

Every logged-in role must have:

**লগআউট**

When clicked:

1. Clear authentication state.
2. Clear current demo user session.
3. Navigate to:

```text
/login
```

The browser must not be able to simply use the previous role after logout.

---

# 7. PROTECTED ROUTES

Implement simple frontend role protection.

Example:

Citizen cannot directly access:

```text
/admin
/volunteer
```

Volunteer cannot access:

```text
/admin
/citizen
```

Admin cannot accidentally enter another role's dashboard unless explicitly using the demo role-switch mechanism.

If unauthorized:

Show:

**এই পৃষ্ঠায় প্রবেশের অনুমতি নেই।**

Button:

**ড্যাশবোর্ডে ফিরে যান**

The button must navigate to the correct dashboard.

---

# 8. SIDEBAR AUDIT

Every sidebar item must work.

## Citizen

```text
ড্যাশবোর্ড
→ /citizen

দুর্যোগ রিপোর্ট করুন
→ /citizen/report

আমার রিপোর্ট
→ /citizen/reports

মানচিত্র
→ /citizen/map

প্রোফাইল
→ /citizen/profile
```

## Volunteer

```text
ড্যাশবোর্ড
→ /volunteer

দুর্যোগ মানচিত্র
→ /volunteer/map

আমার কাজ
→ /volunteer/tasks

মাঠের সমস্যা
→ /volunteer/issues

প্রোফাইল
→ /volunteer/profile
```

## Admin

```text
ড্যাশবোর্ড
→ /admin

রিপোর্ট যাচাই
→ /admin/reports

দুর্যোগ মানচিত্র
→ /admin/map

তীব্রতা বিশ্লেষণ
→ /admin/severity

ত্রাণ বরাদ্দ
→ /admin/resources

মজুত ব্যবস্থাপনা
→ /admin/inventory

অপারেশন
→ /admin/operations

প্রোফাইল
→ /admin/profile
```

---

# 9. MOBILE NAVIGATION

The mobile hamburger menu must actually open.

When an item is clicked:

1. Navigate.
2. Close the mobile menu.

Do NOT leave the drawer open after navigation.

Clicking outside the drawer should close it.

---

# 10. BREADCRUMBS

Where appropriate, breadcrumbs should work.

Example:

```text
ড্যাশবোর্ড
>
রিপোর্ট
>
RPT-001
```

Clicking:

**ড্যাশবোর্ড**

must return to the correct dashboard.

---

# 11. BACK BUTTONS

Every detail page should have:

**← ফিরে যান**

Use browser history where appropriate:

```text
navigate(-1)
```

or navigate to the logical parent page.

Examples:

Report detail:

```text
→ /citizen/reports
```

Task detail:

```text
→ /volunteer/tasks
```

Admin report detail:

```text
→ /admin/reports
```

---

# 12. CITIZEN COMPLETE FUNCTIONALITY

Test the complete Citizen journey.

---

## Citizen Dashboard

All cards must work.

### "দুর্যোগ রিপোর্ট করুন"

```text
→ /citizen/report
```

### "আমার রিপোর্ট"

```text
→ /citizen/reports
```

### Recent report

Clicking it:

```text
→ /citizen/reports/:id
```

### Map card

```text
→ /citizen/map
```

---

# 13. CITIZEN REPORT FORM

The form must actually work.

Required:

```text
দুর্যোগের ধরন
ঘটনার শিরোনাম
ঘটনার বিবরণ
অবস্থান
```

Optional:

```text
ছবি
আক্রান্ত মানুষের সংখ্যা
```

If invalid:

Show inline error.

If valid:

Open confirmation modal.

---

# 14. REPORT SUBMISSION

When the citizen confirms:

Create a new report in shared frontend state.

Generate a unique ID:

```text
RPT-001
RPT-002
RPT-003
...
```

Do not duplicate an existing ID.

Set:

```text
status = pending
```

Set:

```text
severity = unassessed
```

Then navigate to:

```text
/citizen/reports/:id
```

Show success information.

---

# 15. NEW REPORT MUST APPEAR EVERYWHERE

This is critical.

When Citizen creates:

```text
RPT-009
```

that same report must appear in:

### Citizen

```text
আমার রিপোর্ট
```

### Admin

```text
রিপোর্ট যাচাই
```

### Maps

If appropriate, display the incident marker.

Do NOT create a second copy of the report for Admin.

Use shared state.

---

# 16. CITIZEN REPORT STATUS

When Admin verifies the report:

Citizen must see:

```text
অপেক্ষমাণ
```

change to:

```text
যাচাইকৃত
```

If Admin rejects:

```text
বাতিল
```

The citizen report detail must reflect the new status.

---

# 17. CITIZEN MAP

Every incident marker must work.

Click marker:

Show popup.

Popup:

```text
সুনামগঞ্জ বন্যা

তীব্রতা:
উচ্চ

আক্রান্ত:
320 জন

[ বিস্তারিত দেখুন ]
```

The button:

```text
→ correct report detail page
```

Do NOT create a button that does nothing.

---

# 18. CITIZEN PROFILE

**প্রোফাইল সম্পাদনা করুন**

must open a modal.

Allow editing:

* name
* phone
* email

Save button:

**পরিবর্তন সংরক্ষণ করুন**

Update frontend state.

Show toast:

**প্রোফাইল সফলভাবে আপডেট হয়েছে।**

Cancel:

Close modal without changes.

---

# ==================================================

# VOLUNTEER FUNCTIONALITY

# ==================================================

# 19. VOLUNTEER DASHBOARD

Every major card must navigate correctly.

### সক্রিয় কাজ

```text
→ /volunteer/tasks
```

### জরুরি কাজ

Filter task list to critical tasks.

### Active task

```text
→ /volunteer/tasks/:id
```

### Map

```text
→ /volunteer/map
```

---

# 20. TASK FUNCTIONALITY

Task details must be connected to the actual task data.

Example:

```text
TASK-023
```

must load:

```text
/volunteer/tasks/TASK-023
```

Do NOT show the same hardcoded task for every ID.

---

# 21. TASK STATUS FLOW

Implement:

```text
Assigned
↓
En Route
↓
In Progress
↓
Completed
```

Bangla:

```text
নতুন
↓
পথে রয়েছে
↓
চলমান
↓
সম্পন্ন
```

Only allow logical next status.

Example:

If:

```text
Assigned
```

show:

**পথে রয়েছি**

After clicking:

```text
En Route
```

show:

**কাজ শুরু করেছি**

Then:

```text
In Progress
```

show:

**কাজ সম্পন্ন**

---

# 22. TASK STATUS MUST UPDATE ADMIN

When Volunteer changes:

```text
TASK-023
In Progress
```

Admin Operations must immediately reflect:

```text
চলমান
```

and the progress should update.

Example:

```text
0%
→
30%
→
65%
→
100%
```

Use a simple logical mapping.

---

# 23. FIELD ISSUE FUNCTIONALITY

Volunteer selects:

```text
রাস্তা বন্ধ
```

Then enters:

```text
location
description
photo
```

Submit.

Create:

```text
ISSUE-001
```

Add it to shared state.

Admin must be able to see the same issue.

---

# 24. FIELD ISSUE ADMIN FLOW

Volunteer:

```text
Submit issue
```

Admin:

```text
View issue
```

Admin can mark:

```text
সমাধানাধীন
```

or:

```text
সমাধান হয়েছে
```

Volunteer should see updated status.

---

# ==================================================

# ADMIN FUNCTIONALITY

# ==================================================

# 25. ADMIN DASHBOARD

Every quick-action card must navigate.

```text
রিপোর্ট যাচাই
→ /admin/reports

তীব্রতা বিশ্লেষণ
→ /admin/severity

ত্রাণ বরাদ্দ
→ /admin/resources

মজুত ব্যবস্থাপনা
→ /admin/inventory

অপারেশন
→ /admin/operations
```

---

# 26. ADMIN REPORT VERIFICATION

Admin opens:

```text
/admin/reports
```

Selects:

```text
RPT-001
```

Then:

```text
/admin/reports/RPT-001
```

Verify.

The shared report changes:

```text
pending
→
verified
```

Reject:

```text
pending
→
rejected
```

---

# 27. VERIFIED REPORT CREATES OPERATIONAL POSSIBILITY

Once verified, the report can be used by:

* severity analysis
* map
* resource allocation
* task assignment

Do not automatically pretend resources have already been allocated.

Keep the workflow logical.

---

# 28. SEVERITY CALCULATOR

The severity calculator must actually calculate.

Inputs should affect the result.

For example:

```text
Affected People
Damage Level
Medical Emergency
Road Accessibility
Shelter Availability
```

Calculate:

```text
Severity Score
```

Then:

```text
0–30
কম

31–60
মাঝারি

61–80
উচ্চ

81–100
অতি জরুরি
```

Keep the calculation simple and transparent.

---

# 29. SEVERITY SCORE MUST PERSIST

After calculating for:

```text
RPT-001
```

store the result in shared state.

Example:

```text
severityScore: 82
severity: critical
```

The same result should appear in:

* Admin report
* Admin severity page
* Admin dashboard
* Admin map
* Resource allocation

---

# 30. RESOURCE ALLOCATION

Admin selects a verified/high-priority incident.

Click:

**ত্রাণ বরাদ্দ করুন**

Open allocation modal.

Show:

```text
পানি
খাবার
ওষুধ
```

Show available inventory.

Admin enters quantity.

Validation:

```text
allocated quantity <= available quantity
```

If invalid:

**পর্যাপ্ত মজুত নেই।**

If valid:

Allow confirmation.

---

# 31. ALLOCATION MUST UPDATE INVENTORY

Example:

Before:

```text
পানি = 1500
```

Allocate:

```text
500
```

After:

```text
পানি = 1000
```

This change must appear on the inventory page.

Do NOT hardcode separate numbers.

---

# 32. RESOURCE ALLOCATION RECORD

Create an allocation record:

```text
ALLOC-001
```

Containing:

```text
incident
location
resources
quantities
date
status
```

Show allocation history.

---

# 33. INVENTORY ADD FUNCTION

Click:

**+ নতুন সামগ্রী যোগ করুন**

Modal opens.

Submit:

Add item to shared inventory.

Example:

```text
পানি
500 বোতল
সুনামগঞ্জ ত্রাণকেন্দ্র
```

The inventory table must immediately update.

---

# 34. INVENTORY EDIT

Every inventory item that has an edit action must actually open an edit modal.

Allow:

* quantity
* depot
* category

Save.

Update shared state.

---

# 35. INVENTORY DELETE

If delete functionality exists:

Show confirmation:

**এই সামগ্রীটি মুছে ফেলবেন?**

Only delete after confirmation.

If delete is not needed, remove the delete button instead of leaving a nonfunctional button.

---

# 36. OPERATIONS PAGE

Operations must be generated from actual tasks.

Do NOT maintain a separate fake operations list.

If:

```text
TASK-023
```

exists, Operations should derive its information from the task.

Display:

* task
* location
* volunteers
* priority
* status
* progress

---

# 37. VOLUNTEER ASSIGNMENT

Admin must be able to assign a task to a volunteer using a simple UI.

Example:

```text
Volunteer:
[ Rakibul Hasan ▼ ]
```

Click:

**কাজ বরাদ্দ করুন**

Task becomes:

```text
assigned
```

Volunteer dashboard receives it.

---

# 38. ASSIGNMENT MUST BE SHARED

Admin assigns:

```text
TASK-023
→ Rakibul Hasan
```

Volunteer logs in.

Volunteer sees:

```text
TASK-023
```

Do not create a second task object.

Use the same task.

---

# 39. NOTIFICATIONS MUST WORK

When meaningful actions happen, create notifications.

Examples:

### Citizen submits report

Admin:

**নতুন রিপোর্ট যাচাইয়ের অপেক্ষায়।**

### Admin verifies report

Citizen:

**আপনার রিপোর্ট যাচাই করা হয়েছে।**

### Admin assigns task

Volunteer:

**আপনার জন্য নতুন কাজ বরাদ্দ করা হয়েছে।**

### Volunteer reports issue

Admin:

**মাঠপর্যায়ে নতুন সমস্যা জানানো হয়েছে।**

### Volunteer completes task

Admin:

**TASK-023 সম্পন্ন হয়েছে।**

---

# 40. NOTIFICATION CLICK NAVIGATION

Every notification must navigate to the relevant location.

Example:

```text
নতুন রিপোর্ট
→ /admin/reports/RPT-009
```

Task:

```text
→ /volunteer/tasks/TASK-023
```

Issue:

```text
→ /admin/operations
```

Do NOT make notification items dead.

---

# 41. SEARCH MUST WORK

If search exists:

Citizen:

Search reports.

Volunteer:

Search tasks.

Admin:

Search reports/resources.

Search should filter actual current shared data.

If no result:

```text
কোনো তথ্য পাওয়া যায়নি।
```

---

# 42. FILTERS MUST WORK

Every visible filter must actually filter.

Do not create decorative filters.

Examples:

```text
Status
Severity
Disaster Type
Date
Priority
```

If a filter cannot be implemented within the project deadline, remove it.

---

# 43. MODALS MUST WORK

Every modal:

* opens
* closes
* validates
* submits
* cancels
* resets appropriately

Close options:

* X
* Cancel
* outside click where appropriate
* Escape key where practical

Do not allow accidental submission by clicking outside.

---

# 44. FORMS MUST RESET CORRECTLY

After successful creation:

Reset form.

After cancellation:

Do not leave accidental previous values unless appropriate.

When editing:

Load current values.

When saving:

Update data.

---

# 45. TOAST SYSTEM

Use one reusable toast system.

Success:

```text
✓ সফলভাবে সম্পন্ন হয়েছে
```

Error:

```text
⚠ কিছু সমস্যা হয়েছে
```

Information:

```text
ℹ নতুন তথ্য পাওয়া গেছে
```

Do not create different toast styles on different pages.

---

# 46. EMPTY STATES

Every list must have an empty state.

Example:

```text
কোনো রিপোর্ট পাওয়া যায়নি।

আপনার এখনো কোনো রিপোর্ট নেই।
```

Provide a useful action when appropriate.

---

# 47. LOADING STATES

Use skeleton/loading states where mock asynchronous actions exist.

Example:

```text
তথ্য লোড হচ্ছে...
```

Keep loading times short.

---

# 48. ERROR BOUNDARY

Add a basic React error boundary.

If an unexpected UI error occurs:

Show:

```text
দুঃখিত, একটি সমস্যা হয়েছে।

[ ড্যাশবোর্ডে ফিরে যান ]
```

The application should not become a completely blank screen.

---

# 49. 404 PAGE

Create:

```text
/404
```

or a catch-all route.

Show:

# 404

**এই পৃষ্ঠাটি খুঁজে পাওয়া যায়নি।**

Button:

**হোমে ফিরে যান**

Button must work.

---

# 50. URL REFRESH TEST

Every route must work after refreshing the browser.

Test:

```text
/citizen
/citizen/report
/citizen/reports/RPT-001
/volunteer/tasks/TASK-023
/admin/reports/RPT-001
/admin/inventory
```

No blank page.

---

# 51. INVALID ID HANDLING

If user visits:

```text
/citizen/reports/INVALID
```

Show:

**রিপোর্টটি পাওয়া যায়নি।**

Not:

```text
Cannot read undefined
```

Similarly:

```text
/volunteer/tasks/INVALID
```

must show a proper not-found state.

---

# 52. MAP FUNCTIONALITY

All maps must:

* load correctly
* show markers
* allow marker interaction
* show popup
* show legend
* respond to filters

Avoid unnecessary map complexity.

Use Leaflet + OpenStreetMap.

---

# 53. MAP FILTER SYNCHRONIZATION

If user selects:

```text
উচ্চ ঝুঁকি
```

only high-severity markers should remain visible.

If:

```text
আমার কাজ
```

is selected on Volunteer Map:

Show only tasks assigned to the current volunteer.

---

# 54. DASHBOARD STATISTICS MUST BE DYNAMIC

Do NOT hardcode:

```text
12 active tasks
8 reports
```

if those numbers can be calculated.

Calculate from shared state.

Example:

```text
pendingReports.length
verifiedReports.length
activeTasks.length
completedTasks.length
```

This makes the demo consistent.

---

# 55. DATA CONSISTENCY

There must be ONE source of truth.

Example:

```text
reports
tasks
fieldIssues
inventory
notifications
users
allocations
```

should live in shared state.

Do not duplicate the same data in multiple components.

---

# 56. DEMO DATA

Create enough mock data for a good presentation.

At minimum:

### Reports

8–12

### Tasks

6–10

### Field Issues

4–6

### Inventory Items

8–12

### Users

Several citizen and volunteer users.

### Locations

Use Bangladesh-focused locations such as:

* সুনামগঞ্জ
* সিলেট
* কক্সবাজার
* খুলনা
* বরিশাল

Keep the data realistic.

---

# 57. DEMO RESET

Admin can reset demo data.

Button:

**ডেমো ডেটা রিসেট করুন**

After reset:

* reports return to initial state
* tasks return to initial state
* inventory returns to initial state
* issues return to initial state
* notifications return to initial state

Show:

**ডেমো ডেটা পুনরায় সেট করা হয়েছে।**

---

# 58. THE COMPLETE END-TO-END DEMO MUST WORK

Perform this exact test.

## STEP 1

Open:

```text
/
```

Click:

**লগইন**

---

## STEP 2

Login as Citizen.

Go:

```text
/citizen
```

---

## STEP 3

Click:

**দুর্যোগ রিপোর্ট করুন**

---

## STEP 4

Submit:

```text
বন্যা
সুনামগঞ্জ
320 affected
location
photo
description
```

---

## STEP 5

Report becomes:

```text
RPT-NEW
অপেক্ষমাণ
```

---

## STEP 6

Logout.

---

## STEP 7

Login as Admin.

---

## STEP 8

Open:

**রিপোর্ট যাচাই**

The newly created report must appear.

---

## STEP 9

Open report.

Verify it.

---

## STEP 10

Open:

**তীব্রতা বিশ্লেষণ**

Calculate:

```text
82
অতি জরুরি
```

---

## STEP 11

Open:

**ত্রাণ বরাদ্দ**

Allocate:

```text
পানি
500
```

---

## STEP 12

Inventory decreases.

---

## STEP 13

Assign a task to a volunteer.

---

## STEP 14

Logout.

---

## STEP 15

Login as Volunteer.

New task must appear.

---

## STEP 16

Open task.

Click:

**পথে রয়েছি**

---

## STEP 17

Click:

**কাজ শুরু করেছি**

---

## STEP 18

Report:

**রাস্তা বন্ধ**

---

## STEP 19

Complete task.

---

## STEP 20

Logout.

---

## STEP 21

Login as Admin.

Open:

**অপারেশন**

Admin must see:

```text
TASK-NEW
সম্পন্ন
100%
```

Admin must also see the field issue.

This proves the entire system is connected.

---

# 59. VISUAL DESIGN FINAL AUDIT

Maintain:

### Primary

Light/dark green.

### Background

White / very light green.

### Emergency

Red.

### Warning

Amber.

### Information

Blue.

### Success

Green.

Do not introduce random colors.

---

# 60. BANGLA LANGUAGE FINAL AUDIT

Review the entire application.

Fix:

* awkward translations
* inconsistent terminology
* English text that should be Bangla
* spelling inconsistencies
* mixed terminology

Use consistent terms.

For example, always use:

```text
স্বেচ্ছাসেবক
```

instead of randomly switching between:

```text
Volunteer
ভলান্টিয়ার
স্বেচ্ছাসেবক
```

English can remain as a secondary label where useful.

---

# 61. TEXT QUALITY

Avoid generic placeholder text such as:

```text
Lorem ipsum
Test
Hello
Sample
Click here
```

unless it is clearly demo data.

Every visible sentence should make sense in the context of disaster response.

---

# 62. RESPONSIVE AUDIT

Test at:

```text
1920 × 1080
1440 × 900
1280 × 720
1024 × 768
768 × 1024
390 × 844
```

Fix:

* overflow
* clipped text
* broken tables
* overlapping buttons
* map overflow
* sidebar problems
* modal overflow
* mobile navigation

---

# 63. ACCESSIBILITY AUDIT

Check:

* keyboard navigation
* focus states
* button labels
* form labels
* sufficient contrast
* image alt text
* status text
* error messages

Never communicate important information through color alone.

---

# 64. NO CONSOLE ERRORS

Before finalizing:

Open browser developer console.

There must be no:

```text
Unhandled exception
Cannot read properties of undefined
404
Failed to load resource
Missing key
React warning
```

Fix all meaningful warnings and errors.

---

# 65. NO BROKEN IMPORTS

Run the project from a clean installation.

Verify:

```text
npm install
npm run dev
```

works.

If using:

```text
npm run build
```

the production build must succeed.

Fix all build errors.

---

# 66. NO UNUSED DEAD FEATURES

If a feature was started but cannot be completed:

REMOVE IT.

Do not leave:

```text
Coming Soon
```

buttons everywhere.

The final application should look complete.

---

# 67. DO NOT OVER-ENGINEER

Remember:

**3 students + 1 month.**

Prefer:

```text
Simple
Reliable
Demonstrable
Reusable
```

over:

```text
Complex
Over-engineered
Hard to maintain
```

The goal is a strong course project, not a commercial enterprise system.

---

# 68. FINAL COMPONENT AUDIT

Create reusable components for repeated UI:

```text
Button
Input
Select
Textarea
Modal
Toast
StatusBadge
PriorityBadge
StatCard
DataTable
PageHeader
Sidebar
Topbar
NotificationPanel
Map
MapMarker
MapLegend
EmptyState
LoadingState
ErrorState
ConfirmDialog
ProgressBar
```

Do not duplicate these unnecessarily.

---

# 69. FINAL CODE ORGANIZATION

Keep the project organized.

```text
src/
├── components/
├── pages/
├── context/
├── data/
├── routes/
├── utils/
├── hooks/
├── assets/
├── App.jsx
├── main.jsx
└── index.css
```

Avoid placing the entire application inside:

```text
App.jsx
```

---

# 70. FINAL SECURITY EXPECTATION

This is frontend-only.

Do not pretend mock authentication is production security.

Add a clear internal structure so real backend authentication can replace it later.

Do not expose real passwords.

Do not use real sensitive personal information.

---

# 71. FINAL PROJECT SCOPE

The current project should focus on:

### Citizen

* Report disasters
* Upload photos
* Share location
* Track reports

### Volunteer

* View disaster map
* Receive tasks
* Update task status
* Report field issues

### Admin

* Verify reports
* Monitor disaster areas
* Calculate severity
* Allocate resources
* Manage inventory
* Monitor operations

These correspond to the defined project scope.

---

# 72. FUTURE FEATURES MUST REMAIN OUTSIDE THE CURRENT IMPLEMENTATION

Do not spend development time implementing:

* Mobile app
* Offline reporting
* AI severity prediction
* Drone monitoring
* SMS notifications
* Weather API
* Advanced analytics

These are listed as future enhancements in the project presentation.

---

# 73. FINAL PRE-PRESENTATION CHECKLIST

## Navigation

* [ ] Every navbar link works
* [ ] Every sidebar link works
* [ ] Every footer link works
* [ ] Every CTA works
* [ ] Every table action works
* [ ] Every card action works
* [ ] Every notification works
* [ ] Every map action works
* [ ] Every modal works
* [ ] Back buttons work
* [ ] Logout works
* [ ] 404 works

## Authentication

* [ ] Citizen login
* [ ] Volunteer login
* [ ] Admin login
* [ ] Role redirect
* [ ] Protected routes
* [ ] Logout
* [ ] Session persistence

## Citizen

* [ ] Dashboard
* [ ] Report
* [ ] Photo
* [ ] Location
* [ ] Submit
* [ ] Reports
* [ ] Detail
* [ ] Timeline
* [ ] Map
* [ ] Profile

## Volunteer

* [ ] Dashboard
* [ ] Tasks
* [ ] Task detail
* [ ] Status updates
* [ ] Map
* [ ] Field issues
* [ ] Profile
* [ ] Notifications

## Admin

* [ ] Dashboard
* [ ] Report verification
* [ ] Severity
* [ ] Resources
* [ ] Inventory
* [ ] Operations
* [ ] Map
* [ ] Field issues
* [ ] Profile

## Integration

* [ ] Citizen report reaches Admin
* [ ] Admin verification reaches Citizen
* [ ] Severity reaches map
* [ ] Allocation changes inventory
* [ ] Admin assignment reaches Volunteer
* [ ] Volunteer status reaches Admin
* [ ] Volunteer issue reaches Admin
* [ ] Completed task reaches Admin
* [ ] Notifications navigate correctly

## UI

* [ ] Bangla text
* [ ] Light green theme
* [ ] Responsive
* [ ] Accessible
* [ ] Consistent components
* [ ] No visual bugs
* [ ] No overflow
* [ ] No broken maps
* [ ] No broken images

## Technical

* [ ] No console errors
* [ ] No broken imports
* [ ] No invalid routes
* [ ] No duplicate data sources
* [ ] Build succeeds
* [ ] Demo reset works
* [ ] Mock state works
* [ ] Refreshing routes works

---

# 74. FINAL COMMAND

Now inspect the entire existing frontend.

Do NOT assume previous pages work simply because they were generated.

**TEST EVERYTHING.**

For every visible interactive element, determine what it should do.

Then implement the missing behavior.

Fix broken routes.

Fix broken buttons.

Fix state synchronization.

Fix forms.

Fix modals.

Fix maps.

Fix filters.

Fix search.

Fix authentication.

Fix logout.

Fix responsive layouts.

Fix console errors.

Fix build errors.

Fix inconsistent Bangla text.

Fix duplicated data.

Remove dead functionality.

After completing the audit, run through the complete:

**Citizen → Admin → Volunteer → Admin**

workflow.

The final result must be a **fully navigable, interconnected, frontend-only disaster response platform** where the user can move through the application naturally without encountering dead links or unfinished interactions.

Do not add unnecessary features.

Do not rewrite working functionality without a reason.

Do not introduce backend code.

Do not introduce unnecessary libraries.

Focus on:

**EVERY LINK WORKS**

**EVERY IMPORTANT BUTTON WORKS**

**EVERY ROUTE WORKS**

**EVERY ROLE WORKS**

**DATA FLOWS BETWEEN ROLES**

**THE COMPLETE DEMO WORKS**

**THE UI LOOKS PROFESSIONAL**

**THE APPLICATION IS READY FOR PRESENTATION**
