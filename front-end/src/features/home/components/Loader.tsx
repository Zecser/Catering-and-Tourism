import React from "react";

interface LoaderProps {
  message?: string;
}

const Loader: React.FC<LoaderProps> = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
      <div className="w-12 h-12 border-4 border-t-[#4b0d3a] border-gray-200 rounded-full animate-spin"></div>
      <p className="text-lg text-gray-700">{message}</p>
    </div>
  );
};

export default Loader;
