# Real-Time Disaster Response Coordination Platform

## Frontend Development Prompt — Part 3 of 3

Continue the existing React.js frontend from **Part 1 and Part 2**.

Do NOT redesign the existing Citizen or Volunteer modules.

Maintain exactly the same:

* Bangla-first interface
* Light green visual theme
* White/light-gray backgrounds
* Dark green primary actions
* Red/orange emergency indicators
* Reusable components
* Responsive layout
* Leaflet map system
* Mock state/data architecture
* Role-based routing
* Notification system
* Status system

Part 3 completes the platform by implementing:

1. Coordinator/Admin Dashboard
2. Report Verification
3. Disaster Monitoring
4. Severity Scoring
5. Resource Allocation
6. Inventory Management
7. Operations Monitoring
8. Admin Map
9. Cross-role integration
10. Final polish
11. One-month implementation plan

The project presentation defines the Coordinator/Admin responsibilities as report verification, disaster-area monitoring, resource allocation, inventory management, and overall operation tracking.

---

# ==================================================

# 1. ADMIN / COORDINATOR MODULE

# ==================================================

# 1.1 ADMIN ROUTES

Implement:

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

---

# 1.2 ADMIN DASHBOARD

Route:

```text
/admin
```

Page title:

**সমন্বয়কারী ড্যাশবোর্ড**

Subtitle:

**দুর্যোগ পরিস্থিতি, রিপোর্ট, ত্রাণ এবং মাঠপর্যায়ের কার্যক্রম এক নজরে পর্যবেক্ষণ করুন।**

The dashboard should be the main command center of the platform.

Do NOT make it visually overwhelming.

Prioritize:

1. Active emergencies
2. Pending reports
3. High-severity areas
4. Resource availability
5. Volunteer operations

---

# 1.3 EMERGENCY OVERVIEW

At the top create an emergency summary section.

Example:

```text
সক্রিয় দুর্যোগ

06

উচ্চ ঝুঁকির এলাকা

03

যাচাইয়ের অপেক্ষায়

08

চলমান কার্যক্রম

12
```

Use four StatCards.

---

# 1.4 CRITICAL ALERT

If there are high-severity incidents:

Show a prominent alert.

Example:

**অতি জরুরি পরিস্থিতি**

**সুনামগঞ্জ অঞ্চলে ৩২০ জন মানুষ বন্যায় আক্রান্ত। জরুরি ত্রাণ প্রয়োজন।**

Actions:

**বিস্তারিত দেখুন**

**ত্রাণ বরাদ্দ করুন**

Use red only for the emergency indicator.

---

# 1.5 ADMIN QUICK ACTIONS

Create quick-action cards:

```text
রিপোর্ট যাচাই
08 অপেক্ষমাণ

তীব্রতা বিশ্লেষণ
03 উচ্চ ঝুঁকি

ত্রাণ বরাদ্দ
05 অনুরোধ

মজুত ব্যবস্থাপনা
02 কম মজুত
```

Clicking each card navigates to the relevant page.

---

# 1.6 ACTIVE DISASTER MAP PREVIEW

Create a large map section.

Heading:

**বর্তমান দুর্যোগ পরিস্থিতি**

Map should show:

* affected zones
* incident markers
* relief camps
* active tasks
* high-priority locations

Use Leaflet.js.

The project's architecture specifically includes an interactive disaster map.

---

# 1.7 MAP LEGEND

Use:

```text
🔴 উচ্চ ঝুঁকি
🟠 মাঝারি ঝুঁকি
🟢 কম ঝুঁকি

🔵 ত্রাণ ক্যাম্প
🟣 চলমান কাজ
```

Do not depend only on color.

Use icons and labels.

---

# 1.8 RECENT REPORTS

Show the latest incoming citizen reports.

Columns:

```text
ID
দুর্যোগ
অবস্থান
তীব্রতা
সময়
অবস্থা
অ্যাকশন
```

Example:

```text
RPT-008
বন্যা
সুনামগঞ্জ
উচ্চ
১০ মিনিট আগে
অপেক্ষমাণ
দেখুন
```

Button:

**সব রিপোর্ট দেখুন**

---

# ==================================================

# 2. REPORT VERIFICATION

# ==================================================

# 2.1 REPORT LIST

Route:

```text
/admin/reports
```

Heading:

**দুর্যোগ রিপোর্ট যাচাই**

Subtitle:

**নাগরিকদের পাঠানো রিপোর্ট পর্যালোচনা ও যাচাই করুন।**

The project explicitly includes an admin verification panel for reviewing, verifying, and validating incoming citizen reports.

---

# 2.2 REPORT FILTERS

Create:

Search:

