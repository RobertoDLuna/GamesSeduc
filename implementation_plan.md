# Plano de Execução Detalhado: Plataforma Jogos Seduc (Xadrez Escolar)

Analisei o documento e usarei suas instruções em minhas respostas. Este plano visa transformar as 17 telas identificadas em um ecossistema funcional, robusto e escalável.

## 🏗️ 1. Arquitetura do Sistema

Utilizaremos uma arquitetura de pastas separadas (`frontend` e `backend`) para garantir desacoplamento.

- **Backend**: Node.js + Express + TypeScript.
- **ORM**: Prisma (PostgreSQL).
- **Frontend**: React (Vite) + TypeScript + Tailwind CSS + shadcn/ui.
- **Infra**: Docker, Traefik, Portainer Swarm.

---

## 📂 2. Modelagem de Dados (Prisma Schema)

Com base nas 17 telas, as entidades principais serão:
- `User`: Administradores, Professores e Alunos (Roles).
- `School`: Vínculo institucional.
- `Student`: Perfil detalhado, histórico e pontuação.
- `Tournament`: Configurações de torneios (Suíço, Eliminatórias).
- `Round`: Rodadas de emparceiramento.
- `Match`: Partidas individuais entre alunos.
- `Media`: Armazenamento de metadados de arquivos (Fotos, Certificados).
- `Config`: Personalização visual da plataforma.

---

## 🛠️ 3. Fases de Execução

### Fase 0: Setup de Ambiente & Dockerização (Infra Inicial)
- Configuração do `docker-compose.yml` para desenvolvimento (PostgreSQL + Adminer).
- Inicialização dos projetos Frontend e Backend com TypeScript.
- Configuração do Prisma e migrações iniciais.
- Setup do Traefik como Reverse Proxy local para simular o ambiente Swarm.

### Fase 1: Backend Core & Autenticação (Telas 1 e 9)
- Implementação do JWT Hardening (Lei 05).
- Rotas de Login e Recuperação de Senha.
- Middleware de validação com Zod e proteção de rotas por Roles.
- **Entrega**: API de Auth funcional.

### Fase 2: Gestão de Cadastros (Telas 4, 8, 14, 16)
- CRUDs de Escolas, Usuários e Alunos.
- Implementação da lógica de **Importação via CSV/Excel** (necessário para as telas identificadas).
- Upload de mídias (Fotos de perfil) usando Multer + Storage local (volume persistente).
- **Desafio**: Garantir a Lei 03 (Multi-tenant) para que professores vejam apenas seus alunos/escolas.

### Fase 3: O "Motor" de Torneios (Telas 3, 10, 15, 17)
- Lógica de criação de torneios e definição de regras.
- Algoritmo de emparceiramento (Swiss System ou similar).
- Gestão de rodadas e lançamento de resultados.

### Fase 4: Frontend & UI System (Telas 5, 7, 11)
- Criação da Landing Page (SEO optimized).
- Perfil do Aluno com Dashboards de evolução.
- Sistema de Temas (Customização via Admin) refletindo dinamicamente no CSS.
- Implementação do `shadcn/ui` para todos os formulários.

### Fase 5: Partida & Interatividade (Tela 13)
- Interface de tabuleiro de xadrez (utilizando `chess.js` e `react-chessboard` para lógica e visual).
- Registro de jogadas e validação de fim de partida.

### Fase 6: Analytics & Reports (Telas 2, 6, 12)
- Dashboards administrativos com gráficos (Chart.js ou Recharts).
- Geração de relatórios em PDF/Excel para exportação de resultados.

### Fase 7: Deploy Swarm & Portainer
- Criação do `stack.yml` para Portainer.
- Configuração do Traefik para HTTPS e Load Balancing.
- Configuração de volumes persistentes para o PostgreSQL e Mídias.

---

## ⚖️ 4. Análise Crítica (Anti-Sycophancy)

1.  **Multer vs Storage**: Para um ambiente Swarm (multi-node), o Multer com armazenamento local falhará se os containers rodarem em nós diferentes sem um volume compartilhado (como NFS ou GlusterFS). **Proposta**: Manter Multer, mas preparar a abstração para um S3-Compatible (Minio) caso o volume compartilhado não seja uma opção.
2.  **Complexidade das 17 Telas**: Tentar desenvolver as 17 simultaneamente causará perda de foco. **Decisão**: Seguiremos a ordem das fases acima. Só avançaremos para a "Fase de Torneios" quando o "Cadastro de Alunos/Escolas" estiver 100% sólido.
3.  **Segurança**: O uso de Zod no backend é excelente, mas implementaremos também no frontend para feedback instantâneo (Shared Schemas).

---

## 🚀 5. Próximos Passos

1.  Aprovação deste plano.
2.  Criação da estrutura de pastas e `docker-compose` inicial.
3.  Definição do `schema.prisma`.

**Aguardando sua validação para iniciar a Fase 0.**
