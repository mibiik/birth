"use client"

import { useState } from "react"
import confetti from "canvas-confetti"

interface BirthdayEnvelopeProps {
  message: string
}

export default function BirthdayEnvelope({ message }: BirthdayEnvelopeProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleEnvelopeClick = () => {
    // Zarfın durumunu tersine çevir (toggle)
    setIsOpen(!isOpen)

    // Eğer zarf kapalıysa ve şimdi açılıyorsa konfeti efekti göster
    if (!isOpen) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })
    }
  }

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className={`envelope ${isOpen ? "open" : ""} cursor-pointer mx-auto mb-4`} onClick={handleEnvelopeClick}>
        <div className="envelope-flap"></div>
        <div className="envelope-content">
          <p className="text-pink-600 font-medium text-lg">{message}</p>
        </div>
      </div>

      <p className="text-sm text-gray-500 italic">
        {isOpen ? "Zarfı kapatmak için tekrar tıkla" : "Zarfa tıkla ve mesajı oku!"}
      </p>
    </div>
  )
}
