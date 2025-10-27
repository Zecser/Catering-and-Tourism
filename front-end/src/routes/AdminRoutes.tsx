import { Navigate, Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import {
  AdminBlogEdit,
  AdminBlogList,
  AdminForgotPassword,
  AdminGallery,
  AdminLogin,
  AdminMenu,
  AdminResetPassword,
  AdminReviews,
  Home,
  PlanManagement,
  Services,
} from "../pages/admin";
import NotFound from "../pages/user/NotFound";

const AdminRoutes = (isAdmin: boolean) => {
  return (
    <Route path="/admin/*">
      <Route
        path="login"
        element={isAdmin ? <Navigate to={"/admin"} /> : <AdminLogin />}
      />
      <Route
        path="forgot-password"
        element={isAdmin ? <Navigate to={"/admin"} /> : <AdminForgotPassword />}
      />
      <Route
        path="reset-password"
        element={isAdmin ? <Navigate to={"/admin"} /> : <AdminResetPassword />}
      />
      <Route element={<AdminLayout isAdmin={isAdmin} />}>
        <Route index element={<Home />} />
        <Route path="blogs" element={<AdminBlogList />} />
        <Route path="blogs/new" element={<AdminBlogEdit />} />
        <Route path="blogs/:id" element={<AdminBlogEdit />} />
        <Route path="plan-management" element={<PlanManagement />} />
        <Route path="gallery" element={<AdminGallery />} />
        <Route path="menu" element={<AdminMenu />} />
        <Route path="reviews" element={<AdminReviews />} />
        <Route path="services" element={<Services />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Route>
  );
};

export default AdminRoutes;
