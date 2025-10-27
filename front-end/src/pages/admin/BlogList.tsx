import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import api from "../../lib/api";
import { Button } from "../../components/ui/button";
import { Skeleton } from "../../components/ui/skeleton";
import Swal from "sweetalert2";
import { setLoading, savePageData, setError, type BlogItem } from "../../store/blogSlice";
import type { RootState } from "../../store";

const AdminBlogList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get state from Redux - changed 'blogs' to 'blog'
  const { pages, pageMeta, isLoading } = useSelector((state: RootState) => state.blog);
  
  // Use local state only for page navigation
  const [page, setPage] = useState<number>(1);
  const limit = 6;
  
  // Get current page data from Redux
  const blogs: BlogItem[] = pages[page] || [];
  const meta = pageMeta[page];
  const total = meta?.total || 0;
  const totalPages = meta?.totalPages || 0;

  const fetchBlogs = async (pageNum: number) => {
    // Check if data already exists in Redux
    if (pages[pageNum]) {
      return;
    }

    dispatch(setLoading(true));
    try {
      const res = await api.get(`/blogs`, { params: { page: pageNum, limit } });
      const data = res.data as any;
      
      dispatch(savePageData({
        data: data.data || [],
        page: pageNum,
        limit,
        total: data.total || 0,
        totalPages: Math.ceil((data.total || 0) / limit),
      }));
    } catch (error: any) {
      dispatch(setError(error?.response?.data?.message || "Failed to fetch blogs"));
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchBlogs(page);
  }, [page]);

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Delete this blog?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
    });
    
    if (!result.isConfirmed) return;
    
    try {
      await api.delete(`/blogs/${id}`);
      
      // Update Redux state - remove blog from current page
      const updatedBlogs = blogs.filter((b: BlogItem) => b._id !== id);
      dispatch(savePageData({
        data: updatedBlogs,
        page,
        limit,
        total: total - 1,
        totalPages: Math.ceil((total - 1) / limit),
      }));
      
      await Swal.fire({
        title: "Deleted",
        text: "Blog has been deleted.",
        icon: "success",
        timer: 1200,
        showConfirmButton: false,
      });
      
      // If current page is empty and not first page, go to previous page
      if (updatedBlogs.length === 0 && page > 1) {
        setPage(page - 1);
      }
    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text: error?.response?.data?.message || "Failed to delete blog",
        icon: "error",
      });
    }
  };

  const BlogSkeleton = () => (
    <div className="border rounded p-4 flex flex-col sm:flex-row items-start gap-4">
      <Skeleton className="w-24 h-24 rounded" />
      <div className="flex-1 space-y-2 w-full">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <Skeleton className="h-10 w-full sm:w-20" />
        <Skeleton className="h-10 w-full sm:w-20" />
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">Blog</h2>
        <Button 
          className="w-full sm:w-auto" 
          onClick={() => navigate("/admin/blogs/new")}
        >
          Add Blog
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <BlogSkeleton key={i} />
          ))}
        </div>
      ) : blogs.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">No blogs found</p>
      ) : (
        <div className="grid gap-4">
          {blogs.map((blog: BlogItem) => (
            <div key={blog._id} className="border rounded p-4 flex flex-col sm:flex-row items-start gap-4">
              {blog.images?.[0]?.url && (
                <img 
                  src={blog.images[0].url} 
                  alt={blog.title} 
                  className="w-24 h-24 object-cover rounded" 
                />
              )}
              <div className="flex-1">
                <h3 className="font-medium">{blog.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {blog.description}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto sm:justify-end">
                <Link 
                  to={`/admin/blogs/${blog._id}`} 
                  className="w-full sm:w-auto inline-block"
                >
                  <Button variant="outline" className="w-full sm:w-auto h-10">
                    Edit
                  </Button>
                </Link>
                <Button
                  variant="destructive"
                  className="w-full sm:w-auto h-10"
                  onClick={() => handleDelete(blog._id)}
                  aria-label={`Delete ${blog.title}`}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4">
        <p className="text-sm text-muted-foreground text-center sm:text-left w-full sm:w-auto">
          Page {page} of {Math.max(1, totalPages)} • Total {total}
        </p>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            className="flex-1 sm:flex-none"
            disabled={page === 1}
            onClick={() => setPage((p: number) => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            className="flex-1 sm:flex-none"
            disabled={page >= totalPages || totalPages === 0}
            onClick={() => setPage((p: number) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminBlogList;