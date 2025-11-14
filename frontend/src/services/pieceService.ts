import axios from "axios";

const API_BASE_URL = "http://localhost:3001/api/pieces";

// Récupérer toutes les pièces justificatives
export async function getPieces() {
  try {
    const res = await axios.get(API_BASE_URL);
    return res.data;
  } catch (err) {
    console.error(err);
    throw new Error("Erreur lors du chargement des pièces justificatives");
  }
}

// Créer une pièce justificative (support fichier)
export async function createPiece(data: any) {
  try {
    const formData = new FormData();
    formData.append("absence_id", data.absence_id);
    formData.append("motif", data.motif);
    if (data.pieceJust_description)
      formData.append("pieceJust_description", data.pieceJust_description);
    if (data.pieceJust_file) formData.append("file", data.pieceJust_file);

    const res = await axios.post(API_BASE_URL, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err) {
    console.error(err);
    throw new Error("Erreur lors de la création de la pièce justificative");
  }
}

// Mettre à jour une pièce
// Mettre à jour une pièce
export async function updatePiece(id: number, data: any) {
  try {
    const formData = new FormData();
    formData.append("absence_id", data.absence_id.toString());
    formData.append("motif", data.motif);
    if (data.pieceJust_description)
      formData.append("pieceJust_description", data.pieceJust_description);
    if (data.pieceJust_file) formData.append("file", data.pieceJust_file); // <- champ 'file'

    const res = await axios.put(`${API_BASE_URL}/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err) {
    console.error(err);
    throw new Error("Erreur lors de la mise à jour de la pièce justificative");
  }
}

// Supprimer une pièce
export async function deletePiece(id: number) {
  try {
    const res = await axios.delete(`${API_BASE_URL}/${id}`);
    return res.data;
  } catch (err) {
    console.error(err);
    throw new Error("Erreur lors de la suppression de la pièce justificative");
  }
}
