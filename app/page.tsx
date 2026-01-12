import Hero from "@/app/components/Hero";
import GradualBlur from "@/components/GradualBlur";
import ClickSpark from "@/components/ClickSpark";
import Invite from "@/app/components/Invite";
import Invitation from "@/app/components/Invitation";

export default function Home() {
    return (
        // REMOVE fixed height and overflow. Let the page grow naturally.
        <ClickSpark

    sparkSize={26}

    sparkRadius={80}

    sparkCount={11}

    duration={600}

        >
        <main className="relative w-full h-full overflow-x-hidden">

            {/* Just stack your components normally */}
            <Hero />

            <Invitation />

            {/* Gradual Blur needs to be 'fixed' position (in its own CSS)
           to stay on screen, or 'absolute' at the bottom of the content.
        */}
            <div className="pointer-events-none fixed inset-0 z-[60]">
                <GradualBlur strength={1.5} />
            </div>
        </main>
        </ClickSpark>
    );
}