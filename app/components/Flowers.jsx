import React from 'react'

const Flowers = () => {

    const FLOWERS = "/Hero-flowers.png";
    return (
        {/* FLOWERS */}
        <div
            className="
              absolute
            "
        >
            <Image
                src={FLOWERS}
                alt="Floral Decoration"
                fill
                className="object-contain object-bottom scale-100 md:scale-95 sm:scale-90"
                priority
                sizes="100vw"
            />
        </div>
    )
}
export default Flowers
