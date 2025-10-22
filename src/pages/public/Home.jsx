import Navbar from '../../components/layout/Navbar';
import HeroSection from '../../components/home/HeroSection';
import Footer from '../../components/layout/Footer';

function Home({ user }) {
  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen md:min-h-[calc(100vh-64px)] md:overflow-hidden">
      <HeroSection user={user} />
      <Footer />
    </div>
  );
}

export default Home;