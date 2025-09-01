const API_URL = process.env.REACT_APP_API_URL // || "http://localhost:8080";

export const getWorkouts = async () => {
  const res = await fetch(`${API_URL}/api/workout`);
  return res.json();
};

export const getWorkoutDetails = async (id) => {
  const res = await fetch(`${API_URL}/api/workout/${id}`);
  return res.json();
};

export const createWorkout = async (data) => {
  const res = await fetch(`${API_URL}/api/workout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};


