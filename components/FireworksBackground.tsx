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
                opacity: 0.5,
                particles: 50,
                explosion: 5,
                intensity: 30,
                friction: 0.97,
                gravity: 1.5,
                // You can adjust these colors to match your wedding theme
                hue: {
                    min: 0,
                    max: 360,
                },
                delay: {
                    min: 30,
                    max: 60,
                },
                brightness: {
                    min: 50,
                    max: 80,
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
            // This class makes it fill the parent container
            style={{
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                position: "absolute",
                background: "transparent",
                zIndex: 15, // Ensure it sits behind content
            }}
        />
    );
}