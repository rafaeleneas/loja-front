type PurchaseSuccessPageProps = {
  nomeUsuario: string;
  pedidoId: number;
  dataCompra: string;
  onVoltarProdutos: () => void;
  onLogout: () => Promise<void>;
};

function formatarData(dataCompra: string): string {
  const parsed = new Date(dataCompra);
  if (Number.isNaN(parsed.getTime())) return dataCompra;
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "medium"
  }).format(parsed);
}

export default function PurchaseSuccessPage({
  nomeUsuario,
  pedidoId,
  dataCompra,
  onVoltarProdutos,
  onLogout
}: PurchaseSuccessPageProps) {
  return (
    <main className="min-h-screen bg-paper">
      <header className="sticky top-0 z-20 border-b border-black/10 bg-white/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={onLogout}
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold text-ink transition hover:bg-slate-50"
          >
            Logout
          </button>
          <p className="text-sm font-semibold text-ink sm:text-base">Ola {nomeUsuario}</p>
        </div>
      </header>

      <section className="mx-auto flex w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full rounded-2xl border border-black/10 bg-white p-6 shadow-soft">
          <h1 className="text-2xl font-extrabold tracking-tight text-ink">
            Aguardando confirmacao de pagamento
          </h1>
          <p className="mt-4 text-slate-700">
            Numero do pedido: <span className="font-semibold text-ink">#{pedidoId}</span>
          </p>
          <p className="mt-2 text-slate-700">
            Data: <span className="font-semibold text-ink">{formatarData(dataCompra)}</span>
          </p>

          <button
            type="button"
            onClick={onVoltarProdutos}
            className="mt-6 rounded-xl bg-ink px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-black"
          >
            Voltar para produtos
          </button>
        </div>
      </section>
    </main>
  );
}
