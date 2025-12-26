# Deerfields Mall | The Digital Concierge

An enterprise-grade indoor smart navigation and kiosk platform designed for high-performance deployment on Mini PCs and interactive touchscreens.

## 🏛️ Project Architecture

### 1. Frontend (React + TypeScript)
- **High-Fidelity Rendering**: Custom SVG-based map engine with 2D, 3D, and "4D" (Temporal) visualization modes.
- **Wayfinding**: A* (A-Star) pathfinding algorithm optimized for multi-floor mall environments.
- **AI Integration**: Gemini 3 Pro-powered "Elite Concierge" for natural language store discovery and automated navigation triggering.
- **Offline-First**: Service Worker (SW) integration for local asset caching and `localStorage` persistence for the mall database.

### 2. Kiosk Features
- **"You Are Here" Logic**: Each device is configured with a unique `kioskId` and spatial anchor.
- **Luxury UX**: Designed with a "Gold & Charcoal" aesthetic suitable for premium retail environments.
- **Multilingual**: Native support for English and Arabic (RTL) with automated UI flipping.

### 3. Admin & CMS
- **In-Browser Editor**: Technicians can add units, draw polygons, and place navigation nodes without code changes.
- **Emergency Protocol**: Global "Evacuate Mall" toggle that highlights emergency exits and accessible routes.

## 🚀 Deployment on Mini PC (Kiosk Mode)

1. **Environment Setup**:
   - Install a modern evergreen browser (Chrome/Edge recommended).
   - Set the OS to "Kiosk Mode" (Windows Assigned Access or Linux Kiosk Script).
2. **Local Hosting**:
   - Since the app is offline-first, it can be served via a simple Node.js `http-server` or as a PWA.
3. **Data Management**:
   - Use the **Property Inspector** (Admin Panel - Passcode: `2025`) to set the specific coordinates of the kiosk on the map.

## 📂 Key File Structure
- `/components`: UI Atoms and high-fidelity views (Map, Sidebar, AI).
- `/services`: Core logic (Routing, Gemini API, Spatial Calculations).
- `/types.ts`: Master TypeScript definitions for Mall Geometry.
- `constants.tsx`: Initial seed data for floors, stores, and connectivity.
