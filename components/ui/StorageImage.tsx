"use client";

import Image from "next/image";
import { getPlaceholderImage, getStoragePublicUrl } from "@/lib/storage";
import { cn } from "@/lib/utils";

interface StorageImageProps {
  path: string;
  alt: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
}

export function StorageImage({
  path,
  alt,
  className,
  fill,
  width = 800,
  height = 600,
  priority,
}: StorageImageProps) {
  const storageUrl = getStoragePublicUrl(path);
  const src = storageUrl || getPlaceholderImage(alt);

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        className={cn("object-cover", className)}
        sizes="(max-width: 768px) 100vw, 640px"
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={cn("object-cover", className)}
    />
  );
}
