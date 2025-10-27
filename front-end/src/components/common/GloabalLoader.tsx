import Lottie from "lottie-react";
import loaderAnimation from "../../assets/loading.json";

const GlobalLoader = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-primary z-[9999] px-4">
      <Lottie animationData={loaderAnimation} loop={true} className="max-w-sm" />
    </div>
  );
};

export default GlobalLoader;