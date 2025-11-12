import React from "react";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  FileText,
  Bell,
  ClipboardList,
  BarChart3,
  Settings,
  LogOut,
  X,
  ChevronRight,
  Menu,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface NavBarProps {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  activeMenu: string;
  setActiveMenu: React.Dispatch<React.SetStateAction<string>>;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
  badge?: number;
}

const NavBar: React.FC<NavBarProps> = ({
  sidebarOpen,
  setSidebarOpen,
  activeMenu,
  setActiveMenu,
}) => {
  const navigate = useNavigate();
  // Récupération des infos depuis localStorage
  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = userData.nom || "Utilisateur";
  const userEmail = userData.email || "email@example.com";

  const menuItems: MenuItem[] = [
    {
      id: "dashboard",
      label: "Tableau de Bord",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    { id: "students", label: "Étudiants", icon: Users, path: "/etudiants" },
    {
      id: "professors",
      label: "Professeurs",
      icon: GraduationCap,
      path: "/professeurs",
    },
    { id: "subjects", label: "Matières", icon: BookOpen, path: "/matieres" },
    { id: "parcours", label: "Parcours", icon: BookOpen, path: "/parcours" },
    {
      id: "presence",
      label: "Présences",
      icon: ClipboardList,
      path: "/presences",
    },
    { id: "absences", label: "Absences", icon: Calendar, path: "/absences" },
    {
      id: "justifications",
      label: "Justificatifs",
      icon: FileText,
      path: "/justificatifs",
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      path: "/notifications",
      badge: 12,
    },
    { id: "reports", label: "Rapports", icon: BarChart3, path: "/rapports" },
    {
      id: "settings",
      label: "Paramètres",
      icon: Settings,
      path: "/parametres",
    },
  ];

  const handleDeconnect = () => {
    window.location.href = "/login";
  };
  const handleMenuClick = (item: MenuItem) => {
    setActiveMenu(item.id);
    navigate(item.path);
  };

  return (
    <aside
      className={`${
        sidebarOpen ? "w-64" : "w-20"
      } bg-gradient-to-b from-indigo-900 via-indigo-800 to-indigo-900 text-white transition-all duration-300 ease-in-out flex flex-col shadow-2xl`}
    >
      {/* Header avec le bouton Menu */}
      <div className="p-4 flex items-center justify-between border-b border-indigo-700">
        <div className="flex items-center space-x-3">
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 bg-indigo-700 rounded-lg hover:bg-indigo-600 transition-colors"
            >
              <Menu className="w-5 h-5 text-white" />
            </button>
          )}
          {sidebarOpen && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-bold text-lg">PresenceApp</h1>
                <p className="text-xs text-indigo-300">Gestion & Suivi</p>
              </div>
            </div>
          )}
        </div>

        {sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 hover:bg-indigo-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Menu Items */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeMenu === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item)}
              className={`w-full flex items-center px-4 py-3 mb-1 transition-all duration-200 group relative ${
                isActive
                  ? "bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg"
                  : "hover:bg-indigo-700/50"
              }`}
            >
              <Icon
                className={`w-5 h-5 ${sidebarOpen ? "mr-3" : "mx-auto"} ${
                  isActive ? "scale-110" : ""
                } transition-transform`}
              />
              {sidebarOpen && (
                <>
                  <span className="flex-1 text-left font-medium">
                    {item.label}
                  </span>
                  {item.badge && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-4 h-4 ml-2" />}
                </>
              )}
              {!sidebarOpen && item.badge && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-indigo-700">
        {sidebarOpen ? (
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center font-bold shadow-lg">
              {userName
                .split(" ")
                .map((n: string) => n[0])
                .join("")}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">{userName}</p>
              <p className="text-xs text-indigo-300">{userEmail}</p>
            </div>
          </div>
        ) : (
          <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center font-bold shadow-lg mx-auto mb-3">
            {userName
              .split(" ")
              .map((n: string) => n[0])
              .join("")}
          </div>
        )}
        <button
          className={`w-full flex items-center ${
            sidebarOpen ? "justify-start px-3" : "justify-center"
          } py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors`}
          onClick={handleDeconnect}
        >
          <LogOut className="w-4 h-4" />
          {sidebarOpen && (
            <span className="ml-2 text-sm font-medium">Déconnexion</span>
          )}
        </button>
      </div>
    </aside>
  );
};

export default NavBar;
