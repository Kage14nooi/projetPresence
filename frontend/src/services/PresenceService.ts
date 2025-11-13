// src/services/PresenceService.ts
import type { Seance, Presence } from "../types/types";

const API_BASE = "http://localhost:3001/api";

export interface FichePresence {
  seance: Seance;
  presences: Presence[];
}

export const presenceService = {
  // 🔹 Récupérer toutes les séances
  async getAllSeances(): Promise<Seance[]> {
    const res = await fetch(`${API_BASE}/sceances`);
    if (!res.ok) throw new Error("Impossible de récupérer les séances");
    const data = await res.json();
    return Array.isArray(data) ? data : [data];
  },

  // 🔹 Récupérer la fiche de présence pour une séance
  async getFichePresence(seanceId: number): Promise<FichePresence> {
    const res = await fetch(`${API_BASE}/sceances/presence/${seanceId}`);
    if (!res.ok)
      throw new Error("Impossible de récupérer la fiche de présence");

    const data: any[] = await res.json(); // JSON retourné par l'API

    // 🔹 Transformer le JSON en tableau de Presence
    const presences: Presence[] = data.map((p) => ({
      presence_id: p.presence_id,
      etudiant_id: p.etudiant_id,
      seance_id: p.seance_id,
      heure_entree: p.heure_entree,
      heure_sortie: p.heure_sortie,
      status: p.status,
      etudiant: p.etudiant,
      seance: p.seance, // facultatif pour TypeScript
    }));

    // 🔹 Extraire les informations de la séance depuis le premier élément
    const seance: Seance =
      presences.length > 0 && presences[0].seance
        ? {
            seance_id: presences[0].seance_id,
            matiere_id: presences[0].seance.matiere_id ?? 0,
            date_seance: presences[0].seance.date_seance,
            heure_debut: presences[0].seance.heure_debut,
            heure_fin: presences[0].seance.heure_fin,
            is_active: true,
          }
        : {
            seance_id: seanceId,
            matiere_id: 0,
            date_seance: "",
            heure_debut: "",
            heure_fin: "",
            is_active: false,
          };

    return { seance, presences };
  },

  // 🔹 Filtrer les présences par statut
  filterPresences(
    presences: Presence[],
    status: "P" | "A" | "ALL"
  ): Presence[] {
    if (status === "ALL") return presences;
    return presences.filter((p) => p.status === status);
  },

  // 🔹 Exporter la fiche au format Excel
  async exportExcel(seanceId: number) {
    const res = await fetch(
      `${API_BASE}/presences/sceances/export/${seanceId}`
    );
    if (!res.ok) throw new Error("Impossible d'exporter la fiche");
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `fiche_presence_seance_${seanceId}.xlsx`;
    link.click();
    window.URL.revokeObjectURL(url);
  },
  // 🔹 Récupérer le fichier Excel en blob pour prévisualisation
  async exportExcelPreview(seanceId: number): Promise<Blob> {
    const res = await fetch(
      `${API_BASE}/presences/sceances/export/${seanceId}`
    );
    if (!res.ok)
      throw new Error("Impossible d'exporter la fiche pour prévisualisation");
    return res.blob();
  },

  // 🔹 Générer automatiquement les absences pour une séance
  async generateAbsences(seanceId: number, date: string) {
    const res = await fetch(`${API_BASE}/presence/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ seance_id: seanceId, date }),
    });
    if (!res.ok) throw new Error("Impossible de générer les absences");
    return res.json();
  },
};
