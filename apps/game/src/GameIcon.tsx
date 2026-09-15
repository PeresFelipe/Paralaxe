import { getShikashiIconPath, type ShikashiIconName } from "./assetIcons";

type GameIconProps = {
  icon: ShikashiIconName | null | undefined;
  size?: number;
  className?: string;
  alt?: string;
};

export default function GameIcon({
  icon,
  size = 32,
  className,
  alt,
}: GameIconProps) {
  if (!icon) return null;

  return (
    <img
      className={className ? `game-icon ${className}` : "game-icon"}
      src={getShikashiIconPath(icon)}
      alt={alt ?? ""}
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      aria-hidden={alt ? undefined : true}
    />
  );
}
