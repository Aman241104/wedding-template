'use client'

import { useLayoutEffect, useRef, useCallback } from 'react';
import Lenis from 'lenis';

export const ScrollStackItem = ({ children, itemClassName = '' }) => (
    <div
        className={`scroll-stack-card relative w-full rounded-[40px] shadow-[0_0_40px_rgba(0,0,0,0.15)] box-border origin-top will-change-transform ${itemClassName}`.trim()}
        style={{
            backfaceVisibility: 'hidden',
            transformStyle: 'preserve-3d'
        }}
    >
        {children}
    </div>
);

const ScrollStack = ({
                         children,
                         className = '',
                         itemDistance = 100,
                         itemScale = 0.05,        // Positive: Cards on top are slightly larger/smaller depending on preference
                         itemStackDistance = 15,  // Visual offset when stacked
                         stackPosition = '15%',   // Screen trigger point
                         baseScale = 1,
                         useWindowScroll = true,
                     }) => {
    const scrollerRef = useRef(null);
    const cardsRef = useRef([]);
    const initialTopsRef = useRef([]);
    const lenisRef = useRef(null);

    const parsePercentage = useCallback((value, containerHeight) => {
        if (typeof value === 'string' && value.includes('%')) {
            return (parseFloat(value) / 100) * containerHeight;
        }
        return parseFloat(value);
    }, []);

    const updateCardTransforms = useCallback(() => {
        if (!cardsRef.current.length || !initialTopsRef.current.length) return;

        const scrollTop = useWindowScroll ? window.scrollY : scrollerRef.current.scrollTop;
        const viewportHeight = window.innerHeight;
        const stackPositionPx = parsePercentage(stackPosition, viewportHeight);

        // Get container metrics for the fix
        const containerRect = scrollerRef.current.getBoundingClientRect();
        // Since getBoundingClientRect is relative to viewport, we need absolute top relative to document if using window.scrollY
        const absoluteContainerTop = containerRect.top + (useWindowScroll ? window.scrollY : scrollerRef.current.scrollTop);
        const containerHeight = containerRect.height;

        cardsRef.current.forEach((card, i) => {
            const initialTop = initialTopsRef.current[i];
            const cardHeight = card.offsetHeight;

            // distance from card's original top to the container's top
            const relativeTopInContainer = initialTop - absoluteContainerTop;

            // TRIGGER CALCULATION
            const triggerPoint = initialTop - stackPositionPx - (i * itemStackDistance);

            let translateY = 0;
            let scale = baseScale;

            if (scrollTop >= triggerPoint) {
                // PIN the card
                translateY = scrollTop - triggerPoint;
            }

            // --- THE FIX ---
            // Calculate maximum allowed translateY for this card
            // It is the distance from its initial position to the bottom of the container, minus its own height and some padding.
            const bottomPadding = 50; // Buffer
            // We need to ensure we don't push it past the container bottom
            const maxTranslate = containerHeight - relativeTopInContainer - cardHeight - bottomPadding - (i * itemStackDistance);

            if (translateY > maxTranslate) {
                translateY = maxTranslate;
            }

            // APPLY TRANSFORMS
            card.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale})`;
            card.style.zIndex = i;
        });
    }, [baseScale, itemScale, itemStackDistance, stackPosition, useWindowScroll, parsePercentage]);

    useLayoutEffect(() => {
        const cards = Array.from(scrollerRef.current.querySelectorAll('.scroll-stack-card'));
        cardsRef.current = cards;

        // Measure positions un-transformed
        cards.forEach(card => card.style.transform = 'none');
        const scrollY = useWindowScroll ? window.scrollY : scrollerRef.current.scrollTop;
        initialTopsRef.current = cards.map(card => card.getBoundingClientRect().top + scrollY);

        const lenis = new Lenis({
            lerp: 0.1,
            smoothWheel: true,
        });

        lenis.on('scroll', updateCardTransforms);

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
        lenisRef.current = lenis;

        updateCardTransforms();

        return () => {
            lenis.destroy();
        };
    }, [updateCardTransforms, useWindowScroll]);

    return (
        <div
            ref={scrollerRef}
            className={`relative w-full ${useWindowScroll ? '' : 'h-screen overflow-y-auto'} ${className}`}
        >
            <div className="scroll-stack-inner flex flex-col items-center px-4 pb-[60vh]">
                {children}
            </div>
        </div>
    );
};

export default ScrollStack;