'use client'

import { useLayoutEffect, useRef, useCallback } from 'react';
import Lenis from 'lenis';

export const ScrollStackItem = ({ children, itemClassName = '' }) => (
    <div
        className={`scroll-stack-card relative w-full origin-top will-change-transform ${itemClassName}`.trim()}
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
                         itemDistance = 5,
                         itemScale = 0.05,        // Positive: Cards on top are slightly larger/smaller depending on preference
                         itemStackDistance = 5,  // Visual offset when stacked
                         stackPosition = '15%',   // Screen trigger point
                         baseScale = 1,
                         useWindowScroll = true,
                     }) => {
    const scrollerRef = useRef(null);
    const cardsRef = useRef([]);
    const lenisRef = useRef(null);

    // CACHED METRICS to avoid layout thrashing
    const metricsRef = useRef({
        initialTops: [],      // Array of initial top positions relative to document
        cardHeights: [],      // Array of card heights
        containerTop: 0,      // Container top relative to document
        containerHeight: 0,   // Container height
        stackPositionPx: 0,   // The calculated pixel value for stackPosition
        viewportHeight: 0     // Window height
    });

    const parsePercentage = useCallback((value, containerHeight) => {
        if (typeof value === 'string' && value.includes('%')) {
            return (parseFloat(value) / 100) * containerHeight;
        }
        return parseFloat(value);
    }, []);

    // 1. CALCULATE METRICS (Run on mount + resize)
    const calculateMetrics = useCallback(() => {
        if (!scrollerRef.current) return;

        const cards = cardsRef.current;
        const scrollY = useWindowScroll ? window.scrollY : scrollerRef.current.scrollTop;
        const viewportHeight = window.innerHeight;
        const containerRect = scrollerRef.current.getBoundingClientRect();

        // Calculate container metrics
        // absoluteTop = relativeTop + currentScroll
        const containerTop = containerRect.top + scrollY;
        const containerHeight = containerRect.height;
        const stackPositionPx = parsePercentage(stackPosition, viewportHeight);

        // Calculate card metrics
        const initialTops = cards.map(card => {
            // Reset transform temporarily to get accurate reading?
            // Ideally we measure once before any transforms applied, or assume they are reset by logic.
            // But since we are using transform, getBoundingClientRect might include it.
            // Getting offsetTop is safer relative to offsetParent if parent is positioned.
            // However, let's stick to the rect method but ensure we add back the current translation if needed.
            // For simplicity in this optimization, we assume this runs when layout is stable or we rely on the previous logic's robustness.
            // A safer way is:
            const rect = card.getBoundingClientRect();
            // We need the "untransformed" top ideally.
            // But if we are mid-scroll, the card already has transform.
            // Let's rely on the fact that we stored initialTopsRef in the original code.
            // We will re-calculate "initial" tops only if we assume the layout hasn't shifted structurally.
            return rect.top + scrollY - (new WebKitCSSMatrix(window.getComputedStyle(card).transform).m42 || 0);
        });

        const cardHeights = cards.map(card => card.offsetHeight);

        metricsRef.current = {
            initialTops,
            cardHeights,
            containerTop,
            containerHeight,
            stackPositionPx,
            viewportHeight
        };
    }, [stackPosition, useWindowScroll, parsePercentage]);


    // 2. UPDATE TRANSFORMS (Run on scroll - READS ONLY FROM CACHE)
    const updateCardTransforms = useCallback(() => {
        if (!cardsRef.current.length) return;

        const {
            initialTops,
            cardHeights,
            containerTop,
            containerHeight,
            stackPositionPx
        } = metricsRef.current;

        if (!initialTops.length) return;

        const scrollTop = useWindowScroll ? window.scrollY : scrollerRef.current.scrollTop;

        cardsRef.current.forEach((card, i) => {
            const initialTop = initialTops[i];
            const cardHeight = cardHeights[i];

            // distance from card's original top to the container's top
            const relativeTopInContainer = initialTop - containerTop;

            // TRIGGER CALCULATION
            const triggerPoint = initialTop - stackPositionPx - (i * itemStackDistance);

            let translateY = 0;
            let scale = baseScale;

            if (scrollTop >= triggerPoint) {
                // PIN the card
                translateY = scrollTop - triggerPoint;
            }

            // --- THE FIX ---
            const bottomPadding = 50;
            const maxTranslate = containerHeight - relativeTopInContainer - cardHeight - bottomPadding - (i * itemStackDistance);

            if (translateY > maxTranslate) {
                translateY = maxTranslate;
            }

            // APPLY TRANSFORMS
            card.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale})`;
            card.style.zIndex = i;
        });
    }, [baseScale, itemStackDistance, useWindowScroll]);

    useLayoutEffect(() => {
        const cards = Array.from(scrollerRef.current.querySelectorAll('.scroll-stack-card'));
        cardsRef.current = cards;

        // Initial Calculation
        calculateMetrics();

        // Resize Listener
        const handleResize = () => {
             // Reset transforms to get clean measurements?
             // Or just recalculate.
             cards.forEach(card => card.style.transform = 'none');
             calculateMetrics();
             updateCardTransforms();
        };

        window.addEventListener('resize', handleResize);

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

        // Initial update
        updateCardTransforms();

        return () => {
            lenis.destroy();
            window.removeEventListener('resize', handleResize);
        };
    }, [calculateMetrics, updateCardTransforms]);

    return (
        <div
            ref={scrollerRef}
            className={`relative w-full ${useWindowScroll ? '' : 'h-screen overflow-y-auto'} ${className}`}
        >
            <div className="scroll-stack-inner flex flex-col items-center px-4 pb-[10vh]">
                {children}
            </div>
        </div>
    );
};

export default ScrollStack;