import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { api } from "@/lib/api";
import { timeAgoFormatter } from "@/lib/utils";
import { SettingsMenu } from "./settings-menu";

const LinkList = () => {
  const { data: links, isLoading } = api.link.getLinks.useQuery();
  if (isLoading) {
    return (
      <div className="mt-6 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (!links || links.length === 0) {
    return (
      <div className="mt-8">
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
    <div className="mt-6">
       <ul className="divide-y">
        {links.map((link) => (
          <li key={link.id} className="flex justify-between gap-x-6 py-5">
            <div className="flex gap-x-4">
              <div className="min-w-0 flex-auto">
                <p className="text-md overflow-hidden truncate font-bold leading-6">
                  {link.slug}
                </p>
                <p className="mr-2 truncate text-ellipsis text-center text-sm font-medium leading-5 opacity-50">
                  {timeAgoFormatter(link.createdAt)}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end">
                <SettingsMenu link={link} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const LinkSheet = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>View your Links</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Your links</SheetTitle>
          <SheetDescription>View and edit your links</SheetDescription>
        </SheetHeader>
        <LinkList />
      </SheetContent>
    </Sheet>
  );
};
