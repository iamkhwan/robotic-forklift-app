# Robotic Forklift Control System

This project demonstrates **frontend and backend integration**, **data management**, and **command parsing** with a focus on clean code, best practices, and maintainability.

---

## 📌 Features

### 1. Forklift Fleet Management
- Import forklift data from `.csv` or `.json` files
- Store forklift details in a database
- Provide an API endpoint to retrieve forklift lists
- Display forklift information in a clean UI (Name, Model Number, Manufacturing Date)

### 2. Forklift Command Parsing
- Input forklift movement commands (e.g., `F10R90L90B5`)
- Parse and validate commands:
  - **F / B** → Move Forward/Backward (metres)
  - **L / R** → Turn Left/Right (degrees: 90, 180, 270, 360)
- Display parsed actions in a human-readable format:
  - `Move Forward by 10 metres`
  - `Turn Right by 90 degrees`
  - `Move Backward by 5 metres`

---

## 🛠️ Tech Stack

- **Frontend**: 
- ReactJS Vite (Node.js v22)
- TypeScript
- Material UI

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v22+

---

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/robotic-forklift-app.git
cd robotic-forklift-app
```

### 2. Configure Environment Variables
Create a .env.development file inside the frontend webapp folder:
```bash
VITE_API_BASE_URL=https://localhost:5001/api
```

### 3. Install Dependencies & Start the Frontend webapp
```bash
npm install
npm run start:dev
```

The web app will start on http://localhost:5173

It will connect to the backend API at the URL defined in your .env.development