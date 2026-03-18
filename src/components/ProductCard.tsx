import { useState } from "react";
import type { Product } from "../types/domain";

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL"
});

type ProductCardProps = {
  product: Product;
  onAdd: (product: Product, quantidade: number) => void;
};

export default function ProductCard({ product, onAdd }: ProductCardProps) {
  const [quantidade, setQuantidade] = useState<number>(1);

  const diminuir = () => setQuantidade((atual) => Math.max(1, atual - 1));
  const aumentar = () => setQuantidade((atual) => atual + 1);

  const adicionar = () => {
    onAdd(product, quantidade);
    setQuantidade(1);
  };

  return (
    <article className="group rounded-2xl border border-black/10 bg-white p-4 shadow-soft transition hover:-translate-y-1">
      <img
        src="/product-placeholder.svg"
        alt={product.nome}
        className="h-40 w-full rounded-xl object-cover"
      />
      <h3 className="mt-4 text-base font-bold text-ink">{product.nome}</h3>
      <p className="mt-1 text-lg font-extrabold text-accent">{currency.format(product.preco)}</p>

      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="inline-flex items-center rounded-xl border border-slate-300">
          <button
            type="button"
            onClick={diminuir}
            className="h-10 w-10 text-lg font-bold text-slate-700 transition hover:bg-slate-100"
            aria-label="Diminuir quantidade"
          >
            -
          </button>
          <span className="w-10 text-center text-sm font-semibold text-ink">{quantidade}</span>
          <button
            type="button"
            onClick={aumentar}
            className="h-10 w-10 text-lg font-bold text-slate-700 transition hover:bg-slate-100"
            aria-label="Aumentar quantidade"
          >
            +
          </button>
        </div>

        <button
          type="button"
          onClick={adicionar}
          className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-700"
        >
          Add Carrinho
        </button>
      </div>
    </article>
  );
}
