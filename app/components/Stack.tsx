import ScrollStack, { ScrollStackItem } from '@/components/ScrollStack'
import MehndiCard from '@/app/components/MehndiCard'

const events = [
    {
        title: "मेहंदी",
        subtitle: "Mehndi",
        date: "10",
        month: "November",
        time: "12:00 PM",
        venue: "The Leela Palace, Jaipur",
        corner: "/haldi-corner.png",
        main: "/haldi-main.png"
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
        corner: "/haldi-corner.png",
        main: "/haldi-main.png"
    },
    {
        title: "विवाह",
        subtitle: "Vivvah",
        date: "12",
        month: "November",
        time: "Night",
        venue: "The Leela Palace, Jaipur",
        corner: "/haldi-corner.png",
        main: "/haldi-main.png"
    }
];

const Stack = () => {
    return (
        // 1. Ensure the parent section is tall enough to allow scrolling
        // Increased height to ensure cards have space to unstack before the Map appears
        <section className="relative pt-5 min-h-[100vh]">

            {/* --- MOBILE LAYOUT (< md) --- */}
            <div className="md:hidden">
                <ScrollStack
                    itemDistance={5}
                    itemStackDistance={30} // Space between cards when they are on top of each other
                    stackPosition="5%"    // How far from the top they should stop
                    itemScale={1}      // Each card behind gets 3% smaller
                    useWindowScroll={true}
                >
                    {events.map((event, index) => (
                        <ScrollStackItem key={index} itemClassName={index === events.length - 1 ? "mb-0" : "mb-32"}>
                            <MehndiCard {...event} />
                        </ScrollStackItem>
                    ))}
                </ScrollStack>
            </div>

            {/* --- DESKTOP LAYOUT (>= md) --- */}
            <div className="hidden md:block">
                <ScrollStack
                    itemDistance={5}
                    itemStackDistance={30}
                    stackPosition="15%" // Slightly lower start for desktop
                    itemScale={1}
                    useWindowScroll={true}
                >
                    {/* Row 1: Card 0 & 1 */}
                    <ScrollStackItem itemClassName="mb-32">
                        <div className="grid grid-cols-2 gap-8 max-w-7xl mx-auto">
                            <MehndiCard {...events[0]} />
                            <MehndiCard {...events[1]} />
                        </div>
                    </ScrollStackItem>

                    {/* Row 2: Card 2 & 3 */}
                    <ScrollStackItem itemClassName="mb-0">
                        <div className="grid grid-cols-2 gap-8 max-w-7xl mx-auto">
                            <MehndiCard {...events[2]} />
                            <MehndiCard {...events[3]} />
                        </div>
                    </ScrollStackItem>
                </ScrollStack>
            </div>

        </section>
    )
}

export default Stack