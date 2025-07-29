
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
import { useState } from 'react';
import { createUser } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import Link from 'next/link';

const signUpSchema = z.object({
  email: z.string().email('Invalid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

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
    <div className="flex items-center justify-center min-h-screen bg-muted/30">
      <Card className="w-full max-w-md shadow-lg">
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
