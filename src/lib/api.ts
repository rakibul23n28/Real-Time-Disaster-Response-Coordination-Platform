// API client for server communication
const API_BASE_URL = "http://localhost:5000/api/v1";
const TOKEN_KEY = "duryog-auth-token";
const USER_KEY = "duryog-user";

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface LoginResponse {
  user: { id: number; name: string; email: string; phone?: string; role: string; profile_image?: string };
  token: string;
}

interface RegisterResponse {
  user: { id: number; name: string; email: string; phone?: string; role: string; profile_image?: string };
  token: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: string;
  profile_image?: string;
  created_at?: string;
}

export interface UpdateUserInput {
  name: string;
  email: string;
  phone?: string;
}

export interface Incident {
  id: number;
  code: string;
  lat: number;
  lng: number;
  severity: "high" | "medium" | "low" | "critical" | "unassessed";
  status: string;
  location: string;
  disasterType: string;
  affectedPeople: number;
  activeVolunteers?: number;
}

export interface LandingStats {
  totalReports: number;
  verifiedIncidents: number;
  activeVolunteers: number;
  activeZones: number;
}

export interface Report {
  id: number;
  reporterId: number;
  disasterType: string;
  title: string;
  description: string;
  location: { name: string; district: string; lat: number; lng: number };
  affectedPeople: number;
  photos: string[];
  status: "pending" | "verified" | "rejected" | "in_progress" | "completed";
  severity: "high" | "medium" | "low";
  reporterName: string;
  createdAt: string;
}

export interface CreateReportInput {
  title: string;
  description: string;
  disasterType: string;
  location: { name: string; district: string; lat: number; lng: number };
  affectedPeople: number;
  files?: File[];
}

// Transform backend snake_case data to frontend camelCase format
function transformReportFromBackend(data: any): Report {
  return {
    id: data.id,
    reporterId: data.reporter_id,
    disasterType: data.disaster_type,
    title: data.title,
    description: data.description,
    location: {
      name: data.location_name || "",
      district: data.district || "",
      lat: data.latitude,
      lng: data.longitude,
    },
    affectedPeople: data.affected_people || 0,
    photos: Array.isArray(data.images) 
      ? data.images.map((img: any) => typeof img === 'string' ? img : img.image_url)
      : (data.photos || []),
    status: data.status || "pending",
    severity: data.severity || "low",
    reporterName: data.reporter_name || "",
    createdAt: data.created_at,
  };
}

