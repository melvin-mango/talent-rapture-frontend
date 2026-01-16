import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, LucideTwitter, Mail, Phone, Twitch, Twitter, X, XIcon, Youtube} from "lucide-react";
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
                        <div className="w-full flex items-center gap-x-2">
                            <Phone className="text-xs"/>
                            <p className="text-sm">+254 722270912</p>
                        </div>
                        <div className="w-full flex items-center gap-x-2">
                            <Mail className="text-xs"/>
                            <p className="text-sm">info@talentrapture.com</p>
                        </div>
                    </div>
                    </div>
                </div>
                <div className="w-full flex items-start justify-start">
                    <div className="flex flex-col gap-y-5">
                    <div className="flex justify-start items-center gap-x-1">
                        <div className="h-6 w-1 bg-white"></div>
                        <div className="text-white text-xl font-bold ">Our Socials</div>
                    </div>
                    <div className="w-full pl-2 flex items-center justify-between gap-x-5">
                        <Link href="" >
                            <Facebook className="text-xs"/>
                        </Link>
                        <Link href="" >
                            <Instagram className="text-xs"/>
                        </Link>
                        <Link href="" >
                            <Youtube className="text-xs"/>
                        </Link>
                        <Link href="" >
                            <Twitter className="text-xs"/>
                        </Link>
                    </div>
                    </div>

                </div>
            </div>
            <div className="w-full p-5 border-t border-[#FF7F00] text-white flex items-center justify-center">
                Talent Rapture © 2025 All Rights Reserved
            </div>

        </div>
    )
}