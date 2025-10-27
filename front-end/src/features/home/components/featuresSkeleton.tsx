import React from "react";

const FeaturesSkeleton: React.FC = () => {
  const renderCardSkeleton = () => (
    <div className="relative rounded-lg overflow-hidden shadow-lg w-full animate-pulse">
      <div className="w-full h-40 bg-gray-200" />
      <div className="absolute top-0 right-0 h-full w-1/2 p-4 flex flex-col justify-between">
        <div className="text-right">
          <div className="h-4 w-24 bg-gray-300 rounded mb-2 inline-block" />
        </div>
      </div>
    </div>
  );

  return (
    <section className="w-full bg-white py-10 sm:py-14 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-14">
        
        {/* Catering Section */}
        <div>
          <div className="h-6 sm:h-8 w-60 bg-gray-300 rounded mb-8 animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <React.Fragment key={i}>{renderCardSkeleton()}</React.Fragment>
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <div className="h-10 w-32 bg-gray-300 rounded animate-pulse" />
          </div>
        </div>

        {/* Tourism Section */}
        <div>
          <div className="h-6 sm:h-8 w-60 bg-gray-300 rounded mb-8 animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <React.Fragment key={i}>{renderCardSkeleton()}</React.Fragment>
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <div className="h-10 w-32 bg-gray-300 rounded animate-pulse" />
          </div>
        </div>

      </div>
    </section>
  );
};

export default FeaturesSkeleton;
