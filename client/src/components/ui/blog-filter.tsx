"use client"

import { useState } from "react"
import { Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"

export default function BlogFilter() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("newest")

  const categories = ["Technology", "AI", "Web Development", "Database", "Design", "Career", "Tutorial", "News"]

  const handleCategoryChange = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category))
    } else {
      setSelectedCategories([...selectedCategories, category])
    }
  }

  return (
    <Card className="bg-[#252330] border-[#323042] mb-6">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-white">Filter Posts</h3>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-3">Categories</h4>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category} className="flex items-center">
                  <Checkbox
                    id={`category-${category}`}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => handleCategoryChange(category)}
                    className="border-[#323042] data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                  />
                  <Label htmlFor={`category-${category}`} className="ml-2 text-sm text-gray-300">
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-3">Sort By</h4>
            <RadioGroup value={sortBy} onValueChange={setSortBy} className="space-y-2">
              <div className="flex items-center">
                <RadioGroupItem value="newest" id="sort-newest" className="border-[#323042] text-purple-600" />
                <Label htmlFor="sort-newest" className="ml-2 text-sm text-gray-300">
                  Newest First
                </Label>
              </div>
              <div className="flex items-center">
                <RadioGroupItem value="oldest" id="sort-oldest" className="border-[#323042] text-purple-600" />
                <Label htmlFor="sort-oldest" className="ml-2 text-sm text-gray-300">
                  Oldest First
                </Label>
              </div>
              <div className="flex items-center">
                <RadioGroupItem value="popular" id="sort-popular" className="border-[#323042] text-purple-600" />
                <Label htmlFor="sort-popular" className="ml-2 text-sm text-gray-300">
                  Most Popular
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-3">Date Range</h4>
            <div className="space-y-2">
              <div className="flex items-center">
                <Checkbox
                  id="date-week"
                  className="border-[#323042] data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                />
                <Label htmlFor="date-week" className="ml-2 text-sm text-gray-300">
                  Last Week
                </Label>
              </div>
              <div className="flex items-center">
                <Checkbox
                  id="date-month"
                  className="border-[#323042] data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                />
                <Label htmlFor="date-month" className="ml-2 text-sm text-gray-300">
                  Last Month
                </Label>
              </div>
              <div className="flex items-center">
                <Checkbox
                  id="date-year"
                  className="border-[#323042] data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                />
                <Label htmlFor="date-year" className="ml-2 text-sm text-gray-300">
                  Last Year
                </Label>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-6 bg-[#323042]" />

        <div className="flex justify-end gap-3">
          <Button variant="outline" className="border-[#323042] text-gray-300 hover:bg-[#2A2838]">
            Reset Filters
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">
            <Check className="mr-2 h-4 w-4" />
            Apply Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

