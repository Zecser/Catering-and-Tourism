import React from "react";
import { useNavigate } from "react-router-dom";
import { useServices } from "../hooks/useServices";
import travelIcon from "../../../assets/sertravel.png";
import CateringServicesSkeleton from "../components/CateringServiceSkeleton";

const TourismServices: React.FC = () => {
  const { servicesByTitle, isLoading, error } = useServices();
  const navigate = useNavigate();

  if (isLoading) return <CateringServicesSkeleton />;
  if (error) return <p className="text-red-500 text-center py-10">Error: {error}</p>;

  const tourismServices = servicesByTitle["Tourism"] || [];

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-left text-dark-magenta mb-12">
          What We Do In Tourism
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-items-center">
          {tourismServices.map((service) => (
            <div
              key={service._id}
              className="relative w-full max-w-sm md:max-w-md rounded-lg overflow-hidden shadow-lg"
            >
              {/* Image */}
              <img
                src={travelIcon}
                alt={service.title || "Tourism Service"}
                className="w-full h-auto object-contain"
              />

              {/* Overlay */}
              <div className="absolute top-0 right-0 h-full w-1/2 p-4 flex flex-col justify-between pointer-events-none">
                {/* Text at top-right */}
                <div className="text-right break-words pointer-events-auto">
                  <h3 className="text-xs md:text-sm font-semibold text-white">
                    {service.heading || "Service Title"}
                  </h3>
                </div>

                {/* Button at bottom-right */}
                <div className="flex justify-end mt-4 pointer-events-auto">
                  <button
                    onClick={() => navigate(`/services/${service._id}`)}
                    className="mb-10 px-2 py-1 border border-white text-white bg-transparent text-xs sm:text-sm font-medium rounded hover:bg-white hover:text-gray-800 transition"
                  >
                    Read More
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TourismServices;
