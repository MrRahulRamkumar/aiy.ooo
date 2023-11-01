import { z } from "zod";
import { createId } from "@paralleldrive/cuid2";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { shortLinks, users } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export const shortLinksRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: protectedProcedure
    .input(z.object({ slug: z.string().min(1), url: z.string().url() }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await ctx.db.insert(shortLinks).values({
        id: createId(),
        slug: input.slug,
        userId: ctx.session.user.id,
        url: input.url,
      });
    }),

  getUserInfo: protectedProcedure.query(async ({ ctx }) => {
    const link = await ctx.db.query.shortLinks.findMany({
      with: { user: true },
    });
    const user = await ctx.db.query.users.findFirst({
      where: eq(users.id, ctx.session.user.id),
      with: { shortLinks: true },
    });

    return user;
  }),
});
