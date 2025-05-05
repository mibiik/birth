import CakeGame from "@/components/cake-game"
import Link from "next/link"

export default function CakeGamePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-4 bg-gradient-to-b from-pink-100 to-purple-100">
      <div className="w-full max-w-4xl">
        <Link href="/" className="inline-block mb-6 text-pink-600 hover:text-pink-800 transition-colors">
          ← Ana Sayfaya Dön
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold text-center text-pink-600 mb-8">Pasta Yapma Oyunu</h1>
        <CakeGame />
      </div>
    </main>
  )
}
