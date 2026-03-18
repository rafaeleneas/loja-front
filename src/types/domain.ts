export interface Product {
  id: number;
  nome: string;
  preco: number;
  descricao?: string;
  estoque?: number;
  ativo?: boolean;
}

export interface CartItem extends Product {
  quantidade: number;
}

export type Page = "produtos" | "pagamento" | "sucesso";
