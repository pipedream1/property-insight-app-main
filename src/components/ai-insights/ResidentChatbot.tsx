
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, MessageCircle, User, Bot, Brain, Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export const ResidentChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Good day! I\'m Rutherford, your dedicated English AI assistant. I have comprehensive knowledge of all Belvidere Estate documents, Knysna Municipality regulations, and complete access to all property data including:\n\n📋 Document Analysis - Building codes, estate rules, bylaws\n🔧 Maintenance Records - All tasks, photos, and component inspections\n💧 Water Data - Readings, usage patterns, and reservoir levels\n📊 Property Analytics - Complete inspection history and trends\n\nHow may I be of service today? Perhaps you\'d like to ask: "What maintenance tasks are pending?" or "Show me recent water usage trends?"',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'connected' | 'failed'>('unknown');
  const [lastError, setLastError] = useState<string | null>(null);

  // Listen for custom events from other components
  useEffect(() => {
    const handleTriggerChatbot = (event: CustomEvent) => {
      console.log('ResidentChatbot: Received triggerChatbot event:', event.detail);
      const { message } = event.detail;
      if (message) {
        console.log('ResidentChatbot: Setting input message and auto-sending:', message);
        setInputMessage(message);
        // Auto-send the message after a short delay
        setTimeout(() => {
          sendMessage(message);
        }, 100);
      }
    };

    console.log('ResidentChatbot: Adding event listener for triggerChatbot');
    window.addEventListener('triggerChatbot', handleTriggerChatbot as EventListener);
    
    return () => {
      console.log('ResidentChatbot: Removing event listener for triggerChatbot');
      window.removeEventListener('triggerChatbot', handleTriggerChatbot as EventListener);
    };
  }, []);

  const testConnection = async () => {
    setIsTestingConnection(true);
    setLastError(null);
    try {
      console.log('Testing Edge Function connection...');
      
      const { data, error } = await supabase.functions.invoke('resident-chatbot', {
        body: {
          testConnection: true
        }
      });

      console.log('Edge Function response:', { data, error });

      if (error) {
        console.error('Edge Function error:', error);
        setConnectionStatus('failed');
        setLastError(error.message);
        toast.error(`Connection test failed: ${error.message}`);
        
        const errorMessage: Message = {
          id: Date.now().toString(),
          text: `❌ Connection test failed: ${error.message}. Please check the API configuration.`,
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
        return;
      }

      console.log('Connection test result:', data);

      if (data && data.success) {
        setConnectionStatus('connected');
        setLastError(null);
        toast.success(`✅ API connected! Models available: ${data.modelsCount}`);
        
        const connectionMessage: Message = {
          id: Date.now().toString(),
          text: `✅ Connection test successful! Enhanced analytics now available with ${data.modelsCount} AI models at your service.`,
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, connectionMessage]);
      } else {
        setConnectionStatus('failed');
        setLastError(data?.error || 'Unknown error');
        toast.error(`❌ API connection failed: ${data?.error || 'Unknown error'}`);
        
        const errorMessage: Message = {
          id: Date.now().toString(),
          text: `❌ Connection test failed: ${data?.error || 'Unknown error'}. ${data?.details || 'Please check the API key configuration.'}`,
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Connection test error:', error);
      setConnectionStatus('failed');
      setLastError(error.message);
      toast.error('Connection test failed');
      
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: `❌ Connection test failed: ${error.message}. Please check your network connection and try again.`,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTestingConnection(false);
    }
  };

  const sendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputMessage;
    if (!textToSend.trim()) return;

    console.log('ResidentChatbot: Sending message:', textToSend);

    const userMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setLastError(null);

    try {
      console.log('ResidentChatbot: Calling supabase function with message:', textToSend);
      
      const conversationHistory = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));

      console.log('ResidentChatbot: About to invoke resident-chatbot function');
      console.log('ResidentChatbot: Supabase client available:', !!supabase);
      console.log('ResidentChatbot: Functions available:', !!supabase.functions);

      const { data, error } = await supabase.functions.invoke('resident-chatbot', {
        body: {
          message: textToSend,
          conversationHistory
        }
      });

      console.log('ResidentChatbot: Function invocation complete');
      console.log('ResidentChatbot: Data received:', data);
      console.log('ResidentChatbot: Error received:', error);

      if (error) {
        console.error('ResidentChatbot: Supabase function error:', error);
        setLastError(error.message);
        throw new Error(error.message);
      }

      if (!data || !data.reply) {
        console.error('ResidentChatbot: No reply received from chatbot');
        const errorMsg = 'No reply received from chatbot';
        setLastError(errorMsg);
        throw new Error(errorMsg);
      }

      console.log('ResidentChatbot: Received reply:', data.reply);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.reply,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setConnectionStatus('connected');
      setLastError(null);
    } catch (error) {
      console.error('ResidentChatbot: Error:', error);
      setConnectionStatus('failed');
      setLastError(error.message);
      toast.error(`I do apologize, but I'm experiencing technical difficulties: ${error.message}`);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `I do apologize, but I'm experiencing technical difficulties: ${error.message}. Please try again or contact the property management office.`,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getConnectionIcon = () => {
    if (connectionStatus === 'connected') return <Wifi className="h-4 w-4 text-green-600" />;
    if (connectionStatus === 'failed') return <WifiOff className="h-4 w-4 text-red-600" />;
    return <Wifi className="h-4 w-4 text-gray-400" />;
  };

  const getConnectionColor = () => {
    if (connectionStatus === 'connected') return 'text-green-600';
    if (connectionStatus === 'failed') return 'text-red-600';
    return 'text-gray-400';
  };

  const suggestedQuestions = [
    "What maintenance tasks require attention?",
    "Show me recent water usage patterns",
    "What components need inspection?",
    "What are the building design requirements?",
    "Generate a summary of recent property activities"
  ];

  return (
    <Card className="h-[700px] flex flex-col border-4 border-orange-500 shadow-lg">
      <CardHeader className="bg-orange-50 border-b border-orange-200">
        <CardTitle className="flex items-center justify-between text-orange-700">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Rutherford - Your AI Assistant
          </div>
          <div className="flex items-center gap-2">
            {getConnectionIcon()}
            <Button
              onClick={testConnection}
              disabled={isTestingConnection}
              size="sm"
              variant="outline"
              className="text-xs border-orange-300 hover:bg-orange-100"
            >
              {isTestingConnection ? 'Testing...' : 'Test API'}
            </Button>
          </div>
        </CardTitle>
        <div className="flex items-center justify-between">
          <p className="text-sm text-orange-600">
            Advanced analytics, complete data access, and intelligent insights at your service
          </p>
          <div className="flex items-center gap-2">
            <p className={`text-xs ${getConnectionColor()}`}>
              {connectionStatus === 'connected' && '● Connected'}
              {connectionStatus === 'failed' && '● Connection Failed'}
              {connectionStatus === 'unknown' && '● Unknown'}
            </p>
            {lastError && (
              <div className="relative group">
                <AlertCircle className="h-4 w-4 text-red-500 cursor-help" />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {lastError}
                </div>
              </div>
            )}
          </div>
        </div>
        {lastError && (
          <div className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200 mt-2">
            <strong>Last Error:</strong> {lastError}
          </div>
        )}
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${
                  message.sender === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.sender === 'user' 
                    ? 'bg-orange-100 text-orange-600' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {message.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                
                <div className={`max-w-[80%] p-3 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender === 'user' ? 'text-orange-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="p-4 border-t bg-orange-50">
          {/* Suggested questions */}
          <div className="mb-3">
            <p className="text-xs text-orange-600 mb-2 font-medium">Suggested inquiries:</p>
            <div className="flex flex-wrap gap-1">
              {suggestedQuestions.slice(0, 3).map((question, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className="text-xs h-auto p-1 text-orange-600 hover:bg-orange-100 border border-orange-200"
                  onClick={() => sendMessage(question)}
                  disabled={isLoading}
                >
                  "{question}"
                </Button>
              ))}
            </div>
          </div>
          
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="How may I assist you with property management, analytics, or data insights?"
              disabled={isLoading}
              className="flex-1 border-orange-300 focus:border-orange-500"
            />
            <Button 
              onClick={() => sendMessage()} 
              disabled={!inputMessage.trim() || isLoading}
              size="icon"
              className="bg-orange-600 hover:bg-orange-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-orange-600 mt-2">
            🎩 Rutherford at your service with complete data access, analytics, and professional recommendations!
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
