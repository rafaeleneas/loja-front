import type { Page } from "../../types/domain";

type UiSlice = {
  pagina: Page;
  setPagina: (pagina: Page) => void;
};

type Setter = (partial: Partial<UiSlice>) => void;

export function createUiSlice(set: Setter): UiSlice {
  return {
    pagina: "produtos",
    setPagina: (pagina) => set({ pagina })
  };
}

export type { UiSlice };
