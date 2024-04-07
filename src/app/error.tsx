"use client"; // Error components must be Client Components

import { useEffect } from "react";
import { type IError } from "~/trpc/react";
import Unauthorized from "./_components/unauthorized";

export default function Error({
  error,
  reset,
}: {
  error: IError;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  if (error?.data?.code === "UNAUTHORIZED") {
    return (
      <div className="flex items-center justify-center">
        <Unauthorized />
      </div>
    );
  }

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  );
}
