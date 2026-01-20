import dynamic from 'next/dynamic';
import Hero from "@/app/components/Hero";
import GradualBlur from "@/components/GradualBlur";
import ClickSpark from "@/components/ClickSpark";
import Invitation from "@/app/components/Invitation";

const Stack = dynamic(() => import('@/app/components/Stack'), { ssr: true });
const Map = dynamic(() => import('@/app/components/Map'), { ssr: true });
const Footer = dynamic(() => import('@/app/components/Footer'), { ssr: true });

export default function Home() {
    return (
        <ClickSpark sparkSize={26} sparkRadius={80} sparkCount={11} duration={600}>
            <main className="relative w-full overflow-x-hidden">

                {/* HERO SECTION - Keep it clean */}
                <section className="relative min-h-screen">
                    <Hero />
                </section>

                {/* INVITATION - Using negative margin to "lift" it into the Hero
                    This mimics your 'top-3/4' look but keeps it interactive.
                */}
                <div className="-mt-[25vh] md:-mt-[0vh] relative">
                    <Invitation />
                </div>

                <Stack />

                <Map />

                <Footer />

                {/* Gradual Blur stays on top but allows clicks via pointer-events-none */}
                <div className="pointer-events-none fixed inset-0 z-[120]">
                    <GradualBlur strength={1.5} />
                </div>
            </main>
        </ClickSpark>
    );
}