**রিপোর্ট খুঁজুন...**

Filters:

```text
অবস্থা
সব
অপেক্ষমাণ
যাচাইকৃত
বাতিল

দুর্যোগ
সব
বন্যা
ঘূর্ণিঝড়
নদীভাঙন
জলাবদ্ধতা
ভূমিধস

তীব্রতা
সব
উচ্চ
মাঝারি
কম
```

---

# 2.3 REPORT TABLE

Columns:

```text
রিপোর্ট ID
দুর্যোগ
অবস্থান
রিপোর্টকারী
আক্রান্ত
তীব্রতা
অবস্থা
তারিখ
```

Add action:

**পর্যালোচনা করুন**

---

# 2.4 REPORT REVIEW PAGE

Route:

```text
/admin/reports/:id
```

This page should be one of the most polished admin pages.

Header:

**রিপোর্ট পর্যালোচনা**

Show:

```text
RPT-008

অবস্থা:
অপেক্ষমাণ
```

---

# 2.5 REPORT DETAILS

Display:

### দুর্যোগ

বন্যা

### শিরোনাম

সুনামগঞ্জে আকস্মিক বন্যা

### অবস্থান

সুনামগঞ্জ

### আক্রান্ত মানুষ

320

### রিপোর্টের সময়

আজ, ১০:৩০ AM

### রিপোর্টের বিবরণ

এলাকার বেশ কয়েকটি বাড়িতে পানি প্রবেশ করেছে এবং প্রধান সড়কের একটি অংশ পানিতে ডুবে গেছে।

---

# 2.6 REPORT PHOTO REVIEW

Show submitted images.

Features:

* image gallery
* image zoom
* image modal
* image count

Label:

**রিপোর্টের ছবি**

---

# 2.7 REPORT LOCATION REVIEW

Show a large Leaflet map.

Marker:

**রিপোর্টের অবস্থান**

Display:

```text
সুনামগঞ্জ
25.0658, 91.3950
```

Add:

**মানচিত্রে দেখুন**

---

# 2.8 VERIFICATION ACTIONS

At the bottom/right of the page:

### Verify

Green button:

**রিপোর্ট যাচাই করুন**

### Reject

Red-outline button:

**রিপোর্ট বাতিল করুন**

### Need More Information

Secondary button:

**আরও তথ্য প্রয়োজন**

---

# 2.9 VERIFY MODAL

When clicking verify:

Heading:

**রিপোর্ট যাচাই করবেন?**

Message:

**রিপোর্টটি যাচাই করলে এটি সক্রিয় দুর্যোগ হিসেবে সিস্টেমে অন্তর্ভুক্ত হবে।**

Buttons:

**হ্যাঁ, যাচাই করুন**

**বাতিল**

After confirmation:

```text
✓ রিপোর্ট সফলভাবে যাচাই করা হয়েছে
```

Update:

```text
status = verified
```

---

# 2.10 REJECT MODAL

Heading:

**রিপোর্ট বাতিল করবেন?**

Require a reason.

Dropdown:

```text
ভুল তথ্য
ডুপ্লিকেট রিপোর্ট
অপর্যাপ্ত তথ্য
অবস্থান ভুল
অন্যান্য
```

Textarea:

**বিস্তারিত কারণ**

Button:

**রিপোর্ট বাতিল করুন**

---

# 2.11 MORE INFORMATION

If admin selects:

**আরও তথ্য প্রয়োজন**

Show modal:

```text
রিপোর্টকারীর জন্য বার্তা

[________________________]

[ অনুরোধ পাঠান ]
```

Frontend demo:

Add notification to the citizen.

---

# ==================================================

# 3. SEVERITY SCORING

# ==================================================

# 3.1 SEVERITY PAGE

Route:

```text
/admin/severity
```

Heading:

**দুর্যোগের তীব্রতা বিশ্লেষণ**

Subtitle:

**আক্রান্ত এলাকার তথ্যের ভিত্তিতে অগ্রাধিকার নির্ধারণ করুন।**

The project includes an automated need-severity scoring calculator intended to rank affected areas for relief prioritization.

---

# 3.2 IMPORTANT FRONTEND LIMITATION

Do NOT claim that this frontend contains a real AI/ML model.

For this course-project frontend:

Implement a simple **rule-based demo severity calculator**.

The architecture should later allow a real backend/model to replace it.

---

# 3.3 SEVERITY INPUTS

Create a form:

### আক্রান্ত মানুষের সংখ্যা

Number input.

### পানির স্তর / ক্ষতির মাত্রা

Select:

```text
কম
মাঝারি
বেশি
অত্যন্ত বেশি
```

### জরুরি চিকিৎসা প্রয়োজন

