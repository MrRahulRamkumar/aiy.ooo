import type { ShortLink } from "@/server/drizzleDb";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";
import { ToastAction } from "../ui/toast";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

export const DeleteLinkDialog: React.FC<{
  link: ShortLink;
  open: boolean;
  setOpen: (open: boolean) => void;
}> = ({ link, setOpen }) => {
  const context = api.useContext();
  const { toast } = useToast();

  const { mutate: deleteLink, isLoading } = api.link.deleteLink.useMutation({
    onSuccess: () => {
      setOpen(false);
      toast({
        variant: "default",
        title: "hey yooo!",
        description: "Link deleted successfully!",
        action: <ToastAction altText="Okay">Okay</ToastAction>,
      });
      void context.link.getLinks.invalidate();
    },
    onError: (error) => {
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
    },
  });

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Are you sure absolutely sure?</DialogTitle>
        <DialogDescription>
          This action cannot be undone. Are you sure you want to permanently
          delete this link from our servers?
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button
          disabled={isLoading}
          className="sm:w-24"
          variant="destructive"
          type="submit"
          onClick={() => {
            deleteLink({ id: link.id });
          }}
        >
          {isLoading && <Loader2 className="mx-4 h-4 w-4 animate-spin" />}
          {isLoading ? "" : "Confirm"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};
