import { useEffect, useState } from "react";
import { api } from "../services/api";

function StatusBadge({ status }) {
  const styles = {
    CRITICO: "bg-red-50 text-red-700 border border-red-100",
    ATENCAO: "bg-yellow-50 text-yellow-700 border border-yellow-100",
    OK: "bg-green-50 text-green-700 border border-green-100",
  };
  const labels = { CRITICO: "Crítico", ATENCAO: "Atenção", OK: "OK" };
  return (
    <span className={`text-xs px-2 py-1 rounded-md font-medium ${styles[status] || styles.OK}`}>
      {labels[status] || "OK"}
    </span>
  );
}

export default function Products() {
  const [products, setProducts] = useState([]);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nome: "", preco: "", estoque_atual: "", estoque_minimo: "",
  });

  const loadProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Erro ao carregar produtos:", err);
    }
  };

  const createProduct = async () => {
    setLoading(true);
    try {
      const data = new FormData();
      data.append("nome", form.nome);
      data.append("preco", form.preco);
      data.append("estoque_atual", form.estoque_atual);
      data.append("estoque_minimo", form.estoque_minimo);
      if (image) data.append("image", image);
      await api.post("/products", data);
      setForm({ nome: "", preco: "", estoque_atual: "", estoque_minimo: "" });
      setImage(null);
      loadProducts();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!confirm("Deseja excluir este produto?")) return;
    await api.delete(`/products/${id}`);
    loadProducts();
  };

  useEffect(() => { loadProducts(); }, []);

  return (
    <div>
      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-stone-800 font-medium text-lg">Catálogo de produtos</h2>
          <p className="text-stone-400 text-sm">{products.length} produtos cadastrados</p>
        </div>
      </div>

      {/* Formulário */}
      <div className="bg-white border border-stone-200 rounded-xl p-5 mb-6">
        <h3 className="text-stone-700 font-medium text-sm mb-4">Novo produto</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="block text-xs text-stone-500 mb-1">Imagem</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="w-full text-sm text-stone-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100"
            />
          </div>
          {[
            { label: "Nome", field: "nome", type: "text" },
            { label: "Preço (R$)", field: "preco", type: "number" },
            { label: "Estoque atual", field: "estoque_atual", type: "number" },
            { label: "Estoque mínimo", field: "estoque_minimo", type: "number" },
          ].map(({ label, field, type }) => (
            <div key={field}>
              <label className="block text-xs text-stone-500 mb-1">{label}</label>
              <input
                type={type}
                value={form[field]}
                placeholder={label}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                className="w-full h-9 px-3 rounded-lg border border-stone-200 bg-stone-50 text-sm text-stone-800 outline-none focus:border-orange-400 transition-colors"
              />
            </div>
          ))}
        </div>
        <button
          onClick={createProduct}
          disabled={loading}
          className="mt-4 h-9 px-5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? "Salvando..." : "Cadastrar produto"}
        </button>
      </div>

      {/* Tabela */}
      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
        <div className="grid grid-cols-[60px_2fr_1fr_1fr_1fr_100px] px-4 py-2.5 bg-stone-50 border-b border-stone-200 text-xs text-stone-400 font-medium">
          <span>Imagem</span>
          <span>Nome</span>
          <span>Preço</span>
          <span>Estoque</span>
          <span>Status</span>
          <span>Ações</span>
        </div>
        {products.length === 0 ? (
          <p className="text-sm text-stone-400 text-center py-10">Nenhum produto cadastrado ainda.</p>
        ) : (
          products.map((p) => (
            <div key={p._id} className="grid grid-cols-[60px_2fr_1fr_1fr_1fr_100px] px-4 py-3 border-b border-stone-100 last:border-0 items-center">
              <div>
                {p.image ? (
                  <img src={p.image} alt={p.nome} className="w-10 h-10 object-cover rounded-lg" />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center text-stone-300 text-xs">sem</div>
                )}
              </div>
              <span className="text-sm text-stone-800 font-medium">{p.nome}</span>
              <span className="text-sm text-stone-600">
                {Number(p.preco).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </span>
              <span className="text-sm text-stone-600">{p.estoque_atual} un.</span>
              <StatusBadge status={p.status} />
              <div className="flex gap-2">
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