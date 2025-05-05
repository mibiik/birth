"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import confetti from "canvas-confetti"

// Özel event oluşturma
const createContentVisibilityEvent = (visible: boolean) => {
  const event = new CustomEvent("contentVisibilityChange", {
    detail: { visible },
  })
  window.dispatchEvent(event)
}

export default function CountdownPage() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [isCountdownFinished, setIsCountdownFinished] = useState(false)
  const [clickCount, setClickCount] = useState(0)
  const [isContentVisible, setIsContentVisible] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Hedef tarih: 6 Mayıs 2025, saat 00:00
  const targetDate = new Date("2025-05-06T00:00:00").getTime()

  useEffect(() => {
    // İstemci tarafında olduğumuzu işaretle
    setIsClient(true)

    // Sayfa yüklendiğinde localStorage'dan kontrol et
    const storedVisibility = localStorage.getItem("contentVisible")
    if (storedVisibility === "true") {
      setIsContentVisible(true)
      // Event ile diğer bileşenlere bildir
      createContentVisibilityEvent(true)
    }

    const interval = setInterval(() => {
      const now = new Date().getTime()
      const distance = targetDate - now

      if (distance <= 0) {
        clearInterval(interval)
        setIsCountdownFinished(true)
        setIsContentVisible(true)
        localStorage.setItem("contentVisible", "true")
        // Event ile diğer bileşenlere bildir
        createContentVisibilityEvent(true)
        triggerConfetti()
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24))
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((distance % (1000 * 60)) / 1000)

        setTimeLeft({ days, hours, minutes, seconds })
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [targetDate])

  const handleCountdownClick = () => {
    const newClickCount = clickCount + 1
    setClickCount(newClickCount)

    if (newClickCount >= 5) {
      setIsContentVisible(true)
      localStorage.setItem("contentVisible", "true")
      // Event ile diğer bileşenlere bildir
      createContentVisibilityEvent(true)
      triggerConfetti()
    }
  }

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    })
  }

  const resetContent = () => {
    setIsContentVisible(false)
    localStorage.removeItem("contentVisible")
    setClickCount(0)
    // Event ile diğer bileşenlere bildir
    createContentVisibilityEvent(false)
  }

  // İstemci tarafında değilsek, yükleniyor göster
  if (!isClient) {
    return (
      <div className="w-full max-w-md mx-auto text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-pink-600 mb-6"></h1>
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-500"></div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`w-full max-w-md mx-auto text-center transition-opacity duration-500 ${isContentVisible ? "opacity-0 h-0 overflow-hidden" : "opacity-100"}`}
    >
      <h1 className="text-3xl md:text-4xl font-bold text-pink-600 mb-6"></h1>

      <Card className="bg-white/80 backdrop-blur-sm border-pink-200 shadow-lg">
        <CardContent className="p-6" onClick={handleCountdownClick}>
          <h2 className="text-xl font-semibold text-pink-600 mb-4">Doğum Gününe Kalan Süre</h2>

          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="bg-pink-100 p-3 rounded-lg">
              <div className="text-2xl font-bold text-pink-600">{timeLeft.days}</div>
              <div className="text-xs text-pink-500">Gün</div>
            </div>
            <div className="bg-pink-100 p-3 rounded-lg">
              <div className="text-2xl font-bold text-pink-600">{timeLeft.hours}</div>
              <div className="text-xs text-pink-500">Saat</div>
            </div>
            <div className="bg-pink-100 p-3 rounded-lg">
              <div className="text-2xl font-bold text-pink-600">{timeLeft.minutes}</div>
              <div className="text-xs text-pink-500">Dakika</div>
            </div>
            <div className="bg-pink-100 p-3 rounded-lg">
              <div className="text-2xl font-bold text-pink-600">{timeLeft.seconds}</div>
              <div className="text-xs text-pink-500">Saniye</div>
            </div>
          </div>

          <p className="text-sm text-gray-500 italic">
            {clickCount > 0 && clickCount < 5 ? `${5 - clickCount} tıklama daha...` : ""}
          </p>
        </CardContent>
      </Card>

      {isContentVisible && (
        <Button variant="outline" size="sm" className="mt-4 text-xs" onClick={resetContent}>
          Geri Sayımı Göster
        </Button>
      )}
    </div>
  )
}