```text
হ্যাঁ
না
```

### রাস্তা যোগাযোগ

```text
স্বাভাবিক
আংশিক বন্ধ
সম্পূর্ণ বন্ধ
```

### আশ্রয়কেন্দ্রের অবস্থা

```text
পর্যাপ্ত
সীমিত
অপর্যাপ্ত
```

---

# 3.4 SCORE CALCULATION

Create a simple frontend scoring function.

Example conceptual scoring:

```text
আক্রান্ত মানুষ
+
ক্ষতির মাত্রা
+
চিকিৎসার প্রয়োজন
+
যোগাযোগ ব্যবস্থা
+
আশ্রয়কেন্দ্রের অবস্থা
=
Severity Score
```

Do not make the scoring unnecessarily complicated.

Example result:

```text
Severity Score

82 / 100

অতি জরুরি
```

---

# 3.5 SEVERITY DISPLAY

Use a large score card.

Example:

```text
82

/100

অতি জরুরি
```

Below:

```text
প্রস্তাবিত অগ্রাধিকার:
১
```

Color:

Critical → red

High → orange

Medium → yellow

Low → green

---

# 3.6 SEVERITY LIST

Show affected areas ranked by severity.

Columns:

```text
অবস্থান
আক্রান্ত
স্কোর
তীব্রতা
অগ্রাধিকার
```

Example:

```text
সুনামগঞ্জ
320
82
অতি জরুরি
1

কক্সবাজার
540
74
উচ্চ
2

খুলনা
180
51
মাঝারি
3
```

This becomes the foundation for resource allocation.

---

# ==================================================

# 4. RESOURCE ALLOCATION

# ==================================================

# 4.1 RESOURCE PAGE

Route:

```text
/admin/resources
```

Heading:

**ত্রাণ ও সম্পদ বরাদ্দ**

Subtitle:

**অগ্রাধিকারপ্রাপ্ত এলাকায় উপলব্ধ সম্পদ কার্যকরভাবে বরাদ্দ করুন।**

The project defines a resource allocation engine intended to match available relief supplies with high-need zones based on severity.

---

# 4.2 RESOURCE SUMMARY

Cards:

```text
মোট ত্রাণ
1,840 ইউনিট

বরাদ্দ করা হয়েছে
1,120 ইউনিট

অবশিষ্ট
720 ইউনিট

জরুরি অনুরোধ
05
```

---

# 4.3 RESOURCE REQUESTS

Display incoming requests.

Example:

```text
সুনামগঞ্জ

প্রয়োজন:
পানি 500
খাবার 300
ওষুধ 100

Priority:
অতি জরুরি
```

Button:

**বরাদ্দ করুন**

---

# 4.4 RESOURCE ALLOCATION MODAL

When clicking:

**বরাদ্দ করুন**

Show:

```text
এলাকা:
সুনামগঞ্জ

প্রয়োজনীয়:
পানি — 500
খাবার — 300
ওষুধ — 100
```

Then inputs:

```text
পানি
[ 500 ]

খাবার
[ 300 ]

ওষুধ
[ 100 ]
```

Show available stock beside each:

```text
উপলব্ধ: 700
```

---

# 4.5 VALIDATION

Do not allow:

```text
requested allocation > available inventory
```

Show:

**পর্যাপ্ত মজুত নেই।**

If sufficient:

**বরাদ্দের জন্য প্রস্তুত।**

---

# 4.6 CONFIRM ALLOCATION

Modal:

**ত্রাণ বরাদ্দ নিশ্চিত করবেন?**

Show summary:

```text
সুনামগঞ্জ

পানি: 500
খাবার: 300
ওষুধ: 100
```

Button:

**বরাদ্দ নিশ্চিত করুন**

---

# 4.7 SUCCESS

Show:

**✓ ত্রাণ সফলভাবে বরাদ্দ করা হয়েছে।**

Update mock state:

* inventory decreases
* allocation record created
* affected area's resource status updated

---

# ==================================================

# 5. INVENTORY MANAGEMENT

# ==================================================

# 5.1 INVENTORY PAGE

Route:

```text
/admin/inventory
```

Heading:

**মজুত ব্যবস্থাপনা**

Subtitle:

**বিভিন্ন ত্রাণকেন্দ্রে খাদ্য, পানি, ওষুধ ও অন্যান্য সামগ্রীর মজুত পর্যবেক্ষণ করুন।**

The project's inventory module is intended to track supplies such as food, medicine, and water and monitor stock levels across relief depots.

---

# 5.2 INVENTORY TABLE

Columns:

```text
সামগ্রী
ক্যাটাগরি
মোট মজুত
উপলব্ধ
বরাদ্দ
অবস্থা
```

