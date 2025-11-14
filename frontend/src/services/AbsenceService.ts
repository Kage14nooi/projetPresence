import axios from "axios";

const API_URL = "http://localhost:3001/api/absences";

export const getAbsences = async () => {
  try {
    const res = await axios.get(API_URL);
    return res.data;
  } catch (error) {
    console.error("Erreur récupération absences:", error);
    return [];
  }
};

export const deleteAbsence = async (absence_id: number) => {
  try {
    await axios.delete(`${API_URL}/${absence_id}`);
  } catch (error) {
    console.error("Erreur suppression absence:", error);
  }
};

// Exemple si tu veux ajouter un update
export const updateAbsence = async (absence: any) => {
  try {
    const res = await axios.put(`${API_URL}/${absence.absence_id}`, absence);
    return res.data;
  } catch (error) {
    console.error("Erreur mise à jour absence:", error);
    return null;
  }
};
