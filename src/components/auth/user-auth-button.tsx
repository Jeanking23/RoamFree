import { Button } from '@/components/ui/button';
import { LogIn, UserCircle2 } from 'lucide-react';

// This is a placeholder. In a real app, you'd check authentication state.
const isAuthenticated = false; 

export default function UserAuthButton() {
  if (isAuthenticated) {
    return (
      <Button variant="ghost" className="gap-2">
        <UserCircle2 className="h-5 w-5" />
        Profile
      </Button>
    );
  }

  return (
    <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
      <LogIn className="h-5 w-5" />
      Login / Sign Up
    </Button>
  );
}
