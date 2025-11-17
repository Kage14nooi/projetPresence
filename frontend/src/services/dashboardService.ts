// src/services/dashboardService.ts

import axios from "axios";

export interface Stats {
  totalStudents: number;
  presencesToday: number;
  absentsToday: number;
  attendanceRate: number;
}

export interface Activity {
  id: number;
  student: string;
  action: string;
  subject: string;
  time: string;
}

export interface Alert {
  id: number;
  type: "warning" | "info";
  message: string;
  time: string;
}

export interface DashboardResponse {
  stats: Stats;
  recentActivities: Activity[];
  alerts: Alert[];
}

const API_URL = "http://localhost:3001/api/dashboard";

class DashboardService {
  async getDashboard(): Promise<DashboardResponse> {
    const response = await axios.get(API_URL);
    return response.data; // ⚠️ Doit contenir { stats, recentActivities, alerts }
  }
}

export default new DashboardService();
