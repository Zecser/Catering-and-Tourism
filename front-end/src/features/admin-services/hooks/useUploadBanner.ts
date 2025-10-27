import { useState } from "react";
import api from "../../../lib/api";

interface UploadPayload {
  title: string;
  image: File;
}

interface BannerData {
  _id: string;
  title: string;
  image: {
    url: string;
    public_id: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface UploadResponse {
  success: boolean;
  data: BannerData;
}

export const useUploadBanner = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<BannerData | null>(null);

  const uploadBanner = async (payload: UploadPayload) => {
    if (!payload.title || !payload.image) {
      setError("Title and image are required");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append("title", payload.title);
      formData.append("image", payload.image);

      const response = await api.post<UploadResponse>("/services/banner", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setData(response.data.data); 
      return response.data.data;
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.response?.data?.message || "Something went wrong");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { uploadBanner, loading, error, data };
};
