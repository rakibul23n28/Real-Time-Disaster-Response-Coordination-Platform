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
  is_available?: boolean;
  created_at?: string;
}

export interface UpdateUserInput {
  name: string;
  email: string;
  phone?: string;
  is_available?: boolean;
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

export interface ApiTask {
  id: number;
  task_code: string;
  report_id?: number | null;
  title: string;
  description: string;
  instructions?: string | null;
  priority: "critical" | "high" | "medium" | "low";
  status: "assigned" | "en_route" | "in_progress" | "completed";
  progress?: number;
  location_name?: string | null;
  district?: string | null;
  loc_lat?: number | string | null;
  loc_lng?: number | string | null;
  assigned_at?: string;
  assignments?: { volunteer_id: number; volunteer_name: string }[];
}

export interface ApiIssue {
  id: number;
  issue_code: string;
  task_id?: number | null;
  issue_type: "road_blocked" | "extra_relief" | "medical" | "boat_needed" | "more_volunteers" | "other";
  description: string;
  location_name?: string | null;
  latitude?: number | string | null;
  longitude?: number | string | null;
  status: "reported" | "in_progress" | "resolved";
  created_at: string;
}

export interface CreateIssueInput {
  task_id?: number;
  issue_type: ApiIssue["issue_type"];
  description: string;
  location_name?: string;
  latitude?: number;
  longitude?: number;
  image?: File;
}

export interface ApiNotification {
  id: number;
  title: string;
  message: string;
  type: string;
  reference_type?: string | null;
  reference_id?: number | null;
  is_read: number;
  created_at: string;
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
    }));
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

  async getTasks(): Promise<ApiTask[]> {
    const response = await fetch(`${API_BASE_URL}/tasks?limit=100`, {
      method: "GET",
      headers: this.getHeaders(),
    });
    const data = await this.handleResponse<ApiResponse<ApiTask[]>>(response);
    return data.data;
  }

  async updateTaskStatus(id: number, status: ApiTask["status"]): Promise<ApiTask> {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}/status`, {
      method: "PATCH",
      headers: this.getHeaders(),
      body: JSON.stringify({ status }),
    });
    const data = await this.handleResponse<ApiResponse<ApiTask>>(response);
    return data.data;
  }

  async getIssues(): Promise<ApiIssue[]> {
    const response = await fetch(`${API_BASE_URL}/issues?limit=100`, {
      method: "GET",
      headers: this.getHeaders(),
    });
    const data = await this.handleResponse<ApiResponse<ApiIssue[]>>(response);
    return data.data;
  }

  async createIssue(input: CreateIssueInput): Promise<ApiIssue> {
    if (!input.image) {
      const response = await fetch(`${API_BASE_URL}/issues`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify({
          task_id: input.task_id,
          issue_type: input.issue_type,
          description: input.description,
          location_name: input.location_name,
          latitude: input.latitude,
          longitude: input.longitude,
        }),
      });
      const data = await this.handleResponse<ApiResponse<ApiIssue>>(response);
      return data.data;
    }

    const formData = new FormData();
    formData.append("issue_type", input.issue_type);
    formData.append("description", input.description);
    if (input.task_id !== undefined) formData.append("task_id", String(input.task_id));
    if (input.location_name) formData.append("location_name", input.location_name);
    if (input.latitude !== undefined) formData.append("latitude", String(input.latitude));
    if (input.longitude !== undefined) formData.append("longitude", String(input.longitude));
    if (input.image) formData.append("image", input.image);

    const response = await fetch(`${API_BASE_URL}/issues`, {
      method: "POST",
      headers: { Authorization: `Bearer ${this.getToken() || ""}` },
      body: formData,
    });
    const data = await this.handleResponse<ApiResponse<ApiIssue>>(response);
    return data.data;
  }

  async getNotifications(): Promise<ApiNotification[]> {
    const response = await fetch(`${API_BASE_URL}/notifications?limit=100`, {
      method: "GET",
      headers: this.getHeaders(),
    });
    const data = await this.handleResponse<ApiResponse<ApiNotification[]>>(response);
    return data.data;
  }

  async markNotificationsRead(): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/notifications/read-all`, {
      method: "PATCH",
      headers: this.getHeaders(),
    });
    await this.handleResponse<ApiResponse<null>>(response);
  }
}

export const apiClient = new ApiClient();
