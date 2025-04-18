"use client";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";

const CheckIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={cn("w-6 h-6 ", className)}
    >
      <path d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  );
};

const CheckFilled = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("w-6 h-6 ", className)}
    >
      <path
        fillRule="evenodd"
        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
        clipRule="evenodd"
      />
    </svg>
  );
};

type LoadingState = {
  text: string;
};

const LoaderCore = ({
  loadingStates,
  value = 0,
}: {
  loadingStates: LoadingState[];
  value?: number;
}) => {
  return (
    <div className="flex relative justify-start max-w-xl mx-auto flex-col mt-40">
      {loadingStates.map((loadingState, index) => {
        const distance = Math.abs(index - value);
        const opacity = Math.max(1 - distance * 0.2, 0);
        const scale = index === value ? 1.05 : 1 - distance * 0.05;

        return (
          <motion.div
            key={index}
            className={cn("text-left flex gap-2 mb-4 items-center")}
            initial={{ opacity: 0, y: -(value * 40) }}
            animate={{ 
              opacity: opacity, 
              y: -(value * 40),
              scale: scale
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <motion.div
              animate={{
                scale: index === value ? [1, 1.2, 1] : 1,
                transition: { duration: 0.5 }
              }}
            >
              {index > value && (
                <CheckIcon className="text-gray-400" />
              )}
              {index <= value && (
                <CheckFilled
                  className={cn(
                    "text-gray-400",
                    value === index && "text-lime-400 opacity-100 drop-shadow-[0_0_8px_rgba(132,204,22,0.5)]"
                  )}
                />
              )}
            </motion.div>
            <motion.span
              className={cn(
                "text-gray-300 font-medium",
                value === index && "text-lime-400 font-semibold opacity-100"
              )}
              animate={{
                x: index === value ? [0, 5, 0] : 0,
                transition: { duration: 0.5 }
              }}
            >
              {loadingState.text}
            </motion.span>
          </motion.div>
        );
      })}
    </div>
  );
};

export const MultiStepLoader = ({
  loadingStates,
  loading,
  duration = 2000,
  loop = true,
}: {
  loadingStates: LoadingState[];
  loading?: boolean;
  duration?: number;
  loop?: boolean;
}) => {
  const [currentState, setCurrentState] = useState(0);

  useEffect(() => {
    if (!loading) {
      setCurrentState(0);
      return;
    }
    const timeout = setTimeout(() => {
      setCurrentState((prevState) =>
        loop
          ? prevState === loadingStates.length - 1
            ? 0
            : prevState + 1
          : Math.min(prevState + 1, loadingStates.length - 1)
      );
    }, duration);

    return () => clearTimeout(timeout);
  }, [currentState, loading, loop, loadingStates.length, duration]);

  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="w-full h-full fixed inset-0 z-[100] flex items-center justify-center bg-[#1E1C26]"
        >
          {/* New improved background elements */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Floating particles with different colors */}
            {[...Array(15)].map((_, i) => {
              const colors = [
                "rgba(101, 163, 13, 0.1)",  // lime-600
                "rgba(124, 58, 237, 0.1)", // violet-600
                "rgba(20, 184, 166, 0.1)",  // teal-500
                "rgba(234, 88, 12, 0.1)",  // orange-600
                "rgba(220, 38, 38, 0.1)",  // red-600
              ];
              const color = colors[i % colors.length];
              
              return (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{ backgroundColor: color }}
                  initial={{
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                    width: Math.random() * 50 + 20,
                    height: Math.random() * 50 + 20,
                    opacity: 0.3
                  }}
                  animate={{
                    x: [null, Math.random() * window.innerWidth],
                    y: [null, Math.random() * window.innerHeight],
                    opacity: [0.3, Math.random() * 0.2 + 0.1]
                  }}
                  transition={{
                    duration: Math.random() * 15 + 10,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                />
              );
            })}

            {/* Subtle grid pattern */}
            <div className="absolute inset-0 opacity-10">
              <svg
                className="w-full h-full"
                xmlns="http://www.w3.org/2000/svg"
              >
                <pattern
                  id="grid-pattern"
                  x="0"
                  y="0"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="1"
                  />
                </pattern>
                <rect width="100%" height="100%" fill="url(#grid-pattern)" />
              </svg>
            </div>
          </div>

          {/* Main loader content */}
          <div className="h-96 relative z-10">
            <LoaderCore value={currentState} loadingStates={loadingStates} />
          </div>

          {/* Gradient overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#1E1C26] to-transparent pointer-events-none" />
          
          {/* Dynamic radial gradient */}
          <motion.div 
            className="absolute inset-0 pointer-events-none"
            animate={{
              background: [
                "radial-gradient(circle at center, transparent 0%, #1E1C26 100%)",
                "radial-gradient(circle at center, rgba(124, 58, 237, 0.05) 0%, #1E1C26 100%)",
                "radial-gradient(circle at center, rgba(20, 184, 166, 0.05) 0%, #1E1C26 100%)",
                "radial-gradient(circle at center, transparent 0%, #1E1C26 100%)"
              ]
            }}
            transition={{
              duration: 8,
              repeat: Infinity
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};