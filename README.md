# API Catálogo de Produtos

API REST feita com Node.js, Express e MongoDB para gerenciar um catálogo de produtos com atributos dinâmicos. Trabalho da disciplina de desenvolvimento back-end.

## Tecnologias

- Node.js + Express
- MongoDB + Mongoose
- JWT para autenticação
- bcryptjs para hash de senhas
- helmet, express-mongo-sanitize, express-rate-limit para segurança

## Como rodar

**Requisitos:** Node.js >= 18 e MongoDB rodando (local ou Atlas)

```bash
# clonar o repositório
git clone https://github.com/seu-usuario/api-catalogo-produtos.git
cd api-catalogo-produtos

# instalar dependências
npm install

# configurar variáveis de ambiente
cp .env.example .env
# editar o .env com suas configurações

# rodar em desenvolvimento
npm run dev
```

## Variáveis de ambiente

Renomeie o `.env.example` para `.env` e preencha:

```
PORT=3000
MONGO_URI=mongodb://localhost:27017/catalogo_db
JWT_SECRET=qualquer_string_secreta_aqui
JWT_EXPIRES_IN=7d
```

## Endpoints

### Autenticação

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /api/v1/auth/register | cria conta |
| POST | /api/v1/auth/login | faz login e retorna token |
| GET | /api/v1/auth/me | retorna dados do usuário logado |

### Produtos

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| GET | /api/v1/products | não | lista produtos |
| GET | /api/v1/products/:id | não | busca por id |
| POST | /api/v1/products | sim | cria produto |
| PUT | /api/v1/products/:id | sim | atualiza produto |
| DELETE | /api/v1/products/:id | admin | remove produto |

Rotas autenticadas precisam do header:
```
Authorization: Bearer <token>
```

### Filtros no GET /products

- `?category=eletronicos`
- `?minPrice=100&maxPrice=500`
- `?search=notebook`
- `?page=1&limit=10`

## Exemplo de uso

**Criar conta:**
```json
POST /api/v1/auth/register
{
  "name": "João",
  "email": "joao@email.com",
  "password": "123456"
}
```

**Criar produto:**
```json
POST /api/v1/products
{
  "name": "Notebook Dell",
  "price": 3500,
  "category": "eletronicos",
  "stock": 10,
  "tags": ["notebook", "dell"],
  "attributes": {
    "ram": "8GB",
    "processador": "i5"
  }
}
```

## Estrutura

```
src/
  config/       → conexão com banco
  controllers/  → lógica das rotas
  middlewares/  → autenticação e erros
  models/       → schemas do mongoose
  routes/       → definição das rotas
  app.js
  server.js
```
https://github.com/ad784/Api-rest-cat-podrutos.git
