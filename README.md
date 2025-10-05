# 💸 Spendy – The Gen-Z Expense Tracker App

**Spendy** is a full-stack personal finance tracker built for the modern generation.  
Track your **monthly expenses**, **weekly breakdowns**, and **income sources**, all with a pastel-themed UI, interactive graphs, and smart logging. Whether you're broke, budgeting, or ballin’ — Spendy keeps it 💯.

---

## 📚 Table of Contents

- [✨ Features](#-features)
- [🛠 Tech Stack](#-tech-stack)
- [📁 Folder Structure](#-folder-structure)
- [🚀 Getting Started](#-getting-started)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [📈 Usage](#-usage)
- [🔌 API Overview](#-api-overview)
- [🧠 Future Features](#-future-features)
- [📄 License](#-license)

---

## ✨ Features

- 📅 **Monthly Overview:** Add expenses by category per month (e.g., Rent, Food, Subscriptions)
- 📆 **Weekly Overview:** Daily logs auto-clustered into weekly and monthly totals
- 💰 **Income Dashboard:** Track income by source, week, and month
- 📊 **Charts & Analytics:** Bar and pie graphs for spending trends
- 🧾 **Expense & Income Logs:** View history with timestamps and filters
- 🎯 **Monthly Budgets:** Set spending limits for each category
- 🖌️ **Modern UI:** Clean, responsive, pastel-themed layout

---

## 🛠 Tech Stack

| Layer        | Technology                     |
|--------------|-------------------------------|
| Frontend     | React, Tailwind CSS, Chart.js |
| Backend      | Node.js, Express.js           |
| Database     | MongoDB, Mongoose             |
| State Mgmt   | React Context (or Redux)      |
| Charts       | Chart.js / Recharts           |

---

## 📁 Folder Structure

```
expense-tracker-app/
├── backend/
│   ├── models/
│   ├── controllers/
│   ├── routes/
│   ├── config/
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── App.jsx
```

---

## 🚀 Getting Started

### ✅ Backend Setup

```bash
cd backend
npm install
```

> Create a `.env` file:
```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

Then run:
```bash
npm start
```

---

### ✅ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 📈 Usage

- 🌐 Go to: `http://localhost:5173`
- Select the year you want to track
- Add expense types and income sources
- Use homepage to log:
  - Daily expenses
  - Weekly income
- Navigate between sections using the navbar

---

## 🔌 API Overview

| Endpoint                  | Method | Description              |
|---------------------------|--------|--------------------------|
| `/api/expenses`           | GET    | Fetch all expenses       |
| `/api/expenses`           | POST   | Add new expense          |
| `/api/income`             | GET    | Get income records       |
| `/api/income`             | POST   | Add income               |
| `/api/categories`         | POST   | Add expense category     |
| `/api/income-sources`     | POST   | Add income source        |

> Full API docs coming soon...

---

## 🧠 Future Features

- [ ] Export to PDF/Excel
- [ ] Notifications on overspending
- [ ] Currency conversion
- [ ] Cloud sync + mobile app
- [ ] Dark mode 🌑

---

## 📄 License

MIT License.  
Use it. Remix it. Share it. Just don’t gatekeep it. 😉

---

> Made with 🧠 + 💻 + ☕ by the DepresseDeeZ
