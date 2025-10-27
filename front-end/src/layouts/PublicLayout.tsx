import { Outlet } from "react-router-dom";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";

const PublicLayout = () => {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <div className="min-h-screen">
        <Outlet />
      </div>
      <Footer />
    </main>
  );
};

export default PublicLayout;