class ApiClient {
  private getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  private setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  private clearToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = { "Content-Type": "application/json" };
    const token = this.getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      const message = error.message || `HTTP ${response.status}`;
      throw new Error(message);
    }
    return response.json();
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await this.handleResponse<ApiResponse<LoginResponse>>(response);
    if (data.data?.token) {
      this.setToken(data.data.token);
    }
    return data.data;
  }

  async register(input: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role: string;
  }): Promise<RegisterResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const data = await this.handleResponse<ApiResponse<RegisterResponse>>(response);
    if (data.data?.token) {
      this.setToken(data.data.token);
    }
    return data.data;
  }

  async getMe(): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: "GET",
      headers: this.getHeaders(),
    });
    const data = await this.handleResponse<ApiResponse<User>>(response);
    return data.data;
  }

  async updateMe(input: UpdateUserInput): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: "PATCH",
      headers: this.getHeaders(),
      body: JSON.stringify(input),
    });
    const data = await this.handleResponse<ApiResponse<User>>(response);
    return data.data;
  }

  async logout(): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: this.getHeaders(),
      });
    } finally {
      this.clearToken();
      localStorage.removeItem(USER_KEY);
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  clearAuth(): void {
    this.clearToken();
    localStorage.removeItem(USER_KEY);
  }

  // Report endpoints
  async getReports(filters?: { status?: string; reporterId?: number }): Promise<Report[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    if (filters?.reporterId) params.append("reporterId", String(filters.reporterId));

    const queryString = params.toString();
    const url = `${API_BASE_URL}/reports${queryString ? "?" + queryString : ""}`;
    const response = await fetch(url, {
      method: "GET",
      headers: this.getHeaders(),
    });
    const data = await this.handleResponse<ApiResponse<any[]>>(response);
    return data.data.map(transformReportFromBackend);
  }

  async getIncidents(): Promise<Incident[]> {
    const response = await fetch(`${API_BASE_URL}/map/incidents`, {
      method: "GET",
      headers: this.getHeaders(),
    });
    const data = await this.handleResponse<ApiResponse<any[]>>(response);
    return data.data.map((incident) => ({
      id: incident.id,
      code: incident.code,
      lat: Number(incident.latitude),
      lng: Number(incident.longitude),
      severity: incident.severity || "unassessed",
      status: incident.status,
      location: incident.locationName || "",
      disasterType: incident.disasterType || "",
      affectedPeople: Number(incident.affected_people || 0),
      activeVolunteers: Number(incident.activeVolunteers || 0),
    }));
  }

  async getPublicIncidents(): Promise<Incident[]> {
    const response = await fetch(`${API_BASE_URL}/public/incidents`);
    const data = await this.handleResponse<ApiResponse<any[]>>(response);
    return data.data.map((incident) => ({
      id: Number(incident.id),
      code: incident.code,
      lat: Number(incident.latitude),
      lng: Number(incident.longitude),
      severity: incident.severity || "unassessed",
      status: incident.status,
      location: incident.locationName || "",
      disasterType: incident.disasterType || "",
      affectedPeople: Number(incident.affected_people || 0),
      activeVolunteers: Number(incident.activeVolunteers || 0),
    }));
  }

  async getPublicLandingData(): Promise<{ stats: LandingStats; incidents: Incident[] }> {
    const [summaryResponse, incidentsResponse] = await Promise.all([
      fetch(`${API_BASE_URL}/public/landing`),
      fetch(`${API_BASE_URL}/public/incidents`),
    ]);
    const summary = await this.handleResponse<ApiResponse<{ stats: LandingStats }>>(summaryResponse);
    const incidents = await this.handleResponse<ApiResponse<any[]>>(incidentsResponse);

    return {
      stats: summary.data.stats,
      incidents: incidents.data.map((incident) => ({
        id: Number(incident.id),
        code: incident.code,
        lat: Number(incident.latitude),
        lng: Number(incident.longitude),
        severity: incident.severity || "unassessed",
        status: incident.status,
        location: incident.locationName || "",
        disasterType: incident.disasterType || "",
        affectedPeople: Number(incident.affected_people || 0),
        activeVolunteers: Number(incident.activeVolunteers || 0),
      })),
    };
  }

  async getReportById(id: number): Promise<Report> {
    const response = await fetch(`${API_BASE_URL}/reports/${id}`, {
      method: "GET",
      headers: this.getHeaders(),
    });
    const data = await this.handleResponse<ApiResponse<any>>(response);
    return transformReportFromBackend(data.data);
  }

  async createReport(input: CreateReportInput): Promise<Report> {
    // Use FormData for file uploads
    const formData = new FormData();
    formData.append("title", input.title);
    formData.append("description", input.description);
    formData.append("disaster_type", input.disasterType);
    formData.append("affected_people", String(input.affectedPeople));
    formData.append("latitude", String(input.location.lat));
    formData.append("district", String(input.location.district));

    formData.append("longitude", String(input.location.lng));
    formData.append("location_name", input.location.name);

    // Append images if provided
    if (input.files && input.files.length > 0) {
      for (const file of input.files) {
        formData.append("images", file);
      }
    }

    const response = await fetch(`${API_BASE_URL}/reports`, {
      method: "POST",
      headers: { Authorization: `Bearer ${this.getToken() || ""}` },
      body: formData,
    });
    const data = await this.handleResponse<ApiResponse<any>>(response);
    return transformReportFromBackend(data.data);
  }

  async updateReport(id: number, updates: Partial<Report>): Promise<Report> {
    const response = await fetch(`${API_BASE_URL}/reports/${id}`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: JSON.stringify(updates),
    });
    const data = await this.handleResponse<ApiResponse<any>>(response);
    return transformReportFromBackend(data.data);
  }

  async uploadReportPhoto(reportId: number, file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE_URL}/reports/${reportId}/photos`, {
      method: "POST",
      headers: { Authorization: `Bearer ${this.getToken() || ""}` },
      body: formData,
    });
    const data = await this.handleResponse<ApiResponse<{ url: string }>>(response);
    return data.data;
  }
}

export const apiClient = new ApiClient();
