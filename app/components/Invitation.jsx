import React from 'react'
import Invite from './Invite'

const Invitation = () => {
    return (
        <section className="absolute -bottom-10/12 w-full min-h-screen flex flex-col md:flex-row items-center justify-center overflow-hidden bg-wedding-maroon z-0">

            {/* LEFT COLUMN */}
            <div className="relative w-full md:w-1/2 h-[55vh] md:h-screen flex items-center justify-center z-10">
                <Invite />
            </div>

            {/* RIGHT COLUMN */}
            <div className="z-40 flex flex-col items-center md:items-start justify-center w-full md:w-1/2 p-8 text-white drop-shadow-lg text-center md:text-left max-w-xl">

                {/* YOU ARE */}
                <h1 className="playfair-italic text-5xl md:text-6xl text-amber-50 leading-tight">
                    YOU ARE
                </h1>

                {/* Invited */}
                <h2 className="font-ballet text-5xl md:text-7xl text-amber-100 -mt-2 mb-6">
                    Invited
                </h2>

                {/* Body text */}
                <p className="font-serif text-base md:text-lg leading-relaxed text-amber-100/90 mb-4">
                    We are overjoyed to share this auspicious beginning with you!
                    As we embark on this sacred journey of togetherness, we would
                    be honored to have you join us in celebrating our union.
                </p>

                <p className="font-serif text-base md:text-lg leading-relaxed text-amber-100/90 mb-4">
                    Here, you’ll find all the details you need — our story, the
                    schedule for the Haldi, Sangeet, and Wedding, venue
                    information, RSVP, and more.
                </p>

                <p className="font-serif text-base md:text-lg leading-relaxed text-amber-100/90 mb-8">
                    Your presence and blessings mean the world to us as we unite
                    our families and hearts. We can’t wait to create unforgettable
                    memories with you. Let’s celebrate tradition, love, and a
                    lifetime of happiness!
                </p>

                {/* Signature */}
                <p className="font-serif text-lg text-amber-200">
                    With Love,
                    <br />
                    <span className="font-semibold">Ananya & Pranav</span>
                </p>

            </div>
        </section>
    )
}

export default Invitation
