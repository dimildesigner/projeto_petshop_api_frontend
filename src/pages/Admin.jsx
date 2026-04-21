import { useEffect, useState } from "react";
import { api } from "../services/api";

const ROLES = ["admin", "almoxarifado", "comercial", "marketing"];
const ROLE_LABELS = {
  admin: "Admin",
  almoxarifado: "Almoxarifado",
  comercial: "Comercial",
  marketing: "Marketing",
};
const ROLE_COLORS = {
  admin:        "bg-orange-50 text-orange-700 border border-orange-100",
  almoxarifado: "bg-blue-50 text-blue-700 border border-blue-100",
  comercial:    "bg-green-50 text-green-700 border border-green-100",
  marketing:    "bg-purple-50 text-purple-700 border border-purple-100",
};

function UserModal({ user, onClose, onSaved }) {
  const isEdit = !!user;
  const [form, setForm] = useState({
    nome:  user?.nome  || "",
    email: user?.email || "",
    role:  user?.role  || "comercial",
    senha: "",
    ativo: user?.ativo ?? true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handleSave = async () => {
    setError("");
    if (!form.nome || !form.email) {
      setError("Nome e e-mail são obrigatórios");
      return;
    }
    if (!isEdit && !form.senha) {
      setError("Senha é obrigatória para novo usuário");
      return;
    }
    setLoading(true);
    try {
      const payload = { nome: form.nome, email: form.email, role: form.role, ativo: form.ativo };
      if (form.senha) payload.senha = form.senha;
      if (isEdit) {
        await api.put(`/users/${user._id}`, payload);
      } else {
        await api.post("/users", payload);
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || "Erro ao salvar usuário");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl border border-stone-200 w-full max-w-md mx-4">
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
          <h3 className="text-stone-800 font-medium text-sm">
            {isEdit ? "Editar usuário" : "Novo usuário"}
          </h3>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600 transition-colors">
            <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="px-5 py-4 flex flex-col gap-3">
          {[
            { label: "Nome completo", field: "nome", type: "text",     placeholder: "Ex: Maria Silva" },
            { label: "E-mail",        field: "email", type: "email",   placeholder: "maria@petshop.com" },
            { label: isEdit ? "Nova senha (deixe vazio para manter)" : "Senha", field: "senha", type: "password", placeholder: "••••••••" },
          ].map(({ label, field, type, placeholder }) => (
            <div key={field}>
              <label className="block text-xs text-stone-500 mb-1">{label}</label>
              <input
                type={type}
                value={form[field]}
                placeholder={placeholder}
                onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                className="w-full h-9 px-3 rounded-lg border border-stone-200 bg-stone-50 text-sm text-stone-800 outline-none focus:border-orange-400 transition-colors"
              />
            </div>
          ))}

          <div>
            <label className="block text-xs text-stone-500 mb-1">Perfil de acesso</label>
            <select
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
              className="w-full h-9 px-3 rounded-lg border border-stone-200 bg-stone-50 text-sm text-stone-800 outline-none focus:border-orange-400 transition-colors"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>{ROLE_LABELS[r]}</option>
              ))}
            </select>
          </div>

          {isEdit && (
            <div className="flex items-center gap-3">
              <label className="text-xs text-stone-500">Usuário ativo</label>
              <button
                onClick={() => setForm((f) => ({ ...f, ativo: !f.ativo }))}
                className={`w-10 h-5 rounded-full transition-colors relative ${form.ativo ? "bg-orange-500" : "bg-stone-300"}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${form.ativo ? "left-5" : "left-0.5"}`}/>
              </button>
              <span className="text-xs text-stone-400">{form.ativo ? "Ativo" : "Inativo"}</span>
            </div>
          )}

          {error && (
            <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
          )}
        </div>

        <div className="flex gap-2 px-5 py-4 border-t border-stone-100">
          <button onClick={onClose} className="flex-1 h-9 rounded-lg border border-stone-200 text-sm text-stone-500 hover:bg-stone-50 transition-colors">
            Cancelar
          </button>
          <button onClick={handleSave} disabled={loading} className="flex-1 h-9 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50">
            {loading ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Admin() {
  const [users, setUsers]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [modalUser, setModalUser] = useState(undefined);
  const [deleting, setDeleting] = useState(null);

  const loadUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Deseja excluir este usuário?")) return;
    setDeleting(id);
    try {
      await api.delete(`/users/${id}`);
      loadUsers();
    } catch (err) {
      alert(err.response?.data?.error || "Erro ao excluir usuário");
    } finally {
      setDeleting(null);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  return (
    <div>
      {modalUser !== undefined && (
        <UserModal
          user={modalUser || null}
          onClose={() => setModalUser(undefined)}
          onSaved={loadUsers}
        />
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-stone-800 font-medium text-lg">Usuários</h2>
          <p className="text-stone-400 text-sm">{users.length} usuário{users.length !== 1 ? "s" : ""} cadastrado{users.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={() => setModalUser(null)}
          className="h-9 px-4 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors"
        >
          + Novo usuário
        </button>
      </div>

      {/* Tabela de permissões */}
      <div className="bg-white border border-stone-200 rounded-xl p-4 mb-6">
        <p className="text-xs font-medium text-stone-500 mb-3">Perfis e permissões</p>
        <div className="grid grid-cols-5 gap-2 text-xs text-center">
          <div className="text-stone-400 font-medium text-left">Perfil</div>
          {["Dashboard", "Catálogo", "Estoque", "Promoções"].map((m) => (
            <div key={m} className="text-stone-400 font-medium">{m}</div>
          ))}
          {[
            { role: "admin",        acesso: [true, true, true, true]   },
            { role: "almoxarifado", acesso: [true, false, true, false] },
            { role: "comercial",    acesso: [false, true, false, true] },
            { role: "marketing",    acesso: [true, true, false, true]  },
          ].map(({ role, acesso }) => (
            <>
              <div key={role} className="text-left">
                <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${ROLE_COLORS[role]}`}>
                  {ROLE_LABELS[role]}
                </span>
              </div>
              {acesso.map((ok, i) => (
                <div key={i} className="flex items-center justify-center">
                  {ok
                    ? <span className="text-green-500">✓</span>
                    : <span className="text-stone-200">—</span>
                  }
                </div>
              ))}
            </>
          ))}
        </div>
      </div>

      {/* Lista de usuários */}
      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
        <div className="grid grid-cols-[2fr_2fr_1fr_1fr_120px] px-4 py-2.5 bg-stone-50 border-b border-stone-200 text-xs text-stone-400 font-medium">
          <span>Nome</span>
          <span>E-mail</span>
          <span>Perfil</span>
          <span>Status</span>
          <span>Ações</span>
        </div>

        {loading ? (
          <p className="text-sm text-stone-400 text-center py-10">Carregando...</p>
        ) : users.length === 0 ? (
          <p className="text-sm text-stone-400 text-center py-10">Nenhum usuário cadastrado.</p>
        ) : (
          users.map((u) => (
            <div key={u._id} className="grid grid-cols-[2fr_2fr_1fr_1fr_120px] px-4 py-3 border-b border-stone-100 last:border-0 items-center">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-medium shrink-0">
                  {u.nome.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm text-stone-800 font-medium truncate">{u.nome}</span>
              </div>
              <span className="text-sm text-stone-500 truncate">{u.email}</span>
              <span className={`text-xs px-2 py-1 rounded-md font-medium w-fit ${ROLE_COLORS[u.role]}`}>
                {ROLE_LABELS[u.role]}
              </span>
              <span className={`text-xs px-2 py-1 rounded-md font-medium w-fit ${
                u.ativo
                  ? "bg-green-50 text-green-700 border border-green-100"
                  : "bg-stone-100 text-stone-400 border border-stone-200"
              }`}>
                {u.ativo ? "Ativo" : "Inativo"}
              </span>
              <div className="flex gap-3">
                <button onClick={() => setModalUser(u)} className="text-xs text-orange-400 hover:text-orange-600 transition-colors">
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(u._id)}
                  disabled={deleting === u._id}
                  className="text-xs text-red-400 hover:text-red-600 transition-colors disabled:opacity-40"
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
