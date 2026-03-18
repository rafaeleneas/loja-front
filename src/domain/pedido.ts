import type { CartItem } from "../types/domain";
import type { CriarPedidoPayload } from "../types/pedido";

export function criarPedidoPayload(clienteId: string, carrinho: CartItem[]): CriarPedidoPayload {
  if (!clienteId) {
    throw new Error("ClienteId obrigatorio para criar pedido.");
  }

  if (carrinho.length === 0) {
    throw new Error("Carrinho vazio.");
  }

  return {
    clienteId,
    itens: carrinho.map((item) => ({
      produtoId: item.id,
      quantidade: item.quantidade
    }))
  };
}
