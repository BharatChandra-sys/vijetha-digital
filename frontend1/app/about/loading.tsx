import { HeroSkeleton, ContentGridSkeleton, FooterSkeleton } from '@/components/ui/SkeletonLoader';

export default function AboutLoading() {
  return (
    <>
      <section className="pt-[140px] pb-20 bg-[#1c1d20]">
        <div className="wix-container">
          <div className="skeleton h-3 w-24 mb-4 bg-white/10" />
          <div className="skeleton h-12 md:h-16 w-full max-w-3xl mb-5 bg-white/10" />
          <div className="skeleton h-12 md:h-16 w-3/4 max-w-2xl mb-6 bg-white/10" />
          <div className="flex gap-12 mt-12">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="skeleton h-8 w-20 bg-white/10" />
                <div className="skeleton h-4 w-24 bg-white/10" />
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-white py-20">
        <div className="wix-container">
          <ContentGridSkeleton cols={5} rows={3} />
        </div>
      </section>
      <FooterSkeleton />
    </>
  );
}
