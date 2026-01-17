import ScrollStack, { ScrollStackItem } from '@/components/ScrollStack'
import MehndiCard from '@/app/components/MehndiCard'

const Stack = () => {
    return (
        // 1. Ensure the parent section is tall enough to allow scrolling
        // Increased height to ensure cards have space to unstack before the Map appears
        <section className="relative pt-5 min-h-[100vh]">

            {/* 2. IMPORTANT: Pass useWindowScroll={true} */}
            <ScrollStack
                itemDistance={5}
                itemStackDistance={30} // Space between cards when they are on top of each other
                stackPosition="5%"    // How far from the top they should stop
                itemScale={1}      // Each card behind gets 3% smaller
                useWindowScroll={true}
            >

                <ScrollStackItem itemClassName="mb-32"> {/* mb-32 creates spacing in the flow */}
                    <MehndiCard
                        title="मेहंदी"
                        subtitle="Mehndi"
                        date="10"
                        month="November"
                        time="12:00 PM"
                        venue="The Leela Palace, Jaipur"
                    />
                </ScrollStackItem>

                <ScrollStackItem itemClassName="mb-32">
                    <MehndiCard
                        title="हल्दी"
                        subtitle="Haldi"
                        date="11"
                        month="November"
                        time="Morning"
                        venue="The Leela Palace, Jaipur"
                    />
                </ScrollStackItem>

                <ScrollStackItem itemClassName="mb-32">
                    <MehndiCard
                        title="हल्दी"
                        subtitle="Haldi"
                        date="11"
                        month="November"
                        time="Morning"
                        venue="The Leela Palace, Jaipur"
                    />
                </ScrollStackItem>

                <ScrollStackItem itemClassName="mb-0">
                    <MehndiCard
                        title="हल्दी"
                        subtitle="Haldi"
                        date="11"
                        month="November"
                        time="Morning"
                        venue="The Leela Palace, Jaipur"
                    />
                </ScrollStackItem>

            </ScrollStack>
        </section>
    )
}

export default Stack