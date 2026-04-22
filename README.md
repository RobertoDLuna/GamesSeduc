# Jogos Seduc - Plataforma de Xadrez Escolar

Plataforma moderna para gestão de torneios de xadrez escolar, desenvolvida com React, Node.js e PostgreSQL.

## 🚀 Tecnologias

- **Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express, Prisma ORM, PostgreSQL, Zod, JWT
- **Infraestrutura**: Docker, Traefik, Portainer Swarm

## 📦 Como Iniciar

### Pré-requisitos
- Docker & Docker Compose
- Node.js 20+

### Instalação

1.  Clone o repositório.
2.  Inicie a infraestrutura:
    ```bash
    docker-compose up -d
    ```
3.  Configure o backend:
    ```bash
    cd backend
    npm install
    npx prisma migrate dev
    npx prisma db seed
    npm run dev
    ```
4.  Configure o frontend:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

## 🏗️ Estrutura do Projeto

- `/frontend`: Aplicação React (Vite).
- `/backend`: API Node.js com Express e Prisma.
- `docker-compose.yml`: Definição dos serviços de banco de dados e proxy.
- `implementation_plan.md`: Plano detalhado de execução das fases.
