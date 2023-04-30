import type { ShortLink } from "@/server/drizzleDb";
import { useState } from "react";
import { Dialog, DialogTrigger } from "./ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { MoreVertical, Pencil, Trash, Copy } from "lucide-react";
import { EditLinkDialog } from "./dialogs/edit-link";
import { DeleteLinkDialog } from "./dialogs/delete-link";
import { ToastAction } from "./ui/toast";
import { useToast } from "./ui/use-toast";

export const SettingsMenu: React.FC<{ link: ShortLink }> = ({ link }) => {
  const { toast } = useToast();
  const [action, setAction] = useState<"edit" | "delete">("delete");
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="m-0 p-2">
            <MoreVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuItem
            onClick={() => {
              const shortUrl = `https://aiy.ooo/${link.slug}`;
              void navigator.clipboard.writeText(shortUrl);
              toast({
                title: "Hey yoo!",
                description: "Link copied to clipboard!",
                action: <ToastAction altText="Okay">Okay</ToastAction>,
              });
            }}
          >
            <Copy className="mr-2 h-4 w-4" />
            <span>Copy</span>
          </DropdownMenuItem>
          <DialogTrigger asChild>
            <DropdownMenuItem onClick={() => setAction("edit")}>
              <Pencil className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogTrigger asChild>
            <DropdownMenuItem onClick={() => setAction("delete")}>
              <Trash className="mr-2 h-4 w-4 text-red-500" />
              <span className="text-red-500">Delete</span>
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      {action === "edit" && (
        <EditLinkDialog open={open} setOpen={setOpen} link={link} />
      )}
      {action === "delete" && (
        <DeleteLinkDialog open={open} setOpen={setOpen} link={link} />
      )}
    </Dialog>
  );
};
