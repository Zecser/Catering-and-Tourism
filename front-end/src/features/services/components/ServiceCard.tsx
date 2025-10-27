import React from "react";
import menu from "../../../assets/menu.png";
import tourismIcon from "../../../assets/travelIcon.png"
import curve from "../../../assets/curve.png";
import { useNavigate } from "react-router-dom";

interface ServiceCardProps {
  id: string;
  title: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ id, title }) => {
  const navigate = useNavigate();

  
  const iconMap: Record<string, string> = {
    "Menu": menu,
    "Tourism": tourismIcon,
  };

  const iconSrc = iconMap[title] || menu; 

  
  const iconSizeMap: Record<string, string> = {
    "Menu": "w-20 h-20",       
    "Tourism": "w-20 h-20 ml-[12px]",   
  };

  const iconSize = iconSizeMap[title] || "w-55 h-55"; 

  const handleReadMore = () => {
    navigate(`/services/${id}`);
  };

  return (
    <div className="relative w-[426px] h-[192px] rounded-lg shadow-lg overflow-hidden">
      <div className="absolute inset-0 bg-dark-magenta rounded-lg" />
      <img
        src={curve}
        alt="curve background"
        className="absolute -left-4 -top-2 w-[115%] h-[130%] z-10 pointer-events-none"
      />

      <div className="absolute left-10 top-1/2 transform -translate-y-1/2 z-20">
        <img
          src={iconSrc}
          alt={title}
          className={`ml-[-55px] ${iconSize} object-contain`}
        />
      </div>

      <div className="absolute inset-y-0 right-6 flex flex-col justify-between items-end z-20 py-4 w-[60%]">
        <div className="w-[324px] overflow-hidden">
          <h3 className="text-base font-semibold text-white text-right break-words">
            {title}
          </h3>
        </div>

        <div className="w-full flex justify-end">
          <button
            onClick={handleReadMore}
            className="px-4 py-2 border border-white text-white text-xs rounded-md hover:bg-white hover:text-[#4b0240] transition"
          >
            READ MORE
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
