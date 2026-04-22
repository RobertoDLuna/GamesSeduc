import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Users, Upload, School as SchoolIcon } from 'lucide-react';
import api from '@/services/api';

interface Student {
  id: string;
  user: {
    name: string;
    email: string;
  };
  school: {
    name: string;
  };
  grade?: string;
  rating: number;
}

interface School {
  id: string;
  name: string;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Add form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [schoolId, setSchoolId] = useState('');
  const [grade, setGrade] = useState('');

  // CSV form states
  const [file, setFile] = useState<File | null>(null);
  const [csvSchoolId, setCsvSchoolId] = useState('');

  useEffect(() => {
    api.get('/students')
      .then(response => setStudents(response.data))
      .catch(error => console.error('Erro ao buscar alunos', error));
      
    api.get('/schools')
      .then(response => setSchools(response.data))
      .catch(error => console.error('Erro ao buscar escolas', error));
  }, []);

  const fetchStudents = () => {
    api.get('/students')
      .then(response => setStudents(response.data))
      .catch(error => console.error('Erro ao buscar alunos', error));
  };



  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!name || !email || !password || !schoolId) {
      setError('Nome, Email, Senha e Escola são obrigatórios.');
      setIsLoading(false);
      return;
    }

    try {
      await api.post('/students', { name, email, password, schoolId, grade });
      fetchStudents();
      setIsAddModalOpen(false);
      // Reset form
      setName(''); setEmail(''); setPassword(''); setSchoolId(''); setGrade('');
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errorResponse = err as any;
      setError(errorResponse.response?.data?.error || 'Erro ao criar aluno.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportCSV = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (!file || !csvSchoolId) {
      setError('Arquivo CSV e Escola são obrigatórios.');
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('schoolId', csvSchoolId);

    try {
      const response = await api.post('/students/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setSuccess(response.data.message);
      fetchStudents();
      setFile(null);
      // setTimeout(() => setIsCsvModalOpen(false), 3000);
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errorResponse = err as any;
      setError(errorResponse.response?.data?.error || 'Erro ao importar CSV.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alunos</h1>
          <p className="text-muted-foreground text-sm">Gerencie os estudantes e importe listas em lote.</p>
        </div>

        <div className="flex w-full sm:w-auto gap-2">
          {/* Modal Adicionar Aluno (Individual) */}
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex-1 sm:flex-none h-12 sm:h-10">
                <Plus className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Adicionar</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] w-[95vw] rounded-xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Novo Aluno</DialogTitle>
                <DialogDescription>Cadastre um aluno individualmente.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateStudent} className="space-y-4 py-4">
                {error && <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>}
                
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo *</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="h-12" disabled={isLoading} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-mail *</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-12" disabled={isLoading} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Senha de Acesso *</Label>
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-12" disabled={isLoading} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="school">Escola *</Label>
                  <select 
                    id="school"
                    className="flex h-12 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    value={schoolId}
                    onChange={(e) => setSchoolId(e.target.value)}
                    disabled={isLoading}
                  >
                    <option value="" disabled>Selecione uma escola</option>
                    {schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>

                <DialogFooter className="pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)} className="w-full sm:w-auto h-12 sm:h-10 mb-2 sm:mb-0">Cancelar</Button>
                  <Button type="submit" disabled={isLoading} className="w-full sm:w-auto h-12 sm:h-10">{isLoading ? 'Salvando...' : 'Salvar'}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Modal Importar CSV */}
          <Dialog open={isCsvModalOpen} onOpenChange={setIsCsvModalOpen}>
            <DialogTrigger asChild>
              <Button className="flex-2 sm:flex-none h-12 sm:h-10">
                <Upload className="h-4 w-4 mr-2" />
                Importar CSV
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] w-[95vw] rounded-xl">
              <DialogHeader>
                <DialogTitle>Importar via CSV</DialogTitle>
                <DialogDescription>
                  Faça o upload de uma planilha contendo os alunos. As colunas obrigatórias são: <strong className="text-slate-700">name, email, password</strong>.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleImportCSV} className="space-y-4 py-4">
                {error && <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>}
                {success && <div className="p-3 bg-green-100 text-green-700 rounded-md text-sm">{success}</div>}

                <div className="space-y-2">
                  <Label htmlFor="csvSchool">Vincular à Escola *</Label>
                  <select 
                    id="csvSchool"
                    className="flex h-12 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    value={csvSchoolId}
                    onChange={(e) => setCsvSchoolId(e.target.value)}
                    disabled={isLoading}
                  >
                    <option value="" disabled>Selecione a escola de destino</option>
                    {schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file">Arquivo CSV *</Label>
                  <Input 
                    id="file" 
                    type="file" 
                    accept=".csv"
                    onChange={(e) => setFile(e.target.files?.[0] || null)} 
                    className="h-12 pt-3 cursor-pointer" 
                    disabled={isLoading} 
                  />
                </div>

                <DialogFooter className="pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsCsvModalOpen(false)} className="w-full sm:w-auto h-12 sm:h-10 mb-2 sm:mb-0">Fechar</Button>
                  <Button type="submit" disabled={isLoading || !file || !csvSchoolId} className="w-full sm:w-auto h-12 sm:h-10">
                    {isLoading ? 'Enviando...' : 'Processar Arquivo'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {students.map((student) => (
          <Card key={student.id} className="hover:shadow-md transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground shrink-0" />
                <span className="truncate">{student.user?.name}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground mb-4">
                <span className="truncate">{student.user?.email}</span>
                <span className="flex items-center truncate text-slate-700 bg-slate-100 p-1.5 rounded-md w-fit">
                  <SchoolIcon className="h-3 w-3 mr-1 shrink-0" />
                  {student.school?.name}
                </span>
              </div>
              <div className="pt-4 border-t flex justify-between items-center text-sm">
                <span className="font-mono bg-amber-100 text-amber-800 px-2 py-0.5 rounded-sm font-semibold">
                  Rating: {student.rating}
                </span>
                <Button variant="ghost" size="sm" className="h-8">
                  Ver Perfil
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {students.length === 0 && (
          <div className="col-span-full py-16 flex flex-col items-center justify-center text-center border-2 border-dashed rounded-xl bg-slate-50/50">
            <Users className="h-12 w-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-semibold text-slate-700">Nenhum aluno cadastrado</h3>
            <p className="text-slate-500 max-w-sm mt-1 mb-6">
              Adicione os alunos manualmente ou importe uma lista no formato CSV para popular o sistema.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
