
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, RefreshCw, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface ComponentAnalysis {
  component: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  estimated_cost?: string;
}

interface PredictiveData {
  immediate_attention: ComponentAnalysis[];
  within_year: ComponentAnalysis[];
  health_score: number;
  recommendations: string[];
  total_estimated_costs: string;
}

export const PredictiveAnalytics = () => {
  const [analysisData, setAnalysisData] = useState<PredictiveData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const runAnalysis = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/functions/v1/predictive-analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setAnalysisData(data.analysis);
      setLastUpdated(new Date());
      toast.success('Predictive analysis completed successfully');
    } catch (error) {
      console.error('Predictive analytics error:', error);
      toast.error('Failed to run predictive analysis');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runAnalysis();
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="bg-green-50">
          <CardTitle className="flex items-center justify-between text-green-700">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Infrastructure Replacement Planning
            </div>
            <Button 
              onClick={runAnalysis} 
              disabled={isLoading}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Analyzing...' : 'Refresh Analysis'}
            </Button>
          </CardTitle>
          <p className="text-sm text-green-600">
            AI-powered predictions for component replacement and maintenance scheduling
          </p>
        </CardHeader>
        
        <CardContent className="pt-6">
          {!analysisData && !isLoading && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Click "Refresh Analysis" to generate predictions</p>
            </div>
          )}

          {isLoading && (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-muted-foreground">Analyzing component data...</p>
            </div>
          )}

          {analysisData && (
            <div className="space-y-6">
              {/* Health Score */}
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Overall Infrastructure Health</h3>
                <div className={`text-4xl font-bold ${getHealthScoreColor(analysisData.health_score)}`}>
                  {analysisData.health_score}/10
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {lastUpdated && `Last updated: ${lastUpdated.toLocaleString()}`}
                </p>
              </div>

              {/* Immediate Attention Needed */}
              {analysisData.immediate_attention.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    Immediate Attention Required
                  </h3>
                  <div className="space-y-3">
                    {analysisData.immediate_attention.map((item, index) => (
                      <Card key={index} className="border-red-200">
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium">{item.component}</h4>
                            <Badge className={getPriorityColor(item.priority)}>
                              {item.priority} priority
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{item.reason}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Within Year */}
              {analysisData.within_year.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-yellow-600" />
                    Plan Within 12 Months
                  </h3>
                  <div className="space-y-3">
                    {analysisData.within_year.map((item, index) => (
                      <Card key={index} className="border-yellow-200">
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium">{item.component}</h4>
                            {item.estimated_cost && (
                              <Badge variant="outline">
                                {item.estimated_cost}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{item.reason}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {analysisData.recommendations.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    AI Recommendations
                  </h3>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <ul className="space-y-2">
                      {analysisData.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Cost Estimate */}
              {analysisData.total_estimated_costs && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">Budget Planning</h3>
                  <p className="text-sm text-blue-700">
                    <strong>Estimated costs:</strong> {analysisData.total_estimated_costs}
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
