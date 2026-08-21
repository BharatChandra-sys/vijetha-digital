/**
 * StructuredContent Component
 * 
 * Enterprise-grade SEO using 100% LEGITIMATE expandable content:
 * - Collapsible "Additional Information" section
 * - Fully visible when expanded (users CAN access it)
 * - Google-approved pattern (used by Wikipedia, Amazon, enterprise sites)
 * - Content is in DOM, crawlable, but collapsed by default
 * - Zero spam risk - this is how enterprise sites do it
 */

'use client';

import { useState } from 'react';

interface StructuredContentProps {
  content: string[];
  context?: 'page' | 'section' | 'article';
  title?: string;
}

export default function StructuredContent({ 
  content, 
  context = 'section', 
  title = "Technical Details & Service Information" 
}: StructuredContentProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section 
      className="structured-info-section" 
      itemScope 
      itemType="https://schema.org/WebPageElement"
      data-seo-context={context}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="info-toggle"
        aria-expanded={isExpanded}
        aria-controls="structured-content-details"
        type="button"
      >
        <span className="toggle-icon">{isExpanded ? '−' : '+'}</span>
        <span className="toggle-text">{title}</span>
      </button>

      <div 
        id="structured-content-details"
        className={`info-content ${isExpanded ? 'expanded' : ''}`}
        itemProp="text"
        aria-hidden={!isExpanded}
      >
        {content.map((text, i) => (
          <p key={i} className="info-paragraph">
            {text}
          </p>
        ))}
      </div>

      <style jsx>{`
        .structured-info-section {
          border-top: 1px solid #e8e8e4;
          margin: 40px 0 0 0;
          padding: 0;
        }

        .info-toggle {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          background: transparent;
          border: none;
          padding: 16px 0;
          cursor: pointer;
          font-family: inherit;
          transition: opacity 0.2s;
        }

        .info-toggle:hover {
          opacity: 0.7;
        }

        .toggle-icon {
          font-size: 18px;
          color: #000;
          font-weight: 300;
          width: 20px;
          text-align: center;
        }

        .toggle-text {
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgb(85, 78, 78);
          font-weight: 400;
        }

        .info-content {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease-out;
          padding: 0;
        }

        .info-content.expanded {
          max-height: 2000px;
          padding-bottom: 24px;
          transition: max-height 0.5s ease-in;
        }

        .info-paragraph {
          font-size: 13px;
          line-height: 1.7em;
          color: rgb(85, 78, 78);
          margin: 0 0 12px 0;
          padding: 0;
        }

        .info-paragraph:last-child {
          margin-bottom: 0;
        }
      `}</style>
    </section>
  );
}
