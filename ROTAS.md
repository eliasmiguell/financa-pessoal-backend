# 📋 Documentação das Rotas da API

## 🔐 Autenticação
Todas as rotas abaixo requerem autenticação via token JWT.

---

## 🏷️ **CATEGORIAS DE DESPESAS**

### **POST** `/api/personal-finance/categories`
Criar nova categoria de despesa.

**Body:**
```json
{
  "name": "Alimentação",
  "color": "#EF4444",
  "icon": "utensils",
  "budget": 800.00
}
```

### **GET** `/api/personal-finance/categories`
Listar todas as categorias do usuário.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Alimentação",
    "color": "#EF4444",
    "icon": "utensils",
    "budget": 800.00,
    "totalSpent": 650.00,
    "remainingBudget": 150.00,
    "percentageUsed": 81.25
  }
]
```

### **PUT** `/api/personal-finance/categories/:id`
Atualizar categoria existente.

**Body:**
```json
{
  "name": "Alimentação",
  "color": "#EF4444",
  "icon": "utensils",
  "budget": 1000.00
}
```

### **DELETE** `/api/personal-finance/categories/:id`
Deletar categoria.

---

## 💸 **DESPESAS PESSOAIS**

### **POST** `/api/personal-finance/expenses`
Criar nova despesa.

**Body:**
```json
{
  "description": "Supermercado",
  "amount": 150.00,
  "type": "fixa",
  "status": "pendente",
  "categoryId": 1,
  "dueDate": "2024-01-15",
  "paidDate": null,
  "isRecurring": true,
  "recurringInterval": "mensal"
}
```

### **GET** `/api/personal-finance/expenses`
Listar todas as despesas do usuário.

**Query Parameters:**
- `type`: Filtrar por tipo (fixa, variavel)
- `status`: Filtrar por status (pendente, pago, vencido)
- `categoryId`: Filtrar por categoria
- `month`: Mês (1-12)
- `year`: Ano
- `isRecurring`: Filtrar recorrentes (true/false)

### **PUT** `/api/personal-finance/expenses/:id`
Atualizar despesa existente.

### **DELETE** `/api/personal-finance/expenses/:id`
Deletar despesa.

---

## 💰 **RECEITAS PESSOAIS**

### **POST** `/api/personal-finance/incomes`
Criar nova receita.

**Body:**
```json
{
  "description": "Salário",
  "amount": 5000.00,
  "type": "salario",
  "receivedDate": "2024-01-05",
  "isRecurring": true,
  "recurringInterval": "mensal"
}
```

### **GET** `/api/personal-finance/incomes`
Listar todas as receitas do usuário.

**Query Parameters:**
- `type`: Filtrar por tipo (salario, freelance, venda, investimento, bonus)
- `month`: Mês (1-12)
- `year`: Ano
- `isRecurring`: Filtrar recorrentes (true/false)

### **PUT** `/api/personal-finance/incomes/:id`
Atualizar receita existente.

### **DELETE** `/api/personal-finance/incomes/:id`
Deletar receita.

---

## 🎯 **METAS FINANCEIRAS**

### **POST** `/api/personal-finance/goals`
Criar nova meta financeira.

**Body:**
```json
{
  "name": "Viagem para Europa",
  "description": "Economizar para viajar para a Europa",
  "targetAmount": 10000.00,
  "deadline": "2024-12-31",
  "priority": "ALTA"
}
```

### **GET** `/api/personal-finance/goals`
Listar todas as metas do usuário.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Viagem para Europa",
    "description": "Economizar para viajar para a Europa",
    "targetAmount": 10000.00,
    "currentAmount": 2500.00,
    "deadline": "2024-12-31",
    "priority": "ALTA"
  }
]
```

### **PUT** `/api/personal-finance/goals/:id`
Atualizar meta existente.

### **DELETE** `/api/personal-finance/goals/:id`
Deletar meta.

---

## 📊 **RELATÓRIOS E ANÁLISES**

### **GET** `/api/personal-finance/budget`
Obter orçamento pessoal.

### **GET** `/api/personal-finance/analytics`
Obter análises de despesas.

---

## 🔧 **CÓDIGOS DE STATUS**

- **200**: Sucesso
- **201**: Criado com sucesso
- **400**: Dados inválidos
- **401**: Não autorizado
- **404**: Não encontrado
- **500**: Erro interno do servidor

---

## 📝 **EXEMPLOS DE USO**

### Criar uma categoria:
```bash
curl -X POST http://localhost:8004/api/personal-finance/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "name": "Transporte",
    "color": "#3B82F6",
    "icon": "car",
    "budget": 300.00
  }'
```

### Criar uma despesa:
```bash
curl -X POST http://localhost:8004/api/personal-finance/expenses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "description": "Combustível",
    "amount": 80.00,
    "type": "variavel",
    "status": "pago",
    "categoryId": 1
  }'
```

### Criar uma receita:
```bash
curl -X POST http://localhost:8004/api/personal-finance/incomes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "description": "Freelance",
    "amount": 1200.00,
    "type": "freelance",
    "receivedDate": "2024-01-10"
  }'
```

### Criar uma meta:
```bash
curl -X POST http://localhost:8004/api/personal-finance/goals \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "name": "Reserva de Emergência",
    "description": "Criar fundo de emergência",
    "targetAmount": 5000.00,
    "priority": "ALTA"
  }'
```
