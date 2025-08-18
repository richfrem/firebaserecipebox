
"use client";

import { ChefHat, PlusCircle, LogOut, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';

export default function Header() {
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <ChefHat className="h-6 w-6 text-primary" />
          <span className="font-bold font-headline text-2xl text-primary">RecipeHub</span>
        </Link>
        <div className="flex flex-1 items-center" />
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Button asChild>
                <Link href="/manage-recipe">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Recipe
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                   <Button variant="secondary" size="icon" className="rounded-full">
                    <Avatar>
                      <AvatarImage src={user.photoURL ?? undefined} alt={user.displayName ?? 'User'} />
                      <AvatarFallback>
                        <UserIcon />
                      </AvatarFallback>
                    </Avatar>
                   </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{user.displayName}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
