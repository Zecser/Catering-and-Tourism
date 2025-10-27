import React from "react";
import { CateringServices, HeroSection, TourismServices } from "../../features/services";
import tourismBg from "../../assets/tourism-bg.jpg";
import heroBg from "../../assets/hero-bg.jpg";

const Services: React.FC = () => {
  return (
    <>
      <HeroSection
        image={heroBg}
        heading="A Taste You'll Always Remember"
        subheading="- SERVICES"
        description="Every dish we create is crafted to leave a lasting impression on your heart and taste buds. From the freshest ingredients to flavors that tell a story, we make every meal unforgettable. Our passion for food ensures that each bite is a memory worth savoring, turning simple moments into celebrations."
        buttonText="CONTACT US"
      />

      <CateringServices />

      <HeroSection
        image={tourismBg}
        heading="Memories You'll Keep Forever"
        subheading="- SERVICES"
        description="From start to finish, we handle every detail with care so you can simply enjoy the ride. Your adventure begins with us, and we make it truly special."
        buttonText="CONTACT US"
      />

      <TourismServices />
    </>
  );
};

export default Services;