Example:

```text
বিশুদ্ধ পানি
পানি
1,500
720
780
পর্যাপ্ত

খাবার প্যাকেট
খাদ্য
2,000
450
1,550
কম

প্রাথমিক ওষুধ
চিকিৎসা
600
120
480
জরুরি
```

---

# 5.3 STOCK STATUS

Statuses:

### পর্যাপ্ত

Green.

### কম

Orange.

### জরুরি

Red.

Create reusable:

`InventoryStatusBadge`

---

# 5.4 INVENTORY FILTERS

Filter:

```text
সব
খাদ্য
পানি
চিকিৎসা
অন্যান্য
```

Search:

**সামগ্রী খুঁজুন...**

---

# 5.5 ADD INVENTORY

Button:

**+ নতুন সামগ্রী যোগ করুন**

Modal fields:

```text
সামগ্রীর নাম
ক্যাটাগরি
পরিমাণ
ইউনিট
মজুত কেন্দ্র
```

Example:

```text
পানি
পানি
500
বোতল
সুনামগঞ্জ ত্রাণকেন্দ্র
```

Button:

**মজুতে যোগ করুন**

---

# 5.6 INVENTORY TRANSACTION

Allow simple actions:

```text
মজুত যোগ করুন
মজুত কমান
```

When reducing stock, require a reason:

```text
ত্রাণ বিতরণ
অন্য কেন্দ্রে স্থানান্তর
ক্ষতিগ্রস্ত
অন্যান্য
```

---

# ==================================================

# 6. OPERATIONS MONITORING

# ==================================================

# 6.1 OPERATIONS PAGE

Route:

```text
/admin/operations
```

Heading:

**অপারেশন পর্যবেক্ষণ**

Subtitle:

**বর্তমান দুর্যোগ মোকাবিলার কার্যক্রম এক নজরে পর্যবেক্ষণ করুন।**

---

# 6.2 OPERATION STATISTICS

Show:

```text
সক্রিয় কার্যক্রম
12

পথে রয়েছে
05

চলমান
04

সম্পন্ন
28
```

---

# 6.3 ACTIVE OPERATIONS TABLE

Columns:

```text
কাজ
এলাকা
স্বেচ্ছাসেবক
অগ্রাধিকার
অবস্থা
অগ্রগতি
```

Example:

```text
ত্রাণ বিতরণ
সুনামগঞ্জ
4 জন
অতি জরুরি
চলমান
65%

চিকিৎসা সহায়তা
কক্সবাজার
6 জন
উচ্চ
পথে রয়েছে
30%
```

---

# 6.4 PROGRESS BAR

Create reusable progress bar.

Example:

```text
ত্রাণ বিতরণ

████████████░░░░░░
65%
```

Use green for progress.

---

# 6.5 OPERATION DETAIL

Click an operation.

Show:

```text
কাজ:
ত্রাণ বিতরণ

এলাকা:
সুনামগঞ্জ

স্বেচ্ছাসেবক:
4 জন

অগ্রাধিকার:
অতি জরুরি
```

Map.

Then:

```text
কাজের অগ্রগতি

রিপোর্ট পাওয়া গেছে       ✓
রিপোর্ট যাচাই             ✓
সম্পদ বরাদ্দ              ✓
স্বেচ্ছাসেবক পথে           ✓
কাজ চলছে                  ●
কাজ সম্পন্ন                ○
```

This should visually connect the entire platform workflow.

---

# ==================================================

# 7. ADMIN DISASTER MAP

# ==================================================

# 7.1 MAP PAGE

Route:

```text
/admin/map
```

Heading:

**দুর্যোগ পরিস্থিতির মানচিত্র**

Make this a command-center style map.

---

# 7.2 MAP LAYOUT

Desktop:

```text
┌───────────────────────────────┬──────────────┐
│                               │              │
│                               │ Incident     │
│           MAP                 │ List         │
│                               │              │
│                               │              │
└───────────────────────────────┴──────────────┘
```

Map:

70–75%

Side panel:

25–30%

---

# 7.3 MAP CONTROLS

Filters:

```text
দুর্যোগ
তীব্রতা
রিপোর্ট
ত্রাণকেন্দ্র
কাজ
স্বেচ্ছাসেবক
```

---

# 7.4 MAP INCIDENT PANEL

When marker is clicked:

Show:

```text
সুনামগঞ্জ

বন্যা

Severity:
82 / 100

Affected:
320

Resources:
60%

Volunteers:
4

Status:
চলমান
```

Actions:

**বিস্তারিত**

**ত্রাণ বরাদ্দ**

---

# ==================================================

# 8. FIELD ISSUE MONITORING

