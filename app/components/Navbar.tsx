// "use client";
//
// import { useState, useEffect } from "react";
// import Link from "next/link";
//
// // Navigation items extracted from the visual description
// // const NAV_ITEMS =;
//
// export default function Navbar() {
//     const = useState(false);
//     const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//
//     //  Transparent Navbar logic
//     // Adds a background color only when the user scrolls down
//     useEffect(() => {
//         const handleScroll = () => {
//             setIsScrolled(window.scrollY > 50);
//         };
//         window.addEventListener("scroll", handleScroll);
//         return () => window.removeEventListener("scroll", handleScroll);
//     },);
//
//     return (
//         <nav
//             className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out ${
//                 isScrolled
//                     ? "bg-wedding-maroon/90 backdrop-blur-md shadow-2xl py-2"
//                     : "bg-transparent py-6"
//             }`}
//         >
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                 <div className="flex justify-center items-center h-16 relative">
//
//                     {/* Mobile Menu Toggle (Left aligned on mobile) */}
//                     <div className="absolute left-0 flex md:hidden">
//                         <button
//                             onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//                             className="text-wedding-gold hover:text-white p-2"
//                         >
//                             <span className="sr-only">Open menu</span>
//                             {isMobileMenuOpen? (
//                                 // Close Icon
//                                 <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                                 </svg>
//                             ) : (
//                                 // Hamburger Icon
//                                 <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//                                 </svg>
//                             )}
//                         </button>
//                     </div>
//
//                     {/* Desktop Navigation Links - Centered Layout */}
//                     <div className="hidden md:flex space-x-8 lg:space-x-12">
//                         {NAV_ITEMS.map((item) => (
//                             <Link
//                                 key={item.name}
//                                 href={item.href}
//                                 className="text-wedding-cream/80 hover:text-wedding-gold transition-colors duration-300 font-serif italic text-lg tracking-wide relative group"
//                             >
//                                 {item.name}
//                                 {/* Hover Underline Effect */}
//                                 <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-wedding-gold transition-all duration-300 group-hover:w-full"></span>
//                             </Link>
//                         ))}
//                     </div>
//
//                 </div>
//             </div>
//
//             {/* Mobile Menu Overlay */}
//             <div
//                 className={`md:hidden absolute w-full bg-wedding-maroon/95 backdrop-blur-xl border-t border-wedding-gold/20 transition-all duration-300 overflow-hidden ${
//                     isMobileMenuOpen? "max-h-96 opacity-100" : "max-h-0 opacity-0"
//                 }`}
//             >
//                 <div className="px-4 pt-2 pb-6 space-y-2 flex flex-col items-center">
//                     {NAV_ITEMS.map((item) => (
//                         <Link
//                             key={item.name}
//                             href={item.href}
//                             className="text-wedding-cream text-lg font-serif py-3 hover:text-wedding-gold transition-colors"
//                             onClick={() => setIsMobileMenuOpen(false)}
//                         >
//                             {item.name}
//                         </Link>
//                     ))}
//                 </div>
//             </div>
//         </nav>
//     );
// }