
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { navItems } from "./nav-items";
import Auth from "./pages/Auth";
import DemoBanner from "./components/DemoBanner";

const queryClient = new QueryClient();

// Only enable Health route in development or when explicitly allowed via env flag
const enableHealth = (import.meta.env.VITE_ENABLE_HEALTH as string | undefined) === 'true' || import.meta.env.MODE !== 'production';
const Health = enableHealth ? lazy(() => import('./pages/Health')) : null;

const App = () => {
  console.log('App: Rendering with navItems:', navItems.length);
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
  <DemoBanner />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Auth route */}
            <Route path="/auth" element={<Auth />} />
            
            {/* Main navigation routes */}
            {navItems.map(({ to, page }) => {
              console.log('App: Registering route:', to);
              return (
                <Route 
                  key={to} 
                  path={to} 
                  element={page}
                />
              );
            })}

            {/* Health route (dev only or when VITE_ENABLE_HEALTH=true) */}
            {enableHealth && Health && (
              <Route path="/health" element={<Suspense fallback={<div style={{padding:16}}>Loading…</div>}><Health /></Suspense>} />
            )}
            
            {/* Dynamic routes for property components */}
            <Route 
              path="/property-components/:category" 
              element={navItems.find(item => item.to === '/property-components')?.page}
            />
            <Route 
              path="/property-components/:category/:item" 
              element={navItems.find(item => item.to === '/property-components')?.page}
            />
            
            {/* Catch all route for 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
