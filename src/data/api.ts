// Frontend API client for the FastAPI backend.
// Default backend URL: http://localhost:8000/api/v1

export type UUID = string;
export type ISODateTime = string;

export type Role = "admin" | "user" | "mentor";

export interface ApiMessage {
  message: string;
}

export interface User {
  id: UUID;
  username: string;
  email: string;
  first_name: string;
  second_name: string;
  role?: Role;
  is_verified: boolean;
  avatar_url?: string | null;
  created_at?: ISODateTime;
  updated_at?: ISODateTime;
}

export interface UserCreate {
  username: string;
  email: string;
  password: string;
  first_name: string;
  second_name: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface SignupResponse {
  message: string;
  user: User;
}

export interface LoginResponse {
  message: string;
  access_token: string;
  refresh_token: string;
  user: Pick<User, "id" | "email"> & Partial<User>;
}

export interface RefreshTokenResponse {
  access_token: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordConfirmRequest {
  new_password: string;
  confirm_new_password: string;
}

export interface SendMailRequest {
  addresses: string[];
}

export interface UserWithJoinedEvents extends User {
  joined_events: Event[];
}

export interface RoleUpdateRequest {
  role: Role;
}

export interface RoleUpdateResponse {
  message: string;
  user: {
    id: UUID;
    email: string;
    role: Role;
  };
}

export interface Event {
  id: UUID;
  title: string;
  description: string;
  location: string;
  capacity: number;
  image_url: string;
  created_at: ISODateTime;
  updated_at: ISODateTime;
}

export interface EventUpdate {
  title: string;
  description: string;
  location: string;
  capacity: number;
  image_url: string;
}

export interface EventFormInput {
  title: string;
  description: string;
  location: string;
  capacity: number;
  image?: File | Blob | null;
}

export interface ImageUploadResponse {
  filename: string;
  path: string;
  original: string;
  format: string;
  width: number;
  height: number;
  original_width: number;
  original_height: number;
  original_size: number;
  optimized_size: number;
}

export interface Review {
  user_id: UUID;
  event_id: UUID;
  content: string;
  ratings: number;
  reviewed_at: ISODateTime;
}

export interface ReviewCreate {
  content: string;
  ratings: number;
}

export interface Blog {
  id?: UUID;
  title: string;
  description: string;
  image_url: string;
  user_id?: UUID;
  created_at?: ISODateTime;
  updated_at?: ISODateTime;
  comments?: Comment[];
}

export interface BlogUpdate {
  title: string;
  description: string;
  image_url: string;
}

export interface BlogFormInput {
  title: string;
  description: string;
  image?: File | Blob | null;
}

export interface Comment {
  id: UUID;
  user_id: UUID;
  blog_id: UUID;
  content: string;
  commented_at: ISODateTime;
  user?: User | null;
}

export interface CommentCreate {
  content: string;
}

export interface AuditLog {
  user_id: UUID;
  action: string;
  details: string | null;
  timestamp: ISODateTime;
}

export interface PaginationParams {
  limit?: number;
  offset?: number;
}

export interface ApiClientOptions {
  baseUrl?: string;
  getAccessToken?: () => string | null | undefined;
  getRefreshToken?: () => string | null | undefined;
  onAuthTokens?: (tokens: { accessToken?: string; refreshToken?: string }) => void;
}

export class ApiError<T = unknown> extends Error {
  status: number;
  data: T | null;

  constructor(status: number, data: T | null, message?: string) {
    super(message || `Request failed with status ${status}`);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

const env = import.meta.env;

const DEFAULT_BASE_URL =
  env.VITE_API_URL ||
  "/api/v1";

let memoryAccessToken = getStoredToken("access_token");
let memoryRefreshToken = getStoredToken("refresh_token");

function getStoredToken(key: string): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(key);
}

function setStoredToken(key: string, value?: string): void {
  if (typeof window === "undefined" || !value) return;
  window.localStorage.setItem(key, value);
}

function clearStoredTokens(): void {
  memoryAccessToken = null;
  memoryRefreshToken = null;
  if (typeof window === "undefined") return;
  window.localStorage.removeItem("access_token");
  window.localStorage.removeItem("refresh_token");
}

function buildQuery(params?: object) {
  const query = new URLSearchParams();
  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      query.set(key, String(value));
    }
  });
  const qs = query.toString();
  return qs ? `?${qs}` : "";
}

