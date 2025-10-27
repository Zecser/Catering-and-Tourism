import React from "react";
import HeroBannerUpload from "../../features/admin-home/components/HeroBannerUpload";
import HomeBanner from "../../features/admin-home/components/HomeBanner";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-gray-50">
      <div className="w-full max-w-5xl mx-auto bg-white rounded-2xl p-4 sm:p-6 lg:p-10 shadow-md">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-4 text-center">
          Upload Banner 1
        </h2>
        <HeroBannerUpload />

        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mt-8 mb-4 text-center">
          Upload Banner 2 & 3
        </h2>
        <HomeBanner />
      </div>
    </div>
  );
};

export default Home;
