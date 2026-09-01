export default function Video({
  src,
  caption,
  autoplay = false,
  maxHeight,
  aspect,
  fit = "cover",
  position = "center",
}: {
  src: string;
  caption?: string;
  autoplay?: boolean;
  maxHeight?: number;
  aspect?: string;
  fit?: "cover" | "contain";
  position?: string;
}) {
  const constrained = Boolean(maxHeight || aspect);

  return (
    <figure className="my-6 overflow-hidden rounded-xl border border-foreground/10">
      <div
        className="relative w-full bg-black/20"
        style={{
          aspectRatio: aspect,
          maxHeight: maxHeight ? `${maxHeight}px` : undefined,
        }}
      >
        <video
          src={src}
          playsInline
          preload="metadata"
          className={constrained ? "h-full w-full" : "w-full"}
          style={
            constrained
              ? { objectFit: fit, objectPosition: position }
              : undefined
          }
          {...(autoplay
            ? { autoPlay: true, muted: true, loop: true }
            : { controls: true })}
        />
      </div>

      {caption && (
        <figcaption className="border-t border-foreground/10 px-4 py-2 text-[10px] tracking-wide text-foreground/40">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
