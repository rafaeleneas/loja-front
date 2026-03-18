type AuthSlice = {
  authReady: boolean;
  nomeUsuario: string;
  setAuthReady: (ready: boolean) => void;
  setNomeUsuario: (nomeUsuario: string) => void;
};

type Setter = (partial: Partial<AuthSlice>) => void;

export function createAuthSlice(set: Setter): AuthSlice {
  return {
    authReady: false,
    nomeUsuario: "",
    setAuthReady: (ready) => set({ authReady: ready }),
    setNomeUsuario: (nomeUsuario) => set({ nomeUsuario })
  };
}

export type { AuthSlice };
