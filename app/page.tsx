import Image from "next/image";
import Hero from "@/app/components/Hero";
import Flowers from "@/app/components/Flowers";

export default function Home() {
  return (
      <div>
        <Hero />
          {/*<Flowers />*/}
          <Hero />
      </div>
  );
}
