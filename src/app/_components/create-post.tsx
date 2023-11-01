"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { api } from "~/trpc/react";

export function CreatePost() {
  const router = useRouter();
  const [slug, setSlug] = useState("");
  const [url, setUrl] = useState("");

  const createShortLink = api.shortLinks.create.useMutation({
    onSuccess: () => {
      router.refresh();
      setSlug("");
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createShortLink.mutate({ slug: slug, url: url });
      }}
      className="flex flex-col gap-2"
    >
      <input
        type="text"
        placeholder="Slug"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        className="w-full rounded-full px-4 py-2 text-black"
      />
      <input
        type="text"
        placeholder="URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="w-full rounded-full px-4 py-2 text-black"
      />
      <button
        type="submit"
        className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
        disabled={createShortLink.isLoading}
      >
        {createShortLink.isLoading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
