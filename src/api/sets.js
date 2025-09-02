const API_URL = import.meta.env.VITE_API_URL

export const postExerciseToWorkout = async (data) => {
  const res = await fetch(`${API_URL}/api/set/exercise`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
  return res.json();
}

export const deleteById = async (id) => {
    const res = await fetch(`${API_URL}/api/set/${id}`, {
        method: "DELETE"
    });
    return res.json()
}

export const deleteExerciseFromWorkout = async (workoutExerciseId) => {
    const res = await fetch(`${API_URL}/api/set/exercise/${workoutExerciseId}`, {
        method: "DELETE"
    });
    return res.json()
}

export const updateExerciseSets = async (data) => {
  try {
    const response = await fetch(`${API_URL}/api/set/exercise`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to update sets");
    }

    return await response.json();
  } catch (err) {
    console.error(err);
  }
};