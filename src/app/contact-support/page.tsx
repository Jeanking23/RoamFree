
'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Headset, Mail, MessageSquare, User, Phone, HelpCircleIcon, Bot, Send, ShieldAlert, Info } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { getSupportChatbotResponseAction } from "../actions"; 
import type { SupportChatbotOutput } from "@/ai/flows/support-chatbot-flow"; 
import { toast } from "@/hooks/use-toast";
import { useLocale } from "@/context/locale-provider";

const contactSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  subject: z.string().min(5, "Subject must be at least 5 characters.").max(100),
  message: z.string().min(20, "Message must be at least 20 characters.").max(1000),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const chatbotSchema = z.object({
  userQuery: z.string().min(5, "Query must be at least 5 characters.").max(500),
});
type ChatbotFormValues = z.infer<typeof chatbotSchema>;

const translations = {
  sosTitle: {
    'en-US': 'SOS Activated (Demo)',
    'es-ES': 'SOS Activado (Demo)',
    'fr-FR': 'SOS Activé (Démo)',
  },
  sosDescription: {
    'en-US': 'Emergency services are being contacted. This is a simulation. If this were a real emergency, appropriate actions would be taken.',
    'es-ES': 'Se está contactando a los servicios de emergencia. Esto es una simulación. Si fuera una emergencia real, se tomarían las acciones apropiadas.',
    'fr-FR': "Les services d'urgence sont en cours de contact. Ceci est une simulation. S'il s'agissait d'une véritable urgence, des mesures appropriées seraient prises.",
  }
};

export default function ContactSupportPage() {
  const { language } = useLocale();

  const t = (key: keyof typeof translations) => {
    const langCode = language.code as keyof typeof translations[keyof typeof translations];
    return translations[key][langCode] || translations[key]['en-US'];
  };

  const contactForm = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { fullName: "", email: "", subject: "", message: "" },
  });

  const chatbotForm = useForm<ChatbotFormValues>({
    resolver: zodResolver(chatbotSchema),
    defaultValues: { userQuery: "" },
  });

  const [chatHistory, setChatHistory] = useState<{ sender: 'user' | 'bot'; text: string }[]>([]);
  const [isBotLoading, setIsBotLoading] = useState(false);
  const [botError, setBotError] = useState<string | undefined>(undefined);

  function onContactSubmit(data: ContactFormValues) {
    console.log("Contact Form Submitted:", data);
    toast({ title: "Message Sent! (Demo)", description: "Your message has been submitted. We'll get back to you soon."});
    contactForm.reset();
  }

  async function onChatbotSubmit(data: ChatbotFormValues) {
    setIsBotLoading(true);
    setBotError(undefined);
    setChatHistory(prev => [...prev, { sender: 'user', text: data.userQuery }]);
    
    const result = await getSupportChatbotResponseAction({ query: data.userQuery });
    
    if ("error" in result) {
      setBotError(result.error);
      setChatHistory(prev => [...prev, { sender: 'bot', text: `Error: ${result.error}` }]);
    } else {
      setChatHistory(prev => [...prev, { sender: 'bot', text: result.response }]);
    }
    setIsBotLoading(false);
    chatbotForm.reset();
  }

  const handleSosClick = () => {
    toast({
      title: t('sosTitle'),
      description: t('sosDescription'),
      variant: "destructive",
      duration: 10000, 
    });
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-primary/10">
          <CardTitle className="flex items-center gap-3 text-3xl font-headline text-primary">
            <Headset className="h-8 w-8" />
            Customer Service
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            We're here to help! Reach out via message, chat with our AI Assistant, or use emergency SOS.
            AI Smart Fraud Detection is always active to protect your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Send us a Message</h3>
              <Form {...contactForm}>
                <form onSubmit={contactForm.handleSubmit(onContactSubmit)} className="space-y-6">
                  <FormField
                    control={contactForm.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1"><User className="h-4 w-4 text-primary" />Full Name</FormLabel>
                        <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={contactForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1"><Mail className="h-4 w-4 text-primary" />Email Address</FormLabel>
                        <FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={contactForm.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1"><MessageSquare className="h-4 w-4 text-primary" />Subject</FormLabel>
                        <FormControl><Input placeholder="e.g., Issue with booking #12345" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={contactForm.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Message</FormLabel>
                        <FormControl><Textarea placeholder="Please describe your issue or question in detail..." rows={5} {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                    Send Message
                  </Button>
                </form>
              </Form>
            </div>

            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Bot className="h-6 w-6 text-primary" /> AI Personal Travel Assistant</CardTitle>
                  <CardDescription>Get instant help for planning, booking, adjusting trips, or general support from our AI.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 overflow-y-auto border rounded-md p-3 mb-4 space-y-2 bg-muted/30">
                    {chatHistory.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">Ask the AI assistant a question to start...</p>}
                    {chatHistory.map((chat, index) => (
                      <div key={index} className={`flex ${chat.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-2 rounded-lg max-w-[80%] ${chat.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                          <p className="text-sm whitespace-pre-line">{chat.text}</p>
                        </div>
                      </div>
                    ))}
                    {isBotLoading && <p className="text-sm text-muted-foreground">Bot is typing...</p>}
                  </div>
                  <Form {...chatbotForm}>
                    <form onSubmit={chatbotForm.handleSubmit(onChatbotSubmit)} className="flex gap-2 items-start">
                      <FormField
                        control={chatbotForm.control}
                        name="userQuery"
                        render={({ field }) => (
                          <FormItem className="flex-grow">
                            <FormControl><Textarea placeholder="Type your question here..." rows={1} className="min-h-[40px]" {...field} /></FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" disabled={isBotLoading} size="icon" className="h-10 w-10 shrink-0">
                        <Send className="h-5 w-5" />
                      </Button>
                    </form>
                  </Form>
                  {botError && <p className="text-sm text-destructive mt-2">{botError}</p>}
                </CardContent>
              </Card>

              <Card className="border-destructive">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-destructive"><ShieldAlert className="h-6 w-6" /> Emergency SOS</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">For urgent help or emergencies during your trip, use the SOS feature. This is a simulated feature for demo purposes.</p>
                  <Button variant="destructive" className="w-full" onClick={handleSosClick}>
                    Activate SOS
                  </Button>
                </CardContent>
              </Card>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Phone className="h-5 w-5 text-primary" /> Call Us
                  </h3>
                  <p className="text-muted-foreground">For urgent matters: <span className="text-lg font-semibold text-primary">1-800-ROAMFREE</span></p>
                  <p className="text-sm text-muted-foreground">(Available 9 AM - 6 PM, Mon-Fri)</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2 flex items-center gap-2">
                    <HelpCircleIcon className="h-5 w-5 text-primary" /> FAQs & Self-Help
                  </h3>
                  <p className="text-muted-foreground">Many common questions are answered in our FAQ section.</p>
                  <Button variant="outline" className="mt-2" asChild>
                    <Link href="/faq">Visit our FAQ Page (Demo)</Link>
                  </Button>
                </div>
                 <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Info className="h-5 w-5 text-primary" /> Trust & Safety
                  </h3>
                  <p className="text-muted-foreground">Learn about our security measures, including Blockchain verification for property (Future Feature) and cultural travel advisories.</p>
                  <Button variant="link" className="mt-1 px-0" asChild>
                    <Link href="/trust-safety-demo">Learn More (Demo)</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
