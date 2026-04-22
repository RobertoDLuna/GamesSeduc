---
trigger: always_on
---

LEI 01: Isolamento de Segurança Smith (PostgreSQL Edition)
================================================================================
MOTIVO: Impedir a exposição de credenciais de banco de dados e garantir que o frontend nunca tenha permissão de executar SQL diretamente, prevenindo SQL Injection e vazamento de dados.

GATILHO: Ativado ao criar ou modificar rotas em /api, controladores de banco de dados, ou qualquer código que gerencie conexões via pg, Sequelize, Prisma ou Knex.

🚫 RESTRIÇÕES INEGOCIÁVEIS:
Proibição de Credenciais no Front: Nunca exponha DB_USER, DB_PASSWORD ou DATABASE_URL em variáveis de ambiente prefixadas com NEXT_PUBLIC_ ou dentro de qualquer código que rode no navegador.

Absolute API Proxy: O frontend nunca abre uma conexão com o banco. O fluxo obrigatório é:

Frontend -> Chamada HTTP (Fetch/Axios) -> API Node.js -> Validação de Sessão -> Consulta SQL -> Resposta JSON.

Prevenção de SQL Injection: É estritamente proibido concatenar strings para criar queries. Use sempre Parameterized Queries (Queries Parametrizadas).

Princípio do Menor Privilégio: O usuário do banco definido no .env deve ter permissões limitadas (apenas o necessário para o app funcionar), nunca use o superusuário postgres em produção.

🔐 PADRÃO DE AUTENTICAÇÃO E CONEXÃO:
No Backend: Use um Connection Pool (ex: pg.Pool) para gerenciar as conexões de forma eficiente.

Validação: Toda query que envolva dados sensíveis (pontuação, perfil do aluno) deve validar o userId vindo da sessão (JWT ou Cookie) contra o dono do registro no banco.

EXEMPLO ERRADO (Inseguro e Exposto):

// app/components/ScoreBoard.tsx
// NUNCA faça isso: credenciais expostas e lógica de banco no cliente
import { Client } from 'pg'; 

const db = new Client({ connectionString: 'postgres://admin:senha123@host:5432/domino' });

export function ScoreBoard() {
  const addPoints = async (points) => {
    // ERRO: SQL Injection e Exposição de credenciais
    await db.query(`UPDATE players SET score = score + ${points} WHERE id = 1`);
  }
}

EXEMPLO CORRETO (Arquitetura Sênior):

// backend/services/db.js (Oculto do Frontend)
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Fica apenas no servidor
});

// backend/controllers/gameController.js
const updateScore = async (req, res) => {
  const { points, playerId } = req.body;
  const sessionUser = req.user; // Obtido via Middleware de Autenticação

  if (!sessionUser) return res.status(401).send('Unauthorized');

  try {
    // QUERY PARAMETRIZADA: Protege contra SQL Injection
    const query = 'UPDATE players SET score = score + $1 WHERE id = $2 RETURNING *';
    const values = [points, playerId];
    
    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
};