import Navbar from "./Sections/Navbar";
import Hero from "./Sections/Hero";
import Aboutus from "./Sections/Aboutus";
import Services from "./Sections/Services";
import Events from "./Sections/Events";
import Testimonial from "./Sections/Testimonials";
import Contact from "./Sections/Contact";
import Footer from "./Sections/Footer";

export default function Home() {
  return (
    <div className="bg-[#FEFAE0] w-full h-auto no-scrollbar overflow-y-scroll">
      <Navbar/>
      <Hero/>
      <Aboutus/>
      <Services/>
      <Events/>
      <Testimonial/>
      <Contact/>
      <Footer/>
    </div>
  );
}
