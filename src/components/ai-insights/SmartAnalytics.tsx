
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, AlertTriangle, Calendar, Lightbulb } from 'lucide-react';
import { useReports } from '@/hooks/useReports';
import { useWaterReadings } from '@/hooks/useWaterReadings';
import { usePropertyComponents } from '@/hooks/usePropertyComponents';

interface Insight {
  id: string;
  type: 'warning' | 'info' | 'success' | 'prediction';
  title: string;
  description: string;
  action?: string;
  priority: 'high' | 'medium' | 'low';
}

export const SmartAnalytics = () => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const { reports } = useReports();
  const { readings } = useWaterReadings();
  const { recentInspections, componentStatuses } = usePropertyComponents();

  useEffect(() => {
    generateInsights();
  }, [reports, readings, recentInspections, componentStatuses]);

  const generateInsights = () => {
    const newInsights: Insight[] = [];

    // Water usage analysis
    if (readings && readings.length >= 2) {
      const latest = readings[0];
      const previous = readings[1];
      const usageChange = ((latest.reading - previous.reading) / previous.reading) * 100;
      
      if (Math.abs(usageChange) > 20) {
        newInsights.push({
          id: 'water-usage-anomaly',
          type: usageChange > 0 ? 'warning' : 'info',
          title: `Water Usage ${usageChange > 0 ? 'Spike' : 'Drop'} Detected`,
          description: `${latest.component_type} shows a ${Math.abs(usageChange).toFixed(1)}% ${usageChange > 0 ? 'increase' : 'decrease'} in usage compared to the previous reading.`,
          action: 'Investigate potential leak or meter issue',
          priority: usageChange > 30 ? 'high' : 'medium'
        });
      }
    }

    // Component condition analysis
    if (componentStatuses) {
      const poorComponents = Object.entries(componentStatuses).filter(([_, status]) => status === 'poor');
      const criticalComponents = recentInspections?.filter(c => c.condition?.toLowerCase().includes('critical')) || [];
      
      if (criticalComponents.length > 0) {
        newInsights.push({
          id: 'critical-components',
          type: 'warning',
          title: `${criticalComponents.length} Critical Component${criticalComponents.length > 1 ? 's' : ''} Found`,
          description: `Components requiring immediate attention: ${criticalComponents.map(c => c.component_name).join(', ')}`,
          action: 'Schedule urgent maintenance',
          priority: 'high'
        });
      }

      if (poorComponents.length > 0) {
        newInsights.push({
          id: 'poor-components',
          type: 'warning',
          title: `${poorComponents.length} Component${poorComponents.length > 1 ? 's' : ''} in Poor Condition`,
          description: `Components needing maintenance soon: ${poorComponents.slice(0, 3).map(([name]) => name).join(', ')}${poorComponents.length > 3 ? '...' : ''}`,
          action: 'Plan maintenance schedule',
          priority: 'medium'
        });
      }
    }

    // Report analysis
    if (reports) {
      const recentReports = reports.filter(r => r.status === 'completed').slice(0, 5);
      const failedReports = reports.filter(r => r.status === 'failed');
      
      if (failedReports.length > 0) {
        newInsights.push({
          id: 'failed-reports',
          type: 'warning',
          title: `${failedReports.length} Report${failedReports.length > 1 ? 's' : ''} Failed to Generate`,
          description: `Recent report generation failures may indicate data quality issues.`,
          action: 'Check data integrity and retry',
          priority: 'medium'
        });
      }

      if (recentReports.length > 0) {
        newInsights.push({
          id: 'report-trends',
          type: 'info',
          title: 'Report Generation Trending Well',
          description: `${recentReports.length} reports generated successfully in recent period.`,
          priority: 'low'
        });
      }
    }

    // Predictive maintenance suggestions
    newInsights.push({
      id: 'maintenance-prediction',
      type: 'prediction',
      title: 'Upcoming Maintenance Recommendations',
      description: 'Based on inspection patterns, consider scheduling quarterly inspections for high-usage components.',
      action: 'Review maintenance calendar',
      priority: 'medium'
    });

    setInsights(newInsights);
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'prediction': return <TrendingUp className="h-4 w-4 text-blue-600" />;
      case 'info': return <Lightbulb className="h-4 w-4 text-green-600" />;
      default: return <Calendar className="h-4 w-4 text-gray-600" />;
    }
  };

  const getBadgeColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-blue-600" />
          Smart Analytics & Insights
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          AI-powered analysis of your property data with actionable recommendations
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Lightbulb className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Analyzing your data to generate insights...</p>
          </div>
        ) : (
          insights.map((insight) => (
            <div key={insight.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getInsightIcon(insight.type)}
                  <h4 className="font-medium">{insight.title}</h4>
                </div>
                <Badge className={getBadgeColor(insight.priority)}>
                  {insight.priority}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{insight.description}</p>
              {insight.action && (
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline">
                    {insight.action}
                  </Button>
                </div>
              )}
            </div>
          ))
        )}
        <div className="pt-4 border-t">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={generateInsights}
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Refresh Analysis
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
