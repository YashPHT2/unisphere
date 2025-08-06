import { User, Bell, Sun, Moon, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleNotificationClick = () => {
    toast({
      title: "Notifications",
      description: "You have 3 new notifications",
    });
  };

  const handleProfileAction = (action: string) => {
    switch (action) {
      case 'settings':
        navigate('/settings');
        break;
      case 'logout':
        toast({
          title: "Logged out",
          description: "You have been successfully logged out",
        });
        break;
      default:
        break;
    }
  };
  return (
    <header className="glass-header px-6 py-4 shadow-2xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-twitter-blue/5 via-transparent to-purple-500/5" />
      
      <div className="flex items-center justify-between relative z-10">
        <div className="liquid-animation">
          <h2 className="text-2xl font-bold text-white bg-gradient-to-r from-white to-twitter-blue-light bg-clip-text text-transparent">
            Content Management
          </h2>
          <p className="text-sm text-white/60 mt-1">
            Create and manage your content
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button 
            variant="glass" 
            size="icon" 
            onClick={toggleTheme}
            className="hover:bg-twitter-blue/20"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button 
            variant="glass" 
            size="icon" 
            className="relative group"
            onClick={handleNotificationClick}
          >
            <Bell className="h-5 w-5" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-twitter-blue rounded-full animate-pulse" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="glass" size="icon" className="twitter-hover">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => handleProfileAction('settings')}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleProfileAction('logout')}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};