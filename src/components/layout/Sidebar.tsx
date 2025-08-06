import { 
  FileText, 
  Plus, 
  Search, 
  Settings,
  BarChart3,
  Home,
  Image,
  Download
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'All Posts', href: '/posts', icon: FileText },
  { name: 'New Post', href: '/posts/new', icon: Plus },
  { name: 'Search', href: '/search', icon: Search },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Media', href: '/media', icon: Image },
  { name: 'Import/Export', href: '/import-export', icon: Download },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export const Sidebar = () => {
  return (
    <div className="glass-sidebar w-64 min-h-screen shadow-2xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-twitter-blue/5 to-transparent pointer-events-none" />
      
      <div className="flex items-center justify-center h-16 border-b border-white/10 bg-black/40 backdrop-blur-xl relative z-10">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-twitter-blue rounded-full flex items-center justify-center animate-pulse-glow">
            <span className="text-white font-bold text-sm">X</span>
          </div>
          <h1 className="text-xl font-bold text-white">Mini CMS</h1>
        </div>
      </div>
      
      <nav className="mt-8 px-4 relative z-10">
        <ul className="space-y-3">
          {navigation.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.href}
                end={item.href === '/'}
                className={({ isActive }) =>
                  cn(
                    'flex items-center px-4 py-3 text-sm font-medium rounded-full transition-all duration-300 group relative overflow-hidden',
                    isActive
                      ? 'bg-twitter-blue text-white shadow-lg shadow-twitter-blue/30 transform scale-105'
                      : 'text-white/70 hover:bg-white/10 hover:text-white hover:scale-105 backdrop-blur-sm border border-white/10'
                  )
                }
              >
                <div className="absolute inset-0 bg-gradient-to-r from-twitter-blue/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <item.icon className="mr-3 h-5 w-5 relative z-10" />
                <span className="relative z-10">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Floating elements for liquid effect */}
      <div className="absolute bottom-10 left-4 w-12 h-12 bg-twitter-blue/20 rounded-full blur-xl animate-float" />
      <div className="absolute top-32 right-6 w-8 h-8 bg-white/10 rounded-full blur-lg animate-float" style={{ animationDelay: '1s' }} />
    </div>
  );
};