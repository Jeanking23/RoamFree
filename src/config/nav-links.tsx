
import { Home, Info, Mail, Phone, Users } from "lucide-react";

export const mainNavLinks = [
    { href: "/stays", label: "Stays" },
    { href: "/transport", label: "Transport" },
    { href: "/tours", label: "Tours" },
    { href: "/for-partners", label: "For Partners" },
];

export const secondaryNavLinks = [
    { href: "/about", label: "About Us", icon: <Info /> },
    { href: "/community", label: "Community", icon: <Users /> },
    { href: "/contact", label: "Contact Us", icon: <Mail /> },
];

export const footerLinks = [
    { 
        title: "Company", 
        links: [
            { label: "About Us", href: "/about" },
            { label: "Careers", href: "/careers" },
            { label: "Press & Media", href: "/press-media" },
            { label: "Our Mission", href: "/our-mission" },
        ]
    },
    {
        title: "Platform",
        links: [
            { label: "Browse Stays", href: "/stays" },
            { label: "Browse Transport", href: "/transport" },
            { label: "Browse Tours", href: "/tours" },
            { label: "List a Property", href: "/list-property" },
        ]
    },
    {
        title: "Resources",
        links: [
            { label: "Community Forum", href: "/community-forum-demo" },
            { label: "Trust & Safety", href: "/trust-safety-demo" },
            { label: "Partner Help", href: "/for-partners#help" },
            { label: "Contact Support", href: "/contact-support" },
        ]
    },
];

export const socialLinks = [
    { name: "Facebook", href: "#" },
    { name: "Twitter", href: "#" },
    { name: "Instagram", href: "#" },
    { name: "LinkedIn", href: "#" },
];
