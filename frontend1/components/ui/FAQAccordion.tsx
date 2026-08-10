'use client';

import { useState } from 'react';

const font = "'helvetica-w01-roman','Helvetica Neue',Helvetica,Arial,sans-serif";
const fontBold = "'helvetica-w01-bold','Helvetica Neue',Helvetica,Arial,sans-serif";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
}

export default function FAQAccordion({ items }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div style={{ display: 'grid', gap: '12px', maxWidth: '900px' }}>
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            style={{
              backgroundColor: '#fff',
              border: '1px solid #e8e8e4',
              borderRadius: '4px',
              overflow: 'hidden',
              transition: 'all 0.2s ease',
            }}
          >
            {/* Question header - clickable */}
            <button
              onClick={() => toggleItem(index)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px 24px',
                backgroundColor: isOpen ? '#f9f9f7' : '#fff',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background-color 0.2s ease',
              }}
              aria-expanded={isOpen}
            >
              <p
                style={{
                  fontFamily: fontBold,
                  fontSize: '15px',
                  color: '#000',
                  lineHeight: '1.4',
                  paddingRight: '16px',
                  flex: 1,
                }}
              >
                {item.question}
              </p>
              {/* Chevron icon */}
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#000"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s ease',
                  flexShrink: 0,
                }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {/* Answer content - expandable */}
            <div
              style={{
                maxHeight: isOpen ? '1000px' : '0',
                overflow: 'hidden',
                transition: 'max-height 0.4s ease',
              }}
            >
              <div
                style={{
                  padding: '0 24px 24px 24px',
                  borderTop: '1px solid #f1f0eb',
                }}
              >
                <p
                  style={{
                    fontFamily: font,
                    fontSize: '14px',
                    lineHeight: '1.7em',
                    color: 'rgb(85,78,78)',
                    paddingTop: '16px',
                  }}
                >
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}

      <style>{`
        button:hover {
          background-color: #f9f9f7 !important;
        }
      `}</style>
    </div>
  );
}
