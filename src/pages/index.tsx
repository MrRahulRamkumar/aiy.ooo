import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

import { api } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

type Form = {
  slug: string;
  url: string;
};

const Home: NextPage = () => {
  const [form, setForm] = useState<Form>({ slug: "", url: "" });

  return (
    <>
      <Head>
        <title>ayiooo</title>
        <meta name="description" content="Ultra fast link shortener" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          ayiooo
        </h1>
        <p className="leading-7 [&:not(:first-child)]:mt-2">
          A blazingly fast link shortener
        </p>
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
        <div className="mt-6 flex w-full max-w-sm items-center space-x-2">
          <Input type="url" id="input" placeholder="https://bing.com" />
          <Button type="submit">Create</Button>
        </div>
      </main>
    </>
  );
};

export default Home;
