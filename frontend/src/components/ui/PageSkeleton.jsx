export default function PageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-plum-lightest via-white to-plum-lightest/30 py-12 px-4">
      <div className="max-w-7xl mx-auto animate-pulse">
        {/* Header skeleton */}
        <div className="mb-8">
          <div className="h-10 bg-gray-200 rounded w-64 mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-96"></div>
        </div>
        
        {/* Content skeleton */}
        <div className="bg-white rounded-xl shadow-soft-plum p-8 space-y-6">
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
          
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="h-32 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="bg-gradient-to-r from-plum-deep to-plum-light py-20 animate-pulse">
      <div className="max-w-7xl mx-auto px-4">
        <div className="space-y-6">
          <div className="h-12 bg-white/20 rounded w-3/4 mx-auto"></div>
          <div className="h-6 bg-white/20 rounded w-1/2 mx-auto"></div>
          <div className="flex justify-center gap-4 pt-6">
            <div className="h-12 bg-white/20 rounded w-32"></div>
            <div className="h-12 bg-white/20 rounded w-32"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
