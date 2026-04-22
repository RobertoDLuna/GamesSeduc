import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Schemas Zod para validação
const createSchoolSchema = z.object({
  name: z.string().min(3),
  address: z.string().optional(),
  city: z.string().min(2),
  teacherId: z.string().uuid().optional(), // ADMIN pode passar teacherId, TEACHER não precisa
});

const updateSchoolSchema = createSchoolSchema.partial();

export const SchoolController = {
  async create(req: any, res: any) {
    try {
      const data = createSchoolSchema.parse(req.body);
      const user = req.user; // Veio do middleware auth

      // Regra Multi-tenant: Se for TEACHER, a escola é dele. Se for ADMIN, ele pode atribuir a outro.
      const teacherId = user.role === 'ADMIN' && data.teacherId ? data.teacherId : user.id;

      const school = await prisma.school.create({
        data: {
          ...data,
          teacherId,
        },
      });

      return res.status(201).json(school);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      return res.status(500).json({ error: 'Erro interno ao criar escola' });
    }
  },

  async getAll(req: any, res: any) {
    try {
      const user = req.user;
      let schools;

      // Lei 03: Blindagem Multi-Tenant
      if (user.role === 'ADMIN') {
        schools = await prisma.school.findMany({ include: { teacher: { select: { name: true, email: true } } } });
      } else {
        schools = await prisma.school.findMany({
          where: { teacherId: user.id },
        });
      }

      return res.json(schools);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar escolas' });
    }
  },

  async getById(req: any, res: any) {
    try {
      const { id } = req.params;
      const user = req.user;

      const school = await prisma.school.findUnique({
        where: { id },
      });

      if (!school) {
        return res.status(404).json({ error: 'Escola não encontrada' });
      }

      // Lei 03: Validação de posse
      if (user.role !== 'ADMIN' && school.teacherId !== user.id) {
        return res.status(403).json({ error: 'Acesso negado' });
      }

      return res.json(school);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar escola' });
    }
  },

  async update(req: any, res: any) {
    try {
      const { id } = req.params;
      const user = req.user;
      const data = updateSchoolSchema.parse(req.body);

      const school = await prisma.school.findUnique({ where: { id } });

      if (!school) {
        return res.status(404).json({ error: 'Escola não encontrada' });
      }

      // Lei 03: Validação de posse
      if (user.role !== 'ADMIN' && school.teacherId !== user.id) {
        return res.status(403).json({ error: 'Acesso negado' });
      }

      const updatedSchool = await prisma.school.update({
        where: { id },
        data,
      });

      return res.json(updatedSchool);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      return res.status(500).json({ error: 'Erro ao atualizar escola' });
    }
  },

  async delete(req: any, res: any) {
    try {
      const { id } = req.params;
      const user = req.user;

      const school = await prisma.school.findUnique({ where: { id } });

      if (!school) {
        return res.status(404).json({ error: 'Escola não encontrada' });
      }

      // Lei 03: Validação de posse
      if (user.role !== 'ADMIN' && school.teacherId !== user.id) {
        return res.status(403).json({ error: 'Acesso negado' });
      }

      await prisma.school.delete({ where: { id } });

      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao excluir escola' });
    }
  }
};
