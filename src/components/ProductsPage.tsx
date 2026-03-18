import { useMemo, useState } from "react";
import ProductCard from "./ProductCard";
import type { CartItem, Product } from "../types/domain";

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL"
});

type ProductsPageProps = {
  nomeUsuario: string;
  products: Product[];
  loading: boolean;
  error: string;
  carrinho: CartItem[];
  onAddToCart: (product: Product, quantidade: number) => void;
  onOpenPayment: () => void;
  onLogout: () => Promise<void>;
  onReloadProducts: () => Promise<void>;
};

export default function ProductsPage({
  nomeUsuario,
  products,
  loading,
  error,
  carrinho,
  onAddToCart,
  onOpenPayment,
  onLogout,
  onReloadProducts
}: ProductsPageProps) {
  const [filtro, setFiltro] = useState<string>("");

  const produtosFiltrados = useMemo(() => {
    const termo = filtro.trim().toLowerCase();
    if (!termo) return products;
    return products.filter((produto) => produto.nome.toLowerCase().includes(termo));
  }, [filtro, products]);

  const valorTotal = useMemo(
    () => carrinho.reduce((acumulado, item) => acumulado + item.preco * item.quantidade, 0),
    [carrinho]
  );

  const quantidadeTotal = useMemo(
    () => carrinho.reduce((acumulado, item) => acumulado + item.quantidade, 0),
    [carrinho]
  );

  return (
    <main className="min-h-screen bg-paper">
      <header className="sticky top-0 z-20 border-b border-black/10 bg-white/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <p className="text-base font-extrabold tracking-tight text-ink">Lista de Produtos</p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onLogout}
              className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold text-ink transition hover:bg-slate-50"
            >
              Logout
            </button>
            <button
              type="button"
              onClick={onOpenPayment}
              className="relative rounded-xl border border-black/10 bg-white p-2 transition hover:bg-slate-50"
              aria-label="Abrir cesta"
              title={`Sua cesta: ${currency.format(valorTotal)}`}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-6 w-6 text-accent"
              >
                <path d="M4 10h16l-1.5 8h-13z" />
                <path d="M9 10 12 5l3 5" />
              </svg>
              <span className="absolute -right-1 -top-1 rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-bold text-white">
                {quantidadeTotal}
              </span>
            </button>
            <p className="text-sm font-semibold text-ink sm:text-base">Ola {nomeUsuario}</p>
          </div>
        </div>
      </header>

      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {error ? (
          <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <span>{error}</span>
            <button
              type="button"
              onClick={onReloadProducts}
              className="rounded-lg border border-amber-300 bg-white px-3 py-1.5 font-semibold hover:bg-amber-100"
            >
              Tentar API
            </button>
          </div>
        ) : null}

        <div className="mb-8 rounded-2xl border border-black/10 bg-white p-4 shadow-soft sm:p-6">
          <label htmlFor="filtro" className="mb-2 block text-sm font-semibold text-ink">
            Filtro por nome do produto
          </label>
          <input
            id="filtro"
            type="text"
            value={filtro}
            onChange={(event) => setFiltro(event.target.value)}
            placeholder="Ex.: Teclado"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30"
          />
        </div>

        {loading ? (
          <p className="text-sm font-semibold text-slate-600">Carregando produtos...</p>
        ) : produtosFiltrados.length === 0 ? (
          <p className="text-sm font-semibold text-slate-600">Nenhum produto encontrado.</p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {produtosFiltrados.map((product) => (
              <ProductCard key={product.id} product={product} onAdd={onAddToCart} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
