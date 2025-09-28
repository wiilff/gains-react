import api from "../api/axios"

export const getWorkouts = async () => {
  const res = await api.get(`/api/workouts`);
  return res.data;
};

export const getWorkoutDetails = async (id) => {
  const res = await api.get(`/api/workouts/exercises/sets/${id}`);
  return res.data;
};

export const createWorkout = async (data) => {
  const res = await api.post(`/api/workouts`, data)
  return res.data;
};

export const updateWorkout = async (id, data) => {
  const res = await api.put(`/api/workouts/${id}`, data)
  return res.data;
}

export const deleteWorkout = async (id) => {
  const res = await api.delete(`/api/workouts/${id}`)
  return res.data;
}

 

