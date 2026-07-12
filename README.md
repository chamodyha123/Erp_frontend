# ERP System — Frontend UI

Frontend aplikasi **Enterprise Resource Planning (ERP)** berbasis web yang dibangun menggunakan React 18, TypeScript, Vite, dan Tailwind CSS. Terhubung dengan backend Spring Boot via REST API.

---

## Demo
https://github.com/user-attachments/assets/d632cc4e-14ee-4aa2-b994-2d704eb3f12a

---

## Daftar Isi

- [Fitur Utama](#fitur-utama)
- [Tech Stack](#tech-stack)
- [Struktur Folder](#struktur-folder)
- [Prasyarat](#prasyarat)
- [Instalasi & Menjalankan](#instalasi--menjalankan)
- [Konfigurasi Environment](#konfigurasi-environment)
- [Modul Aplikasi](#modul-aplikasi)
- [Koneksi ke Backend](#koneksi-ke-backend)
- [Scripts yang Tersedia](#scripts-yang-tersedia)

---

## Fitur Utama

- **Dashboard** — Ringkasan KPI real-time, live clock, alert notifikasi, activity feed, dan navigasi modul
- **Autentikasi** — Login dengan JWT, session management via AuthContext
- **Role-Based UI** — Tampilan dan aksi menyesuaikan role pengguna (Admin, Manager, dll.)
- **Multi-Modul ERP** — Finance, HR, Inventory, Sales, Purchasing, Manufacturing, Projects, CRM, Assets, System
- **Desain Responsif** — Mendukung tampilan desktop dan tablet
- **Sidebar Navigasi** — Collapsible sidebar dengan sub-menu per modul
- **Komponen Reusable** — Modal, FormField, DataTable, StatusBadge, dan banyak lainnya

---

## Tech Stack

| Kategori        | Library / Tool                              |
|-----------------|---------------------------------------------|
| Framework       | React 18                                    |
| Bahasa          | TypeScript 5.6                              |
| Build Tool      | Vite 6                                      |
| Styling         | Tailwind CSS 4                              |
| UI Components   | Radix UI (Headless) + custom components     |
| Icons           | Lucide React                                |
| Charts          | Recharts                                    |
| Routing         | React Router 7                              |
| HTTP Client     | Axios                                       |
| Form            | React Hook Form                             |
| Animasi         | Motion (Framer Motion)                      |
| Package Manager | pnpm                                        |

---

## Struktur Folder

```
erp-system-ui/
├── public/                  # Aset statis (favicon, dll.)
├── src/
│   ├── main.tsx             # Entry point aplikasi
│   ├── app/
│   │   ├── App.tsx          # Root component & router setup
│   │   ├── routes.ts        # Definisi route
│   │   ├── components/
│   │   │   ├── Layout.tsx   # Layout utama (sidebar + header)
│   │   │   ├── Sidebar.tsx  # Sidebar navigasi
│   │   │   └── ui/          # Komponen UI reusable (Modal, Button, dll.)
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── finance/     # Modul keuangan
│   │   │   ├── hr/          # Modul HR & payroll
│   │   │   ├── inventory/   # Modul inventori & gudang
│   │   │   ├── sales/       # Modul penjualan & CRM
│   │   │   ├── purchasing/  # Modul pembelian
│   │   │   ├── manufacturing/ # Modul produksi
│   │   │   ├── projects/    # Modul manajemen proyek
│   │   │   ├── assets/      # Modul manajemen aset
│   │   │   └── system/      # Manajemen pengguna & pengaturan
│   │   └── types/
│   │       └── erp.ts       # Type definitions global
│   ├── context/
│   │   └── AuthContext.tsx  # State autentikasi global
│   ├── services/            # Semua fungsi pemanggilan API
│   │   ├── api.ts           # Axios instance & interceptor
│   │   ├── authService.ts
│   │   ├── dashboardService.ts
│   │   ├── salesOrderService.ts
│   │   └── ...              # Service per modul
│   ├── data/
│   │   └── mockData.ts      # Data mock (fallback/testing)
│   └── styles/
│       ├── index.css
│       ├── tailwind.css
│       └── theme.css
├── .env.local               # (tidak di-commit) konfigurasi lokal
├── .gitignore
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## Prasyarat

Pastikan sudah terinstal:

- **Node.js** v18 atau lebih baru
- **pnpm** v8 atau lebih baru — `npm install -g pnpm`
- Backend Spring Boot berjalan di `http://localhost:8081`

---

## Instalasi & Menjalankan

```bash
# 1. Clone repositori
git clone <url-repositori>
cd erp-system-ui

# 2. Instal dependensi
pnpm install

# 3. Buat file environment
# Buat file .env.local dan isi sesuai konfigurasi lokal (lihat bagian Konfigurasi Environment)

# 4. Jalankan development server
pnpm dev
```

Aplikasi akan berjalan di **http://localhost:5173**

---

## Konfigurasi Environment

Buat file `.env.local` di root folder `erp-system-ui/` (file ini **tidak** akan di-commit ke Git):

```
VITE_API_BASE_URL=http://localhost:8081/api/v1
```

> **Catatan:** Semua variabel environment untuk Vite HARUS diawali dengan `VITE_` agar dapat diakses di kode frontend.

---

## Modul Aplikasi

| Modul           | Path               | Keterangan                                      |
|-----------------|--------------------|-------------------------------------------------|
| Dashboard       | `/`                | KPI, activity feed, navigasi cepat              |
| Finance         | `/finance`         | Chart of Accounts, Jurnal, AP/AR, Anggaran      |
| Human Resources | `/hr`              | Karyawan, Absensi, Cuti, Payroll, Rekrutmen     |
| Inventory       | `/inventory`       | Produk, Gudang, Stok, Pergerakan Stok           |
| Sales           | `/sales`           | Pelanggan, Penawaran, Sales Order, Invoice      |
| Purchasing      | `/purchasing`      | Vendor, Permintaan, Purchase Order, Invoice     |
| Manufacturing   | `/manufacturing`   | BOM, Production Order, Work Order, QC           |
| Projects        | `/projects`        | Proyek, Tugas, Milestone, Time Entry            |
| CRM             | `/crm`             | Leads, Peluang, Aktivitas, Kampanye             |
| Assets          | `/assets`          | Aset, Pemeliharaan, Transfer, Depresiasi        |
| System          | `/system`          | Pengguna, Role, Audit Log, Pengaturan           |

---

## Koneksi ke Backend

Semua pemanggilan API dilakukan melalui Axios instance di `src/services/api.ts` yang secara otomatis:

- Menambahkan header `Authorization: Bearer <token>` dari localStorage
- Menangani response error 401 (redirect ke halaman login)
- Menggunakan `VITE_API_BASE_URL` sebagai base URL

Backend yang digunakan: **Spring Boot 3.x** berjalan di port `8081`.

---

## Scripts yang Tersedia

```bash
pnpm dev        # Jalankan development server (http://localhost:5173)
pnpm build      # Build untuk production (output: dist/)
pnpm preview    # Preview hasil build production
```

  
