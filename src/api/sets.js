import api from "../api/axios";

export const postExerciseToWorkout = async (data) => {
  const res = await api.post("/api/set/exercise", data);
  return res.data;
};

export const deleteById = async (id) => {
  const res = await api.delete(`/api/set/${id}`);
  return res.data;
};

export const deleteExerciseFromWorkout = async (workoutExerciseId) => {
  const res = await api.delete(`/api/set/exercise/${workoutExerciseId}`);
  return res.data;
};

export const updateExerciseSets = async (data) => {
  try {
    const res = await api.put("/api/set/exercise", data);
    return res.data;
  } catch (err) {
    console.error("Failed to update sets:", err);
    throw err;
  }
};
