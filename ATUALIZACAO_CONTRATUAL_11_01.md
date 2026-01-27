## Atualização Contratual (Entrega Técnica) — Projeto Landing Page Cássia Corviniy

**Data da entrega:** 26/01/2026  
**Repositório:** `cassia-landing-page`  
**Branch:** `main`  
**Status:** **Projeto finalizado (entregue em produção)**  

---

### 1) Objetivo e escopo desta entrega
Consolidar ajustes de **conteúdo**, **catálogo**, **checkout** e **integrações** (InfinitePay + ClickUp), além de correções pontuais de UX/UI e rodapé.

---

### 2) Entregas realizadas (o que foi feito)

#### 2.1 Catálogo (Cursos/Mentoria/Produtos)
- **Curso Mesa Turquesa Dragonlight**: imagem atualizada para URL fornecida.
- **Mentoria em Grupo – Novo Programa**: imagem atualizada para URL fornecida.
- **Seção Produtos**: rótulo “Produtos Holísticos” ajustado para **“Produtos”**.

#### 2.2 Conteúdo institucional (Hero / Quem Eu Sou / Meu Trabalho)
- **Hero (headline e subheadline)**: texto atualizado para:
  - “Você não precisa ser outra pessoa. Você precisa se VER.”
  - “QUERER é o início de toda a transformação.”
  - Bio: “Terapeuta Integrativa, Mestre Dragonlight e Mentora do Desenvolvimento Humano.”
- **Alt da imagem do Hero**: ajustado para refletir o posicionamento (“Terapeuta Integrativa”).
- **Quem Eu Sou**: texto substituído conforme copy final enviada (5 parágrafos).
- **Meu Trabalho**: frase substituída para:
  - “Nos afastamos de partes de nós ao longo da vida, mas nossa essência sempre foi integrada.”

#### 2.3 Seção “Nossos Serviços”
- Removidos itens:
  - **Limpeza Energética do Ambiente**
  - **Terapia Individual**
- Atualizado item **Atendimentos Empresariais** para:
  - “Saúde Mental (NR1), Desenvolvimento de Líderes, Palestras e Oficinas.”

#### 2.4 Rodapé (Conecte-se / Copyright)
- **Conecte-se**: adicionados links para:
  - Instagram
  - YouTube
  - Facebook
- Atualizado copyright:
  - **© 2026 Cássia Corviniy. Todos os direitos reservados.**

---

### 3) Checkout e integrações (técnico)

#### 3.1 InfinitePay
- Checkout é realizado via **checkout hospedado** da InfinitePay.
- Frontend gera link chamando função serverless:
  - `POST /.netlify/functions/create-checkout-link`
- Retorno do pagamento redireciona para:
  - `/pagamento/sucesso` (com parâmetros da InfinitePay, ex: `order_nsu`, `transaction_nsu`, `amount`, `capture_method`, `receipt_url`).

**Variável de ambiente (Netlify):**
- `INFINITEPAY_HANDLE` (**obrigatória**) — InfiniteTag sem `$`.

#### 3.2 ClickUp (automação pós-pagamento)
- Após sucesso de pagamento, o sistema dispara criação automática de task no ClickUp via backend:
  - `POST /.netlify/functions/create-clickup-order`
- A automação tenta preencher campos (custom fields) conforme configuração da lista no ClickUp.
- Erros de ClickUp são tratados de forma **silenciosa** para não afetar UX do cliente (checkout não quebra).

**Variáveis de ambiente (Netlify):**
- `CLICKUP_API_TOKEN` (**obrigatória**)
- `CLICKUP_WORKSPACE_ID` (**obrigatória**)
- `CLICKUP_LIST_ID` (**obrigatória**)

**Documentação interna:**
- `CLICKUP_SETUP.md`
- `CLICKUP_IMPLEMENTACAO_FINAL.md`

---

### 4) Arquivos alterados (rastreabilidade)

#### 4.1 Código (frontend)
- `src/components/sections/Courses.tsx`
- `src/components/sections/Products.tsx`
- `src/components/sections/Services.tsx`
- `src/components/sections/Hero.tsx`
- `src/components/sections/AboutMe.tsx`
- `src/components/sections/MyWork.tsx`
- `src/components/layout/Footer.tsx`

#### 4.2 Documentação
- `CORRECOES_PRODUTOS_FRONTEND.md`
- `CLICKUP_SETUP.md`
- `CLICKUP_IMPLEMENTACAO_FINAL.md`
- `ATUALIZACAO_CONTRATUAL_11_01.md` (este documento)

---

### 5) Controle de versão (commits)
As alterações foram consolidadas e publicadas em `main`:
- `a3e1806` (atualização imagem Mesa Turquesa)
- `3579c99` (consolidação: imagens + textos + redes + ajustes serviços + doc)

---

### 6) Status final da entrega
- **Projeto finalizado e entregue**.
- Conteúdos e imagens solicitadas foram aplicados.
- Integrações existentes permanecem operacionais (InfinitePay + ClickUp), com documentação interna para setup.

---

### 7) Manutenções e ajustes futuros (processo recomendado)
Para novos ajustes a partir desta entrega, recomenda-se **abrir manutenções** com:
- **Solicitação**: descrição objetiva do ajuste (texto/imagem/link/regra).
- **Local**: seção/página alvo + print (se possível).
- **Critério de aceite**: “como validar que ficou pronto”.
- **Prioridade**: baixa/média/alta.

**Observação técnica importante:** alterações locais em `dist/` e `node_modules/.vite/` são artefatos de build/cache e **não devem** ser versionadas (não fazem parte da manutenção).


