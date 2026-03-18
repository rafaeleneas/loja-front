import { useEffect, useState } from "react";
import LoginPage from "./components/LoginPage";
import ProductsPage from "./components/ProductsPage";
import PaymentPage from "./components/PaymentPage";
import PurchaseSuccessPage from "./components/PurchaseSuccessPage";
import { products as mockProducts } from "./data/products";
import {
  getUsername,
  initAuth,
  isAuthenticated,
  login,
  logout,
  refreshToken
} from "./services/authService";
import * as lojaService from "./services/lojaService";
import { useAppStore } from "./store/useAppStore";
import type { Product } from "./types/domain";

export default function App() {
  const [erroPagamento, setErroPagamento] = useState("");
  const [pagamentoEmAndamento, setPagamentoEmAndamento] = useState(false);
  const [pagamentoSolicitado, setPagamentoSolicitado] = useState<{
    pedidoId: number;
    dataCompra: string;
  } | null>(null);
  const authReady = useAppStore((state) => state.authReady);
  const nomeUsuario = useAppStore((state) => state.nomeUsuario);
  const pagina = useAppStore((state) => state.pagina);
  const products = useAppStore((state) => state.products);
  const productsLoading = useAppStore((state) => state.productsLoading);
  const productsError = useAppStore((state) => state.productsError);
  const carrinho = useAppStore((state) => state.carrinho);
  const setAuthReady = useAppStore((state) => state.setAuthReady);
  const setNomeUsuario = useAppStore((state) => state.setNomeUsuario);
  const setPagina = useAppStore((state) => state.setPagina);
  const setProducts = useAppStore((state) => state.setProducts);
  const setProductsLoading = useAppStore((state) => state.setProductsLoading);
  const setProductsError = useAppStore((state) => state.setProductsError);
  const addToCart = useAppStore((state) => state.addToCart);
  const clearCart = useAppStore((state) => state.clearCart);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const authenticated = await initAuth();
        if (authenticated) {
          setNomeUsuario(getUsername() || "usuario");
        } else {
          setNomeUsuario("");
        }
      } finally {
        setAuthReady(true);
      }
    };

    void initializeAuth();
  }, [setAuthReady, setNomeUsuario]);

  useEffect(() => {
    if (!authReady || !isAuthenticated()) return;

    const refreshHandle = window.setInterval(() => {
      void refreshToken().catch(() => {
        setNomeUsuario("");
        clearCart();
        setErroPagamento("");
        setPagamentoSolicitado(null);
        setPagina("produtos");
      });
    }, 20000);

    return () => window.clearInterval(refreshHandle);
  }, [authReady, clearCart, setNomeUsuario, setPagina]);

  const carregarProdutos = async (): Promise<void> => {
    try {
      setProductsLoading(true);
      setProductsError("");
      const safeProducts = await lojaService.listarProdutos();
      setProducts(safeProducts);
    } catch {
      setProducts(mockProducts);
      setProductsError("Nao foi possivel carregar da API. Exibindo lista local.");
    } finally {
      setProductsLoading(false);
    }
  };

  useEffect(() => {
    if (!authReady || !isAuthenticated()) return;
    void carregarProdutos();
  }, [authReady]);

  const handleLogin = async (): Promise<void> => {
    setPagina("produtos");
    await login();
  };

  const adicionarAoCarrinho = (product: Product, quantidade: number): void => {
    addToCart(product, quantidade);
  };

  const handleLogout = async (): Promise<void> => {
    await logout();
    setNomeUsuario("");
    clearCart();
    setErroPagamento("");
    setPagamentoSolicitado(null);
    setPagina("produtos");
  };

  const handleSolicitarPagamento = async (): Promise<void> => {
    if (pagamentoEmAndamento) {
      return;
    }

    try {
      setPagamentoEmAndamento(true);
      setErroPagamento("");
      const pagamentoSolicitado = await lojaService.solicitarPagamento(carrinho);
      clearCart();
      setPagamentoSolicitado(pagamentoSolicitado);
      setPagina("sucesso");
    } catch (error) {
      const mensagem = error instanceof Error ? error.message : "Falha ao solicitar pagamento.";
      setErroPagamento(mensagem);
      console.error("Erro ao solicitar pagamento:", error);
    } finally {
      setPagamentoEmAndamento(false);
    }
  };

  if (!authReady) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-paper">
        <p className="text-sm font-semibold text-slate-700">Inicializando autenticacao...</p>
      </main>
    );
  }

  if (!isAuthenticated()) {
    return <LoginPage onLogin={handleLogin} />;
  }

  if (pagina === "pagamento") {
    return (
      <PaymentPage
        nomeUsuario={nomeUsuario}
        carrinho={carrinho}
        errorMessage={erroPagamento}
        isSubmitting={pagamentoEmAndamento}
        onBack={() => setPagina("produtos")}
        onLogout={handleLogout}
        onSolicitarPagamento={handleSolicitarPagamento}
        onClearError={() => setErroPagamento("")}
      />
    );
  }

  if (pagina === "produtos") {
    return (
      <ProductsPage
        nomeUsuario={nomeUsuario}
        products={products}
        loading={productsLoading}
        error={productsError}
        carrinho={carrinho}
        onAddToCart={adicionarAoCarrinho}
        onOpenPayment={() => {
          setErroPagamento("");
          setPagina("pagamento");
        }}
        onLogout={handleLogout}
        onReloadProducts={carregarProdutos}
      />
    );
  }

  if (pagina === "sucesso" && pagamentoSolicitado) {
    return (
      <PurchaseSuccessPage
        nomeUsuario={nomeUsuario}
        pedidoId={pagamentoSolicitado.pedidoId}
        dataCompra={pagamentoSolicitado.dataCompra}
        onVoltarProdutos={() => {
          setPagamentoSolicitado(null);
          setPagina("produtos");
        }}
        onLogout={handleLogout}
      />
    );
  }

  return null;
}
