import { Loader2 } from "lucide-react"

export default function Loader() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <Loader2 className="w-16 h-16 mx-auto animate-spin text-primary" />
        <p className="mt-4 text-lg font-medium text-gray-600">Loading...</p>
      </div>
    </div>
  )
}