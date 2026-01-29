"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import Header from "../components/Header"

export default function Contact() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!email.trim()) {
            toast.error("Please enter your email");
            return;
        }

        if (!message.trim()) {
            toast.error("Please enter your message");
            return;
        }

        if (!email.includes("@")) {
            toast.error("Please enter a valid email address");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email.trim(),
                    message: message.trim(),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.error || "Failed to send message");
                return;
            }

            // Success
            toast.success("Message sent successfully! We'll get back to you soon.");
            setEmail("");
            setMessage("");
        } catch (error) {
            console.error("Error sending contact message:", error);
            toast.error("An error occurred while sending your message");
        } finally {
            setIsLoading(false);
        }
    };

    return(
        <div className="w-full bg-[#F3DEBA] flex items-center justify-center" id="contact-us">
            <div className="w-full xl:w-7xl flex flex-col p-4 gap-y-5">
                <Header heading={'Contact Us'}/>
                <p className="text-xl text-black font-light">Send us a message and let's create something amazing together.</p>
                <div className=" w-full md:w-3/4 lg:w-2/3 md:pl-5 lg:pl-10">
                    <form onSubmit={handleSubmit}>
                        <div className="bg-[#FEFAE0] rounded-2xl p-4 flex flex-col gap-y-3">
                            <div className="flex flex-col gap-y-2">
                                <p className="text-black font-bold">Email</p>
                                <input 
                                    className="w-full bg-white border border-black p-2 rounded-md text-black text-sm outline-[#FF7F00]" 
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="flex flex-col gap-y-2">
                                <p className="text-black font-bold">Message</p>
                                <textarea
                                    required
                                    maxLength={1000}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Enter your message (max 1000 characters)"
                                    className="w-full bg-white border border-black p-2 rounded-md h-32 resize-none text-black text-sm outline-[#FF7F00] disabled:opacity-50"
                                    disabled={isLoading}
                                />
                                <p className="text-gray-600 text-xs">
                                    {message.length}/1000 characters
                                </p>
                            </div>
                            <button 
                                type="submit"
                                className="bg-[#FF7F00] max-w-30 text-white px-4 py-2 font-bold rounded-2xl cursor-pointer hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isLoading}
                            >
                                {isLoading ? "Sending..." : "Send"}
                            </button>
                            
                        </div>
                    </form>

                </div>

            </div>

        </div>
    )
}