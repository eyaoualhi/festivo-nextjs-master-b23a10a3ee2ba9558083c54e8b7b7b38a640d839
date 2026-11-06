import Image from "next/image";
import { getInitials } from "@/lib/format";

type AvatarProps = {
  userId: string;
  name: string;
  /** Version de la photo (D-32) ; sans version, les initiales remplacent la photo. */
  version?: number;
  /** Taille, arrondi et taille du texte, par exemple `size-12 rounded-2xl text-base`. */
  className?: string;
  /** Vide quand le nom est déjà écrit à côté de la photo. */
  alt?: string;
};

export default function Avatar({
  userId,
  name,
  version,
  className = "size-12 rounded-2xl text-base",
  alt = "",
}: AvatarProps) {
  if (version) {
    return (
      <Image
        src={`/api/avatars/${userId}?v=${version}`}
        alt={alt}
        width={256}
        height={256}
        // Déjà réduite à 256 px et en WebP : l'optimiseur d'images n'apporterait rien.
        unoptimized
        className={`shrink-0 bg-surface object-cover ${className}`}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center bg-primary font-bold text-paper ${className}`}
    >
      {getInitials(name) || name.charAt(0).toUpperCase()}
    </span>
  );
}
