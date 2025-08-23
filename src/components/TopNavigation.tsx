
import React from 'react';
import { Bell, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { OfflineSyncStatus } from '@/components/OfflineSyncStatus';
import { navItems } from '@/nav-items';

const TopNavigation = () => {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 w-full sticky top-0 z-50">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">BE</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Belvidere Estate</h1>
              <p className="text-xs text-gray-500">Property Management</p>
            </div>
          </div>
          
          <nav className="hidden lg:flex items-center space-x-2 ml-8">
            {navItems.map((item) => (
              <Link key={item.to} to={item.to}>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center gap-2 text-gray-700 hover:text-primary hover:bg-primary-50"
                >
                  {item.icon}
                  <span className="text-sm">{item.title}</span>
                </Button>
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          <OfflineSyncStatus />
          
          <Button variant="ghost" size="sm">
            <Bell className="h-4 w-4" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <User className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default TopNavigation;
