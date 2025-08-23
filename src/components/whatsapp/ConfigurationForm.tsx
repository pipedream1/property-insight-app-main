
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Form schema
const formSchema = z.object({
  phoneNumber: z.string().min(10, { message: 'Phone number should have at least 10 digits' }),
  apiKey: z.string().min(1, { message: 'API key is required' }),
  webhookUrl: z.string().url({ message: 'Must be a valid URL' }),
  enableAutoResponder: z.boolean().default(false),
  autoResponse: z.string().optional(),
});

type ConfigurationFormProps = {
  isConfigured: boolean;
  onConfigSaved: () => void;
  initialData?: {
    phoneNumber: string;
    apiKey: string;
    webhookUrl: string;
    enableAutoResponder: boolean;
    autoResponse: string;
  };
};

export default function ConfigurationForm({ isConfigured, onConfigSaved, initialData }: ConfigurationFormProps) {
  const [isSaving, setIsSaving] = useState(false);

  // Form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      phoneNumber: '',
      apiKey: '',
      webhookUrl: '',
      enableAutoResponder: false,
      autoResponse: 'Thank you for your message. A representative will get back to you shortly.',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSaving(true);
    
    const { error } = await supabase
      .from('whatsapp_config')
      .upsert({
        id: 1, // Use a single row for configuration
        phone_number: values.phoneNumber,
        api_key: values.apiKey,
        webhook_url: values.webhookUrl,
        enable_auto_responder: values.enableAutoResponder,
        auto_response: values.autoResponse,
      });

    setIsSaving(false);
    
    if (error) {
      toast({
        title: "Error saving configuration",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Configuration saved",
        description: "WhatsApp integration settings have been updated.",
      });
      onConfigSaved();
    }
  }

  async function sendTestMessage() {
    toast({
      title: "Test message queued",
      description: "A test message will be sent via WhatsApp. This may take a moment.",
    });
    
    // In a real implementation, this would call a Supabase Edge Function
    // that integrates with the WhatsApp Business API
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="+27123456789" {...field} />
              </FormControl>
              <FormDescription>
                The WhatsApp-enabled phone number for your business account
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="apiKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>API Key</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormDescription>
                Your WhatsApp Business API key
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="webhookUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Webhook URL</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
              <FormDescription>
                URL where WhatsApp will send incoming message notifications
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator className="my-4" />

        <FormField
          control={form.control}
          name="enableAutoResponder"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  Automatic Responses
                </FormLabel>
                <FormDescription>
                  Automatically respond to new messages from residents
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {form.watch("enableAutoResponder") && (
          <FormField
            control={form.control}
            name="autoResponse"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Auto-response Message</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Thank you for your message. A representative will get back to you shortly."
                    className="min-h-[100px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="flex flex-col sm:flex-row gap-4 pt-2">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Configuration"}
          </Button>
          
          {isConfigured && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={sendTestMessage}
            >
              Send Test Message
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
