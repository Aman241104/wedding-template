"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// REMOVED: import { random } from "mathjs";
// We will use gsap.utils.random instead (it's built-in)

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

    const parallaxRefs = useRef<(HTMLDivElement | null)[]>([]);
    const introRefs = useRef<(HTMLDivElement | null)[]>([]);

    const [lampStyles, setLampStyles] = useState<LampStyle[]>([]);
    const [mounted, setMounted] = useState(false);

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

    useGSAP(() => {
        if (!mounted) return;

        // A. INTRO ANIMATION
        gsap.fromTo(introRefs.current,
            {
                y: 1000,
                opacity: 0,
                // FIXED: Use GSAP's built-in random utility
                scale: gsap.utils.random(0.5, 0.6),
                filter: "blur(10px)",
            },
            {
                // NOTE: y: 350 means they will hang 350px down from the top.
                // If you want them attached to the top edge, change this to y: 0.
                y: 350,
                opacity: 1,
                duration: 3,
                ease: "power3.out",
                stagger: 0.2,
                filter: "blur(2px)",
            }
        );

        // B. SCROLL PARALLAX
        parallaxRefs.current.forEach((el, i) => {
            if (!el) return;

            const speed = 1 + (i * 0.2);

            gsap.to(el, {
                y: -400 * speed,
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
        <div ref={containerRef} className="absolute inset-0 z-50 pointer-events-none w-full h-full overflow-hidden">
            {FRONT_LAMPS.map((src, i) => (
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
                    <div ref={(el) => { if(el) parallaxRefs.current[i] = el }} className="w-full h-full">
                        <div ref={(el) => { if(el) introRefs.current[i] = el }} className="w-full h-full">
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