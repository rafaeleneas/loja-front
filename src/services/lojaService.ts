import { API_BASE_URL } from "../config/env";
import { criarPedidoPayload } from "../domain/pedido";
import type { CartItem, Product } from "../types/domain";
import { generateIdempotencyKey, validateIdempotencyKey } from "../utils/idempotency";
import { getClienteIdFromToken, getToken, refreshToken } from "./authService";

type PedidoCriadoResponse = {
  id: number;
  criadoEm?: string;
};

export type PagamentoSolicitado = {
  pedidoId: number;
  dataCompra: string;
};

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const data = await response.json();
    if (typeof data === "string") return data;
    if (data?.message) return String(data.message);
    if (data?.erro) return String(data.erro);
    return JSON.stringify(data);
  } catch {
    try {
      return await response.text();
    } catch {
      return "";
    }
  }
}

async function authorizedFetch(path: string, init?: RequestInit): Promise<Response> {
  await refreshToken();
  const token = getToken();
  if (!token) {
    throw new Error("Usuario nao autenticado.");
  }

  const url = `${API_BASE_URL}${path}`;

  try {
    return await fetch(url, {
      ...init,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...(init?.headers || {})
      }
    });
  } catch (error) {
    const reason =
      error instanceof Error && error.message ? error.message : "Erro desconhecido de rede.";

    throw new Error(
      `Falha de rede ao acessar ${url}. Verifique se a API esta ativa e se o CORS libera a origem do frontend. Detalhe: ${reason}`
    );
  }
}

export async function listarProdutos(): Promise<Product[]> {
  const response = await authorizedFetch("/produtos", {
    method: "GET"
  });

  if (!response.ok) {
    throw new Error(`Falha ao buscar produtos: HTTP ${response.status}`);
  }

  const data: unknown = await response.json();
  return Array.isArray(data) ? (data as Product[]) : [];
}

export async function solicitarPagamento(carrinho: CartItem[]): Promise<PagamentoSolicitado> {
  if (carrinho.length === 0) {
    throw new Error("Carrinho vazio.");
  }
  const clienteId = getClienteIdFromToken();
  if (!clienteId) {
    throw new Error("Token nao contem client_id/cliente_id para criar pedido.");
  }
  const payload = criarPedidoPayload(String(clienteId), carrinho);
  const idempotencyKey = generateIdempotencyKey();
  validateIdempotencyKey(idempotencyKey);

  const pedidoResponse = await authorizedFetch("/pedidos", {
    method: "POST",
    headers: {
      "Idempotency-Key": idempotencyKey
    },
    body: JSON.stringify(payload)
  });

  if (!pedidoResponse.ok) {
    const details = await readErrorMessage(pedidoResponse);
    throw new Error(`Falha ao criar pedido: HTTP ${pedidoResponse.status}${details ? ` - ${details}` : ""}`);
  }

  const pedidoCriado = (await pedidoResponse.json()) as PedidoCriadoResponse;

  const solicitarPagamentoResponse = await authorizedFetch(`/pedidos/${pedidoCriado.id}/solicitar-pagamento`, {
    method: "POST"
  });

  if (!solicitarPagamentoResponse.ok) {
    const details = await readErrorMessage(solicitarPagamentoResponse);
    throw new Error(
      `Falha ao solicitar pagamento: HTTP ${solicitarPagamentoResponse.status}${details ? ` - ${details}` : ""}`
    );
  }

  return {
    pedidoId: pedidoCriado.id,
    dataCompra: pedidoCriado.criadoEm ?? new Date().toISOString()
  };
}
