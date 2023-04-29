import { type NextPage } from "next";
import Head from "next/head";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { signIn, signOut, useSession } from "next-auth/react";
import { Mail } from "lucide-react";
import { Loader2, Check } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import type { ShortLink } from "@/server/drizzleDb";

type Form = {
  slug: string;
  url: string;
};

const Home: NextPage = () => {
  const { toast } = useToast();
  const { status } = useSession();
  const [form, setForm] = useState<Form>({ slug: "", url: "" });
  const [createLinkLoading, setCreateLinkLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [linkCreated, setLinkCreated] = useState(false);

  const onSuccess = async (createdLink: ShortLink | undefined) => {
    if (!createdLink) return;

    const shortUrl = `https://aiy.ooo/${createdLink.slug}`;
    await navigator.clipboard.writeText(shortUrl);
    toast({
      title: "Hey yoo!",
      description: "Link copied to clipboard!",
      action: <ToastAction altText="Okay">Okay</ToastAction>,
    });
    setCreateLinkLoading(false);
    setLinkCreated(true);
    setTimeout(() => {
      setLinkCreated(false);
    }, 2000);
    setForm({ slug: "", url: "" });
  };

  const onError = (error: { message: string | undefined }) => {
    let description = "Something went wrong";
    if (
      error.message &&
      typeof error.message === "string" &&
      error.message !== "Unexpected end of JSON input"
    ) {
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
    <>
      <Head>
        <title>aiyooo</title>
        <meta name="description" content="Ultra fast link shortener" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
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
              <p className="text-sm text-muted-foreground">{`https://aiy.ooo/${form.slug}`}</p>
              <Input
                onChange={(e) => {
                  setForm({
                    ...form,
                    slug: e.target.value.toLowerCase(),
                  });
                }}
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
                    url: e.target.value.toLowerCase(),
                  });
                }}
                type="url"
                id="input"
                required
                value={form.url}
                placeholder="https://bing.com"
              />
              <Button type="submit" disabled={createLinkLoading || linkCreated}>
                {createLinkLoading && (
                  <Loader2 className="mx-4 h-4 w-4 animate-spin" />
                )}
                {linkCreated && <Check className="mx-4 h-4 w-4" />}
                {createLinkLoading || linkCreated ? "" : "Create"}
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
                slugs and more!
              </AlertDescription>
            </Alert>
            {!loginLoading && (
              <Button
                onClick={() => {
                  setLoginLoading(true);
                  void signIn("google");
                }}
                className="w-full"
              >
                <Mail className="mr-2 h-4 w-4" />
                Login with Google
              </Button>
            )}
            {loginLoading && (
              <Button className="w-full" disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            )}
          </div>
        )}
        {status === "authenticated" && (
          <div className="mt-12 grid w-full max-w-sm items-center gap-3">
            <Button>View your Links</Button>
            {!loginLoading && (
              <Button
                variant="ghost"
                onClick={() => {
                  setLoginLoading(true);
                  void signOut();
                }}
              >
                Sign Out
              </Button>
            )}
            {loginLoading && (
              <Button variant="ghost" className="w-full" disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            )}
          </div>
        )}
      </main>
    </>
  );
};

export default Home;
