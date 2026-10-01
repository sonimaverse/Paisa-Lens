# PaisaLens 🪙📸
> **Smart Personal Finance & Micro-Expense OCR Tracker**  
> *“Every rupee counts. Even the small ones.”*

[![React](https://img.shields.io/badge/React-19-61dafb.svg?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178c6.svg?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8.svg?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

---

## 🎯 The Problem
People remember their big purchases (rent, college tuition, gadgets) but lose track of small daily outlays like **Rs. 50 tea**, **Rs. 80 snacks**, and **Rs. 120 rides**. These micro-expenses silently bleed **20% to 30%** of monthly take-home income. Manual tracking apps are tedious and quickly abandoned.

## 💡 The Solution
**PaisaLens** turns physical receipts and digital slips into structured financial intelligence in seconds:
1. **Instant Receipt OCR**: Point your camera or upload a bill (Bhat-Bhateni supermarket, Himalayan Java coffee, Pathao ride, or local tea stall bills).
2. **Automated Line-Item Extraction**: Automatically detects merchant name, date, individual line items, 13% Nepal VAT, and category.
3. **Micro-Expense Detection**: Automatically flags expenses $\le$ Rs. 250 (Tea & Snacks, Quick Transit, Small Online Outlays) and tracks their cumulative impact.
4. **The "Nepali Chiya Effect" Calculator**: Shows how drinking 2 cups of tea daily compounds to **over Rs. 36,500/year**.
5. **Smart Budget Guardrails**: Visual progress bars with proactive warning thresholds when categories approach 80% with days left in the month.

---

## 🚀 Quick Start (Local Setup)

### Prerequisites
- Node.js (v18 or newer)
- npm

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/paisalens.git
cd paisalens
```

### 2. Install dependencies
```bash
npm install --legacy-peer-deps
```

### 3. Run development server
```bash
npm run dev
```
Open **`http://localhost:3000`** in your browser.

---

## 🛠️ Tech Stack
- **Frontend Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Animations & Effects**: Motion & Canvas Confetti
- **Build Tool**: Vite

---

## 📋 4-Step Architecture Pipeline
- **SCAN**: Capture thermal receipts, invoices, or screenshots via mobile camera or drag-and-drop.
- **UNDERSTAND**: Extract merchant, date, NPR line items, 13% VAT, and classify transaction category.
- **TRACK**: Dynamically adjust category ceilings and remaining monthly balance.
- **SAVE**: Detect micro-leakages and surface actionable insights to preserve monthly savings.

---



