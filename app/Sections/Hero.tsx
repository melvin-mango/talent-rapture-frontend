"use client";
import { useState } from "react";
import Image from "next/image"
import RegisterModal from "@/app/components/RegisterModal";
import LoginModal from "../components/LoginModal";

export default function Hero () {
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    return(
        <div className=" relative w-full h-screen" id="home">
            <Image src="/img/abti2.jpg" alt="Hero_Img" width={1920} height={1076} className="z-0 w-full h-full object-cover"/> 
            <div className="absolute z-20 top-0 bg-black/60 w-full h-full">
            <div className="w-full p-2 h-full flex flex-col gap-y-10 md:gap-y-20 items-center justify-center border-amber-400 border-0">
                <div className="flex flex-col gap-y-2 items-center justify-center">
                    <div className="text-4xl md:text-7xl text-white xl:text-8xl font-black">Talent Rapture</div>
                    <div className="text-xl md:text-2xl text-white xl:text-3xl">Arts for Social Change</div>
                </div>
                <div className="flex items-center w-full gap-x-2 justify-center text-sm">
                    <button 
                        onClick={() => setIsRegisterOpen(true)}
                        className="w-1/2 md:w-1/4 lg:w-1/8 xl:w-1/12 items-center justify-center p-2 border rounded-4xl border-white cursor-pointer text-white hover:bg-white hover:text-[#FF7F00] transition-all duration-300 ease-in-out">
                        <span>
                            Get Started
                        </span>
                    </button>
                    <hr className="w-10 rotate-90 text-white"></hr>
                    <button className="w-1/2 md:w-1/4 lg:w-1/8 xl:w-1/12 items-center justify-center flex p-2 border rounded-4xl border-[#FF7F00] cursor-pointer hover:bg-white text-[#FF7F00] transition-all duration-300 ease-in-out"
                    onClick={() => {
                        const el = document.getElementById('events');
                        if (el) {
                            el.scrollIntoView(
                                {
                                    behavior:"smooth",
                                    block:"start",
                                }
                            );
                        }
                        
                    }}>
                        <span>
                            Events
                        </span>
                    </button>

                </div>
            </div>
            </div>

            <div>
                <RegisterModal 
              isOpen={isRegisterOpen} 
              onClose={() => setIsRegisterOpen(false)}
              onOpenLoginModal={() => {
                setIsRegisterOpen(false);
                setIsLoginOpen(true);
              }}
            />
        <LoginModal 
                  isOpen={isLoginOpen} 
                  onClose={() => setIsLoginOpen(false)}
                  onOpenRegisterModal={() => {
                    setIsLoginOpen(false);
                    setIsRegisterOpen(true);
                  }}
                />
            </div>
            
        </div>

        
    )
}