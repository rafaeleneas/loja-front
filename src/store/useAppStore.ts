import { create } from "zustand";
import { createAuthSlice, type AuthSlice } from "./slices/authSlice";
import { createUiSlice, type UiSlice } from "./slices/uiSlice";
import { createCatalogoSlice, type CatalogoSlice } from "./slices/catalogoSlice";
import { createCarrinhoSlice, type CarrinhoSlice } from "./slices/carrinhoSlice";

type AppStoreState = AuthSlice & UiSlice & CatalogoSlice & CarrinhoSlice;

export const useAppStore = create<AppStoreState>((set, get) => ({
  ...createAuthSlice(set as any),
  ...createUiSlice(set as any),
  ...createCatalogoSlice(set as any),
  ...createCarrinhoSlice(set as any, get as any)
}));

export type { AppStoreState };
