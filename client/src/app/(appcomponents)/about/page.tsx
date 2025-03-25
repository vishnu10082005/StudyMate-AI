"use client"
import { calsans } from "../../../fonts/calsans"
import Image from "next/image"
import { twMerge } from "tailwind-merge"
import { TracingBeam } from "@/components/ui/tracing-beam"

export default function About() {
  return (
    <TracingBeam className="text-white px-6">
      <div className="max-w-2xl mx-auto antialiased pt-4 relative">
        <div className="mb-10">
          <h2 className="bg-[#1E1C26] text-white rounded-full text-sm w-fit px-4 py-1 mb-4">About</h2>
          <p className={twMerge(calsans.className, "text-3xl font-bold mb-4")}>About StudyMate AI</p>
        </div>

        {studyMateContent.map((item, index) => (
          <div key={`content-${index}`} className="mb-10">
            <h2 className="bg-black text-white rounded-full text-sm w-fit px-4 py-1 mb-4">{item.badge}</h2>

            <p className={twMerge(calsans.className, "text-xl mb-4")}>{item.title}</p>

            <div className="text-sm prose prose-sm dark:prose-invert">
              {item?.image && (
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt="StudyMate AI"
                  height="1000"
                  width="1000"
                  className="rounded-lg mb-10 object-cover"
                />
              )}
              {item.description}
            </div>
          </div>
        ))}

        <div className="mb-10">
          <h2 className="bg-purple-600 text-white rounded-full text-sm w-fit px-4 py-1 mb-4">Call to Action</h2>
          <p className="text-sm prose prose-sm dark:prose-invert">
            Are you ready to transform your learning experience? Join the StudyMate AI community today and discover how
            our AI-powered study assistant can help you learn smarter and faster. Sign up now to unlock the full
            potential of your studies and achieve your academic and career goals effortlessly! 🚀📚
          </p>
          <button className="mt-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium py-2 px-6 rounded-full hover:opacity-90 transition-opacity">
            Get Started
          </button>
        </div>
      </div>
    </TracingBeam>
  )
}

const studyMateContent = [
  {
    title: "Company's Journey",
    description: (
      <p>
        At StudyMate AI, our journey began with a simple yet powerful idea: to revolutionize the way students and
        professionals approach learning. Founded by a group of passionate educators and tech enthusiasts, we recognized
        the challenges faced by learners in today's fast-paced world. With the rapid influx of information and the
        increasing demands on time, we set out to create an AI-powered study assistant that would simplify the learning
        process. Over the years, we have evolved, incorporating feedback from our users and advancements in technology
        to develop a platform that truly meets the needs of modern learners.
      </p>
    ),
    badge: "Journey",
    image: "/placeholder.svg?height=400&width=800",
  },
  {
    title: "Purpose and Goals",
    description: (
      <p>
        Our primary purpose at StudyMate AI is to empower students and professionals to learn smarter and faster. We
        believe that education should be accessible, efficient, and enjoyable. Our goal is to provide innovative tools
        that not only enhance comprehension but also help users save time and stay organized. By automating tedious
        tasks and offering intelligent insights, we aim to create a learning environment where users can focus on what
        truly matters—understanding and retaining knowledge.
      </p>
    ),
    badge: "Mission",
    image: "/placeholder.svg?height=400&width=800",
  },
  {
    title: "Introduction to the Team",
    description: (
      <p>
        Behind StudyMate AI is a dedicated team of experts in education, artificial intelligence, and user experience
        design. Our diverse backgrounds allow us to approach challenges from multiple perspectives, ensuring that our
        platform is both effective and user-friendly. We are united by a shared passion for learning and a commitment to
        helping others succeed. Each member of our team plays a vital role in the continuous improvement of StudyMate
        AI, working tirelessly to bring you the best study assistant possible.
      </p>
    ),
    badge: "Team",
    image: "/placeholder.svg?height=400&width=800",
  },
  {
    title: "Offerings",
    description: (
      <>
        <p className="mb-4">
          StudyMate AI offers a suite of intelligent tools designed to enhance your learning experience:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>AI-Powered Summarization</strong>: Transform lengthy notes, textbooks, or articles into concise
            summaries, making it easier to grasp essential concepts.
          </li>
          <li>
            <strong>Mind Mapping Tool</strong>: Visually organize ideas and concepts for better understanding and
            recall, helping you connect the dots in your studies.
          </li>
          <li>
            <strong>Smart To-Do Lists</strong>: Receive AI-generated study plans that break down tasks into manageable
            steps, keeping you on track and organized.
          </li>
          <li>
            <strong>Multi-Language Support</strong>: Access study assistance in various languages, providing a
            personalized experience tailored to your needs.
          </li>
          <li>
            <strong>Topic-Wise Insights</strong>: Our AI analyzes content and delivers key takeaways, speeding up your
            learning process and enhancing retention.
          </li>
        </ul>
      </>
    ),
    badge: "Features",
    image: "/placeholder.svg?height=400&width=800",
  },
  {
    title: "Customer Opinions",
    description: (
      <p>
        We take pride in the positive feedback we receive from our users. Students and professionals alike have shared
        their success stories, highlighting how StudyMate AI has transformed their study habits and boosted their
        productivity. Many have expressed appreciation for the platform's intuitive design and the significant time
        savings it offers. Our users often tell us that they feel more confident and prepared for their academic and
        career challenges, thanks to the support of StudyMate AI.
      </p>
    ),
    badge: "Testimonials",
    image: "/placeholder.svg?height=400&width=800",
  },
  {
    title: "Achievements",
    description: (
      <p>
        Since our inception, StudyMate AI has achieved significant milestones that reflect our commitment to excellence.
        We have garnered a growing community of users, received accolades from educational institutions, and established
        partnerships with organizations dedicated to enhancing learning experiences. Our platform has been recognized
        for its innovative approach to education technology, and we continue to strive for excellence in every aspect of
        our service.
      </p>
    ),
    badge: "Success",
    image: "/placeholder.svg?height=400&width=800",
  },
]

