
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Headset, Mail, MessageSquare, User, Phone, HelpCircleIcon } from "lucide-react";
import Link from "next/link";

const contactSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  subject: z.string().min(5, "Subject must be at least 5 characters.").max(100),
  message: z.string().min(20, "Message must be at least 20 characters.").max(1000),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactSupportPage() {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fullName: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  function onSubmit(data: ContactFormValues) {
    console.log("Contact Form Submitted:", data);
    // Here you would typically send data to your backend (e.g., email service, CRM)
    alert("Your message has been sent! Check console for data. We'll get back to you soon.");
    form.reset();
  }

  return (
    <div className="space-y-8">
      <Card className="shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-primary/10">
          <CardTitle className="flex items-center gap-3 text-3xl font-headline text-primary">
            <Headset className="h-8 w-8" />
            Customer Service
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            We're here to help! Reach out to us with any questions or concerns.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Send us a Message</h3>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1"><User className="h-4 w-4 text-primary" />Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1"><Mail className="h-4 w-4 text-primary" />Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="you@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1"><MessageSquare className="h-4 w-4 text-primary" />Subject</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Issue with booking #12345" {...field} />
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
                        <FormLabel>Your Message</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Please describe your issue or question in detail..."
                            rows={5}
                            {...field}
                          />
                        </FormControl>
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
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" /> Call Us
                </h3>
                <p className="text-muted-foreground">
                  For urgent matters, you can call us directly:
                </p>
                <p className="text-lg font-semibold text-primary mt-1">1-800-ROAMFREE (1-800-762-6373)</p>
                <p className="text-sm text-muted-foreground">(Available 9 AM - 6 PM, Mon-Fri)</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2 flex items-center gap-2">
                  <HelpCircleIcon className="h-5 w-5 text-primary" /> FAQs & Self-Help
                </h3>
                <p className="text-muted-foreground">
                  Many common questions are answered in our FAQ section.
                </p>
                <Button variant="outline" className="mt-2" asChild>
                  <Link href="/faq">Visit our FAQ Page</Link>
                </Button>
                 <p className="text-sm text-muted-foreground mt-1">(FAQ page coming soon!)</p>
              </div>
               <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Our Office</h3>
                <p className="text-muted-foreground">
                  RoamFree Headquarters<br />
                  123 Travel Lane<br />
                  Adventure City, AC 54321
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
