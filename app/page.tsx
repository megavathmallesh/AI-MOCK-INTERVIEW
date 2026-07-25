import { Button } from "@/components/ui/button";
import Image from "next/image";
import Header from "./_components/Header";
import Hero from "./_components/Hero";
import HowItWorks from "./_components/HowItWorks";
export default function Home() {
  return (
     <div>  
       {/* Header Section*/}
       <Header />
       {/* Hero Section*/}
       <Hero />
       
       {/* How It Works Section */}
       <HowItWorks />

     </div>
  );
};
