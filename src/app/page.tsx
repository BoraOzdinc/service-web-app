import { unstable_noStore as noStore } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "~/utils/supabase/server";
import { signOut } from "./login/actions";
import { Button } from "./_components/ui/button";

export default async function Home() {
  noStore();
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-12 px-4 py-16">
      <div className="flex flex-col items-center gap-2">
        <p className="text-2xl ">hello</p>

        <div className="flex flex-col items-center justify-center gap-4">
          <p className="text-center text-2xl text-white">
            {user && <span>Logged in as {user?.email}</span>}
          </p>
          <form>
            <Button formAction={signOut} type="submit">
              Signout
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
