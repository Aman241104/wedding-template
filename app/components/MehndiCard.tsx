import Image from 'next/image'

type MehndiCardProps = {
    title: string
    subtitle: string
    date: string
    month: string
    time: string
    venue: string
    corner: string
    main: string
}

const MehndiCard = ({
                        title,
                        subtitle,
                        date,
                        month,
                        time,
                        venue,
                        corner,
                        main
                    }: MehndiCardProps) => {
    return (
        <div className="relative w-full min-h-screen bg-wedding-maroon/0 flex items-center justify-center p-4 md:p-8">
            
            {/* CARD CONTAINER */}
            <div className="
                relative w-full max-w-6xl
                bg-white
                border-[12px] border-double border-amber-400
                shadow-2xl rounded-sm
                overflow-hidden
                flex flex-col md:flex-row
                min-h-[80vh]
            ">
                
                {/* DECORATIVE CORNER (Top Right) */}
                 <Image
                    src={corner}
                    alt=""
                    width={400}
                    height={400}
                    className="absolute top-0 right-0 w-[40%] md:w-[25%] pointer-events-none z-10 opacity-90"
                    draggable={false}
                />
                 {/* DECORATIVE CORNER (Bottom Left - Rotated) */}
                 <Image
                    src={corner}
                    alt=""
                    width={400}
                    height={400}
                    className="absolute top-0 left-0 w-[40%] md:w-[25%] pointer-events-none z-10 opacity-90 scale-x-[-1]"
                    draggable={false}
                />

                {/* LEFT SIDE: IMAGE */}
                <div className="w-full md:w-1/2 relative min-h-[40vh] md:min-h-full bg-orange-50/50">
                    <Image
                        src={main}
                        alt={title}
                        fill
                        className="object-cover object-center"
                        draggable={false}
                    />
                </div>

                {/* RIGHT SIDE: TEXT */}
                <div className="w-full md:w-1/2 relative flex flex-col justify-center items-center text-center p-8 md:p-12 z-20">
                    
                    {/* Header */}
                    <div className="mb-8">
                        <p className="font-serif text-sm md:text-base tracking-[0.2em] text-amber-700 mb-4 uppercase">
                            Moments of Happiness
                        </p>
                        <h1 className="font-amita text-6xl md:text-8xl text-red-800 mb-2">
                            {title}
                        </h1>
                         <h2 className="font-playfair italic text-4xl md:text-5xl text-amber-600">
                            & {subtitle}
                        </h2>
                    </div>

                    {/* Date */}
                    <div className="flex flex-col items-center mb-8 border-y-2 border-amber-200 py-6 w-3/4">
                        <span className="font-serif text-xl tracking-widest text-gray-600 mb-2">
                             {date} {month}
                        </span>
                        <span className="font-playfair text-5xl md:text-6xl text-red-900 font-bold">
                            2025
                        </span>
                        <span className="font-serif text-lg text-amber-700 mt-2 italic">
                            {time}
                        </span>
                    </div>

                    {/* Venue */}
                     <div>
                        <p className="font-serif text-gray-500 text-sm tracking-widest uppercase mb-2">
                            At Our Residence
                        </p>
                        <p className="font-playfair text-xl md:text-2xl text-red-900 font-medium max-w-xs mx-auto">
                            {venue}
                        </p>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default MehndiCard
