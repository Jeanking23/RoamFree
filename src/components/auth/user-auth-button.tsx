import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { HelpCircle, Globe } from 'lucide-react';

// This component is being simplified as per the new header design.
// The "Register" and "Sign in" buttons are now directly in the header.
// This component can be repurposed or removed. For now, let's make it render the top-right utility links for mobile, or just be empty.

export default function UserAuthButton() {
  // The main auth buttons (Register, Sign In) are now directly in Header.tsx
  // This component could be used for a user profile dropdown once logged in,
  // or other account-related actions. For now, it's not rendering the old buttons.
  return null; 

  /*
  // Example of how it could be structured if needed for other purposes:
  return (
    <div className="flex items-center gap-4">
      <span className="text-sm font-medium text-white">USD</span>
      <button aria-label="Select language or currency" className="text-white">
        <Globe className="h-6 w-6" />
      </button>
      <button aria-label="Help" className="text-white">
        <HelpCircle className="h-6 w-6" />
      </button>
      <Link href="/list-property" className="text-sm font-medium text-white hover:bg-white/10 px-3 py-1.5 rounded-sm">
        List your property
      </Link>
      <Button
        variant="ghost"
        className="bg-white text-primary hover:bg-slate-100 px-3 h-9 rounded-sm text-sm font-medium border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
      >
        Register
      </Button>
      <Button
        variant="ghost"
        className="bg-white text-primary hover:bg-slate-100 px-3 h-9 rounded-sm text-sm font-medium border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
      >
        Sign in
      </Button>
    </div>
  );
  */
}
