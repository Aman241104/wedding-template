"use client";

import { Fireworks } from "@fireworks-js/react";
import type { FireworksHandlers } from "@fireworks-js/react";
import { useRef } from "react";

export default function FireworksBackground() {
    const ref = useRef<FireworksHandlers>(null);

    return (
        <Fireworks
            ref={ref}
            options={{
                opacity: 1, // FIXED: Changed from 1.7 to 1 (max visibility)
                particles: 50,
                explosion: 5,
                intensity: 30,
                friction: 0.97,
                gravity: 1,

                // OPTION A: If you want strictly Red/Orange colors (Hue 0-30)
                hue: {
                    min: 0,
                    max: 40, // Expanded slightly so it's not just monotone red
                },

                // OPTION B (Better for Wedding): Comment out 'hue' above and use specific colors
                // colors: ["#FFD700", "#FFA500", "#FF4500"], // Gold & Orange

                delay: {
                    min: 30,
                    max: 60,
                },
                brightness: {
                    min: 50,
                    max: 100,
                },
                decay: {
                    min: 0.015,
                    max: 0.03,
                },
                mouse: {
                    click: false,
                    move: false,
                    max: 1,
                },
            }}
            style={{
                top: 0,
                left: 0,
                width: "180%",
                height: "180%",
                position: "absolute",
                background: "transparent",
                zIndex: 15,
            }}
        />
    );
}