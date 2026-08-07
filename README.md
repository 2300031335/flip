# Trust Graph – Multi-Actor Fraud Detection & Remediation Platform
> **AI Build 2026 Competition Entry** | Multi-Actor Graph AI • IEEE-CIS ML Engine • Multi-Agent Architecture • Graduated Remediation • Cryptographic SHA-256 Audit Trail • Modern React Dark UI
> 
> 📖 **[CLICK HERE FOR FULL EXECUTIVE SETUP & PRESENTATION GUIDE](file:///c:/flip/docs/EXECUTIVE_GUIDE.md)**

---

## 🏆 Project Overview

**Trust Graph** is an enterprise-grade AI fraud detection and graduated remediation platform engineered to detect complex multi-actor collusion rings involving **Customers, Sellers, and Delivery Partners**.

Traditional fraud engines look at isolated buyer transactions. Trust Graph uses **Graph AI**, **Supervised ML**, **Explainable AI (XAI)**, and **Multi-Agent Systems** to discover hidden asset sharing (shared devices, IPs, addresses, bank accounts) and circular refund loops across all e-commerce ecosystem actors.

---

## 🚀 Key Innovation Highlights

| Feature | Description | judging Criterion Improved |
| :--- | :--- | :--- |
| **Multi-Actor Graph AI** | NetworkX topological analysis identifying Louvain communities, collusion rings, degree centrality, and shared credential hubs. | **AI Innovation & Technical Excellence** |
| **IEEE-CIS ML Risk Scoring** | Tabular ML scoring engine producing Fraud Probability, Risk Score (0-100), and SHAP feature attributions. | **AI Innovation & Technical Excellence** |
| **Multi-Agent AI System** | 10 specialized agents (*Fraud, Graph, Seller, Customer, Delivery, Decision, Appeal, Audit, Notification, Cost*) collaborating asynchronously. | **AI Innovation & Enterprise Architecture** |
| **Graduated Remediation** | 5-tier policy matrix (`APPROVE` → `REQUIRE_OTP` → `HOLD_PAYOUT` → `HUMAN_REVIEW` → `SUSPEND`) replacing blunt bans to protect revenue. | **Business Impact & UX** |
| **Cryptographic SHA-256 Audit Ledger** | Immutable Merkle block-chained decision history with real-time cryptographic hash verification. | **Security & Technical Excellence** |
| **Futuristic Dark React UI** | React 18 + Material-UI (Dark Mode) dashboard with interactive 2D Graph visualizer, SHAP breakdown, and Judge Sandbox. | **User Experience & Presentation** |
| **Judge Simulation Sandbox** | 1-click live scenario triggers (Collusion Ring Attack, Device Hopping, Telematics Spoofing) for real-time judge demonstration. | **Presentation & UX** |

---

## 🛠️ Tech Stack & Microservices

- **Frontend**: React 18, Vite, Material UI (MUI v5), Recharts, Lucide Icons, Axios.
- **Backend API Gateway & Agents**: Python 3.10, FastAPI, PyDantic v2, PyJWT, Passlib, Uvicorn.
- **AI & Graph Engines**: NetworkX, NumPy, Pandas, Scikit-Learn, XGBoost.
- **Data Persistence & Cache**: SQLite / PostgreSQL, Redis, NetworkX Graph DB.
- **DevOps & Cloud Native**: Docker, Docker Compose, Kubernetes, GitHub Actions CI/CD.

---

## 💻 Quick Start & Local Execution

### Option 1: Running locally with Python & Node.js

#### 1. Backend Setup
```bash
cd backend
pip install -r requirements.txt
python db/seed_data.py
python main.py
```
*Backend API will run at `http://localhost:8000` with Swagger Docs at `http://localhost:8000/docs`.*

#### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*Frontend UI will run at `http://localhost:3000`.*

---

### Option 2: Running with Docker Compose
```bash
docker compose up --build
```

---

## 🎯 How to Demo to Competition Judges

1. Open `http://localhost:3000` in your web browser.
2. Navigate to **Judge Simulation Sandbox** in the left sidebar menu.
3. Click **"🚨 Multi-Actor Collusion Ring Attack"** or **"Run Scenario Live"**.
4. Witness real-time multi-agent inference:
   - Risk Score calculated (e.g. 96 / 100).
   - Multi-Actor Collusion detected (`Customer CUST-109 & Seller SELL-881 share 3 physical devices`).
   - Graduated Action applied (`SUSPEND_ACCOUNTS`).
   - Cryptographic SHA-256 Audit Block Hash committed to the immutable ledger.
5. Click **"Network Graph AI"** in the sidebar to view the vibrant red collusion cluster visually rendered on the 2D canvas.
6. Click **"Cryptographic Audit"** and press **"Verify Cryptographic Integrity"** to validate zero tampering across all blocks.
"# flip" 
