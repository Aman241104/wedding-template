import MehndiCard from "@/app/components/MehndiCard";

const events = [
    {
        title: "मेहंदी",
        subtitle: "Mehndi",
        date: "10",
        month: "November",
        time: "12:00 PM",
        venue: "The Leela Palace, Jaipur",
        corner: "/mehndi-corner.png",
        main: "/mehndi-main.png"
    },
    {
        title: "हल्दी",
        subtitle: "Haldi",
        date: "11",
        month: "November",
        time: "Morning",
        venue: "The Leela Palace, Jaipur",
        corner: "/haldi-corner.png",
        main: "/haldi-main.png"
    },
    {
        title: "संगीत",
        subtitle: "Sangeet",
        date: "11",
        month: "November",
        time: "Evening",
        venue: "The Leela Palace, Jaipur",
        corner: "/sangeet-corner.png",
        main: "/sangeet-main.png"
    },
    {
        title: "विवाह",
        subtitle: "Vivvah",
        date: "12",
        month: "November",
        time: "Night",
        venue: "The Leela Palace, Jaipur",
        corner: "/vivaah-corner.png",
        main: "/vivaah-main.png"
    }
]

const Events = () => {
    return (
        <section className="relative w-full flex flex-col bg-wedding-maroon pointer-events-none">
            {events.map((event, index) => (
                <div key={index} className="w-full pointer-events-auto">
                    <MehndiCard {...event} />
                </div>
            ))}
        </section>
    );
};

export default Events;
