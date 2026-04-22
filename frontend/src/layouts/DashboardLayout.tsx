import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger
} from '@/components/ui/sidebar';
import { LayoutDashboard, School, Users, Trophy, LogOut } from 'lucide-react';
import { useAuth } from '../context/auth-context';
import { Separator } from '@/components/ui/separator';

export function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
    { title: 'Escolas', url: '/dashboard/schools', icon: School },
    { title: 'Alunos', url: '/dashboard/students', icon: Users },
    { title: 'Torneios', url: '/dashboard/tournaments', icon: Trophy },
  ];

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-4 flex items-center justify-center">
          <h2 className="text-xl font-bold text-primary">Jogos Seduc</h2>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={location.pathname === item.url}
                      onClick={() => navigate(item.url)}
                      className="cursor-pointer"
                    >
                      <a className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="p-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 px-2 py-1">
              <div className="flex flex-col">
                <span className="text-sm font-medium">{user?.name}</span>
                <span className="text-xs text-muted-foreground">{user?.role}</span>
              </div>
            </div>
            <Separator />
            <SidebarMenuButton onClick={handleLogout} className="text-destructive hover:text-destructive cursor-pointer">
              <LogOut className="h-4 w-4" />
              <span>Sair</span>
            </SidebarMenuButton>
          </div>
        </SidebarFooter>
      </Sidebar>

      <main className="flex-1 overflow-y-auto bg-slate-50 relative">
        <div className="md:hidden p-4 absolute top-0 left-0 z-10 bg-white/80 backdrop-blur-md w-full border-b flex items-center">
          <SidebarTrigger />
          <h1 className="ml-4 font-semibold">Jogos Seduc</h1>
        </div>
        <div className="p-6 md:p-8 mt-14 md:mt-0 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
}
