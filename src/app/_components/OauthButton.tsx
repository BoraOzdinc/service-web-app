"use client";

import { Button } from "./ui/button";
import { redirect, usePathname } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import React, { useState } from "react";
import type { Provider } from "@supabase/supabase-js";
import { createClient } from "../../utils/supabase/client";

const OauthButton: React.FC<{ provider: Provider }> = ({ provider }) => {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const supabase = createClient();

  const handleLogin = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: `${location.origin}/auth/confirm?next=${pathname}`,
      },
    });

    if (error) {
      return redirect("/login?message=Could not authenticate user");
    }
    setIsLoading(false);
  };

  if (provider === "google") {
    return (
      <Button
        variant="outline"
        isLoading={isLoading}
        disabled={isLoading}
        className="mb-2 w-full font-normal text-muted-foreground"
        onClick={() => handleLogin().catch(console.error)}
      >
        <div className="flex items-center gap-2">
          <FcGoogle className="h-5 w-5" />
          <p>Sign in with Google</p>
        </div>
      </Button>
    );
  }
};

export default OauthButton;
