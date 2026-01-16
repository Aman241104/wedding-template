import type { Metadata } from "next";
import {
    Great_Vibes,
    Playfair_Display,
    Montserrat,
    Anek_Gujarati,
    Ballet,
    Amita
} from "next/font/google";
import "./globals.css";

//  "The Timeless Romantic" - Great Vibes for the main names
const greatVibes = Great_Vibes({
    weight: "400",
    subsets: ["latin"],
    variable: "--font-great-vibes",
    display: "swap",
});

//  "The Modern Classic" - Playfair Display for headers and dates
const playfair = Playfair_Display({
    subsets: ["latin"],
    variable: "--font-playfair",
    display: "swap",
});

//  "The Minimalist" - Montserrat for body text/UI elements
const montserrat = Montserrat({
    subsets: ["latin"],
    variable: "--font-montserrat",
    display: "swap",
});

const ballet = Ballet({
    weight: "400",
    subsets: ["latin"],
    variable: "--font-ballet",
    display: "swap",
});

//  Multi-script support for Gujarati/Hindi
const anek = Anek_Gujarati({
    subsets: ["latin", "gujarati"],
    variable: "--font-anek",
    display: "swap",
});

const amita = Amita({
    weight: ["400", "700"],
    subsets: ["latin", "devanagari"],
    variable: "--font-amita",
    display: "swap",
});

export const metadata: Metadata = {
    title: "Ananya Weds Pranav | Royal Wedding Celebration",
    description: "Join us in celebrating the union of Ananya and Pranav.",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html
            lang="en"
            suppressHydrationWarning
            className={`${ballet.variable} ${greatVibes.variable} ${playfair.variable} ${montserrat.variable} ${anek.variable} ${amita.variable}`}
        >
        <body className="font-sans antialiased bg-wedding-maroon text-wedding-cream">
        {children}
        </body>
        </html>
    );
}
