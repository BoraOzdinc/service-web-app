import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";
import { auth } from "~/server/auth";

export default async function Home() {
  noStore();
  const session = await auth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-12 px-4 py-16">
      <div className="flex flex-col items-center gap-2">
        <p className="text-2xl ">hello</p>

        <div className="flex flex-col items-center justify-center gap-4">
          <p className="text-center text-2xl text-white">
            {session && <span>Logged in as {session.user?.name}</span>}
          </p>
          <Link
            href={session ? "/api/auth/signout" : "/api/auth/signin"}
            className="rounded-full bg-black px-10 py-3 font-semibold text-white no-underline transition"
          >
            {session ? "Sign out" : "Sign in"}
          </Link>
        </div>
      </div>
    </main>
  );
}
