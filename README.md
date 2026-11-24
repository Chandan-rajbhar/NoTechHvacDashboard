# Admin Console · No-Tech HVAC | Local Industries

Desktop-first, tablet-responsive administrative back-office console for **No-Tech HVAC / Local Industries** and the **Local Mechanical** regulatory authority.

Built with **React 18 + Vite + Tailwind CSS 3 + Lucide React + React Router DOM v6 + Recharts**.

---

## 🏛️ Brand & Regulatory Architecture

- **Local Industries Logo**: Green square "LI" with LOCAL INDUSTRIES wordmark (`public/logo.jpg`), pinned at top-left of the sidebar with the subtitle pill: `ADMIN CONSOLE · NO-TECH HVAC`.
- **No-Tech Systems EST. 2022**: Official wordmark in the footer and system settings.
- **Local Mechanical Verified Authority**: Official hexagonal regulatory seal and approval badges displayed on certified contractors, quality control inspection logs, and documentation reviews per the PDF specification.

---

## 🎨 Color Tokens & Aesthetic Strategy

Directly inherited from the mobile app's palette with strict ratio management:

| Token | Hex | Role | Ratio |
|---|---|---|---|
| `notech.dark` / `surface` | `#121417` → `#1E2227` | Fixed left sidebar, topbar accents, primary buttons | ~25% |
| Background / `.clean-card` | `#E4E7EB` / `#FFFFFF` | Page canvas, rounded-2xl cards with 1px border & soft shadow | ~60% |
| `notech.green` | `#A4A77E` | Military green accent, active states, progress bars, approved pills | ~10% |
| `notech.tan` | `#C2B59B` | Army tan active dot, secondary badges, inspection highlights | ~5% |
| `notech.steel` | `#6D6E71` | Muted labels, secondary micro-copy, timestamps | Auxiliary |
| Restrained Red | `#B4443C` | Used only for rejected applications, repeat QC failures, and suspensions | Alert |

- **Active Sidebar Item**: Green-tinted glass (`rgba(164, 167, 126, 0.14)`) with soft `glow-green` shadow and an Army Tan dot.
- **Primary Buttons**: `#1E2227` dark pill with white text (`.clean-pill-active`), or Military Green for positive actions.
- **Typography**: **Inter** for clean UI reading and **JetBrains Mono** for batch numbers, RFID chips, status pills, and micro-labels.
- **Dark Mode**: Fully supported via Tailwind's `class` strategy with instant toggle in the top bar.

---

## 📂 Navigation & Page Matrix

### **Store & Production**
1. **Dashboard Overview (`/`)**: 6 KPI cards, Recharts visualizations (Reservations by Region, Northern California Hub 88% capacity allocation gauge, WIP Production Funnel, 8-Time-Slot Dispatch Load), Recent Reservations table with slide-over preview, and quick actions.
2. **Reservations & Batches (`/reservations`)**: Production batch tracking, $200 deposit fee reconciliation, customer delivery addresses, 4-compartment status, and slide-in panel with batch reassignment modal and resend email trigger.
3. **Units & Compartments (`/units`)**: Hardware registry for the 4 modular slide-out compartments:
   - *Compartment 1*: Blower & Air Handler (`RFID-NT-9021-BLW`)
   - *Compartment 2*: Evaporator / Heat Exchanger Coil (`RFID-NT-8812-EVAP`)
   - *Compartment 3*: Combustion & Heating (`RFID-NT-7431-HTG`)
   - *Compartment 4*: Inverter Compressor & Power Electronics (`RFID-NT-6110-INV`)
   - Includes real-time RFID edit modal and diagnostic swap logs.
4. **Pricing & Options (`/pricing`)**: 4 comprehensive tabs:
   - *Tonnage & Coverage*: 2.0 to 5.0 ton ratings with home sq ft coverage and monthly financing options.
   - *Configurations*: Upflow, Downflow, and Horizontal duct orientations with structural clearance specifications.
   - *Color Spectrum*: 10 military colors with Dark Gray `#373A3C` default, custom color creator, and **interactive real-time HVAC unit preview** with simulated daylight/ambient lighting!
   - *Compartment Pricing & Financing*: 0% APR 24-month and 48-month payment plans.

### **Contractor Network (Local Mechanical)**
5. **Contractor Approvals (`/contractor-approvals`)**: Regulatory queue with verification checks for the 5 mandatory documents:
   - EPA Universal 608 Certification
   - State C-20 HVAC Contractor License
   - Verified Business Address
   - Depot Shipping Address
   - Certificate of Insurance ($2M aggregate liability listing Local Mechanical)
   - Actions: Approve (issues official `LM-CERT-2026-xxxx` certificate), Reject with reason modal, and Document Preview lightbox.
