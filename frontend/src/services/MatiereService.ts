import axios from "axios";

const API_BASE_URL = "http://localhost:3001/api";

// Récupérer toutes les matières
export async function getMatieres() {
  try {
    const res = await axios.get(`${API_BASE_URL}/matieres`);
    return res.data;
  } catch (err) {
    console.error(err);
    throw new Error("Erreur lors du chargement des matières");
  }
}

// Créer une matière
export async function createMatiere(data: any) {
  try {
    const res = await axios.post(`${API_BASE_URL}/matieres`, data);
    return res.data;
  } catch (err) {
    console.error(err);
    throw new Error("Erreur lors de la création de la matière");
  }
}

// Mettre à jour une matière
export async function updateMatiere(id: number, data: any) {
  try {
    const res = await axios.put(`${API_BASE_URL}/matieres/${id}`, data);
    return res.data;
  } catch (err) {
    console.error(err);
    throw new Error("Erreur lors de la mise à jour de la matière");
  }
}

// Supprimer une matière
export async function deleteMatiere(id: number) {
  try {
    const res = await axios.delete(`${API_BASE_URL}/matieres/${id}`);
    return res.data;
  } catch (err) {
    console.error(err);
    throw new Error("Erreur lors de la suppression de la matière");
  }
}
