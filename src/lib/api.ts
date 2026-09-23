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
  activeVolunteers?: number;
}

export interface VolunteerLocation {
  volunteer_id: number;
  task_id: number;
  latitude: number | string;
  longitude: number | string;
  volunteer_name: string;
  area_name?: string;
  district?: string;
  updated_at: string;
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
  displayTime: string;
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
  assignment_status?: "pending" | "accepted" | "declined";
  decline_reason?: string | null;
  assignments?: { volunteer_id: number; volunteer_name: string; status?: "pending" | "accepted" | "declined"; decline_reason?: string | null }[];
}

export interface ApiVolunteer { id: number; name: string; email: string; is_available: number | boolean; }

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
  reporter_name?: string;
  task_title?: string;
  area_name?: string;
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

export type TrainingEnrollmentStatus = "registered" | "in_progress" | "completed";

export interface TrainingEvent {
  id: number;
  title: string;
  description: string;
  location: string;
  district: string;
  start_date: string;
  end_date: string;
  duration_days: number;
  capacity: number;
  status: "open" | "in_progress" | "completed" | "cancelled";
  enrolled_count: number;
  enrollment_id?: number | null;
  enrollment_status?: TrainingEnrollmentStatus | null;
  completed_days?: number | null;
  created_at: string;
}

export interface TrainingEnrollment {
  id: number;
  event_id: number;
  volunteer_id: number;
  status: TrainingEnrollmentStatus;
  completed_days: number;
  duration_days: number;
  enrolled_at: string;
  started_at?: string | null;
  completed_at?: string | null;
  volunteer_name: string;
  volunteer_email?: string;
  event_title: string;
  location: string;
  start_date?: string;
  end_date?: string;
}

export interface ApiResource {
  id: number;
  name: string;
  category: "food" | "water" | "medical" | "other";
  unit: string;
  description?: string | null;
}

export interface ApiInventory {
  id: number;
  resource_id: number;
  quantity: number;
  depot_name: string;
  resource_name: string;
  category: ApiResource["category"];
  unit: string;
  location_name?: string | null;
}

export interface ApiAllocation {
  id: number;
  allocation_code: string;
  report_id?: number | null;
  resource_id: number;
  quantity: number;
  resource_name: string;
  unit: string;
  allocated_by_name?: string;
  created_at: string;
}

export interface DonationPlace {
  id: number;
  name: string;
  organization: string;
  address: string;
  district: string;
  division: string;
  phone?: string;
  categories: string;
  latitude: number | string;
  longitude: number | string;
}

export interface DonationLogEntry {
  id: number;
  donation_type: "money" | "item";
  category: "food" | "water" | "medical" | "other";
  donor_name: string;
  is_anonymous: number;
  amount?: number | string | null;
  item_name?: string | null;
  quantity?: number | null;
  unit?: string | null;
  note?: string | null;
  place_name: string;
  organization: string;
  district: string;
  division: string;
  created_at: string;
  status?: "pending" | "received" | "confirmed" | "cancelled";
}

export interface CreateDonationInput {
  donation_type: "money" | "item";
  category: "food" | "water" | "medical" | "other";
  donor_name?: string;
  donor_contact?: string;
  is_anonymous: boolean;
  amount?: number;
  item_name?: string;
  quantity?: number;
  unit?: string;
  place_id: number;
  note?: string;
}

export interface AdminDashboardData {
  report_stats: Record<string, number>;
  task_stats: Record<string, number>;
  issue_stats: Record<string, number>;
  inventory_alerts: Array<Record<string, unknown>>;
  recent_reports: Array<Record<string, unknown>>;
  total_affected: number;
}

