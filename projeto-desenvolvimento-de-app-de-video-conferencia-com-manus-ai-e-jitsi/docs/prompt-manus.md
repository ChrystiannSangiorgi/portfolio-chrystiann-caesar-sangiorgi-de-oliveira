# Briefing para Manus AI — Pertinho

> Prompt estruturado em 9 seções (Contexto → Personas → Telas → Comportamentos → Design → Acessibilidade → Dados Mock → Stack → Critérios de Aceite) usado para gerar o app Pertinho via Manus AI.

---

## 1. Contexto e Objetivo

Você vai construir um aplicativo Android funcional chamado **Pertinho**, um app de videochamada voltado para idosos e suas famílias. Use **Jitsi Meet** como infraestrutura de videoconferência (Jitsi Meet External API — `https://meet.jit.si/external_api.js` — embedada em WebView para o build Android, ou diretamente em iframe para o preview web).

O diferencial do app é uma UX radicalmente simplificada para o idoso (zero alfabetização digital exigida) combinada com uma camada robusta de configuração para o familiar/cuidador, separadas por um PIN. Cada par idoso-familiar tem um nome de sala Jitsi fixo e determinístico, totalmente invisível ao usuário final.

## 2. Personas

**Dona Cida, 72 anos** — usuária primária. Mora sozinha em Recife. Sabe atender o celular e abrir o WhatsApp, mas se perde em qualquer tela com mais de 3 elementos. Não vai aprender a digitar link, código de sala ou nome de usuário.

**Marina, 38 anos** — cuidadora. Mora em São Paulo, filha da Dona Cida. Configurou o celular da mãe uma vez na última visita. Quer agendar chamadas recorrentes, garantir que a mãe receba lembrete e tenha um caminho de UM toque para falar com ela.

## 3. Arquitetura de Telas

O app tem dois modos separados por PIN de 4 dígitos.

### MODO IDOSO (padrão ao abrir o app)

