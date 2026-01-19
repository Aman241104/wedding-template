'use client'

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
        <div
            className="
        relative
        w-full
        max-w-[900px]
        mx-auto
        rounded-[28px]
        bg-[#F3DFC6]
        border-[4px] border-[#8B1E1E]
        shadow-xl
        overflow-hidden
      "
        >
            {/* Hanging decor */}
            <img
                src={corner}
                alt=""
                className="absolute top-0 right-0 w-[55%] pointer-events-none z-10"
                draggable={false}
            />

            {/* Main layout */}
            <div className="grid grid-cols-1 md:grid-cols-[45%_55%] min-h-[420px]">

                {/* LEFT: illustration */}
                <div className="relative flex items-end justify-center md:pb-6">
                    <img
                        src={main}
                        alt="Haldi Ceremony"
                        className="absolute right-10 z-0 -bottom-56 scale-150 lg:right-0 lg:bottom-0"
                        draggable={false}
                    />
                </div>

                {/* RIGHT: text */}
                <div className="relative flex flex-col justify-center md:pr-10 md:pl-0 text-[#8B1E1E] py-8 text-center md:text-left">

                    <h1 className=" absolute -top-10 left-8 text-[64px] md:text-[80px] font-amita leading-none mb-2 md:top-6 md:-left-40">
                        {title}
                    </h1>

                    <p className="absolute italic -top-26 -left-2 text-3xl md:text-4xl mb-8 [-webkit-text-stroke:1px_#F3DFC6] relative z-10 font-[700] md:-left-30 md:-top-22">
                        {subtitle}
                    </p>

                    <div className="mb-6 -translate-y-15">
                        <p className="absolute right-45 text-5xl md:text-6xl font-bold leading-none mb-1 md:-left-40 md:top-2 lg:top-20">{date}</p>
                        <p className="absolute right-6 pt-1 text-3xl md:text-6xl font-bold leading-none mb-1 md:-left-20 md:top-1 lg:top-19">{month}</p>
                        <p className="absolute right-26 pt-8 italic text-lg md:text-xl md:-left-20 md:top-8 lg:top-25">{time}</p>
                    </div>

                    <p className="absolute -translate-y-15 bottom-8 right-8 text-base font-medium max-w-[320px] leading-snug mx-auto md:mx-0 md:left-20 md:pt-20 md:text-xl lg:-translate-y-5 lg:text-xl">
                        {venue}
                    </p>

                </div>
            </div>
        </div>
    )
}

export default MehndiCard
