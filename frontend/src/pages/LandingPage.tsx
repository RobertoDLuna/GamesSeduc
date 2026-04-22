import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Trophy, 
  Users, 
  School, 
  ChevronRight, 
  BarChart3, 
  ShieldCheck, 
  Zap,
  Globe,
  Send,
  Camera
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white selection:bg-primary/10">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">Jogos Seduc</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#funcionalidades" className="hover:text-primary transition-colors">Funcionalidades</a>
            <a href="#escolas" className="hover:text-primary transition-colors">Para Escolas</a>
            <a href="#alunos" className="hover:text-primary transition-colors">Para Alunos</a>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/login')} className="hidden sm:inline-flex">
              Entrar
            </Button>
            <Button size="sm" onClick={() => navigate('/login')} className="bg-primary hover:bg-primary/90">
              Começar Agora
            </Button>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-indigo-400/10 blur-[120px] rounded-full" />
          </div>

          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold mb-6 animate-in fade-in slide-in-from-bottom-3 duration-700">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
              Inovação no Xadrez Escolar
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 max-w-4xl mx-auto leading-[1.1]">
              Transforme a sua Escola com o <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Poder do Xadrez</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              A plataforma definitiva para gestão de torneios escolares. Automatize o sistema Suíço, gerencie alunos e acompanhe o crescimento intelectual dos seus estudantes em tempo real.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" onClick={() => navigate('/login')} className="h-14 px-8 text-lg w-full sm:w-auto rounded-xl shadow-xl shadow-blue-500/20 hover:scale-105 transition-transform">
                Criar conta gratuita
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg w-full sm:w-auto rounded-xl border-slate-200">
                Ver demonstração
              </Button>
            </div>

            {/* Dashboard Preview */}
            <div className="mt-16 lg:mt-24 relative max-w-5xl mx-auto animate-in fade-in zoom-in duration-1000">
              <div className="rounded-2xl border bg-slate-50 p-2 shadow-2xl">
                <div className="bg-white rounded-xl border shadow-sm overflow-hidden aspect-[16/9] flex items-center justify-center">
                  <div className="text-slate-400 flex flex-col items-center gap-4">
                    <Trophy className="h-16 w-16 opacity-20" />
                    <span className="font-medium text-sm">Dashboard de Gestão de Torneios</span>
                  </div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 h-24 w-24 bg-amber-400/20 blur-2xl rounded-full" />
              <div className="absolute -bottom-10 -left-10 h-32 w-32 bg-blue-400/20 blur-3xl rounded-full" />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="funcionalidades" className="py-24 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Tudo o que sua escola precisa</h2>
              <p className="text-slate-600 text-lg">Desenvolvemos ferramentas robustas para professores e empolgantes para os alunos.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Zap className="h-6 w-6 text-blue-600" />,
                  title: "Motor Suíço Automático",
                  desc: "Emparceiramentos complexos resolvidos em um clique. Justo, rápido e sem erros manuais."
                },
                {
                  icon: <BarChart3 className="h-6 w-6 text-indigo-600" />,
                  title: "Analytics de Evolução",
                  desc: "Acompanhe o Rating Glicko-2 dos alunos e veja o progresso técnico ao longo do ano letivo."
                },
                {
                  icon: <ShieldCheck className="h-6 w-6 text-emerald-600" />,
                  title: "Ambiente Controlado",
                  desc: "Segurança total dos dados. Gestão multi-tenant onde cada professor cuida apenas de sua turma."
                },
                {
                  icon: <Users className="h-6 w-6 text-rose-600" />,
                  title: "Gestão em Lote",
                  desc: "Importe centenas de alunos via CSV em segundos. Organize turmas e escolas sem esforço."
                },
                {
                  icon: <School className="h-6 w-6 text-amber-600" />,
                  title: "Relatórios SEDUC",
                  desc: "Gere relatórios prontos para envio à secretaria de educação com um clique."
                },
                {
                  icon: <Trophy className="h-6 w-6 text-purple-600" />,
                  title: "Gamificação Real",
                  desc: "Rankings, conquistas e badges que motivam o aluno a estudar mais e jogar melhor."
                }
              ].map((item, i) => (
                <div key={i} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center mb-6">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Social Proof / Stats */}
        <section className="py-20 border-y">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-1">50+</div>
                <div className="text-slate-500 text-sm font-medium">Escolas Parceiras</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-1">10k+</div>
                <div className="text-slate-500 text-sm font-medium">Partidas Jogadas</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-1">2.5k+</div>
                <div className="text-slate-500 text-sm font-medium">Alunos Ativos</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-1">100%</div>
                <div className="text-slate-500 text-sm font-medium">Nuvem SEDUC</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="bg-blue-600 rounded-[2rem] p-8 md:p-16 text-center text-white relative overflow-hidden shadow-2xl shadow-blue-600/20">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
              
              <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">Pronto para elevar o nível do xadrez na sua escola?</h2>
                <p className="text-blue-100 text-lg mb-10 opacity-90">Junte-se a centenas de professores que já usam o Jogos Seduc para organizar campeonatos incríveis.</p>
                <Button size="lg" variant="secondary" onClick={() => navigate('/login')} className="h-14 px-10 text-lg rounded-xl text-blue-600 font-bold hover:scale-105 transition-transform">
                  Começar gratuitamente
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <Trophy className="h-6 w-6 text-blue-500" />
                <span className="text-xl font-bold text-white tracking-tight">Jogos Seduc</span>
              </div>
              <p className="text-sm leading-relaxed mb-6">
                A ferramenta oficial para fomento do esporte intelectual nas escolas públicas e privadas.
              </p>
              <div className="flex items-center gap-4">
                <a href="#" className="hover:text-white transition-colors"><Send className="h-5 w-5" /></a>
                <a href="#" className="hover:text-white transition-colors"><Camera className="h-5 w-5" /></a>
                <a href="#" className="hover:text-white transition-colors"><Globe className="h-5 w-5" /></a>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6">Plataforma</h4>
              <ul className="space-y-4 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Funcionalidades</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Segurança</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Dashboard</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Suporte</h4>
              <ul className="space-y-4 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Documentação</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Legal</h4>
              <ul className="space-y-4 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacidade</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-white transition-colors">LGPD</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-800 text-xs flex flex-col md:flex-row justify-between items-center gap-4">
            <p>© 2026 Jogos Seduc. Desenvolvido para a Secretaria de Educação.</p>
            <div className="flex items-center gap-6">
              <span>Made with ❤️ for education</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
