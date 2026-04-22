import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { Plus, Users, Calendar, Trophy } from 'lucide-react';
import api from '@/services/api';

interface Tournament {
  id: string;
  title: string;
  description?: string;
  status: string;
  startDate: string;
  _count?: {
    participants: number;
    rounds: number;
  };
}

interface Student {
  id: string;
  user: {
    name: string;
  };
  school: {
    name: string;
  };
}

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const navigate = useNavigate();

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Form States
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);

  useEffect(() => {
    api.get('/tournaments')
      .then(response => setTournaments(response.data))
      .catch(error => console.error('Erro ao buscar torneios', error));
      
    api.get('/students')
      .then(response => setStudents(response.data))
      .catch(error => console.error('Erro ao buscar alunos', error));
  }, []);

  const fetchTournaments = () => {
    api.get('/tournaments')
      .then(response => setTournaments(response.data))
      .catch(error => console.error('Erro ao buscar torneios', error));
  };

  const toggleParticipant = (id: string) => {
    setSelectedParticipants(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleCreateTournament = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!title || !startDate) {
      setError('Título e Data de Início são obrigatórios.');
      setIsLoading(false);
      return;
    }

    if (selectedParticipants.length < 2) {
      setError('Selecione pelo menos 2 participantes para o torneio.');
      setIsLoading(false);
      return;
    }

    try {
      await api.post('/tournaments', {
        title,
        description,
        startDate: new Date(startDate).toISOString(),
        participantIds: selectedParticipants
      });
      fetchTournaments();
      setIsModalOpen(false);
      // Reset form
      setTitle(''); setDescription(''); setStartDate(''); setSelectedParticipants([]);
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errorResponse = err as any;
      setError(errorResponse.response?.data?.error || 'Erro ao criar torneio.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Torneios</h1>
          <p className="text-muted-foreground text-sm">Organize e gerencie os campeonatos de xadrez.</p>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto h-12 sm:h-10">
              <Plus className="h-4 w-4 mr-2" />
              Novo Torneio
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] w-[95vw] rounded-xl max-h-[90vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>Criar Novo Torneio</DialogTitle>
              <DialogDescription>
                Defina as regras básicas e adicione os participantes que irão competir.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleCreateTournament} className="space-y-4 py-4 flex-1 overflow-y-auto pr-2">
              {error && <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>}
              
              <div className="space-y-2">
                <Label htmlFor="title">Título do Torneio *</Label>
                <Input 
                  id="title" 
                  placeholder="Ex: Torneio de Inverno 2026" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  className="h-12" 
                  disabled={isLoading} 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate">Data de Início *</Label>
                <Input 
                  id="startDate" 
                  type="datetime-local" 
                  value={startDate} 
                  onChange={(e) => setStartDate(e.target.value)} 
                  className="h-12" 
                  disabled={isLoading} 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição (Opcional)</Label>
                <Input 
                  id="description" 
                  placeholder="Regras adicionais ou prêmios" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  className="h-12" 
                  disabled={isLoading} 
                />
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center">
                  <Label>Participantes ({selectedParticipants.length} selecionados)</Label>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs h-8"
                    onClick={() => setSelectedParticipants(students.map(s => s.id))}
                  >
                    Selecionar Todos
                  </Button>
                </div>
                
                <div className="border rounded-md max-h-48 overflow-y-auto p-2 space-y-1 bg-slate-50">
                  {students.length === 0 ? (
                    <p className="text-sm text-center py-4 text-slate-500">Nenhum aluno cadastrado no sistema.</p>
                  ) : (
                    students.map(student => (
                      <label 
                        key={student.id} 
                        className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors ${
                          selectedParticipants.includes(student.id) ? 'bg-primary/10 border-primary/20 border' : 'hover:bg-slate-100 border border-transparent'
                        }`}
                      >
                        <input 
                          type="checkbox" 
                          className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                          checked={selectedParticipants.includes(student.id)}
                          onChange={() => toggleParticipant(student.id)}
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-medium leading-none">{student.user.name}</span>
                          <span className="text-xs text-slate-500 mt-1">{student.school.name}</span>
                        </div>
                      </label>
                    ))
                  )}
                </div>
              </div>

              <DialogFooter className="pt-6">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="w-full sm:w-auto h-12 sm:h-10 mb-2 sm:mb-0">
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading || students.length < 2} className="w-full sm:w-auto h-12 sm:h-10">
                  {isLoading ? 'Criando...' : 'Iniciar Torneio'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {tournaments.map((t) => (
          <Card key={t.id} className="cursor-pointer hover:shadow-md transition-all border-l-4 border-l-primary group" onClick={() => navigate(`/dashboard/tournaments/${t.id}`)}>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-start gap-2">
                <Trophy className="h-5 w-5 text-amber-500 shrink-0 mt-1" />
                <span className="line-clamp-2 leading-tight group-hover:text-primary transition-colors">{t.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground mb-4">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 shrink-0" />
                  {new Date(t.startDate).toLocaleDateString('pt-BR')} às {new Date(t.startDate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 shrink-0" />
                  {t._count?.participants || 0} Participantes
                </div>
              </div>
              <div className="pt-4 border-t flex justify-between items-center">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                  t.status === 'PLANNED' ? 'bg-slate-100 text-slate-700' :
                  t.status === 'ONGOING' ? 'bg-blue-100 text-blue-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {t.status === 'PLANNED' ? 'Planejado' : t.status === 'ONGOING' ? 'Em Andamento' : 'Finalizado'}
                </span>
                <Button variant="ghost" size="sm" className="h-8">
                  Ver Torneio
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {tournaments.length === 0 && (
          <div className="col-span-full py-16 flex flex-col items-center justify-center text-center border-2 border-dashed rounded-xl bg-slate-50/50">
            <Trophy className="h-12 w-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-semibold text-slate-700">Nenhum torneio ativo</h3>
            <p className="text-slate-500 max-w-sm mt-1 mb-6">
              O motor de torneios do sistema Suíço está pronto. Crie seu primeiro torneio e adicione os alunos para começar!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
