export default function Button({
  children,
  variant = "primary",
  size = "md",
  type = "button",
  loading = false,
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed select-none";

  const sizes = {
    sm:  "h-9  px-4  text-xs  gap-1.5",
    md:  "h-11 px-5  text-sm  gap-2",
    lg:  "h-12 px-8  text-base gap-2",
    xl:  "h-14 px-10 text-lg  gap-2.5",
  };

  const variants = {
    primary:
      "bg-plum-deep text-white hover:bg-plum-light hover:-translate-y-0.5 hover:shadow-soft-plum focus:ring-plum-deep/40",
    coral:
      "bg-coral-accent text-white hover:bg-coral-dark hover:-translate-y-0.5 hover:shadow-glow-coral focus:ring-coral-accent/40",
    secondary:
      "bg-white text-plum-deep border border-stone-border hover:border-plum-deep/40 hover:bg-stone-light focus:ring-plum-deep/20",
    outline:
      "border-2 border-plum-deep text-plum-deep hover:bg-plum-deep hover:text-white focus:ring-plum-deep/30",
    ghost:
      "text-plum-deep hover:bg-stone-light focus:ring-plum-deep/20",
    danger:
      "bg-red-600 text-white hover:bg-red-700 hover:-translate-y-0.5 focus:ring-red-500/40",
  };

  return (
    <button
      type={type}
      disabled={loading || props.disabled}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <span className="material-symbols-outlined animate-spin text-[1em]">autorenew</span>
          <span>Loading…</span>
        </>
      ) : children}
    </button>
  );
}
