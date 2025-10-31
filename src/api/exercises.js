import api from "../api/axios"

export const getExercises = async () => {
  const res = await api.get(`/api/exercises`);
  return res.data;
};

export const createExercise = async (data) => {

  const res = await api.post(`/api/exercises`, data )
  return res.data;
};

export const getExerciseDetails = async (id) => {
  const res = await api.get(`/api/exercises/${id}`);
  return res.data;
}

export const getExerciseStats = async () => {
  const res = await api.get(`/api/workouts/exercises/stats`);
  return res.data;
}

export const getMuscleGroups = async () => {
  const res = await api.get("/api/exercises/muscle")
  return res.data;
}

