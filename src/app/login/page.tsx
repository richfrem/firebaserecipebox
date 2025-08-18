
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
import { AppleIcon, GoogleIcon, MicrosoftIcon } from "@/components/icons"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { signInWithGoogle, signInWithMicrosoft, user } = useAuth();
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
          <CardDescription>Choose your preferred provider to continue</CardDescription>
        </CardHeader>
        <CardContent>
           <div className="flex flex-col gap-4">
              <Button variant="outline" onClick={signInWithGoogle}><GoogleIcon className="mr-2 h-5 w-5" /> Sign in with Google</Button>
              <Button variant="outline" onClick={signInWithMicrosoft}><MicrosoftIcon className="mr-2 h-5 w-5" /> Sign in with Microsoft</Button>
           </div>
        </CardContent>
      </Card>
    </div>
  )
}
