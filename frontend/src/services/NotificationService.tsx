// src/services/NotificationService.ts
import axios from "axios";

const API_BASE_URL = "http://localhost:3001/api";

export async function sendNotificationsSelected(data: {
  etudiants: number[];
  objet: string;
  description: string;
}) {
  try {
    const res = await axios.post(
      `${API_BASE_URL}/notifications/send-selected`,
      data
    );
    return res.data;
  } catch (err) {
    console.error("Erreur envoi notifications :", err);
    throw err;
  }
}
