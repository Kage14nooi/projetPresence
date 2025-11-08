import axios from "axios";

const API_BASE_URL = "http://localhost:3001/api";

// Récupérer tous les étudiants
export async function getEtudiants() {
  try {
    const res = await axios.get(`${API_BASE_URL}/etudiants`);
    return res.data;
  } catch (err) {
    console.error(err);
    throw new Error("Erreur lors du chargement des étudiants");
  }
}

// Récupérer tous les rôles
export async function getRoles() {
  try {
    const res = await axios.get(`${API_BASE_URL}/roles`);
    return res.data;
  } catch (err) {
    console.error(err);
    throw new Error("Erreur lors du chargement des rôles");
  }
}

// Créer un étudiant
export async function createEtudiant(data: any) {
  try {
    const res = await axios.post(`${API_BASE_URL}/etudiants`, data);
    return res.data;
  } catch (err) {
    console.error(err);
    throw new Error("Erreur lors de la création");
  }
}

// Mettre à jour un étudiant
export async function updateEtudiant(id: number, data: any) {
  try {
    const res = await axios.put(`${API_BASE_URL}/etudiants/${id}`, data);
    return res.data;
  } catch (err) {
    console.error(err);
    throw new Error("Erreur lors de la mise à jour");
  }
}

// Supprimer un étudiant
export async function deleteEtudiant(id: number) {
  try {
    const res = await axios.delete(`${API_BASE_URL}/etudiants/${id}`);
    return res.data;
  } catch (err) {
    console.error(err);
    throw new Error("Erreur lors de la suppression");
  }
}
