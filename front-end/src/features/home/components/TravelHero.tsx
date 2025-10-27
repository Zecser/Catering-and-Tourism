
import React from "react";

type FoodHeroProps = {
  src: string;
  alt?: string;
  onKnowMore?: () => void;
  onContact?: () => void;
  heightClass?: string;
};

const TravelHero: React.FC<FoodHeroProps> = ({
  src,
  alt = "Gourmet dish",
  onKnowMore,
  onContact,
  heightClass = "h-[62vh] md:h-[70vh] lg:h-[82vh]",
}) => {
  return (
    <section
      className={`relative w-full ${heightClass} overflow-hidden`}
      aria-label="Food hero"
    >

      <img src={src} alt={alt} className="absolute inset-0 w-full h-full object-cover" />


      <div className="absolute inset-0 bg-black/55 md:bg-black/50" />


      <div className="relative z-10 h-full">
        <div className="mx-auto max-w-7xl h-full px-4 sm:px-6 lg:px-8">
          <div className="h-full relative">
            <h1
              className="absolute left-0 top-10 sm:top-14 md:top-16
                         text-white font-semibold leading-tight tracking-tight
                         text-3xl sm:text-4xl md:text-5xl max-w-[28rem] md:max-w-[34rem]"
            >
              Memories You'll Keep
              <br className="hidden sm:block" /> Forever
            </h1>


            <p
              className="absolute left-0 right-0 sm:right-56 md:right-72
                         bottom-16 sm:bottom-16 md:bottom-20
                         text-white/80 text-sm sm:text-[15px] md:text-base
                         max-w-3xl leading-6 md:leading-7"
            >
              From start to finish, we handle every detail with care so you can simply enjoy the ride. Your adventure begins with us, and we make it truly special.
            </p>


            <div
              className="absolute right-4 sm:right-6 lg:right-8
                         bottom-6 sm:bottom-6 md:bottom-8
                         flex items-center gap-3 sm:gap-4"
            >
              <button
                onClick={onKnowMore}
                className="inline-flex items-center justify-center rounded-md
                           border border-white/40 text-white
                           bg-white/10 hover:bg-white/15 transition-colors
                           h-10 px-4 sm:h-11 sm:px-6"
              >
                KNOW MORE
              </button>

              <button
                onClick={onContact}
                className="inline-flex items-center justify-center rounded-md
                           bg-white text-neutral-900 hover:bg-neutral-100
                           transition-colors h-10 px-4 sm:h-11 sm:px-6"
              >
                CONTACT US
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/40 to-transparent" />
    </section>
  );
};

export default TravelHero;
