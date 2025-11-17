import React, { useEffect, useState } from "react";
import {
  Menu,
  Bell,
  TrendingUp,
  TrendingDown,
  Clock,
  AlertTriangle,
  BarChart3,
  UserCheck,
  UserX,
} from "lucide-react";
import DashboardService from "../../services/dashboardService";
import type { Alert, Activity } from "../../services/dashboardService";

const Dashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [now, setNow] = useState(new Date());

  const [stats, setStats] = useState([
    {
      id: 1,
      title: "Total Étudiants",
      value: "0",
      change: "+0%",
      trend: "up",
      icon: UserCheck,
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      id: 2,
      title: "Présents Aujourd'hui",
      value: "0",
      change: "+0%",
      trend: "up",
      icon: UserCheck,
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      id: 3,
      title: "Absents",
      value: "0",
      change: "+0%",
      trend: "down",
      icon: UserX,
      bgColor: "bg-red-50",
      textColor: "text-red-600",
    },
    {
      id: 4,
      title: "Taux de Présence",
      value: "0%",
      change: "+0%",
      trend: "up",
      icon: BarChart3,
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
  ]);

  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  // Timer pour l'heure
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch dashboard depuis le backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await DashboardService.getDashboard();

        setStats([
          { ...stats[0], value: data.stats.totalStudents.toString() },
          { ...stats[1], value: data.stats.presencesToday.toString() },
          { ...stats[2], value: data.stats.absentsToday.toString() },
          { ...stats[3], value: data.stats.attendanceRate + "%" },
        ]);

        setRecentActivities(data.recentActivities);
        setAlerts(data.alerts);
      } catch (error) {
        console.error("Erreur fetch dashboard :", error);
      }
    };

    fetchData();
  }, []);

  const dateStr = now.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const timeStr = now.toLocaleTimeString("fr-FR");

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Barre supérieure */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu className="w-6 h-6 text-gray-600" />
              </button>
            )}
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Tableau de Bord
              </h2>
              <p className="text-sm text-gray-500">
                Bienvenue sur votre espace de gestion
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-700">{dateStr}</p>
              <p className="text-xs text-gray-500">{timeStr}</p>
            </div>
            <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Bell className="w-6 h-6 text-gray-600" />
              <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {alerts.length}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="flex-1 overflow-y-auto p-6">
        {/* 📈 Cartes de statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown;
            return (
              <div
                key={stat.id}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`${stat.bgColor} p-3 rounded-xl`}>
                    <Icon className={`w-6 h-6 ${stat.textColor}`} />
                  </div>
                  <div
                    className={`flex items-center space-x-1 ${
                      stat.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    <TrendIcon className="w-4 h-4" />
                    <span className="text-sm font-bold">{stat.change}</span>
                  </div>
                </div>
                <h3 className="text-gray-500 text-sm font-medium mb-1">
                  {stat.title}
                </h3>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* 🕓 Activités récentes + 🚨 Alertes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activités */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-indigo-600" />
                Activités Récentes
              </h3>
            </div>
            <div className="space-y-4">
              {recentActivities.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center p-4 bg-gray-50 rounded-xl"
                >
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <UserCheck className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{a.student}</p>
                    <p className="text-sm text-gray-600">
                      {a.action} - {a.subject}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500">{a.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Alertes */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 flex items-center mb-4">
              <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
              Alertes
            </h3>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-xl border-l-4 ${
                    alert.type === "warning"
                      ? "bg-orange-50 border-orange-500"
                      : "bg-blue-50 border-blue-500"
                  }`}
                >
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    {alert.message}
                  </p>
                  <p className="text-xs text-gray-500">{alert.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
