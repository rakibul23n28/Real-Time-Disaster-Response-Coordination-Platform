export interface PaginationQuery {
  page: number;
  limit: number;
}

export interface ApiUser {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: "citizen" | "volunteer" | "admin";
  profile_image: string | null;
  created_at: string;
}
