import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { APP_NAME, PUBLIC_ROUTES } from "../../utils/helpers/contants";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";

const Header = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { pathname } = useLocation();

  const isActive = (path: string): boolean =>
    pathname.replaceAll("/", "") === path?.replaceAll("/", "");

  const toggleSheet = () => setIsSheetOpen((prev) => !prev);

  return (
    <header className="bg-primary sticky top-0 p-4 lg:px-10 z-50">
      <div className="flex justify-between items-center">
        <div className="text-white text-lg font-semibold">
          <img
            src="/logo.png"
            className="h-[30px] md:h-[40px]"
            alt={`Logo of ${APP_NAME}`}
          />
        </div>

        <div className="hidden md:flex space-x-4 lg:space-x-6 text-[12px] lg:text-sm">
          {Object.keys(PUBLIC_ROUTES).map((key) => {
            const route = PUBLIC_ROUTES[key as keyof typeof PUBLIC_ROUTES];
            return (
              <Link
                key={route.id}
                to={route.link}
                id={route.id}
                className={`text-white hover:text-gray-300 ${
                  isActive(route.link) ? "underline underline-offset-4" : ""
                }`}
              >
                {route.label}
              </Link>
            );
          })}
        </div>

        <div className="md:hidden">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild className="flex items-center justify-center">
              <button className="text-white" onClick={toggleSheet}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </SheetTrigger>

            <SheetContent
              side="left"
              className="w-[250px] bg-primary text-white"
            >
              <div className="flex flex-col space-y-6 p-8">
                {Object.keys(PUBLIC_ROUTES).map((key) => {
                  const route =
                    PUBLIC_ROUTES[key as keyof typeof PUBLIC_ROUTES];
                  return (
                    <Link
                      key={route.id}
                      to={route.link}
                      onClick={() => setIsSheetOpen(false)}
                      className={` ${
                        isActive(route.link)
                          ? "underline-offset-8 underline"
                          : ""
                      }`}
                    >
                      {route.label}
                    </Link>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
