import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AppleIcon, GoogleIcon, MicrosoftIcon } from "@/components/icons"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-theme(spacing.14))] items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-3xl">Welcome Back!</CardTitle>
          <CardDescription>Sign in to continue to RecipeHub</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full">Sign In</Button>
          <div className="relative w-full">
            <Separator className="absolute top-1/2 -translate-y-1/2" />
            <p className="relative bg-card text-center text-sm text-muted-foreground px-2">OR CONTINUE WITH</p>
          </div>
           <div className="grid grid-cols-3 gap-2 w-full">
              <Button variant="outline"><GoogleIcon className="h-5 w-5" /></Button>
              <Button variant="outline"><MicrosoftIcon className="h-5 w-5" /></Button>
              <Button variant="outline"><AppleIcon className="h-5 w-5" /></Button>
           </div>
          <div className="text-sm text-muted-foreground">
            <Link href="#" className="underline hover:text-primary">
                Forgot your password?
            </Link>
          </div>
           <div className="text-sm text-muted-foreground">
             Don&apos;t have an account?{" "}
             <Link href="#" className="underline hover:text-primary">
                Sign up
             </Link>
           </div>
        </CardFooter>
      </Card>
    </div>
  )
}
