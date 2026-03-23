/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_APP_URL?: string;
  readonly VITE_KEYCLOAK_URL?: string;
  readonly VITE_KEYCLOAK_REALM?: string;
  readonly VITE_KEYCLOAK_CLIENT_ID?: string;
  readonly VITE_KEYCLOAK_REDIRECT_URI?: string;
  readonly VITE_KEYCLOAK_POST_LOGOUT_REDIRECT_URI?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  __APP_CONFIG__?: {
    API_BASE_URL?: string;
    APP_URL?: string;
    KEYCLOAK_URL?: string;
    KEYCLOAK_REALM?: string;
    KEYCLOAK_CLIENT_ID?: string;
    KEYCLOAK_REDIRECT_URI?: string;
    KEYCLOAK_POST_LOGOUT_REDIRECT_URI?: string;
  };
}
