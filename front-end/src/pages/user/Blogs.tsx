import { useEffect, useState, useMemo } from "react";
import api from "../../lib/api";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store";
import { savePageData, setError, setLoading } from "../../store/blogSlice";
import { Button } from "../../components/ui/button";

const PublicBlogs = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState<number>(1);
  const [expandedBlogs, setExpandedBlogs] = useState<Set<string>>(new Set());

  const currentPageBlogs = useSelector(
    (state: RootState) => state.blog.pages[page]
  );
  const currentPageMeta = useSelector(
    (state: RootState) => state.blog.pageMeta[page]
  );
  const isLoading = useSelector((state: RootState) => state.blog.isLoading);
  const error = useSelector((state: RootState) => state.blog.error);

  const toggleExpanded = (blogId: string) => {
    setExpandedBlogs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(blogId)) {
        newSet.delete(blogId);
      } else {
        newSet.add(blogId);
      }
      return newSet;
    });
  };

  // Remove pages from dependencies - check if data exists directly
  useEffect(() => {
    // Only fetch if we don't have data for this page
    if (currentPageBlogs !== undefined) return;

    const fetchPage = async () => {
      try {
        dispatch(setLoading(true));
        const res = await api.get(`/blogs?page=${page}`);
        dispatch(savePageData(res.data));
      } catch (err: any) {
        dispatch(setError(err.message || "Failed to fetch blogs"));
      }
    };

    fetchPage();
  }, [page, currentPageBlogs, dispatch]);

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
  };

  const meta = useMemo(
    () => currentPageMeta || { totalPages: 1 },
    [currentPageMeta]
  );

  if (isLoading && !currentPageBlogs) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 font-medium">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Blog</h1>
          <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full"></div>
        </div>

        {currentPageBlogs?.length === 0 ? (
          <div className="text-center py-32">
            <div className="w-24 h-24 mx-auto mb-6 bg-purple-50 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              No Stories Yet
            </h3>
            <p className="text-gray-500 text-lg">
              Check back soon for exciting culinary adventures!
            </p>
          </div>
        ) : (
          <div className="space-y-16">
            {currentPageBlogs?.map((blog, index) => {
              const isEven = index % 2 === 0;
              const isExpanded = expandedBlogs.has(blog._id);
              const shouldTruncate =
                blog.description && blog.description.length > 200;

              return (
                <article
                  key={blog._id}
                  className="group transition-all duration-500 hover:transform hover:scale-[1.01]"
                >
                  <div
                    className={`grid md:grid-cols-2 gap-8 md:gap-12 ${
                      !isEven ? "md:grid-flow-col-dense" : ""
                    }`}
                  >
                    <div
                      className={`flex flex-col justify-center space-y-4 ${
                        !isEven ? "md:col-start-2" : ""
                      }`}
                    >
                      {blog.category && (
                        <div className="inline-block">
                          <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent text-xs font-bold uppercase tracking-wider">
                            {blog.category}
                          </span>
                        </div>
                      )}

                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight group-hover:text-purple-700 transition-colors duration-300">
                        {blog.title || "Untitled Story"}
                      </h2>

                      <div className="prose prose-gray max-w-none">
                        <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                          {blog.description
                            ? isExpanded || !shouldTruncate
                              ? blog.description
                              : truncateText(blog.description, 200)
                            : "Discover the story behind this culinary journey and the flavors that make it unforgettable."}
                        </p>
                        {shouldTruncate && (
                          <button
                            onClick={() => toggleExpanded(blog._id)}
                            className="mt-2 text-purple-600 hover:text-purple-700 font-medium text-sm transition-colors duration-200 flex items-center gap-1"
                          >
                            {isExpanded ? (
                              <>
                                Show less
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 15l7-7 7 7"
                                  />
                                </svg>
                              </>
                            ) : (
                              <>
                                Read more
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                  />
                                </svg>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    <div className={`${!isEven ? "md:col-start-1" : ""}`}>
                      {blog.images?.length ? (
                        <div className="grid grid-cols-2 gap-3 h-64 md:h-80">
                          {blog.images.slice(0, 4).map((img, imgIndex) => {
                            const isMainImage = imgIndex === 0;

                            return (
                              <div
                                key={imgIndex}
                                className={`relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 group/img ${
                                  isMainImage ? "col-span-2 row-span-2" : ""
                                }`}
                              >
                                <img
                                  src={img.url}
                                  alt={`${blog.title} - Image ${imgIndex + 1}`}
                                  className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-700"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = `data:image/svg+xml,${encodeURIComponent(`
                                      <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
                                        <defs>
                                          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" style="stop-color:#f3e8ff;stop-opacity:1" />
                                            <stop offset="100%" style="stop-color:#fce7f3;stop-opacity:1" />
                                          </linearGradient>
                                        </defs>
                                        <rect width="400" height="300" fill="url(#grad)"/>
                                        <circle cx="200" cy="120" r="30" fill="#d8b4fe" opacity="0.3"/>
                                        <text x="200" y="180" text-anchor="middle" fill="#9333ea" font-family="Arial" font-size="14" font-weight="500">Image Preview</text>
                                        <text x="200" y="200" text-anchor="middle" fill="#c084fc" font-family="Arial" font-size="12">Loading...</text>
                                      </svg>
                                    `)}`;
                                  }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-500"></div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 rounded-2xl flex items-center justify-center shadow-inner h-64 md:h-80">
                          <div className="text-center">
                            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full flex items-center justify-center">
                              <svg
                                className="w-10 h-10 text-purple-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-purple-600 mb-2">
                              Visual Story Coming Soon
                            </h3>
                            <p className="text-purple-400 text-sm">
                              Images will be added to enhance this story
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {meta?.totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 my-12">
          <Button
            variant="outline"
            disabled={page <= 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          >
            Prev
          </Button>
          <span className="text-gray-700 font-medium">
            Page {page} of {meta.totalPages}
          </span>
          <Button
            variant="outline"
            disabled={page >= meta.totalPages}
            onClick={() =>
              setPage((prev) => Math.min(prev + 1, meta.totalPages))
            }
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default PublicBlogs