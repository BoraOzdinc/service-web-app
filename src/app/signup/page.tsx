"use client";
import Link from "next/link";
import { Button } from "../_components/ui/button";
import { Input } from "../_components/ui/input";
import { signup } from "../login/actions";
import { Label } from "../_components/ui/label";
import OauthButton from "../_components/OauthButton";
import { useState } from "react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="w-full p-0 lg:grid lg:min-h-[600px]  xl:min-h-screen">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Sign Up</h1>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>
          <Button
            type="submit"
            onClick={() => signup({ email, password })}
            className="w-full"
          >
            SignUp
          </Button>
          <OauthButton provider="google" />
          <div className="mt-4 text-center text-sm">
            Have an account?{" "}
            <Link href="/login" className="underline">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
