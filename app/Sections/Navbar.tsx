"use client";
import Image from "next/image";
import { Menu } from "lucide-react";
import { useState } from "react";

export default function Navbar(){
    const [isMobileMenu, setIsMobileMenu] = useState(true);
    return(
        <div className="fixed w-full z-80 top-0">

        <div className="lg:hidden">
        <div className="w-full flex items-center justify-between h-20 p-4 bg-black">
            <Image src="/img/logo3.png" alt="" className="w-40" width={500} height={200} />
            <button onClick={() => {setIsMobileMenu(!isMobileMenu)}}>
                <Menu className="text-white"/>
            </button>
                      
        </div>

       
                        <div className={`w-full bg-black border-0 border-red-600 transition-all duration-300 ease-in-out overflow-hidden flex flex-col items-center justify-center gap-y-10 ${
            isMobileMenu ? 'max-h-auto opacity-100 p-4' : 'hidden opacity-0 p-0'
        }`}>

                <div className="w-full md:w-2/3 h-auto flex flex-col gap-y-3">
                    <button className="w-full items-center justify-center flex p-2 border rounded-4xl border-white">
                        <span className="text-white"> About Us </span>
                    </button>

                    <button className="w-full items-center justify-center flex p-2 border rounded-4xl border-white">
                        <span className="text-white"> Our Services </span>
                    </button>

                    <button className="w-full items-center justify-center flex p-2 border rounded-4xl border-white">
                        <span className="text-white"> Events </span>
                    </button>

                    <button className="w-full items-center justify-center flex p-2 border rounded-4xl border-white">
                        <span className="text-white"> Testimonials </span>
                    </button>

                    <button className="w-full items-center justify-center flex p-2 border rounded-4xl border-white">
                        <span className="text-white"> Contact Us </span>
                    </button>
                    
                </div>
                
                <div className="w-full flex flex-col gap-y-2 md:w-2/3">
                    <button className="w-full items-center justify-center flex p-2  rounded-4xl bg-[#FF7F00]">
                        <span className="text-black"> Join Us </span>
                    </button>

                    <button className="w-full items-center justify-center flex p-2  rounded-4xl bg-white">
                        <span className="text-[#FF7F00]"> Sign In </span>
                    </button>
                </div>

             </div>


        
        </div>

        <div className="hidden lg:flex w-full items-center justify-center bg-black ">
            <div className="w-7xl flex items-center justify-between h-20 p-4 bg-black">

                <Image src="/img/logo3.png" alt="" className="w-40" width={500} height={200} />

                <div className=" flex items-center justify-center gap-x-2">
                    <button className="px-4 py-2 items-center justify-center flex p-2 border rounded-4xl border-white hover:bg-[#FF7F00] hover:border-[#FF7F00] text-white hover:text-black outline-none transition-all duration-300 ease-in-out cursor-pointer text-xs ">
                        <span className=""> About Us </span>
                    </button>
                    <button className="px-4 py-2 items-center justify-center flex p-2 border rounded-4xl border-white hover:bg-[#FF7F00] hover:border-[#FF7F00] text-white hover:text-black outline-none transition-all duration-300 ease-in-out cursor-pointer text-xs ">
                        <span className=""> Our Services </span>
                    </button>
                    <button className="px-4 py-2 items-center justify-center flex p-2 border rounded-4xl border-white hover:bg-[#FF7F00] hover:border-[#FF7F00] text-white hover:text-black outline-none transition-all duration-300 ease-in-out cursor-pointer text-xs ">
                        <span className=""> Events </span>
                    </button>
                    <button className="px-4 py-2 items-center justify-center flex p-2 border rounded-4xl border-white hover:bg-[#FF7F00] hover:border-[#FF7F00] text-white hover:text-black outline-none transition-all duration-300 ease-in-out cursor-pointer text-xs ">
                        <span className=""> Testimonals </span>
                    </button>
                    <button className="px-4 py-2 items-center justify-center flex p-2 border rounded-4xl border-white hover:bg-[#FF7F00] hover:border-[#FF7F00] text-white hover:text-black outline-none transition-all duration-300 ease-in-out cursor-pointer text-xs ">
                        <span className="cursor-pointer"> Contact Us </span>
                    </button>
                </div>

                <div className=" flex items-center justify-center gap-x-2">

                    <button className="px-4 py-2 items-center justify-center flex p-2 border rounded-4xl border-[#FF7F00] bg-[#FF7F00] hover:bg-white hover:border-white text-black hover:text-[#FF7F00] outline-none transition-all duration-300 ease-in-out cursor-pointer text-xs font-bold">
                        <span className="cursor-pointer"> Join Us </span>
                    </button>

                    <button className="px-4 py-2 items-center justify-center flex p-2 border rounded-4xl border-white bg-white hover:bg-[#FF7F00] hover:border-[#FF7F00] text-[#FF7F00] hover:text-black outline-none transition-all duration-300 ease-in-out cursor-pointer text-xs font-bold">
                        <span className="cursor-pointer"> Sign In </span>
                    </button>

                </div>

            </div>

        </div>

        </div>
    )
}