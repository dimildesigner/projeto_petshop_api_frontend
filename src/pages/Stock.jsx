import { useEffect, useState } from "react";
import { api } from "../services/api";

const MOTIVOS_ENTRADA = ["Reposição", "Ajuste"];
const MOTIVOS_SAIDA   = ["Venda", "Perda", "Ajuste"];

function StatusBadge({ status }) {
  const styles = {
    CRITICO: "bg-red-50 text-red-700 border border-red-100",
    ATENCAO: "bg-yellow-50 text-yellow-700 border border-yellow-100",
    NORMAL:  "bg-green-50 text-green-700 border border-green-100",
  };
  const labels = { CRITICO: "Crítico", ATENCAO: "Atenção", NORMAL: "OK" };
  return (
    <span className={`text-xs px-2 py-1 rounded-md font-medium ${styles[status] || styles.NORMAL}`}>
      {labels[status] || "OK"}
    </span>
  );
}

function MovementModal({ product, onClose, onSaved }) {
  const [tipo, setTipo] = useState("entrada");
  const [motivo, setMotivo] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [observacao, setObservacao] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const motivos = tipo === "entrada" ? MOTIVOS_ENTRADA : MOTIVOS_SAIDA;

  const handleSubmit = async () => {
    setError("");
    if (!motivo || !quantidade) {
      setError("Preencha motivo e quantidade");
      return;
    }
    setLoading(true);
    try {
      await api.post("/stock/movement", {
        produtoId: product._id,
        tipo,
        motivo,
        quantidade: Number(quantidade),
        observacao,
      });
      onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || "Erro ao registrar movimentação");
    } finally {
      setLoading(false);
    }
  };

  const estoqueDepois = quantidade
    ? tipo === "entrada"
      ? product.estoque_atual + Number(quantidade)
      : product.estoque_atual - Number(quantidade)
    : null;

  const estoqueInsuficiente = tipo === "saida" && Number(quantidade) > product.estoque_atual;
  const ficaAbaixoMinimo = estoqueDepois !== null && estoqueDepois <= product.estoque_minimo;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl border border-stone-200 w-full max-w-md mx-4">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
          <div>
            <h3 className="text-stone-800 font-medium text-sm">Registrar movimentação</h3>
            <p className="text-xs text-stone-400 mt-0.5 truncate max-w-xs">{product.nome}</p>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600 transition-colors">
            <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="px-5 py-4 flex flex-col gap-4">

          {/* Tipo */}
          <div className="grid grid-cols-2 gap-2">
            {["entrada", "saida"].map((t) => (
              <button
                key={t}
                onClick={() => { setTipo(t); setMotivo(""); }}
                className={`h-10 rounded-lg text-sm font-medium transition-colors border ${
                  tipo === t
                    ? t === "entrada"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-red-50 text-red-700 border-red-200"
                    : "bg-stone-50 text-stone-400 border-stone-200 hover:bg-stone-100"
                }`}
              >
                {t === "entrada" ? "Entrada" : "Saída"}
              </button>
            ))}
          </div>

          {/* Motivo */}
          <div>
            <label className="block text-xs text-stone-500 mb-1">Motivo</label>
            <select
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              className="w-full h-9 px-3 rounded-lg border border-stone-200 bg-stone-50 text-sm text-stone-800 outline-none focus:border-orange-400 transition-colors"
            >
              <option value="">Selecione</option>
              {motivos.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          {/* Quantidade */}
          <div>
            <label className="block text-xs text-stone-500 mb-1">Quantidade</label>
            <input
              type="number"
              min="1"
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
              placeholder="0"
              className="w-full h-9 px-3 rounded-lg border border-stone-200 bg-stone-50 text-sm text-stone-800 outline-none focus:border-orange-400 transition-colors"
            />
          </div>

          {/* Preview do estoque */}
          {estoqueDepois !== null && (
            <div className={`rounded-lg p-3 text-sm ${
              estoqueInsuficiente
                ? "bg-red-50 border border-red-100"
                : ficaAbaixoMinimo
                  ? "bg-yellow-50 border border-yellow-100"
                  : "bg-green-50 border border-green-100"
            }`}>
              <div className="flex justify-between items-center">
                <span className="text-stone-500 text-xs">Estoque atual</span>
                <span className="font-medium text-stone-700">{product.estoque_atual} un.</span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-stone-500 text-xs">Após movimentação</span>
                <span className={`font-medium text-sm ${
                  estoqueInsuficiente ? "text-red-600" : ficaAbaixoMinimo ? "text-yellow-600" : "text-green-600"
                }`}>
                  {estoqueInsuficiente ? "Insuficiente!" : `${estoqueDepois} un.`}
                </span>
              </div>
              {ficaAbaixoMinimo && !estoqueInsuficiente && (
                <p className="text-xs text-yellow-600 mt-1.5">
                  ⚠️ Ficará abaixo do estoque mínimo ({product.estoque_minimo} un.)
                </p>
              )}
            </div>
          )}

          {/* Observação */}
          <div>
            <label className="block text-xs text-stone-500 mb-1">Observação (opcional)</label>
            <input
              type="text"
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              placeholder="Ex: NF 1234, fornecedor X..."
              className="w-full h-9 px-3 rounded-lg border border-stone-200 bg-stone-50 text-sm text-stone-800 outline-none focus:border-orange-400 transition-colors"
            />
          </div>

          {error && (
            <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
        </div>

        {/* Ações */}
        <div className="flex gap-2 px-5 py-4 border-t border-stone-100">
          <button
            onClick={onClose}
            className="flex-1 h-9 rounded-lg border border-stone-200 text-sm text-stone-500 hover:bg-stone-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || estoqueInsuficiente}
            className="flex-1 h-9 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? "Salvando..." : "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
}

function HistoryModal({ product, onClose }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/stock/history/${product._id}`);
        setHistory(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [product._id]);

  const formatDate = (date) =>
    new Date(date).toLocaleString("pt-BR", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl border border-stone-200 w-full max-w-lg mx-4 max-h-[80vh] flex flex-col">

        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100 shrink-0">
          <div>
            <h3 className="text-stone-800 font-medium text-sm">Histórico de movimentações</h3>
            <p className="text-xs text-stone-400 mt-0.5 truncate max-w-xs">{product.nome}</p>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600 transition-colors">
            <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-5 py-3">
          {loading ? (
            <p className="text-sm text-stone-400 text-center py-8">Carregando...</p>
          ) : history.length === 0 ? (
            <p className="text-sm text-stone-400 text-center py-8">Nenhuma movimentação registrada.</p>
          ) : (
            history.map((m) => (
              <div key={m._id} className="flex items-start gap-3 py-3 border-b border-stone-100 last:border-0">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                  m.tipo === "entrada" ? "bg-green-50" : "bg-red-50"
                }`}>
                  <svg viewBox="0 0 16 16" fill="none" className={`w-4 h-4 ${m.tipo === "entrada" ? "text-green-600" : "text-red-500"}`}>
                    {m.tipo === "entrada"
                      ? <path d="M8 3v10M3 8l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      : <path d="M8 13V3M3 8l5-5 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    }
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${m.tipo === "entrada" ? "text-green-700" : "text-red-600"}`}>
                      {m.tipo === "entrada" ? "+" : "-"}{m.quantidade} un. — {m.motivo}
                    </span>
                    <span className="text-xs text-stone-400">{formatDate(m.createdAt)}</span>
                  </div>
                  <p className="text-xs text-stone-400 mt-0.5">
                    {m.estoque_antes} → {m.estoque_depois} un.
                    {m.observacao && ` · ${m.observacao}`}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default function Stock() {
  const [products, setProducts] = useState([]);
  const [movingProduct, setMovingProduct] = useState(null);
  const [historyProduct, setHistoryProduct] = useState(null);
  const [busca, setBusca] = useState("");

  const loadProducts = async () => {
    try {
      const res = await api.get("/stock/products");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { loadProducts(); }, []);

  const filtered = products.filter((p) =>
    p.nome?.toLowerCase().includes(busca.toLowerCase())
  );

  const criticos = products.filter((p) => p.status === "CRITICO").length;
  const atencao  = products.filter((p) => p.status === "ATENCAO").length;

  return (
    <div>
      {movingProduct && (
        <MovementModal
          product={movingProduct}
          onClose={() => setMovingProduct(null)}
          onSaved={loadProducts}
        />
      )}
      {historyProduct && (
        <HistoryModal
          product={historyProduct}
          onClose={() => setHistoryProduct(null)}
        />
      )}

      {/* Cabeçalho */}
      <div className="mb-6">
        <h2 className="text-stone-800 font-medium text-lg">Controle de estoque</h2>
        <p className="text-stone-400 text-sm">Registre entradas e saídas de produtos</p>
      </div>

      {/* Alertas */}
      {(criticos > 0 || atencao > 0) && (
        <div className="flex gap-3 mb-6">
          {criticos > 0 && (
            <div className="flex-1 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
              <p className="text-xs text-red-400 mb-0.5">Estoque crítico</p>
              <p className="text-xl font-medium text-red-600">{criticos} produto{criticos > 1 ? "s" : ""}</p>
            </div>
          )}
          {atencao > 0 && (
            <div className="flex-1 bg-yellow-50 border border-yellow-100 rounded-xl px-4 py-3">
              <p className="text-xs text-yellow-500 mb-0.5">Requer atenção</p>
              <p className="text-xl font-medium text-yellow-600">{atencao} produto{atencao > 1 ? "s" : ""}</p>
            </div>
          )}
        </div>
      )}

      {/* Busca */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar produto..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full h-9 px-3 rounded-lg border border-stone-200 bg-white text-sm text-stone-800 outline-none focus:border-orange-400 transition-colors"
        />
      </div>

      {/* Tabela */}
      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
        <div className="grid grid-cols-[56px_2fr_1fr_1fr_1fr_160px] px-4 py-2.5 bg-stone-50 border-b border-stone-200 text-xs text-stone-400 font-medium">
          <span>Img</span>
          <span>Produto</span>
          <span>Estoque</span>
          <span>Mínimo</span>
          <span>Status</span>
          <span>Ações</span>
        </div>

        {filtered.length === 0 ? (
          <p className="text-sm text-stone-400 text-center py-10">Nenhum produto encontrado.</p>
        ) : (
          filtered.map((p) => (
            <div
              key={p._id}
              className={`grid grid-cols-[56px_2fr_1fr_1fr_1fr_160px] px-4 py-3 border-b border-stone-100 last:border-0 items-center ${
                p.status === "CRITICO" ? "bg-red-50/30" : p.status === "ATENCAO" ? "bg-yellow-50/30" : ""
              }`}
            >
              <div>
                {p.image ? (
                  <img src={p.image} alt={p.nome} className="w-10 h-10 object-cover rounded-lg"/>
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-stone-100"/>
                )}
              </div>
              <div>
                <p className="text-sm text-stone-800 font-medium leading-tight">{p.nome}</p>
                <p className="text-xs text-stone-400 mt-0.5">
                  {[p.especie, p.categoria].filter(Boolean).join(" · ")}
                </p>
              </div>
              <span className="text-sm text-stone-700 font-medium">{p.estoque_atual} un.</span>
              <span className="text-sm text-stone-400">{p.estoque_minimo} un.</span>
              <StatusBadge status={p.status} />
              <div className="flex gap-2">
                <button
                  onClick={() => setMovingProduct(p)}
                  className="text-xs px-2.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                >
                  Movimentar
                </button>
                <button
                  onClick={() => setHistoryProduct(p)}
                  className="text-xs px-2.5 py-1.5 border border-stone-200 text-stone-500 hover:bg-stone-50 rounded-lg transition-colors"
                >
                  Histórico
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}