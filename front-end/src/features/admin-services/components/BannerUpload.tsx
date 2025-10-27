import React, { useState } from "react";
import { useUploadBanner } from "../hooks/useUploadBanner";

const BannerUpload: React.FC = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState<string>("");

  const { uploadBanner, loading, error, data } = useUploadBanner();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    if (selectedFile) setPreview(URL.createObjectURL(selectedFile));
  };

  const handleUpload = async () => {
    if (!category || !file) return;

    try {
      await uploadBanner({ title: category, image: file });
      setFile(null);
      setPreview(null);
      setCategory("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 w-full max-w-4xl mx-auto">
      <div className="rounded-xl p-1 bg-gradient-to-br from-pink-300 to-purple-400 shadow-lg mb-6">
        <div className="rounded-xl bg-white p-4">
          <div className="border-2 border-dashed border-[#A2008D] rounded-xl w-full h-40 flex items-center justify-center mb-3 overflow-hidden relative">
            <label className="flex flex-col items-center justify-center cursor-pointer w-full h-full">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              {preview ? ( 
                <img src={preview} alt="Preview" className="w-full h-full object-contain" />
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#f6e5f8] text-[#A2008D] mb-2">
                    <span className="text-xl font-bold">+</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-1 text-center">
                    Drop File or Click to Upload
                  </p>
                </div>
              )}
            </label>
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            <option value="" disabled>Select category</option>
            <option value="Catering">Catering</option>
            <option value="Tourism">Tourism</option>
          </select>
        </div>
      </div>

      <div className="flex gap-4 justify-center mb-6">
        <button
          onClick={handleUpload}
          disabled={loading || !file || !category}
          className={`bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-full font-semibold shadow hover:shadow-lg transition disabled:opacity-50`}
        >
          {loading ? "Uploading..." : "Upload file"}
        </button>

        <button
          onClick={() => { setFile(null); setPreview(null); setCategory(""); }}
          className="border border-[#A2008D] text-[#A2008D] px-6 py-2 rounded-full hover:bg-[#f0e5f8] transition"
        >
          Cancel
        </button>
      </div>

      {error && <p className="text-red-500 text-center">{error}</p>}
      {data && (
        <p className="text-green-600 text-center">
          Uploaded {data.title} successfully!
        </p>
      )}
    </div>
  );
};

export default BannerUpload;
