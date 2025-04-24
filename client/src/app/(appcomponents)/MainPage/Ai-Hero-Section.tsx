import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FlipWords } from "@/components/ui/flip-words";
import { useRouter } from "next/navigation";
export default function AIHeroSection() {
    const words = ["Smarter", "Faster", "Effortlessly","Easily"];
    const router = useRouter();
    return (
        <div className="text-white py-16 md:py-24 px-4 flex flex-col items-center justify-center text-center">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4">
                    Unlock AI-Powered Learning to Simplify Your{" "}
                    <span className="text-white">
                        Study
                    </span>{" "}
                    <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text ">
                        <FlipWords words={words} duration={2000} className="text-3xl" />
                    </span>
                </h1>

                <p className="text-gray-300 font-semibold text-2xl md:text-2xl mb-8 max-w-5xl mx-auto">
                Your personal AI assistant for summarizing notes, creating mind maps, and organizing tasks—making studying effortless and effective.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button className="p-[3px] relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-lg" />
                        <div className="px-6 py-1 bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent" onClick={()=>router.push("/todos")}>
                            Lets Study
                        </div>
                    </button>

                    <Button className="bg-gradient-to-r bg-gradient-to-r from-indigo-500 to-pink-500 text-white" onClick={()=>{
                        router.push("/producttour")
                    }}>
                        Take Product Tour <Sparkles className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
