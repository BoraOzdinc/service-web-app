import Link from "next/link";
import { Button } from "../_components/ui/button";
import { Input } from "../_components/ui/input";
import { login, signup, loginWithGoogle } from "./actions";
import { Label } from "../_components/ui/label";
import OauthButton from "../_components/OauthButton";

export default function LoginPage() {
  return (
    <div className="w-full p-0 lg:grid lg:min-h-[600px] xl:min-h-screen">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
          <form className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" formAction={login} className="w-full">
              Login
            </Button>
          </form>
          <OauthButton provider="google" />
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
  return (
    <>
      <form className="flex flex-col gap-5">
        <label htmlFor="email">Email:</label>
        <Input id="email" name="email" type="email" required />
        <label htmlFor="password">Password:</label>
        <Input id="password" name="password" type="password" required />
        <Button formAction={login}>Log in</Button>
        <Button formAction={signup}>Sign up</Button>
      </form>
      <Button formAction={loginWithGoogle} type="submit">
        Log in with Google
      </Button>
    </>
  );
}
