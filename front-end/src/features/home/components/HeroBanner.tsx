import React from "react";
import G from "../../../assets/good.png";
import "../../../index.css";

const parisienneFontLink = document.createElement("link");
parisienneFontLink.href =
  "https://fonts.googleapis.com/css2?family=Parisienne&display=swap";
parisienneFontLink.rel = "stylesheet";
document.head.appendChild(parisienneFontLink);

type HeroBannerProps = {
  src?: string;   
  alt?: string;
  heightClass?: string;
  loading?: boolean;
};

const HeroBanner: React.FC<HeroBannerProps> = ({
  src,
  alt = "Hero banner",
  heightClass = "h-[55vh] sm:h-[60vh] md:h-[70vh] lg:h-[75vh] xl:h-[80vh]",
  loading = false
}) => {
  if (loading || !src) {
    return (
      <section
        className={`relative w-full ${heightClass} overflow-hidden bg-gray-200 animate-pulse rounded-lg`}
        aria-label="Hero banner skeleton"
      >
        <div className="absolute inset-0 bg-gray-300" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-400 rounded-full" />
          <div className="mt-6 h-8 w-2/3 bg-gray-400 rounded-md" />
        </div>
      </section>
    );
  }

  return (
    <section
      className={`relative w-full ${heightClass} overflow-hidden bg-black`}
      aria-label="Hero banner"
    >
      <img src={src} alt={alt} className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/45"></div>
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#3a0b28]" />
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
        <div className="flex items-center justify-center rounded-full border border-white/80 text-white/95 w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11">
          <img src={G} alt="G" />
        </div>
        <h1
          className="mt-6 text-white text-center text-[28px] xs:text-[32px] sm:text-[36px] md:text-[44px] lg:text-[52px] leading-tight"
          style={{ fontFamily: '"Parisienne", cursive', fontWeight: 400 }}
        >
          Dine. Discover. Delight
        </h1>
      </div>
    </section>
  );
};

export default HeroBanner;
