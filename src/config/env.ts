const DEFAULT_API_BASE_URL = "http://localhost:8080/api/loja";
const DEFAULT_APP_URL = "http://localhost:5173/";
const DEFAULT_KEYCLOAK_URL = "http://localhost:8081";
const DEFAULT_KEYCLOAK_REALM = "extranet-realm";
const DEFAULT_KEYCLOAK_CLIENT_ID = "loja-frontend";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL;
export const APP_URL = import.meta.env.VITE_APP_URL || DEFAULT_APP_URL;
export const KEYCLOAK_URL = import.meta.env.VITE_KEYCLOAK_URL || DEFAULT_KEYCLOAK_URL;
export const KEYCLOAK_REALM = import.meta.env.VITE_KEYCLOAK_REALM || DEFAULT_KEYCLOAK_REALM;
export const KEYCLOAK_CLIENT_ID =
  import.meta.env.VITE_KEYCLOAK_CLIENT_ID || DEFAULT_KEYCLOAK_CLIENT_ID;
export const KEYCLOAK_REDIRECT_URI =
  import.meta.env.VITE_KEYCLOAK_REDIRECT_URI || APP_URL;
export const KEYCLOAK_POST_LOGOUT_REDIRECT_URI =
  import.meta.env.VITE_KEYCLOAK_POST_LOGOUT_REDIRECT_URI || APP_URL;
