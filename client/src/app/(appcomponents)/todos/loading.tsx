import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#1E1C26] text-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <Skeleton className="h-10 w-48 bg-[#252330] mb-2" />
            <Skeleton className="h-5 w-64 bg-[#252330]" />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Skeleton className="h-10 w-full sm:w-64 bg-[#252330]" />
            <Skeleton className="h-10 w-32 bg-[#252330]" />
            <Skeleton className="h-10 w-32 bg-[#252330]" />
          </div>
        </div>

        <Skeleton className="h-12 w-full max-w-md bg-[#252330] mb-6" />

        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-28 w-full bg-[#252330]" />
          ))}
        </div>
      </div>
    </div>
  )
}
