"use client";
import Header from "../components/Header";
import Image from "next/image";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
export default function Aboutus () {

const coreValues = [
    "Innovation", "Creativity", "Self-Improvement", "Disruption"
];
const [activeTab, setActiveTab] = useState<string | null>(null);
  let hideTimeout: NodeJS.Timeout | null = null;

  // Handle hover with delay for hiding
  const handleMouseOver = (tab: string) => {
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      hideTimeout = null;
    }
    setActiveTab(tab);
  };

  const handleMouseOut = () => {
    hideTimeout = setTimeout(() => {
      setActiveTab(null);
    }, 2200);
  };
    return(
        <div className="w-full p-4 flex items-start justify-center">
            <div className="w-full xl:w-7xl p-2">
                <Header heading="About Us"/>
                <div className="w-full flex flex-col md:flex-row items-start justify-center">
                    <div className="w-full md:w-1/2 h-[800px] p-4">
                        <Image src="/img/abti1.jpg" alt="Aboutus_img" width={1272} height={1920} className=" h-full object-cover " />
                    </div>
                    <div className="w-full md:w-1/2 flex flex-col gap-y-2 p-4 text-black">
                        <p className="text-justify hyphens-auto">
                            Talent Rapture is a global space where we identify, nurture and celebrate creative talents in young people from all spheres of life with an aim of making use of our creative talents and capabilities to make a positive impact in society.</p>
                        <p className="text-justify hyphens-auto">
                            Talent Rapture recognizes the place of popular Creative arts in the larger global developmental challenges and discourses. We utilize talent in the creation of meaningful discussions of significance in society such as gender equity, Women's rights, public health, Mental health, Climate change and mitigation of its adverse effects. 
                        </p>
                        <p className="text-justify hyphens-auto">
                            We produce and communicate these important issues through popular art forms, harnessing the power of creativity to address and illuminate critical societal topics such as: 
                        </p>
                        <ul className="list-disc ml-5 ">
                            <li>Films for development</li>
                            <li>Community theatre and theatre for development</li>
                            <li>Digital media</li>
                            <li>Online content creation</li>
                            <li>Music</li>
                            <li>Dance</li>
                            <li>Poetry</li>
                            <li>All the fun things, but with development in mind</li>
                        </ul>

                <div className="mt-8 w-full flex flex-col items-center justify-center">
                <ul className="flex gap-2 mb-4 w-full items-start justify-start">
                    <li>
                        <button
                            className={`p-2 md:px-4 md:py-2 rounded-3xl border-2 border-[#FF7F00] transition-all duration-200 cursor-pointer ${
                                activeTab === "mission" ? "bg-[#FF7F00] text-black" : "bg-transparent text-[#FF7F00] hover:bg-[#FF7F00] hover:text-black"
                            }`}
                            onMouseOver={() => handleMouseOver("mission")}
                            onMouseOut={handleMouseOut}
                            onClick={() => handleMouseOver("mission")}
                        >
                            Our Mission
                        </button>
                    </li>
                    <li>
                        <button
                            className={`p-2 md:px-4 md:py-2 rounded-3xl border-2 border-[#FF7F00] transition-all duration-200 cursor-pointer ${
                                activeTab === "vision" ? "bg-[#FF7F00] text-black" : "bg-transparent text-[#FF7F00] hover:bg-[#FF7F00] hover:text-black"
                            }`}
                            onMouseOver={() => handleMouseOver("vision")}
                            onMouseOut={handleMouseOut}
                            onClick={() => handleMouseOver("vision")}
                        >
                            Our Vision
                        </button>
                    </li>
                    <li>
                        <button
                            className={`p-2 md:px-4 md:py-2 rounded-3xl border-2 border-[#FF7F00] transition-all duration-200 cursor-pointer ${
                                activeTab === "corevalues" ? "bg-[#FF7F00] text-black" : "bg-transparent text-[#FF7F00] hover:bg-[#FF7F00] hover:text-black"
                            }`}
                            onMouseOver={() => handleMouseOver("corevalues")}
                            onMouseOut={handleMouseOut}
                            onClick={() => handleMouseOver("corevalues")}
                        >
                            Core Values
                        </button>
                    </li>
                </ul>
                <div className="relative w-full min-h-[250px] md:min-h-[180px] lg:min-h-[165px] xl:min-h-[150px]">
                    {/* Mission */}
                    <div
                        className={`absolute left-0 top-0 w-full transition-opacity duration-300 ${
                            activeTab === "mission" ? "opacity-100 visible" : "opacity-0 invisible"
                        }`}
                        onMouseOver={() => handleMouseOver("mission")}
                        onMouseOut={handleMouseOut}
                    >
                        <p className="text-[#FF7F00] text-lg text-center font-semibold flex items-center justify-center w-full h-full">To apply art, innovation and technology in solving societal problems.</p>
                    </div>
                    {/* Vision */}
                    <div
                        className={`absolute left-0 top-0 w-full transition-opacity duration-300 ${
                            activeTab === "vision" ? "opacity-100 visible" : "opacity-0 invisible"
                        }`}
                        onMouseOver={() => handleMouseOver("vision")}
                        onMouseOut={handleMouseOut}
                    >
                        <p className="text-[#FF7F00] text-lg text-center font-semibold flex items-center justify-center w-full h-full">To unlock every creative potential for development of the self and our surroundings.</p>
                    </div>
                    {/* Core Values */}
                    <div
                        className={`absolute left-0 top-0 w-full transition-opacity duration-300 ${
                            activeTab === "corevalues" ? "opacity-100 visible" : "opacity-0 invisible"
                        }`}
                        onMouseOver={() => handleMouseOver("corevalues")}
                        onMouseOut={handleMouseOut}
                    >
                        <div className="justify-center flex flex-col gap-y-2">
                          {coreValues.map((value) => (
                            <div key={value} className="flex  items-center text-black text-sm lg:text-base">
                              <FontAwesomeIcon
                              icon={faCircleCheck}
                              className="text-[#FF7F00] mr-1"
                              style={{ fontSize: "1.2rem" }}/>
                              {value}
                            </div>
                          ))}
                        </div>
                    </div>
                </div>
            </div>
                    </div>
                </div>
            </div>
        </div>
    )
}