# ==================================================

Add field issue information to admin operations.

Show:

**মাঠপর্যায়ের সমস্যা**

Example:

```text
🚧 রাস্তা বন্ধ
সুনামগঞ্জ
10 মিনিট আগে

📦 অতিরিক্ত ত্রাণ প্রয়োজন
খুলনা
25 মিনিট আগে

🚑 চিকিৎসা সহায়তা প্রয়োজন
কক্সবাজার
40 মিনিট আগে
```

Click:

**বিস্তারিত দেখুন**

---

# 9. FIELD ISSUE DETAIL

Show:

```text
সমস্যা:
রাস্তা বন্ধ

রিপোর্ট করেছেন:
Rakibul Hasan

কাজ:
TASK-023

অবস্থান:
সুনামগঞ্জ

সময়:
আজ ১:২৫ PM
```

Map.

Description.

Photo if available.

Actions:

```text
সমস্যাটি সমাধানের জন্য বরাদ্দ করুন
সমস্যা সমাধান হয়েছে
```

Keep the implementation simple.

---

# ==================================================

# 10. ADMIN PROFILE

# ==================================================

Route:

```text
/admin/profile
```

Show:

```text
নাম:
Asad Bin Nazrul Asad

ভূমিকা:
সমন্বয়কারী / প্রশাসক

ইমেইল:
admin@example.com
```

Statistics:

```text
যাচাই করা রিপোর্ট
42

সম্পদ বরাদ্দ
18

পর্যবেক্ষিত কার্যক্রম
31
```

Use mock values.

---

# ==================================================

# 11. CROSS-ROLE DATA INTEGRATION

# ==================================================

This is extremely important.

Do not make Citizen, Volunteer, and Admin separate fake applications.

They must behave like **one platform**.

---

# 11.1 SHARED REPORT FLOW

Citizen:

```text
Create report
        ↓
Report status = pending
```

Admin:

```text
See pending report
        ↓
Verify report
```

Report:

```text
status = verified
```

Volunteer:

```text
Verified incident appears on map
```

Admin:

```text
Assign resources/task
```

Volunteer:

```text
Receive task
```

Citizen:

```text
Can see report status
```

---

# 11.2 SHARED TASK FLOW

Admin creates/assigns:

```text
TASK-023
```

Volunteer sees:

```text
নতুন কাজ
```

Volunteer changes:

```text
Assigned
→
En Route
→
In Progress
→
Completed
```

Admin sees those changes.

Citizen can see relevant high-level progress where appropriate.

---

# 11.3 SHARED INVENTORY FLOW

Admin:

```text
Inventory:
Water = 1500
```

Allocates:

```text
500
```

Inventory becomes:

```text
Water = 1000
```

Do not create separate inventory numbers for different pages.

---

# 12. GLOBAL SEARCH

If time permits, implement a simple global search.

Topbar search:

**রিপোর্ট, কাজ বা এলাকা খুঁজুন...**

Results:

```text
RPT-001
সুনামগঞ্জ বন্যা

TASK-023
ত্রাণ বিতরণ

সুনামগঞ্জ
উচ্চ ঝুঁকির এলাকা
```

Keep search simple.

Do not build Elasticsearch or complex search.

---

# 13. ADMIN NOTIFICATION SYSTEM

Notifications:

```text
8টি নতুন রিপোর্ট যাচাইয়ের অপেক্ষায়

সুনামগঞ্জে উচ্চ ঝুঁকির রিপোর্ট এসেছে

TASK-023 এর অবস্থা সম্পন্ন হয়েছে

পানির মজুত কমে গেছে

একজন স্বেচ্ছাসেবক মাঠপর্যায়ের সমস্যা জানিয়েছেন
```

Clicking a notification navigates to the relevant page.

---

# 14. DASHBOARD DATA VISUALIZATION

Create simple charts.

Do not install a huge charting ecosystem unless necessary.

Recommended charts:

### Disaster Reports by Type

Bar chart:

```text
বন্যা       ██████████
ঘূর্ণিঝড়   ██████
নদীভাঙন    ████
জলাবদ্ধতা  ███
```

### Report Status

Donut/pie:

```text
যাচাইকৃত
অপেক্ষমাণ
বাতিল
চলমান
```

### Resource Distribution

Bar chart:

```text
পানি
খাবার
ওষুধ
```

Charts should use the existing mock data.

---

# 15. ADMIN DASHBOARD FINAL LAYOUT

Recommended desktop layout:

