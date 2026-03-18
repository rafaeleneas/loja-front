import type { CartItem, Product } from "../../types/domain";

type CarrinhoSlice = {
  carrinho: CartItem[];
  addToCart: (product: Product, quantidade: number) => void;
  clearCart: () => void;
};

type Setter = (partial: Partial<CarrinhoSlice> | ((state: CarrinhoSlice) => Partial<CarrinhoSlice>)) => void;
type Getter = () => CarrinhoSlice;

export function createCarrinhoSlice(set: Setter, get: Getter): CarrinhoSlice {
  return {
    carrinho: [],
    addToCart: (product, quantidade) =>
      set((state) => {
        const itemExistente = state.carrinho.find((item) => item.id === product.id);

        if (itemExistente) {
          return {
            carrinho: state.carrinho.map((item) =>
              item.id === product.id ? { ...item, quantidade: item.quantidade + quantidade } : item
            )
          };
        }

        return {
          carrinho: [...state.carrinho, { ...product, quantidade }]
        };
      }),
    clearCart: () => {
      if (get().carrinho.length === 0) return;
      set({ carrinho: [] });
    }
  };
}

export type { CarrinhoSlice };
