"use client";

import { useState, useEffect } from "react";
import Header from "../components/Header";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Testimonial {
    id: number;
    quote: string;
    name: string;
    role: string;
}

const testimonialsData: Testimonial[] = [
    {
        id: 1,
        quote: "Talent Rapture gave me the confidence to take my art seriously. The mentorship sessions were eye-opening, and the support I received pushed me to create my best work yet.",
        name: "Michelle Achieng",
        role: "Visual Artist"
    },
    {
        id: 2,
        quote: "I never knew how to promote my talent until I joined Talent Rapture. The training was practical, inspiring, and exactly what I needed to grow as a young creative.",
        name: "Daniel Kibet",
        role: "Music Student"
    },
    {
        id: 3,
        quote: "My son has always been creative, but Talent Rapture helped him focus and refine his skills. I've seen a huge boost in his confidence and discipline.",
        name: "Sarah Mwende",
        role: "Parent"
    },
    {
        id: 4,
        quote: "The workshops at Talent Rapture transformed my approach to creativity. I learned so much about the business side of art that I never knew before.",
        name: "James Omondi",
        role: "Photographer"
    },
    {
        id: 5,
        quote: "Being part of Talent Rapture has been life-changing. The community is supportive, and the opportunities they provide are incredible.",
        name: "Grace Wanjiku",
        role: "Dance Instructor"
    },
    {
        id: 6,
        quote: "Talent Rapture opened doors I didn't even know existed. Their network and resources are unmatched for young creatives.",
        name: "Brian Mutua",
        role: "Graphic Designer"
    }
];

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-md flex flex-col h-[280px] flex-shrink-0">
            <div className="flex-1 overflow-y-auto no-scrollbar">
                <p className="text-gray-800 text-center leading-relaxed">
                    "{testimonial.quote}"
                </p>
            </div>
            <p className="font-bold text-black text-center mt-4 flex-shrink-0">
                {testimonial.name} – {testimonial.role}
            </p>
        </div>
    );
};

export default function Testimonial() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsVisible, setItemsVisible] = useState(3);

    // Update items visible based on screen size
    useEffect(() => {
        const updateItemsVisible = () => {
            if (window.innerWidth < 768) {
                setItemsVisible(1); // Mobile: 1 card
            } else if (window.innerWidth < 1024) {
                setItemsVisible(2); // Tablet: 2 cards
            } else {
                setItemsVisible(3); // Desktop: 3 cards
            }
        };

        updateItemsVisible();
        window.addEventListener('resize', updateItemsVisible);
        return () => window.removeEventListener('resize', updateItemsVisible);
    }, []);

    // Calculate max index based on visible items
    const maxIndex = testimonialsData.length - itemsVisible;

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
    };

    // Reset index if it exceeds maxIndex when screen resizes
    useEffect(() => {
        if (currentIndex > maxIndex) {
            setCurrentIndex(maxIndex);
        }
    }, [maxIndex, currentIndex]);

    // Get visible testimonials based on current index
    const getVisibleTestimonials = () => {
        return testimonialsData.slice(currentIndex, currentIndex + itemsVisible);
    };

    return(
        <div className="w-full flex items-center justify-center" id="testimonials">
            <div className="w-full p-4 flex flex-col xl:w-7xl gap-y-5">
                <Header heading={'Testimonials'}/>
                <p className="text-xl text-black font-light">What others say about us</p>
                
                {/* Carousel Container */}
                <div className="relative flex items-center gap-4 py-6">
                    {/* Left Arrow */}
                    <button 
                        onClick={prevSlide}
                        className="cursor-pointer hidden md:flex items-center justify-center w-12 h-12 text-gray-600 hover:text-gray-800 transition-colors flex-shrink-0"
                        aria-label="Previous testimonials"
                    >
                        <ChevronLeft size={40} strokeWidth={1.5} />
                    </button>

                    {/* Testimonials Grid */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {getVisibleTestimonials().map((testimonial) => (
                            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
                        ))}
                    </div>

                    {/* Right Arrow */}
                    <button 
                        onClick={nextSlide}
                        className="cursor-pointer hidden md:flex items-center justify-center w-12 h-12 text-gray-600 hover:text-gray-800 transition-colors flex-shrink-0"
                        aria-label="Next testimonials"
                    >
                        <ChevronRight size={40} strokeWidth={1.5} />
                    </button>
                </div>

                {/* Mobile Navigation */}
                <div className="flex md:hidden justify-center gap-4">
                    <button 
                        onClick={prevSlide}
                        className="cursor-pointer flex items-center justify-center w-10 h-10 text-gray-600 hover:text-gray-800 transition-colors"
                        aria-label="Previous testimonials"
                    >
                        <ChevronLeft size={32} strokeWidth={1.5} />
                    </button>
                    <button 
                        onClick={nextSlide}
                        className="cursor-pointer flex items-center justify-center w-10 h-10 text-gray-600 hover:text-gray-800 transition-colors"
                        aria-label="Next testimonials"
                    >
                        <ChevronRight size={32} strokeWidth={1.5} />
                    </button>
                </div>

                {/* Pagination Dots */}
                <div className="flex justify-center gap-2">
                    {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`cursor-pointer w-2 h-2 rounded-full transition-colors ${
                                index === currentIndex ? 'bg-gray-800' : 'bg-gray-400'
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}