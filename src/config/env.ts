const DEFAULT_API_BASE_URL = "http://localhost:8080/api/loja";
const DEFAULT_APP_URL = "http://localhost:4200/";
const DEFAULT_KEYCLOAK_URL = "http://localhost:8081";
const DEFAULT_KEYCLOAK_REALM = "extranet-realm";
const DEFAULT_KEYCLOAK_CLIENT_ID = "loja-frontend";

type AppConfigKey =
  | "API_BASE_URL"
  | "APP_URL"
  | "KEYCLOAK_URL"
  | "KEYCLOAK_REALM"
  | "KEYCLOAK_CLIENT_ID"
  | "KEYCLOAK_REDIRECT_URI"
  | "KEYCLOAK_POST_LOGOUT_REDIRECT_URI";

function getConfigValue(key: AppConfigKey, fallback: string): string {
  const runtimeValue = window.__APP_CONFIG__?.[key];
  if (runtimeValue) return runtimeValue;

  const viteValue = import.meta.env[`VITE_${key}` as keyof ImportMetaEnv];
  if (typeof viteValue === "string" && viteValue.length > 0) return viteValue;

  return fallback;
}

export const API_BASE_URL = getConfigValue("API_BASE_URL", DEFAULT_API_BASE_URL);
export const APP_URL = getConfigValue("APP_URL", DEFAULT_APP_URL);
export const KEYCLOAK_URL = getConfigValue("KEYCLOAK_URL", DEFAULT_KEYCLOAK_URL);
export const KEYCLOAK_REALM = getConfigValue("KEYCLOAK_REALM", DEFAULT_KEYCLOAK_REALM);
export const KEYCLOAK_CLIENT_ID = getConfigValue("KEYCLOAK_CLIENT_ID", DEFAULT_KEYCLOAK_CLIENT_ID);
export const KEYCLOAK_REDIRECT_URI = getConfigValue("KEYCLOAK_REDIRECT_URI", APP_URL);
export const KEYCLOAK_POST_LOGOUT_REDIRECT_URI = getConfigValue("KEYCLOAK_POST_LOGOUT_REDIRECT_URI", APP_URL);
