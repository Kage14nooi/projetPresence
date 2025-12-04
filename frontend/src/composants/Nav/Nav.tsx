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
  Settings,
  LogOut,
  X,
  ChevronRight,
  Menu,
  Cpu,
  BarChart3,
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
  path?: string;
  badge?: number;
  children?: MenuItem[];
}

const NavBar: React.FC<NavBarProps> = ({
  sidebarOpen,
  setSidebarOpen,
  activeMenu,
  setActiveMenu,
}) => {
  const navigate = useNavigate();

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
    { id: "seance", label: "Séances", icon: BookOpen, path: "/seance" },
    {
      id: "presence",
      label: "Présences",
      icon: ClipboardList,
      path: "/presence",
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
    // { id: "reports", label: "Rapports", icon: BarChart3, path: "/rapports" },

    {
      id: "settings",
      label: "Paramètres",
      icon: Settings,
      children: [
        { id: "appareil", label: "Appareils", icon: Cpu, path: "/appareils" },
        { id: "matiere", label: "Matières", icon: BookOpen, path: "/matieres" },
        {
          id: "niveau",
          label: "Niveaux",
          icon: GraduationCap,
          path: "/niveau",
        },
        {
          id: "parcours",
          label: "Parcours",
          icon: BookOpen,
          path: "/parcours",
        },
        { id: "mention", label: "Mentions", icon: BookOpen, path: "/mention" },
        {
          id: "professeur",
          label: "Professeurs",
          icon: GraduationCap,
          path: "/professeurs",
        },
      ],
    },
  ];

  const handleDeconnect = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    window.location.href = "/login";
  };

  const handleMenuClick = (item: MenuItem) => {
    if (item.path) {
      navigate(item.path);
    }
    setActiveMenu(item.id);
  };

  return (
    <aside
      className={`${
        sidebarOpen ? "w-64" : "w-20"
      } bg-gradient-to-b from-indigo-900 via-indigo-800 to-indigo-900 text-white transition-all duration-300 flex flex-col shadow-2xl`}
    >
      {/* Header */}
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
          const hasChildren = item.children && item.children.length > 0;

          return (
            <div key={item.id}>
              {/* Menu parent */}
              <button
                onClick={() => handleMenuClick(item)}
                className={`w-full flex items-center px-4 py-3 mb-1 transition-all duration-200 group relative ${
                  isActive
                    ? "bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg"
                    : "hover:bg-indigo-700/50"
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    sidebarOpen ? "mr-3" : "mx-auto"
                  } transition-transform`}
                />
                {sidebarOpen && (
                  <>
                    <span className="flex-1 text-left font-medium">
                      {item.label}
                    </span>
                    {hasChildren && <ChevronRight className="w-4 h-4 ml-2" />}
                  </>
                )}
              </button>

              {/* Sous-menus */}
              {hasChildren && isActive && sidebarOpen && (
                <div className="ml-8 flex flex-col">
                  {item.children!.map((child) => {
                    const ChildIcon = child.icon;
                    const isChildActive = activeMenu === child.id;
                    return (
                      <button
                        key={child.id}
                        onClick={() => handleMenuClick(child)}
                        className={`w-full flex items-center px-4 py-2 mb-1 text-sm transition-all duration-200 ${
                          isChildActive
                            ? "bg-indigo-600 rounded-lg"
                            : "hover:bg-indigo-700/50"
                        }`}
                      >
                        <ChildIcon className="w-4 h-4 mr-2" />
                        <span>{child.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
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
