# ⚡ Ethara Task Manager (Production-Ready SaaS)

[![Live Demo](https://img.shields.io/badge/Live_Demo-View_Project-blue?style=for-the-badge)](https://ethara-task-manager-production-5ee6.up.railway.app/)


A full-stack, enterprise-grade task management ecosystem featuring automated task delegation powered by **Google Gemini AI**. This platform was engineered to transition from a conceptual AI prototype to a fully hardened, persistent SaaS architecture.

## ✨ Key Features
* **AI-Powered Task Generation:** Integrated with Google Gemini (Vertex AI) to automatically break down large projects into actionable, database-persistent tasks.
* **Role-Based Access Control (RBAC):** Distinct privileges for Admin and Member accounts.
* **Persistent Data Management:** Users, projects, and tasks are securely stored and relationally mapped in MongoDB Atlas.
* **Modern UI/UX:** Built with React, Tailwind CSS, and Zustand for snappy, state-driven interactions.

## 🛡️ Security & Architecture (Phase 4 Audit Complete)
This application was rigorously audited and hardened to meet production-level deployment standards:
* **Request Validation:** Implemented strict schema validation using **Zod** for all API payloads to prevent NoSQL injection and ensure data integrity.
* **Security Headers:** Integrated **Helmet.js** to mitigate XSS, clickjacking, and MIME-sniffing.
* **Zero-Trust Auth & Revocation:** Session-based JWT persistence utilizing `sessionStorage`, coupled with real-time token invalidation logic tied to password change timestamps.
* **Operational Resilience:** Mongoose connection logic rebuilt with an automated 5-attempt retry and backoff sequence to survive cloud-provider cold starts.
* **Rate Limiting:** IP-based brute-force protection strictly enforced on authentication routes.

## 🚀 Technical Stack
* **Frontend:** React 19, Vite, TypeScript, Tailwind CSS, Zustand, React Router.
* **Backend:** Node.js, Express, TypeScript, Zod, Mongoose, Helmet, JWT.
* **Database:** MongoDB Atlas.
* **AI Engine:** Google Gemini Pro API.
* **Deployment & CI/CD:** Railway (Automated Monorepo Builds).

## ⚙️ Local Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/your-username/ethara-task-manager.git](https://github.com/AhirraoYash/ethara-task-manager.git)
   cd ethara-task-manager
