"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Antigravity from "./components/Antaigravity";
import CircularText from "./components/CircularText";

const chakras = [
  { name: "Crown", color: "#ffffff", desc: "Consciousness • Bliss • Unity" },
  {
    name: "Third Eye",
    color: "#8b5cff",
    desc: "Intuition • Awareness • Vision",
  },
  { name: "Throat", color: "#3bbcff", desc: "Expression • Truth • Voice" },
  { name: "Heart", color: "#3bffb6", desc: "Love • Compassion • Connection" },
  { name: "Solar Plexus", color: "#ffd93b", desc: "Power • Confidence • Will" },
  { name: "Sacral", color: "#ff8c42", desc: "Creativity • Desire • Flow" },
  { name: "Root", color: "#ff3b3b", desc: "Stability • Grounding • Survival" },
];

export default function Home() {
  const [active, setActive] = useState<number | null>(null);
  const router = useRouter();

  return (
    <div className="relative">
      <div
        style={{
          width: "100%",
          height: "100vh",
          position: "absolute",
          zIndex: 2,
          opacity: "0.5",
        }}
      >
        <Antigravity
          count={600}
          magnetRadius={6}
          ringRadius={4}
          waveSpeed={0.4}
          waveAmplitude={1}
          particleSize={1}
          lerpSpeed={0.05}
          color="#bc6746"
          autoAnimate
          particleVariance={0.5}
          rotationSpeed={0}
          depthFactor={0.1}
          pulseSpeed={2}
          particleShape="sphere"
          fieldStrength={10}
        />
      </div>
      <main className="min-h-screen w-full bg-black text-white flex flex-col items-center justify-center relative overflow-hidden ">
        {/* Full Background Section Image */}

        <div className="absolute inset-0 z-0 pointer-events-none  mix-blend-screen w-full h-screen">
          <img
            src="/bg-images.webp"
            alt="Meditating figure"
            className="w-full h-full object-cover object-center "
          />
        </div>

        {/* Dynamic Background Glow */}
        <div
          className="absolute inset-0 transition-opacity duration-1000 z-0 pointer-events-none"
          // style={{
          //   background:
          //     active !== null
          //       ? `radial-gradient(circle at center, ${chakras[active].color}25, transparent 60%)`
          //       : "radial-gradient(circle at center, #222222 0%, transparent 60%)",
          // }}
        />

        <div className="relative  w-full flex flex-col items-center justify-between mt-6">
          <div className="flex flex-col items-center  justify-center">
            {/* Center Focus Area */}
            <div className="relative flex flex-col items-center justify-center h-full w-full min-h-[60vh] md:min-h-[80vh] pt-[15vh]">
              <h1 className="text-[8vw] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:text-[4vw] font-light tracking-widest text-center uppercase mb-3 z-10 w-[80vw]"></h1>
              <CircularText
                text="Yoga ✦ Sound Healing ✦ Retreats ✦ Feminine Circles "
                onHover="speedUp"
                spinDuration={20}
                className="custom-class"
              />
            </div>
            {/*
          <div className="relative flex flex-col items-center justify-between h-full space-y-10 md:space-y-14 w-full">
            {chakras.map((chakra, index) => (
              <div
                key={index}
                onMouseEnter={() => setActive(index)}
                onMouseLeave={() => setActive(null)}
                onClick={() => setActive(index)}
                className="relative flex items-center justify-center w-full cursor-pointer group"
              >
                <div
                  className={`relative z-20 w-6 h-6 rounded-full transition-all duration-500 ease-out ${
                    active === index ? "scale-150" : "scale-100 group-hover:scale-125"
                  }`}
                  style={{
                    backgroundColor: chakra.color,
                    boxShadow:
                      active === index
                        ? `0 0 30px ${chakra.color}, 0 0 60px ${chakra.color}`
                        : `0 0 15px ${chakra.color}`,
                  }}
                >
                  {active === index && (
                    <div 
                      className="absolute inset-0 rounded-full animate-ping opacity-60"
                      style={{ backgroundColor: chakra.color }}
                    />
                  )}
                </div>

                <div 
                  className={`absolute left-1/2 ml-8 md:ml-12 lg:ml-20 flex flex-col justify-center transition-all duration-500 pointer-events-none
                    ${
                      active === index
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 -translate-x-4"
                    }
                  `}
                >
                  <p 
                    className="text-lg md:text-2xl font-semibold tracking-wide drop-shadow-md whitespace-nowrap"
                    style={{ color: chakra.color }}
                  >
                    {chakra.name}
                  </p>
                  <p className="text-xs md:text-sm text-gray-300 drop-shadow-sm whitespace-nowrap">
                    {chakra.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
          */}
            {/* CTA */}
          </div>
        </div>
      </main>
    </div>
  );
}
