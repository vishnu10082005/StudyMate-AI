"use client";
import { calsans } from "../../../fonts/calsans";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import { TracingBeam } from "@/components/ui/tracing-beam";
import VideoComponent from "@/components/ui/Video";
import { Sparkles } from "lucide-react";

export default function About() {
  return (
    <TracingBeam className="px-6">
      <div className="max-w-2xl mx-auto antialiased pt-4 relative">
        {studyMateContent.map((item, index) => (
          <div key={`content-${index}`} className="mb-10">
            <h2 className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm w-fit px-4 py-2 mb-4 flex items-center justify-center">
              {item.title} <Sparkles className="ml-2 h-4 w-4 text-white" />
            </h2>
            <div className="text-sm prose prose-sm dark:prose-invert text-white">
              {item.video ? (
                <VideoComponent videoSrc={item.video} />
              ) : item.image ? (
                <Image
                  src={item.image}
                  alt={item.title}
                  height={400}
                  width={800}
                  className="rounded-lg mb-10 object-cover"
                />
              ) : null}

              <p className="text-base font-semibold">{item.description}</p>
            </div>
          </div>
        ))}
        <div className="mb-10">
          <h2 className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm w-fit px-4 py-2 mb-4">
            Call to Action
          </h2>
          <p className="text-sm prose prose-sm dark:prose-invert text-white">
            Are you ready to transform your learning experience? Join the StudyMate AI community today and discover how
            our AI-powered study assistant can help you learn smarter and faster. Sign up now to unlock the full
            potential of your studies and achieve your academic and career goals effortlessly! 🚀📚
          </p>
          <button className="mt-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium py-2 px-6 rounded-full hover:opacity-90 transition-opacity">
            Get Started <Sparkles className="ml-2 h-4 w-4 text-white" />
          </button>
        </div>
      </div>
    </TracingBeam>
  );
}

const studyMateContent = [
  {
    title: "Company's Journey",
    description:
      "At StudyMate AI, our journey began with a simple yet powerful idea: to make learning more accessible, personalized, and efficient. Founded by a group of passionate educators and technologists, StudyMate AI has grown into a cutting-edge platform that harnesses the power of artificial intelligence to transform the way students and professionals learn.",
    badge: "Journey",
    video: "/Innovation.mp4",
  },
  {
    title: "Purpose and Goals",
    description:
      "Our primary purpose at StudyMate AI is to empower students and professionals with innovative learning tools that enhance understanding, retention, and productivity. We strive to bridge the gap between traditional education and modern technological advancements, ensuring that learners of all backgrounds can achieve their full potential.",
    badge: "Mission",
    image: "/AiChatMan.jpeg",
  },
  {
    title: "Introduction to the Team",
    description:
      "Behind StudyMate AI is a dedicated team of experts in education, artificial intelligence, and software development. Our team is committed to continuous innovation, ensuring that our platform remains at the forefront of the e-learning industry. We believe that education should be engaging, interactive, and tailored to individual learning styles.",
    badge: "Team",
    image: "/TeachersAi.jpeg",
  },
  {
    title: "Offerings",
    description:
      "StudyMate AI offers a suite of powerful tools designed to enhance the learning experience. Our features include AI-powered summarization, smart to-do lists, multi-language support, topic-wise insights, and personalized mind maps. Whether you're preparing for exams, working on projects, or simply looking to expand your knowledge, StudyMate AI has something for you.",
    badge: "Features",
    image: "/Timepass.jpeg",
  },
  {
    title: "Customer Opinions",
    description:
      "We take pride in the positive feedback we receive from our users. From students who have improved their grades to professionals who have upskilled efficiently, StudyMate AI has made a significant impact on countless learning journeys. Our community-driven approach ensures that we continuously evolve based on real user needs and experiences.",
    badge: "Testimonials",
    image: "/Reviews.png",
  },
  {
    title: "Achievements",
    description:
      "Since our inception, StudyMate AI has achieved significant milestones that reflect our commitment to excellence. We've been recognized for our contributions to e-learning, secured partnerships with educational institutions, and expanded our reach globally. Our achievements are a testament to the effectiveness of our AI-driven approach to learning.",
    badge: "Success",
    image: "/placeholder.svg?height=400&width=800",
  },
];