function formDataFrom(values: object) {
  const data = new FormData();
  Object.entries(values).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (typeof value === "string" || typeof value === "number" || value instanceof Blob) {
      data.append(key, value instanceof Blob ? value : String(value));
    }
  });
  return data;
}

async function parseResponse(response: Response): Promise<unknown> {
  if (response.status === 204) return null;

  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) return response.json();
  return response.text();
}

export function createApiClient(options: ApiClientOptions = {}) {
  const baseUrl = (options.baseUrl || DEFAULT_BASE_URL).replace(/\/+$/, "");

  async function request<T>(
    path: string,
    init: RequestInit & { useRefreshToken?: boolean } = {},
  ): Promise<T> {
    const headers = new Headers(init.headers);
    const hasBody = init.body !== undefined && init.body !== null;
    const isFormData = typeof FormData !== "undefined" && init.body instanceof FormData;

    if (hasBody && !isFormData && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    const token = init.useRefreshToken
      ? options.getRefreshToken?.() || memoryRefreshToken
      : options.getAccessToken?.() || memoryAccessToken;

    if (token && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(`${baseUrl}${path}`, {
      ...init,
      headers,
      credentials: "include",
    });

    const data = await parseResponse(response);

    if (!response.ok) {
      const detail =
        data && typeof data === "object" && "detail" in data
          ? String((data as { detail: unknown }).detail)
          : undefined;
      throw new ApiError(response.status, data, detail);
    }

    return data as T;
  }

  function storeTokens(tokens: { access_token?: string; refresh_token?: string }) {
    if (tokens.access_token) {
      memoryAccessToken = tokens.access_token;
      setStoredToken("access_token", tokens.access_token);
    }
    if (tokens.refresh_token) {
      memoryRefreshToken = tokens.refresh_token;
      setStoredToken("refresh_token", tokens.refresh_token);
    }
    options.onAuthTokens?.({
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
    });
  }

  return {
    setAccessToken(token: string | null) {
      memoryAccessToken = token;
      if (token) setStoredToken("access_token", token);
    },

    setRefreshToken(token: string | null) {
      memoryRefreshToken = token;
      if (token) setStoredToken("refresh_token", token);
    },

    clearAuth: clearStoredTokens,

    auth: {
      signup: (data: UserCreate) =>
        request<SignupResponse>("/auth/signup", {
          method: "POST",
          body: JSON.stringify(data),
        }),

      async login(data: UserLogin) {
        const response = await request<LoginResponse>("/auth/login", {
          method: "POST",
          body: JSON.stringify(data),
        });
        storeTokens(response);
        return response;
      },

      async refreshToken() {
        const response = await request<RefreshTokenResponse>("/auth/refresh_token", {
          method: "GET",
          useRefreshToken: true,
        });
        storeTokens({ access_token: response.access_token });
        return response;
      },

      me: () => request<User>("/auth/me"),

      myEvents: () => request<UserWithJoinedEvents>("/auth/me/events"),

      logout: async () => {
        const response = await request<ApiMessage>("/auth/logout", { method: "GET" });
        clearStoredTokens();
        return response;
      },

      users: (params?: PaginationParams) =>
        request<User[]>(`/auth/users${buildQuery(params)}`),

      verifyAccount: (token: string) =>
        request<ApiMessage>(`/auth/verify/${encodeURIComponent(token)}`),

      sendMail: (data: SendMailRequest) =>
        request<ApiMessage>("/auth/send_mail", {
          method: "POST",
          body: JSON.stringify(data),
        }),

      requestPasswordReset: (data: PasswordResetRequest) =>
        request<ApiMessage>("/auth/password-reset", {
          method: "POST",
          body: JSON.stringify(data),
        }),

      confirmPasswordReset: (token: string, data: PasswordConfirmRequest) =>
        request<ApiMessage>(`/auth/password-reset-confirm/${encodeURIComponent(token)}`, {
          method: "POST",
          body: JSON.stringify(data),
        }),

      deleteUser: (userId: UUID) =>
        request<ApiMessage>(`/auth/delete/${encodeURIComponent(userId)}`, {
          method: "DELETE",
        }),

      updateUserRole: (userId: UUID, data: RoleUpdateRequest) =>
        request<RoleUpdateResponse>(`/auth/users/${encodeURIComponent(userId)}/role`, {
          method: "PATCH",
          body: JSON.stringify(data),
        }),

      googleLoginUrl: () => `${baseUrl}/auth/google/login`,
      facebookLoginUrl: () => `${baseUrl}/auth/facebook/login`,
    },

    events: {
      list: (params?: PaginationParams) => request<Event[]>(`/events/${buildQuery(params)}`),

      get: (eventId: UUID) => request<Event>(`/events/${encodeURIComponent(eventId)}`),

      create: (data: EventFormInput) =>
        request<Event>("/events", {
          method: "POST",
          body: formDataFrom(data),
        }),

      replace: (eventId: UUID, data: EventUpdate) =>
        request<Event>(`/events/${encodeURIComponent(eventId)}`, {
          method: "PUT",
          body: JSON.stringify(data),
        }),

      update: (eventId: UUID, data: EventUpdate) =>
        request<Event>(`/events/${encodeURIComponent(eventId)}`, {
          method: "PATCH",
          body: JSON.stringify(data),
        }),

      delete: (eventId: UUID) =>
        request<null>(`/events/${encodeURIComponent(eventId)}`, {
          method: "DELETE",
        }),

      join: (eventId: UUID) =>
        request<ApiMessage>(`/events/${encodeURIComponent(eventId)}/join`, {
          method: "POST",
        }),

      leave: (eventId: UUID) =>
        request<ApiMessage>(`/events/${encodeURIComponent(eventId)}/leave`, {
          method: "DELETE",
        }),

      reviews: (eventId: UUID) =>
        request<Review[]>(`/events/${encodeURIComponent(eventId)}/reviews`),

      submitReview: (eventId: UUID, data: ReviewCreate) =>
        request<Review>(`/events/${encodeURIComponent(eventId)}/reviews`, {
          method: "POST",
          body: JSON.stringify(data),
        }),

      deleteReview: (eventId: UUID) =>
        request<ApiMessage>(`/events/${encodeURIComponent(eventId)}/reviews`, {
          method: "DELETE",
        }),

      uploadImage: (file: File | Blob) =>
        request<ImageUploadResponse>("/events/upload_image", {
          method: "POST",
          body: formDataFrom({ file }),
        }),
    },

    blogs: {
      list: (params?: PaginationParams) => request<Blog[]>(`/blogs/${buildQuery(params)}`),

      get: (blogId: UUID) => request<Blog>(`/blogs/${encodeURIComponent(blogId)}`),

      create: (data: BlogFormInput) =>
        request<Blog>("/blogs", {
          method: "POST",
          body: formDataFrom(data),
        }),

      update: (blogId: UUID, data: BlogUpdate) =>
        request<Blog>(`/blogs/${encodeURIComponent(blogId)}`, {
          method: "PATCH",
          body: JSON.stringify(data),
        }),

      delete: (blogId: UUID) =>
        request<ApiMessage>(`/blogs/${encodeURIComponent(blogId)}`, {
          method: "DELETE",
        }),

      comment: (blogId: UUID, data: CommentCreate) =>
        request<Comment>(`/blogs/${encodeURIComponent(blogId)}/comment`, {
          method: "POST",
          body: JSON.stringify(data),
        }),

      deleteComment: (blogId: UUID, commentId: UUID) =>
        request<ApiMessage>(
          `/blogs/${encodeURIComponent(blogId)}/comment/${encodeURIComponent(commentId)}`,
          { method: "DELETE" },
        ),
    },

    logs: {
      list: (params?: PaginationParams) =>
        request<AuditLog[]>(`/logs${buildQuery(params)}`),

      get: (logId: UUID) => request<AuditLog>(`/logs/${encodeURIComponent(logId)}`),

      delete: (logId: UUID) =>
        request<ApiMessage>(`/logs/delete_log/${encodeURIComponent(logId)}`, {
          method: "DELETE",
        }),
    },
  };
}

export const api = createApiClient();
