import { Routes } from "react-router-dom";
import PublicRoutes from "./PublicRoutes";
import AdminRoutes from "./AdminRoutes";
import { useAdminLoader } from "../hooks/useAdminLoader";
import GlobalLoader from "../components/common/GloabalLoader";

const AppRoutes = () => {
  const { admin, showLoader } = useAdminLoader();

  if (showLoader) return <GlobalLoader />;

  return (
    <Routes>
      {PublicRoutes()}
      {AdminRoutes(!!admin)}
    </Routes>
  );
};

export default AppRoutes;
