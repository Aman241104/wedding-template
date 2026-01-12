"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// REMOVED: import { random } from "mathjs";
// Replaced with gsap.utils.random()

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

    const backParallaxRefs = useRef<(HTMLDivElement | null)[]>([]);
    const backIntroRefs = useRef<(HTMLDivElement | null)[]>([]);

    const midParallaxRefs = useRef<(HTMLDivElement | null)[]>([]);
    const midIntroRefs = useRef<(HTMLDivElement | null)[]>([]);

    const [backLampStyles, setBackLampStyles] = useState<LampStyle[]>([]);
    const [midLampStyles, setMidLampStyles] = useState<LampStyle[]>([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // 1. Setup Back Lamps
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

        // 2. Setup Mid Lamps
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

        // --- ANIMATION GROUP 1: BACK LAMPS ---

        gsap.fromTo(backIntroRefs.current,
            {
                y: 200, // Start 200px lower
                opacity: 0,
                scale: gsap.utils.random(0.5, 0.8), // FIXED: Uses GSAP random
                filter: "blur(15px)",
            },
            {
                y: 0, // FIXED: Return to natural CSS top position
                opacity: 1,
                duration: 2,
                ease: "power2.out",
                stagger: 0.1,
                filter: "blur(5px)",
            }
        );

        // Scroll Parallax (Back)
        backParallaxRefs.current.forEach((el) => {
            if (!el) return;
            gsap.to(el, {
                y: -150,
                ease: "none",
                scrollTrigger: {
                    trigger: document.body,
                    start: "top top",
                    end: "bottom top",
                    scrub: 1,
                }
            });
        });

        // --- ANIMATION GROUP 2: MID LAMPS ---

        gsap.fromTo(midIntroRefs.current,
            {
                y: 250,
                opacity: 0,
                scale: gsap.utils.random(0.6, 0.9), // Slightly larger than back lamps,
                filter: "blur(10px)",
            },
            {
                y: 0,
                opacity: 1,
                duration: 2.2,
                ease: "power2.out",
                stagger: 0.15,
                filter: "blur(3px)",
            }
        );

        // Scroll Parallax (Mid)
        midParallaxRefs.current.forEach((el) => {
            if (!el) return;
            gsap.to(el, {
                y: -250,
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
            {/* LAYER 1: BACK LAMPS (z-[15]) */}
            <div className="absolute inset-0 z-[15] pointer-events-none w-full h-full">
                {BACK_LAMPS.map((src, i) => (
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
                        {/* Parallax Wrapper */}
                        <div ref={(el) => { if (el) backParallaxRefs.current[i] = el }} className="w-full h-full">
                            {/* Intro Wrapper */}
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

            {/* LAYER 2: MID LAMPS (z-[20] - in front of back lamps) */}
            <div className="absolute inset-0 z-[20] pointer-events-none w-full h-full">
                {MID_LAMPS.map((src, i) => (
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
                        {/* Parallax Wrapper */}
                        <div ref={(el) => { if (el) midParallaxRefs.current[i] = el }} className="w-full h-full">
                            {/* Intro Wrapper */}
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