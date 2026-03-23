import Image from "next/image";
import Link from "next/link";
import { Mail, Phone} from "lucide-react";
import { FaWhatsapp, FaYoutube, FaFacebookF, FaInstagram, FaTiktok, FaPhone, FaEnvelope, } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { HiOutlineMail, HiOutlinePhone } from "react-icons/hi";
export default function Footer() {
    return(
        <div className="w-full bg-black flex flex-col items-center justify-center">
            <div className="w-full xl:w-7xl grid grid-cols-1 md:grid-cols-3 gap-y-10 gap-x-10 lg:gap-x-40 xl:gap-x-80 px-4 py-10 text-white">
                <div className="w-full">
                    <Image src="/img/logo3.png" alt="" className="w-full" width={500} height={200}/>
                </div>
                <div className="w-full flex items-start justify-start">
                    <div className="flex flex-col gap-y-5">
                    <div className="flex justify-start items-center gap-x-1">
                        <div className="h-6 w-1 bg-white"></div>
                        <div className="text-white text-xl font-bold ">Our Contacts</div>
                    </div>
                    <div className="w-full pl-2 flex flex-col gap-y-3">
                        <Link href="tel:+254722270912" className="w-full flex items-center gap-x-2">
                            <HiOutlinePhone className="text-lg"/>
                            <p className="text-sm">+254 722270912</p>
                        </Link>
                        <Link href="mailto:talentrapture@gmail.com" className="w-full flex items-center gap-x-2">
                            <HiOutlineMail className="text-lg"/>
                            <p className="text-sm">talentrapture@gmail.com</p>
                        </Link>
                    </div>
                    </div>
                </div>
                <div className="w-full flex items-start justify-start">
                    <div className="flex flex-col gap-y-5">
                    <div className="flex justify-start items-center gap-x-1">
                        <div className="h-6 w-1 bg-white"></div>
                        <div className="text-white text-xl font-bold ">Our Socials</div>
                    </div>
                    <div className="w-full pl-2 flex items-center justify-between gap-x-3">
                        <Link href="https://www.facebook.com/people/Talent-Rapture/61584519691258/" >
                            <FaFacebookF className="text-lg"/>
                        </Link>
                        <Link href="https://www.instagram.com/talentrapture/" >
                            <FaInstagram className="text-lg"/>
                        </Link>
                        <Link href="https://www.youtube.com/@TalentRapture" >
                            <FaYoutube className="text-lg"/>
                        </Link>
                        <Link href="https://x.com/_TalentRapture" >
                            <FaXTwitter className="text-lg"/>
                        </Link>
                        <Link href="https://www.tiktok.com/@talentrapture" >
                            <FaTiktok className="text-lg"/>
                        </Link>
                        <Link href="https://wa.me/254722270912" >
                            <FaWhatsapp className="text-lg"/>
                        </Link>
                    </div>
                    </div>

                </div>
            </div>
            <div className="w-full p-5 border-t border-[#FF7F00] text-white flex items-center justify-center">
                Talent Rapture © 2026 All Rights Reserved
            </div>

        </div>
    )
}