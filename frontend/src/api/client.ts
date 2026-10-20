/**
 * Central API client.
 * All frontend requests to the backend go through this file.
 */

const BASE = (
  (import.meta.env.VITE_API_URL as string | undefined) ?? "/api"
).replace(/\/+$/, "");

export type ApiErrorKind =
  | "network"
  | "not-found"
  | "invalid"
  | "server"
  | "aborted";

export class ApiError extends Error {
  constructor(
    public kind: ApiErrorKind,
    public status: number,
    public serverMessage?: string,
  ) {
    super(serverMessage ?? kind);
    this.name = "ApiError";
  }

  get userMessage(): string {
    switch (this.kind) {
      case "network":
        return "We can’t reach the store right now. Check your connection and that the server is running.";
      case "not-found":
        return (
          this.serverMessage ?? "We couldn’t find what you were looking for."
        );
      case "invalid":
        return (
          this.serverMessage ?? "Please check your information and try again."
        );
      case "aborted":
        return "The request was cancelled.";
      default:
        return "Something went wrong on our side. Please try again in a moment.";
    }
  }
}

type Params = Record<string, string | number | undefined | null>;

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  params?: Params;
  body?: unknown;
  signal?: AbortSignal;
};

async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = "GET", params, body, signal } = options;

  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(params ?? {})) {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, String(value));
    }
  }

  const url = `${BASE}${path}${query.size ? `?${query}` : ""}`;

  const isFormData = body instanceof FormData;

  const headers: HeadersInit = {
    Accept: "application/json",
    ...(body !== undefined && !isFormData
      ? { "Content-Type": "application/json" }
      : {}),
  };

  let response: Response;

  try {
    response = await fetch(url, {
      method,
      headers,
      ...(body !== undefined
        ? {
            body: isFormData ? body : JSON.stringify(body),
          }
        : {}),
      credentials: "same-origin",
      signal,
    });
  } catch (error) {
    if (
      signal?.aborted ||
      (error instanceof DOMException && error.name === "AbortError")
    ) {
      throw new ApiError("aborted", 0);
    }

    throw new ApiError("network", 0);
  }

  let responseBody: unknown = null;

  try {
    responseBody = await response.json();
  } catch {
    // The backend may return an empty or non-JSON response.
  }

  const parsedBody =
    responseBody && typeof responseBody === "object"
      ? (responseBody as Record<string, unknown>)
      : {};

  const message =
    typeof parsedBody.message === "string" ? parsedBody.message : undefined;

  if (!response.ok) {
    if (response.status === 404) {
      throw new ApiError("not-found", response.status, message);
    }

    if (response.status >= 400 && response.status < 500) {
      throw new ApiError("invalid", response.status, message);
    }

    throw new ApiError("server", response.status, message);
  }

  if ("data" in parsedBody) {
    return parsedBody.data as T;
  }

  return responseBody as T;
}

export function apiGet<T>(
  path: string,
  params?: Params,
  signal?: AbortSignal,
): Promise<T> {
  return apiRequest<T>(path, {
    method: "GET",
    params,
    signal,
  });
}

export function apiPost<T>(
  path: string,
  body?: unknown,
  signal?: AbortSignal,
): Promise<T> {
  return apiRequest<T>(path, {
    method: "POST",
    body,
    signal,
  });
}

export function apiPatch<T>(
  path: string,
  body?: unknown,
  signal?: AbortSignal,
): Promise<T> {
  return apiRequest<T>(path, {
    method: "PATCH",
    body,
    signal,
  });
}

export function apiDelete<T>(path: string, signal?: AbortSignal): Promise<T> {
  return apiRequest<T>(path, {
    method: "DELETE",
    signal,
  });
}

export function assetUrl(path: string | null | undefined): string | null {
  if (!path) return null;

  if (/^(https?:)?\/\//i.test(path) || path.startsWith("data:")) {
    return path;
  }

  return `${BASE}/${path.replace(/^\/+/, "")}`;
}
