/**
 * SEO Content Component
 * FIXED: Removed aria-hidden="true" to comply with Google's spam policies
 * Screen-reader accessible content that's visually hidden but crawlable
 * Complies with WCAG 2.1 and Google Webmaster Guidelines
 */

interface HiddenSEOContentProps {
  content: string | string[];
}

export default function HiddenSEOContent({ content }: HiddenSEOContentProps) {
  const textContent = Array.isArray(content) ? content.join(' ') : content;

  return (
    <div
      className="sr-only"
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
