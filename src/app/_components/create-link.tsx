"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { ToastAction } from "~/components/ui/toast";
import { useToast } from "~/components/ui/use-toast";
import { signIn, signOut } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { api } from "~/trpc/react";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
type Form = {
  slug: string;
  url: string;
};
export function CreateLink({ status }: { status: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [form, setForm] = useState<Form>({ slug: "", url: "" });
  const [createLinkLoading, setCreateLinkLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [linkCreated, setLinkCreated] = useState(false);
  const [shortUrl, setShortUrl] = useState("");

  const onSuccess = (
    createdLink: { url: string; slug: string } | undefined,
  ) => {
    if (!createdLink) return;

    setShortUrl(`https://aiy.ooo/${createdLink.slug}`);
    setCreateLinkLoading(false);
    setLinkCreated(true);
    setForm({ slug: "", url: "" });
  };

  const onError = (error: { message: string | undefined }) => {
    let description = "Something went wrong";
    if (error.message && typeof error.message === "string") {
      description = error.message;
    }
    toast({
      variant: "destructive",
      title: "aiyooo!",
      description,
      action: <ToastAction altText="Okay">Okay</ToastAction>,
    });
    setCreateLinkLoading(false);
  };

  const { mutate: createLink } = api.link.createLink.useMutation({
    onSuccess: onSuccess,
    onError: onError,
  });

  const { mutate: createLinkWithSlug } =
    api.link.createLinkWithSlug.useMutation({
      onSuccess: onSuccess,
      onError: onError,
    });

  return (
    <main className="mx-6 flex min-h-screen flex-col items-center justify-center">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        aiyooo
      </h1>
      <p className="leading-7 [&:not(:first-child)]:mt-2">
        A blazingly fast link shortener
      </p>
      {status === "loading" && (
        <Loader2 className="mr-2 mt-4 h-8 w-8 animate-spin" />
      )}
      <form
        className="flex w-full flex-col items-center justify-center"
        onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          if (status === "authenticated") {
            setCreateLinkLoading(true);
            createLinkWithSlug(form);
          } else {
            setCreateLinkLoading(true);
            createLink(form);
          }
        }}
      >
        {status === "authenticated" && (
          <div className="mt-6 grid w-full max-w-sm items-center gap-1.5">
            <p className="max-w-sm overflow-hidden truncate text-sm text-muted-foreground">{`https://aiy.ooo/${form.slug}`}</p>
            <Input
              className="max-w-sm"
              onChange={(e) => {
                setForm({
                  ...form,
                  slug: e.target.value.trim(),
                });
              }}
              maxLength={100}
              value={form.slug}
              type="text"
              id="text"
            />
          </div>
        )}
        {status !== "loading" && (
          <div className="mt-6 flex w-full max-w-sm items-center space-x-2">
            <Input
              onChange={(e) => {
                setForm({
                  ...form,
                  url: e.target.value.trim(),
                });
              }}
              type="url"
              id="input"
              required
              value={form.url}
              placeholder="https://bing.com"
            />
            <Button type="submit" disabled={createLinkLoading}>
              {createLinkLoading && (
                <Loader2 className="mx-4 h-4 w-4 animate-spin" />
              )}
              {createLinkLoading ? "" : "Create"}
            </Button>
          </div>
        )}
      </form>
      {status === "unauthenticated" && (
        <div className="mt-12 grid w-full max-w-sm items-center gap-3">
          <Alert>
            <AlertTitle>Hey yoo!</AlertTitle>
            <AlertDescription>
              If you login, you can create and edit your links with custom
              slugs!
            </AlertDescription>
          </Alert>
          <Button
            disabled={loginLoading}
            onClick={() => {
              setLoginLoading(true);
              void signIn("google");
            }}
          >
            {loginLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loginLoading ? "Please Wait" : "Login with Google"}
          </Button>
        </div>
      )}
      {status === "authenticated" && (
        <div className="mt-12 grid w-full max-w-sm items-center gap-3">
          <Button
            disabled={loginLoading}
            variant="ghost"
            onClick={() => {
              setLoginLoading(true);
              void signOut();
            }}
          >
            {loginLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loginLoading ? "Please Wait" : "Sign Out"}
          </Button>
        </div>
      )}
    </main>
  );
}
