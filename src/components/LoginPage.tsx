import type { FormEvent } from "react";

type LoginPageProps = {
  onLogin: () => Promise<void>;
};

export default function LoginPage({ onLogin }: LoginPageProps) {
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onLogin();
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-paper px-4 py-10">
      <div className="pointer-events-none absolute -left-16 -top-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-orange-300/30 blur-3xl" />

      <section className="w-full max-w-md rounded-3xl border border-black/10 bg-white/80 p-8 shadow-soft backdrop-blur-sm">
        <h1 className="text-3xl font-extrabold tracking-tight text-ink">Entrar na Loja</h1>
        <p className="mt-2 text-sm text-slate-600">
          Clique abaixo para autenticar no Keycloak com Authorization Code + PKCE.
        </p>

        <form className="mt-8 space-y-4" onSubmit={submit}>
          <button
            type="submit"
            className="w-full rounded-xl bg-ink px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-black"
          >
            Entrar com Keycloak
          </button>
        </form>
      </section>
    </main>
  );
}
