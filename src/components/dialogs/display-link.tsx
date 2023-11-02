import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "~/components/ui/dialog";
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";
import { ToastAction } from "../ui/toast";
import { Check, Copy } from "lucide-react";

export const DisplayLinkDialog: React.FC<{
  shortUrl: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}> = ({ open, setOpen, shortUrl }) => {
  const [copied, setCopied] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Hey yoo!</DialogTitle>
          <DialogDescription>
            Your link is ready. Click the button on the right to copy it.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="mt-6 flex w-full max-w-sm items-center space-x-2">
            <Input id="name" value={shortUrl} disabled />
            <Button
              type="submit"
              onClick={() => {
                void navigator.clipboard.writeText(shortUrl);
                toast({
                  title: "Hey yoo!",
                  description: "Link copied to clipboard!",
                  action: <ToastAction altText="Okay">Okay</ToastAction>,
                });
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
            >
              {!copied && <Copy className="mx-2 h-5 w-5" />}
              {copied && <Check className="mx-2 h-5 w-5" />}
            </Button>
          </div>
        </div>
        <DialogFooter>
          {/* <Button>Done</Button> */}
          <DialogClose asChild>
            <Button variant="outline" className="w-full">
              Done
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};