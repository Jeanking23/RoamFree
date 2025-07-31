
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Mail, Lock, UserPlus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createUser } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const signUpSchema = z.object({
  email: z.string().email('Invalid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

const slideshowImages = [
  { url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHx0cmF2ZWwlMjBtb3VudGFpbnN8ZW58MHx8fHwxNzUyODE0MTMwfDA&ixlib=rb-4.1.0&q=80&w=1080", hint: "travel mountains" },
  { url: "https://images.unsplash.com/photo-1507525428034-b723a9ce6890?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxiZWFjaCUyMHN1bnJpc2V8ZW58MHx8fHwxNzUyODE0MTMwfDA&ixlib=rb-4.1.0&q=80&w=1080", hint: "beach sunrise" },
  { url: "https://images.unsplash.com/photo-1477346611705-65d1883cee1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxtb3VudGFpbiUyMGxhbmRzY2FwZXxlbnwwfHx8fDE3NTI4MTQxMzB8MA&ixlib=rb-4.1.0&q=80&w=1080", hint: "mountain landscape" },
  { url: "https://images.unsplash.com/photo-1519010470956-6d877008eaa4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxjaXR5c2NhcGUlMjBhJ25pZ2h0fGVufDB8fHx8MTc1MjgwMzcwN3ww&ixlib=rb-4.1.0&q=80&w=1080", hint: "cityscape night" },
];

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const slideshowTimer = setInterval(() => {
      setCurrentImageIndex(prevIndex => (prevIndex + 1) % slideshowImages.length);
    }, 5000);
    return () => clearInterval(slideshowTimer);
  }, []);

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  });

  async function onSubmit(values: SignUpFormValues) {
    setIsLoading(true);
    const result = await createUser(values.email, values.password);
    setIsLoading(false);

    if ('error' in result) {
      toast({
        title: 'Sign Up Failed',
        description: result.error,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Account Created',
        description: 'Welcome! You have been signed in.',
      });
      router.push('/');
    }
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-background overflow-hidden">
       <AnimatePresence>
        <motion.div
          key={currentImageIndex}
          className="absolute inset-0 z-0"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        >
          <Image 
            src={slideshowImages[currentImageIndex].url}
            alt="RoamFree background" 
            fill
            className="object-cover"
            data-ai-hint={slideshowImages[currentImageIndex].hint}
            priority
          />
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 bg-black/50 z-10"></div>
      <Card className="w-full max-w-md shadow-lg z-20 bg-background/80 backdrop-blur-sm border-border/50">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline text-primary">Create an Account</CardTitle>
          <CardDescription>Join RoamFree to start your next adventure</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" icon={<Mail className="h-4 w-4 text-muted-foreground" />} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" icon={<Lock className="h-4 w-4 text-muted-foreground" />} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" icon={<Lock className="h-4 w-4 text-muted-foreground" />} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                <UserPlus className="mr-2 h-4 w-4" />
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
          </Form>
        </CardContent>
         <CardFooter className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link href="/signin" className="text-primary hover:underline">
                    Sign In
                </Link>
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}
