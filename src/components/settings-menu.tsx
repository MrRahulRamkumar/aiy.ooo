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
import { MoreVertical, Pencil, Trash } from "lucide-react";
import { EditLinkDialog } from "./dialogs/edit-link";
import { DeleteLinkDialog } from "./dialogs/delete-link";

export const SettingsMenu: React.FC<{ link: ShortLink }> = ({ link }) => {
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
