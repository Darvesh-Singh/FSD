# Veritas University Smart Attendance & Compliance OS

> Production-ready, modular, and type-safe University Smart Attendance System featuring automated multi-modal check-in telemetry (RFID, Dynamic Rotating QR, GPS Geofencing), statutory academic risk reporting (<75% threshold), interactive dashboards, and dedicated multi-persona workspaces.

---

## 🏛️ System Architecture & Tech Stack

```
FSD/
├── package.json                         # Unified workspace scripts
├── README.md                            # Complete architecture & deployment guide
├── backend/                             # RESTful Node.js + Express + TypeScript API
│   ├── package.json
│   ├── tsconfig.json
│   ├── prisma/
│   │   ├── schema.prisma                # Relational Prisma Academic Hierarchy Schema
│   │   └── seed.ts                      # Database seeding script
│   └── src/
│       ├── index.ts                     # Express server & periodic dynamic QR rotation engine
│       ├── testApi.ts                   # E2E automated test suite
│       ├── models/
│       │   └── types.ts                 # Type-safe models (Attendance, Telemetry, KPIs, Reports)
│       ├── db/
│       │   ├── schema.sql               # Native SQL DDL Schema (PostgreSQL/SQLite)
│       │   ├── store.ts                 # High-performance relational in-memory data store
│       │   └── seed.ts                  # Seeding entrypoint
│       ├── services/
│       │   ├── attendanceService.ts     # Haversine Geofence math, RFID matching, TOTP QR rotation
│       │   └── mockGenerator.ts         # University academic data generator (4 depts, 30+ students, 700+ logs)
│       ├── controllers/
│       │   ├── dashboardController.ts   # Live telemetry KPIs & active lecture states
│       │   ├── attendanceController.ts  # Multi-modal check-in handlers & appeal submission
│       │   ├── reportsController.ts     # Course summaries, at-risk flagging & warning letter issuance
│       │   └── academicController.ts    # Department, course, user, and lecture registries
│       └── routes/
│           ├── dashboardRoutes.ts
│           ├── attendanceRoutes.ts
│           ├── reportsRoutes.ts
│           └── academicRoutes.ts
└── frontend/                            # React 18 + TypeScript + Tailwind CSS SPA
    ├── package.json
    ├── vite.config.ts                   # Vite proxy configuration to backend
    ├── tsconfig.json
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── index.html
    └── src/
        ├── main.tsx                     # React root DOM mounting
        ├── App.tsx                      # Main application layout, persona routing & toasts
        ├── index.css                    # Tailwind layers, scrollbars, and radar animations
        ├── types/
        │   └── index.ts                 # Frontend TypeScript models matching API contracts
        ├── store/
        │   └── useAttendanceStore.ts    # Zustand reactive global state store
        ├── services/
        │   └── api.ts                   # Typed API client connecting to backend
        └── components/
            ├── common/
            │   ├── Navbar.tsx           # University header, live academic clock, persona switcher
            │   ├── Sidebar.tsx          # Scannable navigation with active badges
            │   ├── StatCard.tsx         # KPI cards with gradient borders & trend arrows
            │   ├── StatusBadge.tsx      # Present, Late, Absent, Excused & Method badges
            │   └── Modal.tsx            # Accessible modal dialog
            ├── dashboard/
            │   ├── DashboardOverview.tsx # Real-time academic KPIs & live telemetry stream
            │   ├── LiveLectureFeed.tsx  # Ticker of active sessions with occupancy gauges
            │   ├── AttendanceTrendChart.tsx # Weekly cross-department trends (Recharts Area/Line)
            │   └── YearDistributionChart.tsx # Class cohort distribution (Recharts Donut)
            ├── capture/
            │   ├── SmartCaptureHub.tsx  # Multi-modal ingestion hub
            │   ├── RFIDScannerKiosk.tsx # Kiosk NFC/RFID smartcard reader simulator
            │   ├── DynamicQRCodeGenerator.tsx # Professor auditorium projector with 30s rotating TOTP
            │   ├── GeofenceCheckIn.tsx  # GPS coordinate perimeter telemetry with radar animation
            │   └── ManualOverrideSheet.tsx # Instructor roll call exception override desk
            ├── reports/
            │   ├── AcademicReportsModule.tsx # Multi-column filtered data grid (Dept, Course, Term)
            │   ├── CourseSummaryView.tsx # Spotting lectures with critically low attendance (<65%)
            │   ├── AtRiskReportView.tsx # Automated <75% student flagging & stage classification
            │   └── WarningLetterModal.tsx # Formal institutional warning letter with print/dispatch
            ├── student/
            │   ├── StudentPortal.tsx    # Student drill-down with cumulative attendance gauge
            │   ├── AttendanceTimeline.tsx # Chronological session logs with appeal triggers
            │   └── AbsenceAppealModal.tsx # Medical/academic conflict excuse filing modal
            └── professor/
                └── ProfessorConsole.tsx # Instructor active session command center
```

