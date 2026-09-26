"use client";

import { useState } from "react";

export function ImageGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [active, setActive] = useState(0);
  const safeImages = images.length > 0 ? images : [""];

  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-hidden rounded-xl bg-surface-container-low">
        <img
          src={safeImages[active]}
          alt={`${title} — image ${active + 1}`}
          className="h-[380px] w-full object-cover"
        />
      </div>
      {safeImages.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto">
          {safeImages.map((img, index) => (
            <button
              key={index}
              onClick={() => setActive(index)}
              className={`h-16 w-20 shrink-0 overflow-hidden rounded-lg transition-all ${
                index === active
                  ? "ring-2 ring-primary"
                  : "opacity-70 hover:opacity-100"
              }`}
            >
              <img
                src={img}
                alt={`${title} thumbnail ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
          <span className="ml-auto shrink-0 text-xs text-on-surface-variant">
            {active + 1} of {safeImages.length} photos
          </span>
        </div>
      )}
    </div>
  );
}