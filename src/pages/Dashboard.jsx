import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

function StatCard({ label, value, sub, color }) {
  const colors = {
    default: "bg-white border-stone-200",
    red:     "bg-red-50 border-red-100",
    yellow:  "bg-yellow-50 border-yellow-100",
    green:   "bg-green-50 border-green-100",
    orange:  "bg-orange-50 border-orange-100",
  };
  const textColors = {
    default: "text-stone-800",
    red:     "text-red-700",
    yellow:  "text-yellow-700",
    green:   "text-green-700",
    orange:  "text-orange-600",
  };
  return (
    <div className={`rounded-xl border p-4 ${colors[color] || colors.default}`}>
      <p className="text-xs text-stone-400 mb-1">{label}</p>
      <p className={`text-2xl font-medium ${textColors[color] || textColors.default}`}>{value}</p>
      {sub && <p className="text-xs text-stone-400 mt-1">{sub}</p>}
    </div>
  );
}

function AlertRow({ product, type }) {
  const badge = {
    CRITICO: "bg-red-50 text-red-700 border border-red-100",
    ATENCAO: "bg-yellow-50 text-yellow-700 border border-yellow-100",
  };
  const label = { CRITICO: "Crítico", ATENCAO: "Atenção" };

  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-stone-100 last:border-0">
      {product.image ? (
        <img src={product.image} alt={product.nome} className="w-9 h-9 rounded-lg object-cover shrink-0"/>
      ) : (
        <div className="w-9 h-9 rounded-lg bg-stone-100 shrink-0"/>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-stone-800 font-medium truncate">{product.nome}</p>
        <p className="text-xs text-stone-400">
          {product.estoque_atual} un. · mín. {product.estoque_minimo} un.
        </p>
      </div>
      <span className={`text-xs px-2 py-1 rounded-md font-medium shrink-0 ${badge[type]}`}>
        {label[type]}
      </span>
    </div>
  );
}

function BarChart({ data, color }) {
  const max = Math.max(...Object.values(data), 1);
  const barColor = {
    orange: "bg-orange-400",
    stone:  "bg-stone-400",
  };
  return (
    <div className="flex flex-col gap-2 mt-2">
      {Object.entries(data)
        .sort((a, b) => b[1] - a[1])
        .map(([label, value]) => (
          <div key={label} className="flex items-center gap-2">
            <span className="text-xs text-stone-500 w-28 shrink-0 truncate">{label}</span>
            <div className="flex-1 bg-stone-100 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${barColor[color] || barColor.orange}`}
                style={{ width: `${Math.round((value / max) * 100)}%` }}
              />
            </div>
            <span className="text-xs text-stone-400 w-4 text-right">{value}</span>
          </div>
        ))}
    </div>
  );
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/dashboard");
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-stone-400 text-sm">Carregando dashboard...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-stone-400 text-sm">Erro ao carregar dados.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Cabeçalho */}
      <div className="mb-6">
        <h2 className="text-stone-800 font-medium text-lg">Dashboard</h2>
        <p className="text-stone-400 text-sm">Visão geral do estoque em tempo real</p>
      </div>

      {/* Cards de métricas */}
      <div className="grid grid-cols-2 gap-3 mb-6 lg:grid-cols-4">
        <StatCard
          label="Total de produtos"
          value={data.total}
          sub="cadastrados no sistema"
          color="default"
        />
        <StatCard
          label="Estoque OK"
          value={data.ok}
          sub="produtos em nível seguro"
          color="green"
        />
        <StatCard
          label="Atenção"
          value={data.atencao}
          sub="próximos do mínimo"
          color="yellow"
        />
        <StatCard
          label="Crítico"
          value={data.criticos}
          sub="abaixo do mínimo"
          color="red"
        />
      </div>

      {/* Valor do estoque */}
      <div className="bg-white border border-stone-200 rounded-xl p-4 mb-6">
        <p className="text-xs text-stone-400 mb-1">Valor total em estoque</p>
        <p className="text-2xl font-medium text-orange-500">
          {data.valorTotalEstoque.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
        </p>
        <p className="text-xs text-stone-400 mt-1">soma de preço × quantidade de todos os produtos</p>
      </div>

      {/* Alertas + Gráficos */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 mb-4">

        {/* Críticos */}
        <div className="bg-white border border-stone-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-stone-700">Estoque crítico</h3>
            {data.criticos > 0 && (
              <button
                onClick={() => navigate("/products")}
                className="text-xs text-orange-400 hover:text-orange-600 transition-colors"
              >
                Ver todos →
              </button>
            )}
          </div>
          {data.listaCriticos.length === 0 ? (
            <p className="text-xs text-stone-400 py-4 text-center">Nenhum produto em estado crítico 🎉</p>
          ) : (
            data.listaCriticos.map((p) => (
              <AlertRow key={p._id} product={p} type="CRITICO" />
            ))
          )}
        </div>

        {/* Atenção */}
        <div className="bg-white border border-stone-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-stone-700">Requer atenção</h3>
            {data.atencao > 0 && (
              <button
                onClick={() => navigate("/products")}
                className="text-xs text-orange-400 hover:text-orange-600 transition-colors"
              >
                Ver todos →
              </button>
            )}
          </div>
          {data.listaAtencao.length === 0 ? (
            <p className="text-xs text-stone-400 py-4 text-center">Nenhum produto em atenção 👍</p>
          ) : (
            data.listaAtencao.map((p) => (
              <AlertRow key={p._id} product={p} type="ATENCAO" />
            ))
          )}
        </div>

        {/* Por categoria */}
        <div className="bg-white border border-stone-200 rounded-xl p-4">
          <h3 className="text-sm font-medium text-stone-700 mb-1">Produtos por categoria</h3>
          <BarChart data={data.porCategoria} color="orange" />
        </div>

        {/* Por espécie */}
        <div className="bg-white border border-stone-200 rounded-xl p-4">
          <h3 className="text-sm font-medium text-stone-700 mb-1">Produtos por espécie</h3>
          <BarChart data={data.porEspecie} color="stone" />
        </div>

      </div>
    </div>
  );
}