**Tela 1 — Início (Contatos Favoritos)**
- Saudação grande no topo: "Olá, Cida!" (nome configurado no Modo Família).
- Grade 2×3 com até 6 cards de contato.
- Cada card contém: foto circular grande (180dp) + nome + relação (ex: "Filha") + botão "Chamar" verde de largura total e altura 64dp.
- Tipografia mínima 22sp no corpo; botões 28sp em negrito.
- Fundo creme (#FBF7F0), cards brancos com sombra suave.
- Sem menu, sem header, sem ícones decorativos. Apenas os contatos.

**Tela 2 — Recebendo Chamada**
- Foto do contato em tela cheia com leve desfoque ao fundo.
- Nome do contato no topo em fonte 36sp.
- Dois botões enormes lado a lado, altura 120dp cada:
  - Esquerda: vermelho (#C7423B), texto "Recusar".
  - Direita: verde (#3B7A57), texto "Atender".
- Vibração contínua + toque característico.
- Se o cuidador habilitou atendimento automático: após 30 segundos sem ação, atende sozinho.

**Tela 3 — Em Chamada**
- Vídeo do contato em tela cheia (Jitsi embedado).
- Picture-in-picture do próprio vídeo no canto superior direito.
- Barra inferior com 3 botões grandes, altura 80dp:
  - Mutar microfone (ícone + texto "Silenciar" / "Falar").
  - Encerrar (vermelho, texto "Desligar").
  - Câmera (ícone + texto "Câmera Ligada" / "Câmera Desligada").
- Sem opções avançadas — chat, compartilhar tela, gravação ficam ocultos/desabilitados.

### MODO FAMÍLIA (acessado por PIN)

**Tela 4 — Painel do Cuidador**
- Lista de contatos cadastrados (editar/remover).
- Botão "+ Adicionar Contato".
- Seção "Chamadas Agendadas" com cards mostrando dia/hora/contato.
- Botão "+ Agendar Chamada".
- Seção "Configurações": nome do idoso, atendimento automático (on/off), tempo até atender, mudar PIN.

**Tela 5 — Cadastrar Contato**
- Campo: nome (obrigatório).
- Campo: foto (upload ou tirar foto agora).
- Campo: relação (ex: "Filha", "Neto") — opcional, aparece abaixo do nome no card do Modo Idoso.
- O ID da sala Jitsi é gerado automaticamente pelo sistema no formato `pertinho-{slug-idoso}-{slug-contato}` (ex: `pertinho-cida-marina`). Este ID **não é exibido em nenhuma tela** do app.

**Tela 6 — Agendar Chamada**
- Selecionar contato (dropdown).
- Selecionar dia(s) da semana (chips selecionáveis múltiplos).
- Selecionar horário (time picker grande).
- Toggle: "Lembrar a Cida 5 min antes".
- Botão "Salvar Agendamento".

## 4. Comportamentos Críticos

1. **Sala Jitsi determinística** — o nome da sala é idêntico nos dois lados (app do idoso e link/app do familiar), permitindo que entrem na mesma chamada sem digitar nada. Slug é normalizado (sem acentos, lowercase, hífens).

2. **Lembrete visual de chamada agendada** — 5 minutos antes do horário, sobreposição em tela cheia aparece no Modo Idoso: "Daqui a pouco a Marina vai te ligar! ❤️" com botão "Ok" gigante. No preview, simular com botão de teste.

3. **Acesso ao Modo Família** — toque longo de 3 segundos no canto inferior direito da tela inicial do Modo Idoso → abre tela de inserção de PIN. O idoso não descobre por acidente.

4. **Persistência local** — contatos, agendamentos e configurações ficam salvos localmente (Room no Android nativo, ou localStorage no preview web).

## 5. Design System

**Paleta de cores:**
- Fundo: `#FBF7F0` (creme quente)
- Cards: `#FFFFFF`
- Verde (ação positiva, atender, chamar): `#3B7A57`
- Vermelho (encerrar, recusar): `#C7423B`
- Laranja (destaque, lembrete): `#E08D3C`
- Texto principal: `#2B2B2B`
- Texto secundário: `#6B6B6B`

**Tipografia:** Nunito ou Inter (sans-serif arredondada). Pesos: 400 corpo, 700 botões/títulos.

**Espaçamento:** padding mínimo 24dp em containers, 16dp entre elementos.

**Sombras:** `0 4 12 rgba(0,0,0,0.06)`.

**Bordas arredondadas:** 16dp em cards, 32dp em botões grandes.

**Ícones:** Material Symbols Rounded, sempre acompanhados de texto.

**Animações:** mínimas — apenas fade-in (200ms) em transições de tela.

## 6. Acessibilidade

- Todos os botões com altura mínima de 64dp (alvo de toque amplo).
- Contraste WCAG AAA para textos até 18pt; AA acima disso.
- Suporte ao "tamanho de texto grande" do sistema Android.
- Labels descritivos em screen reader para todos os controles interativos.

## 7. Dados Mock Iniciais

**Idoso configurado:** "Cida"
**PIN do Modo Família:** `1234`

**Contatos cadastrados:**
- Marina (Filha) — sala: `pertinho-cida-marina`
- Pedro (Filho) — sala: `pertinho-cida-pedro`
- Helena (Neta) — sala: `pertinho-cida-helena`

**Agendamento exemplo:** Marina, toda quarta-feira, 16h00, com lembrete habilitado.

**Configurações:** atendimento automático ativado, tempo 30s.

## 8. Stack Sugerido

- **Android nativo:** Kotlin + Jetpack Compose + Jitsi Meet Android SDK.
- **OU preview web (caso o output seja simulação navegável):** React + TypeScript + Tailwind + Jitsi Meet External API.
- Persistência local conforme a stack (Room ou localStorage).

## 9. Critérios de Aceite

- [x] Modo Idoso abre como tela padrão com 3 contatos pré-populados visíveis.
- [x] Ao tocar "Chamar" em qualquer contato, abre chamada Jitsi com a sala determinística correta.
- [x] Tela "Em Chamada" exibe Jitsi funcional com os 3 botões de controle simplificados.
- [x] Tela "Recebendo Chamada" é simulável por botão de teste no preview.
- [x] Toque longo de 3s no canto inferior direito → tela de PIN.
- [x] PIN `1234` libera Modo Família.
- [x] Modo Família permite CRUD de contatos.
- [x] Modo Família permite criar agendamento e listá-lo.
- [x] Lembrete visual de chamada agendada simulável por botão de teste.
- [x] Design system seguido fielmente em todas as telas (cores, tipografia, espaçamento).
- [x] Preview navegável publicado com URL pública.
- [x] QR Code da URL gerado pelo Manus AI.

---

## Notas de Iteração

Após a geração inicial, foram aplicados dois prompts de refinamento:

**Iteração 1 — Integração real do Jitsi:** o primeiro output do Manus apresentou a tela "Em Chamada" como mockup visual (placeholder com "Conectando..."). Foi necessário um segundo prompt explicitando o uso da `JitsiMeetExternalAPI`, com a configuração completa (`prejoinPageEnabled: false`, `TOOLBAR_BUTTONS: []`, `SHOW_JITSI_WATERMARK: false`) e o wiring dos botões customizados via `executeCommand('toggleAudio'/'toggleVideo'/'hangup')`.

**Iteração 2 — Ajustes de UX:** correções pontuais nos tamanhos de botão e ocultação de IDs técnicos (nomes de sala Jitsi) das telas voltadas ao usuário final.
