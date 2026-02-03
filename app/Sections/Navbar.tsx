"use client";
import Image from "next/image";
import { Menu, LogOut, Settings, User } from "lucide-react";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import RegisterModal from "@/app/components/RegisterModal";
import LoginModal from "@/app/components/LoginModal";

export default function Navbar(){
    const { data: session } = useSession();
    const [isMobileMenu, setIsMobileMenu] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    return(
        <div className="fixed w-full z-40 top-0">

        <div className="lg:hidden">
        <div className="w-full flex items-center justify-between h-20 p-4 bg-black">
            <Image src="/img/logo3.png" alt="" className="w-40 cursor-pointer" width={500} height={200} 
             onClick={() => {
                        const el = document.getElementById('home');
                        if (el) {
                            el.scrollIntoView(
                                {
                                    behavior:"smooth",
                                    block:"start",
                                }
                            );
                        }
                        setIsMobileMenu(false);
                    }}/>
            <button onClick={() => {setIsMobileMenu(!isMobileMenu)}}>
                <Menu className="text-white"/>
            </button>
                      
        </div>

       
                        <div className={`w-full bg-black border-0 border-red-600 transition-all duration-300 ease-in-out overflow-hidden flex flex-col items-center justify-center gap-y-10 ${
            isMobileMenu ? 'max-h-auto opacity-100 p-4' : 'hidden opacity-0 p-0'
        }`}>

                <div className="w-full md:w-2/3 h-auto flex flex-col gap-y-3">
                    <button className="w-full items-center justify-center flex p-2 border rounded-4xl border-white"
                    onClick={() => {
                        const el = document.getElementById('about-us');
                        if (el) {
                            el.scrollIntoView(
                                {
                                    behavior:"smooth",
                                    block:"start",
                                }
                            );
                        }
                        setIsMobileMenu(false);
                    }}>
                        <span className="text-white"> About Us </span>
                    </button>

                    <button className="w-full items-center justify-center flex p-2 border rounded-4xl border-white" 
                    onClick={() => {
                        const el = document.getElementById('services');
                        if (el) {
                            el.scrollIntoView(
                                {
                                    behavior:"smooth",
                                    block:"start",
                                }
                            );
                        }
                        setIsMobileMenu(false);
                    }}>
                        <span className="text-white"> Our Services </span>
                    </button>

                    <button className="w-full items-center justify-center flex p-2 border rounded-4xl border-white" 
                    onClick={() => {
                        const el = document.getElementById('events');
                        if (el) {
                            el.scrollIntoView(
                                {
                                    behavior:"smooth",
                                    block:"end",
                                }
                            );
                        }
                        setIsMobileMenu(false);
                    }}>
                        <span className="text-white"> Events </span>
                    </button>

                    <button className="w-full items-center justify-center flex p-2 border rounded-4xl border-white" 
                    onClick={() => {
                        const el = document.getElementById('testimonials');
                        if (el) {
                            el.scrollIntoView(
                                {
                                    behavior:"smooth",
                                    block:"end",
                                }
                            );
                        }
                        setIsMobileMenu(false);
                    }}>
                        <span className="text-white"> Testimonials </span>
                    </button>

                    <button className="w-full items-center justify-center flex p-2 border rounded-4xl border-white" 
                    onClick={() => {
                        const el = document.getElementById('contact-us');
                        if (el) {
                            el.scrollIntoView(
                                {
                                    behavior:"smooth",
                                    block:"end",
                                }
                            );
                        }
                        setIsMobileMenu(false);
                    }}>
                        <span className="text-white"> Contact Us </span>
                    </button>
                    
                </div>
                
                <div className="w-full flex flex-col gap-y-2 md:w-2/3">
                    {!session ? (
                      <>
                        <button 
                            className="w-full items-center justify-center flex p-2  rounded-4xl bg-[#FF7F00]"
                            onClick={() => setIsRegisterOpen(true)}
                        >
                            <span className="text-black"> Join Us </span>
                        </button>

                        <button 
                            className="w-full items-center justify-center flex p-2  rounded-4xl bg-white"
                            onClick={() => setIsLoginOpen(true)}
                        >
                            <span className="text-[#FF7F00]"> Sign In </span>
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                            className="w-full items-center justify-center flex p-2 gap-2 rounded-4xl bg-white"
                            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                        >
                            {session.user?.image ? (
                            <img 
                              src={session.user.image} 
                              alt="Avatar" 
                              className="w-6 h-6 rounded-full"
                            />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center">
                              <User size={18} className="text-white" />
                            </div>
                          )}
                            <span className="text-[#FF7F00] text-sm"> {session.user?.name} </span>
                        </button>

                        {isProfileMenuOpen && (
                          <div className="w-full flex flex-col gap-y-2 bg-gray-100 rounded-lg p-2">
                            <button 
                                className="w-full items-center justify-center flex p-2 gap-2 rounded-lg border border-gray-300 hover:bg-gray-200"
                                onClick={() => {
                                  // Navigate to profile settings
                                  /*window.location.href = "/profile";*/
                                }}
                            >
                              <Settings size={16} className="text-gray-700" />
                              <span className="text-gray-700 text-sm"> Settings </span>
                            </button>
                            <button 
                                className="w-full items-center justify-center flex p-2 gap-2 rounded-lg border border-red-300 hover:bg-red-100"
                                onClick={() => signOut({ redirect: true, callbackUrl: "/" })}
                            >
                              <LogOut size={16} className="text-red-600" />
                              <span className="text-red-600 text-sm"> Logout </span>
                            </button>
                          </div>
                        )}
                      </>
                    )}
                </div>

             </div>


        
        </div>

        <div className="hidden lg:flex w-full items-center justify-center bg-black ">
            <div className="w-7xl flex items-center justify-between h-20 p-4 bg-black">

                <Image src="/img/logo3.png" alt="" className="w-40 cursor-pointer" width={500} height={200} 
                onClick={() => {
                        const el = document.getElementById('home');
                        if (el) {
                            el.scrollIntoView(
                                {
                                    behavior:"smooth",
                                    block:"start",
                                }
                            );
                        }
                        setIsMobileMenu(false);
                    }}/>

                <div className=" flex items-center justify-center gap-x-2">
                    <button className="px-4 py-2 items-center justify-center flex p-2 border rounded-4xl border-white hover:bg-[#FF7F00] hover:border-[#FF7F00] text-white hover:text-black outline-none transition-all duration-300 ease-in-out cursor-pointer text-xs "
                    onClick={() => {
                        const el = document.getElementById('about-us');
                        if (el) {
                            el.scrollIntoView(
                                {
                                    behavior:"smooth",
                                    block:"start",
                                }
                            );
                        }
                        
                    }}>
                        <span className=""> About Us </span>
                    </button>
                    <button className="px-4 py-2 items-center justify-center flex p-2 border rounded-4xl border-white hover:bg-[#FF7F00] hover:border-[#FF7F00] text-white hover:text-black outline-none transition-all duration-300 ease-in-out cursor-pointer text-xs "
                    onClick={() => {
                        const el = document.getElementById('services');
                        if (el) {
                            el.scrollIntoView(
                                {
                                    behavior:"smooth",
                                    block:"start",
                                }
                            );
                        }
                        
                    }}>
                        <span className=""> Our Services </span>
                    </button>
                    <button className="px-4 py-2 items-center justify-center flex p-2 border rounded-4xl border-white hover:bg-[#FF7F00] hover:border-[#FF7F00] text-white hover:text-black outline-none transition-all duration-300 ease-in-out cursor-pointer text-xs "
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
                        <span className=""> Events </span>
                    </button>
                    <button className="px-4 py-2 items-center justify-center flex p-2 border rounded-4xl border-white hover:bg-[#FF7F00] hover:border-[#FF7F00] text-white hover:text-black outline-none transition-all duration-300 ease-in-out cursor-pointer text-xs "
                    onClick={() => {
                        const el = document.getElementById('testimonials');
                        if (el) {
                            el.scrollIntoView(
                                {
                                    behavior:"smooth",
                                    block:"end",
                                }
                            );
                        }
                        
                    }}>
                        <span className=""> Testimonals </span>
                    </button>
                    <button className="px-4 py-2 items-center justify-center flex p-2 border rounded-4xl border-white hover:bg-[#FF7F00] hover:border-[#FF7F00] text-white hover:text-black outline-none transition-all duration-300 ease-in-out cursor-pointer text-xs "
                    onClick={() => {
                        const el = document.getElementById('contact-us');
                        if (el) {
                            el.scrollIntoView(
                                {
                                    behavior:"smooth",
                                    block:"end",
                                }
                            );
                        }
                        
                    }}>
                        <span className="cursor-pointer"> Contact Us </span>
                    </button>
                </div>

                <div className=" flex items-center justify-center gap-x-2">
                    {!session ? (
                      <>
                        <button 
                            className="px-4 py-2 items-center justify-center flex p-2 border rounded-4xl border-[#FF7F00] bg-[#FF7F00] hover:bg-white hover:border-white text-black hover:text-[#FF7F00] outline-none transition-all duration-300 ease-in-out cursor-pointer text-xs font-bold"
                            onClick={() => setIsRegisterOpen(true)}
                        >
                            <span className="cursor-pointer"> Join Us </span>
                        </button>

                        <button 
                            className="px-4 py-2 items-center justify-center flex p-2 border rounded-4xl border-white bg-white hover:bg-[#FF7F00] hover:border-[#FF7F00] text-[#FF7F00] hover:text-black outline-none transition-all duration-300 ease-in-out cursor-pointer text-xs font-bold"
                            onClick={() => setIsLoginOpen(true)}
                        >
                            <span className="cursor-pointer"> Sign In </span>
                        </button>
                      </>
                    ) : (
                      <div className="relative flex items-center gap-4">
                        <button 
                            className="flex items-center gap-2 px-4 py-2 rounded-full border border-white hover:border-[#FF7F00] transition-colors"
                            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                        >
                          {session.user?.image ? (
                            <img 
                              src={session.user.image} 
                              alt="Avatar" 
                              className="w-8 h-8 rounded-full"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                              <User size={18} className="text-black" />
                            </div>
                          )}
                          <span className="text-white text-sm font-medium"> {session.user?.name} </span>
                        </button>

                        {isProfileMenuOpen && (
                          <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                            <button 
                                className="w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-gray-100 border-b border-gray-200 transition-colors"
                                onClick={() => {
                                  setIsProfileMenuOpen(false);
                                  /*window.location.href = "/profile";*/
                                }}
                            >
                              <Settings size={18} className="text-[#FF7F00]" />
                              <span className="text-gray-700 font-medium"> Settings </span>
                            </button>
                            <button 
                                className="w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-red-50 transition-colors"
                                onClick={() => {
                                  setIsProfileMenuOpen(false);
                                  signOut({ redirect: true, callbackUrl: "/" });
                                }}
                            >
                              <LogOut size={18} className="text-red-600" />
                              <span className="text-red-600 font-medium"> Logout </span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                </div>

            </div>

        
        </div>

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
    )
}