import { useEffect, useState } from "react";
import { api } from "../services/api";

const CATEGORIAS = [
  "Ração",
  "Petiscos",
  "Higiene e Beleza",
  "Acessórios",
  "Brinquedos",
  "Medicamentos",
];
const CATEGORIAS_COM_VALIDADE = ["Ração", "Petiscos", "Medicamentos"];
const ESPECIES = ["Cães", "Gatos", "Pássaros", "Peixes", "Roedores"];
const PORTES = ["Pequeno", "Médio", "Grande", "Único"];
const FASES = ["Filhote", "Adulto", "Idoso"];

// Formata a data do banco (ISO) para o formato do input date (YYYY-MM-DD)
const formatDateForInput = (date) => {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
};

function StatusBadge({ status }) {
  const styles = {
    CRITICO: "bg-red-50 text-red-700 border border-red-100",
    ATENCAO: "bg-yellow-50 text-yellow-700 border border-yellow-100",
    NORMAL: "bg-green-50 text-green-700 border border-green-100",
    OK: "bg-green-50 text-green-700 border border-green-100",
  };
  const labels = {
    CRITICO: "Crítico",
    ATENCAO: "Atenção",
    NORMAL: "OK",
    OK: "OK",
  };
  return (
    <span
      className={`text-xs px-2 py-1 rounded-md font-medium ${styles[status] || styles.OK}`}
    >
      {labels[status] || "OK"}
    </span>
  );
}

