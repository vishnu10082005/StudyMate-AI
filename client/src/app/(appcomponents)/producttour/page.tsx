"use client";
import { useRouter } from "next/navigation";
export default function ProductTour() {
    const router = useRouter();
    return <>
        <h1 className="text-white">The Video will be uploaded soon Thank you for your patience! TEAM StudyMate 😊</h1>
        <button className="p-[3px] relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-lg" /><div className="px-6 py-1 bg-black rounded-[6px] cursor-pointer relative group transition duration-200 text-white hover:bg-transparent" onClick={() => router.push("/")}>
            Return To Home
        </div></button>
    </>
}