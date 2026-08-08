/**
 * Hidden SEO Content Component
 * Renders SEO-rich content that's hidden from users but visible to search engines
 * Uses screen-reader-only styling (accessible but visually hidden)
 */

interface HiddenSEOContentProps {
  content: string | string[];
}

export default function HiddenSEOContent({ content }: HiddenSEOContentProps) {
  const textContent = Array.isArray(content) ? content.join(' ') : content;

  return (
    <div
      className="sr-only"
      aria-hidden="true"
      style={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: 0,
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        border: 0,
      }}
    >
      {textContent}
    </div>
  );
}
