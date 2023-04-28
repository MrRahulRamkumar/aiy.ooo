import { type NextPage } from "next";
import Head from "next/head";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { signIn, signOut, useSession } from "next-auth/react";
import { Mail } from "lucide-react";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@radix-ui/react-label";

type Form = {
  slug: string;
  url: string;
};

const LoginAlert: React.FC<{
  loading: boolean;
  setLoading: (loading: boolean) => void;
}> = ({ loading, setLoading }) => {
  return (
    <div className="mt-12 grid w-full max-w-sm items-center gap-3">
      <Alert>
        <AlertTitle>Hey yoo!</AlertTitle>
        <AlertDescription>
          If you login, you can create and edit your links with custom slugs and
          more!
        </AlertDescription>
      </Alert>
      {!loading && (
        <Button
          onClick={() => {
            setLoading(true);
            signIn("google");
          }}
          className="mt-6 w-full"
        >
          <Mail className="mr-2 h-4 w-4" />
          Login with Google
        </Button>
      )}
      {loading && (
        <Button className="mt-6 w-full" disabled>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Please wait
        </Button>
      )}
    </div>
  );
};

const UserAlert: React.FC<{ name: string | null | undefined }> = ({ name }) => {
  let title = "Hey yoo!";
  if (name) {
    const firstName = name.split(" ")[0];
    title = `Yoo ${firstName}!`;
  }

  return (
    <div className="mt-12 grid w-full max-w-sm items-center gap-3">
      <Button>View your Links</Button>
      <Button variant="ghost" onClick={() => signOut()}>
        Sign Out
      </Button>
    </div>
  );
};

const Home: NextPage = () => {
  const { data: sessionData } = useSession();
  const [form, setForm] = useState<Form>({ slug: "", url: "" });
  const [loading, setLoading] = useState(false);

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
        {sessionData && (
          <div className="mt-6 grid w-full max-w-sm items-center gap-1.5">
            <p className="text-sm text-muted-foreground">{`https://aiy.ooo/${form.slug}`}</p>
            <Input
              onChange={(e) => {
                setForm({
                  ...form,
                  slug: e.target.value.toLowerCase(),
                });
              }}
              type="text"
              id="text"
            />
          </div>
        )}
        <div className="mt-6 flex w-full max-w-sm items-center space-x-2">
          <Input type="url" id="input" placeholder="https://bing.com" />
          <Button type="submit">Create</Button>
        </div>
        {!sessionData && (
          <LoginAlert loading={loading} setLoading={setLoading} />
        )}
        {sessionData && <UserAlert name={sessionData.user.name} />}
      </main>
    </>
  );
};

export default Home;