// Transform backend snake_case data to frontend camelCase format
function transformReportFromBackend(data: any): Report {
  const createdAt = data.created_at || "";
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
    createdAt,
    displayTime: createdAt ? new Date(createdAt).toLocaleString("bn-BD") : "",
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
    const url = `${API_BASE_URL}/reports${queryString ? "?" + queryString : "?limit=100"}`;
    const response = await fetch(url, {
      method: "GET",
      headers: this.getHeaders(),
    });
    const data = await this.handleResponse<ApiResponse<any[]>>(response);
    return data.data.map(transformReportFromBackend);
  }

  async getAdminDashboard(): Promise<AdminDashboardData> {
    const response = await fetch(`${API_BASE_URL}/dashboard/admin`, { headers: this.getHeaders() });
    const data = await this.handleResponse<ApiResponse<AdminDashboardData>>(response);
    return data.data;
  }

  async updateReportStatus(id: number, status: Report["status"]): Promise<Report> {
    const response = await fetch(`${API_BASE_URL}/reports/${id}/status`, {
      method: "PATCH",
      headers: this.getHeaders(),
      body: JSON.stringify({ status }),
    });
    const data = await this.handleResponse<ApiResponse<any>>(response);
    return transformReportFromBackend(data.data);
  }

  async requestReportInfo(id: number, message: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/reports/${id}/request-info`, {
      method: "POST", headers: this.getHeaders(), body: JSON.stringify({ message }),
    });
    await this.handleResponse<ApiResponse<null>>(response);
  }

  async updateIssueStatus(id: number, status: "reported" | "in_progress" | "resolved"): Promise<ApiIssue> {
    const response = await fetch(`${API_BASE_URL}/issues/${id}/status`, {
      method: "PATCH",
      headers: this.getHeaders(),
      body: JSON.stringify({ status }),
    });
    const data = await this.handleResponse<ApiResponse<ApiIssue>>(response);
    return data.data;
  }

  async getResources(): Promise<ApiResource[]> {
    const response = await fetch(`${API_BASE_URL}/resources?limit=100`, { headers: this.getHeaders() });
    const data = await this.handleResponse<ApiResponse<ApiResource[]>>(response);
    return data.data;
  }

  async createResource(input: Omit<ApiResource, "id">): Promise<ApiResource> {
    const response = await fetch(`${API_BASE_URL}/resources`, {
      method: "POST", headers: this.getHeaders(), body: JSON.stringify(input),
    });
    const data = await this.handleResponse<ApiResponse<ApiResource>>(response);
    return data.data;
  }

  async getInventory(): Promise<ApiInventory[]> {
    const response = await fetch(`${API_BASE_URL}/inventory?limit=100`, { headers: this.getHeaders() });
    const data = await this.handleResponse<ApiResponse<ApiInventory[]>>(response);
    return data.data;
  }

  async createInventory(input: { resource_id: number; quantity: number; depot_name: string }): Promise<ApiInventory> {
    const response = await fetch(`${API_BASE_URL}/inventory`, {
      method: "POST", headers: this.getHeaders(), body: JSON.stringify(input),
    });
    const data = await this.handleResponse<ApiResponse<ApiInventory>>(response);
    return data.data;
  }

  async updateInventory(id: number, input: { quantity?: number; depot_name?: string }): Promise<ApiInventory> {
    const response = await fetch(`${API_BASE_URL}/inventory/${id}`, {
      method: "PATCH", headers: this.getHeaders(), body: JSON.stringify(input),
    });
    const data = await this.handleResponse<ApiResponse<ApiInventory>>(response);
    return data.data;
  }

  async getAllocations(): Promise<ApiAllocation[]> {
    const response = await fetch(`${API_BASE_URL}/allocations?limit=100`, { headers: this.getHeaders() });
    const data = await this.handleResponse<ApiResponse<ApiAllocation[]>>(response);
    return data.data;
  }

  async allocateResource(input: { report_id?: number; resource_id: number; quantity: number }): Promise<{ id: number; allocation_code: string }> {
    const response = await fetch(`${API_BASE_URL}/allocations`, {
      method: "POST", headers: this.getHeaders(), body: JSON.stringify(input),
    });
    const data = await this.handleResponse<ApiResponse<{ id: number; allocation_code: string }>>(response);
    return data.data;
  }

  async saveSeverity(reportId: number, input: {
    affected_people_score: number;
    damage_score: number;
    medical_emergency_score: number;
    road_access_score: number;
    shelter_score: number;
  }): Promise<Record<string, unknown>> {
    const response = await fetch(`${API_BASE_URL}/reports/${reportId}/severity`, {
      method: "POST", headers: this.getHeaders(), body: JSON.stringify(input),
    });
    const data = await this.handleResponse<ApiResponse<Record<string, unknown>>>(response);
    return data.data;
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

  async getPublicVolunteerLocations(): Promise<VolunteerLocation[]> {
    const response = await fetch(`${API_BASE_URL}/public/volunteer-locations`);
    const data = await this.handleResponse<ApiResponse<VolunteerLocation[]>>(response);
    return data.data;
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

  async getTasks(): Promise<ApiTask[]> {
    const response = await fetch(`${API_BASE_URL}/tasks?limit=100`, {
      method: "GET",
      headers: this.getHeaders(),
    });
    const data = await this.handleResponse<ApiResponse<ApiTask[]>>(response);
    return data.data;
  }

  async getVolunteers(): Promise<ApiVolunteer[]> {
    const response = await fetch(`${API_BASE_URL}/tasks/volunteers/list`, { headers: this.getHeaders() });
    const data = await this.handleResponse<ApiResponse<ApiVolunteer[]>>(response);
    return data.data;
  }

  async assignTask(taskId: number, volunteerId: number): Promise<ApiTask> {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/assign`, { method: "POST", headers: this.getHeaders(), body: JSON.stringify({ volunteer_id: volunteerId }) });
    const data = await this.handleResponse<ApiResponse<ApiTask>>(response);
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

  async acceptAssignment(id: number): Promise<ApiTask> {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}/assignment/accept`, { method: "PATCH", headers: this.getHeaders() });
    const data = await this.handleResponse<ApiResponse<ApiTask>>(response);
    return data.data;
  }

  async declineAssignment(id: number, reason: string): Promise<ApiTask> {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}/assignment/decline`, { method: "PATCH", headers: this.getHeaders(), body: JSON.stringify({ reason }) });
    const data = await this.handleResponse<ApiResponse<ApiTask>>(response);
    return data.data;
  }

  async updateVolunteerLocation(id: number, input: { latitude: number; longitude: number; is_sharing: boolean }): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}/location`, { method: "PUT", headers: this.getHeaders(), body: JSON.stringify(input) });
    await this.handleResponse<ApiResponse<unknown>>(response);
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

  async getTrainingEvents(): Promise<TrainingEvent[]> {
    const response = await fetch(`${API_BASE_URL}/training/events`, { headers: this.getHeaders() });
    const data = await this.handleResponse<ApiResponse<TrainingEvent[]>>(response);
    return data.data;
  }

  async createTrainingEvent(input: Omit<TrainingEvent, "id" | "status" | "enrolled_count" | "enrollment_id" | "enrollment_status" | "created_at">): Promise<TrainingEvent> {
    const response = await fetch(`${API_BASE_URL}/training/events`, {
      method: "POST", headers: this.getHeaders(), body: JSON.stringify(input),
    });
    const data = await this.handleResponse<ApiResponse<TrainingEvent>>(response);
    return data.data;
  }

  async enrollInTraining(eventId: number): Promise<TrainingEvent> {
    const response = await fetch(`${API_BASE_URL}/training/events/${eventId}/enroll`, { method: "POST", headers: this.getHeaders() });
    const data = await this.handleResponse<ApiResponse<TrainingEvent>>(response);
    return data.data;
  }

  async completeTrainingDay(enrollmentId: number): Promise<TrainingEnrollment> {
    const response = await fetch(`${API_BASE_URL}/training/enrollments/${enrollmentId}/day-complete`, {
      method: "POST", headers: this.getHeaders(),
    });
    const data = await this.handleResponse<ApiResponse<TrainingEnrollment>>(response);
    return data.data;
  }

  async getTrainingEnrollments(): Promise<TrainingEnrollment[]> {
    const response = await fetch(`${API_BASE_URL}/training/enrollments`, { headers: this.getHeaders() });
    const data = await this.handleResponse<ApiResponse<TrainingEnrollment[]>>(response);
    return data.data;
  }

  async updateTrainingEnrollment(id: number, status: TrainingEnrollmentStatus): Promise<TrainingEnrollment> {
    const response = await fetch(`${API_BASE_URL}/training/enrollments/${id}/status`, {
      method: "PATCH", headers: this.getHeaders(), body: JSON.stringify({ status }),
    });
    const data = await this.handleResponse<ApiResponse<TrainingEnrollment>>(response);
    return data.data;
  }

  async getDonationPlaces(category?: DonationPlace["categories"]): Promise<DonationPlace[]> {
    const query = category ? `?category=${encodeURIComponent(category)}` : "";
    const response = await fetch(`${API_BASE_URL}/donations/places${query}`);
    const data = await this.handleResponse<ApiResponse<DonationPlace[]>>(response);
    return data.data;
  }

  async getDonationLog(category?: CreateDonationInput["category"]): Promise<DonationLogEntry[]> {
    const query = category ? `?category=${encodeURIComponent(category)}` : "";
    const response = await fetch(`${API_BASE_URL}/donations/log${query}`);
    const data = await this.handleResponse<ApiResponse<DonationLogEntry[]>>(response);
    return data.data;
  }

  async createDonation(input: CreateDonationInput): Promise<DonationLogEntry> {
    const response = await fetch(`${API_BASE_URL}/donations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const data = await this.handleResponse<ApiResponse<DonationLogEntry>>(response);
    return data.data;
  }

  async getPendingDonations(): Promise<DonationLogEntry[]> {
    const response = await fetch(`${API_BASE_URL}/donations/pending`, { headers: this.getHeaders() });
    const data = await this.handleResponse<ApiResponse<DonationLogEntry[]>>(response);
    return data.data;
  }

  async confirmDonation(id: number): Promise<DonationLogEntry> {
    const response = await fetch(`${API_BASE_URL}/donations/${id}/confirm`, {
      method: "PATCH", headers: this.getHeaders(),
    });
    const data = await this.handleResponse<ApiResponse<DonationLogEntry>>(response);
    return data.data;
  }
}

export const apiClient = new ApiClient();
