
const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export async function generateTrip(tripData) {
  const response = await fetch(`${API_URL}/api/plan`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(tripData)
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "Unable to generate trip.");
  }

  return response.json();
}

export async function getTripHistory() {
  const response = await fetch(`${API_URL}/api/trips`);

  if (!response.ok) {
    throw new Error("Unable to load trip history.");
  }

  return response.json();
}

export async function getSavedTrip(id) {
  const response = await fetch(`${API_URL}/api/trips/${id}`);

  if (!response.ok) {
    throw new Error("Unable to load saved trip.");
  }

  return response.json();
}
