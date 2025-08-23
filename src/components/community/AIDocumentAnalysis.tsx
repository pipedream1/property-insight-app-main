
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bot, FileText, Brain, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export const AIDocumentAnalysis = () => {
  const [aiQuery, setAiQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Good day! I\'m Rutherford, your AI assistant. I have extensive knowledge of our official estate documents, municipal bylaws, and building regulations. I\'m here to assist you with any inquiries about our community standards and requirements. How may I be of service today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);

  const handleAIQuery = async (queryText?: string) => {
    const query = queryText || aiQuery;
    if (!query.trim()) return;

    console.log('AIDocumentAnalysis: Processing query directly:', query);

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: query,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setAiQuery('');
    setIsLoading(true);

    try {
      console.log('AIDocumentAnalysis: Calling supabase function directly');
      
      const { data, error } = await supabase.functions.invoke('resident-chatbot', {
        body: {
          message: query,
          conversationHistory: messages.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text
          })),
          documentOnly: true // Flag to limit to document access only
        }
      });

      if (error) {
        console.error('AIDocumentAnalysis: Supabase function error:', error);
        throw new Error(error.message);
      }

      if (!data || !data.reply) {
        console.error('AIDocumentAnalysis: No reply received from chatbot');
        throw new Error('No reply received from chatbot');
      }

      console.log('AIDocumentAnalysis: Received reply:', data.reply);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.reply,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('AIDocumentAnalysis: Error:', error);
      toast.error('I do apologize, but I\'m having trouble responding at the moment. Please try again.');
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'I do apologize, but I\'m experiencing technical difficulties. Please try again or contact the property management office.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedQuery = (query: string) => {
    console.log('AIDocumentAnalysis: Processing suggested query:', query);
    handleAIQuery(query);
  };

  const suggestedQueries = [
    "What are the building design requirements for new construction?",
    "What are the estate rules regarding pets?", 
    "How does the noise control bylaw affect residents?",
    "What are the waste management regulations?",
    "What building permits do I need for renovations?"
  ];

  return (
    <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 border-2 border-indigo-300 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-indigo-100 to-blue-100 border-b-2 border-indigo-200">
        <CardTitle className="flex items-center gap-2 text-indigo-800 text-lg font-bold">
          <Brain className="h-6 w-6" />
          🎩 Rutherford - Your AI Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-6">
        <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 rounded-r">
          <p className="text-sm text-indigo-800 font-medium">
            Ask Rutherford about our official documents, estate rules, municipal bylaws, and building regulations. 
            I have been trained on all 21+ official documents including the Building Design Manual and Knysna Municipality bylaws.
          </p>
        </div>
        
        {/* Chat Messages */}
        <div className="max-h-64 overflow-y-auto bg-white rounded-lg p-4 border-2 border-indigo-200 shadow-inner">
          <div className="space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${
                  message.sender === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  message.sender === 'user' 
                    ? 'bg-indigo-600 text-white border-indigo-700' 
                    : 'bg-gray-100 text-gray-700 border-gray-300'
                }`}>
                  {message.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                
                <div className={`max-w-[80%] p-3 rounded-lg text-sm shadow-sm ${
                  message.sender === 'user'
                    ? 'bg-indigo-600 text-white border border-indigo-700'
                    : 'bg-gray-50 text-gray-800 border border-gray-200'
                }`}>
                  <p className="whitespace-pre-wrap">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender === 'user' ?  'text-indigo-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 text-gray-700 border-2 border-gray-300 flex items-center justify-center">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex gap-2">
          <Input
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
            placeholder="e.g., What are the building height restrictions? May I install solar panels?"
            className="flex-1 border-2 border-indigo-200 focus:border-indigo-400"
            onKeyPress={(e) => e.key === 'Enter' && handleAIQuery()}
            disabled={isLoading}
          />
          <Button 
            onClick={() => handleAIQuery()} 
            disabled={!aiQuery.trim() || isLoading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white border-2 border-indigo-700"
          >
            <Bot className="h-4 w-4 mr-2" />
            Ask Rutherford
          </Button>
        </div>

        <div className="border-t-2 border-indigo-200 pt-3">
          <p className="text-xs text-indigo-700 mb-2 font-medium">💡 Suggested inquiries:</p>
          <div className="flex flex-wrap gap-1">
            {suggestedQueries.map((query, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className="text-xs h-auto p-2 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 hover:border-indigo-300"
                onClick={() => handleSuggestedQuery(query)}
                disabled={isLoading}
              >
                "{query}"
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-indigo-700 bg-indigo-100 p-3 rounded border-2 border-indigo-200">
          <FileText className="h-4 w-4" />
          <span className="font-medium">Rutherford has studied all 21+ documents including Building Design Manual, Estate Rules, and Knysna Municipality bylaws</span>
        </div>
      </CardContent>
    </Card>
  );
};
