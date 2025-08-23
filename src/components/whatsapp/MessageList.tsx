
import React, { useState, useMemo } from 'react';
import { WhatsappMessage } from '@/types/whatsapp';
import MessageFilter from './MessageFilter';

type MessageListProps = {
  messages: WhatsappMessage[];
};

export default function MessageList({ messages }: MessageListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [directionFilter, setDirectionFilter] = useState('all');

  const filteredMessages = useMemo(() => {
    return messages.filter(message => {
      // Apply direction filter
      if (directionFilter !== 'all' && message.direction !== directionFilter) {
        return false;
      }
      
      // Apply search term filter (case insensitive)
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const content = message.content.toLowerCase();
        const fromNumber = message.from_number.toLowerCase();
        const toNumber = message.to_number.toLowerCase();
        const fromName = message.from_name?.toLowerCase() || '';
        
        return (
          content.includes(term) || 
          fromNumber.includes(term) || 
          toNumber.includes(term) ||
          fromName.includes(term)
        );
      }
      
      return true;
    });
  }, [messages, searchTerm, directionFilter]);

  if (messages.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        No messages yet. Messages will appear here once residents start contacting you via WhatsApp.
      </div>
    );
  }
  
  return (
    <div>
      <MessageFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        direction={directionFilter}
        onDirectionChange={setDirectionFilter}
      />
      
      {filteredMessages.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground border rounded-md bg-muted/10">
          No messages match your search criteria
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMessages.map((message) => (
            <div 
              key={message.id}
              className={`p-4 rounded-lg ${message.direction === 'inbound' ? 'bg-muted ml-8' : 'bg-primary/10 mr-8'}`}
            >
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">
                  {message.direction === 'inbound' ? message.from_name || message.from_number : 'Belvidere Estate'}
                </span>
                <span className="text-muted-foreground">
                  {new Date(message.created_at).toLocaleString()}
                </span>
              </div>
              <p>{message.content}</p>
            </div>
          ))}
        </div>
      )}
      
      {filteredMessages.length > 0 && filteredMessages.length < messages.length && (
        <div className="mt-4 text-sm text-center text-muted-foreground">
          Showing {filteredMessages.length} of {messages.length} messages
        </div>
      )}
    </div>
  );
}
