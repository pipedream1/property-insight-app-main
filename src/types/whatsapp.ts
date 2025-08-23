
export type WhatsappConfig = {
  id: number;
  phone_number: string;
  api_key: string;
  webhook_url: string;
  enable_auto_responder: boolean;
  auto_response: string | null;
  created_at: string;
}

export type WhatsappMessage = {
  id: string;
  from_number: string;
  from_name: string | null;
  to_number: string;
  content: string;
  direction: 'inbound' | 'outbound';
  status: 'sent' | 'delivered' | 'read' | 'failed';
  created_at: string;
}
