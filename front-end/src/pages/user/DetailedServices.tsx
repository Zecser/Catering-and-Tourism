import React from "react";
import { useParams } from "react-router-dom";
import { useServiceDetail } from "../../features/services/hooks/useServiceDetail";
import Banner from "../../features/services/components/Banner";
import SuccessInNumbers from "../../features/services/components/SuccessInNumbers";
import Loader from "../../features/services/components/Loader"

const DetailedServices: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { service, loading, error } = useServiceDetail(id!);

  if (loading) return <Loader />; 
  if (error) return <p className="text-center py-10 text-red-500">{error}</p>;
  if (!service) return <p className="text-center py-10">Service not found</p>;

  return (
    <div className="w-full">
      <Banner image={service.image?.url || ""} title={service.heading} />

      <section className="w-full px-4 py-10 sm:px-6 md:px-12 lg:px-24 max-w-5xl mx-auto space-y-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">{service.title}</h1>
        <p className="text-gray-700 leading-relaxed text-sm sm:text-base md:text-lg">
          {service.description}
        </p>
      </section>

      <SuccessInNumbers />
    </div>
  );
};

export default DetailedServices;
