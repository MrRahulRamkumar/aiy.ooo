import { z } from "zod";
import { createId } from "@paralleldrive/cuid2";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { shortLinks } from "~/server/db/schema";
import { type InferInsertModel, and, desc, eq, not } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
type ShortLinkInsert = InferInsertModel<typeof shortLinks>;

const generateSlug = () => {
  const alphabet =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let slug = "";
  for (let i = 0; i < 6; i++) {
    slug += alphabet[Math.floor(Math.random() * alphabet.length)];
  }

  return slug;
};

export const shortLinksRouter = createTRPCRouter({
  createLink: publicProcedure
    .input(z.object({ url: z.string().url() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const id = createId();

        const newShortLink: ShortLinkInsert = {
          id,
          url: input.url,
          slug: generateSlug(),
        };

        await ctx.db.insert(shortLinks).values(newShortLink);

        const [createdShortLink] = await ctx.db
          .select()
          .from(shortLinks)
          .where(eq(shortLinks.id, id));

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
      }),
    )
    .mutation(async ({ input, ctx }) => {
      if (input.slug) {
        const existingSlug = await ctx.db
          .select()
          .from(shortLinks)
          .where(eq(shortLinks.slug, input.slug));
        if (existingSlug.length > 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Slug already exists.",
          });
        }
      }

      try {
        const id = createId();
        const slug = input.slug ?? generateSlug();
        const newShortLink: ShortLinkInsert = {
          id,
          url: input.url,
          userId: ctx.session.user.id,
          slug,
        };

        await ctx.db.insert(shortLinks).values(newShortLink);

        const [createdShortLink] = await ctx.db
          .select()
          .from(shortLinks)
          .where(eq(shortLinks.id, id));

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
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        if (input.slug) {
          const existingSlug = await ctx.db
            .select()
            .from(shortLinks)
            .where(
              and(
                eq(shortLinks.slug, input.slug),
                not(eq(shortLinks.id, input.id)),
              ),
            );
          if (existingSlug.length > 0) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Slug already exists.",
            });
          }
        }

        const slug = input.slug ?? generateSlug();
        await ctx.db
          .update(shortLinks)
          .set({ url: input.url, slug: slug })
          .where(eq(shortLinks.id, input.id));

        const [updatedLink] = await ctx.db
          .select()
          .from(shortLinks)
          .where(
            and(
              eq(shortLinks.id, input.id),
              eq(shortLinks.userId, ctx.session.user.id),
            ),
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
      .from(shortLinks)
      .where(eq(shortLinks.userId, ctx.session.user.id))
      .orderBy(desc(shortLinks.createdAt));
  }),
  deleteLink: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input, ctx }) => {
      try {
        return ctx.db
          .delete(shortLinks)
          .where(
            and(
              eq(shortLinks.id, input.id),
              eq(shortLinks.userId, ctx.session.user.id),
            ),
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
