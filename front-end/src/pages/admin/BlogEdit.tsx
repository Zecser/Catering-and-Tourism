import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../lib/api";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import Swal from "sweetalert2";

type ImageInfo = {
  url: string;
  public_id: string;
};

type Blog = {
  _id?: string;
  title: string;
  description: string;
  category?: string;
  images?: ImageInfo[];
};

const AdminBlogEdit = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState<Blog>({ title: "", description: "", category: "" });
  const [files, setFiles] = useState<File[]>([]);
  const [keptPublicIds, setKeptPublicIds] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ title?: string; description?: string; category?: string; images?: string }>({});
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load blog data if editing
  useEffect(() => {
    const load = async () => {
      if (!isEdit) return;
      try {
        setLoading(true);
        const res = await api.get(`/blogs/${id}`);
        const data = (res.data as any).data as Blog;
        setForm(data);
        setKeptPublicIds((data.images || []).map((img) => img.public_id));
      } catch (error: any) {
        await Swal.fire({
          title: "Error Loading Blog",
          text: error.response?.data?.message || "Failed to load blog data",
          icon: "error",
        });
        navigate("/admin/blogs");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, isEdit, navigate]);

  // ✅ Validation
  const validateForm = (): boolean => {
    const newErrors: { title?: string; description?: string; category?: string; images?: string } = {};
    const title = (form.title || "").trim();
    const description = (form.description || "").trim();
    const category = (form.category || "").trim();

    if (!title) {
      newErrors.title = "Title is required";
    } else if (title.length < 5) {
      newErrors.title = "Title must be at least 5 characters";
    } else if (title.length > 200) {
      newErrors.title = "Title must be less than 200 characters";
    }

    if (!category) {
      newErrors.category = "Category is required";
    } else if (!["Tourism", "Catering"].includes(category)) {
      newErrors.category = "Category must be either Tourism or Catering";
    }

    if (!description) {
      newErrors.description = "Description is required";
    } else if (description.length < 20) {
      newErrors.description = "Description must be at least 20 characters";
    } else if (description.length > 10000) {
      newErrors.description = "Description must be less than 10,000 characters";
    }

    if (!isEdit && !files.length) {
      newErrors.images = "At least 1 image is required for new blog posts";
    } else if (isEdit && keptPublicIds.length === 0 && files.length === 0) {
      newErrors.images = "Keep at least one existing image or add new ones";
    }

    if (files.length > 10) {
      newErrors.images = "Maximum 10 images allowed";
    }

    const maxFileSize = 10 * 1024 * 1024;
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > maxFileSize) {
        newErrors.images = `Image ${i + 1}: File size must be less than 10MB`;
        break;
      }
      if (!allowedTypes.includes(file.type)) {
        newErrors.images = `Image ${i + 1}: Only JPEG, PNG, GIF, and WebP allowed`;
        break;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Submit handler (FIXED)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const fd = new FormData();
    fd.append("title", form.title.trim());
    fd.append("description", form.description.trim());
    fd.append("category", form.category?.trim() || "");
    fd.append("content", form.description.trim()); // alias for backend safety

    // Add new images
    files.forEach((file) => fd.append("images", file));

    // Add kept existing images as JSON string (FIXED)
    if (isEdit && keptPublicIds.length > 0) {
      fd.append("keepImages", JSON.stringify(keptPublicIds));
    }

    try {
      setLoading(true);

      if (isEdit && id) {
        await api.put(`/blogs/${id}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        await Swal.fire("Success", "Blog updated successfully", "success");
      } else {
        await api.post(`/blogs`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        await Swal.fire("Success", "Blog created successfully", "success");
      }

      navigate("/admin/blogs");
    } catch (error: any) {
      console.error("Error saving blog:", error.response?.data || error.message);
      await Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Failed to save blog",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // File handling
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    const currentTotal = files.length + keptPublicIds.length;
    const maxAdditional = 10 - currentTotal;

    if (selected.length > maxAdditional) {
      Swal.fire({
        title: "Too Many Files",
        text: `You can only add ${maxAdditional} more images. Maximum 10 total.`,
        icon: "warning",
      });
      setFiles((prev) => [...prev, ...selected.slice(0, maxAdditional)]);
    } else {
      setFiles((prev) => [...prev, ...selected]);
    }

    e.target.value = "";
  };

  // FIXED: Separate functions for remove and keep
  const removeExistingImage = (publicId: string) => {
    setKeptPublicIds((prev) => prev.filter((p) => p !== publicId));
  };

  const keepExistingImage = (publicId: string) => {
    setKeptPublicIds((prev) => [...prev, publicId]);
  };

  const removeNewFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  if (loading && isEdit) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading blog data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8">
      <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isEdit ? "Edit Blog" : "Add Blog"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="text-sm font-medium block mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Enter blog title (5-200 characters)"
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="text-sm font-medium block mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={form.category || ""}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a category</option>
              <option value="Tourism">Tourism</option>
              <option value="Catering">Catering</option>
            </select>
            {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
          </div>

          {/* Images */}
          <div>
            <label className="text-sm font-medium block mb-2">
              Images <span className="text-red-500">*</span> (up to 10)
            </label>
            <div
              className={`border rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition ${
                errors.images ? "border-red-500" : "border-gray-300"
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="grid grid-cols-3 gap-3 mb-4">
                {isEdit &&
                  (form.images || []).map((img, idx) => {
                    const isKept = keptPublicIds.includes(img.public_id);
                    return (
                      <div key={idx} className="relative">
                        <img
                          src={img.url}
                          alt={`existing-${idx}`}
                          className={`w-full h-28 object-cover rounded ${
                            isKept ? "" : "opacity-50"
                          }`}
                        />
                        <button
                          type="button"
                          className={`absolute top-1 right-1 text-xs px-2 py-1 rounded text-white ${
                            isKept ? "bg-green-500" : "bg-red-500"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isKept) {
                              removeExistingImage(img.public_id);
                            } else {
                              keepExistingImage(img.public_id);
                            }
                          }}
                        >
                          {isKept ? "Keep" : "Remove"}
                        </button>
                      </div>
                    );
                  })}

                {files.map((f, idx) => (
                  <div key={idx} className="relative">
                    <img
                      src={URL.createObjectURL(f)}
                      alt={`preview-${idx}`}
                      className="w-full h-28 object-cover rounded"
                    />
                    <button
                      type="button"
                      className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeNewFile(idx);
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <p className="text-gray-500">Click to upload images</p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
            {errors.images && <p className="mt-1 text-sm text-red-600">{errors.images}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium block mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border rounded-lg p-3 min-h-40"
              placeholder="Enter detailed description (20-10,000 characters)"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          <div className="flex gap-3 justify-center pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : isEdit ? "Update Blog" : "Create Blog"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/blogs")}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminBlogEdit;