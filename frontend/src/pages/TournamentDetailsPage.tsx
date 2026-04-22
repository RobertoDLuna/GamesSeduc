import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Trophy } from 'lucide-react';
import api from '../services/api';

export default function TournamentDetailsPage() {
  const { id } = useParams();
  const [tournament, setTournament] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTournamentDetails();
  }, [id]);

  const fetchTournamentDetails = async () => {
    try {
      const response = await api.get(`/tournaments/${id}`);
      setTournament(response.data);
    } catch (error) {
      console.error('Erro ao buscar detalhes do torneio', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateRound = async () => {
    try {
      setLoading(true);
      await api.post(`/tournaments/${id}/rounds/generate`);
      await fetchTournamentDetails();
    } catch (error) {
      console.error('Erro ao gerar rodada', error);
      alert('Erro ao gerar rodada. Verifique os participantes.');
      setLoading(false);
    }
  };

  const updateMatchResult = async (matchId: string, result: string) => {
    try {
      await api.patch(`/tournaments/matches/${matchId}/result`, { result });
      await fetchTournamentDetails();
    } catch (error) {
      console.error('Erro ao atualizar resultado', error);
    }
  };

  if (loading && !tournament) return <div>Carregando...</div>;
  if (!tournament) return <div>Torneio não encontrado.</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{tournament.title}</h1>
          <p className="text-muted-foreground">{tournament.description}</p>
        </div>
        <div className="flex gap-2">
          {tournament.status !== 'FINISHED' && (
            <Button onClick={handleGenerateRound} disabled={loading}>
              <Play className="h-4 w-4 mr-2" />
              Gerar Próxima Rodada
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {tournament.rounds?.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <Trophy className="h-12 w-12 mb-4 text-slate-300" />
                <p>Nenhuma rodada gerada ainda.</p>
                <p className="text-sm">Adicione participantes e clique em "Gerar Próxima Rodada".</p>
              </CardContent>
            </Card>
          ) : (
            tournament.rounds.map((round: any) => (
              <Card key={round.id}>
                <CardHeader className="bg-slate-50 border-b">
                  <CardTitle className="text-lg">Rodada {round.number}</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {round.matches.map((match: any) => (
                      <div key={match.id} className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center justify-between w-full md:w-auto gap-8">
                          <div className={`font-medium ${match.result === 'WHITE_WIN' ? 'text-green-600' : ''}`}>
                            <span className="inline-block w-3 h-3 bg-white border border-slate-300 rounded-full mr-2"></span>
                            {match.white?.user?.name || 'Bye'}
                          </div>
                          <span className="text-slate-400 font-bold text-sm">VS</span>
                          <div className={`font-medium ${match.result === 'BLACK_WIN' ? 'text-green-600' : ''}`}>
                            <span className="inline-block w-3 h-3 bg-black rounded-full mr-2"></span>
                            {match.black?.user?.name || 'Bye'}
                          </div>
                        </div>
                        
                        <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
                          <Button 
                            size="sm" 
                            variant={match.result === 'WHITE_WIN' ? 'default' : 'outline'}
                            onClick={() => updateMatchResult(match.id, 'WHITE_WIN')}
                          >
                            1-0
                          </Button>
                          <Button 
                            size="sm" 
                            variant={match.result === 'DRAW' ? 'default' : 'outline'}
                            onClick={() => updateMatchResult(match.id, 'DRAW')}
                          >
                            ½-½
                          </Button>
                          <Button 
                            size="sm" 
                            variant={match.result === 'BLACK_WIN' ? 'default' : 'outline'}
                            onClick={() => updateMatchResult(match.id, 'BLACK_WIN')}
                          >
                            0-1
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Participantes ({tournament.participants?.length || 0})</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {tournament.participants?.map((p: any) => (
                  <li key={p.id} className="flex justify-between items-center text-sm p-2 bg-slate-50 rounded">
                    <span>{p.user?.name}</span>
                    <span className="text-muted-foreground font-mono">{p.rating}</span>
                  </li>
                ))}
                {(!tournament.participants || tournament.participants.length === 0) && (
                  <li className="text-sm text-muted-foreground text-center py-4">Nenhum participante.</li>
                )}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
