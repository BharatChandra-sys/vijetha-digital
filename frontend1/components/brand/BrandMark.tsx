import Image from 'next/image';

// The real logo on its own charcoal tile. It sits next to the name as text, so
// the image is decorative and the link keeps "Vijetha Digital" as its label.
export default function BrandMark({ size = 36 }: { size?: number }) {
  return (
    <Image
      src="/vd-logo.jpeg"
      alt=""
      width={size}
      height={size}
      className="vd-brandmark"
      style={{ width: size, height: size }}
    />
  );
}
