# 🐾 Petstock — Frontend

> Sistema de gestão inteligente para pet shops. Interface moderna, responsiva e conectada a uma API REST em produção.

🔗 **Demo ao vivo:** [https://projeto-petshop-api-frontend.vercel.app](https://projeto-petshop-api-frontend.vercel.app)  
🔗 **Repositório do Backend:** [github.com/dimildesigner/projeto_petshop_api_backend](https://github.com/dimildesigner/projeto_petshop_api_backend)

---

## 📸 Preview

| Login | Dashboard | Catálogo |
|-------|-----------|----------|
| Tela de login com identidade visual Petstock | Métricas reais de estoque em tempo real | Listagem com filtros por espécie, categoria e fase |

---

## 🎯 Sobre o projeto

O **Petstock** é um ERP Lite desenvolvido para o mercado pet, com foco em controle de estoque inteligente, catálogo segmentado por espécie e alertas automáticos de reposição e validade. O projeto nasceu como portfólio fullstack e foi evoluído até um nível de produto real, com deploy em produção e autenticação por perfis de acesso.

---

## ✨ Funcionalidades

### 🔐 Autenticação
- Login com e-mail e senha via JWT
- Perfis de acesso: Admin, Almoxarifado, Comercial e Marketing
- Rotas protegidas por token
- Logout com limpeza de sessão

### 📊 Dashboard
- Total de produtos cadastrados
- Contadores de estoque OK, Atenção e Crítico
- Valor total do estoque calculado automaticamente
- Lista de produtos em estado crítico com acesso rápido
- Gráficos de distribuição por categoria e espécie

### 📦 Catálogo de Produtos
- Listagem completa com imagem, categoria, preço, estoque e status
- Cadastro com upload de imagem via Cloudinary
- Edição completa via modal com troca de imagem
- Exclusão com confirmação
- Filtros por: categoria, espécie, porte, fase de vida e busca por nome
- Badge de status automático: OK / Atenção / Crítico
- Campos: nome, categoria, espécie, porte, fase, preço, estoque atual e mínimo

### 📋 Controle de Estoque
- Listagem de todos os produtos com status de estoque
- Registro de entrada e saída por produto
- Motivos fixos: Venda, Reposição, Perda, Ajuste
- Preview em tempo real do estoque após movimentação
- Alerta visual quando movimentação deixa estoque abaixo do mínimo
- Histórico completo de movimentações por produto
- Busca por nome de produto

### 🏷️ Cantinho da Oportunidade (Promoções)
- Identificação automática de produtos com validade próxima
- Desconto sugerido automático por faixa de prazo:
  - 90 a 61 dias → 10%
  - 60 a 31 dias → 25%
  - 30 a 16 dias → 45%
  - ≤ 15 dias → 65%
- Filtro por urgência: Atenção, Urgente, Crítico, Vence em breve
- Ajuste manual de desconto via slider
- Preço original e promocional exibidos lado a lado

### 👥 Administração de Usuários
- CRUD completo de usuários
- Perfis de acesso configuráveis
- Ativação e desativação de usuários
- Tabela visual de permissões por perfil
- Proteção contra remoção do último admin

---

## 🗂️ Perfis de acesso

| Perfil | Dashboard | Catálogo | Estoque | Promoções | Admin |
|--------|-----------|----------|---------|-----------|-------|
| Admin | ✅ | ✅ | ✅ | ✅ | ✅ |
| Almoxarifado | ✅ | ❌ | ✅ | ❌ | ❌ |
| Comercial | ❌ | ✅ | ❌ | ✅ | ❌ |
| Marketing | ✅ | ✅ | ❌ | ✅ | ❌ |

---

## 🧱 Stack

| Tecnologia | Uso |
|------------|-----|
| React 18 | Biblioteca de interface |
| Vite 8 | Bundler e dev server |
| Tailwind CSS v4 | Estilização utilitária |
| React Router v6 | Roteamento client-side |
| Axios | Requisições HTTP |

---

## 📁 Estrutura de pastas

```
petshop-frontend/
├── public/
│   └── petstock.svg
├── src/
│   ├── components/
│   │   ├── Layout.jsx        # Sidebar + header responsivos
│   │   └── Navbar.jsx
│   ├── pages/
│   │   ├── Login.jsx         # Tela de login
│   │   ├── Dashboard.jsx     # Métricas e alertas
│   │   ├── Products.jsx      # Catálogo com CRUD
│   │   ├── Stock.jsx         # Controle de estoque
│   │   ├── Promotions.jsx    # Cantinho da Oportunidade
│   │   └── Admin.jsx         # Gestão de usuários
│   ├── routes/
│   │   └── AppRoutes.jsx     # Definição de rotas e proteção
│   ├── services/
│   │   └── api.js            # Instância Axios + interceptor JWT
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── tailwind.config.js
└── vite.config.js
```

---

## 🚀 Como rodar localmente

```bash
# Clone o repositório
git clone https://github.com/dimildesigner/projeto_petshop_api_frontend.git
cd projeto_petshop_api_frontend

# Instale as dependências
npm install

# Configure a variável de ambiente
# Crie um arquivo .env na raiz com:
VITE_API_URL=https://projeto-petshop-api-backend.onrender.com

# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse: [http://localhost:5173](http://localhost:5173)

**Credenciais de acesso (demo):**
- E-mail: `admin@petshop.com`
- Senha: `123456`

---

## ☁️ Deploy

O frontend está publicado na **Vercel** com deploy automático a cada push na branch `main`.

🔗 [https://projeto-petshop-api-frontend.vercel.app](https://projeto-petshop-api-frontend.vercel.app)

---

## 🔗 Relacionado

- [Backend Petstock](https://github.com/dimildesigner/projeto_petshop_api_backend) — API REST em Node.js + Express + MongoDB

---

## 👨‍💻 Autor

Desenvolvido por **dimildesigner**  
🔗 [github.com/dimildesigner](https://github.com/dimildesigner)
