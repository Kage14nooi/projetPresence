// src/services/AppareilService.ts
import axios from "axios";

// Définir l'URL de base pour les appareils
const API_URL = "http://localhost:3001/api/appareils"; // à adapter selon ton backend

// Récupérer tous les appareils
export interface Appareil {
  appareil_id: number;
  appareil_nom: string;
  appareil_serie: string;
}

export const getAppareils = async (): Promise<Appareil[]> => {
  try {
    const response = await axios.get(API_URL); // adapter ton endpoint
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Erreur lors de la récupération des appareils :", error);
    return [];
  }
};
// Récupérer un appareil par ID
export const getAppareilById = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'appareil ${id}:`, error);
    throw error;
  }
};

// Créer un nouvel appareil
export const createAppareil = async (data: any) => {
  try {
    const response = await axios.post(API_URL, data);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la création de l'appareil:", error);
    throw error;
  }
};

// Mettre à jour un appareil existant
export const updateAppareil = async (id: number, data: any) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour de l'appareil ${id}:`, error);
    throw error;
  }
};

// Supprimer un appareil
export const deleteAppareil = async (id: number) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la suppression de l'appareil ${id}:`, error);
    throw error;
  }
};
