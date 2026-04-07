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
  onIncreaseQuantity: (productId: number) => void;
  onDecreaseQuantity: (productId: number) => void;
  onRemoveFromCart: (productId: number) => void;
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
  onIncreaseQuantity,
  onDecreaseQuantity,
  onRemoveFromCart,
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
                    <div className="mt-2 inline-flex items-center rounded-xl border border-slate-300 bg-white">
                      <button
                        type="button"
                        onClick={() => onDecreaseQuantity(item.id)}
                        className="h-9 w-9 text-lg font-bold text-slate-700 transition hover:bg-slate-100"
                        aria-label={`Diminuir quantidade de ${item.nome}`}
                      >
                        -
                      </button>
                      <span className="w-10 text-center text-sm font-semibold text-ink">
                        {item.quantidade}
                      </span>
                      <button
                        type="button"
                        onClick={() => onIncreaseQuantity(item.id)}
                        className="h-9 w-9 text-lg font-bold text-slate-700 transition hover:bg-slate-100"
                        aria-label={`Aumentar quantidade de ${item.nome}`}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="font-bold text-accent">
                      {currency.format(item.preco * item.quantidade)}
                    </p>
                    <button
                      type="button"
                      onClick={() => onRemoveFromCart(item.id)}
                      className="rounded-lg border border-slate-300 bg-white p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                      aria-label={`Remover ${item.nome} da cesta`}
                      title="Remover item"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-4 w-4"
                      >
                        <path d="M4 7h16" />
                        <path d="M10 11v6" />
                        <path d="M14 11v6" />
                        <path d="M6 7l1 12h10l1-12" />
                        <path d="M9 7V4h6v3" />
                      </svg>
                    </button>
                  </div>
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
