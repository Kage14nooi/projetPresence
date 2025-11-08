import axios from "axios";

export const getRoles = async () => {
  try {
    const res = await axios.get("http://localhost:3001/api/roles"); // ton endpoint roles
    return res.data;
  } catch (error) {
    console.error("Erreur récupération roles:", error);
    return [];
  }
};
