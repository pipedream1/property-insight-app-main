
import { useState, useEffect, useCallback, useRef } from 'react';
import { ReportType } from '@/integrations/supabase/client';
import { fetchReports } from '@/services/reportService';
import { useReportGeneration } from './useReportGeneration';
import { useReportDownload } from './useReportDownload';

export function useOptimizedReports() {
  const [reports, setReports] = useState<ReportType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Cache timeout reference
  const cacheTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // Cache expiry time: 5 minutes
  const CACHE_EXPIRY_TIME = 5 * 60 * 1000;
  // Last fetch timestamp
  const lastFetchTimeRef = useRef<number>(0);
  
  const fetchReportsData = useCallback(async (forceRefresh = false) => {
    // If not forcing refresh and data was fetched recently, don't fetch again
    const now = Date.now();
    if (!forceRefresh && reports.length > 0 && now - lastFetchTimeRef.current < CACHE_EXPIRY_TIME) {
      return;
    }

    setError(null);
    setIsLoading(true);
    
    try {
      const data = await fetchReports();
      setReports(data);
      lastFetchTimeRef.current = now;
      
      // Set up cache timeout
      if (cacheTimeoutRef.current) {
        clearTimeout(cacheTimeoutRef.current);
      }
      
      cacheTimeoutRef.current = setTimeout(() => {
        // Mark cache as expired
        lastFetchTimeRef.current = 0;
      }, CACHE_EXPIRY_TIME);
    } catch (err) {
      console.error("Error fetching reports:", err);
      setError("Failed to load reports. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [reports.length]);

  // Fetch reports on mount
  useEffect(() => {
    fetchReportsData();
    
    // Cleanup
    return () => {
      if (cacheTimeoutRef.current) {
        clearTimeout(cacheTimeoutRef.current);
      }
    };
  }, [fetchReportsData]);

  return {
    reports,
    isLoading,
    error,
    fetchReports: (forceRefresh = true) => fetchReportsData(forceRefresh),
    // Re-export the other hooks for backward compatibility
    useReportGeneration,
    useReportDownload
  };
}
