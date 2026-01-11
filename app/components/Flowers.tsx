import React from 'react'
import Image from "next/image";

const Flowers = () => {
    const FLOWERS = "/Hero-flowers.png";
    return (
        <>
            <div className="w-[100vw] h-[100vh] z-30 pointer-events-none">
                <Image
                    src={FLOWERS}
                    alt="Floral Decoration"
                    fill
                    // object-bottom ensures the flowers stick to the bottom edge
                    className=""
                    priority
                    sizes="100vw"
                />
            </div>
        </>
    )
}
export default Flowers
