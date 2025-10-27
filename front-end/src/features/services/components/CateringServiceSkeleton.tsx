import React from "react";

const CateringServicesSkeleton: React.FC = () => {
  const placeholders = Array.from({ length: 4 }); 

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-left text-dark-magenta mb-12 animate-pulse">
          Loading Catering Services...
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-items-center">
          {placeholders.map((_, idx) => (
            <div
              key={idx}
              className="relative w-full max-w-sm md:max-w-md rounded-lg overflow-hidden shadow-lg bg-gray-200 animate-pulse"
            >
              {/* Image skeleton */}
              <div className="w-full h-64 md:h-64 bg-gray-300" />

              {/* Overlay skeleton */}
              <div className="absolute top-0 right-0 h-full w-1/2 p-4 flex flex-col justify-between">
                {/* Top-right text */}
                <div className="text-right">
                  <div className="h-4 md:h-5 bg-gray-400 rounded w-3/4 ml-auto mb-2" />
                  <div className="h-3 md:h-4 bg-gray-400 rounded w-1/2 ml-auto" />
                </div>

                {/* Bottom-right button skeleton */}
                <div className="flex justify-end">
                  <div className="h-6 md:h-8 w-20 md:w-24 border border-gray-400 rounded ml-auto" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CateringServicesSkeleton;
