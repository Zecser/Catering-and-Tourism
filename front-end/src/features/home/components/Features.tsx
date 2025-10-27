import React from "react";
import { useNavigate } from "react-router-dom";
import cateringIcon from "../../../assets/MenuIcon.png"; 
import tourismIcon from "../../../assets/travelIcon.png";   
import card from "../../../assets/tourism.png";
import cater from "../../../assets/catering.png";
import { useServices } from "../../services/hooks/useServices";

interface Feature {
  icon: string;
  text: string;
}

const Features: React.FC = () => {
  const navigate = useNavigate();
  const { servicesByTitle, isLoading, error } = useServices();

  if (isLoading) return <p className="text-center py-10">Loading services...</p>;
  if (error) return <p className="text-red-500 text-center py-10">Error: {error}</p>;

  const cateringFeatures: Feature[] = (servicesByTitle["Catering"] || [])
    .slice(0, 4)
    .map(service => ({
      icon: cateringIcon,
      text: service.heading || service.title
    }));

  const tourismFeatures: Feature[] = (servicesByTitle["Tourism"] || [])
    .slice(0, 4)
    .map(service => ({
      icon: tourismIcon,
      text: service.heading || service.title
    }));

  const renderCard = (image: string, feature: Feature) => (
    <div className="relative rounded-lg overflow-hidden shadow-lg w-full">
      <img src={image} alt={feature.text} className="w-full h-auto" />
      <div className="absolute top-0 right-0 h-full w-1/2 p-4 flex flex-col justify-between pointer-events-none">
        <div className="text-right break-words pointer-events-auto">
        <p className="text-xs md:text-sm font-semibold text-white">
          {feature.text}
        </p>
      </div>
      </div>
    </div>
  );

  return (
    <section className="w-full bg-white py-10 sm:py-14 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-14">

        {/* Catering Section */}
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#4b0d3a] mb-8">
            What We Do In Catering
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
            {cateringFeatures.map((feature) => renderCard(cater, feature))}
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => navigate("/menu")}
              className="bg-[#4b0d3a] text-white px-6 py-2 rounded-md text-sm sm:text-base"
            >
              KNOW MORE
            </button>
          </div>
        </div>

        {/* Tourism Section */}
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#4b0d3a] mb-8">
            What We Do In Tourism
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
            {tourismFeatures.map((feature) => renderCard(card, feature))}
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => navigate("/services")}
              className="bg-[#4b0d3a] text-white px-6 py-2 rounded-md text-sm sm:text-base"
            >
              KNOW MORE
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Features;
