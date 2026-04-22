import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { TournamentService } from '../services/TournamentService';

const prisma = new PrismaClient();

const createTournamentSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  startDate: z.string().datetime(), // ISO 8601
  participantIds: z.array(z.string().uuid()).min(2, "Mínimo de 2 participantes")
});

export const TournamentController = {
  async create(req: any, res: any) {
    try {
      const data = createTournamentSchema.parse(req.body);
      
      const tournament = await prisma.tournament.create({
        data: {
          title: data.title,
          description: data.description,
          startDate: new Date(data.startDate),
          participants: {
            connect: data.participantIds.map(id => ({ id }))
          }
        },
        include: { participants: true }
      });

      return res.status(201).json(tournament);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      return res.status(500).json({ error: 'Erro ao criar torneio' });
    }
  },

  async getAll(req: any, res: any) {
    try {
      const tournaments = await prisma.tournament.findMany({
        include: {
          _count: { select: { participants: true, rounds: true } }
        }
      });
      return res.json(tournaments);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar torneios' });
    }
  },

  async getById(req: any, res: any) {
    try {
      const { id } = req.params;
      const tournament = await prisma.tournament.findUnique({
        where: { id },
        include: { 
          participants: { include: { user: { select: { name: true } } } },
          rounds: { include: { matches: { include: { white: { include: { user: true } }, black: { include: { user: true } } } } } }
        }
      });

      if (!tournament) return res.status(404).json({ error: 'Torneio não encontrado' });
      return res.json(tournament);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar torneio' });
    }
  },

  async generateRound(req: any, res: any) {
    try {
      const { id } = req.params;
      const round = await TournamentService.generateNextRound(id);
      return res.json(round);
    } catch (error: any) {
      return res.status(400).json({ error: error.message || 'Erro ao gerar rodada' });
    }
  },

  async updateMatchResult(req: any, res: any) {
    try {
      const { matchId } = req.params;
      const { result } = req.body; // 'WHITE_WIN', 'BLACK_WIN', 'DRAW'

      if (!['WHITE_WIN', 'BLACK_WIN', 'DRAW'].includes(result)) {
        return res.status(400).json({ error: 'Resultado inválido' });
      }

      const match = await prisma.match.update({
        where: { id: matchId },
        data: { result }
      });

      return res.json(match);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao atualizar resultado' });
    }
  }
};
