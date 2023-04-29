import { z } from "zod";
import cuid from "cuid";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import type { ShortLinkInsert } from "@/server/drizzleDb";
import { shortLink } from "@/server/drizzleDb";
import { eq } from "drizzle-orm";

const generateSlug = () => {
  const alphabet =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let slug = "";
  for (let i = 0; i < 6; i++) {
    slug += alphabet[Math.floor(Math.random() * alphabet.length)];
  }

  return slug;
};

export const linkRouter = createTRPCRouter({
  createLink: publicProcedure
    .input(z.object({ url: z.string().url() }))
    .mutation(async ({ input, ctx }) => {
      console.log(input);
      const id = cuid();

      const newShortLink: ShortLinkInsert = {
        id,
        url: input.url,
        slug: generateSlug(),
      };

      await ctx.db.insert(shortLink).values(newShortLink);

      const [createdShortLink] = await ctx.db
        .select()
        .from(shortLink)
        .where(eq(shortLink.id, id));

      return createdShortLink;
    }),

  createLinkWithCustomSlug: protectedProcedure
    .input(z.object({ url: z.string().url(), slug: z.string().max(100) }))
    .query(({ ctx }) => {
      console.log(ctx.session);
      return "you can now see this secret message!";
    }),
});
