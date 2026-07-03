# Delflow Shipping & Logistics

Delflow is an enterprise-grade, integrated logistics management platform designed to streamline global supply chain coordination, multi-modal freight operations, and real-time tracking with absolute transparency.

Built for global freight operators, NVOCCs, and regional distributors, Delflow connects continental fleet management, deep-sea container lines, energy-efficient rail corridors, and high-priority express air freight under a unified digital workflow.

---

## Key Features

- **Multi-Modal Logistics Engine**: Fully integrated scheduling and routing across road transport, ocean freight, rail corridors, and high-priority air cargo.
- **Dynamic Parcel & Shipment Registration**: Seamless registry to declare cargo items, assign tracking codes, register destinations, and transition status in real time.
- **Role-Based Access Control (RBAC)**: Secure multi-tier authentication for staff, including support for Super Admins, Admins, and Support Agents to manage operations and user roles.
- **Smart Tracking & IoT Telematics**: Comprehensive search tool for clients to trace shipment coordinates, temperature logs, transit status, and customs clearance events.
- **Real-Time Customer Support**: Built-in chat client pairing instant live support widget capabilities with regional WhatsApp dispatch interfaces.
- **Aesthetic Swiss-Modern UI**: Highly responsive interface emphasizing micro-animations, clear telemetry presentation, and an executive-level visual theme.

---

## Tech Stack

- **Frontend**: React 18 with Vite, Framer Motion for premium UI transitions, and Tailwind CSS for custom utility-driven styling.
- **Backend**: Node.js & Express server with TypeScript compilation for robust static routing and secure API development.
- **Database**: Cloud-hosted Firestore Database for real-time synchronization, session storage, message threads, and shipment tracking records.
- **Icons**: Lucide React.

---

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm (v9 or higher recommended)

### Installation

1. Clone the repository and navigate to the project directory:
   ```bash
   git clone <repository-url>
   cd delflow-logistics
   ```

2. Install all dependencies:
   ```bash
   npm install
   ```

3. Create your environment variables file by copying the template:
   ```bash
   cp .env.example .env
   ```
   Add your Firebase Credentials, Firestore Project Details, and any necessary API configurations.

### Running the Development Environment

Start the full-stack development environment (which runs both the client and the custom server via TSX):
```bash
npm run dev
```
The server will bind and be accessible locally at `http://localhost:3000`.

### Production Build

Compile the production builds:
```bash
npm run build
```
This builds the client static assets to the `dist/` directory and compiles the custom Express backend server to `dist/server.cjs` via esbuild.

To launch the compiled server in a production environment:
```bash
npm run start
```

---

## File Structure

```text
├── src/
│   ├── components/       # Reusable React components (e.g., Magnet animation)
│   ├── App.tsx           # Primary React single-page dashboard application
│   ├── main.tsx          # Client-side mounting and entry point
│   └── index.css         # Global Tailwind CSS styles and typography config
├── api/                  # Server API routes and modules
├── public/               # Static assets, vector icons, and favicon resources
├── server.ts             # Express full-stack application and API server
├── package.json          # Dependencies, compilation and launch scripts
└── README.md             # Project documentation
```

---

© 2026 Delflow Shipping & Logistics. All Rights Reserved.
