<div align="center">

# ✦ AURA — Hospitality Suite

### Sistema integral de gestión hotelera · All-in-one hotel management system

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?style=for-the-badge&logo=clerk)](https://clerk.com/)
[![Electron](https://img.shields.io/badge/Electron-Desktop-47848F?style=for-the-badge&logo=electron&logoColor=white)](https://www.electronjs.org/)
[![License](https://img.shields.io/badge/License-Private-FF385C?style=for-the-badge)](#)

</div>

---

<!-- 🖼️ SCREENSHOTS: Agrega aquí capturas reales del dashboard -->
<!-- ![Dashboard Preview](docs/dashboard_preview.png) -->

---

## 🇪🇸 Español

### ¿Qué es Aura?

**Aura** es un ERP (Enterprise Resource Planning) diseñado exclusivamente para la industria hotelera. Permite administrar propiedades, habitaciones, reservaciones, huéspedes, finanzas y más desde un panel de control elegante y moderno con estética **"Aura Noir"** — una interfaz ultra-oscura de grado institucional.

Funciona como **aplicación web** (desplegable en Vercel) y como **aplicación de escritorio** (via Electron), con soporte completo bilingüe **Español / Inglés**.

### ✨ Características Principales

| Módulo | Descripción |
| --- | --- |
| 🏨 **Propiedades** | Gestiona múltiples hoteles, hostales o viviendas desde una sola cuenta |
| 🛏️ **Habitaciones** | Grid visual con estados en tiempo real (Limpia, Sucia, Ocupada, Mantenimiento) |
| 📅 **Reservaciones** | Creación, seguimiento y gestión de reservas con estados de pago |
| 👥 **Huéspedes** | Registro y consulta del historial de huéspedes |
| 💰 **Finanzas** | Panel financiero con seguimiento de ingresos y métodos de pago |
| 📋 **Logs de Auditoría** | Registro automático de todas las acciones realizadas en el sistema |
| ⚙️ **Configuración** | Personalización de la propiedad, roles de usuario y preferencias |
| ⚡ **Planes** | Gestión de suscripciones (Basic, Pro, Enterprise) |
| 🧪 **Sandbox** | Entorno de pruebas para pasarelas de pago (Stripe, PayPal, MercadoPago) |

### 🛡️ Sistema de Resiliencia (Failover Automático)

Aura incluye un sistema de **resiliencia automática**:

1. Intenta conectar con **MongoDB Atlas** (nube) como prioridad
2. Si detecta falta de conexión, **cambia automáticamente a MongoDB local** (Compass)
3. La operación continúa sin interrupciones — el usuario no percibe el cambio

> [!NOTE]
> Los datos guardados localmente no se sincronizan automáticamente con Atlas. Usa la herramienta de Importar/Exportar de MongoDB Compass para sincronizarlos.

### 🔐 Autenticación y Roles

| Rol | Permisos |
| --- | --- |
| **Admin** | Acceso total: finanzas, logs, configuración, planes, zona avanzada |
| **Gerente** | Propiedades, habitaciones, huéspedes, configuración |
| **Reservador** | Dashboard, reservaciones, inventario de habitaciones |

### 🔌 API Pública

Aura expone una API REST pública para integraciones externas:

- `GET /api/public/hotel/[hotelId]` — Información del hotel
- `GET /api/public/hotel/[hotelId]/inventory` — Habitaciones disponibles
- `POST /api/public/hotel/[hotelId]/reservations` — Crear reservación
- `POST /api/public/hotel/[hotelId]/payments` — Procesar pago

> Documentación completa en [`DOCS.md`](DOCS.md)

---

## 🇺🇸 English

### What is Aura?

**Aura** is an ERP (Enterprise Resource Planning) system built exclusively for the hospitality industry. It lets you manage properties, rooms, reservations, guests, finances, and more from a sleek, modern control panel featuring the **"Aura Noir"** aesthetic — an ultra-dark, institutional-grade interface.

It works as a **web application** (deployable on Vercel) and as a **desktop application** (via Electron), with full **Spanish / English** bilingual support.

### ✨ Key Features

| Module | Description |
| --- | --- |
| 🏨 **Properties** | Manage multiple hotels, hostels, or lodgings from a single account |
| 🛏️ **Rooms** | Visual grid with real-time statuses (Clean, Dirty, Occupied, Maintenance) |
| 📅 **Reservations** | Create, track, and manage bookings with payment status tracking |
| 👥 **Guests** | Guest registration and history lookup |
| 💰 **Finances** | Financial dashboard with income tracking and payment method breakdown |
| 📋 **Audit Logs** | Automatic logging of all system actions |
| ⚙️ **Settings** | Property customization, user roles, and preferences |
| ⚡ **Plans** | Subscription management (Basic, Pro, Enterprise) |
| 🧪 **Sandbox** | Payment gateway testing environment (Stripe, PayPal, MercadoPago) |

### 🛡️ Resilience System (Automatic Failover)

Aura includes an **automatic resilience** system:

1. Attempts to connect to **MongoDB Atlas** (cloud) as the primary source
2. If connectivity is lost, it **automatically switches to local MongoDB** (Compass)
3. Operations continue seamlessly — the user experiences no interruption

> [!NOTE]
> Data saved locally does not auto-sync to Atlas. Use MongoDB Compass's Import/Export tool to sync manually.

### 🔐 Authentication & Roles

| Role | Permissions |
| --- | --- |
| **Admin** | Full access: finances, logs, settings, plans, danger zone |
| **Manager** | Properties, rooms, guests, settings |
| **Staff** | Dashboard, reservations, room inventory |

### 🔌 Public API

Aura exposes a public REST API for external integrations:

- `GET /api/public/hotel/[hotelId]` — Hotel information
- `GET /api/public/hotel/[hotelId]/inventory` — Available rooms
- `POST /api/public/hotel/[hotelId]/reservations` — Create reservation
- `POST /api/public/hotel/[hotelId]/payments` — Process payment

> Full documentation available at [`DOCS.md`](DOCS.md)

---

## 🛠️ Tech Stack

| Layer | Technology |
| --- | --- |
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **Auth** | Clerk |
| **Database** | MongoDB (Atlas + Compass) |
| **ORM** | Prisma |
| **Styling** | Tailwind CSS 4 |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **Desktop** | Electron |
| **Deployment** | Vercel |

---

## 🚀 Quick Start

### Prerequisites / Prerequisitos

- **Node.js** 18+
- **MongoDB** (local via Compass or cloud via Atlas)
- **Clerk** account for authentication keys

### Installation / Instalación

```bash
# Clone the repository / Clona el repositorio
git clone https://github.com/calavanda/Aura-Dashboard.git
cd Aura-Dashboard

# Install dependencies / Instala dependencias
npm install

# Generate Prisma client / Genera el cliente de Prisma
npx prisma generate
```

### Environment Variables / Variables de Entorno

Create a `.env.local` file / Crea un archivo `.env.local`:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# MongoDB
DATABASE_URL="mongodb://localhost:27017/aura"
# or for Atlas / o para Atlas:
# DATABASE_URL="mongodb+srv://user:pass@cluster0.mongodb.net/aura?retryWrites=true&w=majority"

# Owner (creator Clerk ID)
NEXT_PUBLIC_CREATOR_CLERK_ID=user_...
```

### Development / Desarrollo

```bash
# Web app
npm run dev

# Desktop app (Electron)
npm run app:dev
```

Open [http://localhost:3000](http://localhost:3000) to access the dashboard.

---

## 📁 Project Structure / Estructura del Proyecto

```
AuraDashboard/
├── prisma/              # Database schema (MongoDB)
├── electron/            # Electron desktop wrapper
├── public/              # Static assets
├── src/
│   ├── app/
│   │   ├── (auth)/      # Sign-in / Sign-up pages
│   │   ├── actions/     # Server actions
│   │   ├── api/         # REST API routes
│   │   ├── layout.tsx   # Root layout with providers
│   │   └── page.tsx     # Main dashboard page
│   ├── components/      # UI components
│   │   ├── Sidebar.tsx          # Navigation sidebar
│   │   ├── PropertyModule.tsx   # Property management
│   │   ├── RoomGrid.tsx         # Room status grid
│   │   ├── ReservationList.tsx  # Reservations panel
│   │   ├── GuestModule.tsx      # Guest management
│   │   ├── FinanceModule.tsx    # Financial dashboard
│   │   ├── SettingsModule.tsx   # Settings panel
│   │   ├── PlansModule.tsx      # Subscription plans
│   │   ├── AdvancedModule.tsx   # Danger zone / Advanced
│   │   ├── AuditLogsModule.tsx  # Audit trail
│   │   └── PaymentSandbox.tsx   # Payment testing
│   ├── context/         # React contexts (I18n, etc.)
│   ├── i18n/            # Internationalization (ES/EN)
│   └── lib/             # Utilities & Prisma client
└── package.json
```

---

## 💳 Supported Payment Methods / Métodos de Pago Soportados

| Provider | Type |
| --- | --- |
| **Stripe** | Online / En línea |
| **PayPal** | Online / En línea |
| **MercadoPago** | Online / En línea |
| **Cash / Efectivo** | In-person / Presencial |

---

## 📸 Screenshots / Capturas de Pantalla

<!-- 
Agrega capturas de pantalla reales aquí. Ejemplo:
Add real screenshots here. Example:

![Dashboard](docs/dashboard.png)
![Room Grid](docs/rooms.png)
![Reservations](docs/reservations.png)
![Settings](docs/settings.png)
-->

> 🖼️ _Coming soon / Próximamente_

---

<div align="center">

**Built with ♥ by [Calavanda](https://github.com/calavanda)**

_Aura — Where technology meets hospitality_

_Aura — Donde la tecnología se encuentra con la hospitalidad_

</div>
