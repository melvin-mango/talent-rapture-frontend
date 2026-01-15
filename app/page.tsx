 import Navbar from "./Sections/Navbar";
 import Hero from "./Sections/Hero";
import Aboutus from "./Sections/Aboutus";
import Services from "./Sections/Services";
import Events from "./Sections/Events";

export default function Home() {
  return (
    <div className="bg-[#FEFAE0] w-full h-auto">
      <Navbar/>
      <Hero/>
      <Aboutus/>
      <Services/>
      <Events/>
    </div>
  );
}
