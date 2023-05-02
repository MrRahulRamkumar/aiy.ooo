import { z } from "zod";
import cuid from "cuid";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import type { ShortLinkInsert } from "@/server/drizzleDb";
import { shortLink } from "@/server/drizzleDb";
import { eq, and, desc, not } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

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
      try {
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
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong.",
        });
      }
    }),

  createLinkWithSlug: protectedProcedure
    .input(
      z.object({
        url: z.string().url(),
        slug: z
          .string()
          .max(100)
          .transform((s) => s.trim())
          .optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (input.slug) {
        const existingSlug = await ctx.db
          .select()
          .from(shortLink)
          .where(eq(shortLink.slug, input.slug));
        if (existingSlug.length > 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Slug already exists.",
          });
        }
      }

      try {
        const id = cuid();
        const slug = input.slug || generateSlug();
        const newShortLink: ShortLinkInsert = {
          id,
          url: input.url,
          userId: ctx.session.user.id,
          slug,
        };

        await ctx.db.insert(shortLink).values(newShortLink);

        const [createdShortLink] = await ctx.db
          .select()
          .from(shortLink)
          .where(eq(shortLink.id, id));

        return createdShortLink;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong.",
        });
      }
    }),
  updateLink: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        url: z.string().url(),
        slug: z
          .string()
          .max(100)
          .transform((s) => s.trim())
          .optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        if (input.slug) {
          const existingSlug = await ctx.db
            .select()
            .from(shortLink)
            .where(
              and(
                eq(shortLink.slug, input.slug),
                not(eq(shortLink.id, input.id))
              )
            );
          if (existingSlug.length > 0) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Slug already exists.",
            });
          }
        }

        const slug = input.slug || generateSlug();
        await ctx.db
          .update(shortLink)
          .set({ url: input.url, slug: slug })
          .where(eq(shortLink.id, input.id));

        const [updatedLink] = await ctx.db
          .select()
          .from(shortLink)
          .where(
            and(
              eq(shortLink.id, input.id),
              eq(shortLink.userId, ctx.session.user.id)
            )
          );

        return updatedLink;
      } catch (e) {
        console.error(e);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong.",
        });
      }
    }),
  getLinks: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db
      .select()
      .from(shortLink)
      .where(eq(shortLink.userId, ctx.session.user.id))
      .orderBy(desc(shortLink.createdAt));
  }),
  deleteLink: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input, ctx }) => {
      try {
        return ctx.db
          .delete(shortLink)
          .where(
            and(
              eq(shortLink.id, input.id),
              eq(shortLink.userId, ctx.session.user.id)
            )
          );
      } catch (e) {
        console.error(e);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong.",
        });
      }
    }),
});
