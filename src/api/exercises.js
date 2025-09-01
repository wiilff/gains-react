const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

export const getExercises = async () => {
  const res = await fetch(`${API_URL}/api/exercise`);
  return res.json();
};

export const createExercise = async (name) => {
  const res = await fetch(`${API_URL}/api/exercise`, {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({ name })
  });
  return res.json();
};

export const getExerciseDetails = async (id) => {
  const res = await fetch(`${API_URL}/api/exercise/${id}`);
  return res.json();
}

