import api from "./api";

export const getAdmins = async () => {
  const res = await api.get("/admins");
  return res.data;
};
