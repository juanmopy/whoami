const ALLOWED_ORIGINS = [
  "https://tu-usuario.github.io",
  "http://localhost:4200",
];

export interface CorsHeaders {
  [key: string]: string;
  "Access-Control-Allow-Origin": string;
  "Access-Control-Allow-Methods": string;
  "Access-Control-Allow-Headers": string;
  "Access-Control-Max-Age": string;
}

export function getCorsHeaders(origin: string | undefined): CorsHeaders | null {
  if (!origin || !ALLOWED_ORIGINS.includes(origin)) {
    return null;
  }

  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

export function isOriginAllowed(origin: string | undefined): boolean {
  return !!origin && ALLOWED_ORIGINS.includes(origin);
}
