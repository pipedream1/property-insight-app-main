
import { useState, useEffect } from 'react';
import { WhatsappConfig, WhatsappMessage } from '@/types/whatsapp';
import { supabase } from '@/integrations/supabase/client';

export function useWhatsAppData() {
  const [isConfigured, setIsConfigured] = useState(false);
  const [messages, setMessages] = useState<WhatsappMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      
      try {
        // Load configuration
        const { data: configData, error: configError } = await supabase
          .from('whatsapp_config')
          .select('*')
          .limit(1)
          .single();
        
        if (configError && configError.code !== 'PGRST116') {
          setError(configError.message);
        } else if (configData) {
          setIsConfigured(true);
        }
        
        // Load messages
        const { data: messagesData, error: messagesError } = await supabase
          .from('whatsapp_messages')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20);
        
        if (messagesError) {
          setError(messagesError.message);
        } else if (messagesData) {
          setMessages(messagesData as WhatsappMessage[]);
        }
      } catch (e) {
        setError('Failed to load WhatsApp data');
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return { isConfigured, messages, loading, error };
}