```text
┌──────────┬───────────────────────────────────────────┐
│          │ Topbar                                    │
│          ├───────────────────────────────────────────┤
│ Sidebar  │ Emergency Summary                         │
│          ├──────────────────────┬────────────────────┤
│          │ Critical Alerts      │ Quick Actions      │
│          ├──────────────────────┴────────────────────┤
│          │                                           │
│          │              Disaster Map                 │
│          │                                           │
│          ├──────────────────────┬────────────────────┤
│          │ Recent Reports       │ Resource Status    │
│          ├──────────────────────┴────────────────────┤
│          │ Operations Overview                       │
└──────────┴───────────────────────────────────────────┘
```

---

# 16. ADMIN MOBILE LAYOUT

On mobile:

* Sidebar becomes drawer.
* Statistics become 2-column cards.
* Map becomes full-width.
* Tables become cards.
* Quick actions become 2-column grid.
* Critical alerts remain visible.
* Resource actions use large buttons.

---

# ==================================================

# 17. FINAL DESIGN POLISH

# ==================================================

After all modules are complete, perform one UI consistency pass.

Verify:

### Buttons

All primary buttons use the same green.

### Cards

All cards have consistent:

* border radius
* padding
* shadow
* border

### Typography

All Bangla text uses the same font hierarchy.

### Icons

Use one icon family consistently.

Do not mix random icon styles.

### Status

Every status uses the same badge component.

### Maps

Every map uses the same:

* marker style
* popup style
* legend
* controls

---

# 18. EMERGENCY UX RULES

Because this is a disaster-response platform:

Important information must be visually obvious.

Priority order:

```text
Emergency
↓
Location
↓
Severity
↓
People affected
↓
Required resources
↓
Operational status
```

Do not hide critical information behind multiple clicks.

---

# 19. DEMO MODE

Create a small optional demo indicator:

**ডেমো মোড**

Place it subtly in the topbar.

Tooltip:

**এই সংস্করণে প্রদর্শনের জন্য ডেমো ডেটা ব্যবহার করা হচ্ছে।**

This makes it clear that the frontend is using mock data.

---

# 20. RESET DEMO DATA

Add an admin-only option:

**ডেমো ডেটা রিসেট করুন**

Confirmation:

**ডেমো ডেটা পূর্বাবস্থায় ফিরিয়ে আনবেন?**

This is useful during project presentations.

After reset:

```text
Demo data successfully reset.
```

---

# 21. FRONTEND SECURITY PLACEHOLDERS

Do not claim frontend-only security is real authentication.

Use mock role protection:

```text
if user.role !== "admin"
    redirect
```

Later backend authentication will replace this.

Do not store real passwords.

Do not create real sensitive user information.

---

# 22. ERROR HANDLING

Implement:

### 404

**পৃষ্ঠা খুঁজে পাওয়া যায়নি**

Button:

**ড্যাশবোর্ডে ফিরে যান**

### Unauthorized

**এই পৃষ্ঠায় প্রবেশের অনুমতি নেই।**

Button:

**ফিরে যান**

### Network-style mock error

**তথ্য লোড করা সম্ভব হয়নি।**

Button:

**আবার চেষ্টা করুন**

---

# 23. FINAL USER JOURNEY

The complete demo should now work as follows.

## CITIZEN

```text
Landing Page
 ↓
Login
 ↓
Citizen Dashboard
 ↓
দুর্যোগ রিপোর্ট করুন
 ↓
Fill form
 ↓
Select location
 ↓
Upload image
 ↓
Submit
 ↓
RPT-001
 ↓
অপেক্ষমাণ
```

---

## ADMIN

```text
Admin Login
 ↓
Admin Dashboard
 ↓
নতুন রিপোর্ট
 ↓
Report Review
 ↓
Verify
 ↓
Severity Score
 ↓
Priority = 1
 ↓
Resource Allocation
 ↓
Assign resources
 ↓
Create/assign task
```

---

## VOLUNTEER

```text
Volunteer Login
 ↓
Volunteer Dashboard
 ↓
New Task
 ↓
Task Detail
 ↓
En Route
 ↓
In Progress
 ↓
Field Issue
 ↓
Issue submitted
 ↓
Completed
```

---

## ADMIN AGAIN

```text
Admin Dashboard
 ↓
Operation Monitoring
 ↓
Task Progress
 ↓
Field Issue
 ↓
Resource Status
 ↓
Operation Completed
```

This creates a complete end-to-end demonstration.

---

# 24. FINAL MOCK DATA RELATIONSHIPS

Maintain relationships:

```text
User
 │
 └── Report
       │
       ├── Severity
       │
       ├── Resource Request
       │
       └── Task
              │
              └── Volunteer
                     │
                     └── Field Issue
```

This relationship should be reflected in the frontend state.

---

# 25. RECOMMENDED FILE STRUCTURE AFTER PART 3

