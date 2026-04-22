# Plano de Execução Detalhado: Plataforma Jogos Seduc (Xadrez Escolar)

Analisei o documento e usarei suas instruções em minhas respostas. Este plano visa transformar as 17 telas identificadas em um ecossistema funcional, robusto e escalável.

## 🏗️ 1. Arquitetura do Sistema

Utilizaremos uma arquitetura de pastas separadas (`frontend` e `backend`) para garantir desacoplamento.

- **Backend**: Node.js + Express + TypeScript.
- **ORM**: Prisma (PostgreSQL).
- **Frontend**: React (Vite) + TypeScript + Tailwind CSS + shadcn/ui.
- **Infra**: Docker, Traefik, Portainer Swarm.

---

## 📂 2. Modelagem de Dados (Prisma Schema) [DONE]

As entidades principais foram implementadas:
- `User`: Administradores, Professores e Alunos.
- `School`: Vínculo institucional.
- `Student`: Perfil, histórico e rating.
- `Tournament`: Configurações e status.
- `Round`: Rodadas do sistema suíço.
- `Match`: Partidas individuais.

---

## 🛠️ 3. Fases de Execução

### Fase 0: Setup de Ambiente [DONE]
- Estrutura de pastas, TypeScript e Prisma configurados.
- Scripts de inicialização (`npm run dev`) funcionais.

### Fase 1: Backend Core & Autenticação [DONE]
- Login, JWT Hardening e proteção de rotas por Roles.
- Redirecionamento inteligente baseado no status de autenticação.

### Fase 2: Gestão de Cadastros [DONE]
- CRUDs de Escolas e Alunos com UI Premium.
- **Importação CSV**: Implementada para Alunos (lote).
- **Multi-tenant**: Professores veem apenas seus respectivos dados.

### Fase 3: Motor de Torneios [DONE]
- Lógica de criação de torneios com seleção de participantes.
- Algoritmo de emparceiramento (Swiss System) no backend.
- Listagem visual de torneios com status.

### Fase 6: Analytics & Dashboards [DONE]
- Dashboard Home com KPIs (Escolas, Alunos, Torneios).
- Gráficos de crescimento e distribuição (Recharts).
- Tabela de atividades recentes.

### Fase 4: Frontend & Landing Page [PENDING]
- Criação da Landing Page (SEO optimized).
- Sistema de Temas e customização visual.

### Fase 5: Partida & Interatividade [PENDING]
- Interface de tabuleiro de xadrez (`react-chessboard`).
- Registro de jogadas e validação de resultados.

### Fase 7: Deploy Swarm [PENDING]
- Finalização dos arquivos de stack e configuração de infra final.

---

## 🚀 Próximos Passos Imediatos

1. **Landing Page**: Criar a cara pública do projeto.
2. **Tabuleiro**: Implementar a experiência real de jogo para os alunos.
