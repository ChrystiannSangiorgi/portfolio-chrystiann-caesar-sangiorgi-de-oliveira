# Brainstorm de Design — Pertinho

## Abordagem 1 — "Calor Familiar" (Warm Analog)
<response>
<text>
**Design Movement:** Warm Analog / Humanist UI
**Core Principles:**
- Acolhimento visual: tudo comunica segurança e proximidade
- Hierarquia radical: apenas o essencial existe na tela
- Escala generosa: elementos grandes para dedos e olhos cansados

**Color Philosophy:** Creme quente (#FBF7F0) como fundo — evoca papel envelhecido, cartas de família. Verde musgo (#3B7A57) para ações positivas. Vermelho terracota (#C7423B) para encerrar. Laranja mel (#E08D3C) para lembretes. Texto quase-preto (#2B2B2B).

**Layout Paradigm:** Grade de cards centrada verticalmente, sem header, sem menus. O conteúdo é o app. Modo Família usa layout de lista com seções colapsáveis.

**Signature Elements:**
- Fotos circulares com borda creme e sombra suave
- Botões de largura total com bordas muito arredondadas (32dp)
- Tipografia Nunito — arredondada, amigável, legível

**Interaction Philosophy:** Cada toque tem feedback imediato (escala 0.97). Toque longo revela o modo oculto sem expor ao idoso.

**Animation:** Fade-in 200ms em transições. Pulse suave no botão "Atender". Sem animações complexas.

**Typography System:** Nunito 700 para botões e títulos (28–36sp), Nunito 400 para corpo (22sp mínimo).
</text>
<probability>0.08</probability>
</response>

## Abordagem 2 — "Clareza Clínica" (Clean Medical)
<response>
<text>
**Design Movement:** Clean Medical / Accessibility-First
**Core Principles:**
- Contraste máximo: WCAG AAA em todos os textos
- Espaço negativo abundante
- Ícones sempre com texto

**Color Philosophy:** Branco puro como fundo. Azul confiável (#1A6FA8) para ações. Vermelho vivo (#D32F2F) para recusar/encerrar. Cinza claro (#F5F5F5) para cards.

**Layout Paradigm:** Lista vertical de contatos (não grade) para evitar confusão espacial. Um contato por linha, foto à esquerda, botão à direita.

**Signature Elements:**
- Separadores horizontais entre contatos
- Ícones Material grandes (48dp) sempre com label
- Fundo branco absoluto

**Interaction Philosophy:** Feedback sonoro + visual em cada ação. Confirmação antes de encerrar chamada.

**Animation:** Apenas ripple no toque. Sem transições de tela.

**Typography System:** Inter 700 para botões, Inter 400 para corpo. 24sp mínimo.
</text>
<probability>0.05</probability>
</response>

## Abordagem 3 — "Jardim de Vó" (Botanical Warmth)
<response>
<text>
**Design Movement:** Botanical Warmth / Organic Softness
**Core Principles:**
- Texturas orgânicas sutis no fundo
- Paleta inspirada em natureza brasileira
- Tipografia expressiva com personalidade

**Color Philosophy:** Fundo creme com leve textura de papel (#FBF7F0). Verde folha (#3B7A57) para ações. Terracota (#C7423B) para recusar. Amarelo âmbar (#E08D3C) para lembretes. Marrom escuro (#3D2B1F) para texto.

**Layout Paradigm:** Grade 2×3 de cards com cantos arredondados grandes. Cards com leve gradiente interno. Sombra colorida (verde para Marina, etc.).

**Signature Elements:**
- Gradiente sutil creme→branco no fundo
- Cards com sombra colorida baseada na relação do contato
- Tipografia Nunito com letter-spacing generoso

**Interaction Philosophy:** Animação de "pulso" no botão Chamar para indicar que está pronto. Toque longo com feedback de progresso visual.

**Animation:** Fade-in suave (200ms). Escala 0.97 no toque. Pulse no botão Chamar (2s loop).

**Typography System:** Nunito 800 para saudação e títulos, Nunito 600 para botões, Nunito 400 para corpo.
</text>
<probability>0.07</probability>
</response>

---

## Escolha Final: Abordagem 1 — "Calor Familiar"

A filosofia **Warm Analog** é a mais alinhada com a persona Dona Cida: acolhedora, sem distrações, com hierarquia radical. O fundo creme e os botões verdes/vermelhos de largura total criam um caminho único e óbvio para cada ação. A tipografia Nunito reforça o tom familiar e legível.
