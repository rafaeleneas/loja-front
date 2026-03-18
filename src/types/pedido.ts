export interface CriarPedidoItemPayload {
  produtoId: number;
  quantidade: number;
}

export interface CriarPedidoPayload {
  clienteId: string;
  itens: CriarPedidoItemPayload[];
}
