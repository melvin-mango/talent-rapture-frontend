"use client";
import { useState } from "react"
import Header from "../components/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBriefcase, faEye, faFile, faMicrophone, faPaste, faPersonChalkboard, faPersonRays, faRankingStar, faUserTie } from "@fortawesome/free-solid-svg-icons";
export default function Services () {
    const [activeTab, setActiveTab] = useState<string | null>(null);
    let hideTimeout:NodeJS.Timeout | null = null;

    const handleMouseOver = (tab:string) => {
        if (hideTimeout) {
            clearTimeout(hideTimeout);
            hideTimeout = null;
        }
        setActiveTab(tab);
    }

    const handleMouseOut = () => {
        hideTimeout = setTimeout(()=> {
            setActiveTab(null)
        }, 2200);
    }
    return(
        <div className="w-full flex flex-col items-center justify-center">
            <div className="w-full xl:w-7xl p-4">
                <Header heading="Our Services"/>
            </div>
            <div className="w-full flex flex-col md:flex-row items-center justify-center">
                <div className={`h-[400px] cursor-pointer overflow-y-scroll no-scrollbar w-full flex items-center justify-center transition-all duration-300 ease-in-out ${activeTab==="international"? " text-black bg-[#FF7F00]":"text-[#FF7F00] bg-black"}`}
                onMouseOver={()=> handleMouseOver("international")}
                onMouseOut={handleMouseOut}>
                    <div className={`text-center p-2 text-[#FF7F00] text-3xl ${activeTab==="international"?" hidden opacity-0 invisible":"opacity-100 visible"}`}>International Creative Arts Festivals</div>
                    <div className={`h-full w-full flex flex-col gap-y-3 items-center p-2 justify-start text-3xl ${activeTab==="international"?"opacity-100 visible":"hidden opacity-0 invisible"}`}>
                        <div className="text-xl font-semibold text-center text-black">
                            International Creative Arts Festivals
                        </div>
                        <div className="text-base text-justify text-black">
                            We appreciate the importance of interaction with like-minded and similarly skilled people in the creative spaces around and beyond Kenya. We therefore invite creative artists to lead our workshops and augment our performances for a blend that benefits young talent in Kenya. Thus, we identify, collate international festivals that local creatives can participate in to enhance mutual learning and benefits through creative performances and works. We thus connect local artists to the world.
                        </div>
                        
                    </div>
                </div>
                <div className={`h-[400px] cursor-pointer overflow-y-scroll no-scrollbar w-full flex items-center justify-center transition-all duration-300 ease-in-out${activeTab==="talent"? "text-black bg-[#FF7F00]":"text-[#FF7F00] bg-black"}`}
                onMouseOver={()=> handleMouseOver("talent")}
                onMouseOut={handleMouseOut}>
                    <div className={`text-center p-2 text-[#FF7F00] text-3xl ${activeTab==="talent"?" hidden opacity-0 invisible":"opacity-100 visible"}`}>Talent Rapture: Festival of the Creative Arts</div>
                    <div className={`h-full w-full flex flex-col gap-y-3 items-center p-2 justify-start text-3xl ${activeTab==="talent"?"opacity-100 visible":"hidden opacity-0 invisible"}`}>
                        <div className="text-xl font-semibold text-center text-black">
                            Talent Rapture: Festival of the Creative Arts
                        </div>
                        <div className="text-base text-justify text-black">
                            In order to discover and nurture young talent, we host the annual “Talent Rapture: Festival of the Creative Arts”. This is a festival that brings together young Talented creatives in Kenya and beyond for a three-day celebration and recognition of the power of the Creative Arts in society and its development. Most people lose their creative vigour and confidence simply because their creative talent was not identified, acknowledged, nurtured and rewarded positively from an early age. Talent Rapture bridges this gap by bringing together private international curricula schools. To participate in our next festival write to: talentrapturefest@gmail.com
                        </div>
                        
                    </div>
                </div>
                <div className={`h-[400px] cursor-pointer overflow-y-scroll no-scrollbar w-full flex items-center justify-center transition-all duration-300 ease-in-out${activeTab==="arts"? "text-black bg-[#FF7F00]":"text-[#FF7F00] bg-black"}`}
                onMouseOver={()=> handleMouseOver("arts")}
                onMouseOut={handleMouseOut}>
                    <div className={`text-center p-2 text-[#FF7F00] text-3xl ${activeTab==="arts"?" hidden opacity-0 invisible":"opacity-100 visible"}`}>Arts production for social change</div>
                    <div className={`h-full w-full flex flex-col gap-y-3 items-center p-2 justify-start text-3xl ${activeTab==="arts"?"opacity-100 visible":"hidden opacity-0 invisible"}`}>
                        <div className="text-xl font-semibold text-center text-black">
                            Arts production for social change
                        </div>
                        <div className="text-base text-justify text-black">
                            At Talent Rapture, we harness the existing creativity in society and mostly marginalized groups and unpack their social predicaments through the creative power of the arts. This opens up conversations that are healthy and therapeutic to these groups. We invite committed artists to work on stage and film productions that speak to issues that concern the society, both in Kenya and globally.
                        </div>
                        
                    </div>
                </div>
                
                
            </div>

            <div className="w-full xl:w-7xl p-4 gap-y-4 mt-5 mb-3 flex flex-col items-center justify-center text-center">
                <h1 className="text-2xl text-black font-semibold">Workshops</h1>
                <p className="text-xl text-black font-light">Talent Rapture organizes capacity building workshops through targeted, tailor-made one-on-one coaching in areas of:</p>

            </div>

            <div className="w-full xl:w-7xl p-4 gap-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ">
                    <div className="service brand inner relative w-full h-[250px] md:h-[300px] rounded-4xl">
                         <div className="absolute serv w-full p-3 h-full items-center justify-center flex flex-col gap-y-4 text-center rounded-4xl ">
                            <FontAwesomeIcon
                            icon={faEye}
                            className="w-5"
                            style={{ fontSize: "3.0rem" }}
                            />
                            <p className="text-lg font-bold text-black">Brand Visibility</p>
                            <p className="text-sm md:text-base">Enhancing participants' ability to make their creative work more visible and recognizable.</p>
                        
                        </div>
                    </div>

                    <div className="service personal inner relative w-full h-[250px] md:h-[300px] rounded-4xl">
                         <div className="absolute serv w-full p-3 h-full items-center justify-center flex flex-col gap-y-4 text-center rounded-4xl ">
                            <FontAwesomeIcon
                            icon={faPersonRays}
                            className="w-5"
                            style={{ fontSize: "3.0rem" }}
                            />
                            <p className="text-lg font-bold text-black">Personal Branding</p>
                            <p className="text-sm md:text-base">Guiding participants to build and maintain a personal brand aligning with their goals.</p>
                        
                        </div>
                    </div>

                    <div className="service public inner relative w-full h-[250px] md:h-[300px] rounded-4xl">
                         <div className="absolute serv w-full p-3 h-full items-center justify-center flex flex-col gap-y-4 text-center rounded-4xl ">
                            <FontAwesomeIcon
                            icon={faMicrophone}
                            className="w-5"
                            style={{ fontSize: "3.0rem" }}
                            />
                            <p className="text-lg font-bold text-black">Public Speaking</p>
                            <p className="text-sm md:text-base">Developing effective communication skills to articulate creative ideas confidently.</p>
                        
                        </div>
                    </div>

                    <div className="service cv inner relative w-full h-[250px] md:h-[300px] rounded-4xl">
                         <div className="absolute serv w-full p-3 h-full items-center justify-center flex flex-col gap-y-4 text-center rounded-4xl ">
                            <FontAwesomeIcon
                            icon={faFile}
                            className="w-5"
                            style={{ fontSize: "3.0rem" }}
                            />
                            <p className="text-lg font-bold text-black">CV Writing</p>
                            <p className="text-sm md:text-base">Providing guidance on crafting compelling CVs that highlight creative skills and experiences.</p>
                        
                        </div>
                    </div>

                    <div className="service presentation inner relative w-full h-[250px] md:h-[300px] rounded-4xl">
                         <div className="absolute serv w-full p-3 h-full items-center justify-center flex flex-col gap-y-4 text-center rounded-4xl ">
                            <FontAwesomeIcon
                            icon={faPersonChalkboard}
                            className="w-5"
                            style={{ fontSize: "3.0rem" }}
                            />
                            <p className="text-lg font-bold text-black">Presentation skills</p>
                            <p className="text-sm md:text-base">Training on how to present ideas and work in a clear, engaging, and professional manner.</p>
                        
                        </div>
                    </div>

                    <div className="service professional inner relative w-full h-[250px] md:h-[300px] rounded-4xl">
                         <div className="absolute serv w-full p-3 h-full items-center justify-center flex flex-col gap-y-4 text-center rounded-4xl ">
                            <FontAwesomeIcon
                            icon={faUserTie}
                            className="w-5"
                            style={{ fontSize: "3.0rem" }}
                            />
                            <p className="text-lg font-bold text-black">Professional etiquette</p>
                            <p className="text-sm md:text-base">Teaching norms and behaviors expected in professional and creative environments.</p>
                        
                        </div>
                    </div>

                    <div className="service leadership inner relative w-full h-[250px] md:h-[300px] rounded-4xl">
                         <div className="absolute serv w-full p-3 h-full items-center justify-center flex flex-col gap-y-4 text-center rounded-4xl ">
                            <FontAwesomeIcon
                            icon={faBriefcase}
                            className="w-5"
                            style={{ fontSize: "3.0rem" }}
                            />
                            <p className="text-lg font-bold text-black">Leadership skills</p>
                            <p className="text-sm md:text-base">Fostering the ability to lead projects and inspire others within the creative sector.</p>
                        
                        </div>
                    </div>

                    <div className="service presence inner relative w-full h-[250px] md:h-[300px] rounded-4xl">
                         <div className="absolute serv w-full p-3 h-full items-center justify-center flex flex-col gap-y-4 text-center rounded-4xl ">
                            <FontAwesomeIcon
                            icon={faRankingStar}
                            className="w-5"
                            style={{ fontSize: "3.0rem" }}
                            />
                            <p className="text-lg font-bold text-black">Brand presence</p>
                            <p className="text-sm md:text-base">Improving participants' ability to create and maintain a strong presence across platforms.</p>
                        
                        </div>
                    </div>

                    <div className="service interview inner relative w-full h-[250px] md:h-[300px] rounded-4xl">
                         <div className="absolute serv w-full p-3 h-full items-center justify-center flex flex-col gap-y-4 text-center rounded-4xl ">
                            <FontAwesomeIcon
                            icon={faPaste}
                            className="w-5"
                            style={{ fontSize: "3.0rem" }}
                            />
                            <p className="text-lg font-bold text-black">Job Interview Preparation</p>
                            <p className="text-sm md:text-base">Preparing participants to succeed in job interviews, with a focus on showcasing their creative talents.</p>
                        
                        </div>
                    </div>
                    
            </div>
            
        </div>
    )
}