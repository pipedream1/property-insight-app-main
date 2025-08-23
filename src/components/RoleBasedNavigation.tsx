
import React from 'react';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { navItems } from '@/nav-items';

interface RoleBasedNavigationProps {
  children: React.ReactNode;
}

// Define which features are available to which roles
const rolePermissions: Record<string, UserRole[]> = {
  '/': ['owner', 'management', 'resident'], // Dashboard - everyone
  '/water-readings': ['owner', 'management', 'resident'], // Water readings - everyone can view
  '/property-components': ['owner', 'management'], // Property components - management only
  '/reports': ['owner', 'management'], // Reports - management only  
  '/maintenance': ['owner', 'management'], // Maintenance - management only
  '/community': ['owner', 'management', 'resident'], // Community - everyone
  '/ai-insights': ['owner', 'management'], // Ask Rutherford - management only
  '/whatsapp': ['owner', 'management'], // WhatsApp - management only
  '/contacts': ['owner', 'management', 'resident'], // Contacts - everyone
};

export const getFilteredNavItems = (userRole: UserRole | undefined) => {
  if (!userRole) return [];
  
  return navItems.filter(item => {
    const allowedRoles = rolePermissions[item.to];
    return allowedRoles && allowedRoles.includes(userRole);
  });
};

const RoleBasedNavigation: React.FC<RoleBasedNavigationProps> = ({ children }) => {
  const { profile } = useAuth();
  
  // For now, just render children - the filtering happens in the dashboard
  return <>{children}</>;
};

export default RoleBasedNavigation;
