import Header from "../components/layout/Header";
import Hero from "../components/layout/Hero";
import Footer from "../components/layout/Footer";
import Features from "../components/landing/Features";
import Pricing from "../components/landing/Pricing";

const Home = () => {
  return (
    <div>
      <Header />
      <Hero />
      <Features />
      <Pricing />
      <Footer />
    </div>
  );
};

export default Home;
