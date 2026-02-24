// src/app/live-chat/page.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, MessageCircle, Bot } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Message {
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

export default function LiveChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Initialize with a welcome message on the client to avoid hydration mismatch
    setMessages([
      {
        sender: 'bot',
        text: "Hello! Welcome to RoamFree Live Support. How can I assist you today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isBotTyping]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;

    const userMessage: Message = {
      sender: 'user',
      text: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsBotTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        sender: 'bot',
        text: "Thank you for your message. This is a demo of our live chat system. A human agent would typically respond here within a few moments. For immediate assistance, please check our FAQ or contact us via the main support page.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setIsBotTyping(false);
      setMessages(prev => [...prev, botResponse]);
      toast({ title: "New Message", description: "A support agent has replied."});
    }, 1500);
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-lg rounded-lg overflow-hidden h-[75vh] flex flex-col">
        <CardHeader className="bg-primary/10">
          <CardTitle className="flex items-center gap-3 text-3xl font-headline text-primary">
            <MessageCircle className="h-8 w-8" />
            Live Chat Support
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            This is a demonstration of the live chat feature.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
              {msg.sender === 'bot' && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback><Bot className="h-5 w-5"/></AvatarFallback>
                </Avatar>
              )}
              <div className={`max-w-[70%] p-3 rounded-lg ${msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                <p className="text-sm">{msg.text}</p>
                <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{msg.timestamp}</p>
              </div>
            </div>
          ))}
           {isBotTyping && (
            <div className="flex items-end gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback><Bot className="h-5 w-5"/></AvatarFallback>
                </Avatar>
                <div className="max-w-[70%] p-3 rounded-lg bg-muted flex items-center gap-1">
                    <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse delay-0"></span>
                    <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse delay-150"></span>
                    <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse delay-300"></span>
                </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </CardContent>
        <CardFooter className="p-4 border-t bg-background">
          <form onSubmit={handleSendMessage} className="flex w-full items-center gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message here..."
              autoComplete="off"
            />
            <Button type="submit" size="icon" disabled={isBotTyping}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
