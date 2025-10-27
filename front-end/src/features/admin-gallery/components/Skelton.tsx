import React from "react";

const SkeletonPage: React.FC = () => {
  return (
    <div className="p-6 max-w-5xl mx-auto">
  
      <div className="h-8 w-48 bg-gray-200 rounded-md animate-pulse mb-4"></div>
      <div className="h-5 w-32 bg-gray-200 rounded-md animate-pulse mb-8"></div>
        <div className="p-6 max-w-md mx-auto mb-8">
        <div className="rounded-xl p-1 bg-gradient-to-br from-pink-200 to-purple-200 shadow-lg">
          <div className="rounded-xl bg-white p-4">
            <div className="border-2 border-dashed border-gray-200 rounded-xl w-full h-40 flex items-center justify-center animate-pulse" />
            <div className="h-8 w-full bg-gray-200 rounded-md animate-pulse mt-3"></div>
            <div className="h-8 w-full bg-gray-200 rounded-md animate-pulse mt-2"></div>
          </div>
        </div>
      </div>
    <h2 className="h-6 w-40 bg-gray-200 rounded-md animate-pulse mb-4"></h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="w-full h-[130px] bg-gray-200 rounded-xl animate-pulse"></div>
            <div className="flex gap-2 mt-2 w-full">
              <div className="flex-1 h-6 bg-gray-200 rounded-md animate-pulse"></div>
              <div className="flex-1 h-6 bg-gray-200 rounded-md animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonPage;
