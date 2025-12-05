
// src/app/signin/page.tsx
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
import { Mail, Lock, LogIn } from 'lucide-react';
import { useState, useEffect } from 'react';
import { signIn, signInWithGoogle } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose, DialogTrigger } from '@/components/ui/dialog';
import { sendPasswordResetAction } from '@/app/actions';

const signInSchema = z.object({
  email: z.string().email('Invalid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

type SignInFormValues = z.infer<typeof signInSchema>;

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
});
type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;


function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            {...props}
        >
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            <path d="M1 1h22v22H1z" fill="none" />
        </svg>
    );
}

const slideshowImages = [
  { url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHx0cmF2ZWwlMjBtb3VudGFpbnN8ZW58MHx8fHwxNzUyODE0MTMwfDA&ixlib=rb-4.1.0&q=80&w=1080", hint: "travel mountains" },
  { url: "https://images.unsplash.com/photo-1507525428034-b723a9ce6890?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxiZWFjaCUyMHN1bnJpc2V8ZW58MHx8fHwxNzUyODE0MTMwfDA&ixlib=rb-4.1.0&q=80&w=1080", hint: "beach sunrise" },
  { url: "https://images.unsplash.com/photo-1477346611705-65d1883cee1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxtb3VudGFpbiUyMGxhbmRzY2FwZXxlbnwwfHx8fDE3NTI4MTQxMzB8MA&ixlib=rb-4.1.0&q=80&w=1080", hint: "mountain landscape" },
  { url: "https://images.unsplash.com/photo-1519010470956-6d877008eaa4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxjaXR5c2NhcGUlMjBhJ25pZ2h0fGVufDB8fHx8MTc1MjgwMzcwN3ww&ixlib=rb-4.1.0&q=80&w=1080", hint: "cityscape night" },
];

function ForgotPasswordDialog({ onOpenChange }: { onOpenChange: (open: boolean) => void }) {
  const [isSending, setIsSending] = useState(false);
  const forgotPasswordForm = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  async function onForgotPasswordSubmit(values: ForgotPasswordFormValues) {
    setIsSending(true);
    const result = await sendPasswordResetAction(values.email);
    setIsSending(false);

    if ('error' in result) {
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Password Reset Email Sent',
        description: 'Please check your inbox for instructions to reset your password.',
      });
      onOpenChange(false); // Close dialog on success
      forgotPasswordForm.reset();
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Forgot Password</DialogTitle>
        <DialogDescription>
          Enter your email address below and we'll send you a link to reset your password.
        </DialogDescription>
      </DialogHeader>
      <Form {...forgotPasswordForm}>
        <form onSubmit={forgotPasswordForm.handleSubmit(onForgotPasswordSubmit)} className="space-y-4 py-4">
          <FormField
            control={forgotPasswordForm.control}
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
          <DialogFooter>
            <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
            <Button type="submit" disabled={isSending}>
              {isSending ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    setHasMounted(true);
    const slideshowTimer = setInterval(() => {
      setCurrentImageIndex(prevIndex => (prevIndex + 1) % slideshowImages.length);
    }, 5000);
    return () => clearInterval(slideshowTimer);
  }, []);

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });

  async function onSubmit(values: SignInFormValues) {
    setIsLoading(true);
    const result = await signIn(values.email, values.password);
    setIsLoading(false);

    if ('error' in result) {
      toast({
        title: 'Sign In Failed',
        description: result.error,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Sign In Successful',
        description: "Welcome back!",
      });
      router.push('/');
    }
  }

  async function handleGoogleSignIn() {
    setIsLoading(true);
    const result = await signInWithGoogle();
    setIsLoading(false);

    if (result && 'error' in result) {
        toast({
            title: 'Google Sign-In Failed',
            description: result.error,
            variant: 'destructive',
        });
    } else {
        toast({
            title: 'Sign In Successful',
            description: 'Welcome!',
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
          <CardTitle className="text-3xl font-headline text-primary">Welcome Back</CardTitle>
          <CardDescription>Sign in to your RoamFree account</CardDescription>
        </CardHeader>
        <CardContent>
           <Button variant="outline" className="w-full mb-6" onClick={handleGoogleSignIn} disabled={isLoading}>
                <span><GoogleIcon className="mr-2 h-5 w-5" />
                Sign in with Google</span>
            </Button>
            <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border/50" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                </div>
            </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                     <div className="flex justify-between items-center">
                        <FormLabel>Password</FormLabel>
                        {hasMounted && (
                          <Dialog open={isForgotPasswordOpen} onOpenChange={setIsForgotPasswordOpen}>
                            <DialogTrigger asChild>
                              <button type="button" className="text-xs text-primary hover:underline">
                                  Forgot password?
                              </button>
                            </DialogTrigger>
                            <ForgotPasswordDialog onOpenChange={setIsForgotPasswordOpen} />
                          </Dialog>
                        )}
                    </div>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" icon={<Lock className="h-4 w-4 text-muted-foreground" />} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                <span className="flex items-center gap-2"><LogIn className="mr-2 h-4 w-4" />
                {isLoading ? 'Signing In...' : 'Sign In'}</span>
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link href="/signup" className="text-primary hover:underline">
                    Sign Up
                </Link>
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}

    