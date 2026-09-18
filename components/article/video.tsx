export default function Video({
  src,
  autoplay = false,
  maxHeight,
  aspect,
  fit = "cover",
  position = "center",
}: {
  src: string;
  autoplay?: boolean;
  maxHeight?: number;
  aspect?: string;
  fit?: "cover" | "contain";
  position?: string;
}) {
  const constrained = Boolean(maxHeight || aspect);

  return (
    <figure className="my-6 overflow-hidden rounded-xl">
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
    </figure>
  );
}
