import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface HeroSectionProps {
  image: string;
  fallbackImage?: string;
  heading: string;
  subheading: string;
  description: string;
  buttonText?: string;
  className?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  image,
  fallbackImage = "/images/hero-bg.jpg",
  heading,
  subheading,
  description,
  buttonText = "CONTACT US",
  className = "",
}) => {
  const [bgImage, setBgImage] = useState(image);
  const navigate = useNavigate();

  useEffect(() => {
    const img = new Image();
    img.src = image;
    img.onload = () => setBgImage(image);
    img.onerror = () => setBgImage(fallbackImage);
  }, [image, fallbackImage]);

  return (
    <section
      className={`relative w-full min-h-[70vh] md:min-h-screen bg-cover bg-center flex items-center ${className}`}
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 max-w-3xl px-4 sm:px-6 md:px-12 text-white text-left">
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold leading-tight">
          {heading}
        </h1>

        <p className="mt-2 text-xs sm:text-sm md:text-lg uppercase tracking-wide">
          {subheading}
        </p>

        <p className="mt-4 text-sm sm:text-base md:text-lg text-gray-200 leading-relaxed">
          {description}
        </p>

        {buttonText && (
          <button
            onClick={() => navigate("/contact")} 
            className="mt-6 px-5 py-2 sm:px-6 sm:py-3 bg-white text-black rounded-lg shadow hover:bg-gray-200 transition"
          >
            {buttonText}
          </button>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
