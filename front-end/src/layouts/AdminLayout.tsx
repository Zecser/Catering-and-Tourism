import { Navigate, Outlet } from "react-router-dom";
import AdminNav from "../components/common/AdminNav";

type Props = {
  isAdmin: boolean;
};

const AdminLayout = ({ isAdmin }: Props) => {
  return isAdmin ? (
    <main className="min-h-screen flex flex-col md:flex-row">
      <AdminNav />

      <div className="flex-1">
        <Outlet />
      </div>
    </main>
  ) : (
    <Navigate to="/admin/login" replace />
  );
};

export default AdminLayout;
