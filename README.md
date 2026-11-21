# AREARS SNEAKERS // Kinetic Footwear & Biomechanics

A high-performance, full-stack luxury footwear e-commerce experience inspired by Apple and Nike product showcases. Built with Next.js 16, React 19, Tailwind CSS v4, Three.js 3D WebGL, Web Audio API procedural sound synthesis, and PostgreSQL.

---

## 🚀 Key Features

### 👟 Interactive 3D WebGL Sneaker Studio
- **Photorealistic GLTF 3D Model**: Real textured athletic shoe with 360° free orbit, pan, and tilt.
- **Extreme Macro Zoom & HUD**: Camera controls with fine zoom-in/out buttons, zoom reset, and close-up examination (`minDistance: 0.3`).
- **5 Camera Presets**: Instantly snap view angles to **Side Profile**, **Top Down**, **Heel & Outsole**, **Hero 45°**, or **Front Toe Box**.
- **Wireframe CAD Mode**: Switch to technical CAD mesh geometry visualization.
- **Interactive Hotspot**: Inspect the **ArearsFoam Matrix** and carbon plate architecture.

### 🌊 Interactive Liquid Physics & Audio Background
- **Water Ripple Effect**: Dynamic expanding concentric ripples on every click.
- **Buoyant Water Bubbles**: Specular, floating liquid bubbles that rise and pop on interaction.
- **Zero-Dependency Web Audio Synth**: Procedural sound generation for droplet "plops", UI clicks, swoops, and success chimes using `AudioContext`.
- **Sound FX Toggle**: Global volume toggle in the navigation bar.

### 🔬 Advanced Athletic Labs & Modals
- **Biomechanics Stride & Rebound Physics Lab**: Interactive cadence slider, foot strike selector (Forefoot, Midfoot, Heel), and real-time energy rebound simulation.
- **Dual Shoe Side-by-Side Comparison Matrix**: Side-by-side spec comparison of cushioning, stack height, carbon shanks, and drop.
- **Sizing & Arch Advisor**: Interactive tool recommending the ideal size and arch support.
- **Infinite Kinetic Marquee Ticker**: Smooth, scrolling sports-tech telemetry ticker.

### 🛒 Complete Full-Stack E-Commerce Engine
- **Product Catalog & Dynamic Routes**: Filter by category, price, and technology with dynamic static-prerendered PDPs (`/product/[slug]`).
- **Cart & Slide-Over Drawer**: Real-time quantity adjustments, persistent storage, and promo code support (Use `AREARS20` for 20% off).
- **Dual Payment Flow**:
  - **Instant Demo Pay**: Simulates full checkout, decrements stock in the database, and redirects to confetti order confirmation.
  - **Stripe Test Mode**: Integrates with official Stripe Checkout Session when configured.
- **Order History & Tracking**: View order timeline, courier dispatch status, and unique tracking IDs (`AREARS-EXP-*`).
- **Admin Operations Dashboard**: Manage live product catalog, toggle categories, edit stock levels, and review orders.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Turbopack, Partial Prerendering) |
| **UI & Styling** | React 19, Tailwind CSS v4, Lucide Icons, Canvas Confetti |
| **3D Graphics** | [Three.js](https://threejs.org/) (WebGL, GLTFLoader, OrbitControls) |
| **Sound Synthesis** | Native Web Audio API (`AudioContext` procedural oscillators) |
| **Database & ORM** | PostgreSQL, [Prisma ORM](https://www.prisma.io/), In-Memory Store Fallback |
| **Authentication** | JWT (JSON Web Tokens), bcryptjs password hashing |
| **Payments** | Stripe API (Test Mode & Instant Demo Flow) |

---

## ⚡ Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/nitish17855/Arears-footwear.git
cd Arears-footwear
npm install
```

### 2. Configure Environment (Optional)
Copy the example environment file:
```bash
cp .env.example .env.local
```
*(The project includes an automatic in-memory PostgreSQL simulation so you can run and test all features without needing a local database server running).*

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## 🔑 Demo Credentials

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@arearssneakers.com` | `admin123` |
| **Customer** | `alex@example.com` | `customer123` |

*(One-click login buttons are also available on the `/login` page).*

---

## 🏷 Promo Code
Apply **`AREARS20`** in the cart drawer or checkout page for an instant **20% discount**.
