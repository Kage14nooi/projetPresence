import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  AlertTriangle,
  Users,
  Clock,
  TrendingUp,
  Download,
  Eye,
} from "lucide-react";
import {
  getDashboardDataAvance,
  type DashboardDataAvance,
} from "../services/rapportService";

const COLORS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#3b82f6",
  "#8b5cf6",
];

interface AbsenceParJour {
  jour: string;
  absences: number;
}

const Dashboard = () => {
  const [data, setData] = useState<DashboardDataAvance | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<string>("current");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getDashboardDataAvance();
      setData(result);
      console.log("tsila test ", result);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Une erreur est survenue";
      setError(errorMessage);
      console.error("Erreur chargement dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">
            Chargement des statistiques...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full">
          <div className="text-center">
            <AlertTriangle className="mx-auto text-red-500 mb-4" size={48} />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Erreur de chargement
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={loadDashboardData}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const absencesParJourData: AbsenceParJour[] = Object.entries(
    data.absencesParJour || {}
  ).map(([jour, total]) => ({
    jour,
    absences: total,
  }));

  const totalAbsences =
    data.top5Absents?.reduce((acc: number, a: any) => acc + a.total, 0) || 0;
  const totalRetards =
    data.topRetards?.reduce((acc: number, r: any) => acc + r.total, 0) || 0;

  // Transformation pour le PieChart
  const pieData = data.pourcentagesMatieres.map((item) => ({
    name: item.matiere_nom, // nom de la matière
    value: item.total_absences, // pourcentage d'absence en nombre
  }));

  console.log("PieData pour Recharts :", pieData);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                📊 Dashboard Statistiques
              </h1>
              <p className="text-gray-600">Suivi et analyse des absences</p>
            </div>
            {/* <div className="flex gap-3">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 border-2 border-indigo-200 rounded-lg focus:outline-none focus:border-indigo-500"
              >
                <option value="current">Période actuelle</option>
                <option value="semester1">Semestre 1</option>
                <option value="semester2">Semestre 2</option>
                <option value="annual">Annuelle</option>
              </select>
              <button
                onClick={() => window.print()}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
              >
                <Download size={18} />
                Exporter
              </button>
            </div> */}
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">
                  Taux de Présence
                </p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {data.presenceGlobale}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <TrendingUp className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">
                  Étudiants en Alerte
                </p>
                <p className="text-3xl font-bold text-red-600 mt-2">
                  {data.etudiantsAlerte?.total_etudiants_alerte || 0}
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <AlertTriangle className="text-red-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">
                  Total Retards
                </p>
                <p className="text-3xl font-bold text-orange-600 mt-2">
                  {totalRetards}
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <Clock className="text-orange-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">
                  Total Absences
                </p>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  {totalAbsences}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="text-blue-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Camembert - Absences par Matière */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              📈 Répartition des Absences par Matière
            </h2>
            {data.pourcentagesMatieres &&
            data.pourcentagesMatieres.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    // label={(entry: any) =>
                    //   `${entry.matiere_nom} (${entry.pourcentage})`
                    // }
                  >
                    {data.pourcentagesMatieres.map(
                      (entry: any, index: number) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      )
                    )}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-400">
                Aucune donnée disponible
              </div>
            )}
          </div>

          {/* Absences par Jour */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              📅 Absences par Jour de la Semaine
            </h2>
            {absencesParJourData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={absencesParJourData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="jour" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="absences"
                    fill="#3b82f6"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-400">
                Aucune donnée disponible
              </div>
            )}
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Heures Perdues par Niveau */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              ⏱️ Heures Perdues par Niveau/Mention
            </h2>
            {data.heuresPerdues && data.heuresPerdues.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.heuresPerdues} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="niveau" type="category" width={80} />
                  <Tooltip />
                  <Bar
                    dataKey="heures_perdues"
                    fill="#ef4444"
                    radius={[0, 8, 8, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-400">
                Aucune donnée disponible
              </div>
            )}
          </div>

          {/* Top 5 Étudiants Absents */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              🎯 Top 5 Étudiants les Plus Absents
            </h2>
            <div className="space-y-3">
              {data.top5Absents && data.top5Absents.length > 0 ? (
                data.top5Absents.map((item: any, index: number) => (
                  <div
                    key={item.etudiant_id || index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                          index === 0
                            ? "bg-red-500"
                            : index === 1
                            ? "bg-orange-500"
                            : "bg-gray-400"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">
                          {item.etudiant?.etudiant_prenom}{" "}
                          {item.etudiant?.etudiant_nom}
                        </p>
                        <p className="text-sm text-gray-500">
                          {item.etudiant?.etudiant_matricule}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-red-600">
                        {item.total}
                      </p>
                      <p className="text-xs text-gray-500">absences</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-400 py-8">
                  Aucune donnée disponible
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Alertes */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            ⚠️ Alertes - Étudiants à Risque (Seuil:{" "}
            {data.etudiantsAlerte?.seuil || 25}%)
          </h2>
          <div className="overflow-x-auto">
            {data.etudiantsAlerte?.etudiants &&
            data.etudiantsAlerte.etudiants.length > 0 ? (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Étudiant
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Niveau
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Mention
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Taux d'Absence
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Niveau d'Alerte
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.etudiantsAlerte.etudiants.map(
                    (item: any, index: number) => (
                      <tr
                        key={item.etudiant?.id || index}
                        className="border-t hover:bg-gray-50"
                      >
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-800">
                            {item.etudiant?.prenom} {item.etudiant?.nom}
                          </p>
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {item.etudiant?.niveau || "N/A"}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {item.etudiant?.mention || "N/A"}
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-bold text-red-600">
                            {item.statistiques?.taux_absence}%
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              item.alerte?.niveau === "CRITIQUE"
                                ? "bg-red-100 text-red-800"
                                : item.alerte?.niveau === "ÉLEVÉ"
                                ? "bg-orange-100 text-orange-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {item.alerte?.niveau}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() =>
                              (window.location.href = `/rapport/etudiant/${item.etudiant?.id}`)
                            }
                            className="group relative p-2 text-green-600 hover:text-white hover:bg-green-600 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                            title="Voir le détail"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            ) : (
              <div className="text-center text-gray-400 py-8">
                Aucun étudiant en alerte
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
