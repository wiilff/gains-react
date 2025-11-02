import api from "../api/axios"

export const getSplits = async () => {
  const res = await api.get(`/api/splits`);
  return res.data;
}

export const createSplit = async (splitData) => {
  const res = await api.post(`/api/splits`, splitData);
  return res.data;
}

export const updateSplit = async (splitId, splitData) => {
  const res = await api.put(`/api/splits/${splitId}`, splitData);
  return res.data;
}

export const postSplitToWorkout = async (workoutId, data) => {
  const res = await api.post(`/api/workouts/exercises/${workoutId}`, data);
  return res.data;
}

export const deleteSplit = async (splitId) => {
  const res = await api.delete(`/api/splits/${splitId}`);
  return res.data;
}