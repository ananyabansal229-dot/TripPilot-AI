
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import sqlite3
import json
from datetime import datetime
from pathlib import Path

app = FastAPI(
    title="TripPilot AI API",
    description="Travel planning and trip management API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_PATH = Path(__file__).with_name("trippilot.db")


def get_db():
    return sqlite3.connect(DB_PATH)


def initialize_database():
    with get_db() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS trips (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                destination TEXT NOT NULL,
                duration INTEGER NOT NULL,
                budget REAL NOT NULL,
                travelers INTEGER NOT NULL,
                interests TEXT NOT NULL,
                itinerary TEXT NOT NULL,
                created_at TEXT NOT NULL
            )
        """)


initialize_database()


class TripRequest(BaseModel):
    destination: str = Field(min_length=2, max_length=80)
    duration: int = Field(ge=1, le=30)
    budget: float = Field(gt=0, le=100000000)
    travelers: int = Field(ge=1, le=20)
    interests: list[str] = Field(default_factory=list)


DESTINATIONS = {
    "jaipur": [
        ["Amber Fort", "Explore the historic fort and its architecture."],
        ["Hawa Mahal", "Visit the famous Palace of Winds."],
        ["City Palace", "Discover royal history and museum collections."],
        ["Jantar Mantar", "Explore the historic astronomical observatory."],
        ["Local Markets", "Discover traditional crafts and local food."]
    ],
    "goa": [
        ["Baga Beach", "Enjoy the beach and surrounding cafes."],
        ["Fort Aguada", "Explore the historic Portuguese-era fort."],
        ["Old Goa", "Discover historic churches and heritage sites."],
        ["Dudhsagar Falls", "Explore the famous waterfall region."],
        ["Local Markets", "Discover Goan food and local shopping."]
    ],
    "udaipur": [
        ["City Palace", "Explore the royal palace complex."],
        ["Lake Pichola", "Enjoy the beautiful lake surroundings."],
        ["Jag Mandir", "Visit the historic island palace."],
        ["Saheliyon Ki Bari", "Explore the historic garden."],
        ["Local Markets", "Discover traditional Rajasthani crafts."]
    ],
    "delhi": [
        ["India Gate", "Visit the iconic national monument."],
        ["Red Fort", "Explore the historic Mughal fort."],
        ["Qutub Minar", "Discover the UNESCO heritage monument."],
        ["Humayun's Tomb", "Explore the historic garden tomb."],
        ["Chandni Chowk", "Discover local food and markets."]
    ],
    "manali": [
        ["Hadimba Temple", "Visit the historic wooden temple."],
        ["Solang Valley", "Explore the mountain landscape."],
        ["Old Manali", "Discover cafes and local culture."],
        ["Vashisht", "Explore the village and its surroundings."],
        ["Mall Road", "Enjoy local shopping and food."]
    ]
}


def make_itinerary(destination, duration, interests):
    places = DESTINATIONS.get(
        destination.lower(),
        [
            ["Local Attractions", "Explore popular attractions in the destination."],
            ["Cultural Experience", "Discover local culture and traditions."],
            ["Food Exploration", "Try regional food and local restaurants."],
            ["Nature and Outdoors", "Explore natural attractions nearby."],
            ["Local Markets", "Discover local shopping and crafts."]
        ]
    )

    itinerary = []

    for day in range(duration):
        morning = places[(day * 2) % len(places)]
        afternoon = places[(day * 2 + 1) % len(places)]

        itinerary.append({
            "day": day + 1,
            "title": f"Day {day + 1} in {destination}",
            "activities": [
                {
                    "time": "Morning",
                    "name": morning[0],
                    "description": morning[1]
                },
                {
                    "time": "Afternoon",
                    "name": afternoon[0],
                    "description": afternoon[1]
                },
                {
                    "time": "Evening",
                    "name": "Free Time",
                    "description": (
                        "Enjoy local food, relax or explore nearby areas."
                    )
                }
            ]
        })

    return itinerary


def calculate_budget(budget, travelers, duration):
    # Illustrative allocation of the total trip budget.
    return {
        "accommodation": round(budget * 0.35, 2),
        "food": round(budget * 0.20, 2),
        "local_transport": round(budget * 0.15, 2),
        "activities": round(budget * 0.20, 2),
        "miscellaneous": round(budget * 0.10, 2),
        "total": round(budget, 2),
        "per_person": round(budget / travelers, 2),
        "per_day": round(budget / duration, 2)
    }


@app.get("/")
def home():
    return {
        "message": "Welcome to TripPilot AI",
        "status": "running"
    }


@app.get("/api/health")
def health():
    return {"status": "healthy"}


@app.post("/api/plan")
def create_plan(request: TripRequest):

    destination = request.destination.strip()

    itinerary = make_itinerary(
        destination,
        request.duration,
        request.interests
    )

    budget = calculate_budget(
        request.budget,
        request.travelers,
        request.duration
    )

    trip = {
        "destination": destination,
        "duration": request.duration,
        "budget": request.budget,
        "travelers": request.travelers,
        "interests": request.interests,
        "itinerary": itinerary,
        "budget_breakdown": budget,
        "note": (
            "This is an illustrative itinerary and budget estimate. "
            "Prices and availability have not been verified."
        )
    }

    with get_db() as conn:
        cursor = conn.execute("""
            INSERT INTO trips
            (destination, duration, budget, travelers,
             interests, itinerary, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            destination,
            request.duration,
            request.budget,
            request.travelers,
            json.dumps(request.interests),
            json.dumps(trip),
            datetime.now().isoformat()
        ))

        trip["id"] = cursor.lastrowid

    return trip


@app.get("/api/trips")
def get_trips():
    with get_db() as conn:
        rows = conn.execute("""
            SELECT id, destination, duration, budget,
                   travelers, created_at
            FROM trips
            ORDER BY id DESC
        """).fetchall()

    return [
        {
            "id": row[0],
            "destination": row[1],
            "duration": row[2],
            "budget": row[3],
            "travelers": row[4],
            "created_at": row[5]
        }
        for row in rows
    ]


@app.get("/api/trips/{trip_id}")
def get_trip(trip_id: int):
    with get_db() as conn:
        row = conn.execute(
            "SELECT itinerary FROM trips WHERE id = ?",
            (trip_id,)
        ).fetchone()

    if row is None:
        raise HTTPException(status_code=404, detail="Trip not found")

    return json.loads(row[0])


@app.get("/api/destinations")
def get_destinations():
    return {"destinations": list(DESTINATIONS.keys())}
