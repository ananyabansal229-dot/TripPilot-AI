
import { useEffect, useState } from "react";
import {
  generateTrip,
  getTripHistory,
  getSavedTrip
} from "./api";

const initialForm = {
  destination: "",
  duration: 5,
  budget: 35000,
  travelers: 2,
  interests: []
};

const interestOptions = [
  "Historical Places",
  "Adventure",
  "Nature",
  "Beaches",
  "Food",
  "Shopping",
  "Culture"
];

function App() {
  const [form, setForm] = useState(initialForm);
  const [trip, setTrip] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadHistory() {
    try {
      const data = await getTripHistory();
      setHistory(data);
    } catch {
      setHistory([]);
    }
  }

  useEffect(() => {
    loadHistory();
  }, []);

  function updateField(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value
    }));
  }

  function toggleInterest(interest) {
    setForm((previous) => ({
      ...previous,
      interests: previous.interests.includes(interest)
        ? previous.interests.filter((item) => item !== interest)
        : [...previous.interests, interest]
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setTrip(null);

    try {
      const result = await generateTrip({
        ...form,
        duration: Number(form.duration),
        budget: Number(form.budget),
        travelers: Number(form.travelers)
      });

      setTrip(result);
      await loadHistory();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function openSavedTrip(id) {
    setError("");

    try {
      const result = await getSavedTrip(id);
      setTrip(result);
    } catch (err) {
      setError(err.message);
    }
  }

  function resetPlanner() {
    setTrip(null);
    setForm(initialForm);
    setError("");
  }

  const money = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(amount || 0);

  return (
    <div className="app-shell">
      <header className="navbar">
        <a className="brand" href="#">
          <span className="brand-icon">✈</span>
          TripPilot <span>AI</span>
        </a>

        <nav>
          <a href="#planner">Plan a Trip</a>
          <a href="#history">My Trips</a>
        </nav>

        <div className="nav-tag">SMART TRAVEL ASSISTANT</div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-content">
            <span className="eyebrow">YOUR JOURNEY, REIMAGINED</span>

            <h1>
              Travel smarter.
              <br />
              <span>Explore further.</span>
            </h1>

            <p>
              Your personal travel planning companion.
              Discover destinations, create itineraries
              and manage your travel budget in one place.
            </p>

            <a href="#planner" className="primary-button">
              Start Planning <span>→</span>
            </a>
          </div>

          <div className="hero-visual">
            <div className="globe">🌍</div>
            <div className="flight-path">✈</div>
            <div className="floating-card">
              <span>✦ AI POWERED</span>
              <strong>Your next journey starts here.</strong>
            </div>
          </div>
        </section>

        <section className="features">
          <div className="feature">
            <span>✦</span>
            <strong>Smart Planning</strong>
            <small>Personalized itineraries</small>
          </div>
          <div className="feature">
            <span>₹</span>
            <strong>Budget Insights</strong>
            <small>Estimated trip expenses</small>
          </div>
          <div className="feature">
            <span>⌖</span>
            <strong>Explore Places</strong>
            <small>Discover destinations</small>
          </div>
        </section>

        <section className="planner-section" id="planner">
          <div className="section-heading">
            <span className="eyebrow">PLAN YOUR NEXT ADVENTURE</span>
            <h2>Your journey, your way.</h2>
            <p>Tell us what your ideal trip looks like.</p>
          </div>

          <form className="planner-card" onSubmit={handleSubmit}>
            <div className="form-grid">
              <label className="field full-width">
                <span>Destination</span>
                <input
                  name="destination"
                  value={form.destination}
                  onChange={updateField}
                  placeholder="e.g. Jaipur, Goa, Udaipur..."
                  minLength="2"
                  maxLength="80"
                  required
                />
              </label>

              <label className="field">
                <span>Trip duration (days)</span>
                <input
                  type="number"
                  name="duration"
                  min="1"
                  max="30"
                  value={form.duration}
                  onChange={updateField}
                  required
                />
              </label>

              <label className="field">
                <span>Total budget (₹)</span>
                <input
                  type="number"
                  name="budget"
                  min="1"
                  value={form.budget}
                  onChange={updateField}
                  required
                />
              </label>

              <label className="field full-width">
                <span>Number of travellers</span>
                <input
                  type="number"
                  name="travelers"
                  min="1"
                  max="20"
                  value={form.travelers}
                  onChange={updateField}
                  required
                />
              </label>
            </div>

            <div className="interest-section">
              <span className="field-title">
                What are you interested in?
              </span>

              <div className="interest-list">
                {interestOptions.map((interest) => (
                  <button
                    type="button"
                    key={interest}
                    className={
                      form.interests.includes(interest)
                        ? "interest active"
                        : "interest"
                    }
                    onClick={() => toggleInterest(interest)}
                  >
                    {form.interests.includes(interest) ? "✓ " : "+ "}
                    {interest}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="primary-button submit-button"
              disabled={loading}
            >
              {loading ? "Creating your itinerary..." : "Generate My Trip →"}
            </button>

            {error && <p className="error-message">{error}</p>}
          </form>
        </section>

        {trip && (
          <section className="results-section">
            <div className="section-heading">
              <span className="eyebrow">YOUR PERSONALIZED TRAVEL PLAN</span>
              <h2>{trip.destination} Adventure</h2>
              <p>
                {trip.duration} days · {trip.travelers} travellers
              </p>
            </div>

            <div className="budget-grid">
              <div className="budget-card highlight">
                <small>Total estimated budget</small>
                <strong>{money(trip.budget_breakdown.total)}</strong>
              </div>
              <div className="budget-card">
                <small>Per person</small>
                <strong>{money(trip.budget_breakdown.per_person)}</strong>
              </div>
              <div className="budget-card">
                <small>Per day</small>
                <strong>{money(trip.budget_breakdown.per_day)}</strong>
              </div>
            </div>

            <div className="itinerary-heading">
              <h3>Day-wise itinerary</h3>
              <button onClick={resetPlanner} className="secondary-button">
                Plan Another Trip
              </button>
            </div>

            <div className="itinerary-list">
              {trip.itinerary.map((day) => (
                <article className="day-card" key={day.day}>
                  <div className="day-number">
                    DAY {String(day.day).padStart(2, "0")}
                  </div>
                  <h3>{day.title}</h3>

                  {day.activities.map((activity, index) => (
                    <div className="activity" key={index}>
                      <span className="activity-time">
                        {activity.time}
                      </span>
                      <div>
                        <strong>{activity.name}</strong>
                        <p>{activity.description}</p>
                      </div>
                    </div>
                  ))}
                </article>
              ))}
            </div>

            <div className="budget-breakdown">
              <h3>Estimated budget breakdown</h3>
              {Object.entries(trip.budget_breakdown)
                .filter(([key]) =>
                  !["total", "per_person", "per_day"].includes(key)
                )
                .map(([key, value]) => (
                  <div className="breakdown-row" key={key}>
                    <span>
                      {key.replaceAll("_", " ")}
                    </span>
                    <strong>{money(value)}</strong>
                  </div>
                ))}
            </div>

            <p className="disclaimer">{trip.note}</p>
          </section>
        )}

        <section className="history-section" id="history">
          <div className="section-heading">
            <span className="eyebrow">YOUR TRAVEL COLLECTION</span>
            <h2>Previously planned trips</h2>
          </div>

          {history.length === 0 ? (
            <p className="empty-state">
              Your saved trips will appear here after you generate your first itinerary.
            </p>
          ) : (
            <div className="history-grid">
              {history.map((item) => (
                <button
                  className="history-card"
                  key={item.id}
                  onClick={() => openSavedTrip(item.id)}
                >
                  <span>✈</span>
                  <strong>{item.destination}</strong>
                  <small>
                    {item.duration} days · {item.travelers} travellers
                  </small>
                  <b>{money(item.budget)}</b>
                  <small>View itinerary →</small>
                </button>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer>
        <a className="brand" href="#">
          TripPilot <span>AI</span>
        </a>
        <p>Your journey. Your preferences. Your intelligent travel companion.</p>
        <small>Built for TBO VoyageHack 4.0</small>
      </footer>
    </div>
  );
}

export default App;
