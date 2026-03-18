import { useMemo } from "react";
import type { CartItem } from "../types/domain";

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL"
});

type PaymentPageProps = {
  nomeUsuario: string;
  carrinho: CartItem[];
  errorMessage: string;
  isSubmitting: boolean;
  onBack: () => void;
  onLogout: () => Promise<void>;
  onSolicitarPagamento: () => Promise<void>;
  onClearError: () => void;
};

export default function PaymentPage({
  nomeUsuario,
  carrinho,
  errorMessage,
  isSubmitting,
  onBack,
  onLogout,
  onSolicitarPagamento,
  onClearError
}: PaymentPageProps) {
  const quantidadeTotal = useMemo(
    () => carrinho.reduce((acumulado, item) => acumulado + item.quantidade, 0),
    [carrinho]
  );

  const valorTotal = useMemo(
    () => carrinho.reduce((acumulado, item) => acumulado + item.preco * item.quantidade, 0),
    [carrinho]
  );

  return (
    <main className="min-h-screen bg-paper">
      <header className="sticky top-0 z-20 border-b border-black/10 bg-white/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClearError();
                onBack();
              }}
              className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold text-ink transition hover:bg-slate-50"
            >
              Voltar
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold text-ink transition hover:bg-slate-50"
            >
              Logout
            </button>
          </div>
          <p className="text-sm font-semibold text-ink sm:text-base">Ola {nomeUsuario}</p>
        </div>
      </header>

      <section className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-soft">
          <h1 className="text-2xl font-extrabold tracking-tight text-ink">Sua cesta</h1>

          {errorMessage ? (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          ) : null}

          {carrinho.length === 0 ? (
            <p className="mt-5 text-sm text-slate-600">Sua cesta esta vazia.</p>
          ) : (
            <ul className="mt-5 space-y-3">
              {carrinho.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                >
                  <div>
                    <p className="font-semibold text-ink">{item.nome}</p>
                    <p className="text-sm text-slate-600">Qtde: {item.quantidade}</p>
                  </div>
                  <p className="font-bold text-accent">
                    {currency.format(item.preco * item.quantidade)}
                  </p>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-6 rounded-xl border border-black/10 bg-soft p-4">
            <p className="text-sm text-slate-700">Qtde total: {quantidadeTotal}</p>
            <p className="mt-1 text-lg font-extrabold text-ink">
              Total: {currency.format(valorTotal)}
            </p>
          </div>

          <button
            type="button"
            onClick={onSolicitarPagamento}
            disabled={carrinho.length === 0 || isSubmitting}
            className="mt-6 w-full rounded-xl bg-ink px-4 py-3 text-sm font-semibold text-white transition enabled:hover:-translate-y-0.5 enabled:hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Processando pagamento..." : "Realizar pagamento"}
          </button>
        </div>
      </section>
    </main>
  );
}
