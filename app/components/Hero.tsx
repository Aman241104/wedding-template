import Image from "next/image";
import React from "react";
import LightRays from "@/components/LightRays";
import FireworksBackground from "@/components/FireworksBackground";
import Lamps from "@/app/components/Lamps";
import FrontLamps from "@/app/components/FrontLamps";

const GATE = "/arch.png";
const HERO = "/image 1.png";
const FLOWERS = "/Hero-flowers.png";

export default function Hero() {
    return (
        <div className="relative flex flex-col items-center justify-start min-h-svh overflow-hidden bg-wedding-maroon pt-4 md:pt-6">

            {/* CARD */}
            <div
                className="
          relative
          w-[96vw] md:w-[95vw]
          h-[80svh] md:h-[92vh]
          rounded-2xl md:rounded-[3rem]
          overflow-hidden
          shadow-2xl
          z-10
          border border-white/10
        "
            >
                {/* BACKGROUND */}
                <Image
                    src={HERO}
                    alt="Traditional Indian Wedding Mandap"
                    fill
                    className="object-cover object-center"
                    sizes="95vw"
                    priority
                />

                {/* EFFECTS */}
                <FireworksBackground />
                <Lamps />

                {/* GATE + RAYS */}
                <div className="absolute inset-0 pointer-events-none z-30 scale-100">
                    <Image
                        src={GATE}
                        alt="Arch Decoration"
                        fill
                        className="object-cover object-center z-50"
                        sizes="95vw"
                        priority
                    />

                    <div className="absolute inset-0 z-20">
                        <LightRays
                            raysColor="#F2E6BA"
                            raysSpeed={2}
                            lightSpread={2}
                            raysOrigin="top-left"
                        />
                    </div>
                </div>

                {/* TEXT */}
                <div className="absolute inset-0 z-40 flex flex-col items-center justify-center text-center text-white drop-shadow-lg">

                    {/* Groom */}
                    <h1
                        className="
              -translate-x-4 translate-y-2
              md:-translate-x-32 md:translate-y-8
              playfair-italic
              text-4xl sm:text-5xl md:text-8xl
              mb-1 md:mb-4
              text-red-900
              drop-shadow-md
            "
                    >
                        Pranav
                    </h1>

                    {/* Weds */}
                    <h1
                        className="
              relative z-50
              font-ballet
              text-3xl sm:text-4xl md:text-6xl
              my-1 md:my-2
              bg-[linear-gradient(to_right,#BF953F,#FCF6BA,#B38728,#FBF5B7,#AA771C)]
              bg-clip-text text-transparent
              drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]
              py-1 md:py-2
              px-4 md:px-6
              leading-relaxed
            "
                    >
                        Weds
                    </h1>

                    {/* Bride */}
                    <h1
                        className="
              translate-x-4 -translate-y-2
              md:translate-x-32 md:-translate-y-8
              playfair-italic
              text-4xl sm:text-5xl md:text-8xl
              mt-1 md:mt-4
              text-red-900
              drop-shadow-md
            "
                    >
                        Ananya
                    </h1>

                    {/* Date */}
                    <p
                        className="
              font-serif
              text-xs sm:text-sm md:text-2xl
              tracking-[0.2em]
              uppercase
              opacity-90
              mt-6 md:mt-12
              text-amber-100/90
            "
                    >
                        Save the Date
                    </p>

                    <FrontLamps />
                </div>

                {/* WARM OVERLAY */}
                <div className="absolute inset-0 bg-orange-300 opacity-[2%] mix-blend-overlay z-30" />
            </div>

            {/* FLOWERS */}
            <div
                className="
          absolute bottom-2/12
          w-full
          h-[70svh] md:h-[100vh] md:translate-y-11/12 lg:translate-y-11/12
          z-50
          pointer-events-none
          sm:h-full
        "
            >
                <Image
                    src={FLOWERS}
                    alt="Floral Decoration"
                    fill
                    className="object-contain object-bottom scale-110 md:scale-105"
                    priority
                    sizes="100vw"
                />
            </div>
        </div>
    );
}
