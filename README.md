# Loja Front

Frontend da loja construido com React, TypeScript e Vite.

## Requisitos

- Node.js 20+
- npm
- Backend `loja-service` disponivel
- Keycloak disponivel

## Executando localmente

```bash
npm install
npm run dev
```

Aplicacao local:

- `http://localhost:4200`

## Scripts

- `npm run dev`: sobe o frontend em modo desenvolvimento
- `npm run build`: gera o build de producao em `dist/`
- `npm run preview`: publica localmente o build gerado

## Configuracao da aplicacao

O frontend suporta dois jeitos de configurar as URLs:

- desenvolvimento com Vite, usando variaveis `VITE_*` do `.env`
- execucao em container, usando `env-config.js` gerado no startup do Nginx

Fluxo em producao:

1. O navegador abre `index.html`
2. O `index.html` carrega `/env-config.js`
3. O app React le `window.__APP_CONFIG__`
4. Se nao houver valor em runtime, o codigo usa `import.meta.env`
5. Se ainda nao houver valor, entra o fallback padrao de `src/config/env.ts`

Arquivos principais desse fluxo:

- `public/env-config.js`: fallback simples para dev
- `index.html`: carrega `/env-config.js` antes do app
- `src/config/env.ts`: centraliza leitura de runtime config, `VITE_*` e defaults
- `docker/nginx/40-env-config.sh`: gera `env-config.js` com variaveis do container

## Variaveis suportadas

- `VITE_API_BASE_URL`
- `VITE_APP_URL`
- `VITE_KEYCLOAK_URL`
- `VITE_KEYCLOAK_REALM`
- `VITE_KEYCLOAK_CLIENT_ID`
- `VITE_KEYCLOAK_REDIRECT_URI`
- `VITE_KEYCLOAK_POST_LOGOUT_REDIRECT_URI`

Valores padrao do projeto:

- `VITE_API_BASE_URL=http://localhost:8080/api/loja`
- `VITE_APP_URL=http://localhost:4200/`
- `VITE_KEYCLOAK_URL=http://localhost:8081`
- `VITE_KEYCLOAK_REALM=extranet-realm`
- `VITE_KEYCLOAK_CLIENT_ID=loja-frontend`
- `VITE_KEYCLOAK_REDIRECT_URI=http://localhost:4200/`
- `VITE_KEYCLOAK_POST_LOGOUT_REDIRECT_URI=http://localhost:4200/`

## Docker

O `Dockerfile` faz o build com `npm run build` e copia o conteudo de `dist/` para o Nginx.

Na subida do container, o script `docker/nginx/40-env-config.sh` recria `/usr/share/nginx/html/env-config.js` com os valores das variaveis de ambiente do pod ou container.

Isso permite trocar endpoints e configuracoes sem rebuildar a imagem.

## Keycloak local

Para o client publico do frontend no Keycloak, a configuracao esperada costuma ser:

- `Client authentication`: `Off`
- `Standard flow`: `On`
- `Implicit flow`: `Off`
- `Direct access grants`: `Off`

Sugestao para URLs do client:

- Root URL: `http://localhost:4200`
- Home URL: `http://localhost:4200`
- Valid redirect URIs: `http://localhost:4200/*`
- Valid post logout redirect URIs: `http://localhost:4200/*`
- Web origins: `http://localhost:4200`
