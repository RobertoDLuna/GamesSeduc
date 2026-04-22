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
import { Plus, School as SchoolIcon, MapPin } from 'lucide-react';
import api from '@/services/api';

interface School {
  id: string;
  name: string;
  city: string;
  address?: string;
  _count?: {
    students: number;
  };
}

export default function SchoolsPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = () => {
    api.get('/schools')
      .then(response => setSchools(response.data))
      .catch(error => console.error('Erro ao buscar escolas', error));
  };

  const handleCreateSchool = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!name || !city) {
      setError('Nome e Cidade são obrigatórios.');
      setIsLoading(false);
      return;
    }

    try {
      await api.post('/schools', { name, city, address });
      fetchSchools();
      setIsModalOpen(false);
      // Reset form
      setName('');
      setCity('');
      setAddress('');
    } catch (err: any) {
      setError(err.response?.data?.error?.[0]?.message || 'Erro ao criar escola.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Escolas</h1>
          <p className="text-muted-foreground text-sm">Gerencie os locais onde os torneios e alunos estão vinculados.</p>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto h-12 sm:h-10">
              <Plus className="h-5 w-5 sm:h-4 sm:w-4 mr-2" />
              Adicionar Escola
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] w-[95vw] rounded-xl">
            <DialogHeader>
              <DialogTitle>Nova Escola</DialogTitle>
              <DialogDescription>
                Cadastre uma nova escola para organizar seus alunos e torneios.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateSchool} className="space-y-4 py-4">
              {error && <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>}
              
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Escola *</Label>
                <Input
                  id="name"
                  placeholder="Ex: Escola Estadual Machado de Assis"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">Cidade *</Label>
                <Input
                  id="city"
                  placeholder="Ex: São Paulo"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="h-12"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Endereço (Opcional)</Label>
                <Input
                  id="address"
                  placeholder="Ex: Rua das Flores, 123"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="h-12"
                  disabled={isLoading}
                />
              </div>

              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="w-full sm:w-auto h-12 sm:h-10 mb-2 sm:mb-0">
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading} className="w-full sm:w-auto h-12 sm:h-10">
                  {isLoading ? 'Salvando...' : 'Salvar Escola'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {schools.map((school) => (
          <Card key={school.id} className="hover:shadow-md transition-all border-l-4 border-l-primary">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-start gap-2">
                <SchoolIcon className="h-5 w-5 text-muted-foreground shrink-0 mt-1" />
                <span className="line-clamp-2 leading-tight">{school.name}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-muted-foreground mb-4">
                <MapPin className="h-4 w-4 mr-1 shrink-0" />
                <span className="truncate">{school.city} {school.address ? `- ${school.address}` : ''}</span>
              </div>
              <div className="pt-4 border-t flex justify-between items-center">
                <div className="bg-slate-100 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-700">
                  {school._count?.students || 0} Alunos
                </div>
                <Button variant="ghost" size="sm" className="text-primary h-8">
                  Ver Detalhes
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {schools.length === 0 && (
          <div className="col-span-full py-16 flex flex-col items-center justify-center text-center border-2 border-dashed rounded-xl bg-slate-50/50">
            <SchoolIcon className="h-12 w-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-semibold text-slate-700">Nenhuma escola cadastrada</h3>
            <p className="text-slate-500 max-w-sm mt-1">
              Comece adicionando uma escola para poder vincular seus alunos a ela.
            </p>
            <Button variant="outline" className="mt-6" onClick={() => setIsModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Primeira Escola
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
