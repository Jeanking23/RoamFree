
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
import { useState } from 'react';
import { signIn } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import Link from 'next/link';

const signInSchema = z.object({
  email: z.string().email('Invalid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

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

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/30">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline text-primary">Welcome Back</CardTitle>
          <CardDescription>Sign in to your RoamFree account</CardDescription>
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
              <Button type="submit" disabled={isLoading} className="w-full">
                <LogIn className="mr-2 h-4 w-4" />
                {isLoading ? 'Signing In...' : 'Sign In'}
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