function Select({ label, value, onChange, options, placeholder = "Todos" }) {
  return (
    <div>
      {label && (
        <label className="block text-xs text-stone-500 mb-1">{label}</label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-9 px-3 rounded-lg border border-stone-200 bg-stone-50 text-sm text-stone-800 outline-none focus:border-orange-400 transition-colors"
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

function FormFields({ form, onChange, showPorte }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="col-span-2">
        <label className="block text-xs text-stone-500 mb-1">Nome</label>
        <input
          type="text"
          value={form.nome}
          placeholder="Nome do produto"
          onChange={(e) => onChange("nome", e.target.value)}
          className="w-full h-9 px-3 rounded-lg border border-stone-200 bg-stone-50 text-sm text-stone-800 outline-none focus:border-orange-400 transition-colors"
        />
      </div>
      <Select
        label="Categoria"
        value={form.categoria}
        onChange={(v) => onChange("categoria", v)}
        options={CATEGORIAS}
        placeholder="Selecione"
      />
      <Select
        label="Espécie"
        value={form.especie}
        onChange={(v) => onChange("especie", v)}
        options={ESPECIES}
        placeholder="Selecione"
      />
      {showPorte && (
        <Select
          label="Porte"
          value={form.porte}
          onChange={(v) => onChange("porte", v)}
          options={PORTES}
          placeholder="Selecione"
        />
      )}
      <Select
        label="Fase de vida"
        value={form.fase}
        onChange={(v) => onChange("fase", v)}
        options={FASES}
        placeholder="Selecione"
      />
      <div>
        <label className="block text-xs text-stone-500 mb-1">Preço (R$)</label>
        <input
          type="number"
          value={form.preco}
          placeholder="0,00"
          onChange={(e) => onChange("preco", e.target.value)}
          className="w-full h-9 px-3 rounded-lg border border-stone-200 bg-stone-50 text-sm text-stone-800 outline-none focus:border-orange-400 transition-colors"
        />
      </div>
      <div>
        <label className="block text-xs text-stone-500 mb-1">
          Estoque atual
        </label>
        <input
          type="number"
          value={form.estoque_atual}
          placeholder="0"
          onChange={(e) => onChange("estoque_atual", e.target.value)}
          className="w-full h-9 px-3 rounded-lg border border-stone-200 bg-stone-50 text-sm text-stone-800 outline-none focus:border-orange-400 transition-colors"
        />
      </div>
      <div>
        <label className="block text-xs text-stone-500 mb-1">
          Estoque mínimo
        </label>
        <input
          type="number"
          value={form.estoque_minimo}
          placeholder="0"
          onChange={(e) => onChange("estoque_minimo", e.target.value)}
          className="w-full h-9 px-3 rounded-lg border border-stone-200 bg-stone-50 text-sm text-stone-800 outline-none focus:border-orange-400 transition-colors"
        />
      </div>

      {CATEGORIAS_COM_VALIDADE.includes(form.categoria) && (
        <div>
          <label className="block text-xs text-stone-500 mb-1">
            Data de validade
            <span className="text-orange-400 ml-1">(opcional)</span>
          </label>
          <input
            type="date"
            value={form.data_validade || ""}
            onChange={(e) => onChange("data_validade", e.target.value)}
            className="w-full h-9 px-3 rounded-lg border border-stone-200 bg-stone-50 text-sm text-stone-800 outline-none focus:border-orange-400 transition-colors"
          />
        </div>
      )}

    </div>
  );
}

function EditModal({ product, onClose, onSaved }) {
  const emptyForm = {
  nome: product.nome || "",
  categoria: product.categoria || "",
  especie: product.especie || "",
  porte: product.porte || "",
  fase: product.fase || "",
  preco: product.preco || "",
  estoque_atual: product.estoque_atual || "",
  estoque_minimo: product.estoque_minimo || "",
  data_validade: formatDateForInput(product.data_validade), // ← corrigido
};
  const [form, setForm] = useState(emptyForm);
  const [image, setImage] = useState(null);
  const [formKey, setFormKey] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) =>
    setForm((f) => ({ ...f, [field]: value }));
  const showPorte = form.especie === "Cães";

  const handleSave = async () => {
    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v !== "") data.append(k, v);
      });
      if (image) data.append("image", image);
      await api.put(`/products/${product._id}`, data);
      onSaved();
      onClose();
    } catch (err) {
      alert(err.response?.data?.error || "Erro ao atualizar produto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl border border-stone-200 w-full max-w-lg mx-4 overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100 shrink-0">
          <h3 className="text-stone-800 font-medium text-sm">Editar produto</h3>
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

        <div className="px-5 py-4 overflow-y-auto flex flex-col gap-4">
          <div>
            <label className="block text-xs text-stone-500 mb-2">Imagem</label>
            <div className="flex items-center gap-3">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.nome}
                  className="w-14 h-14 object-cover rounded-xl border border-stone-200 shrink-0"
                />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-stone-100 flex items-center justify-center text-stone-300 text-xs shrink-0">
                  sem
                </div>
              )}
              <input
                key={formKey}
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="flex-1 text-sm text-stone-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100"
              />
            </div>
          </div>
          <FormFields
            form={form}
            onChange={handleChange}
            showPorte={showPorte}
          />
        </div>

        <div className="flex gap-2 px-5 py-4 border-t border-stone-100 shrink-0">
          <button
            onClick={onClose}
            className="flex-1 h-9 rounded-lg border border-stone-200 text-sm text-stone-500 hover:bg-stone-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 h-9 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? "Salvando..." : "Salvar alterações"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Products() {
  const [products, setProducts] = useState([]);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [editingProduct, setEditingProduct] = useState(null);
  const [filters, setFilters] = useState({
    categoria: "",
    especie: "",
    porte: "",
    fase: "",
    busca: "",
  });

  const emptyForm = {
    nome: "",
    categoria: "",
    data_validade: "",
    especie: "",
    porte: "",
    fase: "",
    preco: "",
    estoque_atual: "",
    estoque_minimo: "",
  };
  const [form, setForm] = useState(emptyForm);
  const handleChange = (field, value) =>
    setForm((f) => ({ ...f, [field]: value }));
  const showPorte = form.especie === "Cães";

  const loadProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Erro ao carregar produtos:", err);
    }
  };

  const createProduct = async () => {
    if (
      !form.nome ||
      !form.preco ||
      !form.estoque_atual ||
      !form.estoque_minimo
    ) {
      alert("Preencha pelo menos nome, preço e estoques");
      return;
    }
    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v !== "") data.append(k, v);
      });
      if (image) data.append("image", image);
      await api.post("/products", data);
      setForm(emptyForm);
      setImage(null);
      setFormKey((k) => k + 1);
      loadProducts();
    } catch (err) {
      alert(err.response?.data?.error || "Erro ao cadastrar produto");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!confirm("Deseja excluir este produto?")) return;
    await api.delete(`/products/${id}`);
    loadProducts();
  };

  const filtered = products.filter((p) => {
    if (filters.categoria && p.categoria !== filters.categoria) return false;
    if (filters.especie && (p.especie || "") !== filters.especie) return false;
    if (filters.porte && (p.porte || "") !== filters.porte) return false;
    if (filters.fase && (p.fase || "") !== filters.fase) return false;
    if (
      filters.busca &&
      !p.nome?.toLowerCase().includes(filters.busca.toLowerCase())
    )
      return false;
    return true;
  });

  const activeFilters = Object.values(filters).filter(Boolean).length;

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div>
      {editingProduct && (
        <EditModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSaved={loadProducts}
        />
      )}

      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-stone-800 font-medium text-lg">
            Catálogo de produtos
          </h2>
          <p className="text-stone-400 text-sm">
            {filtered.length} de {products.length} produtos
          </p>
        </div>
      </div>

      {/* Formulário de cadastro */}
      <div className="bg-white border border-stone-200 rounded-xl p-5 mb-6">
        <h3 className="text-stone-700 font-medium text-sm mb-4">
          Novo produto
        </h3>
        <div className="mb-3">
          <label className="block text-xs text-stone-500 mb-1">Imagem</label>
          <input
            key={formKey}
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full text-sm text-stone-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100"
          />
        </div>
        <FormFields form={form} onChange={handleChange} showPorte={showPorte} />
        <button
          onClick={createProduct}
          disabled={loading}
          className="mt-4 h-9 px-5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? "Salvando..." : "Cadastrar produto"}
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white border border-stone-200 rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-stone-500">Filtros</span>
          {activeFilters > 0 && (
            <button
              onClick={() =>
                setFilters({
                  categoria: "",
                  especie: "",
                  porte: "",
                  fase: "",
                  busca: "",
                })
              }
              className="text-xs text-orange-400 hover:text-orange-600 transition-colors"
            >
              Limpar filtros ({activeFilters})
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="col-span-2">
            <input
              type="text"
              placeholder="Buscar por nome..."
              value={filters.busca}
              onChange={(e) =>
                setFilters((f) => ({ ...f, busca: e.target.value }))
              }
              className="w-full h-9 px-3 rounded-lg border border-stone-200 bg-stone-50 text-sm text-stone-800 outline-none focus:border-orange-400 transition-colors"
            />
          </div>
          <Select
            value={filters.categoria}
            onChange={(v) => setFilters((f) => ({ ...f, categoria: v }))}
            options={CATEGORIAS}
            placeholder="Todas as categorias"
          />
          <Select
            value={filters.especie}
            onChange={(v) =>
              setFilters((f) => ({ ...f, especie: v, porte: "" }))
            }
            options={ESPECIES}
            placeholder="Todas as espécies"
          />
          {filters.especie === "Cães" && (
            <Select
              value={filters.porte}
              onChange={(v) => setFilters((f) => ({ ...f, porte: v }))}
              options={PORTES}
              placeholder="Todos os portes"
            />
          )}
          <Select
            value={filters.fase}
            onChange={(v) => setFilters((f) => ({ ...f, fase: v }))}
            options={FASES}
            placeholder="Todas as fases"
          />
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
        <div className="grid grid-cols-[56px_2fr_1fr_1fr_1fr_1fr_120px] px-4 py-2.5 bg-stone-50 border-b border-stone-200 text-xs text-stone-400 font-medium">
          <span>Img</span>
          <span>Nome</span>
          <span>Categoria</span>
          <span>Preço</span>
          <span>Estoque</span>
          <span>Status</span>
          <span>Ações</span>
        </div>

        {filtered.length === 0 ? (
          <p className="text-sm text-stone-400 text-center py-10">
            {activeFilters > 0
              ? "Nenhum produto encontrado com esses filtros."
              : "Nenhum produto cadastrado ainda."}
          </p>
        ) : (
          filtered.map((p) => (
            <div
              key={p._id}
              className="grid grid-cols-[56px_2fr_1fr_1fr_1fr_1fr_120px] px-4 py-3 border-b border-stone-100 last:border-0 items-center"
            >
              <div>
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.nome}
                    className="w-10 h-10 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center text-stone-300 text-xs">
                    sem
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm text-stone-800 font-medium leading-tight">
                  {p.nome}
                </p>
                <p className="text-xs text-stone-400 mt-0.5">
                  {[p.especie, p.porte !== "Único" ? p.porte : null, p.fase]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </div>
              <span className="text-xs text-stone-500">
                {p.categoria || "—"}
              </span>
              <span className="text-sm text-stone-600">
                {Number(p.preco).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
              <span className="text-sm text-stone-600">
                {p.estoque_atual} un.
              </span>
              <StatusBadge status={p.status} />
              <div className="flex gap-3">
                <button
                  onClick={() => setEditingProduct(p)}
                  className="text-xs text-orange-400 hover:text-orange-600 transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={() => deleteProduct(p._id)}
                  className="text-xs text-red-400 hover:text-red-600 transition-colors"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
