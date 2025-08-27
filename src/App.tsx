
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Health from "./pages/Health";
import { navItems } from "./nav-items";

const queryClient = new QueryClient();

const App = () => {
  console.log('App: Rendering with navItems:', navItems.length);
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Redirect auth route to dashboard */}
            <Route path="/auth" element={<Navigate to="/" replace />} />
            
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

            {/* Health route for connectivity checks */}
            <Route path="/health" element={<Health />} />
            
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
