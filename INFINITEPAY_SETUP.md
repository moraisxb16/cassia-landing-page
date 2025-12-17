# Configuração InfinitePay - Link Integrado

## Variáveis de Ambiente Necessárias

Configure as seguintes variáveis de ambiente no Netlify:

### 1. INFINITEPAY_HANDLE (OBRIGATÓRIO)
```
INFINITEPAY_HANDLE=seu_handle_aqui
```
- Obtenha no painel da InfinitePay: **Configurações > Link Integrado**
- Este é o identificador da sua conta InfinitePay

### 2. VITE_API_BASE_URL (OPCIONAL)
```
VITE_API_BASE_URL=/.netlify/functions/create-checkout-link
```
- Padrão: `/.netlify/functions/create-checkout-link`
- Para desenvolvimento local: `http://localhost:8888/.netlify/functions/create-checkout-link`

## Como Configurar no Netlify

1. Acesse o painel do Netlify
2. Vá em **Site settings > Environment variables**
3. Adicione:
   - `INFINITEPAY_HANDLE` = seu handle da InfinitePay
   - (Opcional) `VITE_API_BASE_URL` = URL da função serverless

## Fluxo de Checkout

1. Usuário preenche formulário e clica em "Finalizar Compra"
2. Frontend chama função serverless: `POST /.netlify/functions/create-checkout-link`
3. Função serverless faz `POST https://api.infinitepay.io/invoices/public/checkout/links`
4. API InfinitePay retorna URL do checkout
5. Frontend redireciona usuário para URL retornada
6. Usuário completa pagamento no checkout hospedado
7. InfinitePay redireciona de volta para:
   - Sucesso: `https://cassiacorviniy.com.br/pagamento/sucesso`
   - Cancelamento: `https://cassiacorviniy.com.br/pagamento/cancelado`

## URLs de Retorno

Configure no painel da InfinitePay:
- **URL de Sucesso**: `https://cassiacorviniy.com.br/pagamento/sucesso`
- **URL de Cancelamento**: `https://cassiacorviniy.com.br/pagamento/cancelado`

## Testando Localmente

1. Instale dependências:
   ```bash
   npm install
   ```

2. Configure variáveis de ambiente localmente (crie `.env`):
   ```
   INFINITEPAY_HANDLE=seu_handle
   VITE_API_BASE_URL=http://localhost:8888/.netlify/functions/create-checkout-link
   ```

3. Execute Netlify Dev:
   ```bash
   npx netlify dev
   ```

4. Acesse `http://localhost:8888`

## Estrutura de Arquivos

```
netlify/
  functions/
    create-checkout-link.ts  # Função serverless que gera link
src/
  components/
    InfinitePayButton.tsx    # Botão que chama função serverless
```

## Documentação Oficial

- API InfinitePay: https://api.infinitepay.io/invoices/public/checkout/links
- Método: POST
- Endpoint: `/invoices/public/checkout/links`

