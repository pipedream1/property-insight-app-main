
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center px-4">
        <div className="flex justify-center items-center mb-6">
          <h1 className="text-5xl md:text-6xl font-bold text-primary">404</h1>
        </div>
        <p className="text-xl text-gray-600 mb-8">Oops! The page you're looking for cannot be found.</p>
        <Button asChild>
          <a href="/">
            <Home className="h-4 w-4" />
            Return to Dashboard
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
