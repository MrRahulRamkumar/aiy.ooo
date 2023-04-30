import { api } from "@/lib/api";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  DialogHeader,
  DialogFooter,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { useToast } from "../ui/use-toast";
import { ToastAction } from "../ui/toast";
import type { ShortLink } from "@/server/drizzleDb";
import { Label } from "../ui/label";

type EditForm = {
  id: string;
  slug: string;
  url: string;
};

export const EditLinkDialog: React.FC<{
  link: ShortLink;
  open: boolean;
  setOpen: (open: boolean) => void;
}> = ({ link, setOpen }) => {
  const { toast } = useToast();
  const context = api.useContext();

  const { mutate: editLink, isLoading } = api.link.updateLink.useMutation({
    onSuccess: () => {
      setOpen(false);
      toast({
        variant: "default",
        title: "hey yooo!",
        description: "Link saved successfully!",
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

  const [editForm, setEditForm] = useState<EditForm>({
    id: link.id,
    url: link.url,
    slug: link.slug,
  });

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit link</DialogTitle>
        <DialogDescription>
          {"Make changes to your link here. Click save when you're done."}
        </DialogDescription>
      </DialogHeader>
      <form
        onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          editLink(editForm);
        }}
      >
        <div className="grid gap-2 py-4">
          <div className="grid grid-cols-4 place-items-center items-center gap-0">
            <Label htmlFor="url" className="text-right">
              URL
            </Label>
            <Input
              id="url"
              type="url"
              value={editForm.url}
              className="col-span-3"
              onChange={(e) => {
                setEditForm({
                  ...editForm,
                  url: e.target.value,
                });
              }}
            />
          </div>
          <div className="grid grid-cols-4 place-items-center items-center gap-4">
            <Label htmlFor="slug" className="text-right">
              Slug
            </Label>
            <Input
              id="slug"
              value={editForm.slug}
              className="col-span-3"
              onChange={(e) => {
                setEditForm({
                  ...editForm,
                  slug: e.target.value,
                });
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" disabled={isLoading} className="sm:w-24">
            {isLoading && <Loader2 className="mx-4 h-4 w-4 animate-spin" />}
            {isLoading ? "" : "Save"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};
