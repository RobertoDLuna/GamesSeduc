import { PrismaClient, Student, Match } from '@prisma/client';

const prisma = new PrismaClient();

export class TournamentService {
  /**
   * Calcula o score atual de um estudante num torneio específico
   */
  static async getStudentScore(studentId: string, tournamentId: string): Promise<number> {
    const matchesAsWhite = await prisma.match.findMany({
      where: { whiteId: studentId, round: { tournamentId } }
    });
    const matchesAsBlack = await prisma.match.findMany({
      where: { blackId: studentId, round: { tournamentId } }
    });

    let score = 0;
    
    matchesAsWhite.forEach(m => {
      if (m.result === 'WHITE_WIN') score += 1;
      if (m.result === 'DRAW') score += 0.5;
    });

    matchesAsBlack.forEach(m => {
      if (m.result === 'BLACK_WIN') score += 1;
      if (m.result === 'DRAW') score += 0.5;
    });

    return score;
  }

  /**
   * Gera emparceiramentos (pairings) para uma nova rodada
   * Implementação simplificada baseada no Sistema Suíço
   */
  static async generateNextRound(tournamentId: string): Promise<any> {
    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
      include: { participants: true, rounds: { include: { matches: true } } }
    });

    if (!tournament) throw new Error('Torneio não encontrado');
    if (tournament.participants.length < 2) throw new Error('Participantes insuficientes');

    const nextRoundNumber = tournament.rounds.length + 1;

    // Calcular os scores atuais de todos os participantes
    const participantsWithScores = await Promise.all(
      tournament.participants.map(async (student) => {
        const score = await this.getStudentScore(student.id, tournamentId);
        return { ...student, score };
      })
    );

    // Ordenar participantes por score (maior para menor), e desempatar por rating
    participantsWithScores.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return b.rating - a.rating;
    });

    // Criar a nova rodada
    const newRound = await prisma.round.create({
      data: {
        number: nextRoundNumber,
        tournamentId
      }
    });

    const matchesToCreate = [];
    const pairedIds = new Set<string>();

    // Emparceiramento simplificado (Swiss Like)
    for (let i = 0; i < participantsWithScores.length; i++) {
      const p1 = participantsWithScores[i];
      if (pairedIds.has(p1.id)) continue;

      // Procurar o oponente mais próximo no ranking que ainda não jogou e que preferencialmente não tenha jogado contra ele (ainda não validado)
      let opponentIndex = i + 1;
      while (opponentIndex < participantsWithScores.length && pairedIds.has(participantsWithScores[opponentIndex].id)) {
        opponentIndex++;
      }

      if (opponentIndex < participantsWithScores.length) {
        const p2 = participantsWithScores[opponentIndex];
        
        // Alternar cor básica: Quem tem rating maior vai de brancas (simplificação)
        const [white, black] = p1.rating >= p2.rating ? [p1, p2] : [p2, p1];

        matchesToCreate.push({
          roundId: newRound.id,
          whiteId: white.id,
          blackId: black.id,
          result: null
        });

        pairedIds.add(p1.id);
        pairedIds.add(p2.id);
      } else {
        // Bye (jogador fica sem par e ganha ponto na rodada) - não implementado na simplificação atual
        // Para simplificar, ignoramos bye.
      }
    }

    if (matchesToCreate.length > 0) {
      await prisma.match.createMany({ data: matchesToCreate });
    }

    // Atualizar status do torneio
    if (tournament.status === 'PLANNED') {
      await prisma.tournament.update({
        where: { id: tournamentId },
        data: { status: 'ONGOING' }
      });
    }

    return prisma.round.findUnique({
      where: { id: newRound.id },
      include: { matches: { include: { white: true, black: true } } }
    });
  }
}
