import Link from 'next/link';
import JsonLd from './JsonLd';
import { generateBreadcrumbSchema } from '@/lib/seo-utils';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

const font = 'var(--font-wix)';

export default function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  const schema = generateBreadcrumbSchema(items);

  return (
    <>
      <nav
        aria-label="Breadcrumb"
        className={className}
        style={{
          fontFamily: font,
          fontSize: '13px',
          color: 'rgb(85,78,78)',
          padding: '12px 0',
        }}
      >
        <ol
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '8px',
            listStyle: 'none',
            margin: 0,
            padding: 0,
          }}
        >
          <li>
            <Link
              href="/"
              style={{
                color: 'rgb(85,78,78)',
                textDecoration: 'none',
              }}
            >
              Home
            </Link>
          </li>
          {items.map((item, index) => (
            <li key={item.url} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: 'rgb(85,78,78)' }}>›</span>
              {index === items.length - 1 ? (
                <span style={{ color: '#000', fontWeight: 500 }}>{item.name}</span>
              ) : (
                <Link
                  href={item.url}
                  style={{
                    color: 'rgb(85,78,78)',
                    textDecoration: 'none',
                  }}
                >
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd data={schema} />
    </>
  );
}
