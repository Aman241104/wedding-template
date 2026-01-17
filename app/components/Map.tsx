const Map = () => {
    return (
        <section className="relative w-full min-h-[500px] flex items-center justify-center py-10 px-4 md:px-20 bg-[#F3DFC6]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl">

                {/* Left: Map */}
                <div className="relative w-full h-[400px] md:h-[500px] rounded-[28px] overflow-hidden shadow-xl border-[4px] border-[#8B1E1E]">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3556.124619427144!2d75.82393327612085!3d26.96316685794806!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db1d856d81765%3A0xc304a9e436815802!2sThe%20Leela%20Palace%20Jaipur!5e0!3m2!1sen!2sin!4v1705476000000!5m2!1sen!2sin"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen={true}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="filter grayscale-[20%] contrast-[1.1]"
                    ></iframe>
                </div>

                {/* Right: Venue Info */}
                <div className="flex flex-col justify-center text-center md:text-left text-[#8B1E1E]">
                    <h2 className="text-4xl md:text-6xl font-amita mb-4">
                        The Venue
                    </h2>
                    <h3 className="text-3xl md:text-5xl font-script mb-6">
                        The Leela Palace
                    </h3>
                    <p className="text-lg md:text-xl font-medium max-w-md mx-auto md:mx-0">
                        Jaipur, Rajasthan
                    </p>
                    <div className="mt-8">
                        <a
                            href="https://maps.app.goo.gl/TheLeelaPalaceJaipur" // Placeholder link
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block border-2 border-[#8B1E1E] px-8 py-3 rounded-full hover:bg-[#8B1E1E] hover:text-[#F3DFC6] transition-colors duration-300 font-medium"
                        >
                            Get Directions
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Map
