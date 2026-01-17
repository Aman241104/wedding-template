'use client'

type MehndiCardProps = {
    title: string
    subtitle: string
    date: string
    month: string
    time: string
    venue: string
}

const MehndiCard = ({
                        title,
                        subtitle,
    date,
                        month,
                        time,
                        venue
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
                src="/haldi-corner.png"
                alt=""
                className="absolute top-0 right-0 w-[55%] pointer-events-none z-10"
                draggable={false}
            />

            {/* Main layout */}
            <div className="grid grid-cols-1 md:grid-cols-[45%_55%] min-h-[420px]">

                {/* LEFT: illustration */}
                <div className="relative flex items-end justify-center md:pb-6">
                    <img
                        src="/haldi-main.png"
                        alt="Haldi Ceremony"
                        className="absolute z-0  w-[100%] md:w-full md:scale-110 top-0"
                        draggable={false}
                    />
                </div>

                {/* RIGHT: text */}
                <div className="relative flex flex-col justify-center px-6 md:pr-10 md:pl-0 text-[#8B1E1E] py-8 md:py-0 text-center md:text-left">

                    <h1 className=" absolute -top-12 left-30 text-[64px] md:text-[80px] font-amita leading-none mb-2">
                        {title}
                    </h1>

                    <p className="absolute italic -top-26 -left-3 text-3xl md:text-4xl mb-8 [-webkit-text-stroke:2px_#F3DFC6] relative z-10 font-[700]">
                        {subtitle}
                    </p>

                    <div className="mb-6">
                        <p className="absolute right-45 text-5xl md:text-6xl font-bold leading-none mb-1">{date}</p>
                        <p className="absolute right-6 pt-1 text-3xl md:text-6xl font-bold leading-none mb-1">{month}</p>
                        <p className="absolute right-26 pt-8 italic text-lg md:text-xl">{time}</p>
                    </div>

                    <p className="absolute bottom-8 right-8 text-base font-medium max-w-[320px] leading-snug mx-auto md:mx-0">
                        {venue}
                    </p>

                </div>
            </div>
        </div>
    )
}

export default MehndiCard
