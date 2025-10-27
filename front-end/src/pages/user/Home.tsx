import { useNavigate } from "react-router-dom";
import { Features, HeroBanner, FoodHero, TravelHero, Highlights } from "../../features/home";
import { useBanners } from "../../features/home/hooks/useBanners";
import FeaturesSkeleton from "../../features/home/components/featuresSkeleton";
import { useEffect, useState } from "react";

function Home() {
  const navigate = useNavigate();
  const { banners, loading, error, refetch } = useBanners();

  const heroBanners = banners.filter((b) => b.type === "hero");
  const cateringBanners = banners.filter((b) => b.type === "catering");
  const tourismBanners = banners.filter((b) => b.type === "tourism");

  const [heroIndex, setHeroIndex] = useState(0);
  const [cateringIndex, setCateringIndex] = useState(0);
  const [tourismIndex, setTourismIndex] = useState(0);

  useEffect(() => {
    if (heroBanners.length > 1) {
      const timer = setInterval(() => {
        setHeroIndex((prev) => (prev + 1) % heroBanners.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [heroBanners.length]);

  useEffect(() => {
    if (cateringBanners.length > 1) {
      const timer = setInterval(() => {
        setCateringIndex((prev) => (prev + 1) % cateringBanners.length);
      }, 6000);
      return () => clearInterval(timer);
    }
  }, [cateringBanners.length]);

  useEffect(() => {
    if (tourismBanners.length > 1) {
      const timer = setInterval(() => {
        setTourismIndex((prev) => (prev + 1) % tourismBanners.length);
      }, 7000);
      return () => clearInterval(timer);
    }
  }, [tourismBanners.length]);

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500">{error}</p>
        <button
          onClick={refetch}
          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen w-full">
      {/* HERO BANNER */}
      {loading ? (
        <div className="h-[300px] w-full bg-gray-200 animate-pulse rounded-lg my-8" />
      ) : (
        <div className="relative h-[55vh] sm:h-[60vh] md:h-[70vh] lg:h-[75vh] xl:h-[80vh] overflow-hidden">
          {heroBanners.map((banner, i) => (
            <div
              key={banner._id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                i === heroIndex ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <HeroBanner src={banner.imageUrl} alt="Hero banner" />
            </div>
          ))}
        </div>
      )}

      <Highlights />

      {/* CATERING BANNER */}
      {loading ? (
        <div className="h-[300px] w-full bg-gray-200 animate-pulse rounded-lg my-8" />
      ) : (
        <div className="relative h-[62vh] md:h-[70vh] lg:h-[82vh] overflow-hidden">
          {cateringBanners.map((banner, i) => (
            <div
              key={banner._id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                i === cateringIndex ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <FoodHero
                src={banner.imageUrl}
                alt="Catering banner"
                onKnowMore={() => navigate("/services")}
                onContact={() => navigate("/contact")}
              />
            </div>
          ))}
        </div>
      )}

      {/* TOURISM BANNER */}
      {loading ? (
        <div className="h-[300px] w-full bg-gray-200 animate-pulse rounded-lg my-8" />
      ) : (
        <div className="relative h-[62vh] md:h-[70vh] lg:h-[82vh] overflow-hidden">
          {tourismBanners.map((banner, i) => (
            <div
              key={banner._id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                i === tourismIndex ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <TravelHero
                src={banner.imageUrl}
                alt="Tourism banner"
                onKnowMore={() => navigate("/services")}
                onContact={() => navigate("/contact")}
              />
            </div>
          ))}
        </div>
      )}

      {loading ? <FeaturesSkeleton /> : <Features />}
    </main>
  );
}

export default Home;
