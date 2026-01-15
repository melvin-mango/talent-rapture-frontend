import Header from "../components/Header";
import { Calendar, MapPin, Clock } from "lucide-react";

interface Event {
    id: number;
    title: string;
    date: string;
    location: string;
    time: string;
    image: string;
}

const eventsData: Event[] = [
    {
        id: 1,
        title: "Talent Rapture: Festival of the creative arts",
        date: "28th - 29th February",
        location: "TBC",
        time: "8:00 am - 4:00pm",
        image: "/img/abti2.jpg"
    },
    {
        id: 2,
        title: "Talent Rapture: Festival of the creative arts",
        date: "28th - 29th February",
        location: "TBC",
        time: "8:00 am - 4:00pm",
        image: "/img/abti2.jpg"
    },
    {
        id: 3,
        title: "Talent Rapture: Festival of the creative arts",
        date: "28th - 29th February",
        location: "TBC",
        time: "8:00 am - 4:00pm",
        image: "/img/abti2.jpg"
    },
    {
        id: 4,
        title: "Talent Rapture: Festival of the creative arts",
        date: "28th - 29th February",
        location: "TBC",
        time: "8:00 am - 4:00pm",
        image: "/img/abti2.jpg"
    },
    {
        id: 5,
        title: "Talent Rapture: Festival of the creative arts",
        date: "28th - 29th February",
        location: "TBC",
        time: "8:00 am - 4:00pm",
        image: "/img/abti2.jpg"
    },
    {
        id: 6,
        title: "Talent Rapture: Festival of the creative arts",
        date: "28th - 29th February",
        location: "TBC",
        time: "8:00 am - 4:00pm",
        image: "/img/abti2.jpg"
    }
];

const EventCard = ({ event }: { event: Event }) => {
    return (
        <div className="bg-[#FEFAE0] rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            {/* Event Image */}
            <div className="h-48 bg-gray-300 overflow-hidden">
                <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Card Content */}
            <div className="p-6 flex flex-col gap-4">
                {/* Title */}
                <h3 className="text-lg font-semibold text-center text-black">
                    {event.title}
                </h3>

                {/* Event Details */}
                <div className="flex flex-col gap-3 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                        <Calendar size={18} />
                        <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin size={18} />
                        <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock size={18} />
                        <span>{event.time}</span>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col gap-2 pt-2">
                    <button className="w-full cursor-pointer border-2 border-[#FF7F00] bg-[#FF7F00] hover:bg-transparent text-white hover:text-[#FF7F00] font-semibold py-2 px-4 rounded transition-colors">
                        Register Now
                    </button>
                    <button className="w-full cursor-pointer border-2 border-[#FF7F00] text-[#FF7F00] hover:bg-[#FF7F00] hover:text-white font-semibold py-2 px-4 rounded transition-colors">
                        Download Flyer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function Events() {
    return(
        <div className="w-full bg-[#F3DEBA] items-center justify-center flex ">
            <div className="w-full xl:w-7xl p-4 flex flex-col gap-y-5">
                <Header heading={'Events'}/>
                <p className="text-xl text-black font-light">
                    Our Upcoming Events
                </p>
                
                {/* Events Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
                    {eventsData.map((event) => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </div>
            </div>
            
        </div>
    );
}