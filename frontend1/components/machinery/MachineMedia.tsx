'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';

interface Props {
  image: string;
  alt: string;
  video?: string;
  sizes: string;
  priority?: boolean;
  position?: string;
}

/** Photo, or a muted looping clip that plays only while on screen. */
export default function MachineMedia({ image, alt, video, sizes, priority, position = 'center' }: Props) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (video) {
    return (
      <video
        ref={ref}
        className="vd-media-fill"
        src={video}
        poster={image}
        muted
        loop
        playsInline
        preload="none"
        aria-label={alt}
        style={{ objectPosition: position }}
      />
    );
  }

  return (
    <Image
      src={image}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      quality={78}
      style={{ objectFit: 'cover', objectPosition: position }}
    />
  );
}
