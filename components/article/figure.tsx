import Image from "next/image";

type FigureImage = {
  src: string;
  alt: string;
  label?: string;
};

const LAYOUTS: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-3",
  4: "grid-cols-2",
};

export default function Figure({ images, src, alt, caption, aspect, fit = "cover", position = "center", }: {
  images?: FigureImage[];
  src?: string;
  alt?: string;
  caption?: string;
  aspect?: string;
  fit?: "cover" | "contain";
  position?: string;
}) {
  const items: FigureImage[] =
    images ?? (src ? [{ src, alt: alt ?? "" }] : []);

  if (items.length === 0) return null;

  const count = Math.min(items.length, 4);
  const isSingle = count === 1;
  const ratio = aspect ?? (isSingle ? undefined : "16/9");

  return (
    <figure className="my-6">
      <div className={`grid gap-2 ${LAYOUTS[count]}`}>
        {items.slice(0, 4).map((image) => (
          <div key={image.src} className="flex flex-col gap-1.5">
            <div
              className="relative overflow-hidden rounded-xl border border-foreground/10 bg-foreground/3"
              style={ratio ? { aspectRatio: ratio } : undefined}
            >
              {ratio ? (
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes={
                    isSingle
                      ? "(min-width: 768px) 42rem, 100vw"
                      : "(min-width: 768px) 21rem, 100vw"
                  }
                  className="object-cover"
                  style={{ objectFit: fit, objectPosition: position }}
                  unoptimized
                />
              ) : (
                <Image src={image.src} alt={image.alt} width={1600} height={900} sizes="(min-width: 768px) 42rem, 100vw" className="h-auto w-full" unoptimized />
              )}
            </div>

            {image.label && (
              <span className="px-1 text-[10px] tracking-wide text-foreground/40">
                {image.label}
              </span>
            )}
          </div>
        ))}
      </div>

      {caption && (
        <figcaption className="mt-2 px-1 text-[10px] tracking-wide text-foreground/40">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
