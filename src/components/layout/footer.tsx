
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Facebook, Twitter, Instagram, Linkedin, Send } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import LanguageCurrencySelector from './language-currency-selector';
import { useAuth } from '@/context/auth-provider';

const footerSections = [
  {
    title: 'Support',
    links: [
      { label: 'Help Center', href: '/contact-support' },
      { label: 'Contact Us', href: '/contact-support' },
      { label: 'FAQs', href: '/faq' },
      { label: 'Live Chat', href: '/live-chat' },
    ]
  },
  {
    title: 'Discover',
    links: [
      { label: 'Popular Destinations', href: '/stays/search' },
      { label: 'Travel Guides', href: '/community-forum-demo' },
      { label: 'Experiences & Activities', href: '/attractions' },
      { label: 'Travel Blog', href: '/community-forum-demo' },
    ]
  },
  {
    title: 'Terms & Settings',
    links: [
      { label: 'Terms of Service', href: '/trust-safety-demo' },
      { label: 'Privacy Policy', href: '/trust-safety-demo' },
      { label: 'Cookie Preferences', href: '/trust-safety-demo' },
    ]
  },
  {
    title: 'Partners',
    links: [
      { label: 'Become a Partner', href: '/for-partners' },
      { label: 'List Your Property', href: '/list-property', auth: true, noAuthHref: '/signup' },
      { label: 'Partner Dashboard', href: '/dashboard' },
      { label: 'Business Solutions', href: '/corporate-solutions-demo' },
    ]
  },
  {
    title: 'About',
    links: [
      { label: 'About RoamFree', href: '/about' },
      { label: 'Our Mission', href: '/our-mission' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press & Media', href: '/press-media' },
    ]
  }
];

export default function Footer() {
  const [currentYear, setCurrentYear] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    setCurrentYear(new Date().getFullYear().toString());
  }, []);
  
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Subscribed!", description: "Thank you for subscribing to our newsletter." });
  };

  const renderLinks = (links: typeof footerSections[0]['links']) => (
    <ul className="space-y-2">
      {links.map(link => {
        const href = (link.auth && !user && link.noAuthHref) ? link.noAuthHref : link.href;
        return (
          <li key={link.label}>
            <Link 
              href={href} 
              className="text-sm hover:text-primary hover:underline transition-colors"
            >
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );

  const renderMobileLinks = (links: typeof footerSections[0]['links']) => (
    <ul className="space-y-3 pl-2">
      {links.map(link => {
        const href = (link.auth && !user && link.noAuthHref) ? link.noAuthHref : link.href;
        return (
          <li key={link.label}>
            <Link 
              href={href} 
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );


  return (
    <footer className="bg-muted/50 border-t pt-12 pb-24 md:pb-8 mt-16 text-muted-foreground">
      <div className="container mx-auto px-4">
        {/* Desktop and Tablet View */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-5 gap-8">
          {footerSections.map(section => (
            <div key={section.title}>
              <h3 className="font-semibold text-foreground mb-4">{section.title}</h3>
                {renderLinks(section.links)}
                 {section.title === 'Terms & Settings' && (
                    <div className="mt-2">
                      <LanguageCurrencySelector isFooter={true} />
                    </div>
                 )}
            </div>
          ))}
        </div>

        {/* Mobile View (Accordion) */}
        <div className="md:hidden">
            <Accordion type="multiple" className="w-full">
                {footerSections.map(section => (
                    <AccordionItem value={section.title} key={section.title}>
                        <AccordionTrigger className="text-foreground font-semibold text-base hover:no-underline">{section.title}</AccordionTrigger>
                        <AccordionContent>
                           {renderMobileLinks(section.links)}
                             {section.title === 'Terms & Settings' && (
                                <div className="pl-2 mt-3">
                                  <LanguageCurrencySelector isFooter={true} />
                                </div>
                             )}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
        
        {/* Newsletter and Social Links */}
        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="w-full md:w-auto text-center md:text-left">
                <h4 className="font-semibold text-foreground mb-2">Stay Updated</h4>
                <p className="text-sm mb-3">Subscribe to our newsletter for deals and updates.</p>
                <form onSubmit={handleNewsletterSubmit} className="flex gap-2 max-w-sm mx-auto md:mx-0">
                    <Input type="email" placeholder="Enter your email" className="bg-background"/>
                    <Button type="submit" variant="default" size="icon" aria-label="Subscribe to newsletter">
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </div>
            <div className="flex items-center gap-4">
                <a href="#!" aria-label="Facebook" className="hover:text-primary transition-colors"><Facebook /></a>
                <a href="#!" aria-label="Twitter" className="hover:text-primary transition-colors"><Twitter /></a>
                <a href="#!" aria-label="Instagram" className="hover:text-primary transition-colors"><Instagram /></a>
                <a href="#!" aria-label="LinkedIn" className="hover:text-primary transition-colors"><Linkedin /></a>
            </div>
        </div>

        <div className="border-t mt-8 pt-6 text-center text-sm">
          <p>&copy; {currentYear} RoamFree. All rights reserved.</p>
          <p className="text-xs mt-1">Travel with freedom, explore with joy.</p>
        </div>
      </div>
    </footer>
  );
}
