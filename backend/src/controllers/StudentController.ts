import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import csv from 'csv-parser';

const prisma = new PrismaClient();

const createStudentSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  schoolId: z.string().uuid(),
  birthDate: z.string().optional(),
  grade: z.string().optional(),
});

export const StudentController = {
  async create(req: any, res: any) {
    try {
      const data = createStudentSchema.parse(req.body);
      const user = req.user;

      // Validação Multi-tenant
      const school = await prisma.school.findUnique({ where: { id: data.schoolId } });
      if (!school) {
        return res.status(404).json({ error: 'Escola não encontrada' });
      }

      if (user.role !== 'ADMIN' && school.teacherId !== user.id) {
        return res.status(403).json({ error: 'Você não tem permissão para adicionar alunos a esta escola' });
      }

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
      if (existingUser) {
        return res.status(400).json({ error: 'E-mail já está em uso' });
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);

      // Create User and Student in a transaction
      const result = await prisma.$transaction(async (tx) => {
        const newUser = await tx.user.create({
          data: {
            name: data.name,
            email: data.email,
            password: hashedPassword,
            role: 'STUDENT',
            company_id: user.company_id, // mantendo compatibilidade
          },
        });

        const newStudent = await tx.student.create({
          data: {
            userId: newUser.id,
            schoolId: data.schoolId,
            birthDate: data.birthDate ? new Date(data.birthDate) : null,
            grade: data.grade,
          },
        });

        return { user: newUser, student: newStudent };
      });

      return res.status(201).json(result);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      return res.status(500).json({ error: 'Erro ao criar aluno' });
    }
  },

  async getAll(req: any, res: any) {
    try {
      const user = req.user;
      
      let students;
      
      if (user.role === 'ADMIN') {
        students = await prisma.student.findMany({
          include: {
            user: { select: { name: true, email: true } },
            school: { select: { name: true } }
          }
        });
      } else {
        // Professores só veem alunos de suas próprias escolas
        const schools = await prisma.school.findMany({ where: { teacherId: user.id }, select: { id: true } });
        const schoolIds = schools.map(s => s.id);
        
        students = await prisma.student.findMany({
          where: { schoolId: { in: schoolIds } },
          include: {
            user: { select: { name: true, email: true } },
            school: { select: { name: true } }
          }
        });
      }

      return res.json(students);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar alunos' });
    }
  },

  async importCSV(req: any, res: any) {
    try {
      const file = req.file;
      const { schoolId } = req.body;
      const user = req.user;

      if (!file) {
        return res.status(400).json({ error: 'Arquivo não fornecido' });
      }

      if (!schoolId) {
        return res.status(400).json({ error: 'School ID é obrigatório' });
      }

      const school = await prisma.school.findUnique({ where: { id: schoolId } });
      if (!school) {
        return res.status(404).json({ error: 'Escola não encontrada' });
      }

      if (user.role !== 'ADMIN' && school.teacherId !== user.id) {
        return res.status(403).json({ error: 'Acesso negado' });
      }

      const results: any[] = [];
      const errors: any[] = [];

      fs.createReadStream(file.path)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
          let successCount = 0;

          for (const row of results) {
            try {
              // Basic validation for CSV row
              if (!row.name || !row.email || !row.password) {
                errors.push({ row, error: 'Campos obrigatórios (name, email, password) faltando' });
                continue;
              }

              const existingUser = await prisma.user.findUnique({ where: { email: row.email } });
              if (existingUser) {
                errors.push({ row, error: 'E-mail já existente' });
                continue;
              }

              const hashedPassword = await bcrypt.hash(row.password, 10);

              await prisma.$transaction(async (tx) => {
                const newUser = await tx.user.create({
                  data: {
                    name: row.name,
                    email: row.email,
                    password: hashedPassword,
                    role: 'STUDENT',
                  },
                });

                await tx.student.create({
                  data: {
                    userId: newUser.id,
                    schoolId: schoolId,
                    birthDate: row.birthDate ? new Date(row.birthDate) : null,
                    grade: row.grade || null,
                  },
                });
              });

              successCount++;
            } catch (err) {
              errors.push({ row, error: 'Erro ao processar linha' });
            }
          }

          // Limpa o arquivo temporário
          fs.unlinkSync(file.path);

          return res.json({
            message: `Processamento concluído. Sucessos: ${successCount}. Falhas: ${errors.length}`,
            errors: errors.length > 0 ? errors : undefined
          });
        });

    } catch (error) {
      return res.status(500).json({ error: 'Erro interno ao processar CSV' });
    }
  }
};
