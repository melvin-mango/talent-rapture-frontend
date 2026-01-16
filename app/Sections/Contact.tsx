import Header from "../components/Header"
export default function Contact() {
    return(
        <div className="w-full bg-[#F3DEBA] flex items-center justify-center" id="contact-us">
            <div className="w-full xl:w-7xl flex flex-col p-4 gap-y-5">
                <Header heading={'Contact Us'}/>
                <p className="text-xl text-black font-light">Send us a message and let's create something amazing together.</p>
                <div className=" w-full md:w-3/4 lg:w-2/3 md:pl-5 lg:pl-10">
                    <form>
                        <div className="bg-[#FEFAE0] rounded-2xl p-4 flex flex-col gap-y-3">
                            <div className="flex flex-col gap-y-2">
                                <p className="text-black font-bold">Email</p>
                                <input className="w-full bg-white border border-black p-2 rounded-md text-black text-sm outline-[#FF7F00]" 
                                type="email"
                                required/>
                            </div>
                            <div className="flex flex-col gap-y-2">
                                <p className="text-black font-bold">Message</p>
                                <textarea
                                required
                                maxLength={1000}
                                placeholder="Enter your message (max 250 words) "
                                className="w-full bg-white border border-black p-2 rounded-md h-32 resize-none text-black text-sm outline-[#FF7F00]"
                                />
                            </div>
                            <button 
                            type="submit"
                            className="bg-[#FF7F00] max-w-30 text-white px-4 py-2 font-bold rounded-2xl cursor-pointer hover:opacity-80 disabled:opacity-50">
                                Send
                            </button>
                            
                        </div>
                    </form>

                </div>

            </div>

        </div>
    )
}