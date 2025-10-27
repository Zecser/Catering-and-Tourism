import { Sheet, SheetContent, SheetFooter, SheetTrigger } from "../ui/sheet";
import { Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { ADMIN_NAVLINKS } from "../../utils/helpers/contants";
import LogoutButton from "../button/LogoutButton";

const AdminNav = () => {
  const { pathname } = useLocation();

  const renderLink = (link: (typeof ADMIN_NAVLINKS)[0]) => {
    const isActive =
      pathname.replaceAll("/", "") === link.path?.replaceAll("/", "");

    return (
      <Link
        key={link.path}
        to={link.path}
        className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm ${
          isActive ? "bg-white text-primary shadow-sm" : "text-white/90"
        }`}
      >
        <link.icon size={18} />
        {link.label}
      </Link>
    );
  };

  return (
    <div className="bg-primary text-white sticky top-0 max-h-screen z-50">
      <div className="md:hidden p-4">
        <Sheet>
          <SheetTrigger className=" text-white  transition h-auto flex justify-center items-center">
            <Menu size={25} />
          </SheetTrigger>
          <SheetContent
            side="left"
            className="bg-primary text-white w-64 p-6 border-r border-border h-full"
          >
            <h2 className="text-lg mb-2">Admin Menu</h2>
            <nav className="flex flex-col gap-2">
              {ADMIN_NAVLINKS.map(renderLink)}
            </nav>
            <SheetFooter>
              <LogoutButton />
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      <aside className="hidden md:flex flex-col w-64 min-h-screen bg-primary text-white p-6 border-r border-white/20 h-full">
        <h2 className="text-lg font-semibold mb-6">Admin Panel</h2>
        <nav className="flex flex-col gap-2">
          {ADMIN_NAVLINKS.map(renderLink)}
        </nav>
        <div className="flex h-full flex-col justify-end">
          <LogoutButton />
        </div>
      </aside>
    </div>
  );
};

export default AdminNav;
