
# ✈️ TripPilot AI

### Your Personal AI Travel Agent & Trip Management Copilot

TripPilot AI is a web-based intelligent travel planning platform designed to simplify the travel experience through personalized recommendations, itinerary generation, budget estimation and trip management.

Developed as a project for **TBO VoyageHack 4.0**.

---

## 🌍 Problem Statement

Travellers often need to switch between multiple platforms to discover destinations, compare accommodation and transportation options, estimate expenses and organize their itineraries.

TripPilot AI aims to bring these travel planning activities together in one convenient platform.

## 💡 Our Solution

TripPilot AI provides a unified travel planning experience through a user-friendly web application.

Users can enter their destination, budget, travel duration, number of travellers and interests to generate a personalized travel itinerary.

## 🚀 Current Features

- Travel destination input
- Personalized trip planning form
- Day-wise itinerary generation
- Destination-specific activity suggestions
- Estimated travel budget breakdown
- Per-person and per-day budget calculations
- SQLite-based trip storage
- Saved trip history
- REST API integration
- Responsive travel-tech interface

## 🛠️ Technology Stack

### Frontend
- React.js
- JavaScript
- HTML5
- CSS3
- Vite

### Backend
- Python
- FastAPI
- REST API

### Database
- SQLite

### Development Tools
- GitHub
- Visual Studio Code

## 🏗️ Project Structure

```text
TripPilot-AI/
│
├── README.md
├── .gitignore
│
├── backend/
│   ├── main.py
│   └── requirements.txt
│
└── frontend/
    ├── package.json
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── api.js
        └── style.css
```

## ⚙️ Installation and Setup

### Prerequisites

Install the following:
- Python 3.10 or newer
- Node.js (LTS version)
- Visual Studio Code
- GitHub account

### Step 1: Clone the repository

```bash
git clone https://github.com/YOUR-USERNAME/TripPilot-AI.git
cd TripPilot-AI
```

### Step 2: Set up the backend

```bash
cd backend
python -m venv venv
```

Activate the virtual environment.

Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the backend:

```bash
uvicorn main:app --reload
```

Backend address:

http://127.0.0.1:8000

API documentation:

http://127.0.0.1:8000/docs

### Step 3: Set up the frontend

Open a second terminal.

```bash
cd TripPilot-AI/frontend
npm install
npm run dev
```

Open the local frontend address displayed in the terminal, usually:

http://localhost:5173

## 🗄️ Database

TripPilot AI uses SQLite to store generated trip information.

The database is initialized automatically when the backend starts.

## 🔌 API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | / | API welcome |
| GET | /api/health | Health check |
| POST | /api/plan | Generate itinerary |
| GET | /api/trips | Retrieve saved trips |
| GET | /api/trips/{id} | Retrieve a saved trip |
| GET | /api/destinations | List supported destinations |

## 📌 Current Limitations

- Initial itinerary data is illustrative.
- Destination-specific datasets cover a limited number of destinations.
- Budget figures are estimates, not live quotations.
- Live flight and hotel inventory is not integrated.
- Real booking and payment functionality is not available.
- An external LLM-powered assistant is planned for a future version.

## 🔮 Future Enhancements

- LLM-powered conversational travel assistant
- Live flight and hotel API integration
- Real-time price and availability comparison
- Interactive maps and route planning
- Dynamic itinerary optimization
- Weather-aware travel recommendations
- Booking management and cancellation assistance
- Multilingual travel support
- User accounts and authentication

## 🎯 Project Objective

To create a smarter and more accessible travel planning experience by combining personalized recommendations, intelligent itinerary generation and unified trip management.

---

**Project:** TripPilot AI  
**Competition:** TBO VoyageHack 4.0  
**Category:** Travel Technology / Artificial Intelligence
