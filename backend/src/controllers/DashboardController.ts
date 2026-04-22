import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const DashboardController = {
  async getStats(req: any, res: any) {
    try {
      const user = req.user;

      // Se for admin, conta tudo. Se for professor, conta apenas o relacionado a ele.
      const isTeacher = user.role !== 'ADMIN';

      // 1. Total de Escolas
      const totalSchools = await prisma.school.count({
        where: isTeacher ? { teacherId: user.id } : undefined
      });

      // 2. Total de Alunos
      const totalStudents = await prisma.student.count({
        where: isTeacher ? { school: { teacherId: user.id } } : undefined
      });

      // 3. Total de Torneios
      const totalTournaments = await prisma.tournament.count();
      const activeTournaments = await prisma.tournament.count({
        where: { status: 'ONGOING' }
      });

      // 4. Últimos Torneios para a tabela
      const recentTournaments = await prisma.tournament.findMany({
        take: 5,
        orderBy: { startDate: 'desc' },
        include: {
          _count: { select: { participants: true } }
        }
      });

      // 5. Gráfico de Participantes por Escola
      const schoolsForChart = await prisma.school.findMany({
        where: isTeacher ? { teacherId: user.id } : undefined,
        include: {
          _count: { select: { students: true } }
        },
        take: 5
      });

      const schoolStats = schoolsForChart.map(s => ({
        name: s.name,
        students: s._count.students
      }));

      // Fake data para crescimento mensal se não tiver histórico longo (para MVP)
      const monthlyGrowth = [
        { name: 'Jan', alunos: Math.floor(totalStudents * 0.2) },
        { name: 'Fev', alunos: Math.floor(totalStudents * 0.5) },
        { name: 'Mar', alunos: Math.floor(totalStudents * 0.8) },
        { name: 'Abr', alunos: totalStudents },
      ];

      return res.json({
        kpis: {
          totalSchools,
          totalStudents,
          totalTournaments,
          activeTournaments
        },
        recentTournaments,
        charts: {
          schoolStats,
          monthlyGrowth
        }
      });

    } catch (error) {
      console.error('Erro ao buscar estatísticas do dashboard:', error);
      return res.status(500).json({ error: 'Erro ao buscar estatísticas do dashboard' });
    }
  }
};
