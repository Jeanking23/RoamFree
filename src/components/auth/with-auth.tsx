
'use client';

import { useAuth } from '@/context/auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function WithAuth(props: P) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        router.push('/signin');
      }
    }, [user, loading, router]);

    if (loading || !user) {
      return <div className="flex justify-center items-center h-screen">Loading...</div>; // Or a spinner component
    }

    return <Component {...props} />;
  };
}
