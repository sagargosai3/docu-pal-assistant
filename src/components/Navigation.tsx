import { Link, useLocation } from 'react-router-dom';
import { MessageCircle, Upload, FileText, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useState } from 'react';

const navItems = [
  { path: '/', label: 'Chat Assistant', icon: MessageCircle },
  { path: '/upload', label: 'Upload Documents', icon: Upload },
  { path: '/documents', label: 'Document Library', icon: FileText }
];

export default function Navigation() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop Navigation */}
      <Card className="hidden md:block sticky top-4 mb-8 bg-gradient-card shadow-card">
        <div className="p-4">
          <nav className="flex items-center justify-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link key={item.path} to={item.path}>
                  <Button 
                    variant={isActive ? "default" : "ghost"}
                    className={`flex items-center gap-2 ${
                      isActive ? 'shadow-button' : 'hover:bg-secondary'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>
      </Card>

      {/* Mobile Navigation */}
      <div className="md:hidden mb-6">
        <Card className="bg-gradient-card shadow-card">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Document Assistant</h2>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu className="w-5 h-5" />
              </Button>
            </div>
            
            {isMobileMenuOpen && (
              <nav className="mt-4 space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  
                  return (
                    <Link 
                      key={item.path} 
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Button 
                        variant={isActive ? "default" : "ghost"}
                        className={`w-full flex items-center gap-2 justify-start ${
                          isActive ? 'shadow-button' : 'hover:bg-secondary'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {item.label}
                      </Button>
                    </Link>
                  );
                })}
              </nav>
            )}
          </div>
        </Card>
      </div>
    </>
  );
}