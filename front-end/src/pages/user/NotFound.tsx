import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-primary text-white flex flex-col items-center justify-center px-4 py-12">
      <h1 className="text-[80px] sm:text-[100px] md:text-[120px] font-extrabold leading-none">
        404
      </h1>

      <p className="text-center text-base md:text-lg font-semibold mt-4 max-w-md">
        We are sorry, but the page you requested was not found
      </p>

      <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
        <Link
          to="/"
          className="bg-white text-primary font-semibold py-2 px-6 rounded-full shadow hover:bg-gray-100 transition"
        >
          GO HOME
        </Link>
        <Link
          to="/contact"
          className="border-2 border-white text-white font-semibold py-2 px-6 rounded-full hover:bg-white hover:text-primary transition"
        >
          CONTACT US
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
