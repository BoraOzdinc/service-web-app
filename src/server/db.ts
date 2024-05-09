import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate"

import { env } from "~/env.js";

export const db =
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  }).$extends(withAccelerate());

