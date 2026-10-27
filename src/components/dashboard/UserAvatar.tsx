import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/format";

interface UserAvatarProps {
  name: string | null | undefined;
  email?: string | null;
  image?: string | null;
  className?: string;
}

export default function UserAvatar({ name, email, image, className }: UserAvatarProps) {
  const label = name || email || "User";

  return (
    <Avatar className={className}>
      {image && <AvatarImage src={image} alt={label} />}
      <AvatarFallback className="bg-violet-600 text-xs text-white">
        {getInitials(label)}
      </AvatarFallback>
    </Avatar>
  );
}
