
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LogOut, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header = () => {
  // Temporary mock user data for testing
  const mockUser = {
    email: 'leenormand337@gmail.com',
    full_name: 'Lee Normand',
    role: 'owner'
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'owner':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'management':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'resident':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6 flex-1">
            <img 
              src="/lovable-uploads/8d00b878-bc6d-49a1-8a5f-83c53407bc1e.png" 
              alt="Belvidere Estate Logo" 
              className="w-20 h-20"
            />
            <div className="text-center flex-1">
              <h1 className="text-2xl font-bold text-gray-900">Belvidere Estate</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className={getRoleBadgeColor(mockUser.role)}>
              {mockUser.role.charAt(0).toUpperCase() + mockUser.role.slice(1)}
            </Badge>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>{mockUser.full_name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{mockUser.full_name}</p>
                  <p className="text-xs text-muted-foreground">{mockUser.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out (Disabled)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
