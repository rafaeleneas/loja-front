import type { Product } from "../../types/domain";

type CatalogoSlice = {
  products: Product[];
  productsLoading: boolean;
  productsError: string;
  setProducts: (products: Product[]) => void;
  setProductsLoading: (productsLoading: boolean) => void;
  setProductsError: (productsError: string) => void;
};

type Setter = (partial: Partial<CatalogoSlice>) => void;

export function createCatalogoSlice(set: Setter): CatalogoSlice {
  return {
    products: [],
    productsLoading: true,
    productsError: "",
    setProducts: (products) => set({ products }),
    setProductsLoading: (productsLoading) => set({ productsLoading }),
    setProductsError: (productsError) => set({ productsError })
  };
}

export type { CatalogoSlice };
