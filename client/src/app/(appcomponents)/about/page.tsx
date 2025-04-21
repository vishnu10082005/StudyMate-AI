"use client"
import Image from "next/image";
import React from "react";
import { Timeline } from "@/components/ui/timeline";

export default function About() {
  const data = [
    {
      title: "Company's Journey",
      content: (
        <div>
          <p className="text-[#F0F0F0] text-sm md:text-base font-medium leading-relaxed mb-8 tracking-wide">
            StudyMate AI was founded by educators and technologists to revolutionize learning through AI.
            We&apos;ve grown into a cutting-edge platform making education more{' '}
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent font-bold">
              accessible and personalized
            </span>.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {["/T1-1.png", "/T1-2.png", "/T1-3.png", "/T1-4.png"].map((src, index) => (
              <div
                key={index}
                className="relative aspect-[560/460] overflow-hidden group rounded-lg hover:shadow-[0_0_28px_rgba(139,92,246,0.4)] 
                  hover:brightness-105    hover:scale-105 transition-transform duration-300"
              >
                <Image
                  src={src}
                  alt={`StudyMate AI feature ${index + 1}`}
                  width={560}
                  height={460}
                  className="absolute inset-0 w-full h-full object-cover"

                />
                {/* Subtle color overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/0 via-violet-900/0 to-pink-900/0 
      group-hover:via-violet-900/20 group-hover:to-pink-900/10 transition-all duration-500 pointer-events-none" />
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: "Purpose and Goals",
      content: (
        <div>
          <p className="text-[#F0F0F0] text-sm md:text-base font-medium leading-relaxed mb-8 tracking-wide">
            StudyMate AI was founded by educators and technologists to revolutionize learning through cutting-edge AI, making education{' '}
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent font-bold">
              more accessible and personalized
            </span>.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Image
              src="https://assets.aceternity.com/pro/hero-sections.png"
              alt="hero template"
              width={500}
              height={500}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]   hover:shadow-[0_0_28px_rgba(139,92,246,0.4)] 
                  hover:brightness-105    hover:scale-105 transition-transform duration-300"
            />
            <Image
              src="https://assets.aceternity.com/features-section.png"
              alt="feature template"
              width={500}
              height={500}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]   hover:shadow-[0_0_28px_rgba(139,92,246,0.4)] 
                  hover:brightness-105    hover:scale-105 transition-transform duration-300"
            />
            <Image
              src="https://assets.aceternity.com/pro/bento-grids.png"
              alt="bento template"
              width={500}
              height={500}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]   hover:shadow-[0_0_28px_rgba(139,92,246,0.4)] 
                  hover:brightness-105    hover:scale-105 transition-transform duration-300"
            />
            <Image
              src="/T2-4.png"
              alt="cards template"
              width={500}
              height={500}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]   hover:shadow-[0_0_28px_rgba(139,92,246,0.4)] 
                  hover:brightness-105  hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Features to Use",
      content: (
        <>

          <div className="grid grid-cols-2 gap-4 relative">
            {/* Floating Sparkles Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute animate-float"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    width: `${Math.random() * 10 + 2}px`,
                    height: `${Math.random() * 10 + 2}px`,
                    background: `hsl(${Math.random() * 360}, 80%, 60%)`,
                    opacity: 0.7,
                    borderRadius: '50%',
                    filter: 'blur(1px)',
                    animationDelay: `${Math.random() * 5}s`,
                    animationDuration: `${Math.random() * 10 + 5}s`
                  }}
                />
              ))}
            </div>

            {/* Mind Maps Card */}
            <div className="relative aspect-[560/460] overflow-hidden rounded-lg bg-gradient-to-br from-purple-900/30 to-indigo-900/20 border border-white/10 p-6 shadow-lg hover:shadow-[0_0_28px_rgba(167,139,250,0.6)] hover:border-purple-400/50 hover:scale-[1.02] transition-all duration-300 group z-10">
              <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
              <div className="flex flex-col h-full relative">
                <div className="flex-1">
                  <div className="w-10 h-10 mb-4 rounded-lg bg-gradient-to-r from-purple-500 to-fuchsia-500 flex items-center justify-center transition-all duration-300 group-hover:rotate-12">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-white mb-2">AI Mind Maps</h3>
                  <p className="text-gray-300 text-sm md:text-base">
                    Watch as AI transforms your scattered thoughts into beautiful, organized mind maps that reveal hidden connections.
                  </p>
                </div>
                <div className="mt-4">
                  <div className="text-xs text-purple-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    ✨ AI Magic: Automatically color-codes related concepts
                  </div>
                </div>
              </div>
              {/* Animated Sparkle Burst */}
              <div className="absolute -right-2 -top-2 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-purple-500 rounded-full blur-md animate-ping"></div>
                <div className="absolute inset-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
              </div>
            </div>

            {/* Smart Summaries Card */}
            <div className="relative aspect-[560/460] overflow-hidden rounded-lg bg-gradient-to-br from-blue-900/30 to-cyan-900/20 border border-white/10 p-6 shadow-lg hover:shadow-[0_0_28px_rgba(103,232,249,0.5)] hover:border-cyan-400/50 hover:scale-[1.02] transition-all duration-300 group z-10">
              <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
              <div className="flex flex-col h-full">
                <div className="flex-1">
                  <div className="w-10 h-10 mb-4 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center transition-all duration-300 group-hover:-rotate-12">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-white mb-2">Smart Summaries</h3>
                  <p className="text-gray-300 text-sm md:text-base">
                    AI that reads between the lines to extract key insights, preserving nuance while reducing reading time by 80%.
                  </p>
                </div>
                <div className="mt-4">
                  <div className="text-xs text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    ✨ AI Magic: Highlights controversial points and knowledge gaps
                  </div>
                </div>
              </div>
              {/* Floating Binary Code Animation */}
              <div className="absolute bottom-2 right-2 text-[8px] text-cyan-400/30 font-mono opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                {Array(5).fill(0).map((_, i) => (
                  <div key={i} className="animate-float" style={{ animationDelay: `${i * 0.2}s` }}>
                    {Math.random().toString(2).substring(2, 10)}
                  </div>
                ))}
              </div>
            </div>

            {/* Study Chat Card */}
            <div className="relative aspect-[560/460] overflow-hidden rounded-lg bg-gradient-to-br from-emerald-900/30 to-teal-900/20 border border-white/10 p-6 shadow-lg hover:shadow-[0_0_28px_rgba(74,222,128,0.5)] hover:border-emerald-400/50 hover:scale-[1.02] transition-all duration-300 group z-10">
              <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
              <div className="flex flex-col h-full">
                <div className="flex-1">
                  <div className="w-10 h-10 mb-4 rounded-lg bg-gradient-to-r from-emerald-400 to-teal-500 flex items-center justify-center transition-all duration-300 group-hover:rotate-12">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-white mb-2">Study Chat</h3>
                  <p className="text-gray-300 text-sm md:text-base">
                    Your 24/7 AI tutor that adapts explanations to your learning style with perfect memory of past conversations.
                  </p>
                </div>
                <div className="mt-4">
                  <div className="text-xs text-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    ✨ AI Magic: Detects confusion and rephrases automatically
                  </div>
                </div>
              </div>
              {/* Pulsing AI Waves */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400/0 via-emerald-400/50 to-emerald-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-emerald-400 rounded-full animate-pulse-scale origin-center"></div>
              </div>
            </div>

            {/* Smart Notes Card */}
            <div className="relative aspect-[560/460] overflow-hidden rounded-lg bg-gradient-to-br from-pink-900/30 to-rose-900/20 border border-white/10 p-6 shadow-lg hover:shadow-[0_0_28px_rgba(244,114,182,0.5)] hover:border-pink-400/50 hover:scale-[1.02] transition-all duration-300 group z-10">
              <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
              <div className="flex flex-col h-full">
                <div className="flex-1">
                  <div className="w-10 h-10 mb-4 rounded-lg bg-gradient-to-r from-pink-400 to-rose-500 flex items-center justify-center transition-all duration-300 group-hover:-rotate-12">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-white mb-2">Smart Notes</h3>
                  <p className="text-gray-300 text-sm md:text-base">
                    AI that doesn&apos;t just record but enhances your notes - fixing errors, adding references, and predicting what comes next.
                  </p>

                </div>
                <div className="mt-4">
                  <div className="text-xs text-pink-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    ✨ AI Magic: Auto-generates flashcards from your notes
                  </div>
                </div>
              </div>
              {/* Floating Hearts Animation */}
              <div className="absolute top-4 right-4 text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                {['❤️', '🧠', '✨', '🤖'].map((emoji, i) => (
                  <div
                    key={i}
                    className="absolute animate-float"
                    style={{
                      right: 0,
                      animationDelay: `${i * 0.3}s`,
                      animationDuration: `${Math.random() * 3 + 3}s`
                    }}
                  >
                    {emoji}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <style jsx>{`
  @keyframes float {
    0% { transform: translateY(0) rotate(0deg); opacity: 1; }
    100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
  }
  @keyframes pulse-scale {
    0% { transform: scaleX(0.1); opacity: 1; }
    100% { transform: scaleX(1); opacity: 0; }
  }
  .animate-float {
    animation: float 5s linear infinite;
  }
  .animate-pulse-scale {
    animation: pulse-scale 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
`}</style>


        </>
      ),
    },
  ];
  return (  
      <Timeline data={data} />
  );
}
