import Keycloak from "keycloak-js";
import {
  KEYCLOAK_POST_LOGOUT_REDIRECT_URI,
  KEYCLOAK_CLIENT_ID,
  KEYCLOAK_REDIRECT_URI,
  KEYCLOAK_REALM,
  KEYCLOAK_URL
} from "../config/env";

const keycloak = new Keycloak({
  url: KEYCLOAK_URL,
  realm: KEYCLOAK_REALM,
  clientId: KEYCLOAK_CLIENT_ID
});

let initialized = false;
let initPromise: Promise<boolean> | null = null;

export async function initAuth(): Promise<boolean> {
  if (initialized) {
    return Boolean(keycloak.authenticated);
  }

  if (initPromise) {
    return initPromise;
  }

  initPromise = keycloak
    .init({
      onLoad: "check-sso",
      pkceMethod: "S256",
      checkLoginIframe: false
    })
    .then((authenticated) => {
      initialized = true;
      return authenticated;
    })
    .catch((error) => {
      initialized = false;
      console.error("Falha ao inicializar autenticacao:", error);
      return false;
    })
    .finally(() => {
      initPromise = null;
    });

  return initPromise;
}

export async function login(): Promise<void> {
  await keycloak.login({
    redirectUri: KEYCLOAK_REDIRECT_URI
  });
}

export async function logout(): Promise<void> {
  await keycloak.logout({
    redirectUri: KEYCLOAK_POST_LOGOUT_REDIRECT_URI
  });
}

export async function refreshToken(): Promise<void> {
  if (!keycloak.authenticated) return;

  try {
    await keycloak.updateToken(30);
  } catch (error) {
    console.error("Falha ao atualizar token:", error);
    throw error;
  }
}

export function isAuthenticated(): boolean {
  return Boolean(keycloak.authenticated);
}

export function getToken(): string {
  return keycloak.token || "";
}

export function getUsername(): string {
  if (!keycloak.tokenParsed) return "";
  const parsed = keycloak.tokenParsed as {
    preferred_username?: string;
    name?: string;
    email?: string;
    sub?: string;
  };

  return parsed.preferred_username || parsed.name || parsed.email || parsed.sub || "";
}

export function getClienteIdFromToken(): number | null {
  if (!keycloak.tokenParsed) return null;

  const rawValue = findClienteIdClaimValue(keycloak.tokenParsed as Record<string, unknown>);
  return toInteger(rawValue);
}

const CLIENTE_ID_CLAIM_KEYS = ["cliente_id", "client_id", "clienteId", "clientId"] as const;

function toInteger(value: unknown): number | null {
  if (typeof value === "number" && Number.isInteger(value)) return value;
  if (typeof value !== "string") return null;

  const normalized = value.trim();
  if (!/^-?\d+$/.test(normalized)) return null;

  const parsed = Number(normalized);
  return Number.isInteger(parsed) ? parsed : null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function findClienteIdClaimValue(root: Record<string, unknown>): unknown {
  const visited = new Set<unknown>();
  const queue: unknown[] = [root];

  while (queue.length > 0) {
    const current = queue.shift();
    if (!isRecord(current) || visited.has(current)) continue;
    visited.add(current);

    for (const key of CLIENTE_ID_CLAIM_KEYS) {
      const claimValue = current[key];
      if (claimValue !== undefined && claimValue !== null) return claimValue;
    }

    for (const value of Object.values(current)) {
      if (isRecord(value)) queue.push(value);
    }
  }

  return null;
}
