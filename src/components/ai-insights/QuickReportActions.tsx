
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, DropletIcon, Building, Calendar, Download } from 'lucide-react';

export const QuickReportActions = () => {
  const quickActions = [
    {
      title: 'Generate Water Report',
      icon: <DropletIcon className="h-4 w-4" />,
      prompt: 'I want to generate a water usage report for the current month. Can you help me with this?',
      color: 'bg-blue-50 border-blue-200 hover:bg-blue-100'
    },
    {
      title: 'Component Status Report',
      icon: <Building className="h-4 w-4" />,
      prompt: 'Please help me create a component status report showing the condition of all property components.',
      color: 'bg-green-50 border-green-200 hover:bg-green-100'
    },
    {
      title: 'Custom Date Range Report',
      icon: <Calendar className="h-4 w-4" />,
      prompt: 'I need to create a custom report for a specific date range. Can you guide me through the process?',
      color: 'bg-purple-50 border-purple-200 hover:bg-purple-100'
    },
    {
      title: 'Download Recent Reports',
      icon: <Download className="h-4 w-4" />,
      prompt: 'How can I download my recent reports? Show me the available options.',
      color: 'bg-orange-50 border-orange-200 hover:bg-orange-100'
    }
  ];

  const handleQuickAction = (prompt: string) => {
    const event = new CustomEvent('triggerChatbot', { detail: { message: prompt } });
    window.dispatchEvent(event);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Quick Report Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Get instant help with common reporting tasks
        </p>
        
        <div className="grid gap-3">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className={`h-auto p-4 justify-start ${action.color}`}
              onClick={() => handleQuickAction(action.prompt)}
            >
              <div className="flex items-center gap-3">
                {action.icon}
                <span className="font-medium">{action.title}</span>
              </div>
            </Button>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-700">
            💡 Try asking: "Show me water usage trends for the last 3 months" or "What components need maintenance attention?"
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
