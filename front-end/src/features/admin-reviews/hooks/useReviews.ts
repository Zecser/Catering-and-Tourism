import { useEffect, useState } from "react";
import api, { baseURL } from "../../../lib/api";

export type Review = {
  _id: string;
  name: string;
  rating: number;
  comment: string;
  source?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

export const useReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<Partial<Review>>({ name: "", rating: 5, comment: "", source: "Google", isPublished: true });
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await api.get(`${baseURL}/reviews`);
      setReviews(res.data.data || []);
    } catch (e: any) {
      setError(e?.message || "Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const resetForm = () => {
    setForm({ name: "", rating: 5, comment: "", source: "Google", isPublished: true });
    setEditingId(null);
  };

  const save = async () => {
    try {
      setLoading(true);
      setError(null);
      if (editingId) {
        const res = await api.put(`${baseURL}/reviews/${editingId}`, form);
        setReviews((prev) => prev.map((r) => (r._id === editingId ? res.data.data : r)));
      } else {
        const res = await api.post(`${baseURL}/reviews`, form);
        setReviews((prev) => [res.data.data, ...prev]);
      }
      resetForm();
    } catch (e: any) {
      setError(e?.message || "Failed to save review");
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: string) => {
    try {
      setLoading(true);
      await api.delete(`${baseURL}/reviews/${id}`);
      setReviews((prev) => prev.filter((r) => r._id !== id));
    } catch (e: any) {
      setError(e?.message || "Failed to delete");
    } finally {
      setLoading(false);
    }
  };

  const edit = (review: Review) => {
    setEditingId(review._id);
    setForm({ name: review.name, rating: review.rating, comment: review.comment, source: review.source, isPublished: review.isPublished });
  };

  return { reviews, loading, error, form, setForm, save, remove, edit, resetForm };
};


