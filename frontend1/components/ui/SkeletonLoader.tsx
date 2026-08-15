/**
 * Industry-grade skeleton loader components
 * Used during SSR/hydration for instant perceived performance
 */

const shimmer = `relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent`;

function SkeletonBlock({ className = '' }: { className?: string }) {
  return (
    <div
      className={`${shimmer} rounded bg-[#e8e8e4] dark:bg-white/5 ${className}`}
      style={{ animationDelay: `${Math.random() * 0.3}s` }}
    />
  );
}

// Header skeleton
export function HeaderSkeleton() {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 md:h-[72px] z-50 bg-white/80 backdrop-blur-sm border-b border-black/5">
      <div className="wix-container flex items-center justify-between h-full">
        <SkeletonBlock className="h-5 w-32" />
        <div className="hidden md:flex items-center gap-10">
          {[1, 2, 3, 4, 5].map((i) => (
            <SkeletonBlock key={i} className="h-4 w-16" />
          ))}
        </div>
        <SkeletonBlock className="hidden md:block h-10 w-28" />
        <SkeletonBlock className="md:hidden h-8 w-8 rounded" />
      </div>
    </header>
  );
}

// Hero section skeleton
export function HeroSkeleton() {
  return (
    <section className="pt-[140px] pb-20 bg-[#f1f0eb]">
      <div className="wix-container">
        <SkeletonBlock className="h-3 w-24 mb-4" />
        <SkeletonBlock className="h-12 md:h-16 w-full max-w-3xl mb-5" />
        <SkeletonBlock className="h-12 md:h-16 w-3/4 max-w-2xl mb-6" />
        <SkeletonBlock className="h-5 w-full max-w-2xl mb-3" />
        <SkeletonBlock className="h-5 w-4/5 max-w-xl" />
      </div>
    </section>
  );
}

// Content grid skeleton
export function ContentGridSkeleton({ cols = 3, rows = 2 }: { cols?: number; rows?: number }) {
  return (
    <div
      className="grid gap-8"
      style={{
        gridTemplateColumns: `repeat(auto-fit, minmax(${cols === 4 ? '250px' : '280px'}, 1fr))`,
      }}
    >
      {Array.from({ length: cols * rows }).map((_, i) => (
        <div key={i} className="space-y-3">
          <SkeletonBlock className="h-48 w-full rounded" />
          <SkeletonBlock className="h-5 w-3/4" />
          <SkeletonBlock className="h-4 w-full" />
          <SkeletonBlock className="h-4 w-5/6" />
        </div>
      ))}
    </div>
  );
}

// List skeleton
export function ListSkeleton({ items = 6 }: { items?: number }) {
  return (
    <div className="space-y-6">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex gap-6 p-6 border border-[#e8e8e4] rounded">
          <SkeletonBlock className="h-16 w-16 flex-shrink-0 rounded" />
          <div className="flex-1 space-y-3">
            <SkeletonBlock className="h-5 w-1/3" />
            <SkeletonBlock className="h-4 w-full" />
            <SkeletonBlock className="h-4 w-4/5" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Table skeleton
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-4 gap-4 p-4 bg-[#f1f0eb] rounded">
        {[1, 2, 3, 4].map((i) => (
          <SkeletonBlock key={i} className="h-4" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="grid grid-cols-4 gap-4 p-4 border-b border-[#e8e8e4]">
          {[1, 2, 3, 4].map((j) => (
            <SkeletonBlock key={j} className="h-4" />
          ))}
        </div>
      ))}
    </div>
  );
}

// Footer skeleton
export function FooterSkeleton() {
  return (
    <footer className="bg-[#1c1d20] text-white pt-16 pb-8">
      <div className="wix-container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {[1, 2, 3, 4].map((col) => (
            <div key={col} className="space-y-4">
              <SkeletonBlock className="h-5 w-32 bg-white/10" />
              {[1, 2, 3, 4, 5].map((item) => (
                <SkeletonBlock key={item} className="h-4 w-full bg-white/5" />
              ))}
            </div>
          ))}
        </div>
        <div className="border-t border-white/10 pt-6 flex justify-between items-center">
          <SkeletonBlock className="h-4 w-48 bg-white/5" />
          <SkeletonBlock className="h-4 w-32 bg-white/5" />
        </div>
      </div>
    </footer>
  );
}

// Full page skeleton (combines all)
export function PageSkeleton() {
  return (
    <>
      <HeaderSkeleton />
      <HeroSkeleton />
      <section className="py-20 bg-white">
        <div className="wix-container">
          <ContentGridSkeleton cols={3} rows={2} />
        </div>
      </section>
      <FooterSkeleton />
    </>
  );
}

// Product card skeleton
export function ProductCardSkeleton() {
  return (
    <div className="border border-[#e8e8e4] rounded overflow-hidden">
      <SkeletonBlock className="h-56 w-full rounded-none" />
      <div className="p-5 space-y-3">
        <SkeletonBlock className="h-5 w-3/4" />
        <SkeletonBlock className="h-4 w-full" />
        <SkeletonBlock className="h-4 w-5/6" />
        <div className="flex gap-3 pt-2">
          <SkeletonBlock className="h-10 flex-1" />
          <SkeletonBlock className="h-10 w-10" />
        </div>
      </div>
    </div>
  );
}

// Text block skeleton
export function TextSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonBlock
          key={i}
          className={`h-4 ${i === lines - 1 ? 'w-3/4' : 'w-full'}`}
        />
      ))}
    </div>
  );
}
