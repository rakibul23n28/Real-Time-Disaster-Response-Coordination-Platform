// API client for server communication
const API_BASE_URL = "http://localhost:5000/api/v1"; // Update this to your server's base URL
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
}

export const apiClient = new ApiClient();
