
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import api, { baseURL } from "../../lib/api";
import {
  setReviews,
  setLoading,
  setError,
  selectReviews,
  selectReviewLoading,
  selectReviewError,
} from "../../store/reviewSlice";
import type { AppDispatch } from "../../store";

export default function About() {
  const dispatch = useDispatch<AppDispatch>();

  const reviews = useSelector(selectReviews);
  const isLoading = useSelector(selectReviewLoading);
  const error = useSelector(selectReviewError);

  useEffect(() => {
    if (reviews.length > 0) return;

    (async () => {
      try {
        dispatch(setLoading(true));
        const res = await api.get(`${baseURL}/reviews?published=true`);
        dispatch(setReviews(res.data.data || []));
        dispatch(setError(null));
      } catch (err: any) {
        dispatch(setError("Failed to load reviews"));
      } finally {
        dispatch(setLoading(false));
      }
    })();
  }, [dispatch, reviews.length]);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <section className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
          All in Good Taste Food in Catering
        </h1>
        <p className="text-muted-foreground leading-7">
          At Good Taste, we believe food is more than a meal — it’s an experience
          to be savored. From intimate gatherings to grand celebrations, our
          menus reflect your vision and delight every guest.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">
          What people say about us
        </h2>

        {error && <p className="text-red-500">{error}</p>}

        {isLoading ? (
          <div className="grid md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="border rounded-md p-4 bg-white animate-pulse"
              >
                <div className="h-4 w-24 bg-gray-200 rounded mb-3" />
                <div className="h-3 w-32 bg-gray-200 rounded mb-2" />
                <div className="h-3 w-full bg-gray-200 rounded mb-1" />
                <div className="h-3 w-3/4 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <p className="text-center text-gray-500 py-10">
            No reviews yet. Be the first to share your experience!
          </p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {reviews.map((r) => (
              <div
                key={r._id}
                className="border rounded-md p-4 bg-white shadow-sm"
              >
                <p className="font-medium mb-1">{r.name}</p>
                <p className="text-yellow-500 text-sm mb-2">
                  {"★".repeat(r.rating)}
                  {"☆".repeat(5 - r.rating)}
                </p>
                <p className="text-sm text-muted-foreground">{r.comment}</p>
                {r.source && (
                  <p className="text-xs text-muted-foreground mt-2">{r.source}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
