import React, { useEffect, useState } from "react";
import { sendNotificationsSelected } from "../services/NotificationService";
import { getSeances, getSeanceAbsences } from "../services/SeanceService";

interface Etudiant {
  etudiant_id: number;
  etudiant_matricule: string;
  etudiant_nom: string;
  etudiant_prenom: string;
  etudiant_mail: string;
}

interface Seance {
  seance_id: number;
  date_seance: string;
  heure_debut: string;
  heure_fin: string;
  matiere: { matiere_nom: string };
}

const AbsenceNotification: React.FC = () => {
  const [seances, setSeances] = useState<Seance[]>([]);
  const [selectedSeance, setSelectedSeance] = useState<number | null>(null);
  const [absents, setAbsents] = useState<Etudiant[]>([]);
  const [selectedEtudiants, setSelectedEtudiants] = useState<number[]>([]);
  const [objet, setObjet] = useState("Absence non justifiée");
  const [description, setDescription] = useState(
    "Vous êtes absent(e) à la séance. Veuillez justifier votre absence."
  );

  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchSeances = async () => {
      try {
        const data = await getSeances();
        setSeances(data);
      } catch (err) {
        console.error("Erreur récupération séances:", err);
      }
    };
    fetchSeances();
  }, []);

  useEffect(() => {
    if (!selectedSeance) {
      setAbsents([]);
      return;
    }
    const fetchAbsents = async () => {
      try {
        const data = await getSeanceAbsences(selectedSeance);
        setAbsents(data);
        setSelectedEtudiants([]);
      } catch (err) {
        console.error("Erreur récupération absents:", err);
      }
    };
    fetchAbsents();
  }, [selectedSeance]);

  const toggleSelect = (id: number) => {
    setSelectedEtudiants((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSendNotifications = async () => {
    if (selectedEtudiants.length === 0) {
      alert("Veuillez sélectionner au moins un étudiant !");
      return;
    }

    setIsLoading(true);
    try {
      await sendNotificationsSelected({
        etudiants: selectedEtudiants,
        objet,
        description,
      });
      setToastMessage("Notifications envoyées avec succès !");
      setSelectedEtudiants([]);
    } catch (err) {
      console.error(err);
      setToastMessage("Erreur lors de l'envoi des notifications !");
    } finally {
      setIsLoading(false);
      setTimeout(() => setToastMessage(null), 3000); // le toast disparaît après 3s
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-md relative">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Notifications des absents
        </h1>

        {/* Toast */}
        {toastMessage && (
          <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
            {toastMessage}
          </div>
        )}

        {/* Bouton envoyer */}
        {absents.length > 0 && (
          <div className="mb-4 flex justify-end">
            <button
              onClick={handleSendNotifications}
              disabled={isLoading}
              className={`px-4 py-2 rounded text-white ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } transition-colors`}
            >
              {isLoading ? "Envoi..." : "Envoyer les notifications"}
            </button>
          </div>
        )}

        {/* Sélection de la séance */}
        <div className="mb-6">
          <label className="block mb-2 font-medium text-gray-700">
            Sélectionner une séance :
          </label>
          <select
            className="border border-gray-300 px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedSeance || ""}
            onChange={(e) => setSelectedSeance(parseInt(e.target.value))}
          >
            <option value="">-- Sélectionner --</option>
            {seances.map((s) => (
              <option key={s.seance_id} value={s.seance_id}>
                {s.matiere.matiere_nom} - {s.date_seance} ({s.heure_debut} -{" "}
                {s.heure_fin})
              </option>
            ))}
          </select>
        </div>

        {/* Liste des absents */}
        {absents.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">#</th>
                  <th className="p-2 border">Matricule</th>
                  <th className="p-2 border">Nom</th>
                  <th className="p-2 border">Prénom</th>
                  <th className="p-2 border">Email</th>
                </tr>
              </thead>
              <tbody>
                {absents.map((e, index) => (
                  <tr key={e.etudiant_id} className="border-t text-center">
                    <td className="p-2 border">
                      <input
                        type="checkbox"
                        checked={selectedEtudiants.includes(e.etudiant_id)}
                        onChange={() => toggleSelect(e.etudiant_id)}
                      />
                    </td>
                    <td className="p-2 border">{e.etudiant_matricule}</td>
                    <td className="p-2 border">{e.etudiant_nom}</td>
                    <td className="p-2 border">{e.etudiant_prenom}</td>
                    <td className="p-2 border">{e.etudiant_mail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {absents.length === 0 && selectedSeance && (
          <p className="text-center text-gray-500 mt-4">
            Aucun étudiant absent pour cette séance.
          </p>
        )}
      </div>
    </div>
  );
};

export default AbsenceNotification;
