import React, { useRef } from "react";
import { useGallery } from "../hooks/admingallery";
import SkeletonPage from "./Skelton";

const ImageUploader: React.FC = () => {
  const {
    images,
    isLoading,
    isSaving,
    currentPage,
    totalPages,
    createImage,
    updateImage,
    deleteImage,
    setPage,
  } = useGallery();

  const [file, setFile] = React.useState<File | null>(null);
  const [title, setTitle] = React.useState<string>("");
  const [status, setStatus] = React.useState<"active" | "inactive">("active");
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [toaster, setToaster] = React.useState<{ message: string; onConfirm?: () => void; visible: boolean }>({ message: "", visible: false });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDoubleClick = (id: string) => {
    const img = images.find((i) => i._id === id);
    if (!img) return;
    setTitle(img.title);
    setStatus(img.status);
    setSelectedId(id);
    fileInputRef.current?.click();
  };

  const handleCancel = () => {
    setFile(null);
    setTitle("");
    setStatus("active");
    setSelectedId(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUploadClick = async () => {
    if (!title || (!file && !selectedId)) return;

    const formData = new FormData();
    if (file) formData.append("image", file);
    formData.append("title", title);
    formData.append("status", status);

    if (selectedId) await updateImage(selectedId, formData);
    else await createImage(formData);

    handleCancel();
  };

  const handleDeleteClick = (id: string) => {
    const img = images.find((i) => i._id === id);
    if (!img) return;

    setToaster({
      message: `Are you sure you want to delete "${img.title}"?`,
      visible: true,
      onConfirm: async () => {
        await deleteImage(id);
        setToaster({ message: "", visible: false });
        if (selectedId === id) handleCancel();
      },
    });
  };

  if (isLoading || isSaving) return <SkeletonPage />;

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold text-[#2E0039] mb-2">Captured Memories</h2>
      <h3 className="text-base sm:text-lg font-semibold text-[#A2008D] mb-6">Add Your Photos</h3>

      {/* Upload Box */}
      <div className="p-4 sm:p-6 w-full max-w-md mx-auto mb-6">
        <div className="rounded-xl p-1 bg-gradient-to-br from-pink-300 to-purple-400 shadow-lg">
          <div className="rounded-xl bg-white p-4">
            <div className="border-2 border-dashed border-[#A2008D] rounded-xl w-full h-40 flex items-center justify-center mb-3 overflow-hidden">
              {file ? (
                <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-contain" />
              ) : selectedId ? (
                <img src={images.find((img) => img._id === selectedId)?.url} alt="Selected" className="w-full h-full object-contain" />
              ) : (
                <label className="flex flex-col items-center justify-center cursor-pointer w-full h-full">
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="hidden" />
                  <div className="flex flex-col items-center justify-center">
                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-[#A2008D] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12V4m0 0l-4 4m4-4l4 4" />
                    </svg>
                    <p className="text-xs sm:text-sm text-gray-700 mb-1 text-center">Drop File or Click to Upload</p>
                  </div>
                </label>
              )}
            </div>

            {/* Category */}
            <select value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2 text-sm shadow-inner">
              <option value="" disabled>Select category</option>
              <option value="Tourism">Tourism</option>
              <option value="Food">Food</option>
            </select>

            {/* Status */}
            <select value={status} onChange={(e) => setStatus(e.target.value as "active" | "inactive")} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            {selectedId && (
              <button onClick={() => fileInputRef.current?.click()} className="w-full mt-2 bg-purple-600 text-white px-3 py-2 rounded-md text-sm hover:bg-purple-700 transition">
                Change Image
              </button>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-4">
          <button onClick={handleUploadClick} disabled={!title || (!file && !selectedId)} className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-full font-semibold shadow hover:shadow-lg transition-all disabled:opacity-50 w-full sm:w-auto">
            {selectedId ? "Update Image" : "Save to Gallery"}
          </button>
          <button onClick={handleCancel} className="border border-[#A2008D] text-[#A2008D] px-6 py-2 rounded-full hover:bg-[#f0e5f8] transition w-full sm:w-auto">
            Cancel
          </button>
        </div>
      </div>

      {/* Images Table */}
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full border border-gray-200 bg-white">
          <thead className="bg-[#F3E8F9]">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-[#2E0039] border-b">Image</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-[#2E0039] border-b">Title</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-[#2E0039] border-b">Status</th>
              <th className="px-4 py-2 text-center text-sm font-semibold text-[#2E0039] border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {images.length > 0 ? images.map(img => (
              <tr key={img._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-2 border-b">
                  <div className="w-24 h-16 overflow-hidden rounded-md border-2 border-[#A2008D]">
                    <img src={img.url} alt={img.title} className="w-full h-full object-cover cursor-pointer" onDoubleClick={() => handleDoubleClick(img._id)} />
                  </div>
                </td>
                <td className="px-4 py-2 border-b text-sm text-gray-700">{img.title}</td>
                <td className="px-4 py-2 border-b">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${img.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {img.status}
                  </span>
                </td>
                <td className="px-4 py-2 border-b text-center">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => handleDoubleClick(img._id)} className="bg-blue-600 text-white text-xs px-3 py-1 rounded hover:bg-blue-700 transition">Edit</button>
                    <button onClick={() => handleDeleteClick(img._id)} className="bg-red-600 text-white text-xs px-3 py-1 rounded hover:bg-red-700 transition">Delete</button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={4} className="text-gray-500 text-center py-4">No images uploaded yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button onClick={() => setPage(Math.max(currentPage - 1, 1))} disabled={currentPage === 1} className="px-3 py-1 border rounded disabled:opacity-50">Previous</button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={() => setPage(Math.min(currentPage + 1, totalPages))} disabled={currentPage === totalPages} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
      </div>

      {/* Toaster */}
      {toaster.visible && (
        <div className="fixed top-4 right-4 bg-white border rounded shadow-lg p-4 flex gap-2 items-center z-50 max-w-xs sm:max-w-sm">
          <span className="text-sm">{toaster.message}</span>
          <button className="bg-red-600 text-white px-2 py-1 rounded text-xs" onClick={() => toaster.onConfirm?.()}>Delete</button>
          <button className="bg-gray-300 text-gray-800 px-2 py-1 rounded text-xs" onClick={() => setToaster({ message: "", visible: false })}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
