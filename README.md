# NexaERP System — Frontend UI

A modern Enterprise Resource Planning (ERP) frontend built with **React 18**, **TypeScript**, **Vite**, and **Tailwind CSS**, integrated with a **Spring Boot REST API**.

##  Table of Contents
- Tech Stack
- Project Structure
- Prerequisites
- Installation
- Environment Configuration...

##  Business Process Analysis & Module Overview

A concise breakdown of NexaERP's core architecture, including domain research, system challenges, 11-module integration workflow, and Azure cloud deployment strategy.

[![View PDF Report](https://img.shields.io/badge/View_NexaERP_Report-PDF-red?style=for-the-badge&logo=adobe-acrobat-reader&logoColor=white)](https://github.com/dilshan24142/Erp_backend/blob/dev/src/main/resources/NexaERP_Report_Group_09.pdf)

## 🌐 Live Demo

Experience the application online:

🔗 **Frontend:** https://nexaerp-frontend.vercel.app/


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
---

## Contributing

Contributions are welcome. Please create a pull request before making major changes.

## Authors

Developed by the NexaERP Development Team.
## Support

For issues and feature requests, please open an issue in this repository.

## Backend Connection

Backend Repository:
[ERP Backend](https://github.com/dilshan24142/Erp_Backend)
