
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BackButtonProps {
  className?: string;
  variant?: "default" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export const BackButton: React.FC<BackButtonProps> = ({ 
  className = "mb-4", 
  variant = "outline",
  size = "sm" 
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    try {
      navigate(-1);
    } catch (error) {
      // Fallback to home if navigation fails
      navigate('/');
    }
  };

  return (
    <Button 
      onClick={handleBack}
      variant={variant}
      size={size}
      className={className}
    >
      <ArrowLeft className="h-4 w-4 mr-1" />
      Back
    </Button>
  );
};
