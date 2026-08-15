import { HeroSkeleton, ContentGridSkeleton, FooterSkeleton } from '@/components/ui/SkeletonLoader';

export default function Loading() {
  return (
    <>
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
