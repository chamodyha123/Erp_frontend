# NexaERP System — Frontend UI

A modern Enterprise Resource Planning (ERP) frontend built with **React 18**, **TypeScript**, **Vite**, and **Tailwind CSS**, integrated with a **Spring Boot REST API**.

## 📖 Table of Contents
- Key Features
- Tech Stack
- Folder Structure
- Prerequisites
- Installation
- Environment Configuration


## 🚀 Key Features
- JWT Authentication
- Role-Based Access Control (RBAC)
- Dashboard with KPIs & Activity Feed
- Finance, HR, Inventory, Sales, Purchasing, Manufacturing, CRM, Projects & Assets Modules
- Responsive UI
- Reusable Components
- REST API Integration

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 18 |
| Language | TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| Routing | React Router |
| HTTP Client | Axios |
| Forms | React Hook Form |
| Charts | Recharts |
| Icons | Lucide React |
| UI Components | Radix UI |
| Package Manager | pnpm |

## 📂 Project Structure

```text
erp-system-ui/
├── public/                           # Static assets (favicon, images, etc.)
├── src/
│   ├── main.tsx                      # Application entry point
│   ├── app/
│   │   ├── App.tsx                   # Root component and router setup
│   │   ├── routes.ts                 # Application route definitions
│   │   ├── components/
│   │   │   ├── Layout.tsx            # Main application layout
│   │   │   ├── Sidebar.tsx           # Navigation sidebar
│   │   │   └── ui/                   # Reusable UI components
│   │   │       ├── Button.tsx
│   │   │       ├── Modal.tsx
│   │   │       └── ...
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx         # Dashboard page
│   │   │   ├── Login.tsx             # Login page
│   │   │   ├── finance/              # Finance Management Module
│   │   │   ├── hr/                   # Human Resource & Payroll Module
│   │   │   ├── inventory/            # Inventory & Warehouse Module
│   │   │   ├── sales/                # Sales & CRM Module
│   │   │   ├── purchasing/           # Purchasing Module
│   │   │   ├── manufacturing/        # Production Module
│   │   │   ├── projects/             # Project Management Module
│   │   │   ├── assets/               # Asset Management Module
│   │   │   └── system/               # User Management & System Settings
│   │   └── types/
│   │       └── erp.ts                # Global TypeScript type definitions
│   ├── context/
│   │   └── AuthContext.tsx           # Authentication context provider
│   ├── services/
│   │   ├── api.ts                    # Axios configuration & interceptors
│   │   ├── authService.ts            # Authentication API
│   │   ├── dashboardService.ts       # Dashboard API
│   │   ├── salesOrderService.ts      # Sales Order API
│   │   └── ...                       # Additional module services
│   ├── data/
│   │   └── mockData.ts               # Mock data for development/testing
│   └── styles/
│       ├── index.css                 # Global styles
│       ├── tailwind.css              # Tailwind CSS imports
│       └── theme.css                 # Theme customization
├── .env.local                        # Local environment variables (not committed)
├── .gitignore
├── package.json
├── tsconfig.json
└── vite.config.ts
```


## Prerequisites
Ensure you have installed:
- **Node.js** v18 or newer
- **pnpm** v8 or newer — `npm install -g pnpm`
- Backend Spring Boot running at `http://localhost:8081`

## Installation & Running
```bash
# 1. Clone the repository
git clone <repository-url>
cd erp-system-ui

# 2. Install dependencies
pnpm install

# 3. Create environment file
# Create .env.local and fill with your local configuration (see Environment Configuration section)

# 4. Run development server
pnpm dev
```
## ⚙️ Environment Configuration

Create a `.env.local` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:8081/api/v1
```

> **Note:** All Vite environment variables must start with `VITE_`.


## 📦 Application Modules

| Module | Path | Description |
|--------|------|-------------|
| Dashboard | `/` | KPIs, activity feed, quick navigation |
| Finance | `/finance` | Accounts, Journal, AP/AR, Budget |
| Human Resources | `/hr` | Employees, Leave, Payroll, Recruitment |
| Inventory | `/inventory` | Products, Warehouses, Stock Management |
| Sales | `/sales` | Customers, Orders, Invoices |
| Purchasing | `/purchasing` | Vendors, Purchase Orders, Invoices |
| Manufacturing | `/manufacturing` | BOM, Production, Work Orders |
| Projects | `/projects` | Projects, Tasks, Time Tracking |
| CRM | `/crm` | Leads, Opportunities, Campaigns |
| Assets | `/assets` | Assets, Maintenance, Depreciation |
| System | `/system` | Users, Roles, Settings, Audit Logs |
