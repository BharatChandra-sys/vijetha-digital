export default function ProductSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-soft-plum overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="w-full h-64 bg-gray-200"></div>
      
      {/* Content skeleton */}
      <div className="p-6 space-y-4">
        {/* Category */}
        <div className="h-4 bg-gray-200 rounded w-24"></div>
        
        {/* Title */}
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        
        {/* Description */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
        
        {/* Price and button */}
        <div className="flex items-center justify-between pt-4">
          <div className="h-8 bg-gray-200 rounded w-24"></div>
          <div className="h-10 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}
