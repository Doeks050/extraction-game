"use client";

import { useState } from "react";

type ItemImageProps = {
  src?: string;
  alt: string;
  fallback: string;
  className?: string;
  imageClassName?: string;
};

export function ItemImage({
  src,
  alt,
  fallback,
  className = "",
  imageClassName = "",
}: ItemImageProps) {
  const [hasImageError, setHasImageError] = useState(false);
  const shouldShowImage = Boolean(src) && !hasImageError;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {shouldShowImage ? (
        <img
          src={src}
          alt={alt}
          draggable={false}
          onError={() => setHasImageError(true)}
          className={`h-full w-full object-contain ${imageClassName}`}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-center font-black uppercase text-zinc-500">
          {fallback}
        </div>
      )}
    </div>
  );
}
