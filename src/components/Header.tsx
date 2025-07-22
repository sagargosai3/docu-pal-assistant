import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

const mainNavItems = [
  { path: '/', label: 'AI Assistant' },
  { path: '/intelligence', label: 'Machine Intelligence' },
  { path: '/blog', label: 'Blog' },
  { path: '/machines', label: 'Machines' },
  { path: '/leads', label: 'Leads' },
  { path: '/resumes', label: 'Resumes' },
  { path: '/vacancies', label: 'Vacancies' },
  { path: '/opportunities', label: 'Opportunities' },
  { path: '/directory', label: 'Directory' },
];

export default function Header() {
  const location = useLocation();
  return (
    <header className="w-full text-white sticky top-0 z-50">
      <div className="bg-[#1a1d21] border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold">AI ZatpatMachines</Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="flex items-center gap-1">English <ChevronDown className="w-4 h-4" /></Button>
            <Link to="/login"><Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Login / Register</Button></Link>
          </div>
        </div>
      </div>
      <nav className="bg-[#2c313a] border-b border-border">
        <div className="container mx-auto px-4 flex items-center h-12 overflow-x-auto">
          <div className="flex items-center gap-2">
            {mainNavItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path} className={`px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap ${isActive ? 'text-primary border-b-2 border-primary' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </header>
  );
} 