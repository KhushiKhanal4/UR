import Image from "next/image";

/** Percent-based crop box from Figma ("image inside frame" with offset/scale). */
export type Crop = { top: string; left: string; width: string; height: string };

/**
 * Renders an image inside a clipping frame exactly as Figma crops it,
 * while still going through next/image for responsive, modern-format delivery.
 */
export function CroppedImage({
  src,
  alt,
  crop,
  sizes,
  className = "",
}: {
  src: string;
  alt: string;
  crop?: Crop;
  sizes: string;
  className?: string;
}) {
  // the frame must be positioned to clip the image; keep the caller's own position if it sets one
  const position = /(^|\s)(absolute|fixed|sticky)(\s|$)/.test(className) ? "" : "relative ";
  return (
    <div className={`${position}overflow-hidden ${className}`}>
      {crop ? (
        <div className="absolute" style={crop}>
          <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
        </div>
      ) : (
        <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
      )}
    </div>
  );
}
