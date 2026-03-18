# Loja Front

Frontend da loja construído com React, TypeScript e Vite.

## Requisitos

- Node.js 20+
- npm
- Backend `loja-service` disponível
- Keycloak disponível

## Executando localmente

```bash
npm install
npm run dev
```

Aplicação local:

- `http://localhost:5173`

## Scripts

- `npm run dev`: sobe o frontend em modo desenvolvimento
- `npm run build`: gera o build de produção
- `npm run preview`: publica localmente o build gerado

## Variáveis de ambiente

O projeto usa valores padrão para desenvolvimento local, mas você pode sobrescrever via `.env`.

Variáveis suportadas:

- `VITE_API_BASE_URL`
- `VITE_APP_URL`
- `VITE_KEYCLOAK_URL`
- `VITE_KEYCLOAK_REALM`
- `VITE_KEYCLOAK_CLIENT_ID`
- `VITE_KEYCLOAK_REDIRECT_URI`
- `VITE_KEYCLOAK_POST_LOGOUT_REDIRECT_URI`

Valores padrão do projeto:

- `VITE_API_BASE_URL=http://localhost:8080/api/loja`
- `VITE_APP_URL=http://localhost:5173/`
- `VITE_KEYCLOAK_URL=http://localhost:8081`
- `VITE_KEYCLOAK_REALM=extranet-realm`
- `VITE_KEYCLOAK_CLIENT_ID=loja-frontend`
- `VITE_KEYCLOAK_REDIRECT_URI=http://localhost:5173/`
- `VITE_KEYCLOAK_POST_LOGOUT_REDIRECT_URI=http://localhost:5173/`

## Keycloak local

Para o client público do frontend no Keycloak, a configuração esperada costuma ser:

- `Client authentication`: `Off`
- `Standard flow`: `On`
- `Implicit flow`: `Off`
- `Direct access grants`: `Off`

Sugestão para URLs do client:

- Root URL: `http://localhost:5173`
- Home URL: `http://localhost:5173`
- Valid redirect URIs: `http://localhost:5173/*`
- Valid post logout redirect URIs: `http://localhost:5173/*`
- Web origins: `http://localhost:5173`
