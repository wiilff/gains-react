import api from "../api/axios";

export const postExerciseToWorkout = async (data) => {
  const res = await api.post("/api/workouts/exercises", data);
  return res.data;
};

export const deleteById = async (id) => {
  const res = await api.delete(`/api/workouts/exercises/sets/${id}`);
  return res.data;
};

export const deleteExerciseFromWorkout = async (workoutExerciseId) => {
  const res = await api.delete(`/api/workouts/exercises/${workoutExerciseId}`);
  return res.data;
};

export const updateExerciseSets = async (workoutExerciseId, data) => {
  try {
    const res = await api.put(`/api/workouts/exercises/sets/${workoutExerciseId}`, data);
    return res.data;
  } catch (err) {
    console.error("Failed to update sets:", err);
    throw err;
  }
};
