import api from "../api/axios"

export const getExercises = async () => {
  const res = await api.get(`/api/exercise`);
  return res.data;
};

export const createExercise = async (name) => {
  const res = await api.post(`/api/exercise`, { name } )
  return res.data;
};

export const getExerciseDetails = async (id) => {
  const res = await api.get(`/api/exercise/${id}`);
  return res.data;
}

export const getExerciseStats = async () => {
  const res = await api.get(`/api/exercise/stats`);
  return res.data;
}

