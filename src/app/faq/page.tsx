
// src/app/faq/page.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';

const faqItems = [
  {
    question: "How do I book an accommodation?",
    answer: "To book an accommodation, simply use the search bar on the homepage or the 'Stays' section. Enter your destination, dates, and number of guests, then browse the results. Click on a listing for more details and use the 'Book Now' button to proceed. (Demo)"
  },
  {
    question: "What payment methods are accepted?",
    answer: "We accept major credit cards (Visa, MasterCard, American Express). We are also working on integrating options like PayPal, Apple Pay, Google Pay, and Buy Now, Pay Later services (e.g., Klarna, Afterpay). (Demo)"
  },
  {
    question: "How does the AI Trip Planner work?",
    answer: "Our AI Trip Planner uses a large language model. You provide your destination, duration, and preferences (like interests in history, food, adventure), and it generates a personalized day-by-day itinerary with suggested activities and sights. (Demo)"
  },
  {
    question: "Can I list my own property on RoamFree?",
    answer: "Yes! You can list your house, apartment, villa, or land for sale or rent. Navigate to the 'Owner Dashboard' (link in the header) and click 'Add New Listing' to get started. (Demo)"
  },
  {
    question: "What is the RoamFree Loyalty Program?",
    answer: "Our Loyalty Program allows you to earn points for every booking you make. These points can be redeemed for discounts on future bookings, upgrades, and other rewards. You can also earn bonus points by referring friends. Check the 'Loyalty' page in your profile for details. (Demo)"
  },
  {
    question: "Is there an SOS feature?",
    answer: "Yes, RoamFree includes an SOS button for urgent help or emergencies during your trips. You can find this button in the header and on the 'Contact Support' page. Activating it will simulate contacting emergency services. (Demo)"
  },
   {
    question: "How do I change or cancel a booking?",
    answer: "To change or cancel a booking, please go to your 'Booking History' in your profile. Select the booking you wish to modify. Cancellation policies vary by listing, so please review the terms before confirming changes. For immediate assistance, contact our support team. (Demo)"
  },
  {
    question: "Are there features for business travel?",
    answer: "Yes, we are developing 'RoamFree for Business' which will offer tools for companies, including group booking discounts, reporting tools, and centralized billing. Look for the 'RoamFree for Business' link for more information as it becomes available. (Demo)"
  }
];

export default function FAQPage() {
  return (
    <div className="space-y-8">
      <Card className="shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-primary/10">
          <CardTitle className="flex items-center gap-3 text-3xl font-headline text-primary">
            <HelpCircle className="h-10 w-10" />
            Frequently Asked Questions (FAQ)
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Find answers to common questions about RoamFree services and features. (Content is for Demo purposes)
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {faqItems.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger className="text-left hover:no-underline text-lg font-semibold">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-base">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <p className="text-muted-foreground">No FAQs available at the moment. Please check back later.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
    