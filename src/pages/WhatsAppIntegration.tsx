
import React, { useState, useEffect } from 'react';
import TopNavigation from '@/components/TopNavigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useWhatsAppData } from '@/hooks/useWhatsAppData';
import ConfigurationForm from '@/components/whatsapp/ConfigurationForm';
import MessageList from '@/components/whatsapp/MessageList';
import MessageComposer from '@/components/whatsapp/MessageComposer';
import PlaceholderTab from '@/components/whatsapp/PlaceholderTab';
import { supabase } from '@/integrations/supabase/client';
import { BackButton } from '@/components/ui/back-button';

export default function WhatsAppIntegration() {
  const { isConfigured, messages, loading } = useWhatsAppData();
  const [configData, setConfigData] = useState<any>(null);

  useEffect(() => {
    async function loadConfigData() {
      if (isConfigured) {
        const { data } = await supabase
          .from('whatsapp_config')
          .select('*')
          .limit(1)
          .single();
        
        if (data) {
          setConfigData({
            phoneNumber: data.phone_number,
            apiKey: data.api_key,
            webhookUrl: data.webhook_url,
            enableAutoResponder: data.enable_auto_responder,
            autoResponse: data.auto_response || '',
          });
        }
      }
    }
    
    loadConfigData();
  }, [isConfigured]);

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigation />
      <main className="container mx-auto px-4 py-8">
        <BackButton />
        
        <div className="flex justify-center mb-6">
          <img src="/logo.png" alt="Belvidere Estate Logo" className="h-10 w-auto mr-3" />
          <h1 className="text-2xl font-bold">WhatsApp Integration</h1>
        </div>

        <Tabs defaultValue="configuration">
          <TabsList className="mb-4">
            <TabsTrigger value="configuration">Configuration</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="templates">Message Templates</TabsTrigger>
            <TabsTrigger value="broadcasts">Broadcasts</TabsTrigger>
          </TabsList>

          <TabsContent value="configuration">
            <Card>
              <CardHeader>
                <CardTitle>WhatsApp Business API Configuration</CardTitle>
                <CardDescription>
                  Connect the property management system to WhatsApp for resident communications.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">Loading configuration...</div>
                ) : (
                  <ConfigurationForm 
                    isConfigured={isConfigured} 
                    onConfigSaved={() => {}} 
                    initialData={configData}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages">
            <div className="space-y-6">
              {/* Message composer */}
              {isConfigured && (
                <Card>
                  <CardHeader>
                    <CardTitle>New Message</CardTitle>
                    <CardDescription>
                      Send a WhatsApp message to a resident
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <MessageComposer />
                  </CardContent>
                </Card>
              )}
              
              {/* Message list */}
              <Card>
                <CardHeader>
                  <CardTitle>WhatsApp Messages</CardTitle>
                  <CardDescription>
                    Recent messages received from and sent to residents
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8">Loading messages...</div>
                  ) : !isConfigured ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Configure WhatsApp integration first to view messages.
                    </div>
                  ) : (
                    <MessageList messages={messages} />
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="templates">
            <PlaceholderTab 
              title="Message Templates" 
              description="Create and manage reusable message templates for common communications"
              message="Template management features coming soon. Templates allow you to save and reuse common messages."
            />
          </TabsContent>

          <TabsContent value="broadcasts">
            <PlaceholderTab 
              title="Broadcast Messages" 
              description="Send announcements and alerts to multiple residents at once"
              message="Broadcast messaging features coming soon. This will allow you to send important announcements to residents."
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
