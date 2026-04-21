import { useEffect, useState } from "react";
import { api } from "../services/api";

const STATUS_CONFIG = {
  atencao: {
    bg: "bg-yellow-50",
    border: "border-yellow-100",
    text: "text-yellow-700",
    badge: "bg-yellow-50 text-yellow-700 border border-yellow-100",
  },
  urgente: {
    bg: "bg-orange-50",
    border: "border-orange-100",
    text: "text-orange-700",
    badge: "bg-orange-50 text-orange-700 border border-orange-100",
  },
  critico: {
    bg: "bg-red-50",
    border: "border-red-100",
    text: "text-red-700",
    badge: "bg-red-50 text-red-700 border border-red-100",
  },
  vencendo: {
    bg: "bg-red-100",
    border: "border-red-200",
    text: "text-red-800",
    badge: "bg-red-100 text-red-800 border border-red-200",
  },
  vencido: {
    bg: "bg-stone-50",
    border: "border-stone-200",
    text: "text-stone-500",
    badge: "bg-stone-100 text-stone-500 border border-stone-200",
  },
};

function DiscountModal({ product, onClose }) {
  const [desconto, setDesconto] = useState(product.promocao.desconto);
  const precoPromocional = product.preco * (1 - desconto / 100);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl border border-stone-200 w-full max-w-sm mx-4">
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
          <h3 className="text-stone-800 font-medium text-sm">
            Ajustar desconto
          </h3>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 transition-colors"
          >
            <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
              <path
                d="M3 3l10 10M13 3L3 13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="px-5 py-4 flex flex-col gap-4">
          <p className="text-xs text-stone-500 truncate">{product.nome}</p>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-xs text-stone-500">Desconto</label>
              <span className="text-sm font-medium text-orange-500">
                {desconto}%
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="70"
              step="5"
              value={desconto}
              onChange={(e) => setDesconto(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-stone-300 mt-1">
              <span>5%</span>
              <span>70%</span>
            </div>
          </div>

          <div className="bg-stone-50 border border-stone-200 rounded-xl p-3">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-stone-400">Preço original</span>
              <span className="text-stone-500 line-through">
                {product.preco.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-stone-600 font-medium">
                Preço promocional
              </span>
              <span className="text-green-600 font-medium">
                {precoPromocional.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 px-5 py-4 border-t border-stone-100">
          <button
            onClick={onClose}
            className="flex-1 h-9 rounded-lg border border-stone-200 text-sm text-stone-500 hover:bg-stone-50 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Promotions() {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adjusting, setAdjusting] = useState(null);
  const [filtroStatus, setFiltroStatus] = useState("");

  const loadPromotions = async () => {
    try {
      const res = await api.get("/promotions");
      setPromotions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPromotions();
  }, []);

  const filtered = filtroStatus
    ? promotions.filter((p) => p.promocao.status === filtroStatus)
    : promotions;

  const contadores = {
    atencao: promotions.filter((p) => p.promocao.status === "atencao").length,
    urgente: promotions.filter((p) => p.promocao.status === "urgente").length,
    critico: promotions.filter((p) => p.promocao.status === "critico").length,
    vencendo: promotions.filter((p) => p.promocao.status === "vencendo").length,
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-stone-400 text-sm">Carregando promoções...</p>
      </div>
    );
  }

  return (
    <div>
      {adjusting && (
        <DiscountModal product={adjusting} onClose={() => setAdjusting(null)} />
      )}

      {/* Cabeçalho */}
      <div className="mb-6">
        <h2 className="text-stone-800 font-medium text-lg">
          Cantinho da Oportunidade
        </h2>
        <p className="text-stone-400 text-sm">
          Produtos com validade próxima e descontos automáticos sugeridos
        </p>
      </div>

      {promotions.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-xl p-10 text-center">
          <p className="text-stone-600 font-medium text-sm">
            Nenhum produto próximo ao vencimento
          </p>
          <p className="text-stone-400 text-xs mt-1">
            Adicione datas de validade no cadastro de produtos das categorias
            Ração, Petiscos e Medicamentos
          </p>
        </div>
      ) : (
        <>
          {/* Cards de contadores */}
          <div className="grid grid-cols-2 gap-3 mb-6 lg:grid-cols-4">
            {[
              {
                key: "atencao",
                label: "Atenção",
                sub: "90 a 61 dias",
                color: "yellow",
              },
              {
                key: "urgente",
                label: "Urgente",
                sub: "60 a 31 dias",
                color: "orange",
              },
              {
                key: "critico",
                label: "Crítico",
                sub: "30 a 16 dias",
                color: "red",
              },
              {
                key: "vencendo",
                label: "Vence em breve",
                sub: "≤ 15 dias",
                color: "red",
              },
            ].map(({ key, label, sub, color }) => {
              const colorMap = {
                yellow: "bg-yellow-50 border-yellow-100 text-yellow-700",
                orange: "bg-orange-50 border-orange-100 text-orange-600",
                red: "bg-red-50 border-red-100 text-red-700",
              };
              return (
                <button
                  key={key}
                  onClick={() =>
                    setFiltroStatus(filtroStatus === key ? "" : key)
                  }
                  className={`rounded-xl border p-4 text-left transition-all ${
                    filtroStatus === key
                      ? `${colorMap[color]} ring-2 ring-offset-1 ring-orange-300`
                      : `${colorMap[color]} opacity-80 hover:opacity-100`
                  }`}
                >
                  <p className="text-xs opacity-70 mb-1">{label}</p>
                  <p className="text-2xl font-medium">{contadores[key]}</p>
                  <p className="text-xs opacity-60 mt-1">{sub}</p>
                </button>
              );
            })}
          </div>

          {filtroStatus && (
            <div className="flex justify-end mb-3">
              <button
                onClick={() => setFiltroStatus("")}
                className="text-xs text-orange-400 hover:text-orange-600 transition-colors"
              >
                Limpar filtro
              </button>
            </div>
          )}

          {/* Lista de produtos */}
          <div className="flex flex-col gap-3">
            {filtered.map((p) => {
              const cfg =
                STATUS_CONFIG[p.promocao.status] || STATUS_CONFIG.atencao;
              return (
                <div
                  key={p._id}
                  className={`${cfg.bg} border ${cfg.border} rounded-xl p-4 flex items-center gap-4`}
                >
                  {/* Imagem */}
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.nome}
                      className="w-14 h-14 object-cover rounded-xl shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-white/60 shrink-0" />
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <p className={`text-sm font-medium ${cfg.text}`}>
                        {p.nome}
                      </p>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-md font-medium ${cfg.badge}`}
                      >
                        {p.promocao.urgencia}
                      </span>
                    </div>
                    <p className="text-xs text-stone-400">
                      {[p.categoria, p.especie].filter(Boolean).join(" · ")} ·
                      Vence em {p.promocao.diasRestantes} dia
                      {p.promocao.diasRestantes !== 1 ? "s" : ""}
                      {p.data_validade && ` (${formatDate(p.data_validade)})`}
                    </p>

                    {/* Preços */}
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-stone-400 line-through">
                        {p.promocao.precoOriginal.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </span>
                      <span className={`text-base font-medium ${cfg.text}`}>
                        {p.promocao.precoPromocional.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-md font-medium bg-white/70 ${cfg.text}`}
                      >
                        -{p.promocao.desconto}%
                      </span>
                    </div>
                  </div>

                  {/* Ação */}
                  <button
                    onClick={() => setAdjusting(p)}
                    className="shrink-0 text-xs px-3 py-2 bg-white/80 hover:bg-white border border-stone-200 text-stone-600 rounded-lg transition-colors"
                  >
                    Ajustar desconto
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
