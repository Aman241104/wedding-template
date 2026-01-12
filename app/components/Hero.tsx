"use client";

import Image from "next/image";
import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import LightRays from "@/components/LightRays";
import FireworksBackground from "@/components/FireworksBackground";
import Lamps from "@/app/components/Lamps";
import FrontLamps from "@/app/components/FrontLamps";
import Invite from "@/app/components/Invite";


const GATE = "/arch.png";
const HERO = "/image 1.png";
const FLOWERS = "/Hero-flowers.png";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);
    // 1. Create a ref for the arch image
    const archRef = useRef<HTMLImageElement>(null);
    const flowerRef = useRef<HTMLImageElement>(null);

    useGSAP(() => {
        const textElements = gsap.utils.toArray(".hero-text");

        // --- TEXT ANIMATIONS (Existing) ---
        // A. Intro: Blur In
        gsap.fromTo(textElements,
            { opacity: 0, filter: "blur(12px)", scale: 0.95 },
            { opacity: 1, filter: "blur(0px)", scale: 1, duration: 2, ease: "power3.out", stagger: 0.2 }
        );

        // B. Scroll: Float Up
        gsap.to(textElements, {
            y: -120,
            ease: "none",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "bottom top",
                scrub: 1.5,
            }
        });

        // --- ARCH ANIMATION (New) ---
        // Ensure ref exists before animating
        if (archRef.current) {
            gsap.fromTo(archRef.current,
                {
                    // Start state: Very blurry and slightly zoomed in
                    filter: "blur(15px)",
                    scale: 1, // A slight zoom emphasizes the de-blurring effect
                },
                {
                    // End state: 2px blur as requested and normal scale
                    filter: "blur(1px)",
                    scale: 1,
                    duration: 1.0, // Slow, dramatic intro
                    ease: "power2.out",
                }
            );
        }

        if (flowerRef.current) {
            gsap.fromTo(flowerRef.current,
                {
                    // Start state: Very blurry and slightly zoomed in
                    filter: "blur(15px)",
                    scale: 1, // A slight zoom emphasizes the de-blurring effect
                },
                {
                    // End state: 2px blur as requested and normal scale
                    filter: "blur(0.5px)",
                    scale: 1.05,
                    duration: 1.2, // Slow, dramatic intro
                    ease: "power2.out",
                }
            );
        }

    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="relative flex flex-col items-center justify-start min-h-svh overflow-hidden bg-wedding-maroon md:pt-6">

            {/* CARD */}
            <div
                className="
          relative
          w-[100vw] md:w-[95vw]
          h-[80vh] md:h-[92vh]
          rounded-b-none md:rounded-[3rem]
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
                {/* Removed scale-100 from parent div so GSAP can manage scale on the image itself */}
                <div className="absolute inset-0 pointer-events-none z-[100]">
                    <Image
                        ref={archRef} // 2. Attach the ref here
                        src={GATE}
                        alt="Arch Decoration"
                        fill
                        // Added initial blur class to prevent flash of unblurred image before JS loads
                        className="object-cover object-center z-50 blur-[25px]"
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

                {/* TEXT CONTAINER */}
                <div className="absolute inset-0 z-40 flex flex-col items-center justify-center text-center text-white drop-shadow-lg">

                    {/* Groom */}
                    <h1
                        className="hero-text
              -translate-x-20 translate-y-10 text-8xl
              md:-translate-x-32 md:translate-y-8
              playfair-italic
              sm:text-5xl md:text-8xl
              mb-1 md:mb-4
              text-red-900
              drop-shadow-md
            "
                    >
                        Pranav
                    </h1>

                    {/* Weds */}
                    <h1
                        className="hero-text
                        -translate-x-4
              relative z-50
              font-ballet
              text-6xl sm:text-4xl md:text-6xl
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
                        className="hero-text
              translate-x-20 -translate-y-17
              md:translate-x-32 md:-translate-y-8
              playfair-italic
              text-8xl sm:text-5xl md:text-8xl
              mt-1 md:mt-4
              text-red-900
              drop-shadow-md
            "
                    >
                        Ananya
                    </h1>

                    {/* Date */}
                    <p
                        className="hero-text
              font-serif
              text-xl sm:text-xl md:text-2xl
              tracking-[0.2em]
              uppercase
              opacity-90
              mt-6 md:mt-12
              text-amber-100/90
            "
                    >
                        Save the Date
                    </p>
                    <p
                        className="hero-text
              font-serif
              text-2xl sm:text-xl md:text-2xl
              tracking-[0.2em]
              uppercase
              opacity-90
              mt-6 md:mt-12
              text-amber-100/90
            "
                    >
                        19th January 2025
                    </p>

                    <FrontLamps />
                </div>

                {/* WARM OVERLAY */}
                <div className="absolute inset-0 bg-orange-300 opacity-5 mix-blend-overlay z-30" />
            </div>

            {/* FLOWERS */}
            <div
                className="
          absolute bottom-30
          w-full
          h-[70svh] md:-bottom-96 lg:-bottom-25
          z-50
          pointer-events-none
          sm:h-full
        "
            >
                <Image
                    src={FLOWERS}
                    ref={flowerRef}
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