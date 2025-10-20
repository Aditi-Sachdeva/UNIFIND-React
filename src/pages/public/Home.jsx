import Navbar from '../../components/layout/Navbar'
import HeroSection from '../../components/home/HeroSection'
import Footer from '../../components/layout/Footer'

function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <HeroSection />
      <Footer />
    </div>
  )
}

export default Home