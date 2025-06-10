# API-FullStack

## 📋 Descrição do Projeto

Este projeto é uma API backend para uma plataforma de e-commerce, desenvolvida para servir aplicações web modernas. O objetivo é fornecer uma base robusta, escalável e segura para gestão de utilizadores, produtos, encomendas, pagamentos e integrações com serviços externos como Stripe e envio de emails.

---

## 🚀 Funcionalidades Principais

- **Gestão de Utilizadores e Autenticação**
  - Registo, login e autenticação JWT
  - Integração com Google OAuth
- **Gestão de Clientes**
  - CRUD de clientes e respetivos endereços
- **Gestão de Produtos**
  - CRUD de produtos, categorias e imagens
- **Carrinho de Compras**
  - Adição, remoção e atualização de produtos no carrinho
- **Gestão de Encomendas**
  - Criação de encomendas a partir do carrinho
  - Associação de produtos à encomenda
  - Histórico de encomendas por cliente
- **Pagamentos Online**
  - Integração com Stripe (cartão de crédito e preparado para MB WAY)
  - Webhook Stripe para confirmação de pagamentos antes de criar encomendas
- **Envio de Emails**
  - Envio automático de email de confirmação de encomenda via Nodemailer/SMTP
- **Documentação**
  - Swagger/OpenAPI disponível para todos os endpoints
- **Outros**
  - Upload de imagens
  - Middleware de CORS configurável
  - Separação de ambientes (DEV/PROD) via `.env`

---

## 🛠️ Tecnologias Utilizadas

- **Node.js** (runtime)
- **Express.js** (framework backend)
- **Sequelize** (ORM para bases de dados SQL)
- **MySQL** ou **PostgreSQL** (configurável)
- **JWT** (autenticação)
- **Nodemailer** (envio de emails)
- **Stripe** (pagamentos online)
- **Swagger** (documentação da API)
- **dotenv** (gestão de variáveis de ambiente)
- **Multer** (upload de ficheiros)
- **bcrypt** (hash de passwords)
- **CORS** (segurança de requests)

---

## 🎯 Propósito

O objetivo deste projeto é servir como backend completo para lojas online, aplicações SaaS ou qualquer solução que necessite de:

- Gestão de utilizadores e permissões
- Gestão de produtos e encomendas
- Integração com métodos de pagamento modernos (Stripe)
- Envio automático de notificações por email
- API documentada e fácil de consumir por frontends modernos (React, Next.js, etc.)

---

## 📦 Como usar

1. **Clonar o repositório**
2. **Configurar o `.env`** com as tuas credenciais (base de dados, Stripe, email, etc.)
3. **Instalar dependências**
   ```
   pnpm install
   ```
   ou
   ```
   npm install
   ```
4. **Correr as migrações e seeds** (se aplicável)
5. **Iniciar o servidor**
   ```
   pnpm start
   ```
   ou
   ```
   npm start
   ```
6. **Aceder à documentação Swagger** em `/api/docs` (se ativado)

---

## 📄 Notas Finais

- O projeto está preparado para deploy em ambientes cloud (Coolify, Docker, etc.)
- Suporte a múltiplos métodos de pagamento pode ser expandido facilmente
