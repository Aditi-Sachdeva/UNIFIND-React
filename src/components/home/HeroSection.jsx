import { useNavigate } from 'react-router-dom';
import FeatureCard from "./FeatureCard";

function HeroSection({ user }) {
  const navigate = useNavigate();

  const handleReportClick = () => {
    console.log('Navigating to:', user ? '/report' : '/login');
    if (user) {
      navigate('/report');
    } else {
      navigate('/login');
    }
  };

  return (
    <>
      <div
        className="w-full h-[40vh] md:h-[calc(100vh-64px)] flex flex-col justify-center items-center text-center px-4 pt-20 pb-9
                   bg-black/60 bg-blend-overlay bg-[url('/HomeImage.png')] bg-contain md:bg-cover bg-center"
      >
        <div className="w-full max-w-md md:max-w-5xl px-4">
          <h1 className="text-white text-2xl md:text-5xl font-bold mb-4 pt-2">
            Lost & Found Management System
          </h1>
          <p className="hidden md:block text-white text-base md:text-xl mb-6">
            Easily report and retrieve lost items with our system.
          </p>
          <button
            onClick={handleReportClick}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-2 py-2 md:px-6 md:py-3 rounded-md text-sm transition"
          >
            Report Item
          </button>
        </div>

        {/* Feature Boxes (Desktop only) */}
        <div className="hidden md:flex mt-12 justify-center gap-6 w-full max-w-6xl">
          <FeatureCard title="Easy Reporting" description="Quickly submit lost and found reports." />
          <FeatureCard title="Verified Listings" description="Ensuring accurate and valid reports." />
          <FeatureCard title="Secure System" description="Your data is safe and protected." />
        </div>
      </div>

      {/* Feature Boxes (Mobile only) */}
      <section className="md:hidden max-w-6xl mx-auto py-12 px-6 grid gap-6 bg-gray-100 dark:bg-gray-900">
        <FeatureCard title="Easy Reporting" description="Quickly submit lost and found reports." />
        <FeatureCard title="Verified Listings" description="Ensuring accurate and valid reports." />
        <FeatureCard title="Secure System" description="Your data is safe and protected." />
      </section>
    </>
  );
}

export default HeroSection;