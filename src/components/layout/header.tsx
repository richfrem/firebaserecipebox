import { ChefHat, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Header() {
  // Mock authentication state
  const isAuthenticated = true;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <ChefHat className="h-6 w-6 text-primary" />
          <span className="font-bold font-headline text-2xl text-primary">RecipeHub</span>
        </Link>
        <nav className="flex flex-1 items-center space-x-6 text-sm font-medium">
          {/* Add more nav links here if needed */}
        </nav>
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Button asChild>
                <Link href="/manage-recipe">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Recipe
                </Link>
              </Button>
              {/* Future user dropdown can go here */}
            </>
          ) : (
            <Button asChild variant="secondary">
              <Link href="/login">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
