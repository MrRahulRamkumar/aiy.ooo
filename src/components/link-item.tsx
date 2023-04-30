import { timeAgoFormatter } from "@/lib/utils";
import type { ShortLink } from "@/server/drizzleDb";
import { SettingsMenu } from "./settings-menu";

export const LinkItem: React.FC<{ link: ShortLink }> = ({ link }) => {
  return (
    <>
      <tr>
        <td>
          <div className="flex items-center space-x-3">
            <p className="w-20 overflow-hidden truncate text-base font-medium">
              {link.slug}
            </p>
          </div>
        </td>
        <td>
          <div className="grid grid-cols-1 gap-2">
            <div className="text-base opacity-50">
              {timeAgoFormatter(link.createdAt)}
            </div>
          </div>
        </td>
        <th>
          <SettingsMenu link={link} />
        </th>
      </tr>
    </>
  );
};
