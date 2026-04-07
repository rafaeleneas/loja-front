import type { CartItem, Product } from "../../types/domain";

type CarrinhoSlice = {
  carrinho: CartItem[];
  addToCart: (product: Product, quantidade: number) => void;
  increaseQuantity: (productId: number) => void;
  decreaseQuantity: (productId: number) => void;
  removeFromCart: (productId: number) => void;
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
    increaseQuantity: (productId) =>
      set((state) => ({
        carrinho: state.carrinho.map((item) =>
          item.id === productId ? { ...item, quantidade: item.quantidade + 1 } : item
        )
      })),
    decreaseQuantity: (productId) =>
      set((state) => ({
        carrinho: state.carrinho.flatMap((item) => {
          if (item.id !== productId) return [item];
          if (item.quantidade <= 1) return [];
          return [{ ...item, quantidade: item.quantidade - 1 }];
        })
      })),
    removeFromCart: (productId) =>
      set((state) => ({
        carrinho: state.carrinho.filter((item) => item.id !== productId)
      })),
    clearCart: () => {
      if (get().carrinho.length === 0) return;
      set({ carrinho: [] });
    }
  };
}

export type { CarrinhoSlice };
