import axios from "axios";

const API_BASE_URL = "http://localhost:3001/api";

// Récupérer tous les professeurs
export async function getProfesseurs() {
  try {
    const res = await axios.get(`${API_BASE_URL}/professeurs`);
    return res.data;
  } catch (err) {
    console.error(err);
    throw new Error("Erreur lors du chargement des professeurs");
  }
}

// Créer un professeur
export async function createProfesseur(data: any) {
  try {
    const res = await axios.post(`${API_BASE_URL}/professeurs`, data);
    return res.data;
  } catch (err) {
    console.error(err);
    throw new Error("Erreur lors de la création");
  }
}

// Mettre à jour un professeur
export async function updateProfesseur(id: number, data: any) {
  try {
    const res = await axios.put(`${API_BASE_URL}/professeurs/${id}`, data);
    return res.data;
  } catch (err) {
    console.error(err);
    throw new Error("Erreur lors de la mise à jour");
  }
}

// Supprimer un professeur
export async function deleteProfesseur(id: number) {
  try {
    const res = await axios.delete(`${API_BASE_URL}/professeurs/${id}`);
    return res.data;
  } catch (err) {
    console.error(err);
    throw new Error("Erreur lors de la suppression");
  }
}
