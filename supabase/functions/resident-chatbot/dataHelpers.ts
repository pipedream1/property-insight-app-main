
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Helper function to get current water readings
export async function getCurrentWaterReadings() {
  try {
    const { data, error } = await supabase
      .from('water_readings')
      .select('*')
      .order('date', { ascending: false })
      .limit(50); // Increased limit to get more historical data
    
    if (error) {
      console.error('Error fetching water readings:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getCurrentWaterReadings:', error);
    return null;
  }
}

// Helper function to get maintenance tasks
export async function getMaintenanceTasks(status?: string) {
  try {
    let query = supabase
      .from('maintenance_tasks')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (status) {
      if (status === 'pending') {
        query = query.is('completed_at', null);
      } else if (status === 'completed') {
        query = query.not('completed_at', 'is', null);
      }
    }
    
    const { data, error } = await query.limit(100); // Increased limit for more historical data
    
    if (error) {
      console.error('Error fetching maintenance tasks:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getMaintenanceTasks:', error);
    return null;
  }
}

// Helper function to calculate water usage for current month
export async function getCurrentMonthUsage() {
  try {
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    const { data, error } = await supabase
      .from('water_readings')
      .select('*')
      .gte('date', startOfMonth.toISOString())
      .lte('date', endOfMonth.toISOString())
      .order('date', { ascending: true });
    
    if (error) {
      console.error('Error fetching current month usage:', error);
      return null;
    }
    
    // Calculate usage by source
    const usageBySource: Record<string, { start: number; end: number; usage: number }> = {};
    
    data?.forEach(reading => {
      const source = reading.component_name;
      if (!usageBySource[source]) {
        usageBySource[source] = { start: reading.reading, end: reading.reading, usage: 0 };
      } else {
        if (reading.reading > usageBySource[source].end) {
          usageBySource[source].end = reading.reading;
          usageBySource[source].usage = usageBySource[source].end - usageBySource[source].start;
        }
      }
    });
    
    return { data, usageBySource };
  } catch (error) {
    console.error('Error in getCurrentMonthUsage:', error);
    return null;
  }
}

// Helper function to get recent reports
export async function getRecentReports() {
  try {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20); // Increased limit
    
    if (error) {
      console.error('Error fetching reports:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getRecentReports:', error);
    return null;
  }
}

// Helper function to get ALL inspections (removed date filtering by default)
export async function getInspections(month?: string, year?: string, componentType?: string, limit: number = 200) {
  try {
    let query = supabase
      .from('inspections')
      .select('*')
      .order('inspection_date', { ascending: false });
    
    // Only apply date filtering if specifically requested
    if (month && year) {
      const startDate = new Date(`${year}-${month.padStart(2, '0')}-01`);
      const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
      
      query = query
        .gte('inspection_date', startDate.toISOString())
        .lte('inspection_date', endDate.toISOString());
    }
    
    if (componentType) {
      query = query.eq('component_type', componentType);
    }
    
    const { data, error } = await query.limit(limit);
    
    if (error) {
      console.error('Error fetching inspections:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getInspections:', error);
    return null;
  }
}

// Helper function to get inspection statistics (removed default date filtering)
export async function getInspectionStats(month?: string, year?: string) {
  try {
    let query = supabase
      .from('inspections')
      .select('*');
    
    // Only apply date filtering if specifically requested
    if (month && year) {
      const startDate = new Date(`${year}-${month.padStart(2, '0')}-01`);
      const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
      
      query = query
        .gte('inspection_date', startDate.toISOString())
        .lte('inspection_date', endDate.toISOString());
    }
    
    const { data, error } = await query.limit(500); // Higher limit for comprehensive stats
    
    if (error) {
      console.error('Error fetching inspection stats:', error);
      return null;
    }
    
    // Calculate statistics
    const stats = {
      total: data?.length || 0,
      byComponentType: {} as Record<string, number>,
      byCondition: {} as Record<string, number>,
      byDate: {} as Record<string, number>,
      byMonth: {} as Record<string, number>
    };
    
    data?.forEach(inspection => {
      // Count by component type
      if (inspection.component_type) {
        stats.byComponentType[inspection.component_type] = 
          (stats.byComponentType[inspection.component_type] || 0) + 1;
      }
      
      // Count by condition
      if (inspection.condition) {
        stats.byCondition[inspection.condition] = 
          (stats.byCondition[inspection.condition] || 0) + 1;
      }
      
      // Count by date
      if (inspection.inspection_date) {
        const date = new Date(inspection.inspection_date).toISOString().split('T')[0];
        stats.byDate[date] = (stats.byDate[date] || 0) + 1;
        
        // Count by month for trend analysis
        const monthYear = new Date(inspection.inspection_date).toISOString().substring(0, 7);
        stats.byMonth[monthYear] = (stats.byMonth[monthYear] || 0) + 1;
      }
    });
    
    return { data, stats };
  } catch (error) {
    console.error('Error in getInspectionStats:', error);
    return null;
  }
}

// Property Component Analytics (updated to get more comprehensive data)
export async function getPropertyComponentAnalytics(componentType?: string) {
  try {
    let query = supabase
      .from('property_components')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (componentType) {
      query = query.eq('component_type', componentType);
    }
    
    const { data, error } = await query.limit(200); // Increased limit
    
    if (error) {
      console.error('Error fetching property components:', error);
      return null;
    }
    
    // Analyze component conditions
    const conditionStats: Record<string, number> = {};
    const componentsByType: Record<string, any[]> = {};
    
    data?.forEach(component => {
      // Count conditions
      if (component.condition) {
        conditionStats[component.condition] = (conditionStats[component.condition] || 0) + 1;
      }
      
      // Group by type
      if (component.component_type) {
        if (!componentsByType[component.component_type]) {
          componentsByType[component.component_type] = [];
        }
        componentsByType[component.component_type].push(component);
      }
    });
    
    return { data, conditionStats, componentsByType };
  } catch (error) {
    console.error('Error in getPropertyComponentAnalytics:', error);
    return null;
  }
}

// NEW: Get ALL historical data without date restrictions
export async function getAllHistoricalData() {
  try {
    console.log('Fetching ALL historical data for comprehensive analysis...');
    
    const [inspections, waterReadings, maintenanceTasks, reports, components] = await Promise.all([
      supabase.from('inspections').select('*').order('inspection_date', { ascending: false }).limit(1000),
      supabase.from('water_readings').select('*').order('date', { ascending: false }).limit(1000),
      supabase.from('maintenance_tasks').select('*').order('created_at', { ascending: false }).limit(500),
      supabase.from('reports').select('*').order('created_at', { ascending: false }).limit(100),
      supabase.from('property_components').select('*').order('created_at', { ascending: false }).limit(500)
    ]);
    
    const historicalData = {
      inspections: inspections.data || [],
      waterReadings: waterReadings.data || [],
      maintenanceTasks: maintenanceTasks.data || [],
      reports: reports.data || [],
      components: components.data || [],
      totalRecords: (inspections.data?.length || 0) + (waterReadings.data?.length || 0) + 
                   (maintenanceTasks.data?.length || 0) + (reports.data?.length || 0) + 
                   (components.data?.length || 0)
    };
    
    console.log(`Retrieved ${historicalData.totalRecords} total historical records`);
    return historicalData;
  } catch (error) {
    console.error('Error in getAllHistoricalData:', error);
    return null;
  }
}

// WhatsApp Integration Support
export async function getWhatsAppIntegrationStatus() {
  try {
    const { data: config, error: configError } = await supabase
      .from('whatsapp_config')
      .select('*')
      .limit(1);
    
    const { data: messages, error: messagesError } = await supabase
      .from('whatsapp_messages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50); // Increased limit
    
    if (configError || messagesError) {
      console.error('Error fetching WhatsApp data:', configError || messagesError);
      return null;
    }
    
    return { config: config?.[0], recentMessages: messages };
  } catch (error) {
    console.error('Error in getWhatsAppIntegrationStatus:', error);
    return null;
  }
}

// Maintenance Photo Analysis
export async function getMaintenancePhotos(taskId?: string) {
  try {
    let query = supabase
      .from('maintenance_photos')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (taskId) {
      query = query.eq('maintenance_task_id', taskId);
    }
    
    const { data, error } = await query.limit(100); // Increased limit
    
    if (error) {
      console.error('Error fetching maintenance photos:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getMaintenancePhotos:', error);
    return null;
  }
}

// Location Services
export async function getLocationTracks(limit = 50) {
  try {
    const { data, error } = await supabase
      .from('location_tracks')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching location tracks:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getLocationTracks:', error);
    return null;
  }
}

// Contact Directory Access
export async function getContacts() {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching contacts:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getContacts:', error);
    return null;
  }
}

// NEW: Get reservoir readings
export async function getReservoirReadings(limit = 50) {
  try {
    const { data, error } = await supabase
      .from('reservoir_readings')
      .select('*')
      .order('reading_date', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching reservoir readings:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getReservoirReadings:', error);
    return null;
  }
}

// Main function to fetch relevant data based on user message
export async function fetchRelevantData(message: string) {
  console.log('🔍 Fetching relevant database data for message:', message);
  
  try {
    // Fetch all data sources in parallel
    const [
      waterReadings,
      maintenanceTasks,
      inspections,
      reports,
      components,
      contacts,
      reservoirReadings,
      whatsappData,
      locationTracks,
      maintenancePhotos,
      historicalData
    ] = await Promise.all([
      getCurrentWaterReadings(),
      getMaintenanceTasks(),
      getInspections(),
      getRecentReports(),
      getPropertyComponentAnalytics(),
      getContacts(),
      getReservoirReadings(),
      getWhatsAppIntegrationStatus(),
      getLocationTracks(),
      getMaintenancePhotos(),
      getAllHistoricalData()
    ]);

    console.log('Database data fetched successfully');
    
    return {
      waterReadings,
      maintenanceTasks, 
      inspections,
      reports,
      components,
      contacts,
      reservoirReadings,
      whatsappData,
      locationTracks,
      maintenancePhotos,
      historicalData
    };
  } catch (error) {
    console.error('Error fetching relevant data:', error);
    return null;
  }
}

// Format database data for AI consumption
export function formatDataForAI(databaseData: any): string {
  if (!databaseData) {
    return 'No database data available.';
  }

  let formattedData = '\n\n🏠 LIVE PROPERTY MANAGEMENT DATA:\n';
  formattedData += '=' .repeat(50) + '\n';

  if (databaseData.waterReadings?.length > 0) {
    formattedData += `\n💧 WATER READINGS (${databaseData.waterReadings.length} records):\n`;
    databaseData.waterReadings.slice(0, 10).forEach((reading: any) => {
      formattedData += `• ${reading.component_name}: ${reading.reading} (${new Date(reading.date).toLocaleDateString()})\n`;
    });
  }

  if (databaseData.maintenanceTasks?.length > 0) {
    const pending = databaseData.maintenanceTasks.filter((task: any) => !task.completed_at);
    const completed = databaseData.maintenanceTasks.filter((task: any) => task.completed_at);
    
    formattedData += `\n🔧 MAINTENANCE TASKS:\n`;
    formattedData += `• Pending: ${pending.length}\n`;
    formattedData += `• Completed: ${completed.length}\n`;
    
    if (pending.length > 0) {
      formattedData += `\nRecent Pending Tasks:\n`;
      pending.slice(0, 5).forEach((task: any) => {
        formattedData += `• ${task.component_type} - ${task.description} (Priority: ${task.priority})\n`;
      });
    }
  }

  if (databaseData.inspections?.length > 0) {
    formattedData += `\n🔍 INSPECTIONS (${databaseData.inspections.length} records):\n`;
    const recentInspections = databaseData.inspections.slice(0, 5);
    recentInspections.forEach((inspection: any) => {
      formattedData += `• ${inspection.component_name} - ${inspection.condition} (${new Date(inspection.inspection_date).toLocaleDateString()})\n`;
    });
  }

  if (databaseData.reservoirReadings?.length > 0) {
    formattedData += `\n🌊 RESERVOIR READINGS (${databaseData.reservoirReadings.length} records):\n`;
    const latest = databaseData.reservoirReadings[0];
    formattedData += `• Latest: ${latest.percentage_full}% full (${new Date(latest.reading_date).toLocaleDateString()})\n`;
  }

  if (databaseData.reports?.length > 0) {
    formattedData += `\n📊 REPORTS (${databaseData.reports.length} available):\n`;
    databaseData.reports.slice(0, 3).forEach((report: any) => {
      formattedData += `• ${report.name} - ${report.type} (${new Date(report.created_at).toLocaleDateString()})\n`;
    });
  }

  return formattedData;
}
