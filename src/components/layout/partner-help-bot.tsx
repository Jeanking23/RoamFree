
'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { AnimatePresence, motion } from 'framer-motion';
import { getSupportChatbotResponseAction } from '@/app/actions';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

export default function PartnerHelpBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: 'Hello! As a partner, how can I help you with listings, analytics, or payments today?' },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === '' || isLoading) return;

    const userMessage: Message = { sender: 'user', text: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    const result = await getSupportChatbotResponseAction({ 
      query: `As a RoamFree partner, I need help with the following: ${inputValue}` 
    });

    if ("error" in result) {
      setMessages(prev => [...prev, { sender: 'bot', text: `Sorry, an error occurred: ${result.error}` }]);
    } else {
      setMessages(prev => [...prev, { sender: 'bot', text: result.response }]);
    }
    setIsLoading(false);
  };
  
  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="absolute bottom-[calc(100%+1rem)] right-0"
            >
              <Card className="w-80 h-[28rem] flex flex-col shadow-2xl">
                <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
                  <div className="flex items-center gap-2">
                    <Bot className="h-6 w-6 text-primary" />
                    <CardTitle className="text-lg">Partner Help</CardTitle>
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsOpen(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="p-0 flex-1 overflow-hidden">
                  <ScrollArea className="h-full p-4">
                     <div className="space-y-3">
                        {messages.map((msg, index) => (
                        <div key={index} className={cn('flex', msg.sender === 'user' ? 'justify-end' : 'justify-start')}>
                            <div className={cn(
                                'max-w-[85%] rounded-lg px-3 py-2 text-sm',
                                msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                            )}>
                            {msg.text}
                            </div>
                        </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-muted rounded-lg px-3 py-2 flex items-center gap-1">
                                    <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse delay-0"></span>
                                    <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse delay-150"></span>
                                    <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse delay-300"></span>
                                </div>
                            </div>
                        )}
                     </div>
                  </ScrollArea>
                </CardContent>
                <form onSubmit={handleSendMessage} className="p-4 border-t flex items-center gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask a question..."
                    disabled={isLoading}
                  />
                  <Button type="submit" size="icon" disabled={isLoading}>
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </Button>
                </form>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
        <Button
          size="icon"
          className="rounded-full h-14 w-14 shadow-lg"
          onClick={() => setIsOpen(prev => !prev)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={isOpen ? 'close' : 'open'}
              initial={{ rotate: -90, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              exit={{ rotate: 90, scale: 0 }}
              transition={{ duration: 0.2 }}
            >
              {isOpen ? <X className="h-7 w-7" /> : <Bot className="h-7 w-7" />}
            </motion.div>
          </AnimatePresence>
        </Button>
      </div>
    </>
  );
}
