import React from 'react';
import { useAuthStore } from '@/hooks/use-auth-store';
import { 
  LayoutDashboard, 
  Users, 
  CheckSquare, 
  ShoppingCart, 
  DollarSign, 
  LogOut,
  Settings,
  ShieldCheck,
  Package
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  active?: boolean;
}

const SidebarItem = ({ icon: Icon, label, href, active }: SidebarItemProps) => (
  <Link to={href}>
    <div className={cn(
      "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
      active 
        ? "bg-purple-100 text-purple-700" 
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    )}>
      <Icon className={cn("w-5 h-5", active ? "text-purple-700" : "text-slate-500 group-hover:text-slate-900")} />
      <span className="font-medium">{label}</span>
    </div>
  </Link>
);

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isMasterAdmin = user?.role === 'master_admin';

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 bg-white flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-100 flex items-center gap-2">
          <div className="bg-purple-600 p-2 rounded-lg text-white font-bold text-xl">M</div>
          <span className="text-xl font-bold text-slate-900">Mudali</span>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {isMasterAdmin ? (
            <>
              <SidebarItem 
                icon={LayoutDashboard} 
                label="Visão Geral" 
                href="/admin" 
                active={location.pathname === '/admin'} 
              />
              <SidebarItem 
                icon={Package} 
                label="Planos" 
                href="/admin/plans" 
                active={location.pathname === '/admin/plans'} 
              />
              <SidebarItem 
                icon={ShieldCheck} 
                label="Famílias (Tenants)" 
                href="/admin/tenants" 
                active={location.pathname === '/admin/tenants'} 
              />
            </>
          ) : (
            <>
              <SidebarItem 
                icon={LayoutDashboard} 
                label="Dashboard" 
                href="/dashboard" 
                active={location.pathname === '/dashboard'} 
              />
              <SidebarItem 
                icon={CheckSquare} 
                label="Tarefas" 
                href="/tasks" 
                active={location.pathname === '/tasks'} 
              />
              <SidebarItem 
                icon={ShoppingCart} 
                label="Lista de Compras" 
                href="/shopping" 
                active={location.pathname === '/shopping'} 
              />
              {user?.pode_ver_financeiro && (
                <SidebarItem 
                  icon={DollarSign} 
                  label="Financeiro" 
                  href="/finance" 
                  active={location.pathname === '/finance'} 
                />
              )}
              <SidebarItem 
                icon={Users} 
                label="Usuários" 
                href="/users" 
                active={location.pathname === '/users'} 
              />
            </>
          )}
        </nav>

        <div className="p-4 border-t border-slate-100 space-y-2">
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold">
              {user?.nome?.[0] || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{user?.nome}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-slate-600 hover:text-red-600 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 border-b border-slate-200 bg-white flex items-center px-8 shrink-0">
          <h2 className="text-lg font-semibold text-slate-800 capitalize">
            {location.pathname.split('/').pop() || 'Dashboard'}
          </h2>
        </header>
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
};
