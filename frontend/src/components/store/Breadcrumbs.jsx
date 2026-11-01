import { Link } from "react-router-dom";

/* items: [{ label, to? }]. The last item renders as the current page. */
export default function Breadcrumbs({ items, className = "" }) {
  return (
    <nav aria-label="Breadcrumb" className={`text-[0.8125rem] text-ink-2 ${className}`}>
      <ol className="flex items-center gap-1 overflow-x-auto no-scrollbar whitespace-nowrap">
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-1">
            {i > 0 && <span className="material-symbols-outlined text-sm text-ink-3" aria-hidden="true">chevron_right</span>}
            {item.to && i < items.length - 1 ? (
              <Link to={item.to} className="hover:text-ink hover:underline underline-offset-2">{item.label}</Link>
            ) : (
              <span className="font-semibold text-ink" aria-current="page">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
