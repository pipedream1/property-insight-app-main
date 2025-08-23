
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileBarChart, TrendingUp, AlertTriangle, Calendar, Lightbulb } from 'lucide-react';
import { useOptimizedReports } from '@/hooks/useOptimizedReports';
import { Badge } from '@/components/ui/badge';

export const ReportAnalytics = () => {
  const { reports } = useOptimizedReports();
  const [selectedAnalysis, setSelectedAnalysis] = useState<string | null>(null);

  const analysisOptions = [
    {
      id: 'trends',
      title: 'Trend Analysis',
      icon: <TrendingUp className="h-4 w-4" />,
      description: 'Analyze usage patterns and trends',
      prompt: 'Analyze the trends in my recent reports and tell me what patterns you notice in water usage and component conditions.'
    },
    {
      id: 'anomalies',
      title: 'Anomaly Detection',
      icon: <AlertTriangle className="h-4 w-4" />,
      description: 'Identify unusual patterns',
      prompt: 'Review my recent reports and identify any anomalies or unusual patterns that might need attention.'
    },
    {
      id: 'comparison',
      title: 'Comparative Analysis',
      icon: <Calendar className="h-4 w-4" />,
      description: 'Compare periods and performance',
      prompt: 'Compare my current month\'s performance with previous months and highlight significant changes.'
    },
    {
      id: 'recommendations',
      title: 'Maintenance Recommendations',
      icon: <Lightbulb className="h-4 w-4" />,
      description: 'Get AI-powered maintenance suggestions',
      prompt: 'Based on my component reports and inspection data, what maintenance recommendations do you have?'
    },
    {
      id: 'summary',
      title: 'Executive Summary',
      icon: <FileBarChart className="h-4 w-4" />,
      description: 'Get a high-level overview',
      prompt: 'Provide an executive summary of my property\'s current status based on all available reports and data.'
    }
  ];

  const handleAnalysisSelect = (option: typeof analysisOptions[0]) => {
    setSelectedAnalysis(option.id);
    // This would trigger the chatbot with the specific prompt
    const event = new CustomEvent('triggerChatbot', { detail: { message: option.prompt } });
    window.dispatchEvent(event);
  };

  const recentReports = reports.slice(0, 3);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileBarChart className="h-5 w-5" />
            AI Report Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Get intelligent insights from your reports using AI analysis
          </p>
          
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {analysisOptions.map((option) => (
              <Button
                key={option.id}
                variant={selectedAnalysis === option.id ? "default" : "outline"}
                className="h-auto p-4 flex flex-col items-start gap-2"
                onClick={() => handleAnalysisSelect(option)}
              >
                <div className="flex items-center gap-2 w-full">
                  {option.icon}
                  <span className="font-medium text-sm">{option.title}</span>
                </div>
                <p className="text-xs text-left opacity-70">{option.description}</p>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Reports Overview</CardTitle>
        </CardHeader>
        <CardContent>
          {recentReports.length > 0 ? (
            <div className="space-y-3">
              {recentReports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileBarChart className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">{report.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {report.month} {report.year} • {report.type}
                      </p>
                    </div>
                  </div>
                  <Badge variant={report.status === 'completed' ? 'default' : 'secondary'}>
                    {report.status}
                  </Badge>
                </div>
              ))}
              
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-3"
                onClick={() => handleAnalysisSelect({
                  id: 'recent-analysis',
                  title: 'Recent Reports Analysis',
                  icon: <FileBarChart className="h-4 w-4" />,
                  description: 'Analyze recent reports',
                  prompt: `Analyze my ${recentReports.length} most recent reports: ${recentReports.map(r => r.name).join(', ')}. What insights can you provide?`
                })}
              >
                Ask AI about these reports
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No recent reports available. Generate some reports to see AI analytics.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
