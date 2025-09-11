import api from "../api/axios"

export const getWorkouts = async () => {
  const res = await api.get(`/api/workout`);
  return res.data;
};

export const getWorkoutDetails = async (id) => {
  const res = await api.get(`/api/workout/${id}`);
  return res.data;
};

export const createWorkout = async (data) => {
  const res = await api.post(`/api/workout`, data)
  return res.data;
};

export const updateWorkout = async (id, data) => {
  const res = await api.put(`/api/workout/${id}`, data)
  return res.data;
}

export const deleteWorkout = async (id) => {
  const res = await api.dete(`/api/workout/${id}`)
  return res.data;
}

 

