import React from "react";

interface BannerProps {
  image: string;
  title: string;
}

const Banner: React.FC<BannerProps> = ({ image, title }) => {
  return (
    <section className="relative w-full h-[250px] sm:h-[300px] md:h-[400px] lg:h-[500px] xl:h-[600px] flex items-center justify-center overflow-hidden">
      {/* background image: use img with object-cover so it always fills the banner area */}
      {image ? (
        <img
          src={image}
          alt={title || "banner"}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gray-200" />
      )}

      <div className="absolute inset-0 bg-black/40" />

      <h2 className="relative z-10 text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold text-center px-4">
        {title}
      </h2>
    </section>
  );
};

export default Banner;
