import React, { useEffect, useState } from "react";
import { sendNotificationsSelected } from "../services/NotificationService";
import { getSeances, getSeanceAbsences } from "../services/SeanceService";
import {
  Bell,
  CheckCircle,
  XCircle,
  Users,
  Calendar,
  Clock,
  Mail,
  FileText,
  Info,
  Loader,
  Send,
  X,
} from "lucide-react";

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
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterDate, setFilterDate] = useState(""); // filtre par date

  // Récupération des séances
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

  // Filtrer les séances par date
  const filteredSeances = seances.filter((s) =>
    filterDate ? s.date_seance === filterDate : true
  );

  // Récupération des absents
  useEffect(() => {
    if (!selectedSeance) {
      setAbsents([]);
      setSelectedEtudiants([]);
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

  const toggleSelectAll = () => {
    if (selectedEtudiants.length === absents.length) {
      setSelectedEtudiants([]);
    } else {
      setSelectedEtudiants(absents.map((e) => e.etudiant_id));
    }
  };

  const handleOpenModal = () => {
    if (!selectedSeance) return;
    const seance = seances.find((s) => s.seance_id === selectedSeance);
    if (seance) {
      setDescription(
        `Vous êtes absent(e) à la séance de ${seance.matiere.matiere_nom} le ${seance.date_seance} de ${seance.heure_debut} à ${seance.heure_fin}. Veuillez justifier votre absence.`
      );
    }
    setIsModalOpen(true);
  };

  const handleSendNotifications = async () => {
    if (selectedEtudiants.length === 0) {
      setToastType("error");
      setToastMessage("Veuillez sélectionner au moins un étudiant !");
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    setIsLoading(true);
    try {
      await sendNotificationsSelected({
        etudiants: selectedEtudiants,
        objet,
        description,
      });
      setToastType("success");
      setToastMessage(
        `${selectedEtudiants.length} notification(s) envoyée(s) avec succès !`
      );
      setSelectedEtudiants([]);
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      setToastType("error");
      setToastMessage("Erreur lors de l'envoi des notifications !");
    } finally {
      setIsLoading(false);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-b from-blue-50 to-gray-100 min-h-screen">
      {/* Toast */}
      {toastMessage && (
        <div
          className={`fixed top-6 right-6 px-5 py-3 rounded-lg shadow-lg flex items-center gap-3 text-white transition-all z-50 ${
            toastType === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {toastType === "success" ? (
            <CheckCircle className="w-6 h-6" />
          ) : (
            <XCircle className="w-6 h-6" />
          )}
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
              <Bell className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Notifications d'Absence
              </h1>
              <p className="text-gray-500 mt-1">
                Gérez et envoyez des notifications aux étudiants absents
              </p>
            </div>
          </div>
          {selectedEtudiants.length > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-xl border border-blue-200">
              <Users className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-700">
                {selectedEtudiants.length} sélectionné(s)
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Séance */}
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-lg border border-gray-100 p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-bold text-gray-900">Séances</h2>
            </div>

            {/* Filtre par date */}
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            />

            {/* Liste des séances prenant toute la hauteur */}
            <div className="flex-1 overflow-y-auto space-y-3">
              {filteredSeances.map((s) => (
                <button
                  key={s.seance_id}
                  onClick={() => setSelectedSeance(s.seance_id)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                    selectedSeance === s.seance_id
                      ? "border-purple-500 bg-purple-50 shadow-md"
                      : "border-gray-200 hover:border-purple-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="font-semibold text-gray-900 mb-1">
                    {s.matiere.matiere_nom}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    {s.date_seance}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <Clock className="w-4 h-4" />
                    {s.heure_debut} - {s.heure_fin}
                  </div>
                </button>
              ))}
            </div>
          </div>
          {/* Liste des absents */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 p-6 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-orange-600" />
                <h2 className="text-xl font-bold text-gray-900">
                  Étudiants Absents
                </h2>
              </div>
              <button
                onClick={handleOpenModal}
                disabled={selectedEtudiants.length === 0} // <-- désactivé si aucun étudiant
                className={`px-6 py-2 text-white font-semibold rounded-xl shadow-md transition-all ${
                  selectedEtudiants.length === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-700"
                }`}
              >
                Rédiger Notification
              </button>
            </div>

            {absents.length > 0 ? (
              <>
                <div className="overflow-hidden rounded-xl border border-gray-200 mb-4">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <tr>
                        <th className="p-4">
                          <input
                            type="checkbox"
                            checked={
                              selectedEtudiants.length === absents.length
                            }
                            onChange={toggleSelectAll}
                            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                        </th>
                        <th className="p-4 text-left text-sm font-semibold text-gray-700">
                          Matricule
                        </th>
                        <th className="p-4 text-left text-sm font-semibold text-gray-700">
                          Nom
                        </th>
                        <th className="p-4 text-left text-sm font-semibold text-gray-700">
                          Prénom
                        </th>
                        <th className="p-4 text-left text-sm font-semibold text-gray-700">
                          Email
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {absents.map((e) => (
                        <tr
                          key={e.etudiant_id}
                          className={`transition-colors hover:bg-blue-50 ${
                            selectedEtudiants.includes(e.etudiant_id)
                              ? "bg-blue-50"
                              : ""
                          }`}
                        >
                          <td className="p-4">
                            <input
                              type="checkbox"
                              checked={selectedEtudiants.includes(
                                e.etudiant_id
                              )}
                              onChange={() => toggleSelect(e.etudiant_id)}
                              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                            />
                          </td>
                          <td className="p-4 font-mono text-sm font-semibold text-gray-900">
                            {e.etudiant_matricule}
                          </td>
                          <td className="p-4 font-medium text-gray-900">
                            {e.etudiant_nom}
                          </td>
                          <td className="p-4 text-gray-700">
                            {e.etudiant_prenom}
                          </td>
                          <td className="p-4 flex items-center gap-2 text-gray-600">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">{e.etudiant_mail}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Bouton Rédiger Notification ici */}
                {selectedSeance && ""}
              </>
            ) : selectedSeance ? (
              <p className="text-center text-gray-500 mt-4">
                Aucun étudiant absent pour cette séance.
              </p>
            ) : (
              <p className="text-center text-gray-500 mt-4">
                Veuillez sélectionner une séance pour voir les absents.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative transform transition-all animate-scale-in">
            {/* Header avec gradient */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-t-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Bell className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      Envoyer une Notification
                    </h2>
                    <p className="text-purple-100 text-sm mt-0.5">
                      Informer les étudiants sélectionnés
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-all"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              {/* Objet */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                  <Mail className="w-4 h-4 text-purple-600" />
                  Objet de la notification
                </label>
                <input
                  type="text"
                  value={objet}
                  onChange={(e) => setObjet(e.target.value)}
                  placeholder="Ex: Absence non justifiée"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white transition-all text-gray-900 placeholder:text-gray-400"
                />
              </div>

              {/* Description */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                  <FileText className="w-4 h-4 text-purple-600" />
                  Message détaillé
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  placeholder="Décrivez la raison de la notification..."
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white transition-all resize-none text-gray-900 placeholder:text-gray-400"
                />
                <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    Soyez clair et professionnel
                  </span>
                  <span>{description.length} caractères</span>
                </div>
              </div>

              {/* Info Box */}
              <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <Loader className="w-4 h-4 animate-spin" />
                <div>
                  <p className="text-sm font-semibold text-blue-900 mb-1">
                    Notification par email
                  </p>
                  <p className="text-xs text-blue-700">
                    Cette notification sera envoyée par email aux{" "}
                    {selectedEtudiants?.length || 0} étudiant(s) sélectionné(s).
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 pb-6 flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 rounded-xl border-2 border-gray-200 text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-300 transition-all"
              >
                Annuler
              </button>
              <button
                onClick={handleSendNotifications}
                disabled={isLoading || !objet.trim() || !description.trim()}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-purple-700 hover:to-blue-700 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:from-gray-400 disabled:to-gray-500"
              >
                {isLoading ? (
                  <>
                    <Send className="w-4 h-4" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Envoyer maintenant
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AbsenceNotification;
