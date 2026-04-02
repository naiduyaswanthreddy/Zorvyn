# Yaswanth Finance Dashboard

A modern React finance dashboard with animated charts, role-based access, and polished transaction workflows.

## Live Demo

- https://zorvynassignment.netlify.app/

## How This Meets the Assignment Requirements

- Dashboard Overview -> Implemented with summary cards + balance trend + spending breakdown
- Transactions Section -> Full table with search, filter, sort, pagination
- Basic Role Based UI -> Viewer/Admin toggle (affects New/Edit/Delete buttons)
- Insights Section -> Dynamic cards in Analytics page
- State Management -> FinanceContext with localStorage persistence
- Optional Enhancements -> Dark mode, animations, export CSV, full responsiveness

## Highlights

- Dashboard overview with balance, income, expense summaries
- Balance Trend chart with interactive tooltip
- Spending Breakdown integrated on dashboard
- Full Transactions page with:
  - Styled pill search bars
  - Custom calendar date picker (day + month + year view, clear option)
  - Mobile-friendly compact calendar popup
  - Type filtering, sorting, CSV export
  - Pagination fixed at **10 items per page**
  - Total filtered transaction count beside page title
- Analytics page with working period filters:
  - **All Time**
  - **3 Months**
  - **6 Months**
  - **1 Year**
- Insights section available in Analytics page
- Settings page with role/theme preferences and reset
- Light theme default for new users (dark/light switch available)

## Tech Stack

- React 18
- Vite 5
- Tailwind CSS 3
- Framer Motion
- Recharts
- React Router DOM
- Lucide React

## Setup

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

## Routes

- `/` Dashboard
- `/transactions` Transactions management
- `/analytics` Analytics & trends
- `/settings` Profile, role, theme, reset

## Transactions & Pagination

- Transactions are filterable by text, type, date range, and sort fields.
- Pagination is always **10 per page**.
- Current page auto-clamps when filters reduce result counts.

## Analytics Period Behavior

All period tabs are transaction-date driven (not static chart mocks):

- `All Time`: all available records
- `3 Months`: last 3 months from current date
- `6 Months`: last 6 months
- `1 Year`: last 12 months

Cards and charts update together for the selected period.

## Seed Data

Mock data includes transactions across multiple months/years so pagination and analytics ranges are visibly testable.

## Local Storage Behavior

App state persists in localStorage:

- `finance_transactions`
- `finance_role`
- `finance_theme`

When older saved transaction data exists, app keeps user data and backfills missing seed records to preserve demo coverage for charts/pagination.

## Scripts

- `npm run dev` start development server
- `npm run build` production build
- `npm run preview` preview production build
