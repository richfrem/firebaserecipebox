
"use client";

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { GoogleIcon } from "@/components/icons"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function LoginPage() {
  const { signInWithGoogle, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);


  return (
    <div className="flex min-h-[calc(100vh-theme(spacing.14))] items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-3xl">Sign In</CardTitle>
          <CardDescription>Welcome back! Sign in to access your recipes.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
           <div className="flex flex-col gap-2">
             <Button variant="outline" onClick={signInWithGoogle}><GoogleIcon className="mr-2 h-5 w-5" /> Sign in with Google</Button>
           </div>
            <div className="flex items-center gap-4">
              <Separator className="flex-1" />
              <span className="text-xs text-muted-foreground">OR</span>
              <Separator className="flex-1" />
            </div>
            <p className="text-center text-sm text-muted-foreground">
                New to RecipeHub?{" "}
                <Button variant="link" className="p-0 h-auto" asChild>
                    <Link href="/subscribe">Create an account</Link>
                </Button>
            </p>
        </CardContent>
      </Card>
    </div>
  )
}
