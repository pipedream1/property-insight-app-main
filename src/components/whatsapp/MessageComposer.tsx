
import React, { useState, useRef, useEffect } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const formSchema = z.object({
  recipientNumber: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .refine(val => /^[0-9+\s()-]+$/.test(val), {
      message: "Phone number can only contain digits, +, spaces, (), and -"
    }),
  message: z.string()
    .min(1, 'Message cannot be empty')
    .max(1000, 'Message is too long (max 1000 characters)'),
});

type FormData = z.infer<typeof formSchema>;

export default function MessageComposer() {
  const { toast } = useToast();
  const [sending, setSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recipientNumber: '',
      message: '',
    },
  });

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [form.watch('message')]);

  async function onSubmit(data: FormData) {
    setSending(true);
    
    // Get WhatsApp config to use sender number
    const { data: configData, error: configError } = await supabase
      .from('whatsapp_config')
      .select('phone_number')
      .limit(1)
      .single();

    if (configError) {
      toast({
        title: "Configuration error",
        description: "Could not retrieve WhatsApp configuration. Please configure WhatsApp first.",
        variant: "destructive",
      });
      setSending(false);
      return;
    }

    // Standardize phone number format
    let recipientNumber = data.recipientNumber.replace(/\D/g, '');
    if (!recipientNumber.startsWith('+')) {
      recipientNumber = '+' + recipientNumber;
    }

    // Create new message
    const { error } = await supabase
      .from('whatsapp_messages')
      .insert({
        from_number: configData.phone_number,
        to_number: recipientNumber,
        content: data.message,
        direction: 'outbound',
        status: 'sent',
      });

    if (error) {
      toast({
        title: "Failed to send message",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Message sent",
        description: `Your message to ${recipientNumber} has been scheduled for delivery.`,
      });
      form.reset();
    }
    
    setSending(false);
  }

  return (
    <div className="border rounded-lg p-4 bg-card">
      <h3 className="text-lg font-medium mb-4">Send New Message</h3>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="recipientNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recipient's Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="+1234567890" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Type your message here..." 
                    className="min-h-[100px] resize-none"
                    ref={textareaRef}
                    {...field} 
                    onChange={(e) => {
                      field.onChange(e);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-end">
            <Button type="submit" disabled={sending}>
              <Send className="mr-2" size={16} />
              {sending ? 'Sending...' : 'Send Message'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
