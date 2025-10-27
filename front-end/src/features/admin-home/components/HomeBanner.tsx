import React, { useState, useRef, useEffect } from "react";
import { Pen, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAdminHome } from "../hooks/useAdminHome";

const HomeBanner: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [editingBanner, setEditingBanner] = useState<string | null>(null);
  const [category, setCategory] = useState<"catering" | "tourism" | "">("");

  const editInputRef = useRef<HTMLInputElement | null>(null);

  const {
    homeBanners,
    homeLoading,
    error,
    fetchHomeBanners,
    uploadHomeBanner,
    editHomeBanner,
    deleteHomeBannerById,
    isFetched,
  } = useAdminHome();

  useEffect(() => {
    if (!isFetched) fetchHomeBanners();
  }, [fetchHomeBanners, isFetched]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleUpload = async () => {
    if (!editingBanner && (!file || !category)) return;
    try {
      if (editingBanner && file) {
        await editHomeBanner(editingBanner, file, category as "catering" | "tourism");
        toast.success(`${category.charAt(0).toUpperCase() + category.slice(1)} banner updated successfully`);
        setEditingBanner(null);
      } else if (file && category) {
        await uploadHomeBanner(file, category as "catering" | "tourism");
        toast.success(`${category.charAt(0).toUpperCase() + category.slice(1)} banner uploaded successfully`);
      }
      setFile(null);
      setPreview(null);
      setCategory("");
    } catch {
      toast.error("Upload/Update failed");
    }
  };

  const handleEditClick = (bannerId: string, url: string, type: "catering" | "tourism") => {
    setEditingBanner(bannerId);
    setPreview(url);
    setCategory(type);
    setFile(null);
    editInputRef.current?.click();
  };

  const handleDelete = async (bannerId: string) => {
    try {
      await deleteHomeBannerById(bannerId);
      toast.success(`${category.charAt(0).toUpperCase() + category.slice(1)} banner deleted successfully`);
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="p-4 sm:p-6 w-full">
      {/* Upload Box */}
      <div className="rounded-xl p-1 bg-gradient-to-br from-pink-300 to-purple-400 shadow-lg mb-4">
        <div className="rounded-xl bg-white p-4 sm:p-6">
          <div className="border-2 border-dashed border-[#A2008D] rounded-xl w-full h-40 sm:h-52 lg:h-60 flex items-center justify-center mb-3 overflow-hidden">
            <label className="flex flex-col items-center justify-center cursor-pointer w-full h-full">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                ref={editInputRef}
              />
              {preview ? (
                <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-xl" />
              ) : (
                <div className="flex flex-col items-center px-2 text-center">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-[#f6e5f8] text-[#A2008D] mb-2">
                    <span className="text-lg sm:text-xl font-bold">+</span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-700">Drop File or Click to Upload</p>
                </div>
              )}
            </label>
          </div>

          {/* Category Select */}
          <select
            value={category}
            onChange={e => setCategory(e.target.value as "catering" | "tourism")}
            className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md mb-2 text-sm sm:text-base shadow-inner focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            <option value="" disabled>Select category</option>
            <option value="catering">Catering</option>
            <option value="tourism">Tourism</option>
          </select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
        <button
          onClick={handleUpload}
    disabled={homeLoading || (!file && !editingBanner)}
          className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 sm:px-6 py-2 rounded-full font-semibold shadow hover:shadow-lg transition disabled:opacity-50"
        >
          {homeLoading ? "Processing..." : editingBanner ? "Update Banner" : "Upload Banner"}
        </button>
        <button
          onClick={() => {
            setFile(null);
            setPreview(null);
            setEditingBanner(null);
            setCategory("");
          }}
          className="border border-[#A2008D] text-[#A2008D] px-4 sm:px-6 py-2 rounded-full hover:bg-[#f0e5f8] transition"
        >
          Cancel
        </button>
      </div>

      {/* Uploaded Home Banners */}
      <div className="flex flex-wrap gap-3 justify-center mb-6">
        {homeLoading ? (
          Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="w-32 h-20 rounded-lg bg-gray-200 animate-pulse shadow-lg" />
          ))
        ) : homeBanners.length > 0 ? (
          homeBanners.map(b => (
            <div key={b._id} className="relative w-32 h-20 rounded-lg overflow-hidden shadow-lg">
              <img src={b.imageUrl} alt={b.type} className="w-full h-full object-cover" />
              <div className="absolute top-1 right-1 flex gap-1">
                <button
                  onClick={() => handleEditClick(b._id, b.imageUrl, b.type)}
                  className="bg-white p-1 rounded-full shadow hover:bg-gray-100"
                >
                  <Pen size={16} />
                </button>
                <button
                  onClick={() => handleDelete(b._id)}
                  className="bg-white p-1 rounded-full shadow hover:bg-gray-100"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center w-full">No banners uploaded yet.</p>
        )}
      </div>

      {error && <p className="text-red-500 text-center text-sm sm:text-base">{error}</p>}
    </div>
  );
};

export default HomeBanner;
