
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TopNavigation from '@/components/TopNavigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Brain, MessageCircle, TrendingUp, AlertTriangle, Lightbulb, Zap, FileBarChart, Send } from 'lucide-react';
import { ResidentChatbot } from '@/components/ai-insights/ResidentChatbot';
import { PredictiveAnalytics } from '@/components/ai-insights/PredictiveAnalytics';
import { AnomalyDetection } from '@/components/ai-insights/AnomalyDetection';
import { QuickActions } from '@/components/ai-insights/QuickActions';
import { NaturalLanguageQuery } from '@/components/ai-insights/NaturalLanguageQuery';
import { ReportAnalytics } from '@/components/ai-insights/ReportAnalytics';
import { QuickReportActions } from '@/components/ai-insights/QuickReportActions';
import { BackButton } from '@/components/ui/back-button';

const AIInsights = () => {
  const [quickQuery, setQuickQuery] = useState('');

  const handleQuickQuery = () => {
    if (quickQuery.trim()) {
      const event = new CustomEvent('triggerChatbot', { detail: { message: quickQuery } });
      window.dispatchEvent(event);
      setQuickQuery('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleQuickQuery();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigation />
      <main className="container mx-auto px-4 py-6">
        <BackButton />
        
        <div className="flex justify-center items-center mb-4">
          <Brain className="h-8 w-8 text-orange-600 mr-3" />
          <h1 className="text-2xl font-bold">Ask Rutherford</h1>
        </div>

        {/* Quick AI Query Input */}
        <div className="max-w-2xl mx-auto mb-6">
          <div className="flex gap-2">
            <Input
              value={quickQuery}
              onChange={(e) => setQuickQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Good day! How may I assist you with your property management today?"
              className="flex-1 border-orange-300 focus:border-orange-500"
            />
            <Button 
              onClick={handleQuickQuery}
              disabled={!quickQuery.trim()}
              size="icon"
              className="bg-orange-600 hover:bg-orange-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <p className="text-muted-foreground text-center mb-6">
          Your distinguished English butler AI assistant with comprehensive access to all estate documents, property data, and intelligent step-by-step guidance.
        </p>

        <Tabs defaultValue="assistant" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="assistant" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Ask Rutherford
            </TabsTrigger>
            <TabsTrigger value="quick-actions" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Quick Actions
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileBarChart className="h-4 w-4" />
              Report Analytics
            </TabsTrigger>
            <TabsTrigger value="predictive" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Predictive
            </TabsTrigger>
            <TabsTrigger value="anomaly" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Anomaly Detection
            </TabsTrigger>
          </TabsList>

          <TabsContent value="assistant">
            <ResidentChatbot />
          </TabsContent>

          <TabsContent value="quick-actions">
            <QuickActions />
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <ReportAnalytics />
              <QuickReportActions />
            </div>
          </TabsContent>

          <TabsContent value="predictive">
            <PredictiveAnalytics />
          </TabsContent>

          <TabsContent value="anomaly">
            <AnomalyDetection />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AIInsights;
