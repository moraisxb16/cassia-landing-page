# Configuração ClickUp - Integração Pós-Pagamento

## Variáveis de Ambiente Necessárias

Configure as seguintes variáveis de ambiente no Netlify:

### 1. CLICKUP_API_TOKEN (OBRIGATÓRIO)
```
Nome: CLICKUP_API_TOKEN
Valor: SNKX8FXBDMSU2922I98P4JYS08I48VAC KBG5GAW6HBWZVNZJWULL8M35UNAK4980VZGXMHLMH9QLVC60ULP5HYD53JRW403A
```

**Como obter:**
1. Acesse: https://app.clickup.com/settings/apps
2. Vá em: **Apps > API**
3. Copie o **API Token**

### 2. CLICKUP_WORKSPACE_ID (OBRIGATÓRIO)
```
Nome: CLICKUP_WORKSPACE_ID
Valor: 90132835502
```

**Como obter:**
1. Acesse seu workspace no ClickUp
2. A URL será: `https://app.clickup.com/{workspace_id}/...`
3. O workspace_id está na URL

### 3. CLICKUP_LIST_ID (OBRIGATÓRIO)
```
Nome: CLICKUP_LIST_ID
Valor: {id_da_lista}
```

**Como obter:**
1. Acesse a lista onde deseja criar as tasks
2. A URL será: `https://app.clickup.com/{workspace_id}/v/li/{list_id}`
3. O list_id está na URL após `/v/li/`

## Como Configurar no Netlify

1. Acesse o painel do Netlify
2. Vá em **Site settings > Environment variables**
3. Adicione as três variáveis acima
4. **Redeploy** o site após adicionar

## Estrutura da Task Criada

A função `create-clickup-task` cria uma task com:

**Nome:**
- `Pedido - {Nome do Cliente} - R$ {Valor}`
- Ou `Pedido - {order_nsu} - R$ {Valor}` se não houver nome

**Descrição (Markdown):**
```
**Pedido Confirmado - InfinitePay**

**Dados do Pagamento:**
- Valor: R$ X,XX
- Método: PIX / Cartão de Crédito
- Order NSU: ...
- Transaction NSU: ...
- Slug: ...
- Comprovante: [link]

**Dados do Cliente:**
- Nome: ...
- Email: ...
- Telefone: ...
- CPF: ...

**Endereço:**
- Rua: ...
- Número: ...
- Cidade: ...
- Estado: ...
- CEP: ...

**Itens do Pedido:**
- Item 1 x 1 = R$ X,XX
- Item 2 x 2 = R$ Y,YY
```

**Tags:**
- `pedido`
- `infinitepay`
- `pix` ou `cartão-de-crédito`

**Status:** `to do`
**Prioridade:** `Normal` (3)

## Fluxo Completo

1. Cliente completa pagamento na InfinitePay
2. InfinitePay redireciona para `/pagamento/sucesso?order_nsu=...&transaction_nsu=...`
3. Página de sucesso busca dados do pedido do `localStorage`
4. Página de sucesso chama `POST /.netlify/functions/create-clickup-task`
5. Função serverless cria task no ClickUp com todos os dados
6. Task aparece na lista configurada no ClickUp

## Testando

Após configurar as variáveis:

1. Faça um pedido de teste
2. Complete o pagamento (ou simule)
3. Verifique se a task foi criada no ClickUp
4. Verifique os logs da função no Netlify

## Troubleshooting

**Erro: "CLICKUP_API_TOKEN não configurado"**
- Verifique se a variável está configurada no Netlify
- Faça redeploy após adicionar

**Erro: "CLICKUP_LIST_ID não configurado"**
- Configure a variável `CLICKUP_LIST_ID` com o ID da lista
- O ID está na URL da lista no ClickUp

**Task não aparece no ClickUp**
- Verifique os logs da função no Netlify
- Confirme que o `list_id` está correto
- Verifique se o token tem permissão para criar tasks

