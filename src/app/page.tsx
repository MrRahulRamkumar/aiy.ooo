import { CreateLink } from "~/app/_components/create-link";
import { auth } from "~/server/auth";
import { api } from "~/trpc/server";

export default async function Home() {
  const session = await auth();

  return (
    <div>
      <CrudShowcase />
      <CreateLink
        status={session?.user ? "authenticated" : "unauthenticated"}
      />
    </div>
  );
}

async function CrudShowcase() {
  const session = await auth();
  if (!session?.user) return null;

  const shortLinks = await api.link.getLinks.query();

  return (
    <div className="w-full max-w-xs p-16">
      <div>
        {shortLinks.map((shortLink) => (
          <div key={shortLink.id} className="flex gap-2">
            <p>{shortLink.slug}</p>
            <p>{shortLink.url}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
