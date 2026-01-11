"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const FRONT_LAMPS = [
    "/front-lamp-1.png",
    "/front-lamp-2.png",
    "/front-lamp-3.png",
];

type LampStyle = {
    left: string;
    width: string;
    swingDuration: string;
};

export default function FrontLamps() {
    const containerRef = useRef<HTMLDivElement>(null);

    // We need TWO refs per lamp now: one for the parallax wrapper, one for the intro wrapper
    const parallaxRefs = useRef<(HTMLDivElement | null)[]>([]);
    const introRefs = useRef<(HTMLDivElement | null)[]>([]);

    const [lampStyles, setLampStyles] = useState<LampStyle[]>([]);
    const [mounted, setMounted] = useState(false);

    // 1. Setup Random Positions
    useEffect(() => {
        const styles = FRONT_LAMPS.map((_, i) => {
            const zoneSize = 100 / FRONT_LAMPS.length;
            const left = i * zoneSize + (Math.random() * (zoneSize - 10));

            return {
                left: `${left}%`,
                width: `${Math.random() * 4 + 8}rem`,
                swingDuration: `${Math.random() * 2 + 3}s`,
            };
        });
        setLampStyles(styles);
        setMounted(true);
    }, []);

    // 2. GSAP Animations
    useGSAP(() => {
        if (!mounted) return;

        // A. INTRO ANIMATION (Uses the Inner 'introRefs')
        // Floats the lamps UP from lower down (y: 200 -> 0)
        gsap.fromTo(introRefs.current,
            {
                y: 1000,
                opacity: 0,
                scale:0.7,
            },
            {
                y: 350,
                opacity: 1,
                duration: 3,
                ease: "power3.out",
                stagger: 0.2, // Wave effect
            }
        );

        // B. SCROLL PARALLAX (Uses the Outer 'parallaxRefs')
        // Moves the whole group UP into the sky as you scroll (y: 0 -> -500)
        // Since this targets a DIFFERENT div, it will never conflict with the Intro.
        parallaxRefs.current.forEach((el, i) => {
            if (!el) return;

            // Add a little variation in speed for depth
            const speed = 1 + (i * 0.2);

            gsap.to(el, {
                y: -400 * speed, // Move up 400px (multiplied by speed factor)
                ease: "none",
                scrollTrigger: {
                    trigger: document.body,
                    start: "top top",
                    end: "bottom top",
                    scrub: 1, // Smooth catch-up
                }
            });
        });

    }, { scope: containerRef, dependencies: [mounted] });

    if (!mounted) return null;

    return (
        <div ref={containerRef} className="absolute inset-0 z-50 pointer-events-none w-full h-full overflow-hidden">
            {FRONT_LAMPS.map((src, i) => (
                // 1. POSITIONING CONTAINER
                <div
                    key={`front-lamp-${i}`}
                    className="absolute top-0"
                    style={{
                        left: lampStyles[i]?.left || "0",
                        width: lampStyles[i]?.width || "10rem",
                        height: "auto",
                        aspectRatio: "1/2.5",
                    }}
                >
                    {/* 2. PARALLAX WRAPPER (Controlled by ScrollTrigger) */}
                    <div ref={(el) => { if(el) parallaxRefs.current[i] = el }} className="w-full h-full">

                        {/* 3. INTRO WRAPPER (Controlled by GSAP Intro) */}
                        <div ref={(el) => { if(el) introRefs.current[i] = el }} className="w-full h-full">

                            {/* 4. SWING WRAPPER (Controlled by CSS) */}
                            <div
                                className="w-full h-full origin-top"
                                style={{
                                    animation: `swing ${lampStyles[i]?.swingDuration} ease-in-out infinite alternate`,
                                }}
                            >
                                <Image
                                    src={src}
                                    alt="Foreground Lamp"
                                    fill
                                    className="object-contain object-top blur-[1px] opacity-90"
                                    sizes="33vw"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            <style jsx global>{`
                @keyframes swing {
                    0% { transform: rotate(3deg); }
                    100% { transform: rotate(-3deg); }
                }
            `}</style>
        </div>
    );
}