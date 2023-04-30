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
import { LinkItem } from "./link-item";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";

type SheetOptions = {
  size: "lg" | "xl" | "default";
  position: "right" | "bottom";
};

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
    <div className="mt-6 grid">
      <table className="table w-full border-separate border-spacing-y-4 overflow-y-auto">
        <tbody>
          {links.map((link) => {
            return <LinkItem key={link.id} link={link} />;
          })}
        </tbody>
      </table>
    </div>
  );
};

export const LinkSheet = () => {
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

  return (
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
        <LinkList />
      </SheetContent>
    </Sheet>
  );
};
