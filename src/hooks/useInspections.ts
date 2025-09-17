import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchInspections, createInspection, Inspection } from '@/api/inspectionsApi';
import { toast } from 'sonner';

export const useInspections = () => {
  const queryClient = useQueryClient();

  const { data: inspections = [], isLoading, error } = useQuery({
    queryKey: ['inspections'],
    queryFn: fetchInspections,
  });

  const createMutation = useMutation({
    mutationFn: createInspection,
    onSuccess: (newInspection) => {
      if (newInspection) {
        queryClient.setQueryData(['inspections'], (old: Inspection[] = []) => [
          newInspection,
          ...old,
        ]);
        toast.success('Inspection created successfully');
      }
    },
    onError: (error) => {
      console.error('Error creating inspection:', error);
      toast.error('Failed to create inspection');
    },
  });

  return {
    inspections,
    isLoading,
    error,
    createInspection: createMutation.mutate,
    isCreating: createMutation.isPending,
  };
};
