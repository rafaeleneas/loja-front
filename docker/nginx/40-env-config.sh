#!/bin/sh
set -eu

cat > /usr/share/nginx/html/env-config.js <<EOF
window.__APP_CONFIG__ = {
  API_BASE_URL: "${API_BASE_URL:-http://localhost:8080/api/loja}",
  APP_URL: "${APP_URL:-http://localhost:4200/}",
  KEYCLOAK_URL: "${KEYCLOAK_URL:-http://localhost:8081}",
  KEYCLOAK_REALM: "${KEYCLOAK_REALM:-extranet-realm}",
  KEYCLOAK_CLIENT_ID: "${KEYCLOAK_CLIENT_ID:-loja-frontend}",
  KEYCLOAK_REDIRECT_URI: "${KEYCLOAK_REDIRECT_URI:-${APP_URL:-http://localhost:4200/}}",
  KEYCLOAK_POST_LOGOUT_REDIRECT_URI: "${KEYCLOAK_POST_LOGOUT_REDIRECT_URI:-${APP_URL:-http://localhost:4200/}}"
};
EOF
