import { Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function MainLayout() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 lg:px-6 flex-shrink-0">
            <div className="flex items-center space-x-4 min-w-0">
              <SidebarTrigger className="lg:hidden h-8 w-8 text-foreground" />
              <div className="min-w-0 flex-1">
                <h1 className="text-base lg:text-lg font-semibold text-foreground truncate">User Management System</h1>
                <p className="text-xs lg:text-sm text-muted-foreground hidden sm:block truncate">Enterprise User Administration Platform</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 lg:space-x-4 flex-shrink-0">
              <ThemeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 h-8 lg:h-10 px-2 lg:px-3">
                    <User className="w-4 h-4 text-foreground" />
                    <span className="hidden md:inline text-foreground text-sm truncate max-w-24 lg:max-w-none">
                      {user?.firstName} {user?.lastName}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-popover border-border">
                  <DropdownMenuLabel>
                    <div>
                      <p className="font-medium text-popover-foreground">{user?.firstName} {user?.lastName}</p>
                      <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-popover-foreground hover:bg-accent cursor-pointer">
                    <User className="w-4 h-4 mr-2" />
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 dark:text-red-400 hover:bg-accent cursor-pointer">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto bg-background p-4 lg:p-6">
            <div className="max-w-full">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}