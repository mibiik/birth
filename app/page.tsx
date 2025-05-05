import { Suspense } from "react"
import CountdownPage from "@/components/countdown-page"
import BirthdayContent from "@/components/birthday-content"
import Loading from "./loading"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-pink-100 to-purple-100">
      <Suspense fallback={<Loading />}>
        <CountdownPage />
        <BirthdayContent />
      </Suspense>
    </main>
  )
}
