import { HeaderSkeleton, HeroSkeleton, ListSkeleton, FooterSkeleton } from '@/components/ui/SkeletonLoader';

export default function ServicesLoading() {
  return (
    <>
      <HeaderSkeleton />
      <HeroSkeleton />
      <section className="bg-white py-20">
        <div className="wix-container">
          <ListSkeleton items={8} />
        </div>
      </section>
      <FooterSkeleton />
    </>
  );
}
