
import {
  APP_NAME,
  QUICK_LINKS,
  SOCIAL_LINKS,
} from "../../utils/helpers/contants";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-primary text-white py-12 px-4 lg:px-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <img
              src="/logo.png"
              className="h-[50px] md:h-[60px]"
              alt={`Logo of ${APP_NAME}`}
            />
          </div>
          <p className="text-sm text-gray-300 mt-4 leading-relaxed">
            It is a long established fact that a reader will be distracted by
            the readable content of a page when looking at its layout.
          </p>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {QUICK_LINKS.map((link, index) => {
              return (
                <Link
                  key={index}
                  to={link.link}
                  className="hover:underline capitalize"
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4">Address</h4>
          <p className="text-sm text-gray-300 mb-6 leading-relaxed">
            It is a long established fact that a reader will be distracted by
            the readable content of a page when looking at its layout.
          </p>
          <div className="flex gap-4 text-white text-xl">
            {SOCIAL_LINKS.map(({ label, icon: Icon, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="hover:text-gray-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 border-t border-white" />
    </footer>
  );
};

export default Footer;
