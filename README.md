# Teste Técnico - API de Cartão de Crédito

## Visão Geral

Esta é uma API REST desenvolvida com NestJS que gerencia a elegibilidade de usuários para cartões de crédito baseado em score de crédito e renda. Os dados de score de crédito são obtidos através de uma API externa. Seu objetivo é implementar dois endpoints: Um para listar todos os usuários, com as informações de crédito, e o segundo para enviar um e-mail de marketing (mockado) para um usuário a partir de seu id, caso ele seja elegível para cartão.

## Configuração do Ambiente

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm

### Instalação

1. Instale as dependências:

```bash
npm install
```

2. Gere o Prisma Client:

```bash
npx prisma generate
```

3. Inicie a aplicação:

```bash
npm run dev
```

A API estará disponível em `http://localhost:3003`

**Nota:** O banco de dados SQLite já está populado com os usuários de teste.

## API Externa de Score de Crédito

A aplicação deve consumir uma API externa para obter os dados de score de crédito dos usuários. **Esta API já está configurada e rodando em segundo plano.**

### Especificações da API Externa

**Endpoint:** `GET https://teste-tecnico-back.um1vpc.easypanel.host/score/{cpf}`

**Headers Obrigatórios:**

```
x-api-key: z5QiVAqql2KdoSaZzWyLLTbz2mJNorNp
```

**Parâmetros:**

- `cpf` (string) - CPF do usuário (11 dígitos, apenas números)

**Resposta de Sucesso (200 OK):**

```json
{
  "data": {
    "cpf": "123.456.789-01",
    "score": 750,
    "status": "REGULAR"
  }
}
```

**Campos da Resposta:**

- `cpf` (string) - CPF consultado
- `score` (number) - Pontuação de crédito (0-1000)
- `status` (string) - Status do CPF, pode ser:
  - `"REGULAR"` - CPF em situação regular
  - `"BLOCKED"` - CPF bloqueado

**Notas:**

- A API retornará erro se o CPF não for encontrado

## Regras de Negócio

### Elegibilidade para Cartão de Crédito

Um usuário é elegível para receber um cartão de crédito se **TODAS** as seguintes condições forem atendidas:

1. **CPF deve estar REGULAR** (não bloqueado)
   - Se o status for "BLOCKED", o usuário NÃO é elegível

2. **Score mínimo de 300**
   - Se o score for menor que 300, o usuário NÃO é elegível

### Cálculo do Limite de Crédito

O limite de crédito é calculado com base no score e na renda mensal do usuário:

| Faixa de Score | Percentual da Renda |
| -------------- | ------------------- |
| 300 - 599      | 30%                 |
| 600 - 799      | 50%                 |
| 800 - 1000     | 75%                 |

O valor final do limite deve ser arredondado (número inteiro) e retornado em reais.

## Endpoints a Implementar

Você deve implementar os seguintes endpoints no arquivo `src/core/credit-card/credit-card.controller.ts` e `src/core/credit-card/credit-card.service.ts`:

### 1. Listar Status de Todos os Usuários

**Endpoint:** `GET /credit-card/users-status`

**Descrição:** Retorna uma lista de todos os usuários cadastrados com suas informações de score de crédito obtidas da API externa.

**Resposta de Sucesso esperada (200 OK):**

```json
{
  "data": [
    {
      "id": "clxxx1234567890",
      "cpf": "12345678901",
      "name": "João Silva",
      "email": "joao@example.com",
      "income": 300000,
      "emailSent": false,
      "cpfDetails": {
        "cpf": "123.456.789-01",
        "score": 750,
        "status": "REGULAR"
      },
      "creditDetails": {
        "access": true,
        "limit": 1500,
        "reason": null
      }
    },
    {
      "id": "clxxx2222222222",
      "cpf": "22222222222",
      "name": "Ana Lima",
      "email": "ana@example.com",
      "income": 600000,
      "emailSent": false,
      "cpfDetails": null,
      "creditDetails": {
        "access": false,
        "limit": 0,
        "reason": "Informações de score e CPF não encontradas"
      }
    }
  ]
}
```

**Estrutura de cada objeto no array `data`:**

- `id` - ID do usuário
- `cpf` - CPF do usuário (apenas números)
- `name` - Nome do usuário
- `email` - E-mail do usuário
- `income` - Renda mensal em centavos
- `emailSent` - Se o e-mail de marketing já foi enviado
- `cpfDetails` - Informações da API externa (ou `null` se não encontrado)
  - `cpf` - CPF formatado
  - `score` - Score de crédito (0-1000)
  - `status` - Status do CPF: `"REGULAR"` ou `"BLOCKED"`
- `creditDetails` - Informações de elegibilidade para cartão de crédito
  - `access` - Se o usuário tem acesso ao cartão (boolean)
  - `limit` - Limite de crédito em reais (número inteiro)
  - `reason` - Motivo da negação (ou `null` se elegível):
    - `"CPF bloqueado"` - Quando o CPF está bloqueado
    - `"Score insuficiente"` - Quando o score é menor que 300
    - `"Informações de score e CPF não encontradas"` - Quando a API externa falha
    - `null` - Quando o usuário é elegível

### 2. Enviar E-mail Marketing

**Endpoint:** `POST /credit-card/user/:userId/send-marketing-email`

**Descrição:** Envia um e-mail marketing para um usuário específico se ele for elegível para cartão de crédito.

**Parâmetros:**

- `userId` (path parameter) - ID do usuário

**Resposta de Sucesso (200 OK):**

```
Status 200 sem corpo de resposta
```

## Serviços Disponíveis

### PrismaService

Já configurado e disponível para injeção de dependência.

### EmailService

Já implementado e disponível para injeção de dependência.

## Estrutura do Projeto

```
src/
├── app.module.ts                 # Módulo principal
├── main.ts                       # Entrada da aplicação
├── core/
│   ├── credit-card/
│   │   ├── credit-card.controller.ts  # ARQUIVO PARA IMPLEMENTAR
│   │   ├── credit-card.service.ts     # ARQUIVO PARA IMPLEMENTAR
│   │   └── credit-card.module.ts
│   └── email/
│       ├── email.service.ts      # Já implementado
│       └── email.module.ts
└── database/
    ├── prisma.service.ts         # Já implementado
    ├── prisma.module.ts
```

## Testando a API

### 1. Testar Listagem de Usuários

```bash
curl http://localhost:3003/credit-card/users-status
```

### 2. Testar Envio de E-mail

Primeiro, obtenha um ID de usuário da listagem, depois:

```bash
curl -X POST http://localhost:3003/credit-card/user/{userId}/send-marketing-email
```

**Nota:** Pode testar da maneira que preferir: Curl, Postman, Insomnia, etc.

## Critérios de Avaliação

Seu código será avaliado com base em:

1. ✅ **Comunicação** - Capacidade de explicar com clareza a linha de raciocínio para resolver o problema
2. ✅ **Funcionalidade** - Os endpoints funcionam conforme especificado
3. ✅ **Tratamento de Erros** - Erros são tratados adequadamente com status HTTP corretos
4. ✅ **Performance** - Tempo de resposta
5. ✅ **Código Limpo** - Organização, nomenclatura e legibilidade
6. ✅ **Boas Práticas** - Uso correto de TypeScript, async/await, e padrões NestJS
7. ✅ **Regras de Negócio** - Implementação correta das regras de elegibilidade e cálculo de limite

---

**Boa sorte!** 🚀
