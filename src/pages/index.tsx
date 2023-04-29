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

type Form = {
  slug: string;
  url: string;
};

const Home: NextPage = () => {
  // const { toast } = useToast();
  const { status } = useSession();
  const [form, setForm] = useState<Form>({ slug: "", url: "" });
  const [loginLoading, setLoginLoading] = useState(false);
  const [linkCreated, setLinkCreated] = useState(false);

  const { mutate: createLink, isLoading: createLinkLoading } =
    api.link.createLink.useMutation({
      onSuccess: async (createdLink) => {
        if (!createdLink) return;

        const shortUrl = `https://aiy.ooo/${createdLink.slug}`;
        await navigator.clipboard.writeText(shortUrl);
        // toast({
        //   title: "Hey yoo!",
        //   description: "Link copied to clipboard!",
        //   action: <ToastAction altText="Okay">Okay</ToastAction>,
        // });
        setLinkCreated(true);
        setTimeout(() => {
          setLinkCreated(false);
        }, 2000);
        setForm({ slug: "", url: "" });
      },
      onError: () => {
        // toast({
        //   variant: "destructive",
        //   title: "aiyooo! Something went wrong.",
        //   description: "There was a problem with your request.",
        //   action: <ToastAction altText="Try again">Try again</ToastAction>,
        // });
        setForm({ slug: "", url: "" });
      },
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
              value={form.url}
              placeholder="https://bing.com"
            />
            <Button
              disabled={createLinkLoading || linkCreated}
              onClick={() => {
                console.log(form);
                if (status === "unauthenticated") {
                  createLink(form);
                }
              }}
            >
              {createLinkLoading && (
                <Loader2 className="mx-4 h-4 w-4 animate-spin" />
              )}
              {linkCreated && <Check className="mx-4 h-4 w-4" />}
              {createLinkLoading || linkCreated ? "" : "Create"}
            </Button>
          </div>
        )}
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
