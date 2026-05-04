export default function CartSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-soft-plum p-6 animate-pulse">
      <div className="flex gap-4">
        {/* Image skeleton */}
        <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0"></div>
        
        {/* Content skeleton */}
        <div className="flex-1 space-y-3">
          <div className="h-5 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="flex items-center justify-between">
            <div className="h-6 bg-gray-200 rounded w-20"></div>
            <div className="h-8 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CartListSkeleton({ count = 3 }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <CartSkeleton key={i} />
      ))}
    </div>
  );
}