Final structure:

```text
src/
│
├── components/
│   ├── common/
│   ├── layout/
│   ├── navigation/
│   ├── cards/
│   ├── forms/
│   ├── maps/
│   ├── tables/
│   ├── charts/
│   └── modals/
│
├── pages/
│   ├── public/
│   │   └── Landing.jsx
│   │
│   ├── auth/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── ForgotPassword.jsx
│   │
│   ├── citizen/
│   │   ├── Dashboard.jsx
│   │   ├── ReportCreate.jsx
│   │   ├── Reports.jsx
│   │   ├── ReportDetail.jsx
│   │   ├── Map.jsx
│   │   └── Profile.jsx
│   │
│   ├── volunteer/
│   │   ├── Dashboard.jsx
│   │   ├── Map.jsx
│   │   ├── Tasks.jsx
│   │   ├── TaskDetail.jsx
│   │   ├── Issues.jsx
│   │   └── Profile.jsx
│   │
│   └── admin/
│       ├── Dashboard.jsx
│       ├── Reports.jsx
│       ├── ReportReview.jsx
│       ├── Map.jsx
│       ├── Severity.jsx
│       ├── Resources.jsx
│       ├── Inventory.jsx
│       ├── Operations.jsx
│       └── Profile.jsx
│
├── context/
│   ├── AuthContext.jsx
│   └── AppContext.jsx
│
├── data/
│   ├── mockUsers.js
│   ├── mockReports.js
│   ├── mockTasks.js
│   ├── mockIssues.js
│   ├── mockResources.js
│   ├── mockInventory.js
│   └── mockNotifications.js
│
├── utils/
│   ├── severityCalculator.js
│   ├── statusHelpers.js
│   └── formatters.js
│
├── routes/
│   └── AppRoutes.jsx
│
├── App.jsx
├── main.jsx
└── index.css
```

---

# 26. 1-MONTH DEVELOPMENT PLAN

There are 3 members.

Do NOT make everyone work on everything.

Use parallel development.

---

## WEEK 1 — FOUNDATION

### Member 1

Citizen foundation:

* Landing page
* Login/register
* Citizen dashboard
* Report form

### Member 2

Shared infrastructure + Volunteer:

* Sidebar
* Topbar
* Shared components
* Volunteer dashboard
* Volunteer task UI

### Member 3

Admin foundation:

* Admin dashboard
* Admin layout
* Report list
* Admin map foundation

### End of Week 1

Must have:

* routing
* authentication demo
* shared layout
* all three dashboards
* basic design system
* basic mock data

---

# WEEK 2 — CORE FEATURES

### Member 1

Complete:

* report form
* photo upload
* location picker
* citizen reports
* report detail
* report timeline

### Member 2

Complete:

* volunteer task list
* task detail
* task status
* field issue tagging
* volunteer map

### Member 3

Complete:

* report verification
* report review
* severity calculator
* severity list

---

# WEEK 3 — INTEGRATION

### Member 1

Work on:

* citizen map
* citizen notifications
* citizen profile
* responsive improvements

### Member 2

Work on:

* task/map integration
* field issue integration
* volunteer notifications
* mobile field UX

### Member 3

Work on:

* resource allocation
* inventory
* operations monitoring
* admin map
* admin notifications

---

# WEEK 4 — FINALIZATION

ALL THREE MEMBERS work together.

### Days 1–2

Connect all mock state.

Test:

```text
Citizen
→
Admin
→
Volunteer
→
Admin
```

---

### Days 3–4

UI polish:

* spacing
* typography
* colors
* icons
* responsive behavior
* animations
* loading states
* error states

---

### Day 5

Bug fixing.

Test every route.

---

### Day 6

Project presentation preparation.

Prepare:

* demo accounts
* demo data
* workflow
* screenshots
* presentation flow

---

### Day 7

Final testing.

DO NOT add new features.

Only:

* fix bugs
* improve UI
* fix responsiveness
* clean code

---

# 27. TEAM WORKING RULES

Because only three people are developing the project:

## Rule 1

Never directly modify another member's feature without coordination.

## Rule 2

Shared components must be discussed before changing them.

## Rule 3

Use Git branches.

Suggested:

```text
main
develop

feature/citizen
feature/volunteer
feature/admin
```

---

# 28. GIT WORKFLOW

Recommended:

```text
main
   ↑
develop
   ↑
feature/citizen
feature/volunteer
feature/admin
```

Commit frequently.

Good commit:

```text
feat: add citizen disaster report form
```

Another:

```text
feat: implement volunteer task status flow
```

Another:

```text
feat: add admin report verification
```

Avoid:

```text
update
final
final2
latest
newfinal
really-final
```