6. **Contractors Directory (`/contractors`)**: Full directory of vetted technicians with EPA license, state license, star ratings, radius, specialties, and the **Customer Unselect Feedback Reports** (showing reasons customers removed a contractor per PDF section 4).
7. **Training & Questionnaire (`/training-questionnaire`)**:
   - *Assessment Submissions*: Scores, pass marks (>= 80%), and per-question correct/incorrect inspection.
   - *10-Question Standard Bank*: Read-only view preserving exact official questions from PDF Pages 3-5 (2'x6' structural framing, natural gas/propane/voltage clearances, copper line sizing table, gas leak checks, male/female conductor inspection, 4-step RFID app workflow, delta T readings, and photo uploads).
8. **Installations & QC (`/installations-qc`)**: Validation inspection table with supply/return temperatures, airflow CFM, gas ppm leak checks, old vs. new RFID scan logs, completion photos, and flagged issues queue with repeat failure tracking.

### **Customers & Scheduling**
9. **Customers (`/customers`)**: Directory of customers, linked reservations, assigned contractors, notes append tool, and "Manage My Contractor" unselect records.
10. **Scheduling (`/scheduling`)**: Interactive 8-time-slot dispatch grid (`7-10 AM`, `10-1 PM`, `1-4 PM`, `4-7 PM`, `7-10 PM`, `10-1 AM`, `1-4 AM`, `4-7 AM`), regional capacity meters (NorCal Hub 88%, Bay Area 92%, etc.), and the prominent in-app rescheduling rule.
11. **Inquiries & Chatbot (`/inquiries-chatbot`)**:
    - Escalations inbox with inline reply sender.
    - Chatbot FAQ & guidance flow editor.
    - **Interactive Live Chatbot Simulator Preview**: Test queries in real-time with instant responses matching `chatbotData.js`.

### **Administration & System**
12. **Users & Roles (`/users-roles`)**: Super Admin, Local Mechanical Reviewer, Operations, and Support role profiles with interactive Quick Role Switcher and permissions matrix.
13. **Payments & Deposits (`/payments`)**: $200 reservation fees transactions log with filter by Paid/Pending/Refunded, invoice receipts, and refund actions.
14. **Settings (`/settings`)**: System branding, $200 fee customization, NorCal Hub quotas, Local Mechanical compliance toggles, and factory reset tool.

---

## 🛠️ Project Structure

```
c:\Users\user\Desktop\HvacDashboard\
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── public/
│   └── logo.jpg              # Local Industries Logo
└── src/
    ├── main.jsx
    ├── App.jsx               # React Router v6 setup with Suspense code-splitting
    ├── index.css             # Tailwind base, utilities, clean-card & dark styles
    ├── assets/
    │   ├── logo.jpg
    │   └── logos.jsx         # LocalIndustriesLogo, LocalMechanicalBadge, Seals
    ├── context/
    │   └── AppContext.jsx    # Theme state, Active user role, Notifications, Toasts
    ├── data/
    │   ├── mockData.js       # Complete models matching mobile app & PDF
    │   └── mockService.js    # Reactive service layer with LocalStorage persistence
    ├── layouts/
    │   └── AdminLayout.jsx   # Shell with fixed Sidebar, TopBar, and Footer
    ├── components/
    │   ├── layout/
    │   │   ├── Sidebar.jsx   # Collapsible grouped navigation with glow & tan dot
    │   │   └── TopBar.jsx    # Breadcrumb, search, notification bell, profile switcher
    │   └── common/
    │       ├── PageHeader.jsx
    │       ├── KpiCard.jsx
    │       ├── DataTable.jsx # Sortable headers, search, filters, pagination
    │       ├── StatusPill.jsx
    │       ├── SlideOverPanel.jsx # Reusable ~50% right drawer with sticky footer
    │       ├── DocumentVerifyRow.jsx
    │       ├── Timeline.jsx
    │       ├── SwatchPicker.jsx
    │       └── Toast.jsx
    └── pages/
        ├── Dashboard/
        ├── Reservations/
        ├── Units/
        ├── Pricing/
        ├── Contractors/
        ├── Training/
        ├── Installations/
        ├── Customers/
        ├── Scheduling/
        ├── Chatbot/
        ├── Administration/
        └── System/
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 3. Production Build
```bash
npm run build
```
Creates an optimized, tree-shaken production bundle in `/dist`.

---

## 📝 How to Edit or Reset Mock Data

- **Service Layer**: Located at `src/data/mockService.js`. Any update made in the dashboard (approving contractors, editing RFID tags, adding customer notes, rescheduling jobs) is saved reactively into `localStorage`.
- **Factory Reset**: Click **"Reset Demo Data"** on the **Console Settings** page (`/settings`) or call `MockService.resetAll()` from the browser console to restore factory defaults.
