export default function Card({ children, className = "", hover = false, padding = "p-6" }) {
  return (
    <div
      className={`
        bg-white rounded-2xl border border-stone-border/60 shadow-card-default
        ${hover ? "transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover hover:border-stone-border cursor-pointer" : ""}
        ${padding}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
