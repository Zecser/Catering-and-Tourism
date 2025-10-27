import React from 'react';
import menu from "../../../assets/menu1.png";
import travel from "../../../assets/travel.png";

const Highlights: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12 flex flex-col gap-16">

      {/* Upper Section */}
      <div className="flex flex-col lg:flex-row items-center bg-[#F1E6F1] rounded-lg shadow-lg w-full sm:w-[90%] lg:w-[70%] mx-auto overflow-hidden">
        {/* Text */}
        <div className="w-full lg:w-2/3 text-center lg:text-left p-6 flex flex-col justify-center">
          <h2 className="text-xl sm:text-2xl md:text-2xl lg:text-2xl font-semibold text-[#5E315E] mb-4">
            Passion on Every Plate
          </h2>
          <p className="text-gray-700 leading-relaxed text-sm sm:text-base md:text-base lg:text-base">
            We serve fresh, high-quality food with love, ensuring every bite is flavorful and memorable. Our team carefully selects ingredients and prepares every dish with passion and attention to detail. We believe good food creates good moments, and we are here to make every occasion special. Every menu is thoughtfully crafted to provide a unique and delightful experience, leaving a lasting impression on our guests.
          </p>
        </div>

        {/* Icon */}
        <div className="w-full lg:w-1/3 flex justify-center lg:justify-end p-4">
          <img
            src={menu}
            alt="Menu"
            className="h-56 lg:h-full w-auto object-contain"
          />
        </div>
      </div>

      {/* Lower Section */}
      <div className="flex flex-col lg:flex-row items-center bg-[#F1E6F1] rounded-lg shadow-lg w-full sm:w-[90%] lg:w-[70%] mx-auto overflow-hidden">
        {/* Icon (now fixed on the left) */}
        <div className="w-full lg:w-1/3 flex justify-center lg:justify-start p-4">
          <img
            src={travel}
            alt="Travel"
            className="h-56 lg:h-full w-auto object-contain"
          />
        </div>

        {/* Text */}
        <div className="w-full lg:w-2/3 text-center lg:text-left p-6 flex flex-col justify-center">
          <h2 className="text-xl sm:text-2xl md:text-2xl lg:text-2xl font-semibold text-[#5E315E] mb-4">
            Your Journey, Our Passion
          </h2>
          <p className="text-gray-700 leading-relaxed text-sm sm:text-base md:text-base lg:text-base">
            We believe travel should be inspiring, effortless, and full of joy. Our team curates unique journeys that bring you closer to culture, nature, and unforgettable moments. From start to finish, we handle every detail with care so you can simply enjoy the ride. Your adventure begins with us, and we make it truly special. Every itinerary is customized to your desires, ensuring each experience is memorable and full of discovery.
          </p>
        </div>
      </div>

    </div>
  );
};

export default Highlights;
