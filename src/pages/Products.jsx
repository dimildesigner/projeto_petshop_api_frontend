import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function Products() {
  const [products, setProducts] = useState([]);

  const [form, setForm] = useState({
    nome: "",
    preco: "",
    estoque_atual: "",
    estoque_minimo: ""
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
    try {
      await api.post("/products", form);
      alert("Produto criado!");
      loadProducts();
    } catch (err) {
        console.error(err);
        alert("Erro ao criar produto");
      }
  };

  const deleteProduct = async (id) => {
    await api.delete(`/products/${id}`);
    loadProducts();
  };

  const updateProduct = async (id) => {
    await api.put(`/products/${id}`, {
      nome: "Produto atualizado"
    });
    loadProducts();
  };

  useEffect(() => {
    (async () => {
      await loadProducts();
    })();
  }, []);

  return (
    <div>
      <h2>Produtos</h2>

      {/* 🔥 FORMULÁRIO AQUI */}
      <div>
        <h3>Novo Produto</h3>

        <input placeholder="Nome"
          onChange={(e) => setForm({...form, nome: e.target.value})} />

        <input placeholder="Preço"
          onChange={(e) => setForm({...form, preco: Number(e.target.value)})} />

        <input placeholder="Estoque Atual"
          onChange={(e) => setForm({...form, estoque_atual: Number(e.target.value)})} />

        <input placeholder="Estoque Mínimo"
          onChange={(e) => setForm({...form, estoque_minimo: Number(e.target.value)})} />

        <button onClick={createProduct}>Cadastrar</button>
      
      </div>

      {products.map((p) => (
        <div key={p._id}>
          <strong>{p.nome}</strong>
          <p style={{
            color:
              p.status === "CRITICO" ? "red" :
              p.status === "ATENCAO" ? "orange" :
              "green"
          }}>
            Status: {p.status}
          </p>

          <button onClick={() => deleteProduct(p._id)}>
            Deletar
          </button>     
          
          <button onClick={() => updateProduct(p._id)}>
            Editar
          </button>
        </div>
      ))}
    </div>
  );
}