import { type NextPage } from "next";
import Head from "next/head";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { signIn, signOut, useSession } from "next-auth/react";
import { Mail } from "lucide-react";
import { Loader2, Check, MoreVertical, Trash, Pencil } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import type { ShortLink } from "@/server/drizzleDb";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { timeAgoFormatter } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

type Form = {
  slug: string;
  url: string;
};

type SheetOptions = {
  size: "lg" | "xl" | "default";
  position: "right" | "bottom";
};

const EditDialog = () => {
  return (
    <Dialog>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            {"Make changes to your profile here. Click save when you're done."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" value="Pedro Duarte" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input id="username" value="@peduarte" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const SettingsMenu = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="m-0 p-2">
          <MoreVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem>
          <Pencil className="mr-2 h-4 w-4" />
          <span>Edit</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Trash className="mr-2 h-4 w-4 text-red-500" />
          <span className="text-red-500">Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const LinkItem: React.FC<{ url: string; slug: string; createdAt: Date }> = ({
  slug,
  createdAt,
}) => {
  return (
    <>
      <tr>
        <td>
          <div className="flex items-center space-x-3">
            <p className="w-20 overflow-hidden truncate text-base font-medium">
              {slug}
            </p>
          </div>
        </td>
        <td>
          <div className="grid grid-cols-1 gap-2">
            <div className="text-base opacity-50">
              {timeAgoFormatter(createdAt)}
            </div>
          </div>
        </td>
        <th>
          <SettingsMenu />
        </th>
      </tr>
    </>
  );
};

const Links = () => {
  const { data: links, isLoading } = api.link.getLinks.useQuery();
  console.log(links);

  if (isLoading) {
    return (
      <div className="mt-6 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (!links || links.length === 0) {
    return (
      <div className="mt-6">
        <Alert>
          <AlertTitle className="text-center">
            {"aiyoo! You don't have any links yet."}
          </AlertTitle>
          <AlertDescription className="mt-2 text-center">
            Create a link to see it in here.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="mt-6 grid">
      <EditDialog />
      <table className="table w-full border-separate border-spacing-y-4 overflow-y-auto">
        <tbody>
          {links.map((link) => {
            return (
              <LinkItem
                key={link.id}
                url={link.url}
                createdAt={link.createdAt}
                slug={link.slug}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const Home: NextPage = () => {
  const { toast } = useToast();
  const { status } = useSession();
  const [form, setForm] = useState<Form>({ slug: "", url: "" });
  const [createLinkLoading, setCreateLinkLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [linkCreated, setLinkCreated] = useState(false);
  const [sheetOptions, setSheetOptions] = useState<SheetOptions>({
    position: "right",
    size: "lg",
  });

  const updateSheetOptions = (width: number) => {
    if (width < 768) {
      setSheetOptions({
        position: "bottom",
        size: "xl",
      });
    } else if (width < 1280) {
      setSheetOptions({
        position: "right",
        size: "lg",
      });
    } else {
      setSheetOptions({
        position: "right",
        size: "default",
      });
    }
  };

  useEffect(() => {
    updateSheetOptions(window.innerWidth);
  }, []);

  // create an event listener
  useEffect(() => {
    window.addEventListener("resize", () =>
      updateSheetOptions(window.innerWidth)
    );
  });

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
            <Sheet>
              <SheetTrigger asChild>
                <Button>View your Links</Button>
              </SheetTrigger>
              <SheetContent
                className="overflow-auto"
                position={sheetOptions.position}
                size={sheetOptions.size}
              >
                <SheetHeader>
                  <SheetTitle>Your links</SheetTitle>
                  <SheetDescription>View and edit your links</SheetDescription>
                </SheetHeader>
                <Links />
              </SheetContent>
            </Sheet>
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
