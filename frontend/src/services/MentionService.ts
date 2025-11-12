import axios from "axios";

const API_URL = "http://localhost:3001/api/mentions";

export const getMention = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const createMention = async (data: any) => {
  const res = await axios.post(API_URL, data);
  return res.data;
};

export const updateMention = async (id: number, data: any) => {
  const res = await axios.put(`${API_URL}/${id}`, data);
  return res.data;
};

export const deleteMention = async (id: number) => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
};
