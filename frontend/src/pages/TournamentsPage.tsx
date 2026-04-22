import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import api from '../services/api';

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      const response = await api.get('/tournaments');
      setTournaments(response.data);
    } catch (error) {
      console.error('Erro ao buscar torneios', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Torneios</h1>
        <Button onClick={() => console.log('Novo torneio modal')}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Torneio
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tournaments.map((t: any) => (
          <Card key={t.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(`/dashboard/tournaments/${t.id}`)}>
            <CardHeader>
              <CardTitle>{t.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground mb-4">
                {t.description || 'Sem descrição'}
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${t.status === 'PLANNED' ? 'bg-yellow-100 text-yellow-800' : t.status === 'ONGOING' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                  {t.status === 'PLANNED' ? 'Planejado' : t.status === 'ONGOING' ? 'Em Andamento' : 'Finalizado'}
                </span>
                <span>{new Date(t.startDate).toLocaleDateString()}</span>
              </div>
              <div className="mt-4 pt-4 border-t flex justify-between text-sm text-muted-foreground">
                <span>Participantes: {t._count?.participants || 0}</span>
                <span>Rodadas: {t._count?.rounds || 0}</span>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {tournaments.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
            Nenhum torneio cadastrado. Clique em "Novo Torneio" para começar.
          </div>
        )}
      </div>
    </div>
  );
}