---

# 29. WHAT NOT TO BUILD

Because the deadline is one month, DO NOT add:

* AI chatbot
* real-time WebSocket system
* complex machine learning
* drone integration
* SMS gateway
* payment system
* complicated permission engine
* advanced analytics
* offline-first architecture
* native mobile application
* complex routing/navigation
* unnecessary animations

The presentation identifies mobile applications, offline reporting, AI severity prediction, drone monitoring, SMS notifications, weather API integration, and analytics as future enhancements. Keep those outside the current one-month frontend scope.

---

# 30. FINAL PRESENTATION REQUIREMENT

The finished frontend must demonstrate one complete scenario.

Use:

### Scenario

**সুনামগঞ্জ বন্যা**

Citizen:

```text
Reports flooding
320 affected people
Uploads photo
Shares location
```

Admin:

```text
Receives report
Verifies report
Calculates severity
Score = 82
Priority = Critical
Allocates water/food/medicine
Assigns volunteer task
```

Volunteer:

```text
Receives task
Goes En Route
Starts task
Reports road blocked
Completes task
```

Admin:

```text
Sees operation progress
Sees field issue
Sees resource reduction
Sees completed task
```

This single scenario should demonstrate the entire platform.

---

# 31. FINAL QUALITY STANDARD

The final application should feel like:

**একটি বাস্তব দুর্যোগ ব্যবস্থাপনা প্ল্যাটফর্ম**

not:

**একটি সাধারণ CRUD dashboard।**

The interface must communicate:

* urgency
* trust
* coordination
* simplicity
* transparency
* operational awareness

The most important pages should be visually strong:

1. Landing page
2. Citizen report form
3. Disaster map
4. Volunteer task detail
5. Admin dashboard
6. Report verification
7. Severity analysis
8. Resource allocation

---

# 32. FINAL PROJECT CHECKLIST

## Public

* [ ] Landing page
* [ ] Navigation
* [ ] Feature section
* [ ] Role section
* [ ] Map preview
* [ ] Footer

## Authentication

* [ ] Login
* [ ] Register
* [ ] Demo accounts
* [ ] Role-based redirect
* [ ] Logout

## Citizen

* [ ] Dashboard
* [ ] Report form
* [ ] Photo upload
* [ ] Location
* [ ] Map
* [ ] Reports
* [ ] Report detail
* [ ] Status timeline
* [ ] Profile
* [ ] Notifications

## Volunteer

* [ ] Dashboard
* [ ] Task list
* [ ] Task detail
* [ ] Task map
* [ ] Status update
* [ ] Field issue tags
* [ ] Issue submission
* [ ] Issue list
* [ ] Map
* [ ] Profile
* [ ] Notifications

## Admin

* [ ] Dashboard
* [ ] Report list
* [ ] Report review
* [ ] Verify
* [ ] Reject
* [ ] Severity scoring
* [ ] Priority ranking
* [ ] Resource allocation
* [ ] Inventory
* [ ] Operations
* [ ] Disaster map
* [ ] Field issue monitoring
* [ ] Profile
* [ ] Notifications

## Integration

* [ ] Shared reports
* [ ] Shared tasks
* [ ] Shared inventory
* [ ] Shared issues
* [ ] Shared notifications
* [ ] Citizen → Admin workflow
* [ ] Admin → Volunteer workflow
* [ ] Volunteer → Admin workflow

## UI

* [ ] Bangla-first
* [ ] Light green theme
* [ ] Responsive
* [ ] Accessible
* [ ] Consistent icons
* [ ] Consistent status badges
* [ ] Loading states
* [ ] Error states
* [ ] Empty states
* [ ] Toast notifications
* [ ] Confirmation modals

## Final

* [ ] No unnecessary features
* [ ] No broken routes
* [ ] No console errors
* [ ] No duplicated mock data
* [ ] Demo workflow works
* [ ] Mobile tested
* [ ] Desktop tested
* [ ] Presentation-ready

---

# 33. FINAL INSTRUCTION TO THE CODING AI

Now implement Part 3 on top of the existing Part 1 and Part 2 code.

Do not rewrite working Citizen or Volunteer functionality.

Do not introduce unnecessary libraries.

Do not create backend code.

Use mock data and shared frontend state.

Make the three roles behave as one connected application.

Prioritize:

**Functionality → Integration → Responsive UI → Visual polish**

over unnecessary complexity.

The finished result should be a realistic, professional, Bangla-first **Real-Time Disaster Response Coordination Platform** suitable for a university CSE course-project demonstration.

The technology stack should remain aligned with the project's planned frontend technologies: React.js and Leaflet.js, with backend/database integration intentionally left for the later development stage.
