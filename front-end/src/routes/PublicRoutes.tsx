import { Route } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import {
  Home,
  PlansAndPricing,
  PublicBlogs,
  NotFound,
  UserGallery,
  Menu,
  Services,
  DetailedServices,
  Contact,
  About,
} from "../pages/user";

const PublicRoutes = () => {
  return (
    <Route element={<PublicLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/pricing" element={<PlansAndPricing />} />
      <Route path="/blogs" element={<PublicBlogs />} />
      <Route path="/gallery" element={<UserGallery />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/services" element={<Services />} />
      <Route path="/services/:id" element={<DetailedServices />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/about" element={<About />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  ); 
};

export default PublicRoutes;
