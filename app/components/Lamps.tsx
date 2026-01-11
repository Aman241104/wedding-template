"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Register Plugin
gsap.registerPlugin(ScrollTrigger);

const BACK_LAMPS = [
    "/back-lamp-1.png", "/back-lamp-2.png", "/back-lamp-3.png",
    "/back-lamp-4.png", "/back-lamp-5.png", "/back-lamp-6.png",
    "/back-lamp-7.png",
];

const MID_LAMPS = [
    "/mid-lamp-1.png", "/mid-lamp-2.png", "/mid-lamp-3.png", "/mid-lamp-4.png",
];

type LampStyle = {
    left: string;
    top: string;
    width: string;
    animationDelay: string;
};

export default function Lamps() {
    const containerRef = useRef<HTMLDivElement>(null);

    // Refs for GSAP Animations
    // We need separate refs for the 'Intro' (float up) and 'Parallax' (scroll) containers
    const backParallaxRefs = useRef<(HTMLDivElement | null)[]>([]);
    const backIntroRefs = useRef<(HTMLDivElement | null)[]>([]);

    const midParallaxRefs = useRef<(HTMLDivElement | null)[]>([]);
    const midIntroRefs = useRef<(HTMLDivElement | null)[]>([]);

    const [backLampStyles, setBackLampStyles] = useState<LampStyle[]>([]);
    const [midLampStyles, setMidLampStyles] = useState<LampStyle[]>([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // 1. Setup Back Lamps (7 items)
        const newBackStyles = BACK_LAMPS.map((_, i) => {
            const zoneSize = 100 / BACK_LAMPS.length;
            const randomOffset = Math.random() * (zoneSize - 5);
            const left = i * zoneSize + randomOffset;

            return {
                left: `${left}%`,
                top: `${Math.random() * 15 - 5}%`,
                width: `${Math.random() * 2 + 3}rem`,
                animationDelay: `${Math.random() * 2}s`,
            };
        });

        // 2. Setup Mid Lamps (4 items)
        const newMidStyles = MID_LAMPS.map((_, i) => {
            const zoneSize = 100 / MID_LAMPS.length;
            const randomOffset = Math.random() * (zoneSize - 10);
            const left = i * zoneSize + randomOffset + 5;

            return {
                left: `${left}%`,
                top: `${Math.random() * 20 + 10}%`,
                width: `${Math.random() * 3 + 5}rem`,
                animationDelay: `${Math.random() * 3}s`,
            };
        });

        setBackLampStyles(newBackStyles);
        setMidLampStyles(newMidStyles);
        setMounted(true);
    }, []);

    useGSAP(() => {
        if (!mounted) return;

        // --- ANIMATION GROUP 1: BACK LAMPS (Furthest away) ---

        // Intro: Float up gently
        gsap.fromTo(backIntroRefs.current,
            { y: 1000, opacity: 0 },
            { y: 300, opacity: 1, duration: 2, ease: "power2.out", stagger: 0.1 }
        );

        // Scroll: Parallax (Move SLOWLY because they are far away)
        backParallaxRefs.current.forEach((el) => {
            if (!el) return;
            gsap.to(el, {
                y: -150, // Move less distance than front lamps
                ease: "none",
                scrollTrigger: {
                    trigger: document.body,
                    start: "top top",
                    end: "bottom top",
                    scrub: 1,
                }
            });
        });

        // --- ANIMATION GROUP 2: MID LAMPS (Middle distance) ---

        // Intro: Float up
        gsap.fromTo(midIntroRefs.current,
            { y: 150, opacity: 0 },
            { y: 0, opacity: 1, duration: 2.2, ease: "power2.out", stagger: 0.15 }
        );

        // Scroll: Parallax (Move FASTER than back lamps, SLOWER than front lamps)
        midParallaxRefs.current.forEach((el) => {
            if (!el) return;
            gsap.to(el, {
                y: -250, // Medium speed
                ease: "none",
                scrollTrigger: {
                    trigger: document.body,
                    start: "top top",
                    end: "bottom top",
                    scrub: 1,
                }
            });
        });

    }, { scope: containerRef, dependencies: [mounted] });

    if (!mounted) return null;

    return (
        <div ref={containerRef}>
            {/* LAYER 1: BACK LAMPS */}
            <div className="absolute inset-0 z-15 pointer-events-none w-full h-full">
                {BACK_LAMPS.map((src, i) => (
                    // 1. Position Wrapper
                    <div
                        key={`back-lamp-${i}`}
                        className="absolute"
                        style={{
                            left: backLampStyles[i]?.left || "0",
                            top: backLampStyles[i]?.top || "0",
                            width: backLampStyles[i]?.width || "4rem",
                            height: "auto",
                            aspectRatio: "1/2",
                        }}
                    >
                        {/* 2. Parallax Wrapper */}
                        <div ref={(el) => { if (el) backParallaxRefs.current[i] = el }} className="w-full h-full">
                            {/* 3. Intro Wrapper */}
                            <div ref={(el) => { if (el) backIntroRefs.current[i] = el }} className="w-full h-full">
                                <Image
                                    src={src}
                                    alt="Decoration Lamp"
                                    fill
                                    className="object-contain object-top animate-pulse"
                                    style={{ animationDuration: '4s', animationDelay: backLampStyles[i]?.animationDelay }}
                                    sizes="10vw"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* LAYER 2: MID LAMPS */}
            <div className="absolute inset-0 z-[5] pointer-events-none w-full h-full">
                {MID_LAMPS.map((src, i) => (
                    // 1. Position Wrapper
                    <div
                        key={`mid-lamp-${i}`}
                        className="absolute"
                        style={{
                            left: midLampStyles[i]?.left || "0",
                            top: midLampStyles[i]?.top || "0",
                            width: midLampStyles[i]?.width || "6rem",
                            height: "auto",
                            aspectRatio: "1/2",
                        }}
                    >
                        {/* 2. Parallax Wrapper */}
                        <div ref={(el) => { if (el) midParallaxRefs.current[i] = el }} className="w-full h-full">
                            {/* 3. Intro Wrapper */}
                            <div ref={(el) => { if (el) midIntroRefs.current[i] = el }} className="w-full h-full">
                                <Image
                                    src={src}
                                    alt="Decoration Lamp"
                                    fill
                                    className="object-contain object-top animate-pulse"
                                    style={{ animationDuration: '5s', animationDelay: midLampStyles[i]?.animationDelay }}
                                    sizes="20vw"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}