import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../../store";
import { fetchGalleryStart, fetchGallerySuccess, fetchGalleryFailure } from "../../../store/gallerySlice";
import api from "../../../lib/api";
import { Skeleton } from "../../../components/ui/skeleton";

interface Props {
  filter: "food" | "tourism";
  imagesPerPage?: number;
}

const UserGallery: React.FC<Props> = ({ filter, imagesPerPage = 5 }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { images, isLoading } = useSelector((state: RootState) => state.gallery);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch all images if not loaded yet
  useEffect(() => {
    const loadGallery = async () => {
      if (images.length === 0) {
        dispatch(fetchGalleryStart());
        try {
          const res = await api.get("/gallery");
          const allImages = Array.isArray(res.data.images) ? res.data.images : [];
          dispatch(fetchGallerySuccess({ images: allImages, totalPages: 1 }));
        } catch (error: any) {
          dispatch(fetchGalleryFailure(error.message || "Failed to load gallery"));
        }
      }
    };
    loadGallery();
  }, [dispatch, images.length]);

  // Filter images by type and status
  const filteredImages = useMemo(
    () => images.filter((img) => img.title?.toLowerCase().includes(filter) && img.status === "active"),
    [images, filter]
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredImages.length / imagesPerPage);
  const startIndex = (currentPage - 1) * imagesPerPage;
  const paginatedImages = filteredImages.slice(startIndex, startIndex + imagesPerPage);

  if (isLoading) {
    return (
      <div className="p-4 columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
        {Array.from({ length: imagesPerPage }).map((_, index) => (
          <Skeleton key={index} className="w-full h-60 rounded-lg" />
        ))}
      </div>
    );
  }

  if (paginatedImages.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 text-lg font-semibold text-gray-500">
        No {filter} images found.
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold text-center mb-8 text-dark-magenta">
        {filter === "food" ? "Moments in Focus" : "Capture the Moments"}
      </h2>

      <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
        {paginatedImages.map((image, index) => (
          <div key={image._id || index} className="break-inside-avoid">
            <img
              src={image.url}
              alt={`${filter} ${index + 1}`}
              loading="lazy"
              className="w-full rounded-xl shadow-md hover:scale-[1.03] transition-transform duration-300"
            />
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-4 space-x-2">
        {Array.from({ length: totalPages }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentPage(idx + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === idx + 1 ? "bg-dark-magenta text-white" : "bg-gray-200"
            }`}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default UserGallery;
