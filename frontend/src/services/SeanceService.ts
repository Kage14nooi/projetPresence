import axios from "axios";

const API_URL = "http://localhost:3001/api/sceances"; // adapte l'URL à ton backend

// 📋 Récupérer toutes les séances
export const getSeances = async () => {
  try {
    const res = await axios.get(API_URL);
    return res.data;
  } catch (err: any) {
    console.error("Erreur getSeances:", err);
    throw err;
  }
};

// 📋 Récupérer une séance par ID
export const getSeanceById = async (id: number) => {
  try {
    const res = await axios.get(`${API_URL}/${id}`);
    return res.data;
  } catch (err: any) {
    console.error("Erreur getSeanceById:", err);
    throw err;
  }
};

// ➕ Créer une séance
export const createSeance = async (data: any) => {
  try {
    const res = await axios.post(API_URL, data);
    return res.data;
  } catch (err: any) {
    console.error("Erreur createSeance:", err);
    throw err;
  }
};

// ✏️ Mettre à jour une séance
export const updateSeance = async (id: number, data: any) => {
  try {
    const res = await axios.put(`${API_URL}/${id}`, data);
    return res.data;
  } catch (err: any) {
    console.error("Erreur updateSeance:", err);
    throw err;
  }
};

// 🗑️ Supprimer une séance
export const deleteSeance = async (id: number) => {
  try {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
  } catch (err: any) {
    console.error("Erreur deleteSeance:", err);
    throw err;
  }
};

// 🔀 Activer / désactiver une séance
export const toggleSeanceActive = async (id: number) => {
  try {
    const res = await axios.patch(`${API_URL}/${id}/toggle`);
    return res.data;
  } catch (err: any) {
    console.error("Erreur toggleSeance:", err);
    throw err;
  }
};
export const getSeanceAbsences = async (seanceId: number) => {
  try {
    const response = await axios.get(`${API_URL}/absences/${seanceId}`);
    return response.data; // renvoie la liste des étudiants absents
  } catch (err) {
    console.error("❌ Erreur lors de la récupération des absents :", err);
    return [];
  }
};

// Récupérer toutes les absences
export const getAbsences = async () => {
  try {
    const response = await axios.get("http://localhost:3001/api/absences");
    return response.data; // renvoie la liste des absences
  } catch (err) {
    console.error("❌ Erreur lors de la récupération des absences :", err);
    return [];
  }
};
