const API_BASE_URL = "http://localhost:3001/api";

export async function getEtudiants() {
  const res = await fetch(`${API_BASE_URL}/etudiants`);
  if (!res.ok) throw new Error("Erreur lors du chargement des étudiants");
  return res.json();
}

export async function getRoles() {
  const res = await fetch(`${API_BASE_URL}/roles`);
  if (!res.ok) throw new Error("Erreur lors du chargement des rôles");
  return res.json();
}

export async function createEtudiant(data: any) {
  const res = await fetch(`${API_BASE_URL}/etudiants`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erreur lors de la création");
  return res.json();
}

export async function updateEtudiant(id: number, data: any) {
  const res = await fetch(`${API_BASE_URL}/etudiants/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erreur lors de la mise à jour");
  return res.json();
}

export async function deleteEtudiant(id: number) {
  const res = await fetch(`${API_BASE_URL}/etudiants/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Erreur lors de la suppression");
  return res.json();
}
