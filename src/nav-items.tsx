
import React from 'react';
import { Home, Wrench, FileText, Droplets, MessageSquare, Phone, Star, Users, Brain, Camera, Shield } from "lucide-react";
import Index from "./pages/Index";
import PropertyComponents from "./pages/PropertyComponents";
import Maintenance from "./pages/Maintenance";
import Reports from "./pages/Reports";
import WaterReadings from "./pages/WaterReadings";
import WhatsAppIntegration from "./pages/WhatsAppIntegration";
import PremiumReports from "./pages/PremiumReports";
import Community from "./pages/Community";
import Contacts from "./pages/Contacts";
import AIInsights from "./pages/AIInsights";
import AdminAliases from "./pages/AdminAliases";
// Health route remains available directly via /health, but it is removed from navigation.

/**
 * Central place to define the navigation items. Used for navigation components and routing.
 */
export const navItems = [
  {
    title: "Dashboard",
    to: "/",
    icon: <Home className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "Property Components",
    to: "/property-components",
    icon: <Camera className="h-4 w-4" />,
    page: <PropertyComponents />,
  },
  {
    title: "Maintenance",
    to: "/maintenance",
    icon: <Wrench className="h-4 w-4" />,
    page: <Maintenance />,
  },
  {
    title: "Water Readings",
    to: "/water-readings",
    icon: <Droplets className="h-4 w-4" />,
    page: <WaterReadings />,
  },
  {
    title: "Reports",
    to: "/reports",
    icon: <FileText className="h-4 w-4" />,
    page: <Reports />,
  },
  {
    title: "Premium Reports",
    to: "/premium-reports",
    icon: <Star className="h-4 w-4" />,
    page: <PremiumReports />,
  },
  {
    title: "Ask Rutherford",
    to: "/ai-insights",
    icon: <Brain className="h-4 w-4" />,
    page: <AIInsights />,
  },
  {
    title: "WhatsApp",
    to: "/whatsapp",
    icon: <MessageSquare className="h-4 w-4" />,
    page: <WhatsAppIntegration />,
  },
  {
    title: "Community",
    to: "/community",
    icon: <Users className="h-4 w-4" />,
    page: <Community />,
  },
  {
    title: "Contacts",
    to: "/contacts",
    icon: <Phone className="h-4 w-4" />,
    page: <Contacts />,
  },
  {
    title: "Admin: Aliases",
    to: "/admin/aliases",
    icon: <Shield className="h-4 w-4" />,
    page: <AdminAliases />,
  },
  // Health was intentionally removed from the visible nav.
];
