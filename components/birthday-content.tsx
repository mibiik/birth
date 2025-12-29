"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import BirthdayEnvelope from "./birthday-envelope"
import BirthdayWishForm from "./birthday-wish-form"

export default function BirthdayContent() {
  const [isVisible, setIsVisible] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    // İstemci tarafında olduğumuzu işaretle
    setIsClient(true)

    // Event listener ekle
    const handleContentVisibilityChange = (event: Event) => {
      const customEvent = event as CustomEvent
      setIsVisible(customEvent.detail.visible)
    }

    window.addEventListener("contentVisibilityChange", handleContentVisibilityChange)

    return () => {
      window.removeEventListener("contentVisibilityChange", handleContentVisibilityChange)
    }
  }, [])

  // İstemci tarafında değilsek veya görünür değilse, hiçbir şey gösterme
  if (!isClient || !isVisible) {
    return null
  }

  return (
    <div className="w-full max-w-4xl mx-auto text-center animate-fadeIn">
      <h1 className="text-3xl md:text-4xl font-bold text-pink-600 mb-6">Doğum Günün Kutlu Olsun Defne!</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="flex flex-col items-center">
          <BirthdayEnvelope message="İYİ Kİ DOĞDUUUUUUUUUUUUN PRENSESS" />
        </div>

        <div className="flex flex-col space-y-4">
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-pink-200 shadow-lg">
            <h2 className="text-xl font-semibold text-pink-600 mb-4"></h2>
            <p className="text-gray-700 whitespace-pre-line">
              Defneee, 21. yaşın kutlu olsunnnn! Hadi yine iyisin bana yaklaştın. Ama senden büyüğüm hala bence, neysee, iyi ki senle tanışmışızz. Sağlıklı ve doya doya güldüğün yıllara... Kendinine iyi bak. Seviliyosun - Miraç
            </p>
          </Card>

          <BirthdayWishForm />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Link href="/quiz" className="block">
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-pink-200 shadow-lg hover:shadow-xl transition-shadow">
            <h2 className="text-xl font-semibold text-pink-600 mb-2">Defne Quiz</h2>
            <p className="text-gray-600">Kendini tanıyor musun???? ahahah sorular yapay zekadan cevaplar da öyle bakalım doğru mu:), </p>
            <Button className="mt-4 w-full">Quize Başla</Button>
          </Card>
        </Link>

        <Link href="/cake-game" className="block">
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-pink-200 shadow-lg hover:shadow-xl transition-shadow">
            <h2 className="text-xl font-semibold text-pink-600 mb-2">Pasta Yapma Oyunu</h2>
            <p className="text-gray-600">Doğum günü pastanı tasarla bir de süslee la</p>
            <Button className="mt-4 w-full">Oyuna Başla</Button>
          </Card>
        </Link>
      </div>
    </div>
  )
}