---

## 👥 Three Dedicated User Personas

1. **University Administrator (Dr. Eleanor Vance - Dean & Registrar)**
   - Executive bird's-eye view of campus attendance across all academic complexes.
   - Statutory compliance oversight: automated discovery of students breaching the mandatory 75% attendance threshold.
   - Multi-column filtering by Department, Course, Section, and Term.
   - 1-click issuance and dispatch of formal **Academic Warning Letters** (Stage 1 Caution, Stage 2 Probation, Stage 3 Debarment).

2. **Professor / Instructor (Prof. Marcus Chen - Computer Science)**
   - Lecture Session Command Center with active hall controls.
   - Auditorium Projector View displaying dynamic rotating QR codes (TOTP rotating every 30 seconds to prevent screenshot proxies).
   - In-hall door kiosk tap simulation (RFID badge reader).
   - Live roster roll call override (1-click mark Present, Late, Absent, or Excused).

3. **Student (Devon Miller - At-Risk Profile / Aria Takahashi - Compliant Profile)**
   - Self-service drill-down showing enrolled subject attendance cards.
   - Visual progress gauges relative to the 75% examination eligibility line.
   - Full chronological attendance log history across all semesters.
   - Absence appeal workflow: file medical excuses or authorized university conflict requests directly to faculty.

---

## ⚡ Core Technical Features

### 1. Smart Multi-Modal Attendance Capture
- **RFID Badge Tap**: Simulates physical 13.56 MHz ISO 14443A door readers. Scans student ID badge, identifies matching ongoing lecture, computes grace period status.
- **Dynamic Rotating QR Codes**: Generates timestamped, rotating session tokens (`UNIV-XXXXXX`) that update every 30 seconds with animated countdown rings.
- **Geofenced GPS Verification**: Uses the Haversine formula to compute great-circle distance between student device GPS coordinates and the lecture hall center (e.g. 65m perimeter around Turing Hall A-101). Rejects scans outside perimeter with exact distance metrics.
- **Automated Grace Period Grading**:
  - `Time <= 10 min`: Marked **PRESENT** (within grace window).
  - `10 min < Time <= 25 min`: Marked **LATE**.
  - `Time > 25 min` or no scan: Marked **ABSENT**.

### 2. Academic Reports Module
- **Multi-Column Filtering**: Slice telemetry by Department (CSE, EE, ME, MGMT), Course, Academic Term, and dynamic Risk Threshold slider (60% - 85%).
- **Low-Attendance Spotter**: Detects lectures with attendance dipping below 65%.
- **At-Risk Engine**: Automatically computes weighted student attendance:
  $$\text{Effective Attendance} = \text{Present} + 0.75 \times \text{Late} + \text{Excused}$$
  Flags students falling below 75% threshold with Stage 1 Caution or Stage 2 Probation.
- **Academic Warning Letter Generator**: Renders formal university letterhead advisory with student details, course data, regulatory warnings, and print/PDF output.

### 3. Interactive Executive Dashboard
- **Daily Campus KPIs**: Real-time Campus Attendance %, Active Lecture Count, Checked-in Student Ratios, Flagged At-Risk Count.
- **Live Lecture Telemetry**: Active room cards with animated in-session indicators and hall occupancy bars.
- **Recharts Visualizations**:
  - Weekly Cross-Departmental Attendance Trends (Area/Line chart).
  - Class Year Cohort Distribution (Donut chart).
- **Live Activity Ticker**: Real-time stream of incoming physical and digital check-ins with exact timestamps.

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+ (tested on Node.js v24)
- npm or pnpm

### Quick Start (Run Both Backend & Frontend)

#### Step 1: Start Backend API (Port 5000)
```bash
cd backend
npm run dev
```
*API will start on `http://localhost:5000` with pre-seeded academic dataset.*

#### Step 2: Start Frontend Application (Port 3000)
```bash
cd frontend
npm run dev
```
*Open `http://localhost:3000` in your browser.*

#### Running Verification Suite
```bash
cd backend
npx tsx src/testApi.ts
```

#### Production Build
```bash
# Build backend
cd backend && npm run build

# Build frontend
cd frontend && npm run build
```

