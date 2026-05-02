# Ethara Task Manager (Production-Ready)

A full-stack, enterprise-grade task management ecosystem featuring automated task delegation powered by **Gemini AI**. This platform moved from a Google AI Studio prototype to a fully hardened, persistent SaaS architecture.

## 🛡️ Security & Hardening (Phase 4 Audit Complete)
This application has been audited and hardened for production deployment:
*   **Request Validation**: Implemented strict schema validation using **Zod** for all API payloads.
*   **Security Headers**: Integrated **Helmet.js** to mitigate XSS, clickjacking, and MIME-sniffing.
*   **JWT Revocation**: Real-time token invalidation logic tied to password change timestamps.
*   **Database Resilience**: Mongoose connection logic with automated 5-attempt retry and backoff.
*   **Advanced Auth**: Role-Based Access Control (RBAC) and session-based JWT persistence.

## 🚀 Technical Stack
*   **Frontend**: React, Vite, TypeScript, Tailwind CSS, Zustand.
*   **Backend**: Node.js, Express, TypeScript, Zod.
*   **Database**: MongoDB Atlas (Mongoose).
*   **AI**: Google Gemini Pro (Vertex AI / AI Studio).

## ⚙️ Setup & Installation
1. Clone the repository.
2. Create a `.env` in the root (see `.env.example`).
3. Install dependencies: `npm install`
4. Seed the Admin user: `npx tsx backend/scripts/seed.ts`
5. Run the dev suite: `npm run dev` (Backend) & `npm run dev:frontend`.