import Keycloak from "keycloak-js";
import {
  KEYCLOAK_POST_LOGOUT_REDIRECT_URI,
  KEYCLOAK_CLIENT_ID,
  KEYCLOAK_REDIRECT_URI,
  KEYCLOAK_REALM,
  KEYCLOAK_URL
} from "../config/env";
import { logger } from "../utils/logger";

const keycloak = new Keycloak({
  url: KEYCLOAK_URL,
  realm: KEYCLOAK_REALM,
  clientId: KEYCLOAK_CLIENT_ID
});

function isPkceSupported(): boolean {
  if (typeof window === "undefined") return false;

  const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  const secureContext = window.isSecureContext || isLocalhost;
  return secureContext && typeof window.crypto?.subtle !== "undefined";
}

let initialized = false;
let initPromise: Promise<boolean> | null = null;
let pkceEnabled = false;

export async function initAuth(): Promise<boolean> {
  if (initialized) {
    logger.info("Autenticacao ja inicializada.", {
      authenticated: Boolean(keycloak.authenticated)
    });
    return Boolean(keycloak.authenticated);
  }

  if (initPromise) {
    logger.info("Inicializacao da autenticacao ja esta em andamento.");
    return initPromise;
  }

  logger.info("Inicializando autenticacao com Keycloak.", {
    realm: KEYCLOAK_REALM,
    keycloakUrl: KEYCLOAK_URL
  });

  pkceEnabled = isPkceSupported();
  if (!pkceEnabled) {
    logger.warn("PKCE desabilitado no ambiente atual por falta de contexto seguro ou Web Crypto API.");
  }

  initPromise = keycloak
    .init({
      onLoad: "check-sso",
      pkceMethod: pkceEnabled ? "S256" : false,
      checkLoginIframe: false
    })
    .then((authenticated) => {
      initialized = true;
      logger.info("Autenticacao inicializada.", { authenticated });
      return authenticated;
    })
    .catch((error) => {
      initialized = false;
      logger.error("Falha ao inicializar autenticacao.", error);
      return false;
    })
    .finally(() => {
      initPromise = null;
    });

  return initPromise;
}

export async function login(): Promise<void> {
  logger.info("Redirecionando usuario para login.");
  await keycloak.login({
    redirectUri: KEYCLOAK_REDIRECT_URI,
    pkceMethod: pkceEnabled ? "S256" : undefined
  });
}

export async function logout(): Promise<void> {
  logger.info("Encerrando sessao do usuario.");
  await keycloak.logout({
    redirectUri: KEYCLOAK_POST_LOGOUT_REDIRECT_URI
  });
}

export async function refreshToken(): Promise<void> {
  if (!keycloak.authenticated) return;

  try {
    await keycloak.updateToken(30);
  } catch (error) {
    logger.error("Falha ao atualizar token.", error);
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
