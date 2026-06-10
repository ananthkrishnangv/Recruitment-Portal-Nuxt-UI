import { Avatar as HeroAvatar } from "@/components/ui/heroui";
import { cn } from "@/lib/utils";

type AvatarProps = {
  name: string;
  src?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

export function Avatar({ name, src, size = "md", className }: AvatarProps) {
  let color: any = "primary";
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colorIndex = Math.abs(hash) % 6;
  const colors = ["default", "primary", "secondary", "success", "warning", "danger"];
  color = colors[colorIndex];

  return (
    <HeroAvatar
      name={name}
      src={src}
      size={size}
      color={color}
      className={cn("ring-2 ring-white/20", className)}
    />
  );
}
