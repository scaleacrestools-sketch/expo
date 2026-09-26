import About from './components/About.jsx';
import Blogs from './components/Blogs.jsx';
import ExploreProperties from './components/ExploreProperties.jsx';
import FAQ from './components/FAQ.jsx';
import FeaturedProperties from './components/FeaturedProperties.jsx';
import Footer from './components/Footer.jsx';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import RequestVisit from './components/RequestVisit.jsx';
import Statistics from './components/Statistics.jsx';
import useReveal from './hooks/useReveal.js';

export default function App() {
  useReveal();
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <FeaturedProperties />
        <About />
        <Statistics />
        <ExploreProperties />
        <Blogs />
        <RequestVisit